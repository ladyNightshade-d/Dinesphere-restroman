import { Bell, TrendingUp, ShoppingBag, Users, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { adminOrders, inventoryItems, staffSchedule } from '../../data/dummyData';

const stats = [
  { label: 'Total Orders Today', value: '48', delta: '+12%', icon: ShoppingBag, color: 'text-amber' },
  { label: 'Revenue Today', value: '$4,821', delta: '+8.3%', icon: TrendingUp, color: 'text-green-400' },
  { label: 'Active Tables', value: '12/18', delta: '67% occupied', icon: Users, color: 'text-blue-400' },
  { label: 'Pending Orders', value: '7', delta: 'Requires attention', icon: AlertCircle, color: 'text-red-400' },
];

const revenueData = [620, 840, 750, 1100, 980, 1320, 1180];
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const maxRevenue = Math.max(...revenueData);

const statusColor: Record<string, string> = {
  Pending: 'bg-yellow-900/60 text-yellow-300',
  Preparing: 'bg-blue-900/60 text-blue-300',
  Delivered: 'bg-green-900/60 text-green-300',
};

export default function AdminDashboard() {
  return (
    <div className="flex bg-warm-950 min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-warm-950/95 backdrop-blur border-b border-warm-700 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-cream font-semibold">Good evening, Marco</h1>
            <p className="text-cream-muted text-xs mt-0.5">Thursday, June 5 · Ember & Oak</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-warm-800 hover:bg-warm-750 text-cream-muted hover:text-cream transition-colors border border-warm-700">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber">
              <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-5">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-warm-900 border border-warm-700 rounded-2xl p-6 hover:border-amber/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-warm-800 flex items-center justify-center ${stat.color}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full font-medium">{stat.delta}</span>
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
                <span className="text-amber text-sm font-medium">$6,790 total</span>
              </div>
              <div className="flex items-end gap-3 h-44">
                {revenueData.map((val, i) => {
                  const h = (val / maxRevenue) * 100;
                  const isMax = val === maxRevenue;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs text-cream-muted">${val}</span>
                      <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: `${h}%` }}>
                        <div className={`w-full h-full rounded-t-lg ${isMax ? 'bg-amber' : 'bg-amber/30 hover:bg-amber/50 transition-colors'}`} />
                      </div>
                      <span className="text-xs text-warm-500">{dayLabels[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-warm-900 border border-warm-700 rounded-2xl p-6">
              <h2 className="font-display text-xl text-cream mb-5">Inventory Levels</h2>
              <div className="space-y-3">
                {inventoryItems.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={`font-medium ${item.low ? 'text-red-400' : 'text-cream-muted'}`}>
                        {item.name}
                        {item.low && <span className="ml-1.5 text-red-400">⚠</span>}
                      </span>
                      <span className={item.low ? 'text-red-400' : 'text-cream-muted'}>
                        {typeof item.stock === 'number' && item.unit === '%' ? `${item.stock}%` : `${item.stock}${item.unit}`}
                      </span>
                    </div>
                    <div className="w-full bg-warm-750 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${item.low ? 'bg-red-500' : 'bg-amber'}`}
                        style={{ width: `${item.unit === '%' ? item.stock : Math.min(100, item.stock)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Orders Table + Staff */}
          <div className="grid grid-cols-3 gap-6">
            {/* Orders */}
            <div className="col-span-2 bg-warm-900 border border-warm-700 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-warm-700 flex items-center justify-between">
                <h2 className="font-display text-xl text-cream">Recent Orders</h2>
                <button className="text-amber text-xs font-medium hover:text-amber-light transition-colors">View All</button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-warm-700">
                    {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Time'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-warm-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminOrders.map((order, i) => (
                    <tr key={i} className="border-b border-warm-700/50 hover:bg-warm-750/30 transition-colors">
                      <td className="px-5 py-4 text-amber text-sm font-medium">{order.id}</td>
                      <td className="px-5 py-4 text-cream text-sm">{order.customer}</td>
                      <td className="px-5 py-4 text-cream-muted text-xs max-w-[180px] truncate">{order.items}</td>
                      <td className="px-5 py-4 text-cream text-sm font-medium">{order.total}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-warm-500 text-xs">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Staff Schedule */}
            <div className="bg-warm-900 border border-warm-700 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-warm-700">
                <h2 className="font-display text-xl text-cream">Staff Today</h2>
              </div>
              <div className="divide-y divide-warm-700/50">
                {staffSchedule.map((s, i) => (
                  <div key={i} className="px-5 py-4 hover:bg-warm-750/30 transition-colors">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-cream text-sm font-medium">{s.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        s.status === 'On Duty' ? 'bg-green-900/50 text-green-300' : 'bg-warm-750 text-warm-500'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <p className="text-cream-muted text-xs">{s.role}</p>
                    <p className="text-warm-500 text-xs mt-0.5">{s.shift}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
