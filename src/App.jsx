import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import { StoreProvider } from './contexts/StoreContext'
import PublicCatalogRoute from './layouts/PublicCatalogRoute'
import AdminLayout from './layouts/AdminLayout'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import ProductForm from './pages/admin/ProductForm'
import Categories from './pages/admin/Categories'
import Banner from './pages/admin/Banner'
import Settings from './pages/admin/Settings'
import Account from './pages/admin/Account'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      {/* Landing simples: aponta o dono da loja para o login do painel */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      {/* ÁREA PÚBLICA — o cliente final acessa só isto, via link da loja */}
      <Route path="/:storeSlug" element={<PublicCatalogRoute />} />

      {/* ÁREA ADMINISTRATIVA — protegida por login */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <StoreProvider>
              <AdminLayout />
            </StoreProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="produtos" element={<Products />} />
        <Route path="produtos/novo" element={<ProductForm />} />
        <Route path="produtos/:productId" element={<ProductForm />} />
        <Route path="categorias" element={<Categories />} />
        <Route path="banner" element={<Banner />} />
        <Route path="configuracoes" element={<Settings />} />
        <Route path="minha-conta" element={<Account />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
