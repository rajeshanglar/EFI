import api from './api';

export const askSessionQuestion = async (sessionId: number, question: string, is_anonymous:number) => {
  try {
    const response = await api.post(`v1/session-question/ask`, { session_id: sessionId, question: question, is_anonymous: is_anonymous });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getSessionQuestions = async (sessionId?: number | string) => {
  try {
    let url = `v1/session-question/my-questions`;
    if (sessionId) {
      url += `?session_id=${sessionId}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};




















  


