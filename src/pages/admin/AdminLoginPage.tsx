import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="min-h-screen flex bg-warm-950">
      {/* Left */}
      <div className="w-1/2 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/2403392/pexels-photo-2403392.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Chef cooking"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-950/75 to-warm-950/40" />
        <div className="absolute bottom-12 left-10 right-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-amber rounded-full flex items-center justify-center">
              <ShieldCheck size={15} className="text-warm-950" />
            </div>
            <span className="font-display text-xl text-cream font-semibold">DineSphere</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-amber/20 text-amber text-xs font-semibold border border-amber/30">Admin</span>
          </div>
          <p className="font-display text-3xl text-cream italic leading-snug">
            "Command your kitchen.<br />Curate the experience."
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="w-1/2 flex items-center justify-center px-16 bg-warm-900">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-amber/10 text-amber text-xs font-semibold border border-amber/20 flex items-center gap-1.5">
                <ShieldCheck size={12} />
                Admin Portal
              </span>
            </div>
            <h1 className="font-display text-4xl text-cream font-semibold">Admin Login</h1>
            <p className="text-cream-muted mt-2 text-sm">Access your restaurant management dashboard</p>
          </div>

          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Email Address</label>
              <input type="email" placeholder="admin@restaurant.com" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
            </div>
            <div>
              <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} placeholder="Your password" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 pr-11 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-500 hover:text-cream-muted transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Link
              to="/admin/dashboard"
              className="block w-full text-center py-3.5 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl transition-colors duration-200 mt-2"
            >
              Admin Login
            </Link>
          </form>

          <p className="text-center text-cream-muted text-sm mt-6">
            New admin?{' '}
            <Link to="/admin/signup" className="text-amber hover:text-amber-light transition-colors font-medium">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
