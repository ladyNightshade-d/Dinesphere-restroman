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