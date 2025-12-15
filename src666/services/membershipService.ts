import api from './api';


export const GetVideos = async (page: number, perPage: number) => {
  try {
    const response = await api.get(`v1/videos`, {
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

export const DownloadMembershipCertificate = async (registrationId?: number) => {
  const payload = registrationId ? { registration_id: registrationId } : {};
  const response = await api.post('v1/download-membership-certificate', payload);
  return response.data;
};





  


