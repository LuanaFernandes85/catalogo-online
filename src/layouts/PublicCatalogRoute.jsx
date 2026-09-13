import { useParams } from 'react-router-dom'
import { useStoreBySlug } from '../hooks/useStoreBySlug'
import { CartProvider } from '../contexts/CartContext'
import Catalog from '../pages/public/Catalog'
import NotFound from '../pages/NotFound'

// Esta é a porta de entrada da área pública: /:storeSlug
// Resolve qual loja é essa, e só então monta o catálogo + carrinho dela.
// Nenhum componente administrativo é importado aqui.
export default function PublicCatalogRoute() {
  const { storeSlug } = useParams()
  const { store, loading, error } = useStoreBySlug(storeSlug)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  if (error || !store) {
    return <NotFound message="Não encontramos esta loja. Confira o link e tente novamente." />
  }

  return (
    <CartProvider storeSlug={storeSlug}>
      <Catalog store={store} />
    </CartProvider>
  )
}
