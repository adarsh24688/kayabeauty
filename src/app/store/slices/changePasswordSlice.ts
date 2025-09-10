import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthToken } from './authSlice';

// Define the shape of the data needed for the API call
interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  vendor_location_uuid: string; // This UUID needs to be provided
}

// Define the shape of the API response for success
interface ApiResponse {
  status: boolean;
  data: {
    message: string;
    code: number;
  };
}

// Define the shape of our slice's state
interface ChangePasswordState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  successMessage: string | null;
  error: string | null;
}

// Define the initial state for the slice
const initialState: ChangePasswordState = {
  loading: 'idle',
  successMessage: null,
  error: null,
};

// Create the asynchronous thunk for the API call
// This thunk will handle the logic of making the network request
export const changePassword = createAsyncThunk<
  ApiResponse, // Type of the return value on success
  ChangePasswordPayload, // Type of the argument passed to the thunk
  { rejectValue: string; state: { auth: { token: string | null } } } // Types for thunkAPI
>(
  'changePassword/changePassword',
  async (payload, { rejectWithValue, getState }) => {
    try {
      // Get the authentication token from your Redux state
      // IMPORTANT: Adjust 'state.auth.token' to the actual path where you store your token
      const state = getState() as { auth: { token: string | null; tempToken: string | null } }
      const token = getAuthToken() || state.auth.token
      console.log(token, "password token")
      if (!token) {
        return rejectWithValue('Authentication token not found.');
      }

      const response = await axios.post<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/change-password`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response, "paswword response")

      // Check if the API response indicates success
      if (response.data && response.data.status) {
        // Return the successful response data
        return response.data;
      } else {
        // Handle cases where the server responds with a 2xx status but indicates an error in the body
        return rejectWithValue(response.data.data.message || 'An unknown error occurred.');
      }
    } catch (error: unknown) {
      // Handle network errors or other exceptions
      if (axios.isAxiosError(error) && error.response) {
        // If the server provides an error message, use it
        return rejectWithValue(error.response.data.message || 'Failed to change password.');
      }
      // Otherwise, use a generic error message
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'An unknown error occurred.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// Create the slice with reducers and extraReducers
const changePasswordSlice = createSlice({
  name: 'changePassword',
  initialState,
  // Standard reducers for synchronous actions
  reducers: {
    // Action to reset the state, e.g., when the component unmounts or the user navigates away
    resetChangePasswordState: (state) => {
      state.loading = 'idle';
      state.error = null;
      state.successMessage = null;
    },
  },
  // Extra reducers to handle the states of the async thunk
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.loading = 'succeeded';
        state.successMessage = action.payload.data.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export the action creator and the reducer
export const { resetChangePasswordState } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;
