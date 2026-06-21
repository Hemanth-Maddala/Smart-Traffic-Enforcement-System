import { useState, useEffect } from 'react'

const imgUrl = (url) => url ? `${url}?t=${Date.now()}` : ''

function ViolationIcon({ type }) {
  if (type === 'helmet') {
    return (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 13a8 8 0 0116 0v3H9a5 5 0 01-5-5v2zm5 3v3h8" />
      </svg>
    )
  }

  if (type === 'riders') {
    return (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <circle cx="7" cy="6" r="2" /><circle cx="13" cy="5" r="2" /><circle cx="18" cy="7" r="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17a4 4 0 018 0m-1 1a4 4 0 018 0m-3-5a4 4 0 016 4" />
      </svg>
    )
  }

  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 3h.01M10.3 3.8L2.7 17a2 2 0 001.7 3h15.2a2 2 0 001.7-3L13.7 3.8a2 2 0 00-3.4 0z" />
    </svg>
  )
}

function Panel({ title, children }) {
  return (
    <section className="rounded-xl border border-[#1b3041] bg-gradient-to-br from-[#0e1e2d] to-[#0a1724] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      {children}
    </section>
  )
}

export default function TrafficViolation() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/results')
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-[#9aaabd]">Loading...</div>
  }

  const violations = data?.violations?.length
    ? data.violations.map((v) => ({
        label: v.label,
        count: v.count,
        confidence: v.average_confidence,
        color: v.color,
        key: v.key,
      }))
    : []

  const totalViolations = violations.reduce((sum, v) => sum + v.count, 0)
  const trafficViolationImageUrl = data?.images?.traffic_violation || ''

  const summaryCards = [
    { label: 'Violations Detected', value: totalViolations || '--', color: '#3388ff', icon: 'warning' },
    { label: 'Helmet Violation', value: violations[0]?.count || '--', color: '#ff9d19', icon: 'helmet' },
    { label: 'Triple Riding', value: violations[1]?.count || '--', color: '#ff4f78', icon: 'riders' },
  ]

  let helmetPercentage = 0
  if (violations[0] && totalViolations > 0) {
    helmetPercentage = (violations[0].count / totalViolations) * 100
  }
  const nonZeroViolations = violations.filter(v => v.count > 0)

  return (
    <div className="space-y-5 text-[#edf3fa]">
      <header>
        <h2 className="text-2xl font-semibold text-white">Traffic Violation Detection</h2>
        <p className="mt-1 text-sm text-[#9aaabd]">
          Real-time identification of helmet and triple-riding violations.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-white/[0.04] bg-[#0e1e2d] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.17)]"
            style={{ backgroundImage: `linear-gradient(135deg, ${card.color}13, transparent 70%)` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${card.color}12`, color: card.color }}
              >
                <ViolationIcon type={card.icon} />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: card.color }}>{card.label}</p>
                <p className="mt-1 text-2xl font-semibold text-white">{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(330px,0.85fr)]">
        <Panel title="Live Violation Feed">
          <div className="overflow-hidden rounded-lg border border-[#294056] bg-[#06131f]">
            <img
              src={imgUrl(trafficViolationImageUrl)}
              alt="Traffic violation detection feed"
              className="h-auto max-h-[600px] w-full object-contain"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-5">
            {nonZeroViolations.length > 0 ? nonZeroViolations.map((violation) => (
              <div key={violation.label} className="flex items-center gap-2 text-xs text-[#b4c0cd]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: violation.color }} />
                {violation.label}
              </div>
            )) : <span className="text-xs text-[#9aaabd]">No violations detected</span>}
          </div>
        </Panel>

        <Panel title="Detection Overview">
          {nonZeroViolations.length > 0 ? (
          <div className="flex min-h-[480px] flex-col items-center justify-center gap-7">
            <div
              className="relative h-48 w-48 shrink-0 rounded-full"
              style={{
                background: `conic-gradient(${violations[0]?.color || '#ff9d19'} 0 ${helmetPercentage}%, ${violations[1]?.color || '#ff4f78'} ${helmetPercentage}% 100%)`,
              }}
            >
              <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-[#0b1926] shadow-inner">
                <span className="text-2xl font-bold text-white">{totalViolations}</span>
                <span className="mt-1 text-xs text-[#9aaabd]">Total</span>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-3">
              {violations.map((violation) => (
                <div key={violation.label} className="grid grid-cols-[12px_1fr_auto_auto] items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: violation.color }} />
                  <span className="text-slate-200">{violation.label} Detection</span>
                  <span className="font-medium text-white">{violation.count || '--'}</span>
                  <span className="w-11 text-right text-[#8495a8]">
                    {totalViolations > 0 ? `${((violation.count / totalViolations) * 100).toFixed(1)}%` : '--'}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {violations.filter(v => v.confidence > 0).map((violation) => (
                <div
                  key={`${violation.label}-confidence`}
                  className="rounded-lg border border-[#203548] bg-[#071725] p-4"
                >
                  <p className="text-xs leading-relaxed text-[#9aaabd]">
                    {violation.label} average confidence score
                  </p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <span className="text-2xl font-semibold text-white">{violation.confidence}%</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#192b3b]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${violation.confidence}%`, backgroundColor: violation.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          ) : (
          <div className="flex min-h-[480px] flex-col items-center justify-center text-[#9aaabd]">
            <p>No violations detected.</p>
          </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
