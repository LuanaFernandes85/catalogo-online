import {
  Package,
  Tags,
  ExternalLink,
  Star,
  Tag,
  CheckCircle,
  XCircle,
  Plus,
  Settings,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/admin/StatCard'

import { useStore } from '../../contexts/StoreContext'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'

export default function Dashboard() {
  const { store, storeId } = useStore()

  const { products = [], loading: productsLoading } = useProducts(storeId)

  const { categories = [], loading: categoriesLoading } =
    useCategories(storeId)

  const featuredProducts = products.filter(
    (product) => product.featured
  )

  const promoProducts = products.filter(
    (product) => product.promo && product.promoPrice
  )

  const availableProducts = products.filter(
    (product) => product.available !== false
  )

  const unavailableProducts = products.filter(
    (product) => product.available === false
  )

  const activeProducts = products.filter(
    (product) => product.active !== false
  )

  const inactiveProducts = products.filter(
    (product) => product.active === false
  )

  const loading = productsLoading || categoriesLoading

  return (
    <div className="space-y-7">
      <PageHeader
        title={`Olá, ${store?.name || 'lojista'} 👋`}
        subtitle="Acompanhe o que está acontecendo no seu catálogo."
      />

      {/* RESUMO */}
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Produtos cadastrados"
            value={loading ? '...' : products.length}
            icon={Package}
            tone="brand"
          />

          <StatCard
            label="Categorias"
            value={loading ? '...' : categories.length}
            icon={Tags}
            tone="clay"
          />

          <StatCard
            label="Produtos em destaque"
            value={loading ? '...' : featuredProducts.length}
            icon={Star}
            tone="brand"
          />

          <StatCard
            label="Em promoção"
            value={loading ? '...' : promoProducts.length}
            icon={Tag}
            tone="clay"
          />

          <StatCard
            label="Disponíveis para venda"
            value={loading ? '...' : availableProducts.length}
            icon={CheckCircle}
            tone="brand"
          />

          <StatCard
            label="Indisponíveis"
            value={loading ? '...' : unavailableProducts.length}
            icon={XCircle}
            tone="clay"
          />
        </div>
      </section>

      {/* CATÁLOGO */}
      {store?.slug && (
        <section className="overflow-hidden rounded-xl2 bg-ink-950 shadow-card">
          <div className="flex flex-col gap-6 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/70">
                Catálogo publicado
              </div>

              <h2 className="font-display text-xl font-bold tracking-tight text-white">
                Sua vitrine está pronta
              </h2>

              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/55">
                Compartilhe o link abaixo com seus clientes para que eles
                possam conhecer seus produtos e enviar pedidos.
              </p>

              <div className="mt-4 flex min-w-0 items-center gap-2">
                <div className="min-w-0 rounded-lg bg-white/5 px-3 py-2">
                  <p className="truncate text-sm font-medium text-brand-300">
                    /{store.slug}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={`/${store.slug}`}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Ver catálogo
              <ExternalLink size={16} />
            </a>
          </div>
        </section>
      )}

      {/* ACESSO RÁPIDO */}
      <section>
        <div className="mb-3">
          <h2 className="font-display text-base font-bold text-ink-950">
            Acesso rápido
          </h2>

          <p className="mt-0.5 text-sm text-ink-700/55">
            Gerencie as principais partes do seu catálogo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/admin/produtos/novo"
            className="group flex items-center justify-between rounded-xl2 border border-ink-950/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                <Plus size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-ink-950">
                  Novo produto
                </p>

                <p className="mt-0.5 text-xs text-ink-700/50">
                  Adicione um produto ao catálogo
                </p>
              </div>
            </div>

            <ArrowRight
              size={17}
              className="text-ink-700/30 transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          <Link
            to="/admin/produtos"
            className="group flex items-center justify-between rounded-xl2 border border-ink-950/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-950/5 text-ink-700">
                <Package size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-ink-950">
                  Produtos
                </p>

                <p className="mt-0.5 text-xs text-ink-700/50">
                  Consulte e edite seus produtos
                </p>
              </div>
            </div>

            <ArrowRight
              size={17}
              className="text-ink-700/30 transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          <Link
            to="/admin/configuracoes"
            className="group flex items-center justify-between rounded-xl2 border border-ink-950/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-clay-500/10 text-clay-600">
                <Settings size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-ink-950">
                  Configurações
                </p>

                <p className="mt-0.5 text-xs text-ink-700/50">
                  Personalize sua loja
                </p>
              </div>
            </div>

            <ArrowRight
              size={17}
              className="text-ink-700/30 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>

      {/* STATUS DO CATÁLOGO */}
      <section className="rounded-xl2 border border-ink-950/5 bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-ink-950">
              Status do catálogo
            </h2>

            <p className="mt-1 text-sm text-ink-700/55">
              Uma visão rápida da situação dos seus produtos.
            </p>
          </div>

          {!loading && (
            <div className="flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Catálogo ativo
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-ink-950/[0.025] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-700/55">
                Produtos ativos
              </span>

              <CheckCircle
                size={16}
                className="text-brand-500"
              />
            </div>

            <p className="mt-2 text-xl font-bold text-ink-950">
              {loading ? '...' : activeProducts.length}
            </p>
          </div>

          <div className="rounded-lg bg-ink-950/[0.025] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-700/55">
                Produtos inativos
              </span>

              <XCircle
                size={16}
                className="text-ink-700/35"
              />
            </div>

            <p className="mt-2 text-xl font-bold text-ink-950">
              {loading ? '...' : inactiveProducts.length}
            </p>
          </div>

          <div className="rounded-lg bg-ink-950/[0.025] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-700/55">
                Categorias cadastradas
              </span>

              <Tags
                size={16}
                className="text-clay-500"
              />
            </div>

            <p className="mt-2 text-xl font-bold text-ink-950">
              {loading ? '...' : categories.length}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}