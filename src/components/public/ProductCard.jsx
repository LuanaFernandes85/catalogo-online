import { ArrowUpRight } from 'lucide-react'
import { formatPrice } from '../../utils/format'

export default function ProductCard({ product, onOpen }) {
  const hasPromo =
    product.promo &&
    product.promoPrice !== null &&
    product.promoPrice !== undefined &&
    Number(product.promoPrice) > 0

  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      className="focus-ring group w-full text-left"
    >
      <article className="relative overflow-hidden rounded-xl2 border border-ink-950/5 bg-white shadow-card transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
        {/* IMAGEM */}
        <div className="relative aspect-square overflow-hidden bg-ink-950/[0.025]">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink-700/30">
              Sem foto
            </div>
          )}

          {/* PROMOÇÃO */}
          {hasPromo && (
            <span className="absolute left-3 top-3 rounded-full bg-clay-500 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm">
              OFERTA
            </span>
          )}

          {/* INDICADOR DE ABERTURA */}
          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-950 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight size={15} />
          </span>
        </div>

        {/* INFORMAÇÕES */}
        <div className="p-3.5">
          <p className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-ink-950">
            {product.name}
          </p>

          {product.brand && (
            <p className="mt-1.5 line-clamp-1 text-xs font-medium text-ink-700/50">
              {product.brand}
            </p>
          )}

          {/* PREÇO */}
          <div className="mt-2.5">
            {hasPromo ? (
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="font-display text-lg font-bold tracking-tight text-brand-600">
                  {formatPrice(product.promoPrice)}
                </span>

                <span className="text-xs font-medium text-ink-700/40 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="font-display text-lg font-bold tracking-tight text-ink-950">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* INDICAÇÃO SUTIL */}
          <p className="mt-2 text-[11px] font-medium text-ink-700/35 transition-colors group-hover:text-brand-600">
            Ver detalhes
          </p>
        </div>
      </article>
    </button>
  )
}