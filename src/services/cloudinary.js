const CLOUD_NAME =  'dhes5ou3k'
const UPLOAD_PRESET = 'catalogo_images'

export async function uploadImage(file) {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: 'POST',
            body: formData,
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao enviar imagem para o Cloudinary')
    }

    const data = await response.json()

    return data.secure_url
}
    
