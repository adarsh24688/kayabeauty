import { NextRequest } from 'next/server';
import { sendOtp } from '@/services/auth-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { sendOtpSchema } from '@/lib/schemas';
import { SendOtpRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // Validate request body with Joi schema (supports both mobile and email OTP)
    const body = await validateJSON<SendOtpRequest>(req, sendOtpSchema);

    // Call the service function
    const result = await sendOtp(body);

    return responseHandler(messages.user.otp_sent, true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    return errorHandler(
      error.message || 'Failed to send OTP',
      error
    );
  }
}
