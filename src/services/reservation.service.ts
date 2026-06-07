import API from './api';

export interface ReservationData {
  restaurant: string;
  date: string;
  time: string;
  guestCount: number;
  specialRequests?: string;
}

export const reservationService = {
  create: async (data: ReservationData) => {
    const res = await API.post('/reservations', data);
    return res.data.reservation;
  },

  getMyReservations: async () => {
    const res = await API.get('/reservations/my');
    return res.data.reservations;
  },

  getRestaurantReservations: async (restaurantId: string) => {
    const res = await API.get(`/reservations/restaurant/${restaurantId}`);
    return res.data.reservations;
  },

  updateStatus: async (id: string, status: string) => {
    const res = await API.patch(`/reservations/${id}/status`, { status });
    return res.data.reservation;
  },
};