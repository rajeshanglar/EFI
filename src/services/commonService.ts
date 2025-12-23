import api from './api';

export const getPaymentTransactions = async (page: number, perPage: number) => {
  try {
    const response = await api.get(`v1/payment-transactions`, {
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

export const getPaymentTransactionById = async (id: number | string) => {
  try {
    const response = await api.get(`v1/payment-transactions/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getProfilePicture = async (userId: number | string) => {
  if (!userId) throw new Error('User ID is required');  
  const payload = { user_id: userId };  
  try {
    const response = await api.post('v1/get-profile-picture', payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateProfilePicture = async (userId: number | string, base64Image: string) => {
  const payload = { user_id: userId, profile_image: base64Image }; 
  const response = await api.post('v1/update-profile-picture', payload);
  return response.data;
};


export const editProfile = async (editProfilePayload: {
  user_id: number | string;
  affiliation: string;
  address: string;
}) => {
  try {
    const response = await api.post(`v1/edit-profile`, editProfilePayload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updatePrivacySettings = async (privacySettingsPayload: {
  user_id: number | string;
  privacy_settings: {
    name: number;
    affiliation: number;
    address: number;
    email: number;
    mobile: number;
    profile_pic: number;
  };
   
}) => {
  try {
    const response = await api.post(`v1/privacy-settings`, privacySettingsPayload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getSpeakerSessions = async (
  eventId: number | string,
  payload: {
    user_id: number | string;
    affiliation: string;
    address: string;
  }
) => {
  try {
    const response = await api.get(`v1/speaker/sessions`, {
      params: {
        event_id: eventId,
        user_id: payload.user_id,
        affiliation: payload.affiliation,
        address: payload.address,
      }
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getSessionWishlist = async (sessionId: number | string) => {
  try {
    const response = await api.post(`v1/session-wishlist`, { session_id: sessionId });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const removeSessionWishlist = async (sessionId: number | string) => {
  try {
    const response = await api.post(`v1/remove-session-wishlist`, { session_id: sessionId });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};



