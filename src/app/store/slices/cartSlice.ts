import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AppThunk } from "../store"
import { logout, type User } from "./authSlice"

export interface CartItem {
  id: number
  name: string
  duration: number
  price: number
  category: string
  tags: string[]
  operator?: string
  selectedDate?: string
  selectedDay?: string
  timeSlot?: string
  description?: string
  vendor_location_uuid?: string,
}

interface CartState {
  items: CartItem[]
  loading: boolean
  error: string | null
  isHydrated: boolean
}

// Safe localStorage operations
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(key)
      }
    } catch (error) {
      console.log("Error reading from localStorage:", error)
    }
    return null
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value)
      }
    } catch (error) {
      console.log("Error writing to localStorage:", error)
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.log("Error removing from localStorage:", error)
    }
  },
}

// Helper function to get cart from localStorage
const getCartFromStorage = (): CartItem[] => {
  const guestCart = safeLocalStorage.getItem("guestCart")
  return guestCart ? JSON.parse(guestCart) : []
}

// Helper function to get user-specific cart from localStorage
const getUserCartFromStorage = (userId?: string | null): CartItem[] => {
  if (userId) {
    const userCart = safeLocalStorage.getItem(`userCart_${userId}`)
    return userCart ? JSON.parse(userCart) : []
  }
  return []
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  isHydrated: false,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeCart(state) {
      try {
        state.items = getCartFromStorage()
        state.isHydrated = true
        state.error = null
      } catch (error) {
        state.error = "Failed to initialize cart"
        console.log("Cart initialization error:", error)
      }
    },
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload
      state.error = null
    },
    addToCart(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload)
      state.error = null
    },
    removeFromCart(state, action: PayloadAction<number>) {
      if (action.payload >= 0 && action.payload < state.items.length) {
        state.items.splice(action.payload, 1)
        state.error = null
      }
    },
    clearCart(state) {
      state.items = []
      state.error = null
    },
    clearCartAfterBooking(state) {
      state.items = []
      state.error = null
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    clearBookingDetailsFromCart(state) {
      state.items = state.items.map((item) => {
        const { operator, selectedDate, selectedDay, timeSlot, ...rest } = item;
        return rest;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      safeLocalStorage.removeItem("guestCart")
      state.items = []
      state.error = null
    })
  },
})

export const {
  initializeCart,
  setCart,
  addToCart,
  removeFromCart,
  clearCart,
  setLoading,
  setError,
  clearCartAfterBooking,
  clearBookingDetailsFromCart
} = cartSlice.actions

// Simple thunk to clear cart after successful booking
export const clearCartAfterSuccessfulBooking = (): AppThunk => (dispatch, getState) => {
  try {
    const { auth } = getState()
    const user = auth.user

    console.log("Clearing cart after successful booking...")

    // Clear cart from Redux state first
    dispatch(clearCartAfterBooking())

    // Then clear from localStorage asynchronously
    setTimeout(() => {
      if (user && user.isLoggedIn) {
        const userIdentifier = user.mobile || user.email || user.uuid
        const userKey = `userCart_${userIdentifier}`
        console.log("Removing user cart with key:", userKey)
        safeLocalStorage.removeItem(userKey)
      } else {
        console.log("Removing guest cart")
        safeLocalStorage.removeItem("guestCart")
      }
    }, 100)

    console.log("Cart cleared from Redux state")
  } catch (error) {
    console.log("Error clearing cart:", error)
    dispatch(setError("Failed to clear cart"))
  }
}

// Thunk to handle cart synchronization when user logs in
export const syncCartOnLogin =
  (user: User): AppThunk =>
    async (dispatch, getState) => {
      try {
        dispatch(setLoading(true))

        const guestCart = getState().cart.items
        const userIdentifier = user.mobile || user.email || user.uuid
        const userCart = getUserCartFromStorage(userIdentifier)

        const mergedCart = [...userCart, ...guestCart]

        dispatch(setCart(mergedCart))

        const userKey = `userCart_${userIdentifier}`
        safeLocalStorage.setItem(userKey, JSON.stringify(mergedCart))
        safeLocalStorage.removeItem("guestCart")

        dispatch(setLoading(false))
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : "Failed to sync cart"))
        dispatch(setLoading(false))
      }
    }

// Thunk to load user cart when user is already logged in (on app start)
export const loadUserCart =
  (user: User): AppThunk =>
    async (dispatch) => {
      try {
        const userIdentifier = user.mobile || user.email || user.uuid
        const userCart = getUserCartFromStorage(userIdentifier)
        dispatch(setCart(userCart))
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : "Failed to load cart"))
      }
    }

// Middleware to save cart to localStorage
export const saveCartToStorage = (): AppThunk => (dispatch, getState) => {
  try {
    const { cart, auth } = getState()
    const user = auth.user

    if (user && user.isLoggedIn) {
      const userIdentifier = user.mobile || user.email || user.uuid
      const userKey = `userCart_${userIdentifier}`
      safeLocalStorage.setItem(userKey, JSON.stringify(cart.items))
    } else {
      safeLocalStorage.setItem("guestCart", JSON.stringify(cart.items))
    }
  } catch (error) {
    console.log("Error saving cart to storage:", error)
    dispatch(setError("Failed to save cart"))
  }
}

export default cartSlice.reducer
