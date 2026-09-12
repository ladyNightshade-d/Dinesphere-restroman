import { useState, useEffect } from 'react';
import { UtensilsCrossed, Monitor } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { KitchenOrder, OrderStatusUpdate, socketService } from '../../services/socket.service';
import API from '../../services/api';

type OrderStatus = 'NEW' | 'PREPARING' | 'READY';

interface KDSOrder {
  _id: string;
  type: string;
  tableNumber?: string;
  orderType: string;
  createdAt: string;
  placedAt: number;
  status: OrderStatus;
  customer?: { name?: string };
  items: { name: string; quantity: number; specialNotes?: string }[];
}

const statusConfig: Record<OrderStatus, { label: string; bg: string; text: string; border: string; next: OrderStatus | null }> = {
  NEW: { label: 'NEW', bg: 'bg-red-900/30', text: 'text-red-300', border: 'border-red-700/50', next: 'PREPARING' },
  PREPARING: { label: 'PREPARING', bg: 'bg-amber/10', text: 'text-amber', border: 'border-amber/40', next: 'READY' },
  READY: { label: 'READY', bg: 'bg-green-900/30', text: 'text-green-300', border: 'border-green-700/50', next: null },
};

const backendToKDS: Record<string, OrderStatus> = {
  placed: 'NEW',
  confirmed: 'NEW',
  preparing: 'PREPARING',
  quality_check: 'PREPARING',
  out_for_delivery: 'READY',
  delivered: 'READY',
};

const kdsToBackend: Record<OrderStatus, string> = {
  NEW: 'placed',
  PREPARING: 'preparing',
  READY: 'out_for_delivery',
};

function useTimer(placedAt: number) {
  const [elapsed, setElapsed] = useState(Math.floor((Date.now() - placedAt) / 1000));
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - placedAt) / 1000)), 1000);
    return () => clearInterval(id);
  }, [placedAt]);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function TimerDisplay({ placedAt, status }: { placedAt: number; status: OrderStatus }) {
  const time = useTimer(placedAt);
  const mins = Math.floor((Date.now() - placedAt) / 60000);
  const urgent = mins >= 15;
  const warning = mins >= 8;
  return (
    <span className={`font-mono text-sm font-bold ${status === 'READY' ? 'text-green-400' : urgent ? 'text-red-400' : warning ? 'text-amber' : 'text-green-400'}`}>
      {time}
    </span>
  );
}

function OrderCard({ order, onStatusChange }: { order: KDSOrder; onStatusChange: (id: string, next: OrderStatus) => void }) {
  const cfg = statusConfig[order.status];
  const isOnline = order.orderType === 'online';

  return (
    <div className={`rounded-2xl border-2 ${cfg.border} bg-warm-900 overflow-hidden transition-all duration-300 flex flex-col`}>
      <div className={`px-4 py-3 ${cfg.bg} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.border} ${cfg.text} ${cfg.bg}`}>{cfg.label}</span>
          {isOnline ? (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700/40 font-medium">Online Order</span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-full bg-warm-750 text-cream-muted border border-warm-700 font-medium">
              {order.tableNumber ? `Table ${order.tableNumber}` : 'Dine-In'}
            </span>
          )}
        </div>
        <TimerDisplay placedAt={order.placedAt} status={order.status} />
      </div>

      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <span className="text-amber font-semibold text-sm">#{order._id?.slice(-6).toUpperCase()}</span>
        <span className="text-warm-500 text-xs">
          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {order.customer?.name && (
        <div className="px-4 pb-1">
          <span className="text-cream-muted text-xs">{order.customer.name}</span>
        </div>
      )}

      <div className="px-4 pb-3 flex-1 space-y-2 mt-1">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-amber text-sm font-bold w-5 flex-shrink-0">{item.quantity}×</span>
            <div>
              <p className="text-cream text-sm font-medium leading-tight">{item.name}</p>
              {item.specialNotes && (
                <p className="text-amber/70 text-xs italic mt-0.5">{item.specialNotes}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {cfg.next && (
        <div className="px-4 pb-4">
          <button
            onClick={() => onStatusChange(order._id, cfg.next!)}
            className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border ${
              cfg.next === 'PREPARING'
                ? 'bg-amber/10 hover:bg-amber text-amber hover:text-warm-950 border-amber/30 hover:border-amber'
                : 'bg-green-900/20 hover:bg-green-800/40 text-green-300 border-green-700/30 hover:border-green-500'
            }`}
          >
            Mark as {cfg.next === 'PREPARING' ? 'Preparing' : 'Ready'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function KitchenDisplayScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<KDSOrder[]>([]);
  const [filter, setFilter] = useState<'All' | 'Dine-In' | 'Online'>('All');
  const [time, setTime] = useState(new Date());
  const [, setRestaurantId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get all restaurants and find one to display orders for
        const res = await API.get('/restaurants');
        const restaurant = res.data.restaurants[0];
        if (!restaurant) { setLoading(false); return; }
        setRestaurantId(restaurant._id);

        const ordersRes = await API.get(`/kitchen/orders/${restaurant._id}`);
        const mapped = ordersRes.data.orders.map((o: KitchenOrder) => ({
          ...o,
          status: backendToKDS[o.status] || 'NEW',
          placedAt: new Date(o.createdAt).getTime(),
        }));
        setOrders(mapped);

        // Connect socket
        socketService.connect();
        socketService.joinKitchen(restaurant._id);

        // Listen for new orders in real time
        socketService.onNewOrder((newOrder: KitchenOrder) => {
          setOrders(prev => [{
  _id: newOrder._id,
  type: newOrder.orderType,
  orderType: newOrder.orderType,
  tableNumber: newOrder.tableNumber,
  createdAt: newOrder.createdAt,
  placedAt: new Date(newOrder.createdAt).getTime(),
  status: 'NEW' as OrderStatus,
  customer: newOrder.customer,
  items: newOrder.items,
}, ...prev]);
        });

        // Listen for status updates
        socketService.onOrderStatusUpdate(({ orderId, status }: OrderStatusUpdate) => {
          setOrders(prev => prev.map(o =>
            o._id === orderId ? { ...o, status: backendToKDS[status] || o.status } : o
          ));
        });

      } catch (err) {
        console.error('KDS fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const clockId = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(clockId);
      socketService.disconnect();
    };
  }, [user]);

  const updateStatus = async (id: string, next: OrderStatus) => {
  try {
    await API.patch(`/orders/${id}/status`, { status: kdsToBackend[next] });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status: next } : o));
  } catch (err) {
    console.error('Status update error', err);
  }
};
  const filtered = orders.filter(o =>
    filter === 'All' ? true :
    filter === 'Dine-In' ? o.orderType === 'dine-in' :
    o.orderType === 'online'
  );

  const active = filtered.filter(o => o.status !== 'READY');
  const done = filtered.filter(o => o.status === 'READY');
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="bg-warm-950 min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-4 bg-warm-900 border-b border-warm-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber rounded-full flex items-center justify-center">
            <UtensilsCrossed size={15} className="text-warm-950" />
          </div>
          <div>
            <span className="font-display text-lg text-cream font-semibold">DineSphere</span>
            <span className="ml-2 text-amber text-xs font-bold tracking-widest uppercase">KDS</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {(['All', 'Dine-In', 'Online'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === f ? 'bg-amber text-warm-950' : 'text-cream-muted hover:text-cream bg-warm-800 border border-warm-700'
              }`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-cream-muted text-sm">
            <Monitor size={16} className="text-amber" />
            <span className="text-cream font-medium">{active.length}</span>
            <span>active orders</span>
          </div>
          <div className="font-mono text-cream text-lg font-semibold">{timeStr}</div>
        </div>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-cream-muted text-sm">Loading orders...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 gap-0 overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-cream font-display text-xl">Active Orders</h2>
              <span className="w-6 h-6 flex items-center justify-center bg-red-900/50 text-red-300 text-xs font-bold rounded-full">{active.length}</span>
            </div>
            <div className="grid grid-cols-3 gap-5">
              {active.length === 0 ? (
                <div className="col-span-3 text-center py-20 text-warm-500">
                  <p className="text-lg">No active orders</p>
                  <p className="text-sm mt-1">All caught up! 🎉</p>
                </div>
              ) : active.map(order => (
                <OrderCard key={order._id} order={order} onStatusChange={updateStatus} />
              ))}
            </div>
          </div>

          <div className="w-72 bg-warm-900 border-l border-warm-700 p-5 overflow-y-auto">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-green-400 font-display text-lg">Done</h2>
              <span className="w-6 h-6 flex items-center justify-center bg-green-900/50 text-green-300 text-xs font-bold rounded-full">{done.length}</span>
            </div>
            <div className="space-y-3">
              {done.length === 0 ? (
                <p className="text-warm-600 text-sm text-center py-10">No completed orders yet</p>
              ) : done.map(order => (
                <div key={order._id} className="bg-warm-800 border border-green-700/30 rounded-xl p-4 opacity-70">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber text-sm font-semibold">#{order._id?.slice(-6).toUpperCase()}</span>
                    <span className="text-xs px-2 py-0.5 bg-green-900/30 text-green-300 rounded-full font-medium">Ready</span>
                  </div>
                  <p className="text-cream-muted text-xs mb-1">
                    {order.orderType === 'online' ? 'Online Order' : `Table ${order.tableNumber || ''}`}
                  </p>
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-warm-500 text-xs">{item.quantity}× {item.name}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}