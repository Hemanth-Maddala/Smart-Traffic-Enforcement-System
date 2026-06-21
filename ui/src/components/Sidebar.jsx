import mainIcon from '../assets/main_icon.png'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'vehicles-users', label: 'Vehicles and Users', icon: 'vehicles' },
  { id: 'traffic-violation', label: 'Traffic Violation', icon: 'violation' },
  { id: 'violation-vehicle', label: 'Violation Vehicle', icon: 'plate' },
  { id: 'all-vehicle-details', label: 'All Vehicle Details', icon: 'details' },
  { id: 'start', label: 'Start Detection', icon: 'start' },
]

function NavIcon({ type }) {
  if (type === 'vehicles') {
    return (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 14l1.5-5A2 2 0 016.4 7h11.2a2 2 0 011.9 2l1.5 5m-18 0h18v5H3v-5zm3 5v2m12-2v2M7 15.5h.01M17 15.5h.01" />
      </svg>
    )
  }

  if (type === 'violation') {
    return (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 3h.01M10.3 3.8L2.7 17a2 2 0 001.7 3h15.2a2 2 0 001.7-3L13.7 3.8a2 2 0 00-3.4 0z" />
      </svg>
    )
  }

  if (type === 'plate') {
    return (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path strokeLinecap="round" d="M7 10h10M7 14h6M17 14h.01" />
      </svg>
    )
  }

  if (type === 'details') {
    return (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h10l4 4v14H5V3zm10 0v5h5M8 12h8M8 16h8M8 8h3" />
      </svg>
    )
  }

  if (type === 'start') {
    return (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7 9m5-5l5 5M5 14v5h14v-5" />
      </svg>
    )
  }

  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  )
}

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-[#051828]">
      <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-4">
        <img src={mainIcon} alt="Logo" className="h-14 w-12 rounded-lg object-cover" />
        <h1 className="text-sm font-semibold leading-tight text-white">
          Smart Traffic Enforcement System
        </h1>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <NavIcon type={item.icon} />
              {item.label}
            </button>
          )
        })}
      </nav>
      <div className="px-3 py-4">
        <p className="text-xs font-medium text-slate-300">Smart Traffic Enforcement System</p>
      </div>
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-medium text-white">
            F
          </div>
          <div>
            <p className="text-sm font-medium text-white">Free</p>
            <p className="text-xs text-slate-400">Account</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
