import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, ChefHat, Bike, Home, Star, LucideIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import { orderService } from '../services/order.service';
import { socketService } from '../services/socket.service';

interface StepConfig {
  label: string;
  icon: LucideIcon;
  status: string;
}

const stepConfigs: StepConfig[] = [
  { label: 'Order Placed', icon: CheckCircle2, status: 'placed' },
  { label: 'Confirmed', icon: CheckCircle2, status: 'confirmed' },
  { label: 'Being Prepared', icon: ChefHat, status: 'preparing' },
  { label: 'Quality Check', icon: Star, status: 'quality_check' },
  { label: 'Out for Delivery', icon: Bike, status: 'out_for_delivery' },
  { label: 'Delivered', icon: Home, status: 'delivered' },
];

const statusOrder = ['placed', 'confirmed', 'preparing', 'quality_check', 'out_for_delivery', 'delivered'];

export default function OrderTrackingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { orderId?: string; order?: any };

  const [order, setOrder] = useState<any>(state?.order || null);
  const [loading, setLoading] = useState(!state?.order);

  useEffect(() => {
    if (!state?.orderId) {
      navigate('/discover');
      return;
    }

    // Fetch order if not passed via state
    if (!state?.order) {
      orderService.getOrder(state.orderId).then(setOrder).finally(() => setLoading(false));
    }

    // Connect socket and join order tracking room
    socketService.connect();
    socketService.joinOrderTracking(state.orderId);

    // Listen for real-time status updates
    socketService.onOrderStatusUpdate(({ orderId, status }) => {
      if (orderId === state.orderId) {
        setOrder((prev: any) => prev ? { ...prev, status } : prev);
      }
    });

    return () => socketService.disconnect();
  }, [navigate, state?.order, state?.orderId]);

  const currentStatusIndex = statusOrder.indexOf(order?.status || 'placed');

  const getStepTime = (statusHistory: any[], status: string) => {
    const entry = statusHistory?.find((h: any) => h.status === status);
    if (!entry) return '—';
    return new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div className="bg-warm-950 min-h-screen pt-[72px] flex items-center justify-center">
      <Navbar />
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-cream-muted text-sm">Loading your order...</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="bg-warm-950 min-h-screen pt-[72px] flex items-center justify-center">
      <Navbar />
      <p className="text-cream-muted">Order not found</p>
    </div>
  );

  const subtotal = order.totalAmount || 0;
  const deliveryFee = order.deliveryFee || 4.99;

  return (
    <div className="bg-warm-950 min-h-screen pt-[72px]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-12 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-amber/10 border border-amber/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-amber" />
          </div>
          <p className="text-amber text-xs font-medium tracking-[0.3em] uppercase mb-2">Order Confirmed</p>
          <h1 className="font-display text-4xl text-cream font-semibold mb-2">
            Order #{order._id?.slice(-6).toUpperCase()}
          </h1>
          <p className="text-cream-muted">
            {order.restaurant?.name || 'Restaurant'} · Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Estimated Time Banner */}
        <div className="bg-amber/5 border border-amber/20 rounded-2xl p-6 text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock size={18} className="text-amber" />
            <span className="text-amber font-medium text-sm tracking-wide uppercase">Estimated Delivery</span>
          </div>
          <p className="font-display text-4xl text-cream font-semibold">
            {order.status === 'delivered' ? 'Delivered!' : `~${order.estimatedTime || 30} minutes`}
          </p>
          <p className="text-cream-muted text-sm mt-1">
            {order.status === 'delivered'
              ? 'Your order has been delivered'
              : 'Estimated time remaining'}
          </p>
        </div>

        <div className="flex gap-10">
          {/* Tracker */}
          <div className="flex-1 bg-warm-900 border border-warm-700 rounded-2xl p-8">
            <h2 className="font-display text-xl text-cream mb-8">Live Tracking</h2>
            <div className="relative">
              {stepConfigs.map((step, i) => {
                const Icon = step.icon;
                const isLast = i === stepConfigs.length - 1;
                const stepIndex = statusOrder.indexOf(step.status);
                const isDone = stepIndex < currentStatusIndex;
                const isActive = stepIndex === currentStatusIndex;

                return (
                  <div key={i} className="flex items-start gap-5 relative">
                    {!isLast && (
                      <div className={`absolute left-5 top-10 w-0.5 h-10 ${isDone ? 'bg-amber' : 'bg-warm-700'}`} />
                    )}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                      isDone ? 'bg-amber text-warm-950' :
                      isActive ? 'bg-amber/20 border-2 border-amber text-amber ring-4 ring-amber/10' :
                      'bg-warm-800 border border-warm-700 text-warm-500'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div className={`pb-10 flex-1 flex items-center justify-between ${isLast ? 'pb-0' : ''}`}>
                      <div>
                        <p className={`font-medium text-sm ${isDone || isActive ? 'text-cream' : 'text-warm-500'}`}>
                          {step.label}
                          {isActive && (
                            <span className="ml-2 text-amber text-xs bg-amber/10 px-2 py-0.5 rounded-full">
                              In Progress
                            </span>
                          )}
                        </p>
                      </div>
                      <span className={`text-xs ${isDone ? 'text-amber' : 'text-warm-600'}`}>
                        {getStepTime(order.statusHistory, step.status)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-warm-900 border border-warm-700 rounded-2xl p-6">
              <h3 className="font-display text-xl text-cream mb-5">Your Order</h3>
              <div className="space-y-4 mb-5">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-warm-800 flex items-center justify-center flex-shrink-0">
                      <ChefHat size={20} className="text-warm-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-cream text-sm font-medium truncate">{item.name}</p>
                      <p className="text-cream-muted text-xs">×{item.quantity} · {item.size}</p>
                    </div>
                    <span className="text-amber text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-warm-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-cream-muted">Subtotal</span>
                  <span className="text-cream">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cream-muted">Delivery</span>
                  <span className="text-cream">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-1">
                  <span className="text-cream">Total</span>
                  <span className="text-amber text-lg font-display">
                    ${(subtotal + deliveryFee).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-warm-700">
                <p className="text-xs text-cream-muted mb-1 font-medium uppercase tracking-wide">Delivering to</p>
                <p className="text-cream text-sm">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}