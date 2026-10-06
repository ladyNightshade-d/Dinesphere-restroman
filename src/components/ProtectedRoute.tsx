import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Array<'customer' | 'admin' | 'kitchen'>;
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) {
    if (roles?.includes('admin')) return <Navigate to="/admin/login" replace />;
    if (roles?.includes('kitchen')) return <Navigate to="/kitchen/login" replace />;
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'kitchen') return <Navigate to="/kitchen/kds" replace />;
    return <Navigate to="/discover" replace />;
  }

  return children;
}
