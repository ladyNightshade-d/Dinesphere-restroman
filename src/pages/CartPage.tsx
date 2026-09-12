import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { orderService } from '../services/order.service';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/apiError';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  size: 'small' | 'medium' | 'large';
}

interface CartLocationState {
  cart?: CartItem[];
  restaurantId?: string;
  restaurantName?: string;
  deliveryFee?: number;
}

const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];

export default function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state as CartLocationState | undefined;

  const initialCart = state?.cart || [];
  const restaurantId = state?.restaurantId || '';
  const restaurantName = state?.restaurantName || 'Restaurant';
  const deliveryFee = state?.deliveryFee || 4.99;

  const [items, setItems] = useState<CartItem[]>(initialCart);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  };

  const updateSize = (id: string, size: 'small' | 'medium' | 'large') => {
    setItems(prev => prev.map(c => c.id === id ? { ...c, size } : c));
  };

  const remove = (id: string) => {
    setItems(prev => prev.filter(c => c.id !== id));
  };

  const subtotal = items.reduce((s, c) => s + c.price * c.qty, 0);
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!address.trim()) {
      setError('Please enter a delivery address');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const order = await orderService.placeOrder({
        restaurant: restaurantId,
        items: items.map(item => ({
          menuItem: item.id,
          name: item.name,
          quantity: item.qty,
          size: item.size || 'medium',
          price: item.price,
        })),
        totalAmount: subtotal,
        deliveryFee,
        deliveryAddress: address,
        orderType: 'online',
      });

      navigate('/order-tracking', { state: { orderId: order._id, order } });
    } catch (error) {
      setError(getApiErrorMessage(error, 'Failed to place order. Try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-warm-950 min-h-screen pt-[72px]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-12 py-12">
        <div className="mb-8">
          <p className="text-amber text-xs font-medium tracking-[0.3em] uppercase mb-2">Your Order</p>
          <h1 className="font-display text-4xl text-cream">Cart</h1>
          <p className="text-cream-muted text-sm mt-1">Ordering from <span className="text-cream">{restaurantName}</span></p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-10">
          {/* Items list */}
          <div className="flex-1 space-y-4">
            {items.length === 0 ? (
              <div className="bg-warm-800 rounded-2xl p-16 text-center border border-warm-700">
                <p className="text-cream-muted text-lg">Your cart is empty</p>
                <Link to="/discover" className="inline-block mt-4 text-amber hover:text-amber-light text-sm">Browse restaurants →</Link>
              </div>
            ) : items.map(item => (
              <div key={item.id} className="flex items-center gap-5 bg-warm-800 border border-warm-700 rounded-2xl p-5 hover:border-warm-600 transition-colors">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base text-cream font-medium mb-2">{item.name}</h3>
                  <div className="flex gap-2 mb-1">
                    {sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => updateSize(item.id, s)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
                          (item.size || 'medium') === s
                            ? 'bg-amber text-warm-950'
                            : 'bg-warm-700 text-cream-muted hover:text-cream border border-warm-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-warm-700 hover:bg-warm-600 text-cream transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="text-cream w-6 text-center font-medium">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-warm-700 hover:bg-warm-600 text-cream transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-right min-w-[70px]">
                  <p className="text-amber font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                  <p className="text-warm-500 text-xs">${item.price} each</p>
                </div>
                <button onClick={() => remove(item.id)} className="text-warm-500 hover:text-red-400 transition-colors p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* Address */}
            <div className="bg-warm-800 border border-warm-700 rounded-2xl p-6 mt-6">
              <h3 className="font-display text-lg text-cream mb-4">Delivery Address</h3>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                className="w-full bg-warm-700 border border-warm-600 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-warm-900 border border-warm-700 rounded-2xl p-6 sticky top-24">
              <h3 className="font-display text-xl text-cream mb-6">Order Summary</h3>
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-cream-muted">{item.name} ×{item.qty}</span>
                    <span className="text-cream">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-warm-700 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-cream-muted">Subtotal</span>
                  <span className="text-cream">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cream-muted">Delivery fee</span>
                  <span className="text-cream">${deliveryFee.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-cream font-semibold">Total</span>
                <span className="text-amber text-2xl font-semibold font-display">${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
                {!loading && <ArrowRight size={16} />}
              </button>

              {!user && (
                <p className="text-center text-cream-muted text-xs mt-3">
                  You need to{' '}
                  <Link to="/login" className="text-amber hover:text-amber-light">login</Link>
                  {' '}to place an order
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}