import api from './api';

export const askSessionQuestion = async (sessionId: number, question: string, is_anonymous:number) => {
  try {
    const response = await api.post(`v1/session-question/ask`, { session_id: sessionId, question: question, is_anonymous: is_anonymous });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getSessionQuestions = async () => {
  try {
    const response = await api.get(`v1/session-question/my-questions`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};




















  


