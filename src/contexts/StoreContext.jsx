import { createContext, useContext, useEffect, useState } from 'react'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from './AuthContext'

// Carrega em tempo real os dados da LOJA do lojista autenticado
// (nome, logo, banner, whatsapp, redes sociais, endereço, horário).
// Usado somente dentro do Painel Administrativo.
const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const { storeId } = useAuth()
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!storeId) {
      setStore(null)
      setLoading(false)
      return
    }
    const ref = doc(db, 'stores', storeId)
    const unsubscribe = onSnapshot(ref, (snap) => {
      setStore(snap.exists() ? { id: snap.id, ...snap.data() } : null)
      setLoading(false)
    })
    return unsubscribe
  }, [storeId])

  async function updateStore(data) {
    if (!storeId) return
    await updateDoc(doc(db, 'stores', storeId), data)
  }

  return (
    <StoreContext.Provider value={{ store, storeId, loading, updateStore }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore deve ser usado dentro de StoreProvider')
  return ctx
}
