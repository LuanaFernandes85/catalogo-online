import { useMemo, useState, useEffect } from 'react'
import { ShoppingBag, Star, Tag } from 'lucide-react'
import StoreHeader from '../../components/public/StoreHeader'
import CategoryFilter from '../../components/public/CategoryFilter'
import ProductCard from '../../components/public/ProductCard'
import ProductModal from '../../components/public/ProductModal'
import CartDrawer from '../../components/public/CartDrawer'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { useCart } from '../../contexts/CartContext'

export default function Catalog({ store }) {
  const { products, loading } = useProducts(store.id, {
    onlyAvailable: true,
  })

  const { categories } = useCategories(store.id)
  const { itemCount } = useCart()

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)

  // Atualiza o título da página dinamicamente com o nome da loja (Essencial para SaaS)
  useEffect(() => {
    if (store?.name) {
      document.title = `${store.name} | Catálogo Online`
    }
  }, [store])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return products.filter((p) => {
      const matchesCategory =
        activeCategory === 'all' ||
        p.categoryId === activeCategory

      const matchesSearch =
        !term ||
        p.name?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term) ||
        p.code?.toLowerCase().includes(term)

      return matchesCategory && matchesSearch
    })
  }, [products, search, activeCategory])

  const featuredProducts = useMemo(() => {
    return filtered.filter((product) => product.featured)
  }, [filtered])

  const promoProducts = useMemo(() => {
    return filtered.filter(
      (product) => product.promo && product.promoPrice
    )
  }, [filtered])

  const isFiltering = search.trim() !== '' || activeCategory !== 'all'

  return (
    <div className="min-h-screen bg-canvas pb-24">
      <StoreHeader
        store={store}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">

        {/* Categorias */}
        {categories.length > 0 && (
          <div className="mb-7">
            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        )}

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-ink-700/70">
              {products.length === 0
                ? 'Esta loja ainda não cadastrou produtos.'
                : 'Nenhum produto encontrado para essa busca.'}
            </p>
          </div>
        ) : (
          <>
            {/* Destaques */}
            {!isFiltering && featuredProducts.length > 0 && (
              <section className="mb-10">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/10">
                    <Star
                      size={17}
                      className="text-brand-600"
                      fill="currentColor"
                    />
                  </div>

                  <div>
                    <h2 className="font-display text-lg font-bold text-ink-950">
                      Destaques
                    </h2>

                    <p className="text-xs text-ink-700/50">
                      Produtos selecionados para você
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {featuredProducts.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpen={setSelectedProduct}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Promoções */}
            {!isFiltering && promoProducts.length > 0 && (
              <section className="mb-10">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-clay-500/10">
                    <Tag
                      size={17}
                      className="text-clay-600"
                      fill="currentColor"
                    />
                  </div>

                  <div>
                    <h2 className="font-display text-lg font-bold text-ink-950">
                      Promoções
                    </h2>

                    <p className="text-xs text-ink-700/50">
                      Aproveite os preços especiais
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {promoProducts.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpen={setSelectedProduct}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Todos os produtos */}
            <section>
              <div className="mb-4">
                <h2 className="font-display text-lg font-bold text-ink-950">
                  {isFiltering ? 'Resultados' : 'Todos os produtos'}
                </h2>

                <p className="mt-0.5 text-xs text-ink-700/50">
                  {filtered.length}{' '}
                  {filtered.length === 1
                    ? 'produto encontrado'
                    : 'produtos encontrados'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={setSelectedProduct}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Botão do carrinho */}
      {itemCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="focus-ring fixed bottom-5 right-5 z-20 flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 sm:right-8"
        >
          <ShoppingBag size={18} />

          Ver pedido

          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-xs font-bold text-white">
            {itemCount}
          </span>
        </button>
      )}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        store={store}
      />

      <footer className="mt-14 border-t border-ink-950/5 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {/* Loja */}
            <div>
              <h3 className="font-display text-lg font-bold text-ink-950">
                {store.name}
              </h3>

              {store.address && (
                <p className="mt-3 text-sm leading-relaxed text-ink-700/70">
                  {store.address}
                </p>
              )}

              {store.hours && (
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-700/70">
                  {store.hours}
                </p>
              )}
            </div>

            {/* Contato */}
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-950">
                Contato
              </h3>

              <div className="mt-3 space-y-2 text-sm">
                {store.whatsapp && (
                  <a
                    href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-ink-700/70 transition-colors hover:text-brand-600"
                  >
                    WhatsApp
                  </a>
                )}

                {store.instagram && (
                  <a
                    href={
                      store.instagram.startsWith('http')
                        ? store.instagram
                        : `https://instagram.com/${store.instagram.replace('@', '')}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="block text-ink-700/70 transition-colors hover:text-brand-600"
                  >
                    Instagram
                  </a>
                )}

                {store.facebook && (
                  <a
                    href={
                      store.facebook.startsWith('http')
                        ? store.facebook
                        : `https://${store.facebook}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="block text-ink-700/70 transition-colors hover:text-brand-600"
                  >
                    Facebook
                  </a>
                )}
              </div>
            </div>

            {/* Plataforma */}
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-950">
                Catálogo Digital
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-ink-700/60">
                Catálogo online para apresentar produtos e receber pedidos
                diretamente pelo WhatsApp.
              </p>
            </div>
          </div>

          {/* Linha inferior */}
          <div className="mt-8 border-t border-ink-950/5 pt-5 text-center">
            <p className="text-xs text-ink-700/40">
              © {new Date().getFullYear()} {store.name}. Todos os direitos reservados.
            </p>

            <p className="mt-1 text-xs text-ink-700/30">
              Desenvolvido por <span className="font-medium">GRAND</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}