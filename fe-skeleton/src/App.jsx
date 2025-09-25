// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

export default function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route
              path="account"
              element={
                <ProtectedRoute>
                  <div style={{ padding: 24 }}>마이페이지 (로그인 필요)</div>
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </AuthProvider>
  )
}
