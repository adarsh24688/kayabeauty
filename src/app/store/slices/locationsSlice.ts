// src/redux/slices/locationsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Location {
  vendor_location_uuid: string;
  business_name: string;
  locality: string;
  booking_page_url: string;
  registration_url: string;
}

interface LocationsState {
  locations: Location[];
  loading: boolean;
  error: string | null;
}

const initialState: LocationsState = {
  locations: [],
  loading: false,
  error: null,
};

export const fetchLocations = createAsyncThunk<Location[]>(
  'locations/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dingg-partner/get-locations`);
      return response.data.data.business_locations;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch locations');
    }
  }
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<Location[]>) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default locationsSlice.reducer;
