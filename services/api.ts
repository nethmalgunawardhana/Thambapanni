import axios from 'axios';
import { getAuthToken } from './auth/loginService'
export const API_URL = 'https://thambapanni-backend.vercel.app'; // Replace with your backend URL

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});