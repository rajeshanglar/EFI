import apiStatic from './apiStatic';
import { MembershipRegPayload, CouponPayload,CheckMembershipExistsPayload, DownloadMembershipInvoicePayload, DownloadConferenceQRCodePayload } from '../utils/types';
import { LoginFormValues } from '../types/login';
import {CheckConferenceExistsPayload, ConferenceRegPayload, DownloadConferenceInvoicePayload } from '../utils/types';

export interface Country {
  id: number;
  country_name: string;
  currency?: string;
  [key: string]: any;
}

export interface State {
  id: number;
  state_name: string;
  country_id: number;
  country_name: string;
  [key: string]: any;
}


export const getCountries = async () => {
  const response = await apiStatic.get('v1/countries');
  return response.data;
};

export const getStates = async (countryId: number) => {
  const response = await apiStatic.get(`v1/countries/${countryId}/states`);
  return response.data;
};

export const CouponValidation = async (payload: CouponPayload) => {
  const response = await apiStatic.post('v1/validate-coupon', payload);
  return response.data;
};

// Membership
export const DownloadMembershipInvoice = async (payload: DownloadMembershipInvoicePayload) => {
  const response = await apiStatic.post('v1/download-membership-invoice', payload);
  return response.data;
};

export const getHearAboutSources = async () => {
  const response = await apiStatic.get(`v1/hear-about-sources`);
  return response.data;
};

export const CheckMembershipExists = async (payload: CheckMembershipExistsPayload) => {
  const response = await apiStatic.post('v1/check-membership-exists', payload);
  return response.data;
};

export const getMembershipPrice = async () => {
  const response = await apiStatic.get('v1/settings?title=membership_price');
  return response.data;
};

export const MembershipRegistration = async (payload: MembershipRegPayload) => {
  const response = await apiStatic.post('v1/membership-registration', payload);
  return response.data;
};

export const CreateOrderPayment = async (payload: {
  amount: number;
  currency: string;
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: string;
}) => {
  const response = await apiStatic.post('v1/membership/create-order', payload);
  return response.data;
};


// Conference

export const DownloadConferenceInvoice = async (payload: DownloadConferenceInvoicePayload) => {
  const response = await apiStatic.post('v1/download-conference-invoice', payload);
  return response.data;
};

export const CheckConferenceExists = async (payload: CheckConferenceExistsPayload) => {
  const response = await apiStatic.post('v1/check-conference-exists', payload);
  return response.data;
};

export const GetMorningWorkshops = async () => {
  const response = await apiStatic.get('v1/workshops?type=morning');
  return response.data;
};

export const GetAfternoonWorkshops = async () => {
  const response = await apiStatic.get('v1/workshops?type=afternoon');
  return response.data;
};
  
export const GetConferenceCategories = async () => {
  const response = await apiStatic.get('v1/categories');
  return response.data;
};


  export const GetEventMappings = async () => {
    const response = await apiStatic.get('v1/event-mappings');
    return response.data;
  };


  // Conference Registration Details Used in Profile.tsx
  export const ConferenceRegistration = async (payload: ConferenceRegPayload) => {
    const response = await apiStatic.post('v1/conference-registration', payload);
    return response.data;
  };



  export const CreateConferenceOrder = async (payload: {
    amount  : number;
    currency: string;
    full_name: string;   
    email: string;
    mobile: string;
  }) => {
    const response = await apiStatic.post('v1/conference/create-order', payload);
    return response.data;
  };



  

  export const DownloadConferenceQRCode = async (payload: DownloadConferenceQRCodePayload) => {
    const response = await apiStatic.post('v1/download-conference-qrcode', payload);
    return response.data;
  };

  export const SendEfiMemberVerificationOtp = async ( payload: {
    email: string;   
  }) => {
    const response = await apiStatic.post('v1/conference/send-efi-member-verification-otp', payload);
    return response.data;
  };

  export const VerifyEfiMemberOtp = async ( payload: {
    email: string;
    otp_code: string;
  }) => {
    const response = await apiStatic.post('v1/conference/verify-efi-member-otp', payload);
    return response.data;
  };

  export const CalculateConferencePrice = async ( payload: {
   mapping_id: number,
    member_type: string,
    morning_workshop_id: number,
    afternoon_workshop_id: number
  }) => {
    const response = await apiStatic.post('v1/calculate-conference-price', payload);
    return response.data;
  };


  export const GetSpeakers = async (page: number, perPage: number) => {
    try {
      const response = await apiStatic.get(`v1/speakers`, {
        params: {
          page,
          per_page: perPage
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  // Conference List
  export const getSessions = async () => {
    try {
      const response = await apiStatic.get(`v1/sessions`, {
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

    // Conference Session Details
  export const getSessionDetailsBySessionId = async (session_id: number | string) => {
    try {
      const response = await apiStatic.get(`v1/session-details?session_id=${session_id}`, {
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };



  



