import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/footer'
import CartDrawer from './components/CartDrawer'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
