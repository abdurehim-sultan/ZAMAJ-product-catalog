import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ShoppingCart, Star, Package } from 'lucide-react'
import { productQueries } from '../queries/productQueries'
import { useAddToCartMutation } from '../queries/cartQueries'

export default function ProductDetailPage() {
  const { id = '' } = useParams()
  const { data: product, isLoading, isError } = useQuery(productQueries.detail(id))
  const addToCart = useAddToCartMutation()

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />
  }

  if (isError || !product) {
    return (
      <div className="text-center">
        <p className="text-red-600">Product not found.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 underline">
          Back to store
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-8 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
        <div className="flex items-center justify-center rounded-xl bg-gray-100 p-6">
          <img
            src={product.images[0] || product.thumbnail}
            alt={product.title}
            className="max-h-96 object-contain"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase text-indigo-600">
                {product.category}
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                {product.rating}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="mt-1 text-sm text-gray-500">Brand: {product.brand || 'Generic'}</p>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <span className="text-sm font-medium text-green-600">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <p className="mt-6 leading-relaxed text-gray-600">{product.description}</p>

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
              <Package className="h-4 w-4 text-indigo-600" />
              <span>{product.stock} units in stock</span>
            </div>
          </div>

          <button
            onClick={() => addToCart.mutate(product)}
            disabled={addToCart.isPending}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
