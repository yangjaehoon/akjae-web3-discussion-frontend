import { create } from 'zustand';
import type { AuthData, StoredUser } from '../types';

interface AuthState {
  token: string | null;
  user: StoredUser | null;
  isAuthenticated: boolean;
  login: (authData: AuthData) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: (() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  })(),
  isAuthenticated: !!localStorage.getItem('token'),

  login: (authData) => {
    const user: StoredUser = {
      username: authData.username,
      email: authData.email,
      role: authData.role,
    };
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token: authData.token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
