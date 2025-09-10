import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getAuthToken } from "./authSlice"

// Types
export interface BookingService {
  service_id: number
  service_name: string
  start_time: number
  end_time: number
}

export interface CreateBookingPayload {
  vendor_location_uuid: string
  booking_date: string
  booking_comment: string
  booking_status: string
  merge_services_of_same_staff: boolean
  total: number
  services: BookingService[]
}

export interface BookingResponse {
  status: boolean
  fromCache: boolean
  data: {
    message: string
    code: number
    data: string // booking ID
  }
}

export interface BookingState {
  loading: boolean
  error: string | null
  bookingId: string | null
  lastBookingResponse: BookingResponse | null
}

// Async thunk for creating booking
export const createBooking = createAsyncThunk<BookingResponse, CreateBookingPayload, { rejectValue: string }>(
  "booking/createBooking",
  async (payload, { rejectWithValue, getState }) => {
    try {
      // Get auth token from state (adjust path according to your auth slice)
      const state = getState() as { auth: { token: string | null; tempToken: string | null } }
      const token = getAuthToken() || state.auth.token
      console.log(token, "token in booking slice=================")
      if (!token) {
        return rejectWithValue("No authentication token found")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dingg-partner/create-booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.log(errorData, "error data response=================")
        return rejectWithValue(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data: BookingResponse = await response.json()

      if (!data.status) {
        console.log(data, "booking data response with error=================-----------------------")
        console.log("Booking creation failed:==============", data.data?.message, data.status || "Unknown error")
        return rejectWithValue(data.data?.message || "Booking creation failed")
      }
      console.log(data, "booking data response=================")

      return data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred")
    }
  },
)

const initialState: BookingState = {
  loading: false,
  error: null,
  bookingId: null,
  lastBookingResponse: null,
}

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null
    },
    clearBookingData: (state) => {
      state.bookingId = null
      state.lastBookingResponse = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.lastBookingResponse = action.payload
        state.bookingId = action.payload.data.data
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to create booking"
      })
  },
})

export const { clearBookingError, clearBookingData } = bookingSlice.actions
export default bookingSlice.reducer
