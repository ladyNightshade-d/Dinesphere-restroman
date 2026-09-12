import API from './api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin' | 'kitchen';
  restaurantName?: string;
  assignedStation?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterData) => {
    const res = await API.post('/auth/register', data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  },

  login: async (data: LoginData) => {
    const res = await API.post('/auth/login', data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await API.post('/auth/forgot-password', { email });
    return res.data;
  },

  verifyResetOtp: async (email: string, otp: string) => {
    const res = await API.post('/auth/verify-reset-otp', { email, otp });
    return res.data;
  },

  resetPassword: async (token: string, password: string) => {
    const res = await API.post('/auth/reset-password', { token, password });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getMe: async () => {
    const res = await API.get('/auth/me');
    return res.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isLoggedIn: () => !!localStorage.getItem('token'),
};