import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed,
  LayoutDashboard,
  ClipboardList,
  ChefHat,
  Package,
  Calendar,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Orders', to: '/admin/orders', icon: ClipboardList },
  { label: 'Menu Management', to: '/admin/menu', icon: ChefHat },
  { label: 'Inventory', to: '/admin/inventory', icon: Package },
  { label: 'Staff Schedule', to: '/admin/staff', icon: Calendar },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-warm-900 border-r border-warm-700 flex flex-col z-40">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-warm-700">
        <div className="w-8 h-8 bg-amber rounded-full flex items-center justify-center flex-shrink-0">
          <UtensilsCrossed size={15} className="text-warm-950" />
        </div>
        <span className="font-display text-lg font-semibold text-cream">DineSphere</span>
      </div>

      <nav className="flex-1 py-6 px-4 overflow-y-auto space-y-1">
        {navItems.map(({ label, to, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-amber/10 text-amber border border-amber/20'
                  : 'text-cream-muted hover:text-cream hover:bg-warm-750'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-warm-700">
        <Link to="/admin/login" onClick={logout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-cream-muted hover:text-cream hover:bg-warm-750 transition-all duration-200">
          <LogOut size={17} />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
