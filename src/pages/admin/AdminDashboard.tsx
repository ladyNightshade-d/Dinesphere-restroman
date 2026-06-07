import { useEffect, useState } from 'react';
import { Bell, TrendingUp, ShoppingBag, Users, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const statusColor: Record<string, string> = {
  placed: 'bg-yellow-900/60 text-yellow-300',
  confirmed: 'bg-blue-900/60 text-blue-300',
  preparing: 'bg-orange-900/60 text-orange-300',
  quality_check: 'bg-purple-900/60 text-purple-300',
  out_for_delivery: 'bg-cyan-900/60 text-cyan-300',
  delivered: 'bg-green-900/60 text-green-300',
  cancelled: 'bg-red-900/60 text-red-300',
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, setRestaurantId] = useState<string>('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // Get admin's restaurant
        const res = await API.get('/restaurants');
        const myRestaurant = res.data.restaurants.find(
          (r: any) => r.owner === user?.id
        );
        if (myRestaurant) {
          setRestaurantId(myRestaurant._id);
          fetchDashboard(myRestaurant._id);
        }
      } catch (err) {
        console.error('Failed to fetch restaurant', err);
        setLoading(false);
      }
    };

    const fetchDashboard = async (rid: string) => {
      try {
        const res = await API.get(`/admin/dashboard?restaurantId=${rid}`);
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchRestaurant();
  }, [user]);

  const maxRevenue = stats?.salesChart
    ? Math.max(...stats.salesChart.map((d: any) => d.revenue), 1)
    : 1;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading) return (
    <div className="flex bg-warm-950 min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cream-muted text-sm">Loading dashboard...</p>
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex bg-warm-950 min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 min-h-screen">

        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-warm-950/95 backdrop-blur border-b border-warm-700 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-cream font-semibold">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-cream-muted text-xs mt-0.5">{today} · {user?.restaurantName || 'Your Restaurant'}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-warm-800 hover:bg-warm-750 text-cream-muted hover:text-cream transition-colors border border-warm-700">
              <Bell size={18} />
              {stats?.stats?.pendingOrders > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber rounded-full" />
              )}
            </button>
            <div className="w-9 h-9 rounded-full bg-amber flex items-center justify-center border-2 border-amber">
              <span className="text-warm-950 font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="px-8 py-8 space-y-8">

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-5">
            {[
              { label: 'Total Orders Today', value: stats?.stats?.totalOrdersToday ?? 0, delta: 'Today', icon: ShoppingBag, color: 'text-amber' },
              { label: 'Revenue Today', value: `$${(stats?.stats?.revenueToday ?? 0).toFixed(2)}`, delta: 'Today', icon: TrendingUp, color: 'text-green-400' },
              { label: 'Active Tables', value: stats?.stats?.activeTables ?? 0, delta: 'Reservations', icon: Users, color: 'text-blue-400' },
              { label: 'Pending Orders', value: stats?.stats?.pendingOrders ?? 0, delta: 'Needs attention', icon: AlertCircle, color: 'text-red-400' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-warm-900 border border-warm-700 rounded-2xl p-6 hover:border-amber/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-warm-800 flex items-center justify-center ${stat.color}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-xs text-amber bg-amber/10 px-2 py-0.5 rounded-full font-medium">{stat.delta}</span>
                  </div>
                  <p className="font-display text-3xl text-cream font-semibold mb-1">{stat.value}</p>
                  <p className="text-cream-muted text-xs">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="col-span-2 bg-warm-900 border border-warm-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-cream">Revenue — Past 7 Days</h2>
                <span className="text-amber text-sm font-medium">
                  ${stats?.salesChart?.reduce((s: number, d: any) => s + d.revenue, 0).toFixed(2) || '0.00'} total
                </span>
              </div>
              {stats?.salesChart?.length > 0 ? (
                <div className="flex items-end gap-3 h-44">
                  {stats.salesChart.map((day: any, i: number) => {
                    const h = Math.max((day.revenue / maxRevenue) * 100, 2);
                    const isMax = day.revenue === maxRevenue;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-xs text-cream-muted">${day.revenue}</span>
                        <div className="w-full rounded-t-lg relative" style={{ height: `${h}%` }}>
                          <div className={`w-full h-full rounded-t-lg ${isMax ? 'bg-amber' : 'bg-amber/30 hover:bg-amber/50 transition-colors'}`} />
                        </div>
                        <span className="text-xs text-warm-500">{day.date}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-44 flex items-center justify-center">
                  <p className="text-cream-muted text-sm">No revenue data yet</p>
                </div>
              )}
            </div>

            {/* Inventory */}
            <div className="bg-warm-900 border border-warm-700 rounded-2xl p-6">
              <h2 className="font-display text-xl text-cream mb-5">Inventory Alerts</h2>
              {stats?.lowStockItems?.length > 0 ? (
                <div className="space-y-3">
                  {stats.lowStockItems.map((item: any, i: number) => {
                    const pct = Math.min(100, (item.currentStock / (item.minimumStock * 2)) * 100);
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-red-400">
                            {item.ingredient} ⚠
                          </span>
                          <span className="text-red-400">{item.currentStock} {item.unit}</span>
                        </div>
                        <div className="w-full bg-warm-750 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-red-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <p className="text-green-400 text-sm font-medium">All stocked up!</p>
                  <p className="text-cream-muted text-xs mt-1">No low stock alerts</p>
                </div>
              )}
            </div>
          </div>

          {/* Orders Table + Staff */}
          <div className="grid grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="col-span-2 bg-warm-900 border border-warm-700 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-warm-700 flex items-center justify-between">
                <h2 className="font-display text-xl text-cream">Recent Orders</h2>
                <span className="text-cream-muted text-xs">{stats?.recentOrders?.length || 0} orders</span>
              </div>
              {stats?.recentOrders?.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-warm-700">
                      {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Time'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-medium text-warm-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order: any, i: number) => (
                      <tr key={i} className="border-b border-warm-700/50 hover:bg-warm-750/30 transition-colors">
                        <td className="px-5 py-4 text-amber text-sm font-medium">#{order._id?.slice(-6).toUpperCase()}</td>
                        <td className="px-5 py-4 text-cream text-sm">{order.customer?.name || 'Guest'}</td>
                        <td className="px-5 py-4 text-cream-muted text-xs max-w-[180px] truncate">
                          {order.items?.map((item: any) => item.name).join(', ')}
                        </td>
                        <td className="px-5 py-4 text-cream text-sm font-medium">${order.totalAmount?.toFixed(2)}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[order.status] || 'bg-warm-700 text-cream-muted'}`}>
                            {order.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-warm-500 text-xs">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center py-16">
                  <p className="text-cream-muted text-sm">No orders yet today</p>
                </div>
              )}
            </div>

            {/* Staff */}
            <div className="bg-warm-900 border border-warm-700 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-warm-700">
                <h2 className="font-display text-xl text-cream">Kitchen Staff</h2>
              </div>
              {stats?.staff?.length > 0 ? (
                <div className="divide-y divide-warm-700/50">
                  {stats.staff.map((s: any, i: number) => (
                    <div key={i} className="px-5 py-4 hover:bg-warm-750/30 transition-colors">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-cream text-sm font-medium">{s.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-900/50 text-green-300">
                          Active
                        </span>
                      </div>
                      <p className="text-cream-muted text-xs">Kitchen Staff</p>
                      <p className="text-warm-500 text-xs mt-0.5">{s.assignedStation || 'General'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-16">
                  <p className="text-cream-muted text-sm">No kitchen staff yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}