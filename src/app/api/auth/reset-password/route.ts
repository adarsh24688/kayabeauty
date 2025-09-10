import { NextRequest } from 'next/server';
import { resetPassword } from '@/services/auth-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { resetPasswordSchema } from '@/lib/schemas';
import { ResetPasswordRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // Validate request body with Joi schema (supports both mobile and email)
    const body = await validateJSON<ResetPasswordRequest>(req, resetPasswordSchema);
    console.log(body, "=======>")
    // Call the service function
    const result = await resetPassword(body);

    return responseHandler(messages.user.password_reset, true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    return errorHandler(
      error.message || 'Failed to reset password',
      error
    );
  }
}
