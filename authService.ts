import { auth } from './firebase.config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000';

export const loginWithEmailPassword = async (email: string, password: string): Promise<string> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseToken = await userCredential.user.getIdToken();
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firebaseToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    const { token } = await response.json();
    await AsyncStorage.setItem('userToken', token);
    return token;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginWithGoogle = async (): Promise<string> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseToken = await result.user.getIdToken();
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firebaseToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to login with Google');
    }

    const { token } = await response.json();
    await AsyncStorage.setItem('userToken', token);
    return token;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginWithFacebook = async (): Promise<string> => {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseToken = await result.user.getIdToken();
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firebaseToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to login with Facebook');
    }

    const { token } = await response.json();
    await AsyncStorage.setItem('userToken', token);
    return token;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem('userToken');
  } catch (error: any) {
    throw new Error(error.message);
  }
};
