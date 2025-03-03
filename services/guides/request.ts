import axios from 'axios';
import { getAuthToken } from '../auth/loginService'; // Adjust the path if needed
import { API_URL } from '../config';


export const fetchVerifiedGuides = async () => {
  try {
    const response = await axios.get(`${API_URL}/guides/verified`);
    return response.data.data; // Assuming the response is in this format
  } catch (error) {
    console.error('Error fetching guides:', error);
    throw new Error('Failed to fetch guides');
  }
};


export const submitGuideApplication = async (formData: FormData) => {
  try {
    const token = await getAuthToken(); // Retrieve JWT token from storage or service

    if (!token) {
      throw new Error('Authorization token is missing.');
    }

    const response = await axios.post(`${API_URL}/guides/apply`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // Return the server response
  } catch (error: any) {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to submit the application.');
    } else {
      console.error('Network Error:', error.message);
      throw new Error('Network error occurred. Please try again.');
    }
  }
};

interface ApplicationStatusResponse {
  status: string;
  message?: string;
}

export const getApplicationStatus = async (): Promise<ApplicationStatusResponse> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authorization token is missing.');
    }

    const { data } = await axios.get<ApplicationStatusResponse>(
      `${API_URL}/guides/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    
    throw new Error(error.response?.data?.message || 'Failed to fetch application status.');
  }
};


