import axios from 'axios';
import { API_URL } from '../config';



// Define the user data type
export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    nationality: string;
    gender: string;
    dateOfBirth: Date;
  }
  
export const register = async (userData: UserData, password: string) => {
  try {
    const payload = { ...userData, password };
    const response = await axios.post(`${API_URL}/auth/register`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to register');
  }
};
