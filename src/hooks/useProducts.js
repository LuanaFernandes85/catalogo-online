import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

// Lista produtos de uma loja em tempo real.
// onlyAvailable=true é usado no catálogo público (esconde inativos).
export function useProducts(storeId, { onlyAvailable = false } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!storeId) return
    const ref = collection(db, 'stores', storeId, 'products')
    const q = query(ref, orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      if (onlyAvailable) {
        list = list.filter((p) => p.active !== false && p.available !== false)
      }
      setProducts(list)
      setLoading(false)
    })
    return unsubscribe
  }, [storeId, onlyAvailable])

  return { products, loading }
}

export async function createProduct(storeId, data) {
  const ref = collection(db, 'stores', storeId, 'products')
  return addDoc(ref, { ...data, createdAt: serverTimestamp() })
}

export async function updateProduct(storeId, productId, data) {
  const ref = doc(db, 'stores', storeId, 'products', productId)
  return updateDoc(ref, data)
}

export async function deleteProduct(storeId, productId) {
  const ref = doc(db, 'stores', storeId, 'products', productId)
  return deleteDoc(ref)
}

export async function toggleProductActive(storeId, productId, active) {
  return updateProduct(storeId, productId, { active })
}
