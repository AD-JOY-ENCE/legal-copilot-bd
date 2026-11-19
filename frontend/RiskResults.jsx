import { useMemo, useState } from 'react'
import './risk-results.css'

const LEVELS = {
  high: { label: 'উচ্চ', className: 'high' },
  medium: { label: 'মাঝারি', className: 'medium' },
  low: { label: 'নিম্ন', className: 'low' },
}

const CATEGORY_BN = {
  termination: 'চাকরি সমাপ্তি',
  penalty: 'আর্থিক জরিমানা',
  financial_penalty: 'আর্থিক জরিমানা',
  working_hours: 'কর্মঘণ্টা',
  overtime: 'অতিরিক্ত কাজ',
  privacy: 'ব্যক্তিগত তথ্য',
  confidentiality: 'গোপনীয়তা',
  other: 'অন্যান্য',
}

function prettyMode(mode) {
  return mode === 'ollama' ? 'Ollama • Local AI' : mode === 'ai' ? 'OpenAI • AI' : 'Demo • Keyword scan'
}

export default function RiskResults({ data, fileName = 'contract', mode = 'demo' }) {
  const [filter, setFilter] = useState('all')
  const [copied, setCopied] = useState(false)
  const risks = Array.isArray(data?.risks) ? data.risks : []
  const currentMode = data?.mode || mode
  const counts = useMemo(() => ({
    high: risks.filter(r => String(r.severity).toLowerCase() === 'high').length,
    medium: risks.filter(r => String(r.severity).toLowerCase() === 'medium').length,
    low: risks.filter(r => String(r.severity).toLowerCase() === 'low').length,
  }), [risks])
  const visible = risks.filter(r => filter === 'all' || String(r.severity).toLowerCase() === filter)
  const rejected = Number(data?.rejected_evidence_count || 0)
  const hasCitationVerification = data?.citations_verified === true

  function downloadJson() {
    const exportData = {
      exported_at: new Date().toISOString(),
      source_file: fileName,
      note: 'Preliminary AI/keyword review. Not legal advice. Citation verification status is shown in report.',
      ...data,
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 70) || 'legal-copilot'}-risk-review.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function copyReview() {
    const text = [
      `Legal Copilot BD — Preliminary Risk Review`,
      `Document: ${fileName}`,
      `Mode: ${prettyMode(currentMode)}`,
      `Citations verified: ${hasCitationVerification ? 'Reported yes; independent review still needed' : 'NO'}`,
      ...risks.map((r, i) => `\n${i + 1}. ${r.title} [${r.severity}] — ${r.clause_id || 'No clause ID'}\nEvidence: ${r.evidence}\nAI explanation (unverified): ${r.explanation}\nReview: ${r.suggested_review}`)
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="lcr" aria-label="চুক্তির ঝুঁকি বিশ্লেষণের ফলাফল">
      <div className="lcr-top">
        <div>
          <span className="lcr-eyebrow">ANALYSIS RESULT / বিশ্লেষণের ফলাফল</span>
          <h3>চুক্তির ঝুঁকি পর্যালোচনা</h3>
          <p>AI-এর প্রাথমিক বিশ্লেষণ • আইনজীবীর পর্যালোচনার বিকল্প নয়</p>
        </div>
        <span className="lcr-mode">● {prettyMode(currentMode)}</span>
      </div>

      <div className="lcr-metrics">
        <div className="lcr-metric lcr-metric-primary"><span>মোট শনাক্ত বিষয়</span><strong>{risks.length}</strong><small>Evidence-matched</small></div>
        <div className="lcr-metric"><span>উচ্চ অগ্রাধিকার</span><strong className="lcr-red">{counts.high}</strong><small>Preliminary</small></div>
        <div className="lcr-metric"><span>মাঝারি অগ্রাধিকার</span><strong className="lcr-amber">{counts.medium}</strong><small>Preliminary</small></div>
        <div className="lcr-metric"><span>বাদ পড়া Evidence</span><strong>{rejected}</strong><small>Quote validation</small></div>
      </div>

      <div className="lcr-disclaimer" role="note">
        <span aria-hidden="true">⚠</span>
        <div>
          <strong>আইনি রেফারেন্স যাচাই করা হয়নি</strong>
          <p>{hasCitationVerification ? 'API Citation Verified জানিয়েছে, কিন্তু এই Dashboard স্বাধীনভাবে যাচাই করেনি।' : 'চুক্তির উদ্ধৃতি মিলে গেলেও AI-এর আইনের ধারা, নোটিশের সময়সীমা বা আইনগত সিদ্ধান্ত যাচাইকৃত নয়।'} কোনো সিদ্ধান্তের আগে বাংলাদেশের প্রযোজ্য আইন ও আইনজীবীর মতামত নাও।</p>
        </div>
      </div>

      {data?.rejection_reason_counts && rejected > 0 && (
        <details className="lcr-summary">
          <summary>Evidence বাদ পড়ার কারণ ({rejected}) <span>▾</span></summary>
          <ul style={{ margin: '10px 0', lineHeight: 1.9, paddingLeft: 22 }}>
            {Object.entries(data.rejection_reason_counts).filter(([, count]) => count > 0).map(([reason, count]) => (
              <li key={reason}>{({
                quote_not_found: 'মূল Clause-এর সঙ্গে Quote মেলেনি',
                missing_or_invalid_clause: 'Clause ID ভুল এবং Quote অন্য কোথাও পাওয়া যায়নি',
                ambiguous_clause: 'একই Quote একাধিক Clause-এ আছে',
                short_quote: 'Quote খুব ছোট',
                duplicate: 'একই ঝুঁকি/Quote একাধিকবার এসেছে',
              }[reason] || reason)}: {count}</li>
            ))}
          </ul>
          <small>এটি Quote Matching-এর Debug Information; আইনি সত্যতা যাচাই নয়।</small>
        </details>
      )}

      {data?.summary && (
        <details className="lcr-summary">
          <summary>AI-তৈরি সারসংক্ষেপ (যাচাই করা হয়নি) <span>▾</span></summary>
          <p>{data.summary}</p>
        </details>
      )}

      <div className="lcr-toolbar">
        <div className="lcr-filters" aria-label="Severity অনুযায়ী ফিল্টার">
          {[
            ['all', `সব (${risks.length})`],
            ['high', `উচ্চ (${counts.high})`],
            ['medium', `মাঝারি (${counts.medium})`],
            ['low', `নিম্ন (${counts.low})`],
          ].map(([value, label]) => (
            <button key={value} type="button" className={filter === value ? 'active' : ''} onClick={() => setFilter(value)} aria-pressed={filter === value}>{label}</button>
          ))}
        </div>
        <div className="lcr-actions">
          <button type="button" onClick={copyReview}>{copied ? '✓ কপি হয়েছে' : '⧉ রিপোর্ট কপি'}</button>
          <button type="button" onClick={downloadJson}>↓ JSON ডাউনলোড</button>
        </div>
      </div>

      <div className="lcr-risk-list">
        {visible.length === 0 ? (
          <div className="lcr-empty">{risks.length === 0 ? 'এই বিশ্লেষণে যাচাইকৃত উদ্ধৃতিসহ কোনো ঝুঁকি পাওয়া যায়নি। এতে চুক্তি ঝুঁকিমুক্ত প্রমাণ হয় না।' : 'এই Severity-তে কোনো বিষয় পাওয়া যায়নি। অন্য ফিল্টার বেছে নাও।'}</div>
        ) : visible.map((risk, index) => {
          const severity = String(risk.severity || 'low').toLowerCase()
          const level = LEVELS[severity] || LEVELS.low
          return (
            <article key={`${risk.clause_id || 'clause'}-${risk.category}-${index}`} className={`lcr-risk lcr-${level.className}`}>
              <div className="lcr-risk-heading">
                <div className="lcr-risk-serial">{String(index + 1).padStart(2, '0')}</div>
                <div className="lcr-risk-title">
                  <div className="lcr-category">{CATEGORY_BN[risk.category] || risk.category || 'চুক্তির শর্ত'} <span>• {risk.clause_id || 'Clause ID নেই'}</span></div>
                  <h4>{risk.title || 'সম্ভাব্য ঝুঁকি'}</h4>
                </div>
                <span className={`lcr-severity ${level.className}`}>{level.label} • প্রাথমিক</span>
              </div>
              <div className="lcr-quote-label">চুক্তি থেকে হুবহু উদ্ধৃতি {risk.evidence_verified === true ? '✓ Quote matched' : '• যাচাইয়ের অবস্থা অজানা'}</div>
              <blockquote>{risk.evidence || 'Evidence পাওয়া যায়নি'}</blockquote>
              <div className="lcr-risk-detail">
                <div><b>AI-এর ব্যাখ্যা — যাচাই করা হয়নি</b><p>{risk.explanation || 'ব্যাখ্যা দেওয়া হয়নি'}</p></div>
                <div><b>কী পর্যালোচনা করতে হবে</b><p>{risk.suggested_review || 'আইনজীবীর পর্যালোচনা প্রয়োজন।'}</p></div>
              </div>
            </article>
          )
        })}
      </div>

      <footer className="lcr-footer">
        <span>Evidence matched ≠ Legal claim verified</span>
        <span>Legal Copilot Bangladesh • Research prototype</span>
      </footer>
    </section>
  )
}
