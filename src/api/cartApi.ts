import type { CartItem, Product } from '../types'

const CART_STORAGE_KEY = 'tanstack_shop_cart'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchCart(): Promise<CartItem[]> {
  await delay(150)
  const raw = localStorage.getItem(CART_STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

export async function addToCartApi(product: Product): Promise<CartItem[]> {
  await delay(150)
  const current = await fetchCart()
  const existingIndex = current.findIndex((item) => item.product.id === product.id)

  if (existingIndex > -1) {
    current[existingIndex].quantity += 1
  } else {
    current.push({ product, quantity: 1 })
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(current))
  return current
}

export async function updateCartQuantityApi(productId: number, quantity: number): Promise<CartItem[]> {
  await delay(150)
  let current = await fetchCart()

  if (quantity <= 0) {
    current = current.filter((item) => item.product.id !== productId)
  } else {
    current = current.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    )
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(current))
  return current
}

export async function clearCartApi(): Promise<CartItem[]> {
  await delay(150)
  localStorage.removeItem(CART_STORAGE_KEY)
  return []
}
