import { CheckCircle2, Circle, Clock, Package, ChefHat, Bike, Home, Star } from 'lucide-react';
import Navbar from '../components/Navbar';

const steps = [
  { label: 'Order Placed', icon: CheckCircle2, time: '7:42 PM', done: true },
  { label: 'Confirmed', icon: CheckCircle2, time: '7:43 PM', done: true },
  { label: 'Being Prepared', icon: ChefHat, time: '7:50 PM', done: true },
  { label: 'Quality Check', icon: Star, time: '8:05 PM', done: false, active: true },
  { label: 'Out for Delivery', icon: Bike, time: '—', done: false },
  { label: 'Delivered', icon: Home, time: '—', done: false },
];

const orderedItems = [
  { name: 'Wagyu Ribeye', qty: 1, price: '$89.00', image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Seared Scallops', qty: 2, price: '$48.00', image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Valrhona Fondant', qty: 1, price: '$16.00', image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=200' },
];

export default function OrderTrackingPage() {
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
          <h1 className="font-display text-4xl text-cream font-semibold mb-2">Order #DS-4821</h1>
          <p className="text-cream-muted">Ember & Oak · Placed at 7:42 PM today</p>
        </div>

        {/* Estimated Time Banner */}
        <div className="bg-amber/5 border border-amber/20 rounded-2xl p-6 text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock size={18} className="text-amber" />
            <span className="text-amber font-medium text-sm tracking-wide uppercase">Estimated Delivery</span>
          </div>
          <p className="font-display text-4xl text-cream font-semibold">8:25 – 8:35 PM</p>
          <p className="text-cream-muted text-sm mt-1">Approx. 25 – 35 minutes remaining</p>
        </div>

        <div className="flex gap-10">
          {/* Tracker */}
          <div className="flex-1 bg-warm-900 border border-warm-700 rounded-2xl p-8">
            <h2 className="font-display text-xl text-cream mb-8">Live Tracking</h2>
            <div className="relative">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isLast = i === steps.length - 1;
                const active = (step as any).active;
                return (
                  <div key={i} className="flex items-start gap-5 relative">
                    {/* Line */}
                    {!isLast && (
                      <div className={`absolute left-5 top-10 w-0.5 h-10 ${step.done ? 'bg-amber' : 'bg-warm-700'}`} />
                    )}
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                      step.done ? 'bg-amber text-warm-950' :
                      active ? 'bg-amber/20 border-2 border-amber text-amber ring-4 ring-amber/10' :
                      'bg-warm-800 border border-warm-700 text-warm-500'
                    }`}>
                      <Icon size={18} />
                    </div>
                    {/* Label */}
                    <div className={`pb-10 flex-1 flex items-center justify-between ${isLast ? 'pb-0' : ''}`}>
                      <div>
                        <p className={`font-medium text-sm ${step.done || active ? 'text-cream' : 'text-warm-500'}`}>
                          {step.label}
                          {active && <span className="ml-2 text-amber text-xs bg-amber/10 px-2 py-0.5 rounded-full">In Progress</span>}
                        </p>
                      </div>
                      <span className={`text-xs ${step.done ? 'text-amber' : 'text-warm-600'}`}>{step.time}</span>
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
                {orderedItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-cream text-sm font-medium truncate">{item.name}</p>
                      <p className="text-cream-muted text-xs">×{item.qty}</p>
                    </div>
                    <span className="text-amber text-sm font-medium">{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-warm-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-cream-muted">Subtotal</span>
                  <span className="text-cream">$153.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cream-muted">Delivery</span>
                  <span className="text-cream">$4.99</span>
                </div>
                <div className="flex justify-between font-semibold pt-1">
                  <span className="text-cream">Total</span>
                  <span className="text-amber text-lg font-display">$157.99</span>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-warm-700">
                <p className="text-xs text-cream-muted mb-1 font-medium uppercase tracking-wide">Delivering to</p>
                <p className="text-cream text-sm">24 Harrington St, Apt 3B</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
