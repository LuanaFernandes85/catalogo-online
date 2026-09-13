
import { useState } from 'react'
import { X, Minus, Plus, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatPrice } from '../../utils/format'
import { useCart } from '../../contexts/CartContext'

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)

  if (!product) return null

  const hasPromo = product.promo && product.promoPrice
  const unitPrice = hasPromo ? product.promoPrice : product.price
  const images = product.images?.length ? product.images : [null]

  function handleAdd() {
    addItem(product, quantity)
    setAdded(true)

    setTimeout(() => {
      onClose()
      setAdded(false)
      setQuantity(1)
      setActiveImage(0)
    }, 500)
  }

  function previousImage() {
    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    )
  }

  function nextImage() {
    setActiveImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/40 sm:items-center sm:p-4">
      {/* Fundo */}
      <div
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-card sm:rounded-xl2">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="focus-ring absolute right-3 top-3 z-30 rounded-full bg-white/95 p-2 text-ink-950 shadow-card transition-transform hover:scale-105"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        {/* Foto principal */}
        <div className="relative h-[280px] w-full shrink-0 bg-ink-950/5 sm:h-[320px]">
          {images[activeImage] ? (
          <img
            src={images[activeImage]}
            alt={product.name}
            className="h-full w-full object-contain p-3"
          />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink-700/30">
              Sem foto
            </div>
          )}

          {/* Selo de promoção */}
          {hasPromo && (
            <span className="absolute left-4 top-4 rounded-full bg-clay-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              Promoção
            </span>
          )}

          {/* Setas */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={previousImage}
                className="focus-ring absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-950 shadow-card transition hover:bg-white"
                aria-label="Foto anterior"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="focus-ring absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-950 shadow-card transition hover:bg-white"
                aria-label="Próxima foto"
              >
                <ChevronRight size={20} />
              </button>

              {/* Indicador */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink-950/70 px-3 py-1 text-xs font-medium text-white">
                {activeImage + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-b border-ink-950/5 px-4 py-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(idx)}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  activeImage === idx
                    ? 'border-brand-500'
                    : 'border-transparent'
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Informações */}
        <div className="overflow-y-auto">
          <div className="space-y-3 p-5">
            {/* Marca */}
            {product.brand && (
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-700/50">
                {product.brand}
              </p>
            )}

            {/* Nome */}
            <h2 className="font-display text-xl font-bold leading-tight text-ink-950">
              {product.name}
            </h2>

            {/* Preço */}
            <div className="flex flex-wrap items-baseline gap-2">
              {hasPromo ? (
                <>
                  <span className="font-display text-2xl font-bold text-brand-600">
                    {formatPrice(product.promoPrice)}
                  </span>

                  <span className="text-sm text-ink-700/40 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="font-display text-2xl font-bold text-ink-950">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Descrição */}
            {product.description && (
              <div>
                <p className="mb-1 text-sm font-semibold text-ink-950">
                  Descrição
                </p>

                <p className="text-sm leading-relaxed text-ink-700/80">
                  {product.description}
                </p>
              </div>
            )}

            {/* Código */}
            {product.code && (
              <p className="text-xs text-ink-700/50">
                Código: {product.code}
              </p>
            )}

            {/* Quantidade */}
            <div className="flex items-center justify-between border-t border-ink-950/5 pt-3">
              <span className="text-sm font-semibold text-ink-900">
                Quantidade
              </span>

              <div className="flex items-center gap-3 rounded-full bg-ink-950/5 px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="focus-ring rounded-full p-1.5 hover:bg-white"
                  aria-label="Diminuir"
                >
                  <Minus size={16} />
                </button>

                <span className="w-6 text-center text-sm font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="focus-ring rounded-full p-1.5 hover:bg-white"
                  aria-label="Aumentar"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Adicionar */}
            <button
              type="button"
              onClick={handleAdd}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-600 active:scale-[0.98]"
            >
              <ShoppingBag size={18} />

              {added
                ? 'Adicionado ao pedido!'
                : `Adicionar · ${formatPrice(unitPrice * quantity)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}