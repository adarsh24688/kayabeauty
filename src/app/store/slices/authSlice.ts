import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

// Types
export interface User {
  id: number
  fname: string
  lname: string
  display_name: string | null
  gender: string
  profile_pic: string | null
  email: string | null
  mobile: string | null
  locality: string | null
  dob: string | null
  anniversary: string | null
  is_email_verify: boolean
  email_verify_token: string | null
  is_mobile_verify: boolean
  is_valid_mobile: boolean
  address: string | null
  country_id: number | string
  uuid: string
  createdAt: string
  updatedAt: string
  isLoggedIn: boolean
  token: string
  country?: {
    dial_code: number
    id: number
    country_name: string
    country_code: string
    possible_length: number[]
  }
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  otpSent: boolean
  otpSentTo: "mobile" | "email" | null
  otpContact: string | null
  isVerifying: boolean
  isRegistering: boolean
  alreadyRegistered: boolean
  skipProfile: boolean
  tempToken: string | null
  isLoadingProfile: boolean
  isInitialized: boolean
  isLoggingOut: boolean
  // Forgot password states
  forgotPasswordOtpSent: boolean
  forgotPasswordOtpSentTo: "mobile" | "email" | null
  forgotPasswordContact: string | null
  isResettingPassword: boolean
}

// API Response types
interface ForgotPasswordResponse {
  status: boolean
  message: string
  fromCache: boolean
  data: {
    message: string
    code: number
  }
}

interface ResetPasswordResponse {
  status: boolean
  message: string
  fromCache: boolean
  data: {
    message: string
    code: number
  }
}

interface LogoutResponse {
  status: boolean
  fromCache: boolean
  data: {
    message: string
    code: number
  }
}

interface GetProfileResponse {
  status: boolean
  fromCache: boolean
  data: {
    message: string
    code: number
    data: {
      user: {
        id: number
        fname: string
        lname: string
        display_name: string | null
        gender: string
        profile_pic: string | null
        email: string | null
        mobile: string | null
        locality: string | null
        dob: string | null
        anniversary: string | null
        is_email_verify: boolean
        email_verify_token: string | null
        is_mobile_verify: boolean
        is_valid_mobile: boolean
        address: string | null
        country_id: number | string
        uuid: string
        createdAt: string
        updatedAt: string
        country?: {
          dial_code: number
          id: number
          country_name: string
          country_code: string
          possible_length: number[]
        }
      }
      skip_profile: boolean
    }
  }
}

interface ProfileSetupResponse {
  status: boolean
  message: string
  fromCache: boolean
  data: {
    message: string
    code: number
    data: {
      user: {
        id: number
        fname: string
        lname: string
        display_name: string | null
        gender: string
        profile_pic: string | null
        email: string | null
        mobile: string | null
        locality: string | null
        dob: string | null
        anniversary: string | null
        is_email_verify: boolean
        email_verify_token: string | null
        is_mobile_verify: boolean
        is_valid_mobile: boolean
        address: string | null
        country_id: number | string
        uuid: string
        createdAt: string
        updatedAt: string
      }
      token: string
    }
  }
}

interface VerifyOTPResponse {
  status: boolean
  message: string
  fromCache: boolean
  data: {
    message: string
    code: number
    data: {
      user: {
        id: number
        fname: string
        lname: string
        display_name: string | null
        gender: string
        profile_pic: string | null
        email: string | null
        mobile: string | null
        locality: string | null
        dob: string | null
        anniversary: string | null
        is_email_verify: boolean
        email_verify_token: string | null
        is_mobile_verify: boolean
        is_valid_mobile: boolean
        address: string | null
        country_id: number | string
        uuid: string
        createdAt: string
        updatedAt: string
      }
      already_registered: boolean
      skip_profile: boolean
      token: string
    }
  }
}

interface SendOTPPayload {
  type: "mobile" | "email"
  mobile?: string
  email?: string
  dialCode?: number
  countryId?: string
  vendorLocationUuid: string
}

interface VerifyOTPPayload {
  type: "mobile" | "email"
  mobile?: string
  email?: string
  otp: string
  dialCode?: number
  countryId?: string
  vendorLocationUuid: string
}

interface CompleteRegistrationPayload {
  fullName: string
  email?: string
  mobile?: string
  password: string
  vendorLocationUuid: string
}

interface ForgotPasswordPayload {
  type: "mobile" | "email"
  mobile?: string
  email?: string
  dialCode?: number
  countryId?: string
  vendorLocationUuid: string
}

interface ResetPasswordPayload {
  type: "mobile" | "email"
  mobile?: string
  email?: string
  dialCode?: number
  countryId?: string
  vendorLocationUuid: string
  password: string
  verificationCode: string
}

// Add this interface after the other interface definitions, before the helper functions

interface ProfileSetupRequestBody {
  password: string
  name: string
  mobile?: string
  email?: string
  vendor_location_uuid: string
  verified_by: "mobile" | "email"
  gender: string
  dial_code: string
  country_id: string
}

// Helper function to get auth token
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

// Helper function to store only auth token
const storeAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("authToken", token)
    } catch (error) {
      console.log("Error storing auth token:", error)
    }
  }
}

// Helper function to remove auth token
const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
    // Also remove any legacy userData
    localStorage.removeItem("userData")
  }
}

// Helper function to validate token format (basic check)
const isValidTokenFormat = (token: string | null): boolean => {
  if (!token) {
    return false
  }

  // More strict token validation
  const isValid =
    token.length > 20 &&
    !token.includes("undefined") &&
    !token.includes("null") &&
    !token.includes("NaN") &&
    !token.includes(" ") &&
    /^[A-Za-z0-9._-]+$/.test(token)

  return isValid
}

// Initial state - COMPLETELY CLEAN
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  otpSent: false,
  otpSentTo: null,
  otpContact: null,
  isVerifying: false,
  isRegistering: false,
  alreadyRegistered: false,
  skipProfile: false,
  tempToken: null,
  isLoadingProfile: false,
  isInitialized: false,
  isLoggingOut: false,
  // Forgot password states
  forgotPasswordOtpSent: false,
  forgotPasswordOtpSentTo: null,
  forgotPasswordContact: null,
  isResettingPassword: false,
}

// Async thunk for forgot password
export const sendForgotPasswordOTP = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordPayload,
  { rejectValue: string }
>("auth/sendForgotPasswordOTP", async (payload, { rejectWithValue }) => {
  try {
    console.log("🔑 Sending forgot password OTP...")

    const requestBody =
      payload.type === "mobile"
        ? {
          dial_code: payload.dialCode || 91,
          mobile: `${payload.dialCode || 91}${payload.mobile}`,
          country_id: payload.countryId || "1",
          vendor_location_uuid: payload.vendorLocationUuid,
        }
        : {
          email: payload.email,
          vendor_location_uuid: payload.vendorLocationUuid,
        }

    console.log("📤 Forgot password request:", requestBody)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error("Failed to send forgot password OTP")
    }

    const data: ForgotPasswordResponse = await response.json()
    console.log("✅ Forgot password OTP response:", data)

    if (!data.status) {
      throw new Error(data.message || "Failed to send forgot password OTP")
    }

    return data
  } catch (error) {
    console.log("❌ Forgot password OTP error:", error)
    return rejectWithValue(error instanceof Error ? error.message : "Failed to send forgot password OTP")
  }
})

// Async thunk for reset password
export const resetPassword = createAsyncThunk<ResetPasswordResponse, ResetPasswordPayload, { rejectValue: string }>(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("🔄 Resetting password...")

      const requestBody =
        payload.type === "mobile"
          ? {
            dial_code: payload.dialCode || 91,
            mobile: `${payload.dialCode || 91}${payload.mobile}`,
            country_id: payload.countryId || "1",
            vendor_location_uuid: payload.vendorLocationUuid,
            password: payload.password,
            verification_code: payload.verificationCode,
          }
          : {
            email: payload.email,
            vendor_location_uuid: payload.vendorLocationUuid,
            password: payload.password,
            verification_code: payload.verificationCode,
          }

      console.log("📤 Reset password request:", { ...requestBody, password: "***", verification_code: "***" })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to reset password")
      }

      const data: ResetPasswordResponse = await response.json()
      console.log("✅ Reset password response:", data)

      if (!data.status) {
        throw new Error(data.message || "Failed to reset password")
      }

      return data
    } catch (error) {
      console.log("❌ Reset password error:", error)
      return rejectWithValue(error instanceof Error ? error.message : "Failed to reset password")
    }
  },
)

// Async thunk for logout API call
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const authToken = state.auth.tempToken || getAuthToken()

      console.log("🚪 Starting logout process...")

      if (authToken && isValidTokenFormat(authToken)) {
        console.log("📤 Calling logout API...")

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/user-logout`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        })

        if (!response.ok) {
          console.log("⚠️ Logout API failed, but continuing with local logout:", response.status)
          // Don't throw error here - we still want to logout locally even if API fails
        } else {
          const data: LogoutResponse = await response.json()
          console.log("✅ Logout API response:", data)

          if (!data.status) {
            console.log("⚠️ Logout API returned false status, but continuing with local logout")
          }
        }
      } else {
        console.log("⚠️ No valid token found, proceeding with local logout only")
      }

      // Always clear local storage and state, regardless of API response
      console.log("🧹 Clearing local auth data...")
      removeAuthToken()

      console.log("✅ Logout completed successfully")
    } catch (error) {
      console.log("❌ Logout API error:", error)
      // Even if API fails, we should still logout locally
      removeAuthToken()
      console.log("✅ Local logout completed despite API error")

      // Don't reject - we want logout to always succeed locally
      // return rejectWithValue(error instanceof Error ? error.message : "Logout failed")
    }
  },
)

// Async thunk to get user profile - ONLY called explicitly
export const getUserProfile = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/getUserProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const authToken = state.auth.tempToken || getAuthToken()

      console.log("🚀 getUserProfile called explicitly with token:", authToken ? "exists" : "missing")

      if (!authToken || !isValidTokenFormat(authToken)) {
        console.log("❌ getUserProfile: No valid token")
        throw new Error("No valid authentication token found")
      }

      console.log("✅ Making API call to get profile")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/get-profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        console.log("❌ API response not ok:", response.status, response.statusText)

        // Try to get more detailed error info
        let errorMessage = `Failed to fetch user profile: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          console.log("Error details:", errorData)
        } catch (e) {
          console.log(e, "=====error in get user profile======")
        }

        if (response.status === 401 || response.status === 403) {
          removeAuthToken()
          throw new Error("Authentication session expired")
        }
        throw new Error(errorMessage)
      }

      const data: GetProfileResponse = await response.json()
      console.log("✅ Profile API response:", data)

      if (!data.status) {
        throw new Error(data.data?.message || "Failed to fetch user profile")
      }

      const apiUser = data.data.data.user

      const user: User = {
        id: apiUser.id,
        fname: apiUser.fname,
        lname: apiUser.lname,
        display_name: apiUser.display_name,
        gender: apiUser.gender,
        profile_pic: apiUser.profile_pic,
        email: apiUser.email,
        mobile: apiUser.mobile,
        locality: apiUser.locality,
        dob: apiUser.dob,
        anniversary: apiUser.anniversary,
        is_email_verify: apiUser.is_email_verify,
        email_verify_token: apiUser.email_verify_token,
        is_mobile_verify: apiUser.is_valid_mobile,
        is_valid_mobile: apiUser.is_valid_mobile,
        address: apiUser.address,
        country_id: apiUser.country_id,
        uuid: apiUser.uuid,
        createdAt: apiUser.createdAt,
        updatedAt: apiUser.updatedAt,
        isLoggedIn: true,
        token: authToken,
        country: apiUser.country,
      }

      console.log("✅ Profile fetched successfully")
      return user
    } catch (error) {
      console.log("❌ Error fetching user profile:", error)
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch user profile")
    }
  },
)

// Async thunks
export const sendOTP = createAsyncThunk<any, SendOTPPayload, { rejectValue: string }>(
  "auth/sendOTP",
  async (payload, { rejectWithValue }) => {
    try {
      const requestBody =
        payload.type === "mobile"
          ? {
            dial_code: payload.dialCode || 91,
            mobile: `${payload.dialCode || 91}${payload.mobile}`,
            country_id: payload.countryId || "1",
            vendor_location_uuid: payload.vendorLocationUuid,
          }
          : {
            email: payload.email,
            vendor_location_uuid: payload.vendorLocationUuid,
          }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to send OTP")
      }

      const data = await response.json()

      if (!data.status) {
        throw new Error(data.message || "Failed to send OTP")
      }

      return data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to send OTP")
    }
  },
)

export const verifyOTP = createAsyncThunk<VerifyOTPResponse, VerifyOTPPayload, { rejectValue: string }>(
  "auth/verifyOTP",
  async (payload, { rejectWithValue }) => {
    try {
      const requestBody =
        payload.type === "mobile"
          ? {
            vendor_location_uuid: payload.vendorLocationUuid,
            dial_code: payload.dialCode || 91,
            mobile: `${payload.dialCode || 91}${payload.mobile}`,
            country_id: payload.countryId || "1",
            otp: payload.otp,
          }
          : {
            vendor_location_uuid: payload.vendorLocationUuid,
            email: payload.email,
            otp: payload.otp,
          }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to verify OTP")
      }

      const data: VerifyOTPResponse = await response.json()

      if (!data.status) {
        throw new Error(data.message || "Invalid OTP")
      }

      return data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to verify OTP")
    }
  },
)

export const completeRegistration = createAsyncThunk<User, CompleteRegistrationPayload, { rejectValue: string }>(
  "auth/completeRegistration",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const { otpSentTo, tempToken } = state.auth

      const authToken = tempToken || getAuthToken()

      if (!authToken) {
        throw new Error("Authorization token is missing. Please verify OTP again.")
      }

      console.log("🚀 Starting registration with token:", authToken ? "exists" : "missing")

      // Construct the request body based on the verification method
      const requestBody: ProfileSetupRequestBody = {
        password: payload.password,
        name: payload.fullName,
        vendor_location_uuid: payload.vendorLocationUuid,
        verified_by: otpSentTo as "mobile" | "email", // Use the actual verification method without default
        gender: " ",
        dial_code: "91",
        country_id: "1",
      }

      // Add mobile or email based on verification method
      if (otpSentTo === "mobile") {
        // If verified by mobile, we already have the mobile number but need to collect email
        requestBody.mobile = `91${payload.mobile || ""}`
        requestBody.email = payload.email || ""
      } else {
        // If verified by email, we already have the email but need to collect mobile
        requestBody.email = payload.email || ""
        requestBody.mobile = `91${payload.mobile || ""}`
      }

      console.log("📤 Registration request body:", { ...requestBody, password: "***" })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile-setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        console.log("❌ Registration API response not ok:", response.status, response.statusText)
        let errorMessage = "Failed to complete registration"

        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          console.log("Registration error details:", errorData)
        } catch (e) {
          console.log(e, "====error in complete registration")
        }

        throw new Error(errorMessage)
      }

      const data: ProfileSetupResponse = await response.json()
      console.log("✅ Registration API response:", data)

      if (!data.status) {
        throw new Error(data.message || "Registration failed")
      }

      // Create user object directly from the registration response
      const apiUser = data.data.data.user
      const newToken = data.data.data.token

      console.log("✅ Registration successful, storing new token")
      storeAuthToken(newToken)

      // Create user object directly instead of fetching profile
      const user: User = {
        id: apiUser.id,
        fname: apiUser.fname,
        lname: apiUser.lname,
        display_name: apiUser.display_name,
        gender: apiUser.gender,
        profile_pic: apiUser.profile_pic,
        email: apiUser.email,
        mobile: apiUser.mobile,
        locality: apiUser.locality,
        dob: apiUser.dob,
        anniversary: apiUser.anniversary,
        is_email_verify: apiUser.is_email_verify,
        email_verify_token: apiUser.email_verify_token,
        is_mobile_verify: apiUser.is_valid_mobile,
        is_valid_mobile: apiUser.is_valid_mobile,
        address: apiUser.address,
        country_id: apiUser.country_id,
        uuid: apiUser.uuid,
        createdAt: apiUser.createdAt,
        updatedAt: apiUser.updatedAt,
        isLoggedIn: true,
        token: newToken,
      }

      console.log("✅ User object created from registration response")
      return user
    } catch (error) {
      console.log("❌ Registration error:", error)
      return rejectWithValue(error instanceof Error ? error.message : "Registration failed")
    }
  },
)

export const loginWithPassword = createAsyncThunk<
  User,
  { type: "mobile" | "email"; mobile?: string; email?: string; password: string; vendorLocationUuid: string },
  { rejectValue: string }
>("auth/loginWithPassword", async (payload, { rejectWithValue, dispatch }) => {
  try {
    const requestBody =
      payload.type === "mobile"
        ? {
          dial_code: 91,
          country_id: "1",
          mobile: `91${payload.mobile}`,
          password: payload.password,
          vendor_location_uuid: payload.vendorLocationUuid,
        }
        : {
          email: payload.email,
          password: payload.password,
          vendor_location_uuid: payload.vendorLocationUuid,
        }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error("Failed to login")
    }

    const data = await response.json()
    console.log(data.data.data.token, "=>>>>>>>>userlogindata")
    if (!data.status) {
      throw new Error(data.message || "Login failed")
    }

    const token = data.data.data?.token
    if (token) {
      storeAuthToken(token)

      // Fetch user profile after login
      const profileResult = await dispatch(getUserProfile())
      if (getUserProfile.fulfilled.match(profileResult)) {
        return profileResult.payload
      } else {
        throw new Error("Failed to fetch user profile after login")
      }
    } else {
      throw new Error("No token received from login")
    }
  } catch (error) {
    console.log("Login error:", error)
    return rejectWithValue(error instanceof Error ? error.message : "Login failed")
  }
})

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetOTPState: (state) => {
      state.otpSent = false
      state.otpSentTo = null
      state.otpContact = null
      state.error = null
      state.alreadyRegistered = false
      state.skipProfile = false
      state.tempToken = null
    },
    resetForgotPasswordState: (state) => {
      state.forgotPasswordOtpSent = false
      state.forgotPasswordOtpSentTo = null
      state.forgotPasswordContact = null
      state.error = null
      state.isResettingPassword = false
    },
    initializeAuth: (state) => {
      console.log("🔧 Initializing auth...")

      // Just check if token exists, but don't do anything with it
      const authToken = getAuthToken()
      console.log("🔧 Token found during init:", !!authToken)

      if (authToken && isValidTokenFormat(authToken)) {
        state.tempToken = authToken
        console.log("✅ Valid token found and stored")
      } else {
        state.tempToken = null
        console.log("❌ No valid token found")
        // Clean up invalid token
        if (authToken) {
          console.log("🧹 Cleaning up invalid token")
          removeAuthToken()
        }
      }

      // Mark as initialized
      state.isInitialized = true
      console.log("✅ Auth initialization complete")
    },
    // Keep the old logout as a fallback for immediate local logout
    logout: (state) => {
      console.log("🚪 Immediate local logout")
      state.user = null
      state.otpSent = false
      state.otpSentTo = null
      state.otpContact = null
      state.error = null
      state.alreadyRegistered = false
      state.skipProfile = false
      state.tempToken = null
      state.isLoadingProfile = false
      state.isLoggingOut = false
      state.isInitialized = true
      // Reset forgot password state
      state.forgotPasswordOtpSent = false
      state.forgotPasswordOtpSentTo = null
      state.forgotPasswordContact = null
      state.isResettingPassword = false
      removeAuthToken()
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    silentClearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Send Forgot Password OTP
    builder
      .addCase(sendForgotPasswordOTP.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.forgotPasswordOtpSent = false
      })
      .addCase(sendForgotPasswordOTP.fulfilled, (state, action) => {
        state.isLoading = false
        state.forgotPasswordOtpSent = true
        state.error = null

        const message = action.meta.arg
        state.forgotPasswordOtpSentTo = message.type
        state.forgotPasswordContact =
          message.type === "mobile" ? `${message.dialCode || 91}${message.mobile}` : message.email || null
      })
      .addCase(sendForgotPasswordOTP.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "Failed to send forgot password OTP"
        state.forgotPasswordOtpSent = false
      })

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isResettingPassword = false
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isResettingPassword = true
        state.error = null
        // Reset forgot password state after successful reset
        state.forgotPasswordOtpSent = false
        state.forgotPasswordOtpSentTo = null
        state.forgotPasswordContact = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isResettingPassword = false
        state.error = action.payload || "Failed to reset password"
      })

    // Logout User (API call)
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoggingOut = true
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // Clear all auth state after successful logout
        state.user = null
        state.otpSent = false
        state.otpSentTo = null
        state.otpContact = null
        state.error = null
        state.alreadyRegistered = false
        state.skipProfile = false
        state.tempToken = null
        state.isLoadingProfile = false
        state.isLoggingOut = false
        state.isInitialized = true
        // Reset forgot password state
        state.forgotPasswordOtpSent = false
        state.forgotPasswordOtpSentTo = null
        state.forgotPasswordContact = null
        state.isResettingPassword = false
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout API fails, clear local state
        state.user = null
        state.otpSent = false
        state.otpSentTo = null
        state.otpContact = null
        state.alreadyRegistered = false
        state.skipProfile = false
        state.tempToken = null
        state.isLoadingProfile = false
        state.isLoggingOut = false
        state.isInitialized = true
        // Reset forgot password state
        state.forgotPasswordOtpSent = false
        state.forgotPasswordOtpSentTo = null
        state.forgotPasswordContact = null
        state.isResettingPassword = false
        // Don't set error for logout failures - we want logout to always succeed locally
        state.error = null
      })

    // Get User Profile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.isLoadingProfile = true
        state.error = null
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoadingProfile = false
        state.user = action.payload
        state.error = null
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoadingProfile = false
        if (!action.payload?.includes("token") && !action.payload?.includes("session expired")) {
          state.error = action.payload || "Failed to fetch user profile"
        }
        if (action.payload?.includes("token") || action.payload?.includes("session expired")) {
          state.tempToken = null
          removeAuthToken()
        }
      })

    // Send OTP
    builder
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.otpSent = false
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.isLoading = false
        state.otpSent = true
        state.error = null

        const message = action.meta.arg
        state.otpSentTo = message.type
        state.otpContact =
          message.type === "mobile" ? `${message.dialCode || 91}${message.mobile}` : message.email || null
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "Failed to send OTP"
        state.otpSent = false
      })

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isVerifying = true
        state.error = null
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isVerifying = false
        state.error = null

        const { already_registered, skip_profile, token } = action.payload.data.data

        // Store the token
        state.tempToken = token
        storeAuthToken(token)

        // Set registration flags
        state.alreadyRegistered = already_registered
        state.skipProfile = skip_profile

        // Reset OTP state
        state.otpSent = false
        // state.otpSentTo = null
        state.otpContact = null
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isVerifying = false
        state.error = action.payload || "Failed to verify OTP"
        // state.otpSentTo = null
        state.otpContact = null
      })

    // Complete Registration
    builder
      .addCase(completeRegistration.pending, (state) => {
        state.isRegistering = true
        state.error = null
      })
      .addCase(completeRegistration.fulfilled, (state, action) => {
        state.isRegistering = false
        state.user = action.payload
        state.error = null
        state.otpSent = false
        state.otpSentTo = null
        state.otpContact = null
        state.alreadyRegistered = false
        state.skipProfile = false
        state.tempToken = null
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        state.isRegistering = false
        state.error = action.payload || "Registration failed"
      })

    // Login with Password
    builder
      .addCase(loginWithPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
        state.tempToken = action.payload.token
        state.otpSentTo = null
        state.otpContact = null
        state.otpSent = false
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "Login failed"
      })

    // update user
    builder
      .addCase(updateUserProfile.pending, (state: AuthState) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state: AuthState, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isLoading = false
        state.error = null

      })
      .addCase(updateUserProfile.rejected, (state: AuthState, action: PayloadAction<string | undefined>) => {
        state.isLoading = false
        state.error = action.payload || "Failed to update profile"

        // Handle token expiration
        if (action.payload?.includes("token") || action.payload?.includes("session expired")) {
          state.tempToken = null
          removeAuthToken()
        }
      })
  },

})


// Add this interface with your other interfaces
interface UpdateProfilePayload {
  name: string
  email: string
  dob: string
  gender: string
  mobile: string
  dial_code: string
  country_id: string
  address: string
  anniversary: string
  vendor_location_uuid: string
  profile_pic?: File | null // Add this line
}

interface UpdateProfileResponse {
  status: boolean
  fromCache: boolean
  data: {
    message: string
    code: number
    data: {
      user: {
        id: number
        fname: string
        lname: string
        display_name: string | null
        gender: string
        profile_pic: string | null
        email: string | null
        mobile: string | null
        locality: string | null
        dob: string | null
        anniversary: string | null
        is_email_verify: boolean
        email_verify_token: string | null
        is_mobile_verify: boolean
        is_valid_mobile: boolean
        address: string | null
        country_id: number | string
        uuid: string
        createdAt: string
        updatedAt: string
      }
      skip_profile: boolean
      token: string
    }
  }
}


// UPDATED updateUserProfile async thunk
export const updateUserProfile = createAsyncThunk<User, UpdateProfilePayload, { rejectValue: string }>(
  "auth/updateUserProfile",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const authToken = getAuthToken()

      console.log("🚀 Updating user profile with token:", authToken ? "exists" : "missing");
      console.log("📤 Update payload:", { ...payload, profile_pic: payload.profile_pic ? "[File]" : null });

      if (!authToken || !isValidTokenFormat(authToken)) {
        console.log("❌ updateUserProfile: No valid token")
        throw new Error("No valid authentication token found")
      }

      // Create FormData for the API request
      const formData = new FormData()
      formData.append("vendor_location_uuid", payload.vendor_location_uuid)
      formData.append("email", payload.email || "")
      formData.append("name", payload.name)
      formData.append("dob", payload.dob || "")
      formData.append("gender", payload.gender || "")
      formData.append("mobile", payload.mobile ? `${payload.dial_code}${payload.mobile}` : "")
      formData.append("dial_code", payload.dial_code)
      formData.append("country_id", payload.country_id)
      formData.append("address", payload.address || "")

      // Only append anniversary if it has a value
      if (payload.anniversary) {
        formData.append("anniversary", payload.anniversary)
      }

      // Add profile image if selected
      if (payload.profile_pic) {
        formData.append("profile_pic", payload.profile_pic)
      }

      console.log("📤 Making profile update API call")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/update-profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        console.log("❌ Profile update API response not ok:", response.status, response.statusText)
        let errorMessage = `Failed to update profile: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          console.log("Profile update error details:", errorData)
        } catch (e) {
          console.log("Error parsing error response:", e)
        }

        if (response.status === 401 || response.status === 403) {
          removeAuthToken()
          throw new Error("Authentication session expired")
        }
        throw new Error(errorMessage)
      }

      const data: UpdateProfileResponse = await response.json()
      console.log("✅ Profile update API response:", data)

      if (!data.status) {
        throw new Error(data.data?.message || "Failed to update profile")
      }

      const apiUser = data.data.data.user
      const newToken = data.data.data.token

      // Update stored token if a new one is provided
      if (newToken) {
        console.log("✅ Updating stored token")
        storeAuthToken(newToken)
      }

      // Create updated user object - MAKE SURE ALL FIELDS ARE MAPPED CORRECTLY
      const updatedUser: User = {
        id: apiUser.id,
        fname: apiUser.fname,
        lname: apiUser.lname,
        display_name: apiUser.display_name,
        gender: apiUser.gender,
        profile_pic: apiUser.profile_pic,
        email: apiUser.email,
        mobile: apiUser.mobile,
        locality: apiUser.locality,
        dob: apiUser.dob,
        anniversary: apiUser.anniversary,
        is_email_verify: apiUser.is_email_verify,
        email_verify_token: apiUser.email_verify_token,
        is_mobile_verify: apiUser.is_mobile_verify,
        is_valid_mobile: apiUser.is_valid_mobile,
        address: apiUser.address,
        country_id: apiUser.country_id,
        uuid: apiUser.uuid,
        createdAt: apiUser.createdAt,
        updatedAt: apiUser.updatedAt,
        isLoggedIn: true,
        token: newToken || authToken,
        country: state.auth.user?.country, // Keep existing country data
      }

      console.log("✅ Profile updated successfully - returning user:", updatedUser)
      return updatedUser
    } catch (error) {
      console.log("❌ Error updating user profile:", error)
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update profile")
    }
  },
)

export const {
  clearError,
  resetOTPState,
  resetForgotPasswordState,
  initializeAuth,
  logout,
  updateUser,
  silentClearError,
} = authSlice.actions
export default authSlice.reducer
