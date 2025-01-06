import axios from 'axios';
import { API_URL } from '../api';


export const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const response = await axios.post(`${API_URL}/otp/reset-password`, { email, otp, newPassword });
    return response.data;
  };