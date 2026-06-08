import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { Plus, X, AlertTriangle } from 'lucide-react';

export default function AdminInventoryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ingredient: '', currentStock: '', unit: 'kg', minimumStock: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/restaurants');
        const myRestaurant = res.data.restaurants.find((r: any) => 
  r.owner === user?.id || r.owner?._id === user?.id
) || res.data.restaurants[0];
        if (myRestaurant) {
          setRestaurantId(myRestaurant._id);
          const inv = await API.get(`/inventory/${myRestaurant._id}`);
          setItems(inv.data.items || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchData();
  }, [user]);

  const handleAdd = async () => {
  if (!restaurantId) {
    alert('Restaurant not found. Please refresh the page.');
    return;
  }
  if (!form.ingredient || !form.currentStock || !form.minimumStock) {
    alert('Please fill all fields');
    return;
  }
  try {
    const res = await API.post('/inventory', {
      ingredient: form.ingredient,
      currentStock: parseFloat(form.currentStock),
      minimumStock: parseFloat(form.minimumStock),
      unit: form.unit,
      restaurant: restaurantId,
    });
    setItems(prev => [...prev, res.data.item]);
    setShowModal(false);
    setForm({ ingredient: '', currentStock: '', unit: 'kg', minimumStock: '' });
  } catch (err: any) {
    console.error('Add ingredient error:', err.response?.data);
    alert(err.response?.data?.message || 'Failed to add ingredient');
  }
};

  const handleUpdate = async (id: string, currentStock: number) => {
    try {
      const res = await API.patch(`/inventory/${id}`, { currentStock });
      setItems(prev => prev.map(i => i._id === id ? res.data.item : i));
    } catch (err) { console.error(err); }
  };

  const lowStock = items.filter(i => i.currentStock <= i.minimumStock);

  return (
    <div className="flex bg-warm-950 min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1">
        <div className="sticky top-0 z-30 bg-warm-950/95 backdrop-blur border-b border-warm-700 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-cream font-semibold">Inventory</h1>
            <p className="text-cream-muted text-xs mt-0.5">{items.length} ingredients · {lowStock.length} low stock</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl text-sm transition-colors">
            <Plus size={16} /> Add Ingredient
          </button>
        </div>

        <div className="px-8 py-6">
          {lowStock.length > 0 && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium text-sm">Low Stock Alert</p>
                <p className="text-red-400/70 text-xs mt-0.5">
                  {lowStock.map(i => i.ingredient).join(', ')} need restocking
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-cream-muted">No inventory items yet</p>
              <p className="text-warm-500 text-sm mt-1">Add ingredients to track stock levels</p>
            </div>
          ) : (
            <div className="bg-warm-900 border border-warm-700 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-warm-700">
                    {['Ingredient', 'Current Stock', 'Minimum Stock', 'Unit', 'Status', 'Update Stock'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-warm-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any) => {
                    const isLow = item.currentStock <= item.minimumStock;
                    const pct = Math.min(100, (item.currentStock / (item.minimumStock * 2)) * 100);
                    return (
                      <tr key={item._id} className="border-b border-warm-700/50 hover:bg-warm-750/30 transition-colors">
                        <td className="px-5 py-4">
                          <span className={`font-medium text-sm ${isLow ? 'text-red-400' : 'text-cream'}`}>
                            {item.ingredient}
                            {isLow && <span className="ml-2 text-red-400">⚠</span>}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <span className={`text-sm font-medium ${isLow ? 'text-red-400' : 'text-cream'}`}>
                              {item.currentStock} {item.unit}
                            </span>
                            <div className="w-24 bg-warm-750 rounded-full h-1.5 mt-1">
                              <div className={`h-1.5 rounded-full ${isLow ? 'bg-red-500' : 'bg-amber'}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-cream-muted text-sm">{item.minimumStock} {item.unit}</td>
                        <td className="px-5 py-4 text-cream-muted text-sm">{item.unit}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isLow ? 'bg-red-900/60 text-red-300' : 'bg-green-900/60 text-green-300'}`}>
                            {isLow ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              defaultValue={item.currentStock}
                              onBlur={e => handleUpdate(item._id, parseFloat(e.target.value))}
                              className="w-20 bg-warm-800 border border-warm-700 rounded-lg px-2 py-1 text-cream text-sm focus:outline-none focus:border-amber"
                            />
                            <span className="text-warm-500 text-xs">{item.unit}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-warm-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-warm-900 border border-warm-700 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-cream">Add Ingredient</h2>
                <button onClick={() => setShowModal(false)} className="text-warm-500 hover:text-cream"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-cream-muted text-xs font-medium mb-1.5 uppercase tracking-wide">Ingredient Name</label>
                  <input value={form.ingredient} onChange={e => setForm(p => ({ ...p, ingredient: e.target.value }))} placeholder="e.g. Chicken Breast" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream text-sm focus:outline-none focus:border-amber placeholder-warm-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cream-muted text-xs font-medium mb-1.5 uppercase tracking-wide">Current Stock</label>
                    <input type="number" value={form.currentStock} onChange={e => setForm(p => ({ ...p, currentStock: e.target.value }))} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream text-sm focus:outline-none focus:border-amber" />
                  </div>
                  <div>
                    <label className="block text-cream-muted text-xs font-medium mb-1.5 uppercase tracking-wide">Minimum Stock</label>
                    <input type="number" value={form.minimumStock} onChange={e => setForm(p => ({ ...p, minimumStock: e.target.value }))} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream text-sm focus:outline-none focus:border-amber" />
                  </div>
                </div>
                <div>
                  <label className="block text-cream-muted text-xs font-medium mb-1.5 uppercase tracking-wide">Unit</label>
                  <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream text-sm focus:outline-none focus:border-amber">
                    {['kg', 'g', 'L', 'ml', 'units', 'boxes', 'bottles'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-warm-800 hover:bg-warm-700 text-cream-muted rounded-xl text-sm transition-colors">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-3 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl text-sm transition-colors">Add Ingredient</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}