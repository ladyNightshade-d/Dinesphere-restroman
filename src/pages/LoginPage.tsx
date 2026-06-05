import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="min-h-screen flex bg-warm-950">
      {/* Left — Image */}
      <div className="w-1/2 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Elegant dining"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-950/70 to-warm-950/30" />
        <div className="absolute bottom-12 left-10 right-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-amber rounded-full flex items-center justify-center">
              <UtensilsCrossed size={15} className="text-warm-950" />
            </div>
            <span className="font-display text-xl text-cream font-semibold">DineSphere</span>
          </div>
          <p className="font-display text-3xl text-cream italic leading-snug">
            "Every meal is a story<br />waiting to unfold."
          </p>
          <p className="text-cream-muted text-sm mt-3">Sign back in to continue your experience</p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-1/2 flex items-center justify-center px-16 bg-warm-900">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <p className="text-amber text-xs font-medium tracking-[0.3em] uppercase mb-3">Welcome Back</p>
            <h1 className="font-display text-4xl text-cream font-semibold">Sign In</h1>
            <p className="text-cream-muted mt-2 text-sm">We've kept your table warm</p>
          </div>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 py-3 border border-warm-700 rounded-xl text-cream-muted hover:text-cream hover:border-warm-600 transition-all duration-200 mb-6 text-sm font-medium">
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-warm-700" />
            <span className="text-warm-500 text-xs">or sign in with email</span>
            <div className="flex-1 h-px bg-warm-700" />
          </div>

          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Email Address</label>
              <input
                type="email"
                placeholder="james@example.com"
                className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Your password"
                  className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 pr-11 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-500 hover:text-cream-muted transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-amber text-xs hover:text-amber-light transition-colors">
                Forgot password?
              </button>
            </div>
            <Link
              to="/discover"
              className="block w-full text-center py-3.5 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl transition-colors duration-200"
            >
              Welcome Back
            </Link>
          </form>

          <p className="text-center text-cream-muted text-sm mt-6">
            New to DineSphere?{' '}
            <Link to="/signup" className="text-amber hover:text-amber-light transition-colors font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
