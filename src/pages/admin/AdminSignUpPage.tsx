import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const CUISINES = ['French', 'Italian', 'Japanese', 'Indian', 'American', 'Mediterranean', 'Chinese', 'Mexican', 'Thai', 'Lebanese' , 'Rwandan', 'Ethiopian', 'Vietnamese', 'Korean', 'Spanish', 'Greek', 'Turkish', 'Moroccan', 'Caribbean', 'Brazilian', 'Peruvian', 'German', 'Russian', 'African', 'Fusion', 'Other'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface WorkingHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export default function AdminSignUpPage() {
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Step 1
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2
  const [restaurantName, setRestaurantName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [deliveryFee, setDeliveryFee] = useState('4.99');
  const [minimumOrder, setMinimumOrder] = useState('10');
  const [deliveryRadius, setDeliveryRadius] = useState('10');
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>(
    DAYS.map(day => ({ day, open: '09:00', close: '22:00', closed: false }))
  );

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };

  const updateHour = (index: number, field: keyof WorkingHour, value: string | boolean) => {
    setWorkingHours(prev => prev.map((h, i) => i === index ? { ...h, [field]: value } : h));
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (selectedCuisines.length === 0) { setError('Please select at least one cuisine type'); return; }
    if (!address) { setError('Please enter restaurant address'); return; }
    setLoading(true);

    try {
      await register({ name, email, password, role: 'admin', restaurantName });
      const token = localStorage.getItem('token');
      await API.post('/restaurants', {
        name: restaurantName,
        description,
        address,
        phone,
        cuisine: selectedCuisines,
        images: coverImage ? [coverImage] : [],
        deliveryFee: parseFloat(deliveryFee),
        minimumOrder: parseFloat(minimumOrder),
        deliveryRadius: parseFloat(deliveryRadius),
        openingHours: workingHours,
        isActive: true,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-warm-950">
      {/* Left */}
      <div className="w-2/5 relative overflow-hidden h-screen">
        <img src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Kitchen" className="w-full h-full object-cover" />
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
            "Excellence in every<br />detail, from kitchen<br />to table."
          </p>
          <p className="text-cream-muted text-sm mt-3">Manage your restaurant with precision</p>
          <div className="mt-8 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? 'bg-amber text-warm-950' : 'bg-warm-700 text-warm-400'}`}>1</div>
            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-amber' : 'bg-warm-700'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? 'bg-amber text-warm-950' : 'bg-warm-700 text-warm-400'}`}>2</div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-cream-muted text-xs">Account</span>
            <span className="text-cream-muted text-xs">Restaurant</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-start justify-center px-12 bg-warm-900 overflow-y-auto">
        <div className="w-full max-w-lg py-12">

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-400 text-sm">{error}</div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="mb-8">
                <span className="px-3 py-1 rounded-full bg-amber/10 text-amber text-xs font-semibold border border-amber/20 flex items-center gap-1.5 w-fit mb-4">
                  <ShieldCheck size={12} />
                  Step 1 of 2 — Account Details
                </span>
                <h1 className="font-display text-4xl text-cream font-semibold">Create Admin Account</h1>
                <p className="text-cream-muted mt-2 text-sm">Start with your personal details</p>
              </div>

              <form className="space-y-4" onSubmit={handleStep1}>
                <div>
                  <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Marco Rossi" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@restaurant.com" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 pr-11 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-500 hover:text-cream-muted transition-colors">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Repeat password" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
                </div>
                <button type="submit" className="w-full py-3.5 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl transition-colors mt-2">
                  Continue to Restaurant Details →
                </button>
              </form>

              <p className="text-center text-cream-muted text-sm mt-6">
                Already have an account?{' '}
                <Link to="/admin/login" className="text-amber hover:text-amber-light transition-colors font-medium">Sign in</Link>
              </p>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="mb-8">
                <button onClick={() => setStep(1)} className="text-cream-muted text-sm hover:text-cream mb-4 flex items-center gap-1">
                  ← Back to account details
                </button>
                <span className="px-3 py-1 rounded-full bg-amber/10 text-amber text-xs font-semibold border border-amber/20 flex items-center gap-1.5 w-fit mb-4">
                  <ShieldCheck size={12} />
                  Step 2 of 2 — Restaurant Details
                </span>
                <h1 className="font-display text-4xl text-cream font-semibold">Your Restaurant</h1>
                <p className="text-cream-muted mt-2 text-sm">Tell us about your restaurant</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="bg-warm-800 border border-warm-700 rounded-2xl p-5 space-y-4">
                  <h3 className="text-cream font-medium text-sm uppercase tracking-wide">Basic Information</h3>
                  <div>
                    <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Restaurant Name</label>
                    <input type="text" value={restaurantName} onChange={e => setRestaurantName(e.target.value)} required placeholder="Ember & Oak" className="w-full bg-warm-700 border border-warm-600 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your restaurant's atmosphere and specialty..." rows={3} className="w-full bg-warm-700 border border-warm-600 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm resize-none" />
                  </div>
                  <div>
                    <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Cover Image URL</label>
                    <input
                      type="text"
                      value={coverImage}
                      onChange={e => setCoverImage(e.target.value)}
                      placeholder="https://images.pexels.com/photos/..."
                      className="w-full bg-warm-700 border border-warm-600 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm"
                    />
                    {coverImage && (
                      <img src={coverImage} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-xl border border-warm-600" />
                    )}
                    <p className="text-warm-500 text-xs mt-1">Paste a Pexels or any image URL for your restaurant cover</p>
                  </div>
                  <div>
                    <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Phone Number</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+250 700 000 000" className="w-full bg-warm-700 border border-warm-600 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
                  </div>
                </div>

                {/* Location */}
                <div className="bg-warm-800 border border-warm-700 rounded-2xl p-5 space-y-4">
                  <h3 className="text-cream font-medium text-sm uppercase tracking-wide">Location</h3>
                  <div>
                    <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Full Address</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} required placeholder="123 Main Street, Kigali, Rwanda" className="w-full bg-warm-700 border border-warm-600 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Delivery Radius (km)</label>
                    <input type="number" value={deliveryRadius} onChange={e => setDeliveryRadius(e.target.value)} min="1" max="50" className="w-full bg-warm-700 border border-warm-600 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-amber transition-colors text-sm" />
                  </div>
                </div>

                {/* Cuisine */}
                <div className="bg-warm-800 border border-warm-700 rounded-2xl p-5">
                  <h3 className="text-cream font-medium text-sm uppercase tracking-wide mb-3">Cuisine Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {CUISINES.map(cuisine => (
                      <button key={cuisine} type="button" onClick={() => toggleCuisine(cuisine)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedCuisines.includes(cuisine) ? 'bg-amber text-warm-950' : 'bg-warm-700 text-cream-muted hover:text-cream border border-warm-600'
                        }`}>
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery & Pricing */}
                <div className="bg-warm-800 border border-warm-700 rounded-2xl p-5 space-y-4">
                  <h3 className="text-cream font-medium text-sm uppercase tracking-wide">Delivery & Pricing</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Delivery Fee ($)</label>
                      <input type="number" value={deliveryFee} onChange={e => setDeliveryFee(e.target.value)} step="0.01" min="0" className="w-full bg-warm-700 border border-warm-600 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-amber transition-colors text-sm" />
                    </div>
                    <div>
                      <label className="block text-cream-muted text-xs font-medium mb-1.5 tracking-wide uppercase">Minimum Order ($)</label>
                      <input type="number" value={minimumOrder} onChange={e => setMinimumOrder(e.target.value)} step="0.01" min="0" className="w-full bg-warm-700 border border-warm-600 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-amber transition-colors text-sm" />
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="bg-warm-800 border border-warm-700 rounded-2xl p-5">
                  <h3 className="text-cream font-medium text-sm uppercase tracking-wide mb-4">Working Hours</h3>
                  <div className="space-y-3">
                    {workingHours.map((hour, i) => (
                      <div key={hour.day} className="flex items-center gap-3">
                        <span className="text-cream-muted text-sm w-24 flex-shrink-0">{hour.day}</span>
                        {hour.closed ? (
                          <span className="text-warm-500 text-sm flex-1">Closed</span>
                        ) : (
                          <div className="flex items-center gap-2 flex-1">
                            <input type="time" value={hour.open} onChange={e => updateHour(i, 'open', e.target.value)} className="bg-warm-700 border border-warm-600 rounded-lg px-3 py-1.5 text-cream text-sm focus:outline-none focus:border-amber" />
                            <span className="text-warm-500 text-xs">to</span>
                            <input type="time" value={hour.close} onChange={e => updateHour(i, 'close', e.target.value)} className="bg-warm-700 border border-warm-600 rounded-lg px-3 py-1.5 text-cream text-sm focus:outline-none focus:border-amber" />
                          </div>
                        )}
                        <button type="button" onClick={() => updateHour(i, 'closed', !hour.closed)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                            hour.closed ? 'bg-warm-700 text-cream-muted hover:text-cream' : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                          }`}>
                          {hour.closed ? 'Open' : 'Close'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Creating Account & Restaurant...' : 'Complete Registration'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}