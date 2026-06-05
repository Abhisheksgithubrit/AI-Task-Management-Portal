import api from './axios';

export const getTasks = () => api.get('/api/tasks');
export const getTaskById = (id) => api.get(`/api/tasks/${id}`);
export const getTaskStats = () => api.get('/api/tasks/stats');
export const createTask = (data) => api.post('/api/tasks', data);
export const updateTask = (id, data) => api.put(`/api/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);
