import type { Category, Product, ProductsResponse } from '../types'

const BASE_URL = 'https://dummyjson.com/products'

export async function fetchProducts(
  page: number,
  limit: number,
  search: string,
  category: string
): Promise<ProductsResponse> {
  const skip = (page - 1) * limit
  let url = `${BASE_URL}?limit=${limit}&skip=${skip}`

  if (search.trim()) {
    url = `${BASE_URL}/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
  } else if (category) {
    url = `${BASE_URL}/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
  }

  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/${id}`)
  if (!res.ok) throw new Error('Failed to fetch product details')
  return res.json()
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories`)
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}
