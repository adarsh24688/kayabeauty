import { NextRequest } from 'next/server';
import { user_logout } from '@/services/auth-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';

export async function GET(req: NextRequest) {
  try {
    // Get auth token from headers
    const token = req.headers.get('authorization');
    if (!token) {
      return errorHandler('Authorization token is required');
    }

    // Call the service function
    const result = await user_logout(token);

    return responseHandler(messages.user.logout || 'Logout successful', true, result);
  } catch (error: any) {
    return errorHandler(
      error.message || 'Logout failed',
      error
    );
  }
}

// Also support PUT method (matching your backend)
export async function PUT(req: NextRequest) {
  return GET(req);
}
