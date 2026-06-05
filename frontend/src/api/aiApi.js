import api from './axios';

export const generateTaskDetails = (title) =>
  api.post('/api/ai/generate', { title });
