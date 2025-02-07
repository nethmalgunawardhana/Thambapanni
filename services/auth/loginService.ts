import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';


export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });

    const { token } = response.data;
    await AsyncStorage.setItem('authToken', token); // Save token for future requests

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};

export const getAuthToken = async () => {
  return await AsyncStorage.getItem('authToken');
};