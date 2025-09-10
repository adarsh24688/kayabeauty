
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the shape of the business hours data
interface BusinessHours {
  today_hour: string;
  today_opening_status: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

// Define the state for this slice
interface BusinessHoursState {
  hours: BusinessHours | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessHoursState = {
  hours: null,
  loading: false,
  error: null,
};

// Create an async thunk for fetching the data
export const fetchBusinessHours = createAsyncThunk<BusinessHours, string, { rejectValue: string }>(
  'businessHours/fetch',
  async (vendor_location_uuid, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dingg-partner/get-business-hours/${vendor_location_uuid}`
      );
      return response.data.data.data as BusinessHours;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch business hours.');
      }
      return rejectWithValue(error.message);
    }
  }
);

const businessHoursSlice = createSlice({
  name: 'businessHours',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessHours.fulfilled, (state, action: PayloadAction<BusinessHours>) => {
        state.loading = false;
        state.hours = action.payload;
      })
      .addCase(fetchBusinessHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An unknown error occurred.';
      });
  },
});

export default businessHoursSlice.reducer;