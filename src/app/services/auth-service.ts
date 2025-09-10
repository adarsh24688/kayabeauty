import axios from 'axios';
import { ChangePasswordRequest, ForgotPasswordRequest, ForgotPasswordResponse, LoginRequest, ProfileResponse, ProfileSetupRequest, ProfileSetupResponse, ResetPasswordRequest, ResetPasswordResponse, SendOtpRequest, UpdateProfileRequest, UpdateProfileResponse, VerifyOtpRequest } from '../lib/types';
import { CreateCustomerParams } from '../lib/types';
import { generateToken, getValidToken } from './token-service';

export async function createCustomer(customerData: CreateCustomerParams, vendor_location_uuid: string) {
  const url = `${process.env.DINGG_API_URL}/vendor/customer_create`;

  // Ensure all required fields are present with default values if not provided
  const payload = {
    fname: customerData.fname,
    lname: customerData.lname,
    mobile: customerData.mobile,
    sms_trans: customerData.sms_trans ?? true,
    sms_promo: customerData.sms_promo ?? true,
    email_trans: customerData.email_trans ?? false,
    email_promo: customerData.email_promo ?? false
  };

  try {
    const token = await getValidToken();

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'vendor_location_uuid': vendor_location_uuid
      }
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Token might be expired or invalid — regenerate and retry once
      const newToken = await generateToken();
      const retryResponse = await axios.post(
        url,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': newToken,
            'vendor_location_uuid': vendor_location_uuid
          }
        }
      );
      return retryResponse.data;
    }

    console.error('createCustomer API Error:', error.response?.data || error.message);
    throw error;
  }
}

// ------------- send-otp ------------- 

export async function sendOtp(data: SendOtpRequest) {
  try {
    const url = `${process.env.DINGG_API_URL}/client/auth/send-otp`;
    let payload;

    // Check which type of OTP needs to be sent
    if (data.mobile) {
      // Case 1: Mobile OTP
      payload = {
        dial_code: data.dial_code,
        mobile: data.mobile,
        country_id: data.country_id,
        vendor_location_uuid: data.vendor_location_uuid
      };
    } else if (data.email) {
      // Case 2: Email OTP
      payload = {
        email: data.email,
        vendor_location_uuid: data.vendor_location_uuid
      };
    } else {
      throw new Error('Either mobile number with dial_code and country_id OR email is required');
    }

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Send OTP Error:', error.response?.data || error.message);
    throw error;
  }
}

// ------------- verify-otp ------------- 

export async function verifyOtp(data: VerifyOtpRequest) {
  try {
    const url = `${process.env.DINGG_API_URL}/client/auth/verify-otp`;
    let payload;

    // Check which type of OTP verification needs to be done
    if (data.mobile) {
      // Case 1: Mobile OTP verification
      payload = {
        vendor_location_uuid: data.vendor_location_uuid,
        dial_code: data.dial_code,
        mobile: data.mobile,
        country_id: data.country_id,
        otp: data.otp
      };
    } else if (data.email) {
      // Case 2: Email OTP verification
      payload = {
        vendor_location_uuid: data.vendor_location_uuid,
        email: data.email,
        otp: data.otp
      };
    } else {
      throw new Error('Either mobile number with dial_code and country_id OR email is required');
    }

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Verify OTP Error:', error.response?.data || error.message);
    throw error;
  }
}

// ------------- login ------------- 

export async function login(data: LoginRequest) {
  try {
    const url = `${process.env.DINGG_API_URL}/client/auth/login`;

    // Base payload always required
    const payload: Partial<LoginRequest> = {
      vendor_location_uuid: data.vendor_location_uuid,
      password: data.password
    };

    // Choose identity path
    if (data.email) {
      payload.email = data.email;
    } else if (data.mobile && data.dial_code && data.country_id) {
      payload.mobile = data.mobile;
      payload.dial_code = data.dial_code;
      payload.country_id = data.country_id;
    } else {
      throw new Error('Invalid input: provide either email OR mobile with dial_code & country_id');
    }

    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 200 || response.status === 201) {
      return response.data; // e.g. { token, user, ... }
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Login Error:', error.response?.data || error.message);
    throw error;
  }
}

// ------------- get-profile ------------- 

export async function getProfile(token: string): Promise<ProfileResponse> {
  try {
    const url = `${process.env.DINGG_API_URL}/client/auth/profile`;

    // Remove 'Bearer' prefix if it exists in the token
    const cleanToken = token.replace('Bearer ', '');

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanToken}`
      }
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Get Profile Error:', error.response?.data || error.message);
    throw error;
  }
}

// ------------- forgot-password ------------- 

export async function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  try {
    const url = `${process.env.DINGG_API_URL}/client/auth/forgot-password`;

    const payload: Partial<ForgotPasswordRequest> = {
      vendor_location_uuid: data.vendor_location_uuid
    };

    if (data.email) {
      payload.email = data.email;
    } else if (data.mobile && data.dial_code && data.country_id) {
      payload.mobile = data.mobile;
      payload.dial_code = data.dial_code;
      payload.country_id = data.country_id;
    } else {
      throw new Error('Invalid input: Provide either email or mobile with dial_code and country_id');
    }

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Forgot Password Error:', error.response?.data || error.message);
    throw error;
  }
}

// ------------- reset-password ------------- 

export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  try {
    const url = `${process.env.DINGG_API_URL}/client/auth/reset-password`;
    console.log(data, "check data=>>>>>")
    // Base payload: always required fields
    const payload: Partial<ResetPasswordRequest> = {
      vendor_location_uuid: data.vendor_location_uuid,
      password: data.password,
      verification_code: data.verification_code
    };

    // Decide which identity fields to include
    if (data.email) {
      payload.email = data.email;
    } else if (data.mobile && data.dial_code && data.country_id) {
      payload.mobile = data.mobile;
      payload.dial_code = data.dial_code;
      payload.country_id = data.country_id;
    } else {
      throw new Error('Invalid input: Provide either email OR mobile, dial_code, country_id');
    }

    console.log(payload, "check payload===>")
    const response = await axios.patch(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });


    console.log(response, "check response===>")

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Reset Password Error:', error.response?.data || error.message);
    throw error;
  }
}

// ------------- update-profile ------------- 

export async function updateProfile(body: UpdateProfileRequest, file: File | null, token: string): Promise<UpdateProfileResponse> {
  try {

    const url = `${process.env.DINGG_API_URL}/client/auth/profile`;

    let requestBody: any;
    const headers: any = {
      'Authorization': token
    };

    if (file) {
      // If file is present, use FormData
      const formData = new FormData();

      // Append the file
      formData.append('profile_pic', file);

      // Append other form fields
      formData.append('vendor_location_uuid', body.vendor_location_uuid);
      formData.append('email', body.email);
      formData.append('name', body.name);
      formData.append('gender', body.gender || '');
      formData.append('mobile', body.mobile);
      formData.append('dial_code', body.dial_code);
      formData.append('country_id', body.country_id);

      if (body.dob) formData.append('dob', body.dob);
      if (body.address) formData.append('address', body.address);

      requestBody = formData;

    } else {
      // If no file, send JSON
      requestBody = JSON.stringify({
        vendor_location_uuid: body.vendor_location_uuid,
        email: body.email,
        name: body.name,
        gender: body.gender,
        mobile: body.mobile,
        dial_code: body.dial_code,
        country_id: body.country_id,
        dob: body.dob,
        address: body.address
      });
      headers['Content-Type'] = 'application/json';
    }

    const response = await axios.patch(url, requestBody, { headers });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Update Profile Error:', error.response?.data || error.message);
    throw error;
  }
}

// ------------- profile-setup ------------- 

export async function profileSetup(data: ProfileSetupRequest, token: string): Promise<ProfileSetupResponse> {
  try {
    const url = `${process.env.DINGG_API_URL}/client/auth/profile/setup`;

    const payload = {
      password: data.password,
      name: data.name,
      mobile: data.mobile,
      vendor_location_uuid: data.vendor_location_uuid,
      verified_by: data.verified_by,
      gender: data.gender,
      email: data.email,
      dial_code: data.dial_code,
      country_id: data.country_id
    };

    const cleanToken = token.replace('Bearer ', '');

    const response = await axios.put(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanToken}`
      }
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Profile Setup Error:', error.response?.data || error.message);
    throw error;
  }
}

// ------------- change-password -------------

export async function changePassword(params: ChangePasswordRequest, token: string): Promise<any> {
  try {
    const url = `${process.env.DINGG_API_URL}/client/auth/change-password`;

    const payload = {
      vendor_location_uuid: params.vendor_location_uuid,
      old_password: params.old_password,
      new_password: params.new_password
    };

    const headers = {
      'Authorization': token,
      'Content-Type': 'application/json'
    };

    const response = await axios.patch(url, payload, { headers });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Change Password Error:', error.response?.data || error.message);
    throw error;
  }
}

// ------------- user-logout -------------

export async function user_logout(token: string): Promise<any> {
  try {
    const url = `${process.env.DINGG_API_URL}/client/auth/logout`;
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const response = await axios.put(
      url,
      null, // no body for logout
      {
        headers: {
          'Authorization': authHeader
        }
      }
    );

    console.log("Logout response:", response.data);

    if (response.status === 200 || response.status === 204) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error;
  }
}



