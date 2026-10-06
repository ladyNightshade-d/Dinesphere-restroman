import API from './api';

const readSessionValue = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;

  const raw = sessionStorage.getItem(key) ?? localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
};

const writeSessionValue = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(key, value);
  localStorage.removeItem(key);
};

const clearAuthStorage = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin' | 'kitchen';
  restaurantName?: string;
  assignedStation?: string;
  restaurantId?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const persistAuthSession = (payload: { token?: string; user?: Record<string, unknown> }) => {
  if (payload.token) {
    writeSessionValue('token', payload.token);
  }

  if (payload.user) {
    writeSessionValue('user', JSON.stringify(payload.user));
  }
};

export const authService = {
  register: async (data: RegisterData) => {
    const res = await API.post('/auth/register', data);
    persistAuthSession({
      token: res.data.token,
      user: res.data.user,
    });
    return res.data;
  },

  login: async (data: LoginData) => {
    const res = await API.post('/auth/login', data);
    persistAuthSession({
      token: res.data.token,
      user: res.data.user,
    });
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
    clearAuthStorage();
  },

  getMe: async () => {
    const res = await API.get('/auth/me');
    return res.data;
  },

  getCurrentUser: () => {
    return readSessionValue<Record<string, unknown>>('user');
  },

  isLoggedIn: () => !!(sessionStorage.getItem('token') || localStorage.getItem('token')),
};