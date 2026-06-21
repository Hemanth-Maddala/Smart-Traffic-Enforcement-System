import { useState, useEffect } from 'react'
import { apiUrl, imgUrl } from '../api'

function Card({ title, action, children, className = '' }) {
  return (
    <div className={`rounded-xl border border-[#1c3042] bg-gradient-to-br from-[#102131] to-[#0d1b29] p-5 shadow-[0_12px_36px_rgba(0,0,0,0.18)] ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-base font-semibold text-white">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

function ViewDetailsButton({ onClick, label = 'View Details' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-medium text-[#438cff] transition-colors hover:text-[#70a8ff]"
    >
      {label}
    </button>
  )
}

function ConfidenceGauge({ value }) {
  const display = value == null || value === '--' || value === 0 ? '--' : `${value}%`
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#ff5258] bg-[#051828] text-xs font-semibold text-white shadow-[0_0_14px_rgba(255,82,88,0.12)]">
      {display}
    </div>
  )
}

export default function Dashboard({ onNavigate }) {
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

  if (!data || data.status === 'waiting_for_upload') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#9aaabd] gap-4">
        <p>No detection results yet.</p>
        <button
          type="button"
          onClick={() => onNavigate?.('start')}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Upload an Image
        </button>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Vehicles',
      value: data.summary.total_vehicles.toLocaleString(),
      labelColor: 'text-[#438cff]',
      cardBg: 'from-[#142238] to-[#111c2c]',
      iconBg: 'bg-[#438cff]/10 text-[#438cff] ring-[#438cff]/20',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
    },
    {
      label: 'Road Users',
      value: data.summary.total_road_users.toLocaleString(),
      labelColor: 'text-[#35d17c]',
      cardBg: 'from-[#102b2c] to-[#102326]',
      iconBg: 'bg-[#35d17c]/10 text-[#35d17c] ring-[#35d17c]/20',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: 'Violations Detected',
      value: data.summary.violations_detected.toLocaleString(),
      labelColor: 'text-[#ff8a00]',
      cardBg: 'from-[#29271f] to-[#211f1c]',
      iconBg: 'bg-[#ff8a00]/10 text-[#ff8a00] ring-[#ff8a00]/20',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      label: 'Unique Number Plates',
      value: data.summary.unique_number_plates.toLocaleString(),
      labelColor: 'text-[#ff5258]',
      cardBg: 'from-[#2a2028] to-[#211b23]',
      iconBg: 'bg-[#ff5258]/10 text-[#ff5258] ring-[#ff5258]/20',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
  ]

  const detectionImageUrl = data.images?.vehicle_detection || ''
  const trafficViolationImageUrl = data.images?.traffic_violation || ''

  const violations = data.violations?.map((v) => ({
    type: v.label,
    confidence: v.average_confidence,
    violationsDetected: v.count,
    vehicle_type: v.vehicle_type,
  })) || []

  const plateViolations = data.plates?.slice(0, 5).map((p) => ({
    plate: p.text,
    vehicle: p.vehicle_type,
    violation: p.violation,
    confidence: p.confidence,
  })) || []

  const detectionLegend = data.detections?.map((d) => ({
    label: d.label,
    color: d.color,
  })) || []

  return (
    <div className="space-y-6 text-[#edf3fa]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Dashboard Overview</h2>
          <p className="mt-1 text-[#9aaabd]">Real-time traffic monitoring and violation detection.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-[#1b3041] bg-[#0b1825]/90 px-4 py-2 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#35d17c] shadow-[0_0_8px_rgba(53,209,124,0.7)]" />
          <span className="text-sm font-medium text-[#35d17c]">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border border-white/[0.035] bg-gradient-to-br ${stat.cardBg} p-5 shadow-[0_12px_30px_rgba(0,0,0,0.18)]`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium ${stat.labelColor}`}>{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${stat.iconBg}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card
          title="Vehicle & Road User Detection"
          action={<ViewDetailsButton onClick={() => onNavigate?.('vehicles-users')} />}
        >
          <div className="overflow-hidden rounded-lg border border-[#294056] shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
            <img src={imgUrl(detectionImageUrl)} alt="Vehicle and road user detection" className="h-auto max-h-[400px] w-full object-contain" />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {detectionLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-[#b4c0cd]">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Traffic Violations"
          action={
            <ViewDetailsButton
              label="View All Violations"
              onClick={() => onNavigate?.('traffic-violation')}
            />
          }
        >
          <div className="space-y-4">
            {violations.filter(v => v.violationsDetected > 0).map((item) => (
              <div
                key={item.type}
                className="flex items-center gap-4 rounded-lg border border-[#203548] bg-[#051828] p-3 shadow-inner shadow-black/10"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#ff5258]">{item.type}</p>
                  <p className="mt-1 text-sm text-[#9aaabd]">
                    Violations Detected : {item.violationsDetected}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="rounded-full bg-[#ff5258]/15 px-3 py-0.5 text-xs font-medium text-[#ff6b70] ring-1 ring-amber-500/20">
                    confidence score
                  </span>
                  <ConfidenceGauge value={item.confidence || '--'} />
                </div>
              </div>
            ))}
            {violations.filter(v => v.violationsDetected > 0).length === 0 && (
              <p className="text-sm text-[#9aaabd]">No violations detected.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card
          title="Number Plates & Violation Details"
          action={<ViewDetailsButton onClick={() => onNavigate?.('violation-vehicle')} />}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#23384a] text-[#9aaabd]">
                  <th className="pb-3 pr-4 font-medium">Plate Number</th>
                  <th className="pb-3 pr-4 font-medium">Vehicle Type</th>
                  <th className="pb-3 pr-4 font-medium">Violation Type</th>
                  <th className="pb-3 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {plateViolations.map((row) => (
                  <tr key={row.plate} className="border-b border-[#203548]/70 last:border-0">
                    <td className="py-3 pr-4 font-medium text-white">{row.plate}</td>
                    <td className="py-3 pr-4 text-slate-200">{row.vehicle}</td>
                    <td
                      className={`py-3 pr-4 font-medium ${
                        row.violation === 'No Violation' ? 'text-[#35d17c]' : 'text-[#ff5258]'
                      }`}
                    >
                      {row.violation}
                    </td>
                    <td
                      className={`py-3 font-medium ${
                        row.confidence > 0 ? 'text-[#35d17c]' : 'text-[#9aaabd]'
                      }`}
                    >
                      {row.confidence > 0 ? `${row.confidence}%` : '--'}
                    </td>
                  </tr>
                ))}
                {plateViolations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-3 text-center text-[#9aaabd]">No plates detected.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title="All Detected Number Plates"
          action={
            <ViewDetailsButton
              label="View All Plates"
              onClick={() => onNavigate?.('all-vehicle-details')}
            />
          }
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {data.plates?.slice(0, 8).map((plate, idx) => {
              const isViolation = plate.violation !== 'No Violation'
              const borderColor = isViolation ? 'border-[#ff5258]/60' : 'border-[#35d17c]/60'
              return (
              <div
                key={idx}
                className={`rounded-lg border ${borderColor} px-3 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] ${isViolation ? 'bg-[#ff5258]/05' : 'bg-[#112438]'}`}
              >
                <p className="text-sm font-semibold text-slate-300">{plate.text}</p>
                <p className={`mt-1 text-xs ${isViolation ? 'text-[#ff5258]' : 'text-[#35d17c]'}`}>{plate.violation}</p>
              </div>
            )})}
            {(!data.plates || data.plates.length === 0) && (
              <p className="col-span-full text-center text-[#9aaabd]">No plates detected.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
