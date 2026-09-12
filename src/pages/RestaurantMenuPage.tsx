import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, MapPin, ShoppingCart, Plus, Minus, Utensils, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { restaurantService } from '../services/restaurant.service';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  size: 'small' | 'medium' | 'large';
  image: string;
}

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menu, setMenu] = useState<any>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restaurantData, menuData] = await Promise.all([
          restaurantService.getById(id!),
          restaurantService.getMenu(id!),
        ]);
        setRestaurant(restaurantData);
        setMenu(menuData.menu || {});
        const cats = Object.keys(menuData.menu || {});
        setCategories(cats);
        if (cats.length > 0) setActiveCategory(cats[0]);
      } catch (err) {
        console.error('Failed to load restaurant', err);
        setError('Failed to load this restaurant. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item._id);
      if (existing) return prev.map(c => c.id === item._id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, {
        id: item._id,
        name: item.name,
        price: item.price,
        qty: 1,
        size: 'medium',
        image: item.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(c => c.id !== id));

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  };

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const visibleItems = menu[activeCategory] || [];

  if (loading) return (
    <div className="bg-warm-950 min-h-screen pt-[72px] flex items-center justify-center">
      <Navbar />
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-cream-muted text-sm">Loading restaurant...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-warm-950 min-h-screen pt-[72px] flex items-center justify-center">
      <Navbar />
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  if (!restaurant) return (
    <div className="bg-warm-950 min-h-screen pt-[72px] flex items-center justify-center">
      <Navbar />
      <p className="text-cream-muted">Restaurant not found</p>
    </div>
  );

  return (
    <div className="bg-warm-950 min-h-screen pt-[72px]">
      <Navbar />

      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={restaurant.images?.[0] || 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-950 via-warm-950/60 to-warm-950/20" />
        <div className="absolute bottom-8 left-16 right-16 flex items-end justify-between">
          <div>
            <h1 className="font-display text-5xl text-cream font-semibold mb-2">{restaurant.name}</h1>
            <div className="flex items-center gap-5 text-sm text-cream-muted">
              <span className="text-amber font-medium">{restaurant.cuisine?.join(', ')}</span>
              <div className="flex items-center gap-1">
                <Star size={13} className="text-amber fill-amber" />
                <span className="text-cream font-medium">{restaurant.rating || 'New'}</span>
                <span className="text-warm-500">({restaurant.totalReviews || 0})</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={13} className="text-amber" />
                {restaurant.openingHours?.[0]?.open || '9:00 AM'} - {restaurant.openingHours?.[0]?.close || '10:00 PM'}
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={13} className="text-amber" />
                {restaurant.address}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowMenu(true)}
              className="px-6 py-3 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              Order Online
            </button>
            <Link
              to={`/restaurant/${id}/reserve`}
              className="px-6 py-3 border border-cream/30 text-cream hover:border-amber hover:text-amber rounded-xl transition-colors flex items-center gap-2 font-medium"
            >
              <Utensils size={16} />
              Book a Table
            </Link>
          </div>
        </div>
      </div>

      {/* Menu + Cart */}
      {showMenu && (
        <div className="flex gap-0 max-w-full">
          {/* Category Sidebar */}
          <aside className="w-48 flex-shrink-0 sticky top-[72px] h-[calc(100vh-72px)] bg-warm-900 border-r border-warm-700 py-8 px-4 overflow-y-auto">
            <p className="text-cream-muted text-xs font-medium tracking-[0.2em] uppercase mb-4 px-2">Menu</p>
            {categories.length === 0 ? (
              <p className="text-warm-500 text-xs px-2">No menu items yet</p>
            ) : (
              <nav className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-amber/10 text-amber border-l-2 border-amber'
                        : 'text-cream-muted hover:text-cream hover:bg-warm-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            )}
          </aside>

          {/* Dishes */}
          <main className="flex-1 px-10 py-8 overflow-y-auto">
            <h2 className="font-display text-2xl text-cream mb-6">{activeCategory}</h2>
            {visibleItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-cream-muted">No items in this category yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5">
                {visibleItems.map((item: any) => (
                  <div key={item._id} className="flex gap-4 bg-warm-800 border border-warm-700 rounded-xl p-4 hover:border-amber/30 transition-colors group">
                    <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={item.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base text-cream font-medium mb-1">{item.name}</h3>
                      <p className="text-cream-muted text-xs leading-relaxed mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-amber font-semibold">${item.price}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber/10 hover:bg-amber text-amber hover:text-warm-950 rounded-lg text-xs font-semibold transition-all duration-200"
                        >
                          <Plus size={13} />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* Cart Panel */}
          <aside className="w-80 flex-shrink-0 sticky top-[72px] h-[calc(100vh-72px)] bg-warm-900 border-l border-warm-700 flex flex-col">
            <div className="px-6 py-5 border-b border-warm-700 flex items-center justify-between">
              <h3 className="font-display text-lg text-cream">Your Order</h3>
              {cartCount > 0 && (
                <span className="bg-amber text-warm-950 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart size={40} className="text-warm-600 mb-3" />
                  <p className="text-warm-500 text-sm">Your cart is empty</p>
                  <p className="text-warm-600 text-xs mt-1">Add dishes to get started</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-warm-800 rounded-lg p-3 border border-warm-700">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-cream text-xs font-medium truncate">{item.name}</p>
                      <p className="text-amber text-xs">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-warm-800 hover:bg-warm-700 text-cream transition-colors">
                        <Minus size={11} />
                      </button>
                      <span className="text-cream text-xs w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-warm-800 hover:bg-warm-700 text-cream transition-colors">
                        <Plus size={11} />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-warm-500 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-warm-700">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cream-muted">Subtotal</span>
                  <span className="text-cream">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-cream-muted">Delivery</span>
                  <span className="text-cream">${restaurant.deliveryFee?.toFixed(2) || '4.99'}</span>
                </div>
                <div className="flex justify-between font-semibold mb-4">
                  <span className="text-cream">Total</span>
                  <span className="text-amber text-lg">${(cartTotal + (restaurant.deliveryFee || 4.99)).toFixed(2)}</span>
                </div>
                <Link
                  to="/cart"
                  state={{ cart, restaurantId: id, restaurantName: restaurant.name, deliveryFee: restaurant.deliveryFee || 4.99 }}
                  className="block w-full text-center py-3 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl transition-colors"
                >
                  Review Cart
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}