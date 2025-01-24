import axios from 'axios';
import { API_URL } from '../config';

// Verify OTP
export const verifyOtp = async (email: string, otp: string) => {
  const response = await axios.post(`${API_URL}/otp/verify-otp`, { email, otp });
  return response.data;
};
