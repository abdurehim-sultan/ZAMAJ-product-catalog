import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import {
  cartQueries,
  useUpdateCartQuantityMutation,
  useClearCartMutation,
} from '../queries/cartQueries'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { data: cart = [], isLoading } = useQuery(cartQueries.detail())
  const updateQuantity = useUpdateCartQuantityMutation()
  const clearCart = useClearCartMutation()

  if (!isOpen) return null

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading cart...</p>
          ) : cart.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center gap-4 border-b pb-4">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-16 w-16 rounded-lg bg-gray-100 object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="line-clamp-1 font-medium">{product.title}</h4>
                    <p className="text-sm font-semibold text-indigo-600">
                      ${(product.price * quantity).toFixed(2)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity.mutate({ productId: product.id, quantity: quantity - 1 })
                        }
                        className="rounded border p-1 hover:bg-gray-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity.mutate({ productId: product.id, quantity: quantity + 1 })
                        }
                        className="rounded border p-1 hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t bg-gray-50 p-6">
            <div className="mb-4 flex items-center justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => clearCart.mutate()}
                className="flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
              <button
                onClick={() => {
                  clearCart.mutate()
                  onClose()
                  alert('Order placed!')
                }}
                className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
