import axios, { AxiosHeaders } from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

const getStoredToken = () => {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('token') || localStorage.getItem('token') || '';
};

const clearAuthSession = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

API.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers ?? {});
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

API.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401) {
      clearAuthSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
export { clearAuthSession, getStoredToken };