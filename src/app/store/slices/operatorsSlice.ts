import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

// Updated interfaces to match the actual API response
interface EmployeeService {
  vendor_service_id: number
  price: number | null
  _vendor_service: {
    sub_category_id: number
    service: string
    service_time: string
    price: number
    id: number
    seq_no: number
    pricings: any[]
  }
}

interface Operator {
  id: number
  name: string
  gender: string
  title: string | null
  staff_img: string | null
  display_name: string
  employee_uuid: string
  _employee_services: EmployeeService[]
}

interface OperatorsState {
  operators: Operator[]
  filteredOperators: Operator[]
  loading: boolean
  error: string | null
}

const initialState: OperatorsState = {
  operators: [],
  filteredOperators: [],
  loading: false,
  error: null,
}

// Async thunk to fetch operators by location UUID
export const fetchOperatorsByLocation = createAsyncThunk<Operator[], string, { rejectValue: string }>(
  "operators/fetchOperatorsByLocation",
  async (locationUuid: string, { rejectWithValue }) => {
    try {
      console.log("🔄 Fetching operators for location:", locationUuid)

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dingg-partner/get-operators/${locationUuid}`)

      if (!response.data.status) {
        throw new Error(response.data.message || "Failed to fetch operators")
      }
      // Return the original API response structure
      const operators: Operator[] = response.data.data.data.rows
      console.log("✅ Original operators data=======================>:", operators)
      return operators
    } catch (error: any) {
      console.log("❌ Error fetching operators:", error)
      return rejectWithValue(error.message || "Failed to fetch operators")
    }
  },
)

const operatorsSlice = createSlice({
  name: "operators",
  initialState,
  reducers: {
    filterOperatorsByServices: (state, action: PayloadAction<number[]>) => {
      const cartServiceIds = action.payload
      console.log("🔍 Filtering operators by service IDs:", cartServiceIds)

      if (cartServiceIds.length === 0) {
        // If no services in cart, show all operators
        state.filteredOperators = state.operators
        console.log("📝 No services in cart, showing all operators")
        return
      }
      // Filter operators who provide ALL services in the cart
      const filtered = state.operators.filter((operator) => {
        // Get vendor_service_ids from operator's _employee_services
        const operatorServiceIds = operator._employee_services?.map((service) => service.vendor_service_id) || []

        // Check if operator provides all required services
        const hasAllServices = cartServiceIds.every((serviceId) => operatorServiceIds.includes(serviceId))

        console.log(`Operator ${operator.name}:`, {
          operatorServiceIds: operatorServiceIds,
          requiredServices: cartServiceIds,
          hasAllServices,
        })

        return hasAllServices
      })

      console.log(
        "✅ Filtered operators:",
        filtered.map((op) => op.name),
      )
      state.filteredOperators = filtered
    },
    clearOperators: (state) => {
      state.operators = []
      state.filteredOperators = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOperatorsByLocation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOperatorsByLocation.fulfilled, (state, action) => {
        state.loading = false
        state.operators = action.payload
        state.filteredOperators = action.payload // Initially show all operators
      })
      .addCase(fetchOperatorsByLocation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.operators = []
        state.filteredOperators = []
      })
  },
})

export const { filterOperatorsByServices, clearOperators } = operatorsSlice.actions
export default operatorsSlice.reducer
