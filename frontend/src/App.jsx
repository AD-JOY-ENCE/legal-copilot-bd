import { useEffect, useState } from 'react'
import Dashboard from './Dashboard.jsx'
import LandingPage from './LandingPage.jsx'
import './landing.css'

function currentView() {
  return window.location.hash.startsWith('#/dashboard') ? 'dashboard' : 'home'
}

export default function App() {
  const [view, setView] = useState(currentView)

  useEffect(() => {
    const onHashChange = () => setView(currentView())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return view === 'dashboard' ? (
    <div className="lc-dashboard-shell">
      <div className="lc-dashboard-backbar">
        <a href="#/" aria-label="ল্যান্ডিং পেজে ফিরে যান">← হোমপেজে ফিরে যান</a>
        <span>LEGAL COPILOT BD · WORKSPACE</span>
      </div>
      <Dashboard />
    </div>
  ) : <LandingPage />
}
