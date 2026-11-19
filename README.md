# Legal Copilot Bangladesh — Phase 1

A beginner-friendly React + FastAPI starter. This phase has **no document upload, AI analysis, legal advice, or citation verification yet**.

## Requirements
- Python 3.12 or 3.13
- Node.js compatible with Vite 7 (20.19+ or 22.12+)
- VS Code (optional)

## Backend (Windows PowerShell)
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```
Then open http://127.0.0.1:8000/docs

## Frontend (open a new terminal)
```powershell
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

If using macOS/Linux, use `python3 -m venv .venv`, `.venv/bin/python -m pip install -r requirements.txt`, and `.venv/bin/python -m uvicorn main:app --reload`.

## Safety
Use only synthetic/sample contracts at this stage. Do not upload confidential contracts to an unreviewed system. In later phases, citations should be matched with official sources and manually reviewed.
