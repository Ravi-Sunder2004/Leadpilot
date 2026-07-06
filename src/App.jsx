import { useState } from 'react'
import './App.css'

const N8N_WEBHOOK_URL = 'http://seolead.duckdns.org/webhook/audit'

function ScoreDial({ score }) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  let color = '#E8A33D'
  if (score >= 80) color = '#5FBF8F'
  else if (score < 50) color = '#D9685C'

  return (
    <div className="score-dial">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#2A3548" strokeWidth="10" />
        <circle
          cx="90" cy="90" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
      </svg>
      <div className="score-dial-label">
        <span className="score-dial-number">{score}</span>
        <span className="score-dial-max">/100</span>
      </div>
    </div>
  )
}

function SeverityBadge({ severity }) {
  return <span className={`severity-badge severity-${severity}`}>{severity}</span>
}

function App() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function runAudit(e) {
    e.preventDefault()
    if (!url.trim()) return

    setStatus('loading')
    setErrorMsg('')
    setResult(null)

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      })

      const data = await res.json()

      if (!data.success) {
        setStatus('error')
        setErrorMsg(data.error || 'Could not complete the diagnostic. Try a different URL.')
        return
      }

      setResult(data)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setErrorMsg('Could not reach the diagnostic service. Check your connection and try again.')
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-mark">
          <span className="mark-dot" />
          GROWTH DIAGNOSTIC
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <p className="eyebrow">Free website growth diagnostic</p>
          <h1 className="headline">
            Find out what's quietly<br />costing you customers.
          </h1>
          <p className="subhead">
            Enter your website. Get a technical SEO read, keyword gaps, and
            automation opportunities &mdash; in under a minute.
          </p>

          <form className="audit-form" onSubmit={runAudit}>
            <span className="input-prefix">https://</span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yourbusiness.com"
              disabled={status === 'loading'}
              className="url-input"
            />
            <button type="submit" disabled={status === 'loading'} className="run-btn">
              {status === 'loading' ? 'Running diagnostic…' : 'Run diagnostic'}
            </button>
          </form>

          {status === 'loading' && (
            <div className="loading-trace">
              <p className="trace-line">→ fetching page</p>
              <p className="trace-line">→ reading structure</p>
              <p className="trace-line">→ generating recommendations</p>
            </div>
          )}

          {status === 'error' && (
            <p className="error-text">{errorMsg}</p>
          )}
        </section>

        {result && (
          <section className="report">
            <div className="report-top">
              <ScoreDial score={result.report.overallScore} />
              <div className="report-top-text">
                <p className="report-url">{result.url}</p>
                <p className="report-label">{result.report.scoreLabel}</p>
                <p className="report-summary">{result.report.businessSummary}</p>
              </div>
            </div>

            <div className="report-block">
              <h2 className="block-title">01 / Technical findings</h2>
              <div className="finding-list">
                {result.report.technicalFindings.map((f, i) => (
                  <div className="finding-row" key={i}>
                    <SeverityBadge severity={f.severity} />
                    <div>
                      <p className="finding-issue">{f.issue}</p>
                      <p className="finding-explanation">{f.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-block">
              <h2 className="block-title">02 / Keyword opportunities</h2>
              <div className="keyword-grid">
                {result.report.keywordOpportunities.map((k, i) => (
                  <div className="keyword-card" key={i}>
                    <p className="keyword-phrase">{k.keyword}</p>
                    <p className="keyword-reason">{k.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-block">
              <h2 className="block-title">03 / Content opportunities</h2>
              <ul className="simple-list">
                {result.report.contentOpportunities.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="report-block">
              <h2 className="block-title">04 / Automation opportunities</h2>
              <div className="finding-list">
                {result.report.automationOpportunities.map((a, i) => (
                  <div className="finding-row" key={i}>
                    <span className="auto-dot" />
                    <div>
                      <p className="finding-issue">{a.opportunity}</p>
                      <p className="finding-explanation">{a.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-win">
              <p className="quick-win-label">Quick win &mdash; do this first</p>
              <p className="quick-win-text">{result.report.quickWins[0]}</p>
            </div>

            <div className="cta-block">
              <h3 className="cta-title">Want this fixed, automated, and monitored?</h3>
              <p className="cta-sub">
                We build the lead capture, follow-up, and SEO monitoring system
                that keeps working after this report closes.
              </p>
              <a
                href="https://cal.com/ravi-sunder-j55lv4/free-seo-consultation"
                target="_blank"
                rel="noreferrer"
                className="cta-button"
              >
                Book a free consultation →
              </a>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Built and run by an independent automation studio.</p>
      </footer>
    </div>
  )
}

export default App
