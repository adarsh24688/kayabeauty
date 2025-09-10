import Joi from "joi";

//! Dingg schemas (from your dingg.schema.js)

// ---------------------- slots-schema ----------------------
export const getSlotsSchema = Joi.object({
  startDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .label('Start Date')
    .messages({ 'string.pattern.base': '"startDate" must be in YYYY-MM-DD format' }),
  endDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .label('End Date')
    .messages({ 'string.pattern.base': '"endDate" must be in YYYY-MM-DD format' }),
  serviceIds: Joi.array()
    .items(Joi.number().integer())
    .optional()
    .label('Service IDs'),
  staffId: Joi.number()
    .integer()
    .optional()
    .label('Staff ID')
});


//! Auth schemas (from your auth.schema.js)

// ---------------------- create-customer-schema ----------------------
export const createCustomerSchema = Joi.object({
  fname: Joi.string().required().label('First Name'),
  lname: Joi.string().required().label('Last Name'),
  mobile: Joi.string().required().label('Mobile'),
  sms_trans: Joi.boolean().default(true).label('SMS Transactional'),
  sms_promo: Joi.boolean().default(true).label('SMS Promotional'),
  email_trans: Joi.boolean().default(false).label('Email Transactional'),
  email_promo: Joi.boolean().default(false).label('Email Promotional')
});

// ---------------------- send-otp-schema ----------------------
export const sendOtpSchema = Joi.alternatives().try(
  // Mobile OTP Schema
  Joi.object({
    dial_code: Joi.number().required(),
    mobile: Joi.string().required(),
    country_id: Joi.string().required(),
    vendor_location_uuid: Joi.string().required(),
    email: Joi.forbidden()
  }),
  // Email OTP Schema
  Joi.object({
    email: Joi.string().email().required(),
    vendor_location_uuid: Joi.string().required(),
    dial_code: Joi.forbidden(),
    mobile: Joi.forbidden(),
    country_id: Joi.forbidden()
  })
);

// ---------------------- verify-otp-schema ----------------------
export const verifyOtpSchema = Joi.alternatives().try(
  // Mobile OTP Verification Schema
  Joi.object({
    vendor_location_uuid: Joi.string().required(),
    dial_code: Joi.number().required(),
    mobile: Joi.string().required(),
    country_id: Joi.string().required(),
    otp: Joi.string().required(),
    email: Joi.forbidden()
  }),
  // Email OTP Verification Schema
  Joi.object({
    vendor_location_uuid: Joi.string().required(),
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    dial_code: Joi.forbidden(),
    mobile: Joi.forbidden(),
    country_id: Joi.forbidden()
  })
);

// ---------------------- login-customer-schema ----------------------

export const loginCustomerSchema = Joi.alternatives().try(
  // Mobile-based login
  Joi.object({
    dial_code: Joi.number().required(),
    mobile: Joi.string().required(),
    country_id: Joi.string().required(),
    vendor_location_uuid: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.forbidden()
  }),
  // Email-based login
  Joi.object({
    email: Joi.string().email().required(),
    vendor_location_uuid: Joi.string().required(),
    password: Joi.string().required(),
    dial_code: Joi.forbidden(),
    mobile: Joi.forbidden(),
    country_id: Joi.forbidden()
  })
);

// ---------------------- forgot-password-schema ----------------------

export const forgotPasswordSchema = Joi.alternatives().try(
  // Mobile-based schema
  Joi.object({
    dial_code: Joi.number().required(),
    mobile: Joi.string().required(),
    country_id: Joi.string().required(),
    vendor_location_uuid: Joi.string().required(),
    email: Joi.forbidden()
  }),
  // Email-based schema
  Joi.object({
    email: Joi.string().email().required(),
    vendor_location_uuid: Joi.string().required(),
    dial_code: Joi.forbidden(),
    mobile: Joi.forbidden(),
    country_id: Joi.forbidden()
  })
);

// ---------------------- reset-password-schema ----------------------

export const resetPasswordSchema = Joi.alternatives().try(
  // Mobile-based reset
  Joi.object({
    dial_code: Joi.number().required(),
    mobile: Joi.string().required(),
    country_id: Joi.string().required(),
    vendor_location_uuid: Joi.string().required(),
    password: Joi.string().required(),
    verification_code: Joi.string().required(),
    email: Joi.forbidden()
  }),
  // Email-based reset
  Joi.object({
    email: Joi.string().email().required(),
    vendor_location_uuid: Joi.string().required(),
    password: Joi.string().required(),
    verification_code: Joi.string().required(),
    dial_code: Joi.forbidden(),
    mobile: Joi.forbidden(),
    country_id: Joi.forbidden()
  })
);

// ---------------------- profile-setup-schema ----------------------

export const profileSetupSchema = Joi.object({
  password: Joi.string().required(),
  name: Joi.string().required(),
  mobile: Joi.string().required(),
  vendor_location_uuid: Joi.string().required(),
  verified_by: Joi.string().valid('email', 'mobile').required(),
  gender: Joi.string().allow('', null).optional(),
  email: Joi.string().email().required(),
  dial_code: Joi.string().required(),
  country_id: Joi.string().required()
});

// ---------------------- change-password-schema ----------------------

export const changePasswordSchema = Joi.object({
  new_password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
    .required()
    .label('New Password')
    .messages({
      'string.pattern.base': '"New Password" must contain at least one lowercase letter, one uppercase letter, one number, and be at least 6 characters long.'
    }),
  old_password: Joi.string().required().label('Old Password'),
  vendor_location_uuid: Joi.string().required().label('Vendor Location UUID')
});

// ---------------------- create-booking-schema ----------------------

export const createBookingSchema = Joi.object({
  vendor_location_uuid: Joi.string().required().label('Vendor Location UUID'),
  booking_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .label('Booking Date')
    .messages({
      'string.pattern.base': '"booking_date" must be in YYYY-MM-DD format'
    }),
  booking_comment: Joi.string().allow('').optional().label('Booking Comment'),
  booking_status: Joi.string().required().label('Booking Status'),
  merge_services_of_same_staff: Joi.boolean().required().label('Merge Services of Same Staff'),
  total: Joi.number().positive().required().label('Total'),
  services: Joi.array().items(
    Joi.object({
      service_id: Joi.number().integer().required().label('Service ID'),
      service_name: Joi.string().required().label('Service Name'),
      start_time: Joi.number().integer().required().label('Start Time'),
      end_time: Joi.number().integer().required().label('End Time')
    })
  ).min(1).required().label('Services')
});

// ---------------------- get-user-booking-schema ----------------------

export const getUserBookingsSchema = Joi.object({
  vendor_location_uuid: Joi.string().required().label('Vendor Location UUID'),
  booking_type: Joi.number().valid(1, 2, 3).required().label('Booking Type').messages({
    'any.only': '"booking_type" must be 1 (UPCOMING), 2 (CANCELLED), or 3 (PREVIOUS)'
  }),
  page: Joi.number().integer().min(1).default(1).label('Page'),
  limit: Joi.number().integer().min(1).default(10).label('Limit')
});

// ---------------------- cancel-booking-schema ----------------------

export const cancelBookingSchema = Joi.object({
  vendor_location_uuid: Joi.string().required().label('Vendor Location UUID'),
  id: Joi.string().required().label('Booking ID')
});
