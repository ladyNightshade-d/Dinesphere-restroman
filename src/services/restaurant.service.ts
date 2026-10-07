import API from './api';
import { Restaurant } from '../types/domain';

export interface GeocodedLocation {
  label: string;
  lat: number;
  lng: number;
}

export interface RestaurantSearchResult {
  restaurants: Restaurant[];
  liveDataUnavailable: boolean;
}

export const restaurantService = {
  getRwanda: async (refresh = false): Promise<RestaurantSearchResult> => {
    const res = await API.get('/restaurants/rwanda', { params: refresh ? { refresh: true } : undefined });
    return res.data;
  },

  getAll: async (filters?: { cuisine?: string; search?: string; lat?: number; lng?: number; refresh?: boolean }) => {
    const res = await API.get('/restaurants', { params: filters });
    return res.data as RestaurantSearchResult;
  },

  getById: async (id: string) => {
    const res = await API.get(`/restaurants/${id}`);
    return res.data.restaurant;
  },

  searchLocation: async (query: string): Promise<GeocodedLocation[]> => {
    const res = await API.get('/restaurants/geocode', { params: { query } });
    return res.data.locations;
  },

  getMenu: async (restaurantId: string) => {
    const res = await API.get(`/menu/restaurant/${restaurantId}`);
    return res.data;
  },
};