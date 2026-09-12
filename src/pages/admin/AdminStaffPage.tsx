import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../services/api';
import { Users } from 'lucide-react';
import { StaffMember } from '../../types/domain';

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/staff').then(res => setStaff(res.data.staff || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex bg-warm-950 min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1">
        <div className="sticky top-0 z-30 bg-warm-950/95 backdrop-blur border-b border-warm-700 px-8 py-4">
          <h1 className="font-display text-2xl text-cream font-semibold">Kitchen Staff</h1>
          <p className="text-cream-muted text-xs mt-0.5">{staff.length} staff members</p>
        </div>

        <div className="px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-24">
              <Users size={40} className="text-warm-600 mx-auto mb-4" />
              <p className="text-cream-muted">No kitchen staff registered yet</p>
              <p className="text-warm-500 text-sm mt-1">Staff will appear here when they sign up via the Kitchen portal</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {staff.map(s => (
                <div key={s._id} className="bg-warm-900 border border-warm-700 rounded-2xl p-6 hover:border-amber/30 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber/20 border border-amber/30 flex items-center justify-center">
                      <span className="text-amber font-bold text-lg">{s.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-cream font-medium">{s.name}</p>
                      <p className="text-cream-muted text-xs">{s.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-cream-muted">Station</span>
                      <span className="text-cream font-medium">{s.assignedStation || 'General'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-cream-muted">Role</span>
                      <span className="text-cream font-medium capitalize">{s.role}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-cream-muted">Status</span>
                      <span className="text-green-400 font-medium text-xs bg-green-900/30 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}