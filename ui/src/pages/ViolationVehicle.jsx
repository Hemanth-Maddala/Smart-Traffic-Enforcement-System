import { useState, useEffect } from 'react'
import { apiUrl, imgUrl } from '../api'

export default function ViolationVehicle() {
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
      <div className="flex items-center justify-center h-64 text-[#9aaabd]">
        No detection results yet. Upload an image to get started.
      </div>
    )
  }

  const violationPlates = data.violation_plates || []
  const plates = data.plates || []
  const violationImageUrl = data.images?.violation_plates || ''

  return (
    <div className="space-y-5 text-[#edf3fa]">
      <header>
        <h2 className="text-2xl font-semibold text-white">Violation Vehicle Details</h2>
        <p className="mt-1 text-sm text-[#9aaabd]">
          Detailed view of violations linked to detected number plates.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="rounded-xl border border-[#1b3041] bg-gradient-to-br from-[#0e1e2d] to-[#0a1724] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <h3 className="mb-4 text-sm font-semibold text-white">Violation & Plate Detection</h3>
          <div className="overflow-hidden rounded-lg border border-[#294056] bg-[#06131f]">
            <img
              src={imgUrl(violationImageUrl)}
              alt="Violation number plates"
              className="h-auto max-h-[500px] w-full object-contain"
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#1b3041] bg-gradient-to-br from-[#0e1e2d] to-[#0a1724] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <h3 className="mb-4 text-sm font-semibold text-white">Violation Summary</h3>
          <div className="space-y-4">
            {violationPlates.length === 0 && (
              <p className="text-sm text-[#9aaabd]">No violations detected.</p>
            )}
            {violationPlates.map((item, index) => {
              const isViolation = item.violation !== 'No Violation'
              const accentColor = isViolation ? '#ff5258' : '#35d17c'
              return (
              <div
                key={index}
                className={`rounded-lg border p-4 ${isViolation ? 'border-[#ff5258]/40 bg-[#ff5258]/05' : 'border-[#35d17c]/40 bg-[#35d17c]/05'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{item.plate}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${isViolation ? 'bg-[#ff5258]/15 text-[#ff6b70]' : 'bg-[#35d17c]/15 text-[#35d17c]'}`}>
                    {item.violation}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#9aaabd]">Vehicle</span>
                    <p className="mt-0.5 text-slate-200">{item.vehicle_type}</p>
                  </div>
                  <div>
                    <span className="text-[#9aaabd]">Confidence</span>
                    <p className={`mt-0.5 ${item.confidence > 0 ? 'text-[#35d17c]' : 'text-[#9aaabd]'}`}>{item.confidence > 0 ? `${item.confidence}%` : '--'}</p>
                  </div>
                  <div>
                    <span className="text-[#9aaabd]">Plate Confidence</span>
                    <p className="mt-0.5 text-slate-200">{item.plate_confidence > 0 ? `${item.plate_confidence}%` : '--'}</p>
                  </div>
                  <div>
                    <span className="text-[#9aaabd]">Detail</span>
                    <p className="mt-0.5 text-slate-200">{item.detail}</p>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#1b3041] bg-gradient-to-br from-[#0e1e2d] to-[#0a1724] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
        <h3 className="mb-4 text-sm font-semibold text-white">All Detected Plates</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#21374a] text-xs text-[#9aaabd]">
                <th className="pb-3 pr-4 font-medium">Plate Number</th>
                <th className="pb-3 pr-4 font-medium">Confidence</th>
                <th className="pb-3 pr-4 font-medium">Vehicle Type</th>
                <th className="pb-3 font-medium">Violation</th>
              </tr>
            </thead>
            <tbody>
              {plates.map((plate, index) => (
                <tr key={index} className="border-b border-[#1b3041]/75 last:border-0">
                  <td className="py-3 pr-4 font-medium text-white">{plate.text}</td>
                  <td className={`py-3 pr-4 ${plate.confidence > 0 ? 'text-[#35d17c]' : 'text-[#9aaabd]'}`}>{plate.confidence > 0 ? `${plate.confidence}%` : '--'}</td>
                  <td className="py-3 pr-4 text-slate-200">{plate.vehicle_type}</td>
                  <td className={`py-3 font-medium ${plate.violation === 'No Violation' ? 'text-[#35d17c]' : 'text-[#ff5258]'}`}>
                    {plate.violation}
                  </td>
                </tr>
              ))}
              {plates.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-3 text-center text-[#9aaabd]">No plates detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
