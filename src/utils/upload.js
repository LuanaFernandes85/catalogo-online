
const CLOUD_NAME =  'dhes5ou3k'
const UPLOAD_PRESET = 'catalogo_images'

// Envia um arquivo para o Cloudinary e devolve a URL pública.
export async function uploadStoreFile(storeId, folder, file) {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', `stores/${storeId}/${folder}`)

    const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    console.error('Erro Cloudinary:', errorData)
    throw new Error('Não foi possível enviar a imagem.')
  }
  
   const data = await response.json()

  return data.secure_url
}

// Por enquanto não excluímos a imagem do Cloudinary pelo navegador.
export async function deleteStoreFile(url) {
  return
}

