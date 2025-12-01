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

  


