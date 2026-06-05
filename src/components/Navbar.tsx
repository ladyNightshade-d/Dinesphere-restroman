import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, LogIn, ChevronDown, ShieldCheck, ChefHat } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();
  const [portalOpen, setPortalOpen] = useState(false);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Discover', to: '/discover' },
    { label: 'Login', to: '/login', icon: LogIn },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4 bg-warm-900/90 backdrop-blur-md border-b border-warm-700">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-amber rounded-full flex items-center justify-center">
          <UtensilsCrossed size={16} className="text-warm-950" />
        </div>
        <span className="font-display text-xl font-semibold text-cream tracking-wide">DineSphere</span>
      </Link>

      <div className="flex items-center gap-8">
        {navLinks.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
              pathname === to ? 'text-amber' : 'text-cream-muted hover:text-cream'
            }`}
          >
            {Icon && <Icon size={14} />}
            {label}
          </Link>
        ))}

        {/* Portals dropdown */}
        <div className="relative">
          <button
            onClick={() => setPortalOpen(o => !o)}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${portalOpen ? 'text-amber' : 'text-cream-muted hover:text-cream'}`}
          >
            Portals
            <ChevronDown size={14} className={`transition-transform duration-200 ${portalOpen ? 'rotate-180' : ''}`} />
          </button>
          {portalOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setPortalOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-warm-900 border border-warm-700 rounded-xl shadow-2xl shadow-warm-950/60 overflow-hidden z-20">
                <div className="px-3 py-2 border-b border-warm-700">
                  <p className="text-warm-500 text-xs font-medium uppercase tracking-widest">Staff Portals</p>
                </div>
                <Link
                  to="/admin/login"
                  onClick={() => setPortalOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-warm-750 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber/10 flex items-center justify-center group-hover:bg-amber/20 transition-colors">
                    <ShieldCheck size={14} className="text-amber" />
                  </div>
                  <div>
                    <p className="text-cream text-sm font-medium">Admin Portal</p>
                    <p className="text-warm-500 text-xs">Restaurant management</p>
                  </div>
                </Link>
                <Link
                  to="/kitchen/login"
                  onClick={() => setPortalOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-warm-750 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-900/30 flex items-center justify-center group-hover:bg-orange-900/50 transition-colors">
                    <ChefHat size={14} className="text-orange-300" />
                  </div>
                  <div>
                    <p className="text-cream text-sm font-medium">Kitchen Portal</p>
                    <p className="text-warm-500 text-xs">Kitchen Display System</p>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>

        <Link
          to="/signup"
          className="px-5 py-2 bg-amber hover:bg-amber-hover text-warm-950 text-sm font-semibold rounded-full transition-colors duration-200"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
