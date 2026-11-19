import os
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent / ".env", override=True)

from document_processor import analyze_document
from risk_analyzer import analyze_risks
MAX_FILE_SIZE = 10 * 1024 * 1024
MAX_ANALYSIS_CHARS = 40000  # Explicit limit: don't silently truncate legal clauses.

app = FastAPI(title="Legal Copilot Bangladesh API", version="0.3.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173","http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class AnalysisRequest(BaseModel):
    text: str = Field(min_length=1, max_length=MAX_ANALYSIS_CHARS)


@app.get("/")
def home():
    return {"message": "Welcome to Legal Copilot Bangladesh API"}


@app.get("/api/health")
def health_check():
    return {
        "status": "ok", "service": "Legal Copilot Bangladesh", "phase": 3,
        "risk_mode": os.getenv("RISK_MODE", "demo").lower(),
    }


@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    filename = file.filename or ""
    if not filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(400, "Only PDF and DOCX files are allowed")
    try:
        content = await file.read(MAX_FILE_SIZE + 1)
    finally:
        await file.close()
    if not content:
        raise HTTPException(400, "The uploaded file is empty")
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(413, "File size must be 10 MB or less")
    if filename.lower().endswith(".pdf") and not content.startswith(b"%PDF-"):
        raise HTTPException(400, "Invalid PDF file")
    if filename.lower().endswith(".docx") and not content.startswith(b"PK"):
        raise HTTPException(400, "Invalid DOCX file")
    try:
        result = analyze_document(content, filename)
    except Exception:
        raise HTTPException(422, "Cannot extract text from this document")
    return {"status": "success", "message": "Document processed successfully", "document": result}


@app.post("/api/risks/analyze")
def risk_analysis(payload: AnalysisRequest):
    if not payload.text.strip():
        raise HTTPException(400, "Document has no text")
    mode = os.getenv("RISK_MODE", "demo").lower()
    if mode == "ollama" and len(payload.text) > 12000:
        raise HTTPException(413, "Local AI prototype supports up to 12,000 characters per analysis. Use document chunking for longer contracts")
    if mode not in {"demo", "ai", "ollama"}:
        raise HTTPException(500, "Invalid RISK_MODE. Use demo, ai, or ollama")
    if mode == "ai" and not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(503, "OPENAI_API_KEY is not configured on the backend")
    try:
        return analyze_risks(payload.text, mode)
    
      
    
    except Exception as exc:
        import traceback

        print(
            "OLLAMA ERROR TYPE:",
            type(exc).__name__,
            flush=True
        )

        traceback.print_exc()

        raise HTTPException(
            status_code=502,
            detail="Local Ollama analysis failed. Check backend logs"
        ) from exc


