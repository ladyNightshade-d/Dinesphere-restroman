import { io, Socket } from 'socket.io-client';

export interface OrderStatusUpdate {
  orderId: string;
  status: string;
}

export interface KitchenOrder {
  _id: string;
  status: string;
  [key: string]: unknown;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket;

export const socketService = {
  connect: () => {
    socket = io(SOCKET_URL);
    return socket;
  },

  joinKitchen: (restaurantId: string) => {
    socket?.emit('joinKitchen', restaurantId);
  },

  joinOrderTracking: (orderId: string) => {
    socket?.emit('joinOrderTracking', orderId);
  },

  onNewOrder: (callback: (order: KitchenOrder) => void) => {
    socket?.on('newOrder', callback);
  },

  onOrderStatusUpdate: (callback: (data: OrderStatusUpdate) => void) => {
    socket?.on('orderStatusUpdated', callback);
  },

  disconnect: () => {
    socket?.disconnect();
  },
};