export interface GetSlotsRequest {
  startDate: string;
  endDate: string;
  serviceIds?: string[];
  staffId?: string;
}

export interface DinggHeaders {
  [key: string]: string;
  access_code: string;
  api_key: string;
  'Content-Type': string;
  Authorization: string;
}

export type SendOtpRequest =
  | {
    dial_code: number;
    mobile: string;
    country_id: string;
    vendor_location_uuid: string;
    email?: never;
  }
  | {
    email: string;
    vendor_location_uuid: string;
    dial_code?: never;
    mobile?: never;
    country_id?: never;
  };

export type VerifyOtpRequest =
  | {
    vendor_location_uuid: string;
    dial_code: number;
    mobile: string;
    country_id: string;
    otp: string;
    email?: never;
  }
  | {
    vendor_location_uuid: string;
    email: string;
    otp: string;
    dial_code?: never;
    mobile?: never;
    country_id?: never;
  };

export type LoginRequest =
  | {
    vendor_location_uuid: string;
    password: string;
    email: string;
    dial_code?: never;
    mobile?: never;
    country_id?: never;
  }
  | {
    vendor_location_uuid: string;
    password: string;
    dial_code: number;
    mobile: string;
    country_id: string;
    email?: never;
  };

export interface ProfileResponse {
  message: string;
  code: number;
  data: {
    skip_profile: boolean;
    user: {
      id: number;
      fname: string;
      lname: string;
      display_name: string | null;
      gender: string | null;
      profile_pic: string | null;
      email: string;
      mobile: string;
      locality: string | null;
      dob: string | null;
      anniversary: string | null;
      is_email_verify: boolean;
      email_verify_token: string | null;
      is_mobile_verify: boolean;
      is_valid_mobile: boolean;
      address: string | null;
      country_id: number;
      uuid: string;
      createdAt: string;
      updatedAt: string;
      country: {
        dial_code: number;
        id: number;
        country_name: string;
        country_code: string;
        possible_length: number[];
      };
    };
  };
};


export type ForgotPasswordRequest =
  | {
    vendor_location_uuid: string;
    email: string;
    dial_code?: never;
    mobile?: never;
    country_id?: never;
  }
  | {
    vendor_location_uuid: string;
    dial_code: number;
    mobile: string;
    country_id: number;
    email?: never;
  };

export interface ForgotPasswordResponse {
  message: string;
  code: number;
};


export type ResetPasswordRequest =
  | {
    vendor_location_uuid: string;
    password: string;
    verification_code: string;
    email: string;
    dial_code?: never;
    mobile?: never;
    country_id?: never;
  }
  | {
    vendor_location_uuid: string;
    password: string;
    verification_code: string;
    dial_code: number;
    mobile: string;
    country_id: string;
    email?: never;
  };

export interface ResetPasswordResponse {
  message: string;
  code: number;
};


export interface UpdateProfileRequest {
  vendor_location_uuid: string;
  name: string;
  email: string;
  mobile: string;
  gender?: string;
  dial_code: string;
  country_id: string;
  dob?: string;
  address?: string;
}

export interface UpdateProfileResponse {
  message: string;
  code: number;
  data: {
    user: {
      id: number;
      fname: string;
      lname: string;
      display_name: string | null;
      gender: string;
      profile_pic: string;
      email: string;
      mobile: string;
      locality: string | null;
      dob: string;
      anniversary: string | null;
      is_email_verify: boolean;
      email_verify_token: string | null;
      is_mobile_verify: boolean;
      is_valid_mobile: boolean;
      address: string;
      country_id: string;
      uuid: string;
      createdAt: string;
      updatedAt: string;
    };
    skip_profile: boolean;
    token: string;
  };
};



export interface ProfileSetupRequest {
  password: string;
  name: string;
  mobile: string;
  vendor_location_uuid: string;
  verified_by: 'email' | 'mobile';
  gender?: string;
  email: string;
  dial_code: string;
  country_id: string;
}

export interface ProfileSetupResponse {
  message: string;
  code: number;
  data: {
    user: {
      id: number;
      fname: string;
      lname: string;
      display_name: string | null;
      gender: string | null;
      profile_pic: string | null;
      email: string;
      mobile: string;
      locality: string | null;
      dob: string | null;
      anniversary: string | null;
      is_email_verify: boolean;
      email_verify_token: string | null;
      is_mobile_verify: boolean;
      is_valid_mobile: boolean;
      address: string | null;
      country_id: string;
      uuid: string;
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  };
};



export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  vendor_location_uuid: string;
}

export interface CreateBookingRequest {
  vendor_location_uuid: string;
  booking_date: string;
  booking_comment?: string;
  booking_status: string;
  merge_services_of_same_staff: boolean;
  total: number;
  services: Array<{
    service_id: number;
    service_name: string;
    start_time: number;
    end_time: number;
  }>;
}

export interface GetUserBookingsRequest {
  vendor_location_uuid: string;
  booking_type: number; // 1 = UPCOMING, 2 = CANCELLED, 3 = PREVIOUS
  page?: number;
  limit?: number;
}

export interface CancelBookingRequest {
  vendor_location_uuid: string;
  id: string; // Booking ID to cancel
}





export interface CreateCustomerParams {
  fname: string;
  lname: string;
  mobile: string;
  sms_trans?: boolean;
  sms_promo?: boolean;
  email_trans?: boolean;
  email_promo?: boolean;
}