import api from './api';
import { MembershipRegPayload, CouponPayload,CheckMembershipExistsPayload } from '../utils/types';

export interface Country {
  id: number;
  country_name: string;
  currency?: string;
  [key: string]: any;
}


export const getCountries = async () => {
  const response = await api.get('v1/countries');
  return response.data;
};


export const MembershipRegistration = async (payload: MembershipRegPayload) => {
  const response = await api.post('v1/membership-registration', payload);
  return response.data;
};

export const CouponValidation = async (payload: CouponPayload) => {
  const response = await api.post('v1/validate-coupon', payload);
  return response.data;
};

export const CheckMembershipExists = async (payload: CheckMembershipExistsPayload) => {
  const response = await api.post('v1/check-membership-exists', payload);
  return response.data;
};

// export const getMembershipPrice = async () => {
//   const response = await api.get('v1/membership-price');
//   return response.data;
// };


  


