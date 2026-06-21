import Sidebar from './Sidebar'

export default function Layout({ activePage, onNavigate, children }) {
  return (
    <div className="flex h-screen bg-[#0B1120]">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
