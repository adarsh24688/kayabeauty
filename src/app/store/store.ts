import { configureStore, type ThunkAction, type Action } from "@reduxjs/toolkit"
import cartReducer from "./slices/cartSlice"
import authReducer from "./slices/authSlice"
import operatorsReducer from "./slices/operatorsSlice"
import servicesReducer from "./slices/servicesSlice"
import uiReducer from "./slices/uiSlice"
import locationsReducer from "./slices/locationsSlice"
import businessHoursReducer from "./slices/businessHoursSlice"
import timeSlotsReducer from "./slices/timeSlotsSlice"
import bookingReducer from "./slices/bookingSlice"
import appointmentsReducer from "./slices/appointmentsSlice";
import changePasswordReducer from "./slices/changePasswordSlice"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { Middleware } from "redux"
import modalReducer from "./slices/modalSlice";
import cancelBookingReducer from './slices/cancelBookingSlice'; // Adjust
import productsReducer from './slices/productsSlice';
// Persist config for the root reducer
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth"], // add slices you want to persist
}

const rootReducer = {
  cart: cartReducer,
  appointments: appointmentsReducer,
  operators: operatorsReducer,
  services: servicesReducer,
  ui: uiReducer,
  locations: locationsReducer,
  auth: authReducer,
  businessHours: businessHoursReducer,
  timeSlots: timeSlotsReducer,
  booking: bookingReducer,
  changePassword: changePasswordReducer,
  modal: modalReducer,
  cancelBooking: cancelBookingReducer,
  products: productsReducer
}

const persistedReducer = persistReducer(persistConfig, (state: any, action: any) => {
  // Combine all reducers manually
  return (Object.keys(rootReducer) as Array<keyof typeof rootReducer>).reduce((acc, key) => {
    acc[key] = rootReducer[key](state?.[key], action)
    return acc
  }, {} as Record<keyof typeof rootReducer, any>)
})

// Custom middleware with correct typing

const cartLocalStorageMiddleware: Middleware = storeAPI => next => (action: unknown) => {
  const result = next(action)
  if (
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    (
      (action as { type: string }).type === "cart/addToCart" ||
      (action as { type: string }).type === "cart/removeFromCart" ||
      (action as { type: string }).type === "cart/clearCart"
    )
  ) {
    const { cart, auth } = storeAPI.getState()
    const user = auth.user

    if (typeof window !== "undefined") {
      if (user && user.isLoggedIn) {
        const userIdentifier = user.mobile || user.email || user.uuid
        localStorage.setItem(`userCart_${userIdentifier}`, JSON.stringify(cart.items))
        console.log("Saved to user cart after action:", (action as { type: string }).type, cart.items)
      } else {
        localStorage.setItem("guestCart", JSON.stringify(cart.items))
        console.log("Saved to guest cart after action:", (action as { type: string }).type, cart.items)
      }
    }
  }

  if (
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    (action as { type: string }).type === "auth/logout"
  ) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      localStorage.removeItem("userData")
      console.log("Cleaned up auth data from localStorage")
    }
  }

  return result
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(cartLocalStorageMiddleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
