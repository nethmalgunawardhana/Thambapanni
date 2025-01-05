import axios from 'axios';
import { API_URL } from '../api';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};
