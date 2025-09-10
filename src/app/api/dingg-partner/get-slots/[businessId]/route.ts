import { NextRequest } from 'next/server';
import { getSlots } from '@/services/dingg-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { getSlotsSchema } from '@/lib/schemas';
import { GetSlotsRequest } from '@/lib/types';

export async function POST(
  req: NextRequest,
  context: any
) {
  try {
    const { businessId } = context.params;

    if (!businessId || businessId.trim() === '') {
      return errorHandler('Business ID is required');
    }

    // Validate request body with Joi schema
    const body = await validateJSON<GetSlotsRequest>(req, getSlotsSchema);

    const result = await getSlots(businessId, {
      startDate: body.startDate,
      endDate: body.endDate,
      serviceIds: body.serviceIds || [],
      staffId: body.staffId
    });

    return responseHandler(messages.record_found, true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    return errorHandler(
      error.message || 'Failed to fetch slots',
      error
    );
  }
}
