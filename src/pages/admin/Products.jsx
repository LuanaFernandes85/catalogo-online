import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Tag as TagIcon,
  Package,
} from 'lucide-react'

import PageHeader from '../../components/ui/PageHeader'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useStore } from '../../contexts/StoreContext'
import {
  useProducts,
  deleteProduct,
  toggleProductActive,
} from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { formatPrice } from '../../utils/format'

export default function Products() {
  const { storeId } = useStore()

  const { products, loading } = useProducts(storeId)
  const { categories } = useCategories(storeId)

  const [search, setSearch] = useState('')
  const [toDelete, setToDelete] = useState(null)

  const categoryName = (id) =>
    categories.find((c) => c.id === id)?.name || 'Sem categoria'

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return products

    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.code?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term)
    )
  }, [products, search])

  return (
    <div>
      <PageHeader
        title="Produtos"
        subtitle="Cadastre e gerencie os produtos do seu catálogo."
        action={
          <Link
            to="/admin/produtos/novo"
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
          >
            <Plus size={18} />
            Novo produto
          </Link>
        }
      />

      {/* CONTROLES */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-700/40"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto, código ou marca..."
            className="focus-ring w-full rounded-lg border border-ink-950/10 bg-white py-2.5 pl-10 pr-3 text-sm shadow-sm"
          />
        </div>

        {!loading && (
          <div className="flex items-center gap-2 text-sm text-ink-700/60">
            <Package size={16} />
            <span>
              {filtered.length}{' '}
              {filtered.length === 1 ? 'produto' : 'produtos'}
            </span>
          </div>
        )}
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex h-52 items-center justify-center rounded-xl2 bg-white shadow-card">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        /* EMPTY STATE */
        <div className="rounded-xl2 bg-white px-6 py-14 text-center shadow-card">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10">
            <Package size={22} className="text-brand-600" />
          </div>

          <h3 className="mt-4 font-display text-base font-bold text-ink-950">
            {products.length === 0
              ? 'Nenhum produto cadastrado'
              : 'Nenhum produto encontrado'}
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-ink-700/60">
            {products.length === 0
              ? 'Comece adicionando o primeiro produto ao seu catálogo.'
              : 'Tente buscar pelo nome, código ou marca do produto.'}
          </p>

          {products.length === 0 && (
            <Link
              to="/admin/produtos/novo"
              className="focus-ring mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
            >
              <Plus size={17} />
              Cadastrar produto
            </Link>
          )}
        </div>
      ) : (
        /* PRODUTOS - CARDS COMPACTOS EM GRID */
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group flex items-center gap-3 overflow-hidden rounded-xl bg-white p-3 shadow-card transition-shadow hover:shadow-md"
            >
              {/* MINIATURA DA IMAGEM */}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-950/5">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-ink-700/30">
                    Sem foto
                  </div>
                )}

                {product.active === false && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink-950/60 text-[10px] font-medium text-white backdrop-blur-[1px]">
                    Inativo
                  </div>
                )}
              </div>

              {/* CONTEÚDO PRINCIPAL */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="truncate text-sm font-medium text-ink-950">
                    {product.name}
                  </h3>
                </div>

                <p className="text-[11px] text-ink-700/55">
                  {categoryName(product.categoryId)}
                  {product.brand && ` • ${product.brand}`}
                </p>

                {/* PREÇO E PROMOÇÃO */}
                <div className="mt-1 flex items-center gap-2">
                  {product.promo && product.promoPrice ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-ink-700/40 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm font-bold text-brand-600">
                        {formatPrice(product.promoPrice)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-ink-950">
                      {formatPrice(product.price)}
                    </span>
                  )}

                  {product.promo && product.promoPrice && (
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-600">
                      <TagIcon size={10} />
                      Promo
                    </span>
                  )}
                </div>

                {/* RODAPÉ / AÇÕES DO CARD */}
                <div className="mt-2 flex items-center justify-between border-t border-ink-950/5 pt-2">
                  <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-ink-700/70">
                    <input
                      type="checkbox"
                      checked={product.active !== false}
                      onChange={(e) =>
                        toggleProductActive(
                          storeId,
                          product.id,
                          e.target.checked
                        )
                      }
                      className="h-3.5 w-3.5 rounded accent-brand-500"
                    />
                    <span>{product.active !== false ? 'Ativo' : 'Inativo'}</span>
                  </label>

                  <div className="flex items-center gap-0.5">
                    <Link
                      to={`/admin/produtos/${product.id}`}
                      className="focus-ring rounded-md p-1.5 text-ink-700 transition hover:bg-ink-950/5 hover:text-ink-950"
                      aria-label="Editar produto"
                      title="Editar produto"
                    >
                      <Pencil size={14} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setToDelete(product)}
                      className="focus-ring rounded-md p-1.5 text-red-600 transition hover:bg-red-50"
                      aria-label="Excluir produto"
                      title="Excluir produto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return
          try {
            await deleteProduct(storeId, toDelete.id)
            setToDelete(null)
          } catch (err) {
            console.error(err)
            setToDelete(null)
          }
        }}
        title="Excluir produto"
        message={`Tem certeza que deseja excluir "${toDelete?.name}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </div>
  )
}