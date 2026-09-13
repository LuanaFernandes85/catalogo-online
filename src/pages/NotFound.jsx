import { Link } from 'react-router-dom'

export default function NotFound({ message }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-canvas px-6 text-center">
      <p className="font-display text-3xl font-bold text-ink-950">404</p>
      <p className="max-w-sm text-sm text-ink-700/70">
        {message || 'Página não encontrada.'}
      </p>
      <Link to="/admin/login" className="focus-ring mt-2 text-sm font-medium text-brand-600 hover:underline">
        Ir para o painel administrativo
      </Link>
    </div>
  )
}
