import { NextRequest } from 'next/server';
import { updateProfile } from '@/services/auth-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';

export async function POST(req: NextRequest) {
  try {
    // Get authorization token
    const token = req.headers.get('authorization');
    if (!token) {
      return errorHandler('Authorization token is required');
    }

    // Parse form data (supports both JSON and multipart)
    let body: any = {};
    let file: File | null = null;

    const contentType = req.headers.get('content-type');

    if (contentType?.includes('multipart/form-data')) {
      // Handle multipart form data
      const formData = await req.formData();

      // Extract file if present
      const profilePic = formData.get('profile_pic') as File | null;
      if (profilePic && profilePic.size > 0) {
        file = profilePic;
      }

      // Extract other fields
      body = {
        vendor_location_uuid: formData.get('vendor_location_uuid')?.toString(),
        name: formData.get('name')?.toString(),
        email: formData.get('email')?.toString(),
        mobile: formData.get('mobile')?.toString(),
        gender: formData.get('gender')?.toString(),
        dial_code: formData.get('dial_code')?.toString(),
        country_id: formData.get('country_id')?.toString(),
        dob: formData.get('dob')?.toString() || undefined,
        address: formData.get('address')?.toString() || undefined,
      };
    } else {
      // Handle JSON data
      body = await req.json();
    }

    // Basic validation
    if (!body.vendor_location_uuid) {
      return errorHandler('vendor_location_uuid is required');
    }

    // Call the service function
    const result = await updateProfile(body, file, token);

    return responseHandler(messages.user.updateProfile, true, result);

  } catch (error: any) {
    return errorHandler(
      error.message || 'Failed to update profile',
      error
    );
  }
}

// Also support PATCH method
export async function PATCH(req: NextRequest) {
  return POST(req);
}
