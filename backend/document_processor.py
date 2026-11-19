
from io import BytesIO
import pymupdf
from docx import Document


def extract_pdf_text(file_bytes):
    """Extract text and page count from a PDF."""

    with pymupdf.open(
        stream=file_bytes,
        filetype="pdf"
    ) as document:

        pages = []

        for page in document:
            text = page.get_text("text", sort=True)
            pages.append(text)

        full_text = "\n\n".join(pages)
        page_count = len(document)

    return {
        "text": full_text,
        "page_count": page_count
    }


def extract_docx_text(file_bytes):
    """Extract paragraphs and tables from DOCX."""

    document = Document(BytesIO(file_bytes))
    text_parts = []

    for paragraph in document.paragraphs:
        if paragraph.text.strip():
            text_parts.append(paragraph.text)

    for table in document.tables:
        for row in table.rows:
            cells = [
                cell.text.strip()
                for cell in row.cells
            ]

            if any(cells):
                text_parts.append(" | ".join(cells))

    full_text = "\n\n".join(text_parts)

    return {
        "text": full_text,
        "page_count": None
    }


def analyze_document(file_bytes, filename):
    """Choose processor based on file extension."""

    extension = filename.lower().rsplit(".", 1)[-1]

    if extension == "pdf":
        result = extract_pdf_text(file_bytes)

    elif extension == "docx":
        result = extract_docx_text(file_bytes)

    else:
        raise ValueError("Unsupported file type")

    extracted_text = result["text"]

    word_count = len(extracted_text.split())
    character_count = len(extracted_text)

    return {
        "filename": filename,
        "file_type": extension,
        "page_count": result["page_count"],
        "word_count": word_count,
        "character_count": character_count,
        "extracted_text": extracted_text
    }
