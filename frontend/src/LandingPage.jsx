import { useState } from 'react'

const icons = {
  arrow: '↗', right: '→', check: '✓', document: '▤', shield: '◈', research: '⌕', memo: '≡', chevron: '⌄', sparkle: '✦', scale: '⚖'
}

const features = [
  {num:'01', icon:icons.document, title:'স্মার্ট ডকুমেন্ট বিশ্লেষণ', body:'PDF ও DOCX আপলোড করে গুরুত্বপূর্ণ লেখা, শর্ত ও প্রাসঙ্গিক অংশ এক জায়গায় দেখুন।', tag:'এখন উপলব্ধ'},
  {num:'02', icon:icons.shield, title:'সম্ভাব্য ঝুঁকি শনাক্তকরণ', body:'চুক্তির শর্ত অনুযায়ী রিভিউয়ের প্রয়োজন হতে পারে এমন বিষয় ও মূল ডকুমেন্টের উদ্ধৃতি দেখুন।', tag:'প্রোটোটাইপ'},
  {num:'03', icon:icons.research, title:'বাংলাদেশের আইন গবেষণা', body:'বিশ্বস্ত উৎস থেকে প্রযোজ্য আইন ও বিধি খুঁজে রেফারেন্স যাচাই করার পরিকল্পিত ব্যবস্থা।', tag:'শিগগিরই'},
  {num:'04', icon:icons.memo, title:'লিগ্যাল মেমোরেন্ডাম', body:'ঝুঁকি, বিশ্লেষণ ও যাচাইকৃত রেফারেন্সসহ পর্যালোচনাযোগ্য রিপোর্ট তৈরির লক্ষ্য।', tag:'শিগগিরই'},
]

const steps = [
  {n:'01', title:'ডকুমেন্ট আপলোড', body:'আপনার নমুনা PDF বা DOCX ফাইল নির্বাচন করুন।'},
  {n:'02', title:'AI দিয়ে প্রাথমিক রিভিউ', body:'ডকুমেন্টের ধারা ও সম্ভাব্য ঝুঁকির ইঙ্গিত দেখুন।'},
  {n:'03', title:'প্রমাণসহ ফলাফল', body:'মূল চুক্তির অংশ ও পর্যালোচনার পরামর্শ দেখুন।'},
]

function Brand({ light=false }) {
  return <a href="#/" className={'lc-brand' + (light ? ' lc-brand-light':'')} aria-label="Legal Copilot বাংলাদেশ হোমপেজ"><span className="lc-brand-mark">⚖</span><span>legal<span className="lc-brand-mid">copilot</span><b>.bd</b></span></a>
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  return <div className="lc-site" lang="bn">
    <div className="lc-announcement"><span className="lc-announcement-dot"/> বাংলাদেশের আইনি কাজের জন্য একটি নতুন AI অভিজ্ঞতা <a href="#features">ফিচার দেখুন <span aria-hidden="true">↗</span></a></div>
    <header className="lc-header">
      <div className="lc-container lc-nav">
        <Brand/>
        <button className="lc-menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="lc-nav-links" aria-label="মেনু খুলুন">{menuOpen ? '✕' : '☰'}</button>
        <nav id="lc-nav-links" className={'lc-nav-links' + (menuOpen ? ' lc-nav-open' : '')} aria-label="প্রধান নেভিগেশন">
          <a href="#features" onClick={()=>setMenuOpen(false)}>ফিচারসমূহ</a>
          <a href="#workflow" onClick={()=>setMenuOpen(false)}>যেভাবে কাজ করে</a>
          <a href="#about" onClick={()=>setMenuOpen(false)}>আমাদের লক্ষ্য</a>
          <a className="lc-nav-cta" href="#/dashboard" onClick={()=>setMenuOpen(false)}>ড্যাশবোর্ড খুলুন <span>↗</span></a>
        </nav>
      </div>
    </header>

    <main>
      <section className="lc-hero" id="top">
        <div className="lc-hero-glow" aria-hidden="true"/>
        <div className="lc-container lc-hero-layout">
          <div className="lc-hero-copy">
            <div className="lc-eyebrow"><span className="lc-pill-dot"/> BANGLADESH · LEGAL AI PLATFORM <span className="lc-eyebrow-line"/></div>
            <h1>আইনি কাজের<br/>নতুন <span>বুদ্ধিমান</span><br/>সহযাত্রী।</h1>
            <p className="lc-hero-lede">জটিল চুক্তিপত্র বুঝুন সহজে। গুরুত্বপূর্ণ ধারা খুঁজুন, সম্ভাব্য ঝুঁকি শনাক্ত করুন এবং আইনি রিভিউয়ের জন্য আরও ভালোভাবে প্রস্তুত হোন।</p>
            <div className="lc-hero-actions">
              <a href="#/dashboard" className="lc-btn lc-btn-primary">শুরু করুন <span aria-hidden="true">↗</span></a>
              <a href="#workflow" className="lc-btn lc-btn-ghost">কীভাবে কাজ করে <span aria-hidden="true">→</span></a>
            </div>
            <div className="lc-hero-proof"><span className="lc-proof-icon">✧</span><span>বাংলা-প্রথম অভিজ্ঞতা</span><i/> <span>নথিভিত্তিক রিভিউ</span><i/><span>প্রাথমিক প্রোটোটাইপ</span></div>
          </div>
          <div className="lc-visual-wrap" aria-label="লিগ্যাল কোপাইলট ডকুমেন্ট রিভিউ ড্যাশবোর্ডের নকশা">
            <div className="lc-orbit lc-orbit-a"/><div className="lc-orbit lc-orbit-b"/>
            <div className="lc-app-preview">
              <div className="lc-preview-top"><div className="lc-preview-dots"><b/><b/><b/></div><span>DOCUMENT REVIEW</span><span className="lc-preview-live"><b/> PROTOTYPE</span></div>
              <div className="lc-preview-body">
                <div className="lc-preview-sidebar"><div className="lc-preview-side-icon">⚖</div><div className="lc-side-active">▦</div><div>▤</div><div>◈</div><div>⌕</div><div className="lc-side-bottom">⚙</div></div>
                <div className="lc-preview-content"><div className="lc-preview-path">ওয়ার্কস্পেস / ডকুমেন্ট রিভিউ</div><div className="lc-preview-title">চুক্তি বিশ্লেষণ <span>↗</span></div><div className="lc-preview-file"><div className="lc-preview-file-icon">PDF</div><div><strong>Employment Agreement</strong><small>নমুনা ডকুমেন্ট · বিশ্লেষণের প্রিভিউ</small></div><span className="lc-file-ok">✓</span></div><div className="lc-preview-minihead">পর্যালোচনার বিষয়</div><div className="lc-risk-row"><span className="lc-risk-symbol">!</span><div><strong>চাকরি সমাপ্তির শর্ত</strong><small>নোটিশ ও শর্তাবলি যাচাই প্রয়োজন</small></div><span className="lc-risk-level">রিভিউ</span></div><div className="lc-risk-row"><span className="lc-risk-symbol">!</span><div><strong>জরিমানা সংক্রান্ত ধারা</strong><small>চুক্তির মূল বাক্য পরীক্ষা প্রয়োজন</small></div><span className="lc-risk-level">রিভিউ</span></div><div className="lc-preview-footer"><span>◉</span> মূল ডকুমেন্টের উদ্ধৃতির সঙ্গে মিলিয়ে দেখুন <span>↗</span></div></div>
              </div>
            </div>
            <div className="lc-floating-note"><span>✦</span><div><b>আইনি বিশ্লেষণ, আরও সহজে</b><small>আপনার ডকুমেন্ট থেকে শুরু</small></div></div>
          </div>
        </div>
        <div className="lc-container lc-hero-bottom"><div className="lc-line"/><span>EXPLORE WHAT'S POSSIBLE</span><span className="lc-down">↓</span></div>
      </section>

      <section id="features" className="lc-features lc-section">
        <div className="lc-container"><div className="lc-section-eyebrow">/ আমাদের প্ল্যাটফর্ম</div><div className="lc-section-heading"><h2>আইনি কাজের জটিলতা কমাতে<br/><em>একটি সমন্বিত প্ল্যাটফর্ম।</em></h2><p>প্রাথমিক ডকুমেন্ট বিশ্লেষণ থেকে ভবিষ্যতের যাচাইকৃত আইনি গবেষণা—সবকিছুর লক্ষ্য একটি সহজ ও কার্যকর অভিজ্ঞতা।</p></div><div className="lc-feature-grid">
          {features.map(item=><article className="lc-feature-card" key={item.num}><div className="lc-feature-head"><span>{item.num} / 04</span><span className="lc-feature-tag">{item.tag}</span></div><div className="lc-feature-icon">{item.icon}</div><h3>{item.title}</h3><p>{item.body}</p><span className="lc-feature-arrow" aria-hidden="true">↗</span></article>)}
        </div></div>
      </section>

      <section id="workflow" className="lc-workflow lc-section"><div className="lc-container lc-workflow-inner"><div className="lc-workflow-intro"><div className="lc-section-eyebrow">/ যেভাবে কাজ করে</div><h2>একটি ডকুমেন্ট।<br/><em>আরও পরিষ্কার ধারণা।</em></h2><p>মাত্র কয়েকটি ধাপে আপনার চুক্তিপত্রের গুরুত্বপূর্ণ বিষয়গুলো রিভিউয়ের জন্য সাজিয়ে নিন।</p><a href="#/dashboard" className="lc-inline-link">ড্যাশবোর্ডে যান <span>↗</span></a></div><div className="lc-step-list">{steps.map(step=><div className="lc-step" key={step.n}><span className="lc-step-number">{step.n}</span><div><h3>{step.title}</h3><p>{step.body}</p></div><span className="lc-step-arrow">↗</span></div>)}</div></div></section>

      <section className="lc-values lc-section" id="about"><div className="lc-container lc-values-grid"><div className="lc-values-art"><div className="lc-art-frame"><div className="lc-art-circle lc-art-one"/><div className="lc-art-circle lc-art-two"/><span className="lc-art-scales">⚖</span><div className="lc-art-caption">TECHNOLOGY × LEGAL REASONING</div></div></div><div className="lc-values-copy"><div className="lc-section-eyebrow">/ আমাদের লক্ষ্য</div><h2>আইনি বোঝাপড়ায়<br/><em>মানুষের পাশে প্রযুক্তি।</em></h2><p>বাংলাদেশের জন্য তৈরি এই প্রোটোটাইপের উদ্দেশ্য আইনজীবী, শিক্ষার্থী ও সাধারণ ব্যবহারকারীদের ডকুমেন্ট বুঝতে এবং প্রয়োজনীয় প্রশ্নগুলো চিহ্নিত করতে সাহায্য করা।</p><div className="lc-values-points"><div><span>✓</span> মূল ডকুমেন্টের উদ্ধৃতি দেখানোর প্রচেষ্টা</div><div><span>✓</span> প্রাথমিক ঝুঁকি ও সিদ্ধান্তের মধ্যে স্পষ্ট পার্থক্য</div><div><span>✓</span> ভবিষ্যতে যাচাইকৃত আইনি উৎসের সংযোগ</div></div></div></div></section>

      <section className="lc-cta-section"><div className="lc-container"><div className="lc-cta-box"><span className="lc-cta-orb"/><div className="lc-section-eyebrow">/ শুরু করা যাক</div><h2>আপনার আইনি ডকুমেন্ট,<br/><em>আরও ভালোভাবে বুঝুন।</em></h2><p>আজই নমুনা ডকুমেন্ট দিয়ে Legal Copilot BD-এর বর্তমান ফিচারগুলো পরীক্ষা করুন।</p><a href="#/dashboard" className="lc-btn lc-btn-primary">ড্যাশবোর্ডে প্রবেশ করুন <span>↗</span></a></div></div></section>
    </main>

    <footer className="lc-footer"><div className="lc-container"><div className="lc-footer-top"><div><Brand light/><p>AI-powered legal document review<br/>বাংলাদেশের জন্য একটি পরীক্ষামূলক উদ্যোগ।</p></div><div className="lc-footer-links"><a href="#features">ফিচারসমূহ</a><a href="#workflow">কীভাবে কাজ করে</a><a href="#/dashboard">ড্যাশবোর্ড</a></div></div><div className="lc-footer-bottom"><span>© {new Date().getFullYear()} Legal Copilot BD. All rights reserved.</span><span>এটি আইনি পরামর্শ নয়। AI-এর ফলাফল আইনজীবীর পর্যালোচনা প্রয়োজন।</span></div></div></footer>
  </div>
}
