// Form values type (camelCase, for form state)
export interface MembershipRegistrationFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address1: string;
  city: string;
  country: string;
  hearAboutEFI: string;
  patientsPerYear: string;
  surgeriesPerYear: string;
  couponCode: string;
  // captcha: string;
}

// API payload type (snake_case, for API request)
export type MembershipRegPayload = {
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: string;
  dob: string;
  city: string;
  country: number;
  hear_about_efi: string;
  patient_count: number;
  surgery_count: number;
  address: string;
  coupon_code: string;
  sub_total: number;
  grand_total: number;
  coupon_value: string;
  payment_gateway: string;
  payment_method: string;
  transaction_id: string;
  gateway_transaction_id: string;
  gateway_order_id: string;
  payment_status: string;
  currency: string;
  gateway_response: string;
  failure_reason: string;
  payment_date: string;
  source_type: string;
};


export type CouponPayload = {
  email_id: string;
  coupon_code: string;
};

export type CheckMembershipExistsPayload = {
  email_id: string;
  phone_number: string;
};





