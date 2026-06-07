import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import { restaurantService } from '../services/restaurant.service';

const cuisines = ['All', 'American', 'Indian', 'French', 'Japanese', 'Italian', 'Mediterranean'];
const ratings = ['Any', '4.5+', '4.7+', '4.9+'];

export default function DiscoverPage() {
  const [activeCuisine, setActiveCuisine] = useState('All');
  const [activeRating, setActiveRating] = useState('Any');
  const [search, setSearch] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getAll();
        setRestaurants(data);
      } catch (err) {
        setError('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter(r => {
    const matchCuisine = activeCuisine === 'All' || r.cuisine?.includes(activeCuisine);
    const matchRating =
      activeRating === 'Any' ? true :
      activeRating === '4.5+' ? r.rating >= 4.5 :
      activeRating === '4.7+' ? r.rating >= 4.7 :
      r.rating >= 4.9;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine?.toString().toLowerCase().includes(search.toLowerCase());
    return matchCuisine && matchRating && matchSearch;
  });

  return (
    <div className="bg-warm-950 min-h-screen pt-20">
      <Navbar />

      {/* Search header */}
      <div className="bg-warm-900 border-b border-warm-700 px-16 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl text-cream mb-6">Discover Near You</h1>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search restaurants, cuisines..."
                className="w-full bg-warm-800 border border-warm-700 rounded-xl pl-11 pr-4 py-3.5 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3.5 bg-warm-800 border border-warm-700 rounded-xl text-cream-muted hover:text-cream hover:border-warm-600 transition-all text-sm">
              <MapPin size={16} className="text-amber" />
              Downtown
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-16 py-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-cream-muted text-xs uppercase tracking-widest font-medium">Cuisine</span>
            <div className="flex gap-2 flex-wrap">
              {cuisines.map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCuisine(c)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeCuisine === c
                      ? 'bg-amber text-warm-950'
                      : 'bg-warm-800 text-cream-muted hover:text-cream border border-warm-700 hover:border-warm-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="w-px h-4 bg-warm-700" />
          <div className="flex items-center gap-2">
            <span className="text-cream-muted text-xs uppercase tracking-widest font-medium">Rating</span>
            <div className="flex gap-2">
              {ratings.map(r => (
                <button
                  key={r}
                  onClick={() => setActiveRating(r)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeRating === r
                      ? 'bg-amber text-warm-950'
                      : 'bg-warm-800 text-cream-muted hover:text-cream border border-warm-700 hover:border-warm-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="max-w-7xl mx-auto px-16 pb-16">

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-cream-muted text-sm">Finding restaurants near you...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-center py-24">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Empty state — no restaurants in DB yet */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-cream mb-3">No restaurants found</p>
            <p className="text-cream-muted text-sm">
              {restaurants.length === 0
                ? 'No restaurants have been added yet. Add one via the Admin portal!'
                : 'Try adjusting your filters.'}
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-cream-muted text-sm mb-6">{filtered.length} restaurants found</p>
            <div className="grid grid-cols-3 gap-7">
              {filtered.map(r => (
                <Link
                  key={r._id}
                  to={`/restaurant/${r._id}`}
                  className="group bg-warm-800 border border-warm-700 rounded-2xl overflow-hidden hover:border-amber/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber/10"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={r.images?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        r.isActive ? 'bg-green-900/80 text-green-300' : 'bg-warm-950/80 text-warm-500'
                      }`}>
                        {r.isActive ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-display text-lg text-cream font-medium group-hover:text-amber transition-colors">{r.name}</h3>
                    </div>
                    <p className="text-cream-muted text-sm mb-3">{r.cuisine?.join(', ')}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={i < Math.floor(r.rating || 0) ? 'text-amber fill-amber' : 'text-warm-600'}
                          />
                        ))}
                        <span className="text-amber text-sm font-semibold ml-1">{r.rating || 'New'}</span>
                        <span className="text-warm-500 text-xs ml-1">({r.totalReviews || 0})</span>
                      </div>
                      <div className="flex items-center gap-1 text-cream-muted text-xs">
                        <MapPin size={12} className="text-amber" />
                        {r.address || 'Location TBD'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}