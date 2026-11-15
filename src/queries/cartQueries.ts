import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCart, addToCartApi, updateCartQuantityApi, clearCartApi } from '../api/cartApi'
import type { CartItem, Product } from '../types'

export const cartQueries = {
  all: () => ['cart'] as const,
  detail: () =>
    queryOptions({
      queryKey: [...cartQueries.all()],
      queryFn: fetchCart,
      staleTime: Infinity,
    }),
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (product: Product) => addToCartApi(product),
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: cartQueries.all() })
      const previousCart = queryClient.getQueryData<CartItem[]>(cartQueries.all())

      queryClient.setQueryData<CartItem[]>(cartQueries.all(), (old = []) => {
        const exists = old.find((item) => item.product.id === newProduct.id)
        if (exists) {
          return old.map((item) =>
            item.product.id === newProduct.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return [...old, { product: newProduct, quantity: 1 }]
      })

      return { previousCart }
    },
    onError: (_err, _newProduct, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartQueries.all(), context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartQueries.all() })
    },
  })
}

export function useUpdateCartQuantityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      updateCartQuantityApi(productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartQueries.all() })
      const previousCart = queryClient.getQueryData<CartItem[]>(cartQueries.all())

      queryClient.setQueryData<CartItem[]>(cartQueries.all(), (old = []) => {
        if (quantity <= 0) {
          return old.filter((item) => item.product.id !== productId)
        }
        return old.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      })

      return { previousCart }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartQueries.all(), context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartQueries.all() })
    },
  })
}

export function useClearCartMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: clearCartApi,
    onSuccess: (data) => {
      queryClient.setQueryData(cartQueries.all(), data)
    },
  })
}
