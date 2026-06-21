import { useState, useEffect } from 'react'
import { apiUrl, imgUrl } from '../api'

export default function AllVehicleDetails() {
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

  const plates = data.plates || []
  const detections = data.detections || []
  const numberPlateImageUrl = data.images?.number_plates || ''

  return (
    <div className="space-y-5 text-[#edf3fa]">
      <header>
        <h2 className="text-2xl font-semibold text-white">All Vehicle Details</h2>
        <p className="mt-1 text-sm text-[#9aaabd]">
          Comprehensive details of all detected vehicles and number plates.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {detections.filter(d => d.count > 0).map((d) => (
          <div
            key={d.key}
            className="rounded-xl border border-white/[0.04] bg-[#0e1e2d] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.17)]"
            style={{ backgroundImage: `linear-gradient(135deg, ${d.color}13, transparent 70%)` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${d.color}12`, color: d.color }}
              >
                <span className="h-5 w-5 text-center font-bold text-lg">●</span>
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: d.color }}>{d.label}</p>
                <p className="mt-1 text-2xl font-semibold text-white">{d.count}</p>
                <p className="text-xs text-[#9aaabd]">{d.average_confidence > 0 ? `${d.average_confidence}% avg confidence` : '--'}</p>
              </div>
            </div>
          </div>
        ))}
        {detections.filter(d => d.count > 0).length === 0 && (
          <p className="col-span-full text-center text-[#9aaabd] py-8">No detections available.</p>
        )}
      </div>

      <div className="rounded-xl border border-[#1b3041] bg-gradient-to-br from-[#0e1e2d] to-[#0a1724] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
        <h3 className="mb-4 text-sm font-semibold text-white">Number Plate Detection</h3>
        <div className="overflow-hidden rounded-lg border border-[#294056] bg-[#06131f]">
            <img
              src={imgUrl(numberPlateImageUrl)}
              alt="Number plate detection"
            className="h-auto max-h-[500px] w-full object-contain"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#1b3041] bg-gradient-to-br from-[#0e1e2d] to-[#0a1724] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
        <h3 className="mb-4 text-sm font-semibold text-white">Detected Number Plates</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {plates.map((plate, index) => {
            const isViolation = plate.violation !== 'No Violation'
            const borderColor = isViolation ? 'border-[#ff5258]/60' : 'border-[#35d17c]/60'
            return (
            <div
              key={index}
              className={`rounded-lg border ${borderColor} px-3 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] ${isViolation ? 'bg-[#ff5258]/05' : 'bg-[#112438]'}`}
            >
              <p className="text-sm font-semibold text-slate-300">{plate.text}</p>
              <p className="mt-1 text-xs text-[#9aaabd]">{plate.vehicle_type}</p>
              <p className={`mt-1 text-xs ${isViolation ? 'text-[#ff5258]' : 'text-[#35d17c]'}`}>
                {plate.violation}
              </p>
            </div>
          )})}
          {plates.length === 0 && (
            <p className="col-span-full text-center text-[#9aaabd]">No plates detected.</p>
          )}
        </div>
      </div>
    </div>
  )
}
