
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UIState {
  selectedDate: string
  selectedOperator: number
  selectedSlot: string
  bookingComment: string
}

const initialState: UIState = {
  selectedDate: new Date().toISOString(),
  selectedOperator: 0,
  selectedSlot: "",
  bookingComment: "",
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload
    },
    setSelectedOperator(state, action: PayloadAction<number>) {
      state.selectedOperator = action.payload
    },
    setSelectedSlot(state, action: PayloadAction<string>) {
      state.selectedSlot = action.payload
    },
    setBookingComment(state, action: PayloadAction<string>) {
      state.bookingComment = action.payload
    },
    resetBookingComment(state) {
      state.bookingComment = ""
    },
    // Add a reset function for the entire booking flow
    resetBookingFlow(state) {
      state.selectedDate = new Date().toISOString()
      state.selectedOperator = 0
      state.selectedSlot = ""
      state.bookingComment = ""
    },
  },
})

export const {
  setSelectedDate,
  setSelectedOperator,
  setSelectedSlot,
  setBookingComment,
  resetBookingComment,
  resetBookingFlow,
} = uiSlice.actions

export default uiSlice.reducer

