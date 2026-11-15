import { queryOptions, keepPreviousData } from '@tanstack/react-query'
import { fetchProducts, fetchProductById, fetchCategories } from '../api/productsApi'

export const productQueries = {
  all: () => ['products'] as const,
  categories: () =>
    queryOptions({
      queryKey: [...productQueries.all(), 'categories'],
      queryFn: fetchCategories,
      staleTime: Infinity,
    }),
  lists: () => [...productQueries.all(), 'list'] as const,
  list: (page: number, limit: number, search: string, category: string) =>
    queryOptions({
      queryKey: [...productQueries.lists(), { page, limit, search, category }],
      queryFn: () => fetchProducts(page, limit, search, category),
      placeholderData: keepPreviousData,
    }),
  details: () => [...productQueries.all(), 'detail'] as const,
  detail: (id: string) =>
    queryOptions({
      queryKey: [...productQueries.details(), id],
      queryFn: () => fetchProductById(id),
      staleTime: 1000 * 60 * 10,
    }),
}
