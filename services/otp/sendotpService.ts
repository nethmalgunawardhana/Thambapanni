import axios from 'axios';
import { API_URL } from '../api';

export const sendOtp = async (email: string) => {
  const response = await axios.post(`${API_URL}/otp/send-otp`, { email });
  return response.data;
};
