import { useState } from 'react'
import { Check } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import { useAuth } from '../../contexts/AuthContext'

export default function Account() {
  const { user, changeDisplayName, changePassword } = useAuth()

  const [name, setName] = useState(user?.displayName || '')
  const [savingName, setSavingName] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)

  async function handleNameSubmit(e) {
    e.preventDefault()
    setSavingName(true)
    setNameSaved(false)

    try {
      await changeDisplayName(name)
      setNameSaved(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSavingName(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setPasswordError('')
    setPasswordSaved(false)

    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('A confirmação não coincide com a nova senha.')
      return
    }

    setSavingPassword(true)
    try {
      await changePassword(currentPassword, newPassword)
      setPasswordSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error(err)
      setPasswordError('Senha atual incorreta ou erro ao atualizar. Tente novamente.')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div>
      <PageHeader title="Minha Conta" subtitle="Gerencie seus dados de acesso ao painel." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={handleNameSubmit} className="space-y-4 rounded-xl2 bg-white p-6 shadow-card">
          <h2 className="font-display font-bold text-ink-950">Dados pessoais</h2>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-900">Nome</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setNameSaved(false)
              }}
              className="focus-ring w-full rounded-lg border border-ink-950/10 px-3 py-2.5 text-sm outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-900">E-mail de acesso</label>
            <input
              value={user?.email || ''}
              disabled
              className="w-full rounded-lg border border-ink-950/10 bg-ink-950/5 px-3 py-2.5 text-sm text-ink-700/65"
            />
            <p className="mt-1 text-xs text-ink-700/50">O e-mail de login não pode ser alterado por aqui.</p>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-ink-950/5 pt-4">
            {nameSaved && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600">
                <Check size={16} /> Salvo
              </span>
            )}
            <button
              type="submit"
              disabled={savingName}
              className="focus-ring rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
            >
              {savingName ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 rounded-xl2 bg-white p-6 shadow-card">
          <h2 className="font-display font-bold text-ink-950">Alterar senha</h2>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-900">Senha atual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                if (passwordError) setPasswordError('')
                if (passwordSaved) setPasswordSaved(false)
              }}
              className="focus-ring w-full rounded-lg border border-ink-950/10 px-3 py-2.5 text-sm outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-900">Nova senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                if (passwordError) setPasswordError('')
                if (passwordSaved) setPasswordSaved(false)
              }}
              className="focus-ring w-full rounded-lg border border-ink-950/10 px-3 py-2.5 text-sm outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-900">Confirmar nova senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (passwordError) setPasswordError('')
                if (passwordSaved) setPasswordSaved(false)
              }}
              className="focus-ring w-full rounded-lg border border-ink-950/10 px-3 py-2.5 text-sm outline-none"
              required
            />
          </div>

          {passwordError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{passwordError}</p>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-ink-950/5 pt-4">
            {passwordSaved && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600">
                <Check size={16} /> Senha alterada
              </span>
            )}
            <button
              type="submit"
              disabled={savingPassword}
              className="focus-ring rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
            >
              {savingPassword ? 'Salvando...' : 'Alterar senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}