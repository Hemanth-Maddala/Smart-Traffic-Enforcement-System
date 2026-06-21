import mainIcon from '../../assets/main_icon.png'
import loginHeroImage from '../../assets/login_sigin.png'

const features = [
  {
    label: 'Real-time Monitoring',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    label: 'AI Detection & Analytics',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    label: 'Violation Detection',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    label: 'Smart Reports',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
]

export default function AuthHero() {
  return (
    <div className="relative hidden min-h-screen flex-1 overflow-hidden border-r border-blue-500/10 lg:flex">
      <div className="flex w-full flex-col p-10 xl:p-14">
        <img
          src={loginHeroImage}
          alt="Smart traffic monitoring"
          className="h-64 w-full max-w-2xl rounded-2xl object-cover object-center shadow-[0_20px_60px_rgba(37,99,235,0.18)] xl:h-80"
        />

        <div className="mt-6 max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            <span className="text-white">Smart Traffic</span>
            <br />
            <span className="text-blue-400">Enforcement System</span>
          </h1>

          <p className="mt-3 text-sm text-slate-400">AI-Powered • Real-time • Reliable</p>

          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Building safer roads with intelligent monitoring, violation detection and automated
            enforcement.
          </p>
        </div>

        <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="rounded-xl border border-blue-500/30 bg-slate-900/60 p-4 text-center backdrop-blur-sm"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center text-blue-400">
                {feature.icon}
              </div>
              <p className="mt-2 text-xs leading-snug text-slate-300">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AuthFooter() {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="flex items-center gap-2">
        <img src={mainIcon} alt="Logo" className="h-10 w-8 rounded object-cover" />
        <span className="text-sm text-slate-400">Smart Traffic Enforcement System</span>
      </div>
    </div>
  )
}
