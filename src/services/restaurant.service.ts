import API from './api';

export const restaurantService = {
  getAll: async (filters?: { cuisine?: string; search?: string; lat?: number; lng?: number; refresh?: boolean }) => {
    const res = await API.get('/restaurants', { params: filters });
    return res.data.restaurants;
  },

  getById: async (id: string) => {
    const res = await API.get(`/restaurants/${id}`);
    return res.data.restaurant;
  },

  getMenu: async (restaurantId: string) => {
    const res = await API.get(`/menu/restaurant/${restaurantId}`);
    return res.data;
  },
};