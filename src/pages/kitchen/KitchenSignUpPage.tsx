import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ChefHat } from 'lucide-react';

const stations = ['Grill', 'Pastry', 'Beverages', 'Cold Kitchen', 'Hot Kitchen', 'Expediting'];

export default function KitchenSignUpPage() {
  const [showPw, setShowPw] = useState(false);
  const [station, setStation] = useState('');

  return (
    <div className="min-h-screen flex bg-warm-950">
      {/* Left */}
      <div className="w-1/2 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Kitchen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-950/80 to-warm-950/40" />
        <div className="absolute bottom-12 left-10 right-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-amber rounded-full flex items-center justify-center">
              <ChefHat size={15} className="text-warm-950" />
            </div>
            <span className="font-display text-xl text-cream font-semibold">DineSphere</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-900/40 text-orange-300 text-xs font-semibold border border-orange-700/40">Kitchen Staff</span>
          </div>
          <p className="font-display text-3xl text-cream italic leading-snug">
            "Crafted with passion,<br />served with pride."
          </p>
          <p className="text-cream-muted text-sm mt-3">Join our brigade and make every plate extraordinary</p>
        </div>
      </div>

      {/* Right */}
      <div className="w-1/2 flex items-center justify-center px-16 bg-warm-900">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-orange-900/30 text-orange-300 text-xs font-semibold border border-orange-700/30 flex items-center gap-1.5">
                <ChefHat size={12} />
                Kitchen Staff
              </span>
            </div>
            <h1 className="font-display text-4xl text-cream font-semibold">Join Kitchen</h1>
            <p className="text-cream-muted mt-2 text-sm">Register to access the Kitchen Display System</p>
          </div>

          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Full Name</label>
              <input type="text" placeholder="Anya Patel" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
            </div>
            <div>
              <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Email Address</label>
              <input type="email" placeholder="chef@kitchen.com" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
            </div>
            <div>
              <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 pr-11 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-500 hover:text-cream-muted transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Confirm Password</label>
              <input type="password" placeholder="Repeat password" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
            </div>
            <div>
              <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Assigned Station</label>
              <div className="grid grid-cols-3 gap-2">
                {stations.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStation(s)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium transition-all border ${
                      station === s
                        ? 'bg-amber/10 text-amber border-amber/40'
                        : 'bg-warm-800 text-cream-muted hover:text-cream border-warm-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <Link
              to="/kitchen/kds"
              className="block w-full text-center py-3.5 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl transition-colors duration-200 mt-4"
            >
              Join Kitchen
            </Link>
          </form>

          <p className="text-center text-cream-muted text-sm mt-6">
            Already registered?{' '}
            <Link to="/kitchen/login" className="text-amber hover:text-amber-light transition-colors font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
