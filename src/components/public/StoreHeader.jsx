import {
  Search,
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
} from 'lucide-react'

export default function StoreHeader({ store, search, onSearchChange }) {
  function getWhatsAppUrl(number) {
    if (!number) return ''

    const phone = number.replace(/\D/g, '')

    return `https://wa.me/${phone}`
  }

  function getInstagramUrl(value) {
    if (!value) return ''

    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value
    }

    return `https://instagram.com/${value.replace('@', '')}`
  }

  function getFacebookUrl(value) {
    if (!value) return ''

    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value
    }

    return `https://${value}`
  }

  const whatsappUrl = getWhatsAppUrl(store.whatsapp)
  const instagramUrl = getInstagramUrl(store.instagram)
  const facebookUrl = getFacebookUrl(store.facebook)

  return (
    <header className="bg-canvas">
      {/* BANNER */}
      <div className="relative h-48 w-full overflow-hidden bg-ink-950 sm:h-64 lg:h-72">
        {store.bannerUrl ? (
          <img
            src={store.bannerUrl}
            alt={`Banner da ${store.name}`}
            className="h-full w-full object-cover"
            style={{
              objectPosition: `50% ${store.bannerPosition ?? 50}%`,
            }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-700 via-brand-600 to-ink-950" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-ink-950/5 to-transparent" />
      </div>

      {/* CONTEÚDO DA LOJA */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative">
          {/* IDENTIDADE */}
          <div className="flex flex-col items-center">
            <div className="-mt-9 h-[84px] w-[84px] overflow-hidden rounded-2xl border-4 border-canvas bg-white shadow-card sm:-mt-11 sm:h-24 sm:w-24">
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-brand-500 font-display text-3xl font-bold text-white">
                  {store.name?.[0]?.toUpperCase() || 'L'}
                </div>
              )}
            </div>

            <div className="mt-3 text-center">
              <h1 className="font-display text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
                {store.name}
              </h1>

              {(store.address || store.hours) && (
                <div className="mt-2 flex flex-col items-center gap-1.5 text-xs text-ink-700/65 sm:flex-row sm:justify-center sm:gap-4 sm:text-sm">
                  {store.address && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="shrink-0" />
                      <span>{store.address}</span>
                    </span>
                  )}

                  {store.hours && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} className="shrink-0" />
                      <span className="whitespace-pre-line">{store.hours}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* AÇÕES */}
          {(whatsappUrl || instagramUrl || facebookUrl) && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-card"
                >
                  <MessageCircle size={15} />
                  WhatsApp
                </a>
              )}

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink-950/10 bg-white px-4 py-2.5 text-xs font-semibold text-ink-900 transition-all hover:-translate-y-0.5 hover:bg-ink-950/5"
                >
                  <Instagram size={15} />
                  Instagram
                </a>
              )}

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink-950/10 bg-white px-4 py-2.5 text-xs font-semibold text-ink-900 transition-all hover:-translate-y-0.5 hover:bg-ink-950/5"
                >
                  <Facebook size={15} />
                  Facebook
                </a>
              )}
            </div>
          )}

          {/* BUSCA */}
          <div className="relative mt-6">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-700/40"
            />

            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar produtos..."
              aria-label="Buscar produtos"
              className="focus-ring w-full rounded-xl2 border border-ink-950/10 bg-white py-3.5 pl-11 pr-4 text-sm text-ink-950 shadow-card outline-none transition-shadow placeholder:text-ink-700/40 focus:shadow-lg"
            />
          </div>
        </div>
      </div>
    </header>
  )
}