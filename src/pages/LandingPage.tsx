import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Clock, ShieldCheck, ChefHat } from 'lucide-react';
import Navbar from '../components/Navbar';
import { featuredDishes } from '../data/dummyData';

export default function LandingPage() {
  return (
    <div className="bg-warm-950 min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-warm-950/80 via-warm-950/60 to-warm-950" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
          <p className="text-amber text-sm font-medium tracking-[0.3em] uppercase mb-6">Est. 2024 · Fine Dining</p>
          <h1 className="font-display text-6xl md:text-7xl text-cream font-semibold leading-tight mb-6">
            Sophisticated Flavors<br />
            <span className="italic text-amber">for the Modern Palate</span>
          </h1>
          <p className="text-cream-muted text-xl mb-12 font-light tracking-wide">
            A sanctuary for the senses
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/discover"
              className="group flex items-center gap-2 px-8 py-4 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber/20"
            >
              Order Online
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/discover"
              className="px-8 py-4 border border-cream/30 text-cream hover:border-amber hover:text-amber rounded-full transition-all duration-300 font-medium"
            >
              Book a Table
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-0.5 h-12 bg-gradient-to-b from-amber to-transparent mx-auto" />
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-24 px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-amber text-xs font-medium tracking-[0.3em] uppercase mb-3">Culinary Excellence</p>
          <h2 className="font-display text-4xl text-cream">Signature Creations</h2>
          <div className="w-16 h-0.5 bg-amber mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-3 gap-8">
          {featuredDishes.map((dish, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl bg-warm-800 border border-warm-700 hover:border-amber/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber/10">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-xl text-cream font-medium">{dish.name}</h3>
                  <span className="text-amber font-semibold text-lg">{dish.price}</span>
                </div>
                <p className="text-cream-muted text-sm">{dish.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reserve CTA */}
      <section className="relative py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
        />
        <div className="absolute inset-0 bg-warm-950/80" />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
          <p className="text-amber text-xs font-medium tracking-[0.3em] uppercase mb-4">Reservations</p>
          <h2 className="font-display text-5xl text-cream mb-6 leading-tight">
            Reserve Your Experience Today
          </h2>
          <p className="text-cream-muted mb-10 text-lg leading-relaxed">
            Secure your table at our award-winning restaurant. Every seat is a front-row experience.
          </p>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-10 py-4 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-amber/30 text-lg"
          >
            Book Your Table
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-warm-900 border-t border-warm-700 py-12 px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-amber rounded-full flex items-center justify-center">
                  <span className="text-warm-950 text-xs font-bold">D</span>
                </div>
                <span className="font-display text-lg text-cream">DineSphere</span>
              </div>
              <div className="flex items-center gap-2 text-cream-muted text-sm">
                <MapPin size={14} className="text-amber" />
                <span>24 Harrington St, Downtown</span>
              </div>
              <div className="flex items-center gap-2 text-cream-muted text-sm mt-1">
                <Clock size={14} className="text-amber" />
                <span>12PM – 11PM Daily</span>
              </div>
            </div>
            <div>
              <p className="text-warm-500 text-xs font-medium uppercase tracking-widest mb-3">Staff Portals</p>
              <div className="flex flex-col gap-2">
                <Link to="/admin/login" className="flex items-center gap-2 text-cream-muted hover:text-amber transition-colors text-sm">
                  <ShieldCheck size={13} className="text-amber" />
                  Admin Portal
                </Link>
                <Link to="/admin/signup" className="text-warm-500 hover:text-cream-muted transition-colors text-xs pl-5">
                  Create admin account
                </Link>
                <Link to="/kitchen/login" className="flex items-center gap-2 text-cream-muted hover:text-amber transition-colors text-sm mt-1">
                  <ChefHat size={13} className="text-orange-400" />
                  Kitchen Portal
                </Link>
                <Link to="/kitchen/signup" className="text-warm-500 hover:text-cream-muted transition-colors text-xs pl-5">
                  Register as kitchen staff
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-warm-700 pt-6">
            <p className="text-cream-muted text-sm text-center">© 2024 DineSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
