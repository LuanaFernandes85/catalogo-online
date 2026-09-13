import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/format'
import { buildWhatsAppOrderUrl } from '../../utils/whatsapp'

export default function CartDrawer({ open, onClose, store }) {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()

  function handleSendOrder() {
    const url = buildWhatsAppOrderUrl({
      storeName: store.name,
      whatsappNumber: store.whatsapp,
      items,
      total,
    })
    window.open(url, '_blank')
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-ink-950/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-card transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-950/5 px-5 py-4">
          <h2 className="font-display text-lg font-bold text-ink-950">Seu pedido</h2>
          <button onClick={onClose} className="focus-ring rounded-lg p-1.5 hover:bg-ink-950/5" aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag size={40} className="text-ink-700/20" />
            <p className="text-sm text-ink-700/60">Seu carrinho está vazio. Adicione produtos do catálogo.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-950/5">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-ink-700/30">Sem foto</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-ink-950">{item.name}</p>
                    <p className="mt-0.5 text-sm text-brand-600">{formatPrice(item.price)}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full bg-ink-950/5 px-1.5 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="focus-ring rounded-full p-1 hover:bg-white"
                          aria-label="Diminuir"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-4 text-center text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="focus-ring rounded-full p-1 hover:bg-white"
                          aria-label="Aumentar"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="focus-ring rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                        aria-label="Remover"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="focus-ring text-xs font-medium text-ink-700/50 hover:text-red-500">
                Esvaziar carrinho
              </button>
            </div>

            <div className="space-y-3 border-t border-ink-950/5 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink-700">Total</span>
                <span className="font-display text-xl font-bold text-ink-950">{formatPrice(total)}</span>
              </div>
              <button
                onClick={handleSendOrder}
                className="focus-ring flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Enviar Pedido pelo WhatsApp
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
