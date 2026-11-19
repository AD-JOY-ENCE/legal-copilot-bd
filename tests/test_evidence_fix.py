import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'backend'))
from risk_analyzer import Risk, RiskAssessment, extract_clauses, validate_assessment, analyze_risks


def risk(cid, evidence, category='termination'):
    return Risk(clause_id=cid, category=category, title='Preliminary review',
                severity='medium', evidence=evidence, explanation='Review wording',
                suggested_review='Ask a lawyer')


class EvidenceFixTests(unittest.TestCase):
    def test_pdf_linewrap_maps_to_original(self):
        clauses = extract_clauses('Clause 1 - Termination\nThe employer may terminate\nemployment with seven days notice.')
        report = validate_assessment(RiskAssessment(summary='Test', risks=[
            risk('C001', 'The employer may terminate employment with seven days notice.')
        ]), clauses, 'ollama')
        self.assertEqual(report['risk_count'], 1)
        self.assertIn('terminate\nemployment', report['risks'][0]['evidence'])

    def test_paraphrase_rejected(self):
        clauses = extract_clauses('The employer may terminate employment with seven days notice.')
        out = validate_assessment(RiskAssessment(summary='Test', risks=[
            risk('C001', 'Employer can end the job after one week notice.')
        ]), clauses, 'ollama')
        self.assertEqual(out['risk_count'], 0)
        self.assertEqual(out['rejection_reason_counts']['quote_not_found'], 1)

    def test_unique_wrong_clause_id_repaired(self):
        clauses = extract_clauses('Salary is BDT 65000 monthly.\n\nThe employee must pay a penalty of BDT 100000.')
        out = validate_assessment(RiskAssessment(summary='Test', risks=[
            risk('C001', 'The employee must pay a penalty of BDT 100000.', 'financial_penalty')
        ]), clauses, 'ollama')
        self.assertEqual(out['risk_count'], 1)
        self.assertEqual(out['risks'][0]['clause_id'], 'C002')
        self.assertTrue(out['risks'][0]['clause_id_corrected'])

    def test_ambiguous_clause_rejected(self):
        clauses = extract_clauses('Employee must work overtime without extra payment.\n\nEmployee must work overtime without extra payment.')
        out = validate_assessment(RiskAssessment(summary='Test', risks=[
            risk('C999', 'Employee must work overtime without extra payment.', 'working_hours')
        ]), clauses, 'ollama')
        self.assertEqual(out['risk_count'], 0)
        self.assertEqual(out['rejection_reason_counts']['ambiguous_clause'], 1)

    def test_false_legal_reference_hidden(self):
        clauses = extract_clauses('The employer may terminate with seven days notice.')
        item = risk('C001', 'The employer may terminate with seven days notice.')
        item.explanation = 'Bangladesh Labour Act section 26 requires 14 days notice.'
        out = validate_assessment(RiskAssessment(summary='Test', risks=[item]), clauses, 'ollama')
        self.assertNotIn('14 days', out['risks'][0]['explanation'])
        self.assertFalse(out['citations_verified'])

    def test_heading_split_and_demo_salary(self):
        doc = 'Clause 1 - Salary\nThe employee receives BDT 65000.\nClause 2 - Termination\nThe employer gives seven days notice.'
        clauses = extract_clauses(doc)
        self.assertEqual(len(clauses), 2)
        self.assertEqual(analyze_risks('Salary BDT 65000 per month.', 'demo')['risk_count'], 0)

if __name__ == '__main__':
    unittest.main()
