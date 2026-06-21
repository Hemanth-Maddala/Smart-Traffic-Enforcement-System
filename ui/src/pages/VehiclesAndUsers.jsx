import { useState, useEffect } from 'react'
import { apiUrl, imgUrl } from '../api'



function DetectionIcon({ type }) {
  if (type === 'users') {
    return (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m7-10a4 4 0 100-8 4 4 0 000 8zm13 10v-2a4 4 0 00-3-3.87m-2-12a4 4 0 010 7.75" />
      </svg>
    )
  }

  if (type === 'person') {
    return (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <circle cx="12" cy="5" r="3" /><path strokeLinecap="round" d="M5 21v-2a7 7 0 0114 0v2" />
      </svg>
    )
  }

  if (type === 'bike') {
    return (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <circle cx="5" cy="17" r="3" /><circle cx="19" cy="17" r="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 17l4-8h4l3 8m-7-8l5 8H5m7-11h3" />
      </svg>
    )
  }

  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 14l1.5-5A2 2 0 016.4 7h11.2a2 2 0 011.9 2l1.5 5m-18 0h18v5H3v-5zm3 5v2m12-2v2M7 15.5h.01M17 15.5h.01" />
    </svg>
  )
}

function Panel({ title, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-[#1b3041] bg-gradient-to-br from-[#0e1e2d] to-[#0a1724] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.18)] ${className}`}>
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      {children}
    </section>
  )
}

export default function VehiclesAndUsers() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(apiUrl('/api/results'))
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-[#9aaabd]">Loading...</div>
  }

  const detections = data?.detections || []
  const detectionImageUrl = data?.images?.vehicle_detection || ''

  const getCount = (key) => {
    const found = detections.find((d) => d.key === key)
    return found ? found.count : 0
  }

  const getConfidence = (key) => {
    const found = detections.find((d) => d.key === key)
    return found ? found.average_confidence : null
  }

  const summaryCards = [
    { label: 'Total Vehicles', value: data?.summary?.total_vehicles ?? '--', color: '#3388ff', icon: 'car' },
    { label: 'Total Road Users', value: data?.summary?.total_road_users ?? '--', color: '#18c774', icon: 'users' },
    { label: 'Motorcycles', value: getCount('motorcycle') || '--', color: '#a667e8', icon: 'bike' },
    { label: 'Pedestrians', value: getCount('pedestrian') || '--', color: '#ff9d19', icon: 'person' },
    { label: 'Bicycles', value: getCount('bicycle') || '--', color: '#ff4f78', icon: 'bike' },
  ]

  const legendItems = detections.length > 0
    ? detections.map((d) => ({ label: d.label, count: d.count, color: d.color, confidence: d.average_confidence }))
    : []

  const totalDetections = legendItems.reduce((sum, item) => sum + item.count, 0)
  const nonZeroDetections = legendItems.filter(d => d.count > 0)
  let segmentStart = 0
  const detectionGradient = `conic-gradient(${legendItems.map((item) => {
    const segmentEnd = segmentStart + (item.count / totalDetections) * 100
    const segment = `${item.color} ${segmentStart}% ${segmentEnd}%`
    segmentStart = segmentEnd
    return segment
  }).join(', ')})`

  return (
    <div className="space-y-5 text-[#edf3fa]">
      <header>
        <div>
          <h2 className="text-2xl font-semibold text-white">Vehicles &amp; Road Users Detection</h2>
          <p className="mt-1 text-sm text-[#9aaabd]">
            Real-time detection and classification of vehicles and road users.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
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
                <DetectionIcon type={card.icon} />
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
        <Panel title="Live Detection Feed">
          <div className="overflow-hidden rounded-lg border border-[#294056] bg-[#06131f]">
            <img
              src={imgUrl(detectionImageUrl)}
              alt="Live vehicle and road user detection feed"
              className="h-auto max-h-[500px] w-full object-contain"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {nonZeroDetections.length > 0 ? nonZeroDetections.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-[#b4c0cd]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </div>
            )) : <span className="text-xs text-[#9aaabd]">No detections available</span>}
          </div>
        </Panel>

        <Panel title="Detection Overview">
          {nonZeroDetections.length > 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-8">
            <div
              className="relative h-48 w-48 shrink-0 rounded-full"
              style={{ background: detectionGradient }}
            >
              <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-[#0b1926] shadow-inner">
                <span className="text-2xl font-bold text-white">{totalDetections.toLocaleString()}</span>
                <span className="mt-1 text-xs text-[#9aaabd]">Total</span>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-3">
              {legendItems.map((item) => {
                const percentage = totalDetections > 0 ? ((item.count / totalDetections) * 100).toFixed(1) : '--'
                return (
                  <div key={item.label} className="grid grid-cols-[12px_1fr_auto_auto] items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-200">{item.label}</span>
                    <span className="font-medium text-white">{item.count || '--'}</span>
                    <span className="w-11 text-right text-[#8495a8]">{percentage === '--' ? '--' : `${percentage}%`}</span>
                  </div>
                )
              })}
            </div>
          </div>
          ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-[#9aaabd]">
            <p>No detections available.</p>
          </div>
          )}
        </Panel>
      </div>

      <Panel title="Detection Breakdown">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#21374a] text-xs text-[#9aaabd]">
                <th className="px-3 pb-3 font-medium">Class</th>
                <th className="px-3 pb-3 font-medium">Count</th>
                <th className="px-3 pb-3 font-medium">Percentage</th>
                <th className="px-3 pb-3 font-medium">Detection confidence</th>
                <th className="px-3 pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {legendItems.map((item) => {
                const percentage = totalDetections > 0 ? ((item.count / totalDetections) * 100).toFixed(1) : '0.0'
                return (
                  <tr key={item.label} className="border-b border-[#1b3041]/75 last:border-0">
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <span style={{ color: item.color, fontSize: '1.2rem' }}>●</span>
                        <span className="font-medium text-slate-100">{item.label}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-slate-200">{item.count || '--'}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-[#192b3b]">
                          {item.count > 0 && (
                          <div className="h-full rounded-full" style={{ width: `${Number(percentage)}%`, backgroundColor: item.color }} />
                          )}
                        </div>
                        <span className="text-[#b4c0cd]">{percentage}%</span>
                      </div>
                    </td>
                    <td className={`px-3 py-3.5 font-medium ${item.confidence > 0 ? 'text-[#35d17c]' : 'text-[#9aaabd]'}`}>{item.confidence > 0 ? `${item.confidence}%` : '--'}</td>
                    <td className="px-3 py-3.5">
                      {item.count > 0 ? (
                      <span className="rounded-full bg-[#35d17c]/10 px-2.5 py-1 text-xs font-medium text-[#35d17c]">Active</span>
                      ) : (
                      <span className="rounded-full bg-[#9aaabd]/10 px-2.5 py-1 text-xs font-medium text-[#9aaabd]">--</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
