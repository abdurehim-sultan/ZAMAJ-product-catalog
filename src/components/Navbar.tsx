import { Link } from 'react-router-dom'
import { ShoppingBag, Store } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { cartQueries } from '../queries/cartQueries'

interface NavbarProps {
  onOpenCart: () => void
}

export default function Navbar({ onOpenCart }: NavbarProps) {
  const { data: cart = [] } = useQuery(cartQueries.detail())
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <Store className="h-6 w-6" />
          <span>QueryStore</span>
        </Link>
        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 font-medium text-indigo-600 transition hover:bg-indigo-100"
        >
          <ShoppingBag className="h-5 w-5" />
          <span>Cart</span>
          {totalItems > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
