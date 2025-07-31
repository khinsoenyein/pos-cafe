import { useState } from 'react'
import type { IngredientProduct } from '@/types' // adjust path if needed
import { api } from '@/lib/api'

export function useRecipeFetcher() {
  const [ingredientProduct, setIngredientProduct] = useState<IngredientProduct[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchRecipe(shopId: number, productId: number) {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get<IngredientProduct[]>(`/recipe/get-ingredient`, {
        params: {
          shop_id: shopId,
          product_id: productId,
        },
      })

      setIngredientProduct(response.data)
    } catch (err: any) {
      setError(err.message || 'Error fetching recipe.')
    } finally {
      setLoading(false)
    }
  }

  return {
    ingredientProduct,
    fetchRecipe,
    loading,
    error,
  }
}
