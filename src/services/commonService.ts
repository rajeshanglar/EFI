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


export const getCountries = async () => {
  const response = await api.get('v1/countries');
  return response.data;
};

export const getStates = async (countryId: number) => {
  const response = await api.get(`v1/countries/${countryId}/states`);
  return response.data;
};

  


