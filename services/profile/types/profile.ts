export interface Stats {
    trips: number;
    points: number;
    comments: number;
  }
  
  export interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    nationality?: string;
    gender?: string;
    dateOfBirth?: string;
    profilePhoto?: string | null;
    stats: Stats;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
  }
  
  export interface PhotoUploadResponse {
    success: boolean;
    message?: string;
    photoUrl: string;
  }
  