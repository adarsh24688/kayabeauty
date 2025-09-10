import { NextRequest } from 'next/server';
import { getProfile } from '@/services/auth-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';

export async function GET(req: NextRequest) {
  try {
    // Get authorization token from headers (exactly like your backend)
    const token = req.headers.get('authorization');

    if (!token) {
      return errorHandler('Authorization token is required');
    }

    // Call the service function
    const result = await getProfile(token);

    return responseHandler(messages.user.profile_found, true, result);
  } catch (error: any) {
    return errorHandler(
      error.message || 'Failed to fetch profile',
      error
    );
  }
}
