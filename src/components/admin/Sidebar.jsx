import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  Image,
  Settings,
  UserCircle,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useStore } from '../../contexts/StoreContext'

const links = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/categorias', label: 'Categorias', icon: Tags },
  { to: '/admin/banner', label: 'Banner', icon: Image },
  { to: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  { to: '/admin/minha-conta', label: 'Minha Conta', icon: UserCircle },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { logout } = useAuth()
  const { store } = useStore()

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink-950 text-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 font-display text-lg font-bold">
              {store?.name?.[0]?.toUpperCase() || 'C'}
            </div>
            <div className="leading-tight">
              <p className="font-display text-sm font-bold">{store?.name || 'Minha Loja'}</p>
              <p className="text-xs text-white/50">Painel administrativo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="focus-ring rounded-lg p-1 text-white/70 hover:bg-white/10 lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          {store?.slug && (
            <a
              href={`/${store.slug}`}
              target="_blank"
              rel="noreferrer"
              className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
            >
              <ExternalLink size={18} />
              Ver catálogo
            </a>
          )}
          <button
            onClick={logout}
            className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}
