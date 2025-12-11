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
  country: number;
  state: number;
  city: string;
  pin_code: string;
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

export type DownloadConferenceQRCodePayload = {
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

//Conference
export type   ConferenceRegPayload = {
 full_name:string,
 email:string,
 mobile:string,
 institute:string,
 specialization: string,
 address: string,
 city: string,
state: number,
pincode:string,
country: number,
event_id: number,
mapping_id: number,
module_id: number,
category_id: number,
ticket_id: number,
efi_type: string,
morning_workshop: number,
afternoon_workshop: number,
sub_total: number,
grand_total: number,
currency: string,
source_type: string,
payment_status: string,
payment_gateway: string;
payment_method: string;
gateway_transaction_id: string;
gateway_order_id: string;
payment_date: string;
gateway_response: string;

};

export type CheckConferenceExistsPayload = {
  email: string;
  mobile: string;
};