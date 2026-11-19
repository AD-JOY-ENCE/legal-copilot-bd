import { useEffect, useState } from 'react'
import RiskResults from './RiskResults.jsx'

const API_BASE = 'http://127.0.0.1:8000'
const MAX_SIZE = 10 * 1024 * 1024

const futureFeatures = [
  { icon: '⚖️', title: 'Legal Research', description: 'বাংলাদেশের প্রযোজ্য আইন অনুসন্ধান', phase: 'Phase 4' },
  { icon: '📄', title: 'Legal Memorandum', description: 'যাচাইকৃত উৎসসহ PDF রিপোর্ট', phase: 'Phase 5' },
]

function Dashboard() {
  const [serverStatus, setServerStatus] = useState('checking')
  const [selectedFile, setSelectedFile] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [riskLoading, setRiskLoading] = useState(false)
  const [riskData, setRiskData] = useState(null)
  const [riskError, setRiskError] = useState('')
  const [riskMode, setRiskMode] = useState('demo')

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${API_BASE}/api/health`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Backend unavailable')
        return response.json()
      })
      .then((data) => { setServerStatus(data.status === 'ok' ? 'online' : 'offline'); setRiskMode(data.risk_mode || 'demo') })
      .catch((err) => {
        if (err.name !== 'AbortError') setServerStatus('offline')
      })
    return () => controller.abort()
  }, [])

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    setSelectedFile(null)
    setResult(null)
    setRiskData(null)
    setRiskError('')
    setError('')
    if (!file) return

    if (!/\.(pdf|docx)$/i.test(file.name)) {
      setError('শুধু PDF অথবা DOCX ফাইল নির্বাচন করো।')
      event.target.value = ''
      return
    }
    if (file.size > MAX_SIZE) {
      setError('ফাইলের সাইজ 10 MB-এর বেশি হতে পারবে না।')
      event.target.value = ''
      return
    }
    if (file.size === 0) {
      setError('খালি ফাইল আপলোড করা যাবে না।')
      event.target.value = ''
      return
    }
    setSelectedFile(file)
  }

  async function handleUpload(event) {
    event.preventDefault()
    if (!selectedFile || uploading) return
    setUploading(true)
    setError('')
    setResult(null)
    setRiskData(null)
    setRiskError('')

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch(`${API_BASE}/api/documents/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(typeof data.detail === 'string' ? data.detail : 'Document upload failed')
      }
      if (!data.document) throw new Error('Backend থেকে Document Result পাওয়া যায়নি।')
      setResult(data.document)
    } catch (err) {
      setError(err instanceof TypeError
        ? 'Backend-এর সঙ্গে সংযোগ হয়নি। FastAPI Server চলছে কি না দেখো।'
        : err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleRiskAnalysis() {
    if (!result?.extracted_text?.trim() || riskLoading) return
    setRiskLoading(true)
    setRiskData(null)
    setRiskError('')
    try {
      const response = await fetch(`${API_BASE}/api/risks/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: result.extracted_text }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(typeof data.detail === 'string' ? data.detail : 'Risk analysis failed')
      }
      setRiskData(data)
    } catch (err) {
      setRiskError(err instanceof TypeError
        ? 'Backend-এর সঙ্গে সংযোগ হয়নি। Server চালু আছে কি না দেখো।'
        : err.message)
    } finally {
      setRiskLoading(false)
    }
  }

  const online = serverStatus === 'online'

  return (
    <main className="min-h-screen bg-[#f9f8f3] text-[#193d2c] font-['Hind_Siliguri',sans-serif]">
      <header className="border-b border-[#dce6dc] bg-[#f9f8f3]/95">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="text-xl font-bold">⚖️ Legal Copilot <span className="text-[#45875d]">BD</span></div>
          <span className="rounded-full border border-[#cdddcf] px-3 py-1 text-sm text-[#405d4c]">Prototype • Phase 3</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#45875d]">Bangladesh • Legal AI Platform</p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">Legal Document Analyzer</h1>
        <p className="mb-8 max-w-2xl text-[#6d8373]">PDF অথবা DOCX আপলোড করো, Text Extract করো, তারপর সম্ভাব্য Contract Risk Review করো।</p>

        <section className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dce6dc] bg-white p-5 shadow-[0_12px_35px_rgba(21,64,40,0.05)]">
          <div>
            <h2 className="font-semibold">Backend API Connection</h2>
            <p className="mt-1 text-sm text-[#6d8373]">FastAPI • {API_BASE}/api/health</p>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-semibold ${online ? 'bg-[#e1f2e5] text-[#1c8052]' : 'bg-[#fff3dc] text-[#a26b19]'}`}>
            {serverStatus === 'checking' ? '⏳ Checking...' : online ? '● Connected' : '● Disconnected'}
          </span>
        </section>

        <section className="rounded-2xl border border-[#dce6dc] bg-white p-6 shadow-[0_12px_35px_rgba(21,64,40,0.05)]">
          <h2 className="mb-2 text-2xl font-semibold">📁 Document Upload</h2>
          <p className="mb-6 text-sm text-[#6d8373]">PDF / DOCX • Maximum 10 MB • শুধু Sample Document ব্যবহার করো</p>
          <form onSubmit={handleUpload}>
            <label htmlFor="document-file" className="mb-3 block text-sm font-medium text-[#284b39]">Choose a document</label>
            <input
              id="document-file"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              disabled={uploading}
              className="block w-full cursor-pointer rounded-xl border border-[#cdddcf] bg-[#f9f8f3] p-3 text-sm text-[#405d4c] file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#174635] file:px-4 file:py-2 file:font-semibold file:text-white"
            />
            {selectedFile && (
              <p className="mt-3 break-all text-sm text-[#2a7250]">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
            <button
              type="submit"
              disabled={!selectedFile || uploading || !online}
              className="mt-5 rounded-xl bg-[#174635] px-6 py-3 font-bold text-white transition hover:bg-[#286149] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? '⏳ Uploading & Processing...' : '⬆️ Upload & Analyze'}
            </button>
          </form>
          {error && <p role="alert" className="mt-5 rounded-xl border border-[#e8bcb5] bg-[#fff1ef] p-4 text-sm text-[#a43d37]">⚠️ {error}</p>}
        </section>

        {result && (
          <section className="mt-8 rounded-2xl border border-[#a2cbb0] bg-white p-6">
            <p className="mb-3 font-semibold text-[#1c8052]">✅ Document processed successfully!</p>
            <h2 className="mb-5 break-all text-lg font-semibold">{result.filename}</h2>
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ['File Type', (result.file_type || 'unknown').toUpperCase()],
                ['Pages', result.page_count ?? 'N/A'],
                ['Words', result.word_count ?? 0],
                ['Characters', result.character_count ?? 0],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[#dce6dc] bg-[#f9f8f3] p-4">
                  <div className="text-xs text-[#6d8373]">{label}</div>
                  <div className="mt-2 text-2xl font-bold">{value}</div>
                </div>
              ))}
            </div>
            <h3 className="mb-3 text-lg font-semibold">Extracted Document Text</h3>
            <div className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-[#cdddcf] bg-[#f9f8f3] p-4 text-sm leading-7 text-[#405d4c]">
              {result.extracted_text?.trim() || 'এই Document-এ Extract করার মতো Text পাওয়া যায়নি। Scanned PDF হলে OCR লাগতে পারে।'}
            </div>
            <div className="mt-6 rounded-xl border border-[#c2d9c6] bg-[#f0f5ec] p-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold">🛡️ Contract Risk Review</h3>
                <span className="rounded-full bg-[#e8f0e8] px-3 py-1 text-xs text-[#405d4c]">
                  Mode: {riskMode === 'ollama' ? 'Local Ollama AI preliminary review' : riskMode === 'ai' ? 'OpenAI preliminary review' : 'Demo keyword scan'}
                </span>
              </div>
              <p className="mb-4 text-sm text-[#6d8373]">এটি প্রাথমিক issue spotting। আইনের ধারা বা Citation এখনো যাচাই করা হয়নি। শুধু কাল্পনিক Sample Contract ব্যবহার করো।</p>
              {result.extracted_text?.trim() ? (
                <button type="button" onClick={handleRiskAnalysis} disabled={riskLoading || !online}
                  className="rounded-xl bg-[#174635] px-5 py-3 font-semibold text-white hover:bg-[#286149] disabled:cursor-not-allowed disabled:opacity-50">
                  {riskLoading ? '⏳ Checking clauses...' : '🔎 Analyze Contract Risks'}
                </button>
              ) : <p className="text-[#a26b19]">Text পাওয়া যায়নি; Scanned PDF-এর জন্য OCR প্রয়োজন।</p>}
              {result.extracted_text?.length > 40000 && <p className="mt-3 text-[#a26b19]">Document 40,000 characters-এর বেশি। এই Prototype-এ পুরো Contract বিশ্লেষণের জন্য Chunking পরবর্তী ধাপে প্রয়োজন।</p>}
              {riskError && <p role="alert" className="mt-4 rounded-lg border border-[#e8bcb5] bg-[#fff1ef] p-3 text-sm text-[#a43d37]">⚠️ {riskError}</p>}
              {riskData && (
                <div className="mt-6">
                  <RiskResults data={riskData} fileName={result.filename} mode={riskMode} />
                </div>
              )}
            </div>
          </section>
        )}

        <h2 className="mb-5 mt-10 text-2xl font-semibold">Coming Next</h2>
        <section className="grid gap-4 sm:grid-cols-3">
          {futureFeatures.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-[#dce6dc] bg-white p-5 shadow-[0_12px_35px_rgba(21,64,40,0.05)]">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-2xl">{feature.icon}</span>
                <span className="rounded-md bg-[#e8f0e8] px-2 py-1 text-xs text-[#6d8373]">{feature.phase}</span>
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-[#6d8373]">{feature.description}</p>
            </article>
          ))}
        </section>
        <p className="mt-10 border-t border-[#dce6dc] pt-6 text-sm text-[#849788]">Prototype only. Risk review is not legal advice; legal citations are not verified. Never test with confidential client documents.</p>
      </div>
    </main>
  )
}

export default Dashboard
