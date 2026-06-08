import React from 'react';
import { useState, useEffect } from 'react';
import {
  User, Building2, Bell, CreditCard, Shield, Globe,
  ChefHat, Printer, Palette, Clock, Save,
  Eye, EyeOff, Check, AlertTriangle, Mail, Phone,
  MapPin, Link as LinkIcon
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-warm-900 border border-warm-700 rounded-2xl overflow-hidden">{children}</div>;
}

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="px-6 sm:px-8 py-5 border-b border-warm-700 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-amber" />
      </div>
      <div>
        <h3 className="text-cream font-display text-lg font-semibold">{title}</h3>
        <p className="text-cream-muted text-sm mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">{label}</label>
      {children}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-2.5 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />;
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-2.5 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm resize-none" />;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-warm-700/40 last:border-0">
      <span className="text-cream-muted text-sm">{label}</span>
      <button type="button" onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-amber' : 'bg-warm-700'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

function SaveButton({ saved, onClick }: { saved: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${saved ? 'bg-green-800/50 text-green-300 border border-green-700' : 'bg-amber hover:bg-amber-hover text-warm-950'}`}>
      {saved ? <Check size={15} /> : <Save size={15} />}
      {saved ? 'Saved!' : 'Save Changes'}
    </button>
  );
}

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'restaurant', label: 'Restaurant', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'operations', label: 'Operations', icon: ChefHat },
  { id: 'printing', label: 'Printing', icon: Printer },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileRole, setProfileRole] = useState('Administrator');
  const [profileBio, setProfileBio] = useState('');

  // Restaurant state
  const [restName, setRestName] = useState('');
  const [restDesc, setRestDesc] = useState('');
  const [restAddress, setRestAddress] = useState('');
  const [restPhone, setRestPhone] = useState('');
  const [restEmail, setRestEmail] = useState('');
  const [restWebsite, setRestWebsite] = useState('');
  const [restCuisine, setRestCuisine] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [capacity, setCapacity] = useState('120');
  const [tables, setTables] = useState('18');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFa, setTwoFa] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('60');

  // Notification toggles
  const [notifs, setNotifs] = useState({
    newOrder: true, orderReady: true, lowInventory: true,
    newReservation: true, reservationCancel: false, dailyReport: true,
    weeklyReport: true, staffAlert: false, emailNotifs: true,
    smsNotifs: false, pushNotifs: true,
  });

  // Operations state
  const [taxRate, setTaxRate] = useState('8.875');
  const [serviceCharge, setServiceCharge] = useState('18');
  const [currency, setCurrency] = useState('USD');
  const [orderPrefix, setOrderPrefix] = useState('DS');
  const [maxParty, setMaxParty] = useState('12');
  const [reserveWindow, setReserveWindow] = useState('30');
  const [prepTime, setPrepTime] = useState('25');
  const [ops, setOps] = useState({
    autoConfirmReservations: false, allowWalkIns: true, onlineOrdering: true,
    tableService: true, takeaway: true, delivery: false,
  });

  // Printing
  const [printerIp, setPrinterIp] = useState('192.168.1.50');
  const [ticketCopies, setTicketCopies] = useState('2');
  const [receiptFooter, setReceiptFooter] = useState('Thank you for dining with us!');
  const [printing, setPrinting] = useState({
    autoPrintKds: true, printCustomerReceipt: true, printKitchenTicket: true,
    showPrices: false, logo: true,
  });

  // Appearance
  const [accentColor, setAccentColor] = useState('#D97706');
  const [fontSize, setFontSize] = useState('medium');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Africa/Kigali');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  // Load restaurant data on mount
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await API.get('/restaurants');
        const myRestaurant = res.data.restaurants.find(
          (r: any) => r.owner === user?.id || r.owner?._id === user?.id
        ) || res.data.restaurants[0];
        if (myRestaurant) {
          setRestaurantId(myRestaurant._id);
          setRestName(myRestaurant.name || '');
          setRestDesc(myRestaurant.description || '');
          setRestAddress(myRestaurant.address || '');
          setRestPhone(myRestaurant.phone || '');
          setRestEmail(myRestaurant.email || '');
          setRestCuisine(myRestaurant.cuisine?.join(', ') || '');
          setCoverImage(myRestaurant.images?.[0] || '');
          if (myRestaurant.openingHours?.[0]) {
            setOpenTime(myRestaurant.openingHours[0].open || '09:00');
            setCloseTime(myRestaurant.openingHours[0].close || '22:00');
          }
        }
      } catch (err) {
        console.error('Failed to load restaurant', err);
      }
    };
    if (user?.id) fetchRestaurant();
  }, [user]);

  const showSaved = (section: string) => {
    setSaved(section);
    setTimeout(() => setSaved(null), 2500);
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  };

  const saveRestaurant = async () => {
    try {
      await API.put(`/restaurants/${restaurantId}`, {
        name: restName,
        description: restDesc,
        address: restAddress,
        phone: restPhone,
        email: restEmail,
        cuisine: restCuisine.split(',').map(c => c.trim()).filter(Boolean),
        images: coverImage ? [coverImage] : [],
        openingHours: [{ day: 'All', open: openTime, close: closeTime, closed: false }],
      });
      showSaved('restaurant');
      showSuccess('Restaurant details updated successfully!');
    } catch (err) {
      showError('Failed to save restaurant details');
    }
  };

  const saveHours = async () => {
    try {
      await API.put(`/restaurants/${restaurantId}`, {
        openingHours: [{ day: 'All', open: openTime, close: closeTime, closed: false }],
      });
      showSaved('hours');
      showSuccess('Hours updated!');
    } catch (err) {
      showError('Failed to save hours');
    }
  };

  const saveCoverImage = async () => {
    try {
      await API.put(`/restaurants/${restaurantId}`, {
        images: coverImage ? [coverImage] : [],
      });
      showSaved('cover');
      showSuccess('Cover image updated!');
    } catch (err) {
      showError('Failed to update cover image');
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      showError('Please fill all password fields');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }
    try {
      await API.post('/auth/change-password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      showSaved('password');
      showSuccess('Password updated successfully!');
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const toggleNotif = (key: keyof typeof notifs) => setNotifs(n => ({ ...n, [key]: !n[key] }));
  const toggleOps = (key: keyof typeof ops) => setOps(o => ({ ...o, [key]: !o[key] }));
  const togglePrinting = (key: keyof typeof printing) => setPrinting(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="flex bg-warm-950 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 min-h-screen lg:ml-64">
        <div className="sticky top-0 z-20 bg-warm-950/95 backdrop-blur border-b border-warm-700 px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="font-display text-xl sm:text-2xl text-cream font-semibold">Settings</h1>
          <p className="text-cream-muted text-xs mt-0.5">Manage your account, restaurant, and preferences</p>
        </div>

        {/* Global messages */}
        {error && <div className="mx-8 mt-4 p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-400 text-sm">{error}</div>}
        {success && <div className="mx-8 mt-4 p-3 bg-green-900/30 border border-green-700 rounded-xl text-green-400 text-sm">{success}</div>}

        <div className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-73px)]">
          <aside className="lg:w-56 xl:w-64 bg-warm-900 border-b lg:border-b-0 lg:border-r border-warm-700 flex-shrink-0">
            <nav className="p-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex-shrink-0 lg:flex-shrink whitespace-nowrap ${
                    activeTab === id ? 'bg-amber/10 text-amber border border-amber/20' : 'text-cream-muted hover:text-cream hover:bg-warm-750'
                  }`}>
                  <Icon size={16} />
                  <span className="hidden sm:inline lg:inline">{label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-auto">

            {/* PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-2xl">
                <SectionCard>
                  <SectionHeader icon={User} title="Personal Information" description="Your account details" />
                  <div className="px-6 sm:px-8 py-6 space-y-5">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber bg-amber/20 flex items-center justify-center">
                        <span className="text-amber font-bold text-3xl">{user?.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-cream font-medium">{user?.name}</p>
                        <p className="text-cream-muted text-sm">{user?.email}</p>
                        <p className="text-amber text-xs capitalize mt-1">{user?.role}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Full Name">
                        <Input value={profileName} onChange={e => setProfileName(e.target.value)} />
                      </Field>
                      <Field label="Role / Title">
                        <Input value={profileRole} onChange={e => setProfileRole(e.target.value)} />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Email Address">
                        <div className="relative">
                          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-500" />
                          <input value={profileEmail} onChange={e => setProfileEmail(e.target.value)} className="w-full bg-warm-800 border border-warm-700 rounded-xl pl-9 pr-4 py-2.5 text-cream focus:outline-none focus:border-amber transition-colors text-sm" />
                        </div>
                      </Field>
                      <Field label="Phone Number">
                        <div className="relative">
                          <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-500" />
                          <input value={profilePhone} onChange={e => setProfilePhone(e.target.value)} className="w-full bg-warm-800 border border-warm-700 rounded-xl pl-9 pr-4 py-2.5 text-cream focus:outline-none focus:border-amber transition-colors text-sm" />
                        </div>
                      </Field>
                    </div>
                    <Field label="Bio">
                      <Textarea rows={3} value={profileBio} onChange={e => setProfileBio(e.target.value)} placeholder="Tell us about yourself..." />
                    </Field>
                    <div className="flex justify-end pt-2">
                      <SaveButton saved={saved === 'profile'} onClick={() => showSaved('profile')} />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard>
                  <SectionHeader icon={Globe} title="Preferences" description="Language, timezone and display settings" />
                  <div className="px-6 sm:px-8 py-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Language">
                        <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-2.5 text-cream focus:outline-none focus:border-amber transition-colors text-sm">
                          <option value="en">English</option>
                          <option value="fr">French</option>
                          <option value="rw">Kinyarwanda</option>
                        </select>
                      </Field>
                      <Field label="Timezone">
                        <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-2.5 text-cream focus:outline-none focus:border-amber transition-colors text-sm">
                          <option value="Africa/Kigali">Kigali (CAT)</option>
                          <option value="Europe/London">London (GMT)</option>
                          <option value="America/New_York">New York (ET)</option>
                        </select>
                      </Field>
                    </div>
                    <Field label="Date Format">
                      <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-2.5 text-cream focus:outline-none focus:border-amber transition-colors text-sm">
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </Field>
                    <div className="flex justify-end pt-2">
                      <SaveButton saved={saved === 'prefs'} onClick={() => showSaved('prefs')} />
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* RESTAURANT */}
            {activeTab === 'restaurant' && (
              <div className="space-y-6 max-w-2xl">
                <SectionCard>
                  <SectionHeader icon={Building2} title="Restaurant Details" description="Update your restaurant's public information" />
                  <div className="px-6 sm:px-8 py-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Restaurant Name">
                        <Input value={restName} onChange={e => setRestName(e.target.value)} />
                      </Field>
                      <Field label="Cuisine Types (comma separated)">
                        <Input value={restCuisine} onChange={e => setRestCuisine(e.target.value)} placeholder="French, Italian" />
                      </Field>
                    </div>
                    <Field label="Description">
                      <Textarea rows={4} value={restDesc} onChange={e => setRestDesc(e.target.value)} />
                    </Field>
                    <Field label="Cover Image URL">
                      <Input value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://images.pexels.com/..." />
                      {coverImage && <img src={coverImage} alt="Cover preview" className="mt-2 w-full h-32 object-cover rounded-xl border border-warm-600" />}
                      <div className="flex justify-end mt-2">
                        <button onClick={saveCoverImage} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${saved === 'cover' ? 'bg-green-800/50 text-green-300' : 'bg-amber/10 text-amber hover:bg-amber border border-amber/30 hover:text-warm-950'}`}>
                          {saved === 'cover' ? <><Check size={12} /> Saved!</> : <><Save size={12} /> Save Cover</>}
                        </button>
                      </div>
                    </Field>
                    <Field label="Full Address">
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-500" />
                        <input value={restAddress} onChange={e => setRestAddress(e.target.value)} className="w-full bg-warm-800 border border-warm-700 rounded-xl pl-9 pr-4 py-2.5 text-cream focus:outline-none focus:border-amber transition-colors text-sm" />
                      </div>
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Contact Phone">
                        <div className="relative">
                          <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-500" />
                          <input value={restPhone} onChange={e => setRestPhone(e.target.value)} className="w-full bg-warm-800 border border-warm-700 rounded-xl pl-9 pr-4 py-2.5 text-cream focus:outline-none focus:border-amber transition-colors text-sm" />
                        </div>
                      </Field>
                      <Field label="Contact Email">
                        <div className="relative">
                          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-500" />
                          <input value={restEmail} onChange={e => setRestEmail(e.target.value)} className="w-full bg-warm-800 border border-warm-700 rounded-xl pl-9 pr-4 py-2.5 text-cream focus:outline-none focus:border-amber transition-colors text-sm" />
                        </div>
                      </Field>
                    </div>
                    <Field label="Website">
                      <div className="relative">
                        <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-500" />
                        <input value={restWebsite} onChange={e => setRestWebsite(e.target.value)} className="w-full bg-warm-800 border border-warm-700 rounded-xl pl-9 pr-4 py-2.5 text-cream focus:outline-none focus:border-amber transition-colors text-sm" />
                      </div>
                    </Field>
                    <div className="flex justify-end pt-2">
                      <SaveButton saved={saved === 'restaurant'} onClick={saveRestaurant} />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard>
                  <SectionHeader icon={Clock} title="Hours & Capacity" description="Operating hours and seating configuration" />
                  <div className="px-6 sm:px-8 py-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Opening Time">
                        <Input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} />
                      </Field>
                      <Field label="Closing Time">
                        <Input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Total Capacity (seats)">
                        <Input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} min="1" />
                      </Field>
                      <Field label="Number of Tables">
                        <Input type="number" value={tables} onChange={e => setTables(e.target.value)} min="1" />
                      </Field>
                    </div>
                    <div className="flex justify-end pt-2">
                      <SaveButton saved={saved === 'hours'} onClick={saveHours} />
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 max-w-2xl">
                <SectionCard>
                  <SectionHeader icon={Bell} title="Order Notifications" description="Get alerted about order activity" />
                  <div className="px-6 sm:px-8 py-4">
                    <Toggle checked={notifs.newOrder} onChange={() => toggleNotif('newOrder')} label="New order placed" />
                    <Toggle checked={notifs.orderReady} onChange={() => toggleNotif('orderReady')} label="Order marked as ready in KDS" />
                    <Toggle checked={notifs.lowInventory} onChange={() => toggleNotif('lowInventory')} label="Low inventory alert" />
                  </div>
                </SectionCard>
                <SectionCard>
                  <SectionHeader icon={Bell} title="Reservation Notifications" description="Stay informed about table bookings" />
                  <div className="px-6 sm:px-8 py-4">
                    <Toggle checked={notifs.newReservation} onChange={() => toggleNotif('newReservation')} label="New reservation made" />
                    <Toggle checked={notifs.reservationCancel} onChange={() => toggleNotif('reservationCancel')} label="Reservation cancelled" />
                    <Toggle checked={notifs.staffAlert} onChange={() => toggleNotif('staffAlert')} label="Staff schedule changes" />
                  </div>
                </SectionCard>
                <SectionCard>
                  <SectionHeader icon={Bell} title="Delivery Channels" description="How you'd like to receive notifications" />
                  <div className="px-6 sm:px-8 py-4">
                    <Toggle checked={notifs.emailNotifs} onChange={() => toggleNotif('emailNotifs')} label="Email notifications" />
                    <Toggle checked={notifs.smsNotifs} onChange={() => toggleNotif('smsNotifs')} label="SMS / text messages" />
                    <Toggle checked={notifs.pushNotifs} onChange={() => toggleNotif('pushNotifs')} label="Push notifications (browser)" />
                  </div>
                  <div className="px-6 sm:px-8 pb-5">
                    <div className="flex justify-end pt-2">
                      <SaveButton saved={saved === 'notifs'} onClick={() => showSaved('notifs')} />
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* BILLING */}
            {activeTab === 'billing' && (
              <div className="space-y-6 max-w-2xl">
                <SectionCard>
                  <SectionHeader icon={CreditCard} title="Current Plan" description="Your DineSphere subscription" />
                  <div className="px-6 sm:px-8 py-6">
                    <div className="bg-amber/5 border border-amber/20 rounded-xl p-5 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-amber font-display text-xl font-semibold">Free Plan</span>
                          <span className="px-2 py-0.5 bg-amber/10 text-amber text-xs rounded-full font-medium border border-amber/20">Active</span>
                        </div>
                        <p className="text-cream-muted text-sm">Basic orders · KDS access · Standard analytics</p>
                        <p className="text-warm-500 text-xs mt-2">Upgrade for advanced features</p>
                      </div>
                      <button className="flex-shrink-0 px-4 py-2 border border-amber/30 bg-amber/10 text-amber rounded-xl text-sm font-medium hover:bg-amber hover:text-warm-950 transition-colors">
                        Upgrade
                      </button>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-2xl">
                <SectionCard>
                  <SectionHeader icon={Shield} title="Change Password" description="Update your admin account password" />
                  <div className="px-6 sm:px-8 py-6 space-y-4">
                    <Field label="Current Password">
                      <div className="relative">
                        <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Your current password" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-2.5 pr-11 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-500">
                          {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </Field>
                    <Field label="New Password">
                      <div className="relative">
                        <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-2.5 pr-11 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-500">
                          {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </Field>
                    <Field label="Confirm New Password">
                      <div className="relative">
                        <input type={showConfirm ? 'text' : 'password'} value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} placeholder="Repeat new password" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-2.5 pr-11 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-500">
                          {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </Field>
                    <div className="flex justify-end pt-1">
                      <button onClick={changePassword} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved === 'password' ? 'bg-green-800/50 text-green-300 border border-green-700' : 'bg-amber hover:bg-amber-hover text-warm-950'}`}>
                        {saved === 'password' ? <><Check size={15} /> Updated!</> : <><Save size={15} /> Update Password</>}
                      </button>
                    </div>
                  </div>
                </SectionCard>
                <SectionCard>
                  <SectionHeader icon={Shield} title="Two-Factor Authentication" description="Add an extra layer of security" />
                  <div className="px-6 sm:px-8 py-6">
                    <div className="flex items-start justify-between gap-4 p-4 bg-warm-800 border border-warm-700 rounded-xl">
                      <div>
                        <p className="text-cream text-sm font-medium mb-0.5">Authenticator App</p>
                        <p className="text-cream-muted text-xs">Use Google Authenticator to generate one-time codes</p>
                        {twoFa && <p className="text-green-400 text-xs mt-1 flex items-center gap-1"><Check size={11} /> Enabled</p>}
                      </div>
                      <button onClick={() => setTwoFa(!twoFa)} className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${twoFa ? 'border-red-700 text-red-400 hover:bg-red-900/20' : 'bg-amber/10 border-amber/30 text-amber hover:bg-amber/20'}`}>
                        {twoFa ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                    <div className="mt-4">
                      <Field label="Session Timeout">
                        <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-2.5 text-cream focus:outline-none focus:border-amber transition-colors text-sm">
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                          <option value="0">Never</option>
                        </select>
                      </Field>
                    </div>
                  </div>
                </SectionCard>
                <SectionCard>
                  <SectionHeader icon={AlertTriangle} title="Danger Zone" description="Irreversible account actions" />
                  <div className="px-6 sm:px-8 py-6">
                    <div className="flex items-center justify-between p-4 border border-red-900/40 rounded-xl bg-red-950/20">
                      <div>
                        <p className="text-cream text-sm font-medium">Delete Admin Account</p>
                        <p className="text-warm-500 text-xs mt-0.5">Permanently delete your account and all data</p>
                      </div>
                      <button className="flex-shrink-0 px-4 py-2 border border-red-700/50 text-red-400 hover:bg-red-900/30 rounded-xl text-sm font-semibold transition-colors">Delete</button>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* OPERATIONS */}
            {activeTab === 'operations' && (
              <div className="space-y-6 max-w-2xl">
                <SectionCard>
                  <SectionHeader icon={ChefHat} title="Pricing & Tax" description="Financial configuration" />
                  <div className="px-6 sm:px-8 py-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="Tax Rate (%)"><Input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} /></Field>
                      <Field label="Service Charge (%)"><Input type="number" value={serviceCharge} onChange={e => setServiceCharge(e.target.value)} /></Field>
                      <Field label="Currency">
                        <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-2.5 text-cream focus:outline-none focus:border-amber transition-colors text-sm">
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="RWF">RWF (Fr)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </Field>
                    </div>
                    <Field label="Order ID Prefix"><Input value={orderPrefix} onChange={e => setOrderPrefix(e.target.value)} placeholder="DS" maxLength={5} /></Field>
                  </div>
                </SectionCard>
                <SectionCard>
                  <SectionHeader icon={ChefHat} title="Reservations & Orders" description="Configure booking and ordering" />
                  <div className="px-6 sm:px-8 py-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="Max Party Size"><Input type="number" value={maxParty} onChange={e => setMaxParty(e.target.value)} min="1" /></Field>
                      <Field label="Booking Window (days)"><Input type="number" value={reserveWindow} onChange={e => setReserveWindow(e.target.value)} min="1" /></Field>
                      <Field label="Avg Prep Time (mins)"><Input type="number" value={prepTime} onChange={e => setPrepTime(e.target.value)} min="1" /></Field>
                    </div>
                    <div className="pt-2">
                      <Toggle checked={ops.autoConfirmReservations} onChange={() => toggleOps('autoConfirmReservations')} label="Auto-confirm reservations" />
                      <Toggle checked={ops.allowWalkIns} onChange={() => toggleOps('allowWalkIns')} label="Allow walk-in guests" />
                      <Toggle checked={ops.onlineOrdering} onChange={() => toggleOps('onlineOrdering')} label="Enable online ordering" />
                      <Toggle checked={ops.tableService} onChange={() => toggleOps('tableService')} label="Table service" />
                      <Toggle checked={ops.takeaway} onChange={() => toggleOps('takeaway')} label="Takeaway / pickup" />
                      <Toggle checked={ops.delivery} onChange={() => toggleOps('delivery')} label="Delivery" />
                    </div>
                    <div className="flex justify-end pt-2">
                      <SaveButton saved={saved === 'ops'} onClick={() => showSaved('ops')} />
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* PRINTING */}
            {activeTab === 'printing' && (
              <div className="space-y-6 max-w-2xl">
                <SectionCard>
                  <SectionHeader icon={Printer} title="Printer Configuration" description="Receipt and ticket printer settings" />
                  <div className="px-6 sm:px-8 py-6 space-y-4">
                    <Field label="Printer IP Address"><Input value={printerIp} onChange={e => setPrinterIp(e.target.value)} placeholder="192.168.1.50" /></Field>
                    <Field label="Ticket Copies">
                      <select value={ticketCopies} onChange={e => setTicketCopies(e.target.value)} className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-2.5 text-cream focus:outline-none focus:border-amber transition-colors text-sm">
                        <option value="1">1 copy</option>
                        <option value="2">2 copies</option>
                        <option value="3">3 copies</option>
                      </select>
                    </Field>
                    <Field label="Receipt Footer"><Textarea rows={3} value={receiptFooter} onChange={e => setReceiptFooter(e.target.value)} /></Field>
                  </div>
                </SectionCard>
                <SectionCard>
                  <SectionHeader icon={Printer} title="Print Behaviour" description="Control what gets printed" />
                  <div className="px-6 sm:px-8 py-4">
                    <Toggle checked={printing.autoPrintKds} onChange={() => togglePrinting('autoPrintKds')} label="Auto-print ticket to KDS" />
                    <Toggle checked={printing.printCustomerReceipt} onChange={() => togglePrinting('printCustomerReceipt')} label="Print customer receipt on close" />
                    <Toggle checked={printing.printKitchenTicket} onChange={() => togglePrinting('printKitchenTicket')} label="Print kitchen ticket per order" />
                    <Toggle checked={printing.showPrices} onChange={() => togglePrinting('showPrices')} label="Show prices on kitchen ticket" />
                    <Toggle checked={printing.logo} onChange={() => togglePrinting('logo')} label="Include logo on receipts" />
                  </div>
                  <div className="px-6 sm:px-8 pb-5 flex justify-end pt-2">
                    <SaveButton saved={saved === 'printing'} onClick={() => showSaved('printing')} />
                  </div>
                </SectionCard>
              </div>
            )}

            {/* APPEARANCE */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 max-w-2xl">
                <SectionCard>
                  <SectionHeader icon={Palette} title="Brand & Colors" description="Customize the admin portal look" />
                  <div className="px-6 sm:px-8 py-6 space-y-5">
                    <Field label="Accent Color">
                      <div className="flex items-center gap-3">
                        <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-12 h-10 rounded-lg border border-warm-700 bg-warm-800 cursor-pointer p-1" />
                        <Input value={accentColor} onChange={e => setAccentColor(e.target.value)} placeholder="#D97706" />
                      </div>
                    </Field>
                    <Field label="Font Size">
                      <div className="grid grid-cols-3 gap-2">
                        {(['small', 'medium', 'large'] as const).map(s => (
                          <button key={s} type="button" onClick={() => setFontSize(s)}
                            className={`py-2.5 rounded-xl text-sm font-medium transition-all border capitalize ${fontSize === s ? 'bg-amber/10 text-amber border-amber/30' : 'bg-warm-800 text-cream-muted border-warm-700 hover:text-cream'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Theme">
                      <div className="grid grid-cols-2 gap-3">
                        {(['dark', 'light'] as const).map(t => (
                          <button key={t} type="button" onClick={() => setTheme(t)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${theme === t ? 'bg-amber/10 border-amber/30' : 'bg-warm-800 border-warm-700 hover:border-warm-600'}`}>
                            <div className={`w-8 h-5 rounded-md ${t === 'dark' ? 'bg-warm-950' : 'bg-gray-100 border border-gray-300'}`} />
                            <div>
                              <p className={`text-sm font-medium capitalize ${theme === t ? 'text-amber' : 'text-cream'}`}>{t}</p>
                              <p className="text-warm-500 text-xs">{t === 'dark' ? 'Default' : 'Coming soon'}</p>
                            </div>
                            {theme === t && <Check size={14} className="text-amber ml-auto" />}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <div className="flex justify-end pt-2">
                      <SaveButton saved={saved === 'appearance'} onClick={() => showSaved('appearance')} />
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}