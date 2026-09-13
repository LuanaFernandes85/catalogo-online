import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from '../components/admin/Sidebar'
import { useStore } from '../contexts/StoreContext'

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { loading } = useStore()

  return (
    <div className="min-h-screen bg-canvas lg:flex">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink-950/5 bg-canvas/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="focus-ring rounded-lg p-2 hover:bg-ink-950/5"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <span className="font-display text-lg font-bold text-ink-950">Catálogo Digital</span>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}
