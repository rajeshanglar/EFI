// Form values type (camelCase, for form state)
// export interface MembershipRegistrationFormValues {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   dateOfBirth: string;
//   address1: string;
//   city: string;
//   country: string;
//   hearAboutEFI: string;
//   patientsPerYear: string;
//   surgeriesPerYear: string;
//   couponCode: string;
 
// }

// API payload type (snake_case, for API request)
export type MembershipRegPayload = {
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: string;
  dob: string;
  grand_total: number;
  city: string;
  country: number;
  hear_about_efi: string;
  patient_count: number;
  surgery_count: number;
  address: string;
  coupon_code: string;
  sub_total: number;
  coupon_value: number;
  source_type: string; 
  payment_gateway: string;
  payment_method: string;
  payment_status: string;
  gateway_transaction_id: string;
  gateway_order_id: string;
  currency: string;
  payment_date: string;
  gateway_response: string;
};


export type CouponPayload = {
  email_id: string;
  coupon_code: string;
};

export type CheckMembershipExistsPayload = {
  email_id: string;
  phone_number: string;
};


export type DownloadMembershipInvoicePayload = {
  registration_id: number;
};


export type DownloadMembershipInvoiceResponse = {
  success: boolean;
  message: string;
  data: {
    pdf_base64: string;
    filename: string;
    registration_id: number;
    invoice_number: number;
    mime_type: string;
  };
  status: number;
};