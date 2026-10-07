export interface Restaurant {
  _id: string;
  name: string;
  cuisine?: string[];
  rating?: number;
  totalReviews?: number;
  address?: string;
  images?: string[];
  isActive?: boolean;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  osmUrl?: string;
  bookingUrl?: string;
  orderingUrl?: string;
  source?: 'admin' | 'openstreetmap' | 'manual';
  sourceId?: string;
  district?: string;
  province?: string;
  ratingIsEstimate?: boolean;
  ratingEstimateBasis?: string;
  imageIsIllustrative?: boolean;
  imageAttributionUrl?: string;
  imageCredit?: string;
  location?: { lat: number; lng: number };
  onlineBooking?: boolean;
  onlineOrdering?: boolean;
  deliveryFee?: number;
  owner?: string | { _id: string };
  openingHours?: { day: string; open: string; close: string; closed: boolean }[];
}

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  image?: string;
  sizes?: { label: string; price: number }[];
  isAvailable?: boolean;
}

export interface InventoryItem {
  _id: string;
  ingredient: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
}

export interface StaffMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  assignedStation?: string;
}

export interface DashboardStats {
  stats: { totalOrdersToday: number; revenueToday: number; activeTables: number; pendingOrders: number };
  salesChart: { date: string; revenue: number; orders: number }[];
  lowStockItems: InventoryItem[];
  recentOrders: OrderRecord[];
  staff: StaffMember[];
}

export interface OrderRecord {
  _id: string;
  status: string;
  restaurant: string | { name?: string; address?: string; phone?: string };
  items: { name: string; quantity: number; size?: string; price?: number }[];
  totalAmount: number;
  deliveryFee?: number;
  deliveryAddress?: string;
  estimatedTime?: number;
  createdAt: string;
  statusHistory?: { status: string; timestamp: string }[];
  orderType?: string;
  customer?: { name?: string; email?: string };
}

export interface ReservationRecord {
  confirmationCode: string;
  status: string;
  restaurant?: Restaurant | { name?: string };
  date: string;
  time: string;
  guestCount: number;
  specialRequests?: string;
}
