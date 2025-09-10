import { NextRequest } from 'next/server';
import { changePassword } from '@/services/auth-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { changePasswordSchema } from '@/lib/schemas';
import { ChangePasswordRequest } from '@/lib/types';

export async function PATCH(req: NextRequest) {
  try {
    // Get auth token from headers
    const token = req.headers.get('authorization');
    if (!token) {
      return errorHandler('Authorization token is required');
    }

    // Validate request body
    const body = await validateJSON<ChangePasswordRequest>(req, changePasswordSchema);

    // Call the service function
    const result = await changePassword(body, token);

    return responseHandler(messages.user.changePassword, true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    return errorHandler(
      error.message || 'Failed to change password',
      error
    );
  }
}

// Also support POST method for compatibility
export async function POST(req: NextRequest) {
  return PATCH(req);
}
