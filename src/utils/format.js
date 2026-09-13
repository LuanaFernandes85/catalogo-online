export function formatPrice(value) {
  const number = Number(value) || 0
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
