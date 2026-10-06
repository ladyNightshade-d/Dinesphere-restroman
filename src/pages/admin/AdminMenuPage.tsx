import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/useAuth';
import API from '../../services/api';
import { fetchCurrentAdminRestaurant } from '../../services/adminRestaurant';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { MenuItem } from '../../types/domain';

const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Drinks'];

export default function AdminMenuPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({ name: '', description: '', category: 'Starters', price: '', image: '', isAvailable: true });

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
          setItems([]);
          setLoading(false);
          return;
        }

        setRestaurantId(myRestaurant._id);
        const menuRes = await API.get(`/menu/restaurant/${myRestaurant._id}`);
        setItems(menuRes.data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', description: '', category: 'Starters', price: '', image: '', isAvailable: true });
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description || '', category: item.category, price: String(item.price), image: item.image || '', isAvailable: item.isAvailable ?? true });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        const res = await API.put(`/menu/${editing._id}`, { ...form, price: parseFloat(form.price) });
        setItems(prev => prev.map(i => i._id === editing._id ? res.data.item : i));
      } else {
        const res = await API.post('/menu', { ...form, price: parseFloat(form.price), restaurant: restaurantId });
        setItems(prev => [...prev, res.data.item]);
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await API.delete(`/menu/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  return (
    <div className="flex bg-warm-950 min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1">
        <div className="sticky top-0 z-30 bg-warm-950/95 backdrop-blur border-b border-warm-700 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-cream font-semibold">Menu Management</h1>
            <p className="text-cream-muted text-xs mt-0.5">{items.length} items</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl text-sm transition-colors">
            <Plus size={16} /> Add Item
          </button>
        </div>

        <div className="px-8 py-6">
          {/* Category filter */}
          <div className="flex gap-2 mb-6">
            {['All', ...CATEGORIES].map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === c ? 'bg-amber text-warm-950' : 'bg-warm-800 text-cream-muted hover:text-cream border border-warm-700'}`}>
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {filtered.map(item => (
                <div key={item._id} className="bg-warm-900 border border-warm-700 rounded-2xl overflow-hidden hover:border-amber/30 transition-colors">
                  <div className="aspect-video overflow-hidden">
                    <img src={item.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-display text-base text-cream font-medium">{item.name}</h3>
                      <span className="text-amber font-semibold text-sm">${item.price}</span>
                    </div>
                    <p className="text-cream-muted text-xs mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'}`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(item)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-warm-800 hover:bg-warm-700 text-cream-muted hover:text-cream transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-warm-800 hover:bg-red-900/40 text-cream-muted hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-warm-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-warm-900 border border-warm-700 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-cream">{editing ? 'Edit Item' : 'Add Menu Item'}</h2>
                <button onClick={() => setShowModal(false)} className="text-warm-500 hover:text-cream transition-colors"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-cream-muted text-xs font-medium mb-1.5 uppercase tracking-wide">Name</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream text-sm focus:outline-none focus:border-amber" />
                </div>
                <div>
                  <label className="block text-cream-muted text-xs font-medium mb-1.5 uppercase tracking-wide">Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream text-sm focus:outline-none focus:border-amber resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cream-muted text-xs font-medium mb-1.5 uppercase tracking-wide">Category</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream text-sm focus:outline-none focus:border-amber">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-cream-muted text-xs font-medium mb-1.5 uppercase tracking-wide">Price ($)</label>
                    <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream text-sm focus:outline-none focus:border-amber" />
                  </div>
                </div>
                <div>
                  <label className="block text-cream-muted text-xs font-medium mb-1.5 uppercase tracking-wide">Image URL</label>
                  <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream text-sm focus:outline-none focus:border-amber placeholder-warm-500" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="available" checked={form.isAvailable} onChange={e => setForm(p => ({ ...p, isAvailable: e.target.checked }))} className="w-4 h-4 accent-amber" />
                  <label htmlFor="available" className="text-cream-muted text-sm">Available for ordering</label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-warm-800 hover:bg-warm-700 text-cream-muted rounded-xl text-sm transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl text-sm transition-colors">
                  {editing ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}