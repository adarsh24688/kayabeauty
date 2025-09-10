import { NextRequest } from 'next/server';
import { verifyOtp } from '@/services/auth-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { verifyOtpSchema } from '@/lib/schemas';
import { VerifyOtpRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // Validate request body with Joi schema (supports both mobile and email OTP)
    const body = await validateJSON<VerifyOtpRequest>(req, verifyOtpSchema);

    // Call the service function
    const result = await verifyOtp(body);

    return responseHandler(messages.user.otp_verified, true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    return errorHandler(
      error.message || 'Failed to verify OTP',
      error
    );
  }
}
