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

export function useCategories(storeId) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!storeId) return
    const ref = collection(db, 'stores', storeId, 'categories')
    const q = query(ref, orderBy('name', 'asc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [storeId])

  return { categories, loading }
}

export async function createCategory(storeId, name) {
  const ref = collection(db, 'stores', storeId, 'categories')
  return addDoc(ref, { name, createdAt: serverTimestamp() })
}

export async function updateCategory(storeId, categoryId, name) {
  const ref = doc(db, 'stores', storeId, 'categories', categoryId)
  return updateDoc(ref, { name })
}

export async function deleteCategory(storeId, categoryId) {
  const ref = doc(db, 'stores', storeId, 'categories', categoryId)
  return deleteDoc(ref)
}
