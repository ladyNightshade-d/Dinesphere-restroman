import API from './api';

export interface OrderItem {
  menuItem: string;
  name: string;
  quantity: number;
  size: 'small' | 'medium' | 'large';
  price: number;
  specialNotes?: string;
}

export interface PlaceOrderData {
  restaurant: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: string;
  orderType: 'online' | 'dine-in';
  specialInstructions?: string;
}

export type OrderFilters = Record<string, string | number | boolean | undefined>;

export const orderService = {
  placeOrder: async (data: PlaceOrderData) => {
    const res = await API.post('/orders', data);
    return res.data.order;
  },

  getMyOrders: async () => {
    const res = await API.get('/orders/my');
    return res.data.orders;
  },

  getOrder: async (id: string) => {
    const res = await API.get(`/orders/${id}`);
    return res.data.order;
  },

  getRestaurantOrders: async (restaurantId: string, filters?: OrderFilters) => {
    const res = await API.get(`/orders/restaurant/${restaurantId}`, { params: filters });
    return res.data.orders;
  },

  updateStatus: async (orderId: string, status: string, note?: string) => {
    const res = await API.patch(`/orders/${orderId}/status`, { status, note });
    return res.data.order;
  },
};