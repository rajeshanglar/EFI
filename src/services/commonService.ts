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



  


