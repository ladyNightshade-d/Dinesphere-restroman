import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/useAuth';
import { fetchCurrentAdminRestaurant } from '../../services/adminRestaurant';
import { orderService } from '../../services/order.service';
import { OrderRecord } from '../../types/domain';

const statusColor: Record<string, string> = {
  placed: 'bg-yellow-900/60 text-yellow-300',
  confirmed: 'bg-blue-900/60 text-blue-300',
  preparing: 'bg-orange-900/60 text-orange-300',
  quality_check: 'bg-purple-900/60 text-purple-300',
  out_for_delivery: 'bg-cyan-900/60 text-cyan-300',
  delivered: 'bg-green-900/60 text-green-300',
  cancelled: 'bg-red-900/60 text-red-300',
};

const statusOptions = ['placed', 'confirmed', 'preparing', 'quality_check', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [, setRestaurantId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const myRestaurant = await fetchCurrentAdminRestaurant(user);
        if (!myRestaurant) {
          setRestaurantId('');
          setOrders([]);
          setLoading(false);
          return;
        }

        setRestaurantId(myRestaurant._id);
        const ordersData = await orderService.getRestaurantOrders(myRestaurant._id);
        setOrders(ordersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchData();
  }, [user]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await orderService.updateStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="flex bg-warm-950 min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1">
        <div className="sticky top-0 z-30 bg-warm-950/95 backdrop-blur border-b border-warm-700 px-8 py-4">
          <h1 className="font-display text-2xl text-cream font-semibold">Orders</h1>
          <p className="text-cream-muted text-xs mt-0.5">{orders.length} total orders</p>
        </div>

        <div className="px-8 py-6">
          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {['all', ...statusOptions].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                  filter === s ? 'bg-amber text-warm-950' : 'bg-warm-800 text-cream-muted hover:text-cream border border-warm-700'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-cream-muted">No orders found</p>
            </div>
          ) : (
            <div className="bg-warm-900 border border-warm-700 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-warm-700">
                    {['Order ID', 'Customer', 'Items', 'Total', 'Type', 'Status', 'Time', 'Action'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-warm-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <tr key={order._id} className="border-b border-warm-700/50 hover:bg-warm-750/30 transition-colors">
                      <td className="px-5 py-4 text-amber text-sm font-medium">#{order._id?.slice(-6).toUpperCase()}</td>
                      <td className="px-5 py-4 text-cream text-sm">{order.customer?.name || 'Guest'}</td>
                      <td className="px-5 py-4 text-cream-muted text-xs max-w-[150px] truncate">
                        {order.items?.map(i => i.name).join(', ')}
                      </td>
                      <td className="px-5 py-4 text-cream text-sm font-medium">${order.totalAmount?.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.orderType === 'online' ? 'bg-blue-900/40 text-blue-300' : 'bg-amber/20 text-amber'}`}>
                          {order.orderType}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}>
                          {order.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-warm-500 text-xs">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order._id, e.target.value)}
                          className="bg-warm-800 border border-warm-700 rounded-lg px-2 py-1 text-cream text-xs focus:outline-none focus:border-amber"
                        >
                          {statusOptions.map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}