import axios from 'axios';
import { getValidToken, generateToken } from './token-service';
import { CancelBookingRequest, CreateBookingRequest, DinggHeaders, GetSlotsRequest, GetUserBookingsRequest, ProfileResponse } from '../lib/types';
import { getProfile } from './auth-service';

function getHeaders(token: string): DinggHeaders {
	return {
		'access_code': process.env.DINGG_ACCESS_CODE!,
		'api_key': process.env.DINGG_API_KEY!,
		'Content-Type': 'application/json',
		'Authorization': token
	};
}

export async function getLocations() {
	const url = `${process.env.DINGG_API_URL}/tech-partner/locations`;

	const token = await getValidToken();

	try {
		const response = await axios.get(url, {
			headers: getHeaders(token),
		});

		return response.data;
	} catch (error: any) {
		// If token is expired or unauthorized, regenerate and retry
		if (error.response?.status === 401) {
			console.warn("Token expired or unauthorized. Regenerating...");
			const newToken = await generateToken();

			const retryResponse = await axios.get(url, {
				headers: getHeaders(newToken),
			});

			return retryResponse.data;
		}

		console.error("Error in getLocations:", error.response?.data || error.message);
		throw error;
	}
}

export async function getServices(businessId: string) {
	const token = await getValidToken();
	const url = `${process.env.CUSTOMER_BOOKING_URL}/client/business/${businessId}/services`;

	const headers = {
		'Content-Type': 'application/json',
		'Authorization': token
	};

	try {
		const response = await axios.get(url, { headers });
		return response.data;
	} catch (error: any) {
		if (error.response?.status === 401) {
			// Token might be expired or invalid — regenerate and retry once
			console.warn("Token expired or unauthorized in getServices. Regenerating...");
			const newToken = await generateToken();

			const retryResponse = await axios.get(url, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': newToken,
				}
			});

			return retryResponse.data;
		} else {
			console.error("getServices error:", error.response?.data || error.message);
			throw error;
		}
	}
}

export async function getOperators(businessId: string) {
	// Get a cached / still-valid token
	const token = await getValidToken();
	const url = `${process.env.CUSTOMER_BOOKING_URL}/client/business/${businessId}/operators`;

	const headers = {
		'Content-Type': 'application/json',
		'Authorization': token
	};

	try {
		// First attempt
		const response = await axios.get(url, { headers });
		return response.data;
	} catch (error: any) {
		// If token was invalid/expired, regenerate once and retry
		if (error.response?.status === 401) {
			console.warn("Token expired or unauthorized in getOperators. Regenerating...");
			const newToken = await generateToken();

			const retryResponse = await axios.get(url, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': newToken
				}
			});

			return retryResponse.data;
		}

		// Any other error → bubble up
		console.error('getOperators error:', error.response?.data || error.message);
		throw error;
	}
}

export async function getBusinessHours(businessId: string) {
	const url = `${process.env.CUSTOMER_BOOKING_URL}/client/business/${businessId}/hours`;

	try {
		const response = await axios.get(url, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return response.data;
	} catch (error: any) {
		console.error('getBusinessHours error:', error.response?.data || error.message);
		throw error;
	}
}

export async function getSlots(businessId: string, params: GetSlotsRequest) {
	const { startDate, endDate, serviceIds = [], staffId } = params;

	// Build the base URL with startDate and endDate
	let url = `${process.env.CUSTOMER_BOOKING_URL}/client/business/${businessId}/slots/${startDate}/${endDate}`;

	// Build query parameters
	const queryParams = [];

	if (serviceIds.length > 0) {
		queryParams.push(`service_ids=${serviceIds.join(',')}`);
	}

	if (staffId) {
		queryParams.push(`staff_id=${staffId}`);
	}

	if (queryParams.length > 0) {
		url += `?${queryParams.join('&')}`;
	}

	console.log('getSlots URL:', url);

	try {
		const response = await axios.get(url, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return response.data;
	} catch (error: any) {
		console.error('getSlots error:', error.response?.data || error.message);
		throw error;
	}
}

export async function createBooking(params: CreateBookingRequest, userToken: string): Promise<any> {
	try {
		// Get user profile first to extract UUID
		const userData: ProfileResponse = await getProfile(userToken);

		if (!userData?.data?.user.uuid) {
			console.error("User UUID not found in createBooking");
			throw new Error("User authentication required");
		}

		const customerUuid = userData.data.user.uuid;
		const url = `${process.env.DINGG_API_URL}/user/booking`;

		// Build payload
		const payload = {
			vendor_location_uuid: params.vendor_location_uuid,
			booking_date: params.booking_date,
			booking_comment: params.booking_comment || '',
			booking_status: params.booking_status,
			merge_services_of_same_staff: params.merge_services_of_same_staff,
			total: params.total,
			services: params.services
		};

		// Build headers with user UUID
		const headers = {
			'customer_uuid': customerUuid,
			'vendor_location_uuid': params.vendor_location_uuid,
			'Authorization': userToken,
			'Content-Type': 'application/json'
		};

		const response = await axios.post(url, payload, { headers });

		console.log("Booking created successfully:", response.data);
		return response.data;
	} catch (error: any) {
		console.error("createBooking error:", error.response?.data || error.message);
		throw error;
	}
}

export async function getUserBookings(params: GetUserBookingsRequest, userToken: string): Promise<any> {
	try {
		// Get user profile first to extract UUID
		const userData = await getProfile(userToken) as any;
		const customerUuid = userData?.data?.user?.uuid;

		if (!customerUuid) {
			console.error("User UUID not found in getUserBookings");
			throw new Error("User authentication required");
		}

		// Map booking type numbers to strings
		const typeMap: Record<number, string> = {
			1: "UPCOMING",
			2: "CANCELLED",
			3: "PREVIOUS"
		};

		const bookingType = typeMap[params.booking_type];
		if (!bookingType) {
			throw new Error("Invalid booking_type.");
		}

		const businessUuid = params.vendor_location_uuid;
		const url = `${process.env.DINGG_API_URL}/user/bookings/${businessUuid}/${bookingType}?page=${params.page || 1}&limit=${params.limit || 10}`;

		const headers = {
			'customer_uuid': customerUuid,
			'vendor_location_uuid': businessUuid,
			'Authorization': userToken,
			'Content-Type': 'application/json'
		};

		const response = await axios.get(url, { headers });
		return response.data;
	} catch (error: any) {
		console.error("getUserBookings error:", error.response?.data || error.message);
		throw error;
	}
}

export async function cancelBooking(params: CancelBookingRequest, userToken: string): Promise<any> {
	try {
		// Get user profile first to extract UUID
		const userData = await getProfile(userToken) as any;
		const customerUuid = userData?.data?.user?.uuid;

		if (!customerUuid) {
			console.error("User UUID not found in cancelBooking");
			throw new Error("User authentication required");
		}

		const url = `${process.env.DINGG_API_URL}/user/bookings/${params.id}`;

		const config = {
			headers: {
				'Authorization': userToken,
				'vendor_location_uuid': params.vendor_location_uuid,
				'customer_uuid': customerUuid,
				'Content-Type': 'application/json'
			}
		};

		const response = await axios.delete(url, config);
		return response.data;
	} catch (error: any) {
		console.error("Cancel Booking Error:", error?.response?.data || error.message);
		throw error;
	}
}

export async function getProducts() {
	const url = "https://sdr7sb1b7g.execute-api.ap-south-1.amazonaws.com/dev/client/business/35b3b7dc-4087-446d-a18e-7a67cbc78b16/products?structure=hierarchical"
	try {
		const response = await axios.get(url);
		console.log("Products found:", response.data);
		return response.data;
	} catch (error: any) {
		console.error("no products found Error:", error?.response?.data || error.message);
		throw error;

	}
}