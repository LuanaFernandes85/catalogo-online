import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

// Este contexto cuida apenas da AUTENTICAÇÃO do lojista (painel administrativo).
// O catálogo público NUNCA usa este contexto — ele é 100% aberto e não exige login.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [storeId, setStoreId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Documento em /users/{uid} conecta o login à loja dele.
        // Isso é o que já deixa o sistema pronto para virar SaaS multi-loja:
        // cada usuário aponta para o storeId que administra.
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          setStoreId(userDoc.exists() ? userDoc.data().storeId : null)
        } catch (err) {
          console.error('Erro ao carregar dados do usuário:', err)
          setStoreId(null)
        }
      } else {
        setUser(null)
        setStoreId(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    return signOut(auth)
  }

  async function changePassword(currentPassword, newPassword) {
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
    await reauthenticateWithCredential(auth.currentUser, credential)
    await updatePassword(auth.currentUser, newPassword)
  }

  async function changeDisplayName(name) {
    await updateProfile(auth.currentUser, { displayName: name })
    setUser({ ...auth.currentUser })
  }

  const value = { user, storeId, loading, login, logout, changePassword, changeDisplayName }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
