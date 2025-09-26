// store/slices/productsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Types based on your API response
interface Product {
  id: number
  name: string
  price: number
  cost: number
  brand: string
  detail: string
  image: string
  measurement: number | null
  unit: string
  stock: number
  item_code: string
  is_public: boolean
  images: string[]
}

interface Subcategory {
  id: string
  name: string
  items: Product[]
}

interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
}

interface ProductsState {
  categories: Category[]
  loading: boolean
  error: string | null
  selectedCategory: string
  priceRange: {
    min: number
    max: number
  }
  searchQuery: string
}

const initialState: ProductsState = {
  categories: [],
  loading: false,
  error: null,
  selectedCategory: 'all',
  priceRange: {
    min: 0,
    max: 10000
  },
  searchQuery: ''
}

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/api/dingg-partner/get-products')

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()

      if (data.status && data.data?.data) {
        return data.data.data
      } else {
        throw new Error(data.message || 'Failed to load products')
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error')
    }
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    clearFilters: (state) => {
      state.selectedCategory = 'all'
      state.priceRange = { min: 0, max: 10000 }
      state.searchQuery = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.categories = Array.isArray(action.payload) ? action.payload : []
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const {
  setSelectedCategory,
  setPriceRange,
  setSearchQuery,
  clearFilters
} = productsSlice.actions

export default productsSlice.reducer

// Fixed Selectors with proper null checks
export const selectAllProducts = (state: any): Product[] => {
  // Add null checks and fallbacks
  if (!state?.products?.categories || !Array.isArray(state.products.categories)) {
    return []
  }

  const allProducts: Product[] = []

  state.products.categories.forEach((category: Category) => {
    if (category?.subcategories && Array.isArray(category.subcategories)) {
      category.subcategories.forEach((subcategory: Subcategory) => {
        if (subcategory?.items && Array.isArray(subcategory.items)) {
          allProducts.push(...subcategory.items)
        }
      })
    }
  })

  return allProducts
}

export const selectFilteredProducts = (state: any): Product[] => {
  const allProducts = selectAllProducts(state)

  // Return empty array if no products or state not ready
  if (!allProducts || allProducts.length === 0) {
    return []
  }

  const { selectedCategory, priceRange, searchQuery } = state?.products || {
    selectedCategory: 'all',
    priceRange: { min: 0, max: 10000 },
    searchQuery: ''
  }

  return allProducts.filter((product: Product) => {
    // Category filter with null checks
    let categoryMatch = selectedCategory === 'all'

    if (!categoryMatch && state?.products?.categories && Array.isArray(state.products.categories)) {
      categoryMatch = state.products.categories.some((category: Category) =>
        category?.id === selectedCategory &&
        category?.subcategories &&
        Array.isArray(category.subcategories) &&
        category.subcategories.some((sub: Subcategory) =>
          sub?.items &&
          Array.isArray(sub.items) &&
          sub.items.some((item: Product) => item?.id === product?.id)
        )
      )
    }

    // Price filter with null checks
    const priceMatch = (product?.price || 0) >= (priceRange?.min || 0) &&
      (product?.price || 0) <= (priceRange?.max || 10000)

    // Search filter with null checks
    const searchMatch = !searchQuery ||
      (product?.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product?.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))

    return categoryMatch && priceMatch && searchMatch
  })
}

export const selectCategories = (state: any) => {
  const baseCategories = [{ id: 'all', name: 'All Categories' }]

  if (!state?.products?.categories || !Array.isArray(state.products.categories)) {
    return baseCategories
  }

  const categoryOptions = state.products.categories
    .filter((category: Category) => category?.id && category?.name)
    .map((category: Category) => ({
      id: category.id,
      name: category.name
    }))

  return [...baseCategories, ...categoryOptions]
}

// Additional selector for loading state
export const selectProductsLoading = (state: any): boolean => {
  return state?.products?.loading || false
}

// Additional selector for error state
export const selectProductsError = (state: any): string | null => {
  return state?.products?.error || null
}

// Selector for current filters
export const selectCurrentFilters = (state: any) => {
  return {
    selectedCategory: state?.products?.selectedCategory || 'all',
    priceRange: state?.products?.priceRange || { min: 0, max: 10000 },
    searchQuery: state?.products?.searchQuery || ''
  }
}
