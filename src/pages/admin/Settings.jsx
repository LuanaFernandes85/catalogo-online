
import { useEffect, useState } from 'react'
import { Check, Copy, ExternalLink, ImagePlus, X } from 'lucide-react'
import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import PageHeader from '../../components/ui/PageHeader'
import { useStore } from '../../contexts/StoreContext'
import { db } from '../../firebase/config'
import { slugify } from '../../utils/format'
import { uploadStoreFile } from '../../utils/upload'

const emptyForm = {
  slug: '',
  whatsapp: '',
  instagram: '',
  facebook: '',
  address: '',
  hours: '',
  logoUrl: '',
  bannerUrl: '',
  bannerPosition: 50,
}

export default function Settings() {
  const { store, storeId, updateStore } = useStore()

  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const [draggingBanner, setDraggingBanner] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragStartPosition, setDragStartPosition] = useState(50)

  useEffect(() => {
    if (store) {
      setForm({
        slug: store.slug || '',
        whatsapp: store.whatsapp || '',
        instagram: store.instagram || '',
        facebook: store.facebook || '',
        address: store.address || '',
        hours: store.hours || '',
        logoUrl: store.logoUrl || '',
        bannerUrl: store.bannerUrl || '',
        bannerPosition: store.bannerPosition ?? 50,
      })
    }
  }, [store])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setSaved(false)
    setError('')
  }

  async function handleImageUpload(e, field, folder) {
    const file = e.target.files?.[0]

    if (!file) return

    if (field === 'logoUrl') {
      setUploadingLogo(true)
    } else {
      setUploadingBanner(true)
    }

    setError('')

    try {
      const url = await uploadStoreFile(storeId, folder, file)

      set(field, url)

      if (field === 'bannerUrl') {
        set('bannerPosition', 50)
      }

      setSaved(false)
    } catch (err) {
      console.error(err)
      setError('Não foi possível enviar a imagem. Tente novamente.')
    } finally {
      if (field === 'logoUrl') {
        setUploadingLogo(false)
      } else {
        setUploadingBanner(false)
      }

      e.target.value = ''
    }
  }

  function handleBannerPointerDown(e) {
    if (!form.bannerUrl) return

    setDraggingBanner(true)
    setDragStartY(e.clientY)
    setDragStartPosition(form.bannerPosition ?? 50)

    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  function handleBannerPointerMove(e) {
    if (!draggingBanner) return

    const difference = e.clientY - dragStartY
    const movement = difference * 0.5

    const newPosition = Math.max(
      0,
      Math.min(100, dragStartPosition + movement)
    )

    set('bannerPosition', newPosition)
  }

  function handleBannerPointerUp(e) {
    setDraggingBanner(false)

    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch {
      // Ignora caso o ponteiro já tenha sido liberado.
    }
  }

  function removeImage(field) {
    set(field, '')

    if (field === 'bannerUrl') {
      set('bannerPosition', 50)
    }
  }

  const publicUrl = form.slug
    ? `${window.location.origin}/${form.slug}`
    : ''

  function handleCopy() {
    if (!publicUrl) return

    navigator.clipboard.writeText(publicUrl)
    setCopied(true)

    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const cleanSlug = slugify(form.slug)

    if (!cleanSlug) {
      setError('Defina um link (slug) para o seu catálogo.')
      return
    }

    setSaving(true)

    try {
      const q = query(
        collection(db, 'stores'),
        where('slug', '==', cleanSlug),
        limit(1)
      )

      const snap = await getDocs(q)

      const usedByOther = snap.docs.some((d) => d.id !== storeId)

      if (usedByOther) {
        setError(
          'Esse link já está em uso por outra loja. Escolha outro.'
        )
        setSaving(false)
        return
      }

      await updateStore({
        ...form,
        slug: cleanSlug,
      })

      setForm((f) => ({
        ...f,
        slug: cleanSlug,
      }))

      setSaved(true)
    } catch (err) {
      console.error(err)
      setError('Não foi possível salvar as alterações. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Configurações"
        subtitle="Informações usadas no catálogo público e no envio de pedidos pelo WhatsApp."
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-6 rounded-xl2 bg-white p-6 shadow-card"
      >
        {/* LOGO */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-900">
            Logo da loja
          </label>

          <div className="flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-ink-950/10 bg-ink-950/5">
              {form.logoUrl ? (
                <img
                  src={form.logoUrl}
                  alt="Logo da loja"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-center text-xs text-ink-700/40">
                  Sem logo
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-lg border border-ink-950/10 px-3 py-2 text-sm font-medium text-ink-700 hover:border-brand-500 hover:text-brand-500">
                <ImagePlus size={16} />

                {uploadingLogo ? 'Enviando...' : 'Escolher logo'}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={uploadingLogo}
                  onChange={(e) =>
                    handleImageUpload(e, 'logoUrl', 'logo')
                  }
                />
              </label>

              {form.logoUrl && (
                <button
                  type="button"
                  onClick={() => removeImage('logoUrl')}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                >
                  <X size={13} />
                  Remover logo
                </button>
              )}
            </div>
          </div>

          <p className="mt-2 text-xs text-ink-700/50">
            Recomendado: imagem quadrada, como 500x500px.
          </p>
        </div>

        {/* BANNER */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-900">
            Banner da loja
          </label>

          <div
            className={`relative aspect-[16/7] w-full overflow-hidden rounded-xl border border-ink-950/10 bg-ink-950/5 ${
              form.bannerUrl ? 'cursor-grab touch-none' : ''
            } ${draggingBanner ? 'cursor-grabbing' : ''}`}
            onPointerDown={handleBannerPointerDown}
            onPointerMove={handleBannerPointerMove}
            onPointerUp={handleBannerPointerUp}
            onPointerCancel={handleBannerPointerUp}
          >
            {form.bannerUrl ? (
              <>
                <img
                  src={form.bannerUrl}
                  alt="Banner da loja"
                  draggable="false"
                  className="h-full w-full select-none object-cover"
                  style={{
                    objectPosition: `50% ${
                      form.bannerPosition ?? 50
                    }%`,
                  }}
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/70 to-transparent px-3 pb-3 pt-8 text-center text-xs font-medium text-white">
                  Arraste para ajustar o enquadramento
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage('bannerUrl')
                  }}
                  className="absolute right-2 top-2 rounded-full bg-ink-950/70 p-2 text-white transition-colors hover:bg-ink-950"
                  aria-label="Remover banner"
                >
                  <X size={15} />
                </button>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-ink-700/40">
                Nenhum banner cadastrado
              </div>
            )}
          </div>

          {form.bannerUrl && (
            <div className="mt-2 flex items-center justify-between text-xs text-ink-700/50">
              <span>
                Posição: {Math.round(form.bannerPosition ?? 50)}%
              </span>

              <button
                type="button"
                onClick={() => set('bannerPosition', 50)}
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                Centralizar
              </button>
            </div>
          )}

          <label className="focus-ring mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-ink-950/10 px-3 py-2 text-sm font-medium text-ink-700 hover:border-brand-500 hover:text-brand-500">
            <ImagePlus size={16} />

            {uploadingBanner ? 'Enviando...' : 'Escolher banner'}

            <input
              type="file"
              accept="image/*"
              hidden
              disabled={uploadingBanner}
              onChange={(e) =>
                handleImageUpload(e, 'bannerUrl', 'banner')
              }
            />
          </label>

          <p className="mt-2 text-xs text-ink-700/50">
            Recomendado: imagem horizontal, como 1600x600px.
            Arraste a imagem para escolher a parte que ficará visível.
          </p>
        </div>

        {/* LINK DO CATÁLOGO */}
        <div className="border-t border-ink-950/5 pt-4">
          <label className="mb-1.5 block text-sm font-medium text-ink-900">
            Link do catálogo *
          </label>

          <div className="flex items-center overflow-hidden rounded-lg border border-ink-950/10 focus-within:ring-2 focus-within:ring-brand-500">
            <span className="shrink-0 bg-ink-950/5 px-3 py-2.5 text-sm text-ink-700/60">
              /
            </span>

            <input
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              placeholder="minha-loja"
              className="focus-ring w-full border-0 px-1 py-2.5 text-sm outline-none"
              required
            />
          </div>

          {publicUrl && (
            <div className="mt-2 flex items-center gap-3 text-xs text-ink-700/60">
              <span className="truncate">{publicUrl}</span>

              <button
                type="button"
                onClick={handleCopy}
                className="focus-ring inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-medium text-brand-600 hover:bg-brand-50"
              >
                <Copy size={12} />
                {copied ? 'Copiado!' : 'Copiar'}
              </button>

              <a
                href={`/${form.slug}`}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-medium text-brand-600 hover:bg-brand-50"
              >
                <ExternalLink size={12} />
                Abrir
              </a>
            </div>
          )}

          <p className="mt-1 text-xs text-ink-700/50">
            Este é o link que você compartilha com seus clientes. Use apenas
            letras minúsculas, números e hífen.
          </p>
        </div>

        {/* WHATSAPP */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-900">
            WhatsApp para pedidos *
          </label>

          <input
            value={form.whatsapp}
            onChange={(e) => set('whatsapp', e.target.value)}
            placeholder="Ex: 5511999999999 (DDI + DDD + número)"
            className="focus-ring w-full rounded-lg border border-ink-950/10 px-3 py-2.5 text-sm"
            required
          />

          <p className="mt-1 text-xs text-ink-700/50">
            É para este número que o botão "Enviar Pedido" do catálogo abre o
            WhatsApp.
          </p>
        </div>

        {/* INSTAGRAM */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-900">
            Instagram
          </label>

          <input
            value={form.instagram}
            onChange={(e) => set('instagram', e.target.value)}
            placeholder="@sualoja"
            className="focus-ring w-full rounded-lg border border-ink-950/10 px-3 py-2.5 text-sm"
          />
        </div>

        {/* FACEBOOK */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-900">
            Facebook
          </label>

          <input
            value={form.facebook}
            onChange={(e) => set('facebook', e.target.value)}
            placeholder="facebook.com/sualoja"
            className="focus-ring w-full rounded-lg border border-ink-950/10 px-3 py-2.5 text-sm"
          />
        </div>

        {/* ENDEREÇO */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-900">
            Endereço
          </label>

          <input
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="Rua, número, bairro, cidade"
            className="focus-ring w-full rounded-lg border border-ink-950/10 px-3 py-2.5 text-sm"
          />
        </div>

        {/* HORÁRIO */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-900">
            Horário de funcionamento
          </label>

          <textarea
            value={form.hours}
            onChange={(e) => set('hours', e.target.value)}
            rows={2}
            placeholder="Seg a sex, 9h às 18h"
            className="focus-ring w-full rounded-lg border border-ink-950/10 px-3 py-2.5 text-sm"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-ink-950/5 pt-4">
          {saved && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600">
              <Check size={16} />
              Salvo
            </span>
          )}

          <button
            type="submit"
            disabled={saving || uploadingLogo || uploadingBanner}
            className="focus-ring rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}