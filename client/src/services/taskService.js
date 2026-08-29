import axiosInstance from '../api/axiosInstance';

export const createTask = async (payload) => {
  const response = await axiosInstance.post('/tasks', payload);
  return response.data;
};

export const fetchTasks = async (params) => {
  const response = await axiosInstance.get('/tasks', { params });
  return response.data;
};

export const fetchTaskStats = async () => {
  const response = await axiosInstance.get('/tasks/stats');
  return response.data;
};

export const fetchMyTasks = async (params) => {
  const response = await axiosInstance.get('/tasks/my-tasks', { params });
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await axiosInstance.patch(`/tasks/${taskId}/status`, { status });
  return response.data;
};
