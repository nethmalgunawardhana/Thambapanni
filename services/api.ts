import axios from 'axios';

export const API_URL = 'http://192.168.21.83:5000'; // Replace with your backend URL

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

