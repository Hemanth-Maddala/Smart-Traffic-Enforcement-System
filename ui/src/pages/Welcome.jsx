import AuthHero from '../components/auth/AuthHero'

const capabilities = [
  {
    title: 'Smart Detection',
    description: 'Detect vehicles, road users and violations using advanced AI models.',
    color: '#3388ff',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7zm12 3l4-2v8l-4-2" />
    ),
  },
  {
    title: 'Violation Identification',
    description: 'Identify helmet violations and triple riding.',
    color: '#a667e8',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3zm0 5v4m0 3h.01" />
    ),
  },
  {
    title: 'Number Plate OCR',
    description: 'Extract and recognize number plates accurately from traffic images.',
    color: '#18c774',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 7V5h2m10 0h2v2m0 10v2h-2M7 19H5v-2M8 9h8v6H8V9zm-1 3H4m16 0h-3" />
    ),
  },
  {
    title: 'Detailed Analytics',
    description: 'Get useful insights, visual summaries and data-driven reports.',
    color: '#ffad19',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19v-6h3v6m3 0V8h3v11m3 0V4h3v15M3 21h18" />
    ),
  },
]

export default function Welcome({ onStart }) {
  return (
    <div className="relative min-h-screen bg-[#050810]">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative flex min-h-screen">
        <AuthHero />

        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
          <section className="w-full max-w-lg rounded-2xl border border-blue-500/20 bg-[#091726]/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-sm">
            <div className="flex items-center gap-4 border-b border-[#1b3041] pb-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.8 2.2a.75.75 0 00-.77-.18L3.5 8.37a.75.75 0 00-.08 1.38l6.1 2.82 2.82 6.1a.75.75 0 001.38-.08l6.35-17.54a.75.75 0 00-.27-.85zm-8.9 14.2l-1.9-4.1 4.76-4.76-5.78 3.72-4.07-1.88 12.17-4.4L12.9 16.4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Ready to Get Started?</h2>
                <p className="mt-1 text-sm text-[#9aaabd]">
                  Begin your traffic analysis in just a few simple steps.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <article key={capability.title} className="rounded-lg border border-[#1b3041] bg-[#081522] p-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${capability.color}18`, color: capability.color }}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                      {capability.icon}
                    </svg>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold" style={{ color: capability.color }}>
                    {capability.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#9aaabd]">{capability.description}</p>
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={onStart}
              className="flex w-full items-center justify-between rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 text-left text-white shadow-[0_10px_24px_rgba(37,99,235,0.25)] transition-opacity hover:opacity-90"
            >
              <span className="flex items-center gap-3">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h14v16H5V4zm3 4h8M8 12h5" />
                </svg>
                <span>
                  <span className="block text-sm font-semibold">Start Detection</span>
                  <span className="block text-xs text-blue-100">Proceed to the detection workspace</span>
                </span>
              </span>
              <span className="text-2xl">›</span>
            </button>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-[#1b3041] pt-5 text-xs text-[#8999aa]">
              <svg className="h-5 w-5 text-[#18c774]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3zm-3 9l2 2 4-4" />
              </svg>
              <span>No login required</span><span>•</span><span>Open for all</span><span>•</span><span>Secure &amp; Private</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
