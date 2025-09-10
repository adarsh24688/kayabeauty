import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

// Updated Service interface to match API response
export interface Service {
  id: number
  service: string
  service_time: string
  price: number
  sub_category_id: number
  subcategory: string
  image: string | null
  description: string | null
}

interface ServicesState {
  allServices: Service[]
  loading: boolean
  error: string | null
  selectedLocationUuid: string | null
  selectedLocationByName: string | null,
}

const initialState: ServicesState = {
  allServices: [],
  loading: false,
  error: null,
  selectedLocationUuid: null,
  selectedLocationByName: null,
}

// Async thunk to fetch services by location UUID
export const fetchServicesByLocation = createAsyncThunk<Service[], string, { rejectValue: string }>(
  "services/fetchServicesByLocation",
  async (locationUuid: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dingg-partner/get-services/${locationUuid}`)

      // Transform the nested API response to flat service array
      const serviceCategories = response.data.data.data.rows
      const flatServices: Service[] = []

      serviceCategories.forEach((category: any) => {
        category._vendor_services.forEach((service: any) => {
          flatServices.push({
            id: service.id,
            service: service.service,
            service_time: service.service_time,
            price: service.price,
            sub_category_id: service.sub_category_id,
            subcategory: category.subcategory,
            image: service.image,
            description: service.description,
          })
        })
      })

      return flatServices
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch services")
    }
  },
)

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setSelectedLocation: (state, action: PayloadAction<string>) => {
      state.selectedLocationUuid = action.payload
    },
    clearServices: (state) => {
      state.allServices = []
      state.error = null
    },
    setSelectedLocationByName: (state, action: PayloadAction<string>) => {
      state.selectedLocationByName = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicesByLocation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServicesByLocation.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.loading = false
        state.allServices = action.payload
      })
      .addCase(fetchServicesByLocation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setSelectedLocation, clearServices, setSelectedLocationByName } = servicesSlice.actions
export default servicesSlice.reducer
