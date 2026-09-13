import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// Carrinho da área PÚBLICA. Fica isolado por loja (storeSlug) para que,
// no futuro SaaS, um cliente possa navegar em catálogos de lojas diferentes
// sem misturar os pedidos.
const CartContext = createContext(null)

export function CartProvider({ storeSlug, children }) {
  const storageKey = `catalogo-carrinho:${storeSlug}`
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items, storageKey])

  function addItem(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          code: product.code,
          price: product.promo && product.promoPrice ? product.promoPrice : product.price,
          image: product.images?.[0] || null,
          quantity,
        },
      ]
    })
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) => prev.map((i) => (i.id === productId ? { ...i, quantity } : i)))
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }

  function clearCart() {
    setItems([])
  }

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const value = { items, addItem, updateQuantity, removeItem, clearCart, total, itemCount }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider')
  return ctx
}
