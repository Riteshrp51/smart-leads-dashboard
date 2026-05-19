import { create } from 'zustand';
import api from '../utils/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string, role: 'admin' | 'sales') => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,

  register: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { data, token } = response.data;
      
      localStorage.setItem('token', token);
      set({ user: data, token, loading: false });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Registration failed';
      set({ error: message, loading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { data, token } = response.data;

      localStorage.setItem('token', token);
      set({ user: data, token, loading: false });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Invalid credentials';
      set({ error: message, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, error: null });
  },

  getMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null });
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data.data, loading: false });
    } catch (error: any) {
      // If token is invalid or expired
      localStorage.removeItem('token');
      set({ user: null, token: null, error: 'Session expired. Please log in again.', loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
