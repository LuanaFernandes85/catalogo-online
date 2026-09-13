import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Info,
  Package,
  Percent,
  Star,
  Tag,
  X,
} from 'lucide-react'

import PageHeader from '../../components/ui/PageHeader'
import { useStore } from '../../contexts/StoreContext'
import { useCategories } from '../../hooks/useCategories'
import {
  createProduct,
  updateProduct,
} from '../../hooks/useProducts'
import {
  uploadStoreFile,
  deleteStoreFile,
} from '../../utils/upload'
import { db } from '../../firebase/config'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  code: '',
  categoryId: '',
  brand: '',
  images: [],
  featured: false,
  promo: false,
  promoPrice: '',
  available: true,
  active: true,
}

export default function ProductForm() {
  const { productId } = useParams()
  const isEditing = !!productId
  const navigate = useNavigate()

  const { storeId } = useStore()
  const { categories } = useCategories(storeId)

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditing || !storeId) return

    async function load() {
      try {
        const snap = await getDoc(
          doc(
            db,
            'stores',
            storeId,
            'products',
            productId
          )
        )

        if (snap.exists()) {
          setForm({
            ...emptyForm,
            ...snap.data(),
            images: Array.isArray(snap.data().images)
              ? snap.data().images
              : [],
          })
        }
      } catch (err) {
        console.error(err)
        setError(
          'Não foi possível carregar o produto. Tente novamente.'
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isEditing, storeId, productId])

  function set(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
    }))

    setError('')
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    setUploading(true)
    setError('')

    try {
      const urls = await Promise.all(
        files.map((file) =>
          uploadStoreFile(storeId, 'produtos', file)
        )
      )

      setForm((current) => ({
        ...current,
        images: [...current.images, ...urls],
      }))
    } catch (err) {
      console.error(err)
      setError(
        'Não foi possível enviar as imagens. Tente novamente.'
      )
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function removeImage(url) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((image) => image !== url),
    }))

    try {
      await deleteStoreFile(url)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const name = form.name.trim()
    const price = Number(form.price)
    const promoPrice = form.promoPrice
      ? Number(form.promoPrice)
      : null

    if (!name) {
      setError('Informe o nome do produto.')
      return
    }

    if (!form.price || Number.isNaN(price) || price <= 0) {
      setError('Informe um preço válido para o produto.')
      return
    }

    if (
      form.promo &&
      (!promoPrice ||
        Number.isNaN(promoPrice) ||
        promoPrice <= 0)
    ) {
      setError(
        'Informe um preço promocional válido.'
      )
      return
    }

    if (form.promo && promoPrice >= price) {
      setError(
        'O preço promocional deve ser menor que o preço normal.'
      )
      return
    }

    setSaving(true)

    try {
      const payload = {
        ...form,
        name,
        price,
        promoPrice: form.promo ? promoPrice : null,
      }

      if (isEditing) {
        await updateProduct(
          storeId,
          productId,
          payload
        )
      } else {
        await createProduct(storeId, payload)
      }

      navigate('/admin/produtos')
    } catch (err) {
      console.error(err)
      setError(
        'Não foi possível salvar o produto. Tente novamente.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="pb-10">
      <button
        type="button"
        onClick={() => navigate('/admin/produtos')}
        className="focus-ring mb-5 inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-ink-950"
      >
        <ArrowLeft size={16} />
        Voltar para produtos
      </button>

      <PageHeader
        title={isEditing ? 'Editar produto' : 'Novo produto'}
        subtitle={
          isEditing
            ? 'Atualize as informações e a apresentação deste produto.'
            : 'Cadastre um produto para disponibilizá-lo no seu catálogo.'
        }
      />

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-4xl space-y-5"
      >
        {/* =========================
            INFORMAÇÕES PRINCIPAIS
        ========================== */}
        <section className="overflow-hidden rounded-xl2 bg-white shadow-card">
          <div className="border-b border-ink-950/5 px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                <Package size={18} />
              </div>

              <div>
                <h2 className="font-display text-base font-bold text-ink-950">
                  Informações do produto
                </h2>

                <p className="mt-0.5 text-xs text-ink-700/50">
                  Preencha os dados principais do produto.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-ink-900">
                Nome do produto *
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  set('name', e.target.value)
                }
                placeholder="Ex: Tênis Nike Air Max"
                className="focus-ring w-full rounded-lg border border-ink-950/10 bg-white px-3.5 py-3 text-sm placeholder:text-ink-700/30"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-ink-900">
                Descrição
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  set('description', e.target.value)
                }
                rows={4}
                placeholder="Descreva detalhes importantes sobre o produto..."
                className="focus-ring w-full resize-y rounded-lg border border-ink-950/10 bg-white px-3.5 py-3 text-sm placeholder:text-ink-700/30"
              />

              <p className="mt-1.5 text-xs text-ink-700/40">
                Uma boa descrição ajuda o cliente a entender melhor o produto.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-900">
                Marca
              </label>

              <input
                value={form.brand}
                onChange={(e) =>
                  set('brand', e.target.value)
                }
                placeholder="Ex: Nike"
                className="focus-ring w-full rounded-lg border border-ink-950/10 bg-white px-3.5 py-3 text-sm placeholder:text-ink-700/30"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-900">
                Código do produto
              </label>

              <input
                value={form.code}
                onChange={(e) =>
                  set('code', e.target.value)
                }
                placeholder="Ex: NK-001"
                className="focus-ring w-full rounded-lg border border-ink-950/10 bg-white px-3.5 py-3 text-sm placeholder:text-ink-700/30"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-900">
                Categoria
              </label>

              <select
                value={form.categoryId}
                onChange={(e) =>
                  set('categoryId', e.target.value)
                }
                className="focus-ring w-full rounded-lg border border-ink-950/10 bg-white px-3.5 py-3 text-sm"
              >
                <option value="">
                  Sem categoria
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* =========================
            IMAGENS
        ========================== */}
        <section className="overflow-hidden rounded-xl2 bg-white shadow-card">
          <div className="border-b border-ink-950/5 px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                <ImagePlus size={18} />
              </div>

              <div>
                <h2 className="font-display text-base font-bold text-ink-950">
                  Imagens
                </h2>

                <p className="mt-0.5 text-xs text-ink-700/50">
                  Adicione fotos para apresentar melhor o produto.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {form.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {form.images.map((url, index) => (
                  <div
                    key={url}
                    className={`group relative aspect-square overflow-hidden rounded-xl border bg-ink-950/5 ${
                      index === 0
                        ? 'border-brand-500 ring-2 ring-brand-500/10'
                        : 'border-ink-950/10'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${form.name || 'Produto'} - imagem ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold text-ink-900 shadow-sm">
                        <Check size={11} />
                        Principal
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(url)
                      }
                      disabled={uploading}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/75 text-white opacity-100 transition-all hover:bg-red-600 disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Remover imagem"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}

                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-950/10 bg-ink-950/[0.015] text-ink-700/45 transition-colors hover:border-brand-500/50 hover:bg-brand-500/[0.03] hover:text-brand-600">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-ink-950/5">
                    <ImagePlus size={18} />
                  </div>

                  <span className="text-xs font-semibold">
                    {uploading
                      ? 'Enviando...'
                      : 'Adicionar foto'}
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            ) : (
              <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-950/10 bg-ink-950/[0.015] px-6 text-center transition-colors hover:border-brand-500/50 hover:bg-brand-500/[0.03]">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                  <ImagePlus size={22} />
                </div>

                <p className="text-sm font-semibold text-ink-900">
                  {uploading
                    ? 'Enviando imagens...'
                    : 'Adicione fotos do produto'}
                </p>

                <p className="mt-1 max-w-sm text-xs leading-relaxed text-ink-700/45">
                  Escolha uma ou mais imagens. A primeira imagem será usada como foto principal.
                </p>

                <span className="mt-4 rounded-lg bg-ink-950 px-4 py-2 text-xs font-semibold text-white">
                  {uploading
                    ? 'Enviando...'
                    : 'Escolher imagens'}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            )}

            {form.images.length > 0 && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-ink-950/[0.025] px-3 py-2.5 text-xs text-ink-700/55">
                <Info
                  size={14}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  A primeira imagem será exibida como foto principal do produto no catálogo.
                </span>
              </div>
            )}
          </div>
        </section>

        {/* =========================
            PREÇO
        ========================== */}
        <section className="overflow-hidden rounded-xl2 bg-white shadow-card">
          <div className="border-b border-ink-950/5 px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                <Tag size={18} />
              </div>

              <div>
                <h2 className="font-display text-base font-bold text-ink-950">
                  Preço e promoção
                </h2>

                <p className="mt-0.5 text-xs text-ink-700/50">
                  Defina o preço de venda e, se quiser, uma oferta especial.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="max-w-sm">
              <label className="mb-1.5 block text-sm font-semibold text-ink-900">
                Preço de venda *
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-ink-700/50">
                  R$
                </span>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    set('price', e.target.value)
                  }
                  placeholder="0,00"
                  className="focus-ring w-full rounded-lg border border-ink-950/10 bg-white py-3 pl-10 pr-3 text-sm font-medium placeholder:text-ink-700/30"
                  required
                />
              </div>
            </div>

            <div className="border-t border-ink-950/5 pt-5">
              <label
                className={`flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 transition-colors ${
                  form.promo
                    ? 'border-brand-500/30 bg-brand-500/[0.035]'
                    : 'border-ink-950/10 hover:border-ink-950/20'
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      form.promo
                        ? 'bg-brand-500/10 text-brand-600'
                        : 'bg-ink-950/5 text-ink-700/50'
                    }`}
                  >
                    <Percent size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      Produto em promoção
                    </p>

                    <p className="mt-0.5 text-xs leading-relaxed text-ink-700/50">
                      Ative para mostrar um preço especial no catálogo.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={form.promo}
                  onChange={(e) =>
                    set('promo', e.target.checked)
                  }
                  className="mt-1 h-5 w-5 shrink-0 rounded accent-brand-500"
                />
              </label>

              {form.promo && (
                <div className="mt-4 max-w-sm">
                  <label className="mb-1.5 block text-sm font-semibold text-ink-900">
                    Preço promocional *
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-ink-700/50">
                      R$
                    </span>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.promoPrice}
                      onChange={(e) =>
                        set(
                          'promoPrice',
                          e.target.value
                        )
                      }
                      placeholder="0,00"
                      className="focus-ring w-full rounded-lg border border-brand-500/30 bg-white py-3 pl-10 pr-3 text-sm font-medium placeholder:text-ink-700/30"
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-ink-700/45">
                    O preço promocional deve ser menor que o preço de venda.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================
            VISIBILIDADE
        ========================== */}
        <section className="overflow-hidden rounded-xl2 bg-white shadow-card">
          <div className="border-b border-ink-950/5 px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                <Star size={18} />
              </div>

              <div>
                <h2 className="font-display text-base font-bold text-ink-950">
                  Visibilidade
                </h2>

                <p className="mt-0.5 text-xs text-ink-700/50">
                  Controle como o produto será apresentado no catálogo.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:p-6">
            <label
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
                form.available
                  ? 'border-brand-500/25 bg-brand-500/[0.025]'
                  : 'border-ink-950/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    form.available
                      ? 'bg-brand-500/10 text-brand-600'
                      : 'bg-ink-950/5 text-ink-700/45'
                  }`}
                >
                  <Check size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    Disponível para venda
                  </p>

                  <p className="mt-0.5 text-xs text-ink-700/45">
                    Clientes podem solicitar este produto.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) =>
                  set(
                    'available',
                    e.target.checked
                  )
                }
                className="h-5 w-5 shrink-0 rounded accent-brand-500"
              />
            </label>

            <label
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
                form.featured
                  ? 'border-brand-500/25 bg-brand-500/[0.025]'
                  : 'border-ink-950/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    form.featured
                      ? 'bg-brand-500/10 text-brand-600'
                      : 'bg-ink-950/5 text-ink-700/45'
                  }`}
                >
                  <Star
                    size={17}
                    fill={
                      form.featured
                        ? 'currentColor'
                        : 'none'
                    }
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    Produto em destaque
                  </p>

                  <p className="mt-0.5 text-xs text-ink-700/45">
                    Pode aparecer na seção de destaques.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  set(
                    'featured',
                    e.target.checked
                  )
                }
                className="h-5 w-5 shrink-0 rounded accent-brand-500"
              />
            </label>
          </div>
        </section>

        {/* =========================
            ERRO
        ========================== */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
          >
            <X
              size={17}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>
        )}

        {/* =========================
            AÇÕES
        ========================== */}
        <div className="sticky bottom-3 z-10 rounded-xl2 border border-ink-950/10 bg-white/95 p-3 shadow-card backdrop-blur sm:p-4">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="hidden text-xs text-ink-700/40 sm:block">
              {isEditing
                ? 'As alterações serão aplicadas ao catálogo imediatamente.'
                : 'O produto ficará disponível no catálogo após ser salvo.'}
            </p>

            <div className="flex w-full gap-2 sm:w-auto">
              <button
                type="button"
                onClick={() =>
                  navigate('/admin/produtos')
                }
                disabled={saving || uploading}
                className="focus-ring flex-1 rounded-lg border border-ink-950/10 px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-950/5 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving || uploading}
                className="focus-ring flex-1 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
              >
                {saving
                  ? 'Salvando...'
                  : isEditing
                    ? 'Salvar alterações'
                    : 'Cadastrar produto'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}