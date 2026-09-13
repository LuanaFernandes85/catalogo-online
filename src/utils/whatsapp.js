import { formatPrice } from './format'

// Remove tudo que não for número, garantindo compatibilidade com o formato
// exigido pelo WhatsApp (código do país + DDD + número).
function onlyDigits(value = '') {
  return value.replace(/\D/g, '')
}

// Monta a mensagem do pedido e devolve a URL do wa.me pronta para abrir.
export function buildWhatsAppOrderUrl({ storeName, whatsappNumber, items, total }) {
  const phone = onlyDigits(whatsappNumber)

  const lines = [
    `Olá, ${storeName}! Gostaria de fazer o seguinte pedido:`,
    '',
    ...items.map(
      (item, idx) =>
        `${idx + 1}. ${item.name}${item.code ? ` (Cód. ${item.code})` : ''} — Qtd: ${
          item.quantity
        } — ${formatPrice(item.price * item.quantity)}`
    ),
    '',
    `Total: ${formatPrice(total)}`,
  ]

  const message = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${phone}?text=${message}`
}
