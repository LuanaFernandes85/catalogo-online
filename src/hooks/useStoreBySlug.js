import { useEffect, useState } from 'react'
import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'

// Resolve uma loja pelo "slug" da URL (ex: /minha-loja).
// É essa consulta que torna o projeto pronto para SaaS: cada loja tem
// sua própria URL pública, todas convivendo na mesma base de dados.
export function useStoreBySlug(slug) {
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let active = true
    setLoading(true)
    setError(null)

    async function load() {
      try {
        const q = query(collection(db, 'stores'), where('slug', '==', slug), limit(1))
        const snap = await getDocs(q)
        if (!active) return
        if (snap.empty) {
          setStore(null)
          setError('not-found')
        } else {
          const docSnap = snap.docs[0]
          setStore({ id: docSnap.id, ...docSnap.data() })
        }
      } catch (err) {
        console.error(err)
        if (active) setError('load-error')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [slug])

  return { store, loading, error }
}
