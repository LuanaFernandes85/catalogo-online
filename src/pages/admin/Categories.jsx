
import { useState } from 'react'

import {
  FolderOpen,
  Info,
  Pencil,
  Plus,
  Tag,
  Trash2,
} from 'lucide-react'

import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

import { useStore } from '../../contexts/StoreContext'

import {
  useCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../hooks/useCategories'

export default function Categories() {
  const { storeId } = useStore()

  const { categories, loading } = useCategories(storeId)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function openCreate() {
    setEditing(null)
    setName('')
    setError('')
    setModalOpen(true)
  }

  function openEdit(category) {
    setEditing(category)
    setName(category.name || '')
    setError('')
    setModalOpen(true)
  }

  function closeModal() {
    if (saving) return

    setModalOpen(false)
    setEditing(null)
    setName('')
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const cleanName = name.trim()

    if (!cleanName) {
      setError('Digite o nome da categoria.')
      return
    }

    if (cleanName.length < 2) {
      setError('O nome da categoria deve ter pelo menos 2 caracteres.')
      return
    }

    if (cleanName.length > 50) {
      setError('O nome da categoria deve ter no máximo 50 caracteres.')
      return
    }

    const duplicated = categories.some(
      (category) =>
        category.id !== editing?.id &&
        category.name?.trim().toLowerCase() === cleanName.toLowerCase()
    )

    if (duplicated) {
      setError('Já existe uma categoria com esse nome.')
      return
    }

    setSaving(true)
    setError('')

    try {
      if (editing) {
        await updateCategory(storeId, editing.id, cleanName)
      } else {
        await createCategory(storeId, cleanName)
      }

      closeModal()
    } catch (err) {
      console.error(err)
      setError(
        editing
          ? 'Não foi possível atualizar a categoria. Tente novamente.'
          : 'Não foi possível criar a categoria. Tente novamente.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Categorias"
        subtitle="Organize seus produtos para facilitar a navegação dos clientes."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
          >
            <Plus size={18} />
            Nova categoria
          </button>
        }
      />

      {/* RESUMO */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl2 border border-ink-950/5 bg-white p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
              <Tag size={19} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-700/50">
                Categorias cadastradas
              </p>

              <p className="mt-0.5 font-display text-2xl font-bold text-ink-950">
                {loading ? '...' : categories.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl2 border border-ink-950/5 bg-white p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-clay-500/10 text-clay-600">
              <FolderOpen size={19} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-700/50">
                Organização do catálogo
              </p>

              <p className="mt-0.5 text-sm font-medium text-ink-950">
                {categories.length === 0
                  ? 'Comece criando uma categoria'
                  : 'Catálogo organizado'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AVISO */}
      <div className="mb-6 flex items-start gap-3 rounded-xl2 border border-brand-500/10 bg-brand-50 px-4 py-3.5 text-sm text-brand-700">
        <Info
          size={17}
          className="mt-0.5 shrink-0"
        />

        <div>
          <p className="font-medium">
            Sobre as categorias
          </p>

          <p className="mt-0.5 leading-relaxed text-brand-700/80">
            Produtos sem categoria definida continuam aparecendo no catálogo,
            agrupados em "Sem categoria".
          </p>
        </div>
      </div>

      {/* CONTEÚDO */}
      {loading ? (
        <div className="rounded-xl2 border border-ink-950/5 bg-white p-10 shadow-card">
          <div className="flex flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />

            <p className="mt-3 text-sm text-ink-700/50">
              Carregando categorias...
            </p>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-ink-950/10 bg-white px-6 py-14 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
            <FolderOpen size={25} />
          </div>

          <h2 className="mt-4 font-display text-lg font-bold text-ink-950">
            Nenhuma categoria criada
          </h2>

          <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-ink-700/60">
            Crie categorias para organizar os produtos da sua loja e facilitar
            que seus clientes encontrem o que procuram.
          </p>

          <button
            type="button"
            onClick={openCreate}
            className="focus-ring mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
          >
            <Plus size={17} />
            Criar primeira categoria
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl2 border border-ink-950/5 bg-white shadow-card">
          {/* CABEÇALHO DA LISTA */}
          <div className="flex flex-col gap-1 border-b border-ink-950/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-ink-950">
                Suas categorias
              </h2>

              <p className="mt-0.5 text-xs text-ink-700/50">
                Gerencie a organização dos seus produtos.
              </p>
            </div>

            <span className="text-xs font-medium text-ink-700/50">
              {categories.length}{' '}
              {categories.length === 1
                ? 'categoria'
                : 'categorias'}
            </span>
          </div>

          {/* LISTA */}
          <div className="divide-y divide-ink-950/5">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-ink-950/[0.015]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-950/5 text-xs font-semibold text-ink-700/60">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-950">
                      {category.name}
                    </p>

                    <p className="mt-0.5 text-xs text-ink-700/45">
                      Categoria do catálogo
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(category)}
                    className="focus-ring rounded-lg p-2 text-ink-700 transition-colors hover:bg-ink-950/5 hover:text-ink-950"
                    aria-label={`Editar ${category.name}`}
                    title="Editar categoria"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setToDelete(category)}
                    className="focus-ring rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                    aria-label={`Excluir ${category.name}`}
                    title="Excluir categoria"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Editar categoria' : 'Nova categoria'}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-900">
              Nome da categoria
            </label>

            <input
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError('')
              }}
              maxLength={50}
              className="focus-ring w-full rounded-lg border border-ink-950/10 bg-white px-3 py-2.5 text-sm outline-none transition-shadow"
              placeholder="Ex: Tênis esportivos"
              disabled={saving}
              required
            />

            <div className="mt-1.5 flex items-center justify-between">
              <p className="text-xs text-ink-700/45">
                Use um nome simples e fácil de identificar.
              </p>

              <span className="shrink-0 text-[11px] text-ink-700/40">
                {name.length}/50
              </span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-ink-950/5 pt-4">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="focus-ring rounded-lg px-4 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-950/5 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="focus-ring inline-flex min-w-[120px] items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? 'Salvando...'
                : editing
                  ? 'Salvar alterações'
                  : 'Criar categoria'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRMAÇÃO DE EXCLUSÃO */}
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return

          try {
            await deleteCategory(storeId, toDelete.id)
            setToDelete(null)
          } catch (err) {
            console.error(err)
            setToDelete(null)
            setError(
              'Não foi possível excluir a categoria. Tente novamente.'
            )
          }
        }}
        title="Excluir categoria"
        message={`Excluir "${toDelete?.name}"? Os produtos dessa categoria passarão a aparecer como "Sem categoria".`}
        confirmLabel="Excluir categoria"
      />
    </div>
  )
}