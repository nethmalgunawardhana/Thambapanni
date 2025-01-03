import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  gender: string;
  dateOfBirth: Date;
}

interface AuthResponse {
  token: string;
  user: UserData & { uid: string };
}

// Constants
const AUTH_STATE_KEY = '@auth_state';
const JWT_TOKEN_KEY = '@jwt_token';
const API_URL = 'http://192.168.8.100:3000/api';
const isBrowser = typeof window !== 'undefined';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlNfWxTiG40BkqVLuM5o1_Ca-z0QNfxcc",
  authDomain: "thambapanniapp.firebaseapp.com",
  projectId: "thambapanniapp",
  storageBucket: "thambapanniapp.firebasestorage.app",
  messagingSenderId: "765816961687",
  appId: "1:765816961687:web:e53f6fc24b0dc92d91c7d2",
  measurementId: "G-6TMCN9E69S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Storage utilities
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      if (!isBrowser) return null;
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (!isBrowser) return;
      localStorage.setItem(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (!isBrowser) return;
      localStorage.removeItem(key);
      return;
    }
    await AsyncStorage.removeItem(key);
  }
};

// Token management
let currentToken: string | null = null;

const setToken = async (token: string): Promise<void> => {
  currentToken = token;
  await storage.setItem(JWT_TOKEN_KEY, token);
};

const getToken = async (): Promise<string | null> => {
  if (!currentToken) {
    currentToken = await storage.getItem(JWT_TOKEN_KEY);
  }
  return currentToken;
};

const clearAuthState = async (): Promise<void> => {
  currentToken = null;
  await Promise.all([
    storage.removeItem(AUTH_STATE_KEY),
    storage.removeItem(JWT_TOKEN_KEY)
  ]);
};

// API request utility
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth functions
export const register = async (userData: UserData, password: string): Promise<AuthResponse> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      password
    );

    const token = await userCredential.user.getIdToken();
    await setToken(token);

    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        ...userData,
        uid: userCredential.user.uid
      })
    });

    return response;
  } catch (error) {
    const authError = error as Error;
    throw new Error(`Registration failed: ${authError.message}`);
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    await setToken(token);

    const response = await apiRequest('/auth/login', {
      method: 'POST'
    });

    return response;
  } catch (error) {
    const authError = error as Error;
    throw new Error(`Login failed: ${authError.message}`);
  }
};

export const loginWithGoogle = async (): Promise<AuthResponse> => {
  if (!isBrowser) {
    throw new Error('Google login is only available in web browser environments');
  }
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    await setToken(token);

    const response = await apiRequest('/auth/google-login', {
      method: 'POST'
    });

    return response;
  } catch (error) {
    const authError = error as Error;
    throw new Error(`Google login failed: ${authError.message}`);
  }
};

export const loginWithFacebook = async (): Promise<AuthResponse> => {
  if (!isBrowser) {
    throw new Error('Facebook login is only available in web browser environments');
  }
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    await setToken(token);

    const response = await apiRequest('/auth/facebook-login', {
      method: 'POST'
    });

    return response;
  } catch (error) {
    const authError = error as Error;
    throw new Error(`Facebook login failed: ${authError.message}`);
  }
};

export const getCurrentUser = async (): Promise<(UserData & { uid: string }) | null> => {
  try {
    const response = await apiRequest('/auth/me');
    return response.user;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    await clearAuthState();
  } catch (error) {
    const authError = error as Error;
    throw new Error(`Logout failed: ${authError.message}`);
  }
};

// Initialize auth state listener
let authStateListener: (() => void) | null = null;

if (isBrowser) {
  authStateListener = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      await clearAuthState();
    } else {
      const token = await user.getIdToken();
      await setToken(token);
    }
  });
}

// Cleanup function
export const cleanup = (): void => {
  if (authStateListener) {
    authStateListener();
  }
};