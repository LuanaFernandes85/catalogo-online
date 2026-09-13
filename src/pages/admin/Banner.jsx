import { useState } from 'react'
import { ImagePlus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import { useStore } from '../../contexts/StoreContext'
import { uploadStoreFile } from '../../utils/upload'

export default function Banner() {
  const { store, storeId, updateStore } = useStore()
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  async function handleUpload(e, field, setUploading) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadStoreFile(storeId, field, file)
      await updateStore({ [`${field}Url`]: url })
    } catch (err) {
      console.error(`Erro ao enviar ${field}:`, err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <PageHeader
        title="Banner e logo"
        subtitle="Essas imagens aparecem no topo do catálogo público da sua loja."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* BANNER PRINCIPAL */}
        <div className="rounded-xl2 bg-white p-6 shadow-card">
          <h2 className="mb-1 font-display font-bold text-ink-950">Banner principal</h2>
          <p className="mb-4 text-sm text-ink-700/70">Recomendado: imagem larga, formato 16:6.</p>

          <div className="mb-4 aspect-[16/6] w-full overflow-hidden rounded-lg bg-ink-950/5">
            {store?.bannerUrl ? (
              <img src={store.bannerUrl} alt="Banner da loja" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-ink-700/40">
                Nenhum banner enviado
              </div>
            )}
          </div>

          <label className={`focus-ring inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 ${uploadingBanner ? 'opacity-60 cursor-not-allowed' : ''}`}>
            <ImagePlus size={18} />
            {uploadingBanner ? 'Enviando...' : 'Enviar banner'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleUpload(e, 'banner', setUploadingBanner)}
              disabled={uploadingBanner}
            />
          </label>
        </div>

        {/* LOGO DA LOJA */}
        <div className="rounded-xl2 bg-white p-6 shadow-card">
          <h2 className="mb-1 font-display font-bold text-ink-950">Logo da loja</h2>
          <p className="mb-4 text-sm text-ink-700/70">Recomendado: imagem quadrada, fundo transparente.</p>

          <div className="mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-ink-950/5">
            {store?.logoUrl ? (
              <img src={store.logoUrl} alt="Logo da loja" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm text-ink-700/40">Sem logo</span>
            )}
          </div>

          <label className={`focus-ring inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 ${uploadingLogo ? 'opacity-60 cursor-not-allowed' : ''}`}>
            <ImagePlus size={18} />
            {uploadingLogo ? 'Enviando...' : 'Enviar logo'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleUpload(e, 'logo', setUploadingLogo)}
              disabled={uploadingLogo}
            />
          </label>
        </div>
      </div>
    </div>
  )
}