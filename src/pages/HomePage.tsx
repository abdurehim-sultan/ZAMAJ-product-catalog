import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { productQueries } from '../queries/productQueries'
import { useDebounce } from '../hooks/useDebounce'
import ProductCard from '../components/ProductCard'

const LIMIT = 8

export default function HomePage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const debouncedSearch = useDebounce(searchInput, 400)

  const { data: categories = [] } = useQuery(productQueries.categories())

  const { data, isLoading, isError, isPlaceholderData } = useQuery(
    productQueries.list(page, LIMIT, debouncedSearch, selectedCategory)
  )

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    setSelectedCategory('')
    setPage(1)
  }

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug)
    setSearchInput('')
    setPage(1)
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            Hover over any product card to prefetch its details
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border bg-white py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => handleCategoryChange('')}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            selectedCategory === ''
              ? 'bg-indigo-600 text-white'
              : 'border bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              selectedCategory === cat.slug
                ? 'bg-indigo-600 text-white'
                : 'border bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
          Failed to load products. Please try again.
        </div>
      ) : data?.products.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          No products found{debouncedSearch ? ` for "${debouncedSearch}"` : ''}.
        </div>
      ) : (
        <>
          <div
            className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-4 ${
              isPlaceholderData ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {data?.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <span className="text-sm text-gray-600">
              Page <span className="font-semibold">{page}</span> of{' '}
              <span className="font-semibold">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={isPlaceholderData || page >= totalPages}
                className="flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
