import axiosInstance from '../api/axiosInstance';

export const fetchEmployees = async (search) => {
  const response = await axiosInstance.get('/employees', { params: { search } });
  return response.data;
};
