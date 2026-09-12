import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import DiscoverPage from './pages/DiscoverPage';
import RestaurantMenuPage from './pages/RestaurantMenuPage';
import CartPage from './pages/CartPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ReservationPage from './pages/ReservationPage';
import AdminSignUpPage from './pages/admin/AdminSignUpPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import KitchenSignUpPage from './pages/kitchen/KitchenSignUpPage';
import KitchenLoginPage from './pages/kitchen/KitchenLoginPage';
import KitchenDisplayScreen from './pages/kitchen/KitchenDisplayScreen';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminStaffPage from './pages/admin/AdminStaffPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Flow */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/restaurant/:id" element={<RestaurantMenuPage />} />
        <Route path="/restaurant/:id/reserve" element={<ReservationPage />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/order-tracking" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />

        {/* Admin Flow */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/signup" element={<AdminSignUpPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrdersPage /></ProtectedRoute>} />
        <Route path="/admin/menu" element={<ProtectedRoute roles={['admin']}><AdminMenuPage /></ProtectedRoute>} />
        <Route path="/admin/inventory" element={<ProtectedRoute roles={['admin']}><AdminInventoryPage /></ProtectedRoute>} />
        <Route path="/admin/staff" element={<ProtectedRoute roles={['admin']}><AdminStaffPage /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><AdminSettingsPage /></ProtectedRoute>} />

        {/* Kitchen Flow */}
        <Route path="/kitchen" element={<Navigate to="/kitchen/login" replace />} />
        <Route path="/kitchen/signup" element={<KitchenSignUpPage />} />
        <Route path="/kitchen/login" element={<KitchenLoginPage />} />
        <Route path="/kitchen/kds" element={<ProtectedRoute roles={['kitchen', 'admin']}><KitchenDisplayScreen /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
