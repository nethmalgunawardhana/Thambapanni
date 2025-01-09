
import {apiClient} from '../api';

interface Stats {
    trips: number;
    points: number;
    comments: number;
  }
  
  interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    nationality?: string;
    gender?: string;
    dateOfBirth?: string;
    profilePhoto?: string | null;
    stats: Stats;
  }
  
 interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
  }
  
interface PhotoUploadResponse {
    success: boolean;
    message?: string;
    photoUrl: string;
  }

  const defaultStats: Stats = {
    trips: 0,
    points: 0,
    comments: 0,
  };
  
  export const fetchUserProfile = async (): Promise<ProfileData> => {
    try {
      const { data } = await apiClient.get<ApiResponse<ProfileData>>('/user/profile');
      
      if (data.success) {
        const stats = data.data.stats || defaultStats;
        return {
          ...data.data,
          stats: {
            trips: stats.trips || 0,
            points: stats.points || 0,
            comments: stats.comments || 0,
          }
        };
      }
      throw new Error(data.message || 'Failed to fetch profile data');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  };
  
  export const updateUserProfile = async (profileData: Partial<ProfileData>): Promise<ApiResponse<ProfileData>> => {
    try {
      const { data } = await apiClient.put<ApiResponse<ProfileData>>('/user/profile-update', profileData);
      
      if (data.success) {
        return data;
      }
      throw new Error(data.message || 'Failed to update profile');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  };
  
  export const uploadProfilePhoto = async (formData: FormData): Promise<PhotoUploadResponse> => {
    try {
      const { data } = await apiClient.post<PhotoUploadResponse>('/user/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (data.success) {
        return data;
      }
      throw new Error(data.message || 'Failed to upload image');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  };  