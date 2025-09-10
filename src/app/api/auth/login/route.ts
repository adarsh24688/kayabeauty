import { NextRequest } from 'next/server';
import { login } from '@/services/auth-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { loginCustomerSchema } from '@/lib/schemas';
import { LoginRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // Validate request body with Joi schema (supports both mobile and email login)
    const body = await validateJSON<LoginRequest>(req, loginCustomerSchema);

    // Call the service function
    const result = await login(body);

    return responseHandler(messages.user.login_success, true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    return errorHandler(
      error.message || 'Login failed',
      error
    );
  }
}
