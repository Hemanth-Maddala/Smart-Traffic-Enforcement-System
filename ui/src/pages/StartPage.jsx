import { useState } from 'react'
import helmetViolationImage from '../assets/helmet_violaton.png'
import tripleRidingImage from '../assets/triple_violation.png'
import vehicleDetailsImage from '../assets/number_plate_detection.png'

const capabilities = [
  {
    title: 'Helmet Violation',
    description: 'Detects riders travelling without a safety helmet.',
    image: helmetViolationImage,
    color: '#ff535d',
  },
  {
    title: 'Triple Riding',
    description: 'Identifies motorcycles carrying more than two riders.',
    image: tripleRidingImage,
    color: '#a667e8',
  },
  {
    title: 'Vehicle Details',
    description: 'Classifies vehicles and captures useful vehicle information.',
    image: vehicleDetailsImage,
    color: '#3388ff',
  },
]

const workflow = [
  {
    title: 'Upload Image',
    description: 'Upload a clear image of the vehicle or traffic scene.',
    color: '#8b5cf6',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7 9m5-5l5 5M5 14v5h14v-5" />
    ),
  },
  {
    title: 'AI Detection',
    description: 'The model checks vehicles, number plates and violations.',
    color: '#18c774',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6v3h3v3h3v6h-3v3h-3v3H9v-3H6v-3H3V9h3V6h3V3zm0 6v6h6V9H9z" />
    ),
  },
  {
    title: 'View Results',
    description: 'Review the violation type, confidence score and vehicle info.',
    color: '#ff9d19',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V9m5 10V5m5 14v-7m5 7V3M3 21h18" />
    ),
  },
]

const tips = [
  'Ensure good lighting and clear visibility.',
  'Image should not be blurry or pixelated.',
  'Capture the vehicle from a proper angle.',
  'Make sure the vehicle number plate is visible.',
]

function Panel({ title, children }) {
  return (
    <section className="rounded-xl border border-[#1b3041] bg-gradient-to-br from-[#0e1e2d] to-[#0a1724] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
      <h3 className="mb-5 text-sm font-semibold text-white">{title}</h3>
      {children}
    </section>
  )
}

export default function StartPage({ onNavigate }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  function selectFile(file) {
    if (file?.type.startsWith('image/')) {
      setSelectedFile(file)
      setError('')
    }
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    selectFile(event.dataTransfer.files[0])
  }

  async function handleUpload() {
    if (!selectedFile) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const res = await fetch('/api/detect', { method: 'POST', body: formData })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}))
        throw new Error(msg.detail || 'Detection failed')
      }
      onNavigate('dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-5 text-[#edf3fa]">
      <header>
        <h2 className="text-2xl font-semibold text-white">Start Detection</h2>
        <p className="mt-1 text-sm text-[#9aaabd]">
          Upload an image to detect traffic violations and get real-time analysis.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
        <div className="space-y-5">
          <div
            onDragEnter={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex min-h-[390px] flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 text-center transition-colors ${
              isDragging
                ? 'border-blue-400 bg-blue-500/10'
                : 'border-blue-500/80 bg-gradient-to-br from-[#0d1c2d] to-[#0a1724]'
            }`}
          >
            <svg className="h-20 w-20 text-[#526df3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 18a4.6 4.6 0 01-.6-9.15A6 6 0 0118 10a4 4 0 01-1 7.87M12 12v9m0-9l-3.5 3.5M12 12l3.5 3.5" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-white">Drag &amp; Drop your image here</h3>
            <p className="mt-3 text-sm text-[#9aaabd]">or</p>

            <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition-colors hover:bg-blue-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7 9m5-5l5 5M5 14v5h14v-5" />
              </svg>
              Upload Image
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                onChange={(event) => selectFile(event.target.files[0])}
              />
            </label>

            {selectedFile ? (
              <p className="mt-4 max-w-sm truncate text-sm font-medium text-[#35d17c]">
                Selected: {selectedFile.name}
              </p>
            ) : (
              <div className="mt-5 space-y-1 text-xs text-[#9aaabd]">
                <p>Supported formats: JPG, PNG, JPEG</p>
              </div>
            )}

            {selectedFile && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 rounded-lg bg-green-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(22,163,74,0.25)] transition-colors hover:bg-green-500 disabled:opacity-50"
              >
                {uploading ? 'Processing...' : 'Detect Now'}
              </button>
            )}

            {error && (
              <p className="mt-4 text-sm font-medium text-red-400">{error}</p>
            )}
          </div>

          <Panel title="What We Handle">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {capabilities.map((capability) => (
                <article
                  key={capability.title}
                  className="overflow-hidden rounded-xl border border-[#203548] bg-[#071725] transition-transform hover:-translate-y-0.5"
                >
                  <img src={capability.image} alt={capability.title} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: capability.color }} />
                      <h4 className="text-sm font-semibold text-white">{capability.title}</h4>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#9aaabd]">{capability.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        </div>

        <aside className="space-y-5">
          <Panel title="How it works">
            <div className="space-y-2">
              {workflow.map((step, index) => (
                <div key={step.title}>
                  <div className="flex gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${step.color}18`, color: step.color }}
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        {step.icon}
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                      <p className="mt-1 text-xs leading-5 text-[#a8b5c4]">{step.description}</p>
                    </div>
                  </div>
                  {index < workflow.length - 1 && (
                    <div className="ml-6 h-7 border-l border-dashed border-[#435568]" />
                  )}
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Tips for best results">
            <ul className="space-y-5">
              {tips.map((tip) => (
                <li key={tip} className="flex items-start gap-3 text-sm text-[#c3cdd8]">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#20d98a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2.5 2.5L16 9" />
                  </svg>
                  {tip}
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </div>
  )
}
