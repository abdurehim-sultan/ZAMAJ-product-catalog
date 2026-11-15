import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ShoppingCart, Star } from 'lucide-react'
import type { Product } from '../types'
import { productQueries } from '../queries/productQueries'
import { useAddToCartMutation } from '../queries/cartQueries'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient()
  const addToCart = useAddToCartMutation()

  const handlePrefetch = () => {
    queryClient.prefetchQuery(productQueries.detail(String(product.id)))
  }

  return (
    <div
      onMouseEnter={handlePrefetch}
      className="flex flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="aspect-square w-full overflow-hidden bg-gray-100">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
            <span className="uppercase">{product.category}</span>
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              {product.rating}
            </span>
          </div>
          <h3 className="line-clamp-1 font-semibold text-gray-900 group-hover:text-indigo-600">
            {product.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{product.description}</p>
        </div>
      </Link>
      <div className="flex items-center justify-between border-t px-4 py-3">
        <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
        <button
          onClick={() => addToCart.mutate(product)}
          disabled={addToCart.isPending}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          Add
        </button>
      </div>
    </div>
  )
}
