import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import { restaurantService } from '../services/restaurant.service';
import { Restaurant } from '../types/domain';

const cuisines = ['All', 'American', 'Indian', 'French', 'Japanese', 'Italian', 'Mediterranean'];
const ratings = ['Any', '4.5+', '4.7+', '4.9+'];

const getCuisineList = (cuisine: string | string[] | undefined): string[] => {
  if (Array.isArray(cuisine)) {
    return cuisine.map(item => item.trim()).filter(Boolean);
  }

  if (typeof cuisine === 'string') {
    return cuisine
      .split(',')
      .map(item => item.trim())
      .filter((item): item is string => Boolean(item));
  }

  return [];
};

export default function DiscoverPage() {
  const [activeCuisine, setActiveCuisine] = useState('All');
  const [activeRating, setActiveRating] = useState('Any');
  const [search, setSearch] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liveDataUnavailable, setLiveDataUnavailable] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setSelectedLocation('Your current location');
        try {
          const result = await restaurantService.getAll({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            refresh: true,
          });
          setRestaurants(result.restaurants);
          setLiveDataUnavailable(result.liveDataUnavailable);
        } catch {
          setError('Failed to load restaurants near you');
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  const searchByLocation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = locationQuery.trim();
    if (!query) {
      setError('Enter a city, neighborhood, or address to search.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const locations = await restaurantService.searchLocation(query);
      const location = locations[0];
      if (!location) {
        setError('We could not find that location. Try a nearby city or neighborhood.');
        setRestaurants([]);
        return;
      }

      const result = await restaurantService.getAll({
        lat: location.lat,
        lng: location.lng,
        refresh: true,
      });
      setSelectedLocation(location.label);
      setRestaurants(result.restaurants);
      setLiveDataUnavailable(result.liveDataUnavailable);
    } catch {
      setError('Location search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = [...restaurants]
    .filter(r => {
      const cuisineList = getCuisineList(r.cuisine);
      const normalizedCuisine = activeCuisine.toLowerCase();
      const matchCuisine = activeCuisine === 'All' || cuisineList.some((c: string) => c.toLowerCase().includes(normalizedCuisine));
      const matchRating =
        activeRating === 'Any' ? true :
        activeRating === '4.5+' ? (r.rating || 0) >= 4.5 :
        activeRating === '4.7+' ? (r.rating || 0) >= 4.7 :
        (r.rating || 0) >= 4.9;
      const searchValue = search.trim().toLowerCase();
      const matchSearch = searchValue.length === 0 || [r.name, cuisineList.join(', '), r.address || '']
        .join(' ')
        .toLowerCase()
        .includes(searchValue);
      return matchCuisine && matchRating && matchSearch;
    })
    .sort((a, b) => {
      const activeScore = Number(b.isActive) - Number(a.isActive);
      if (activeScore !== 0) return activeScore;
      return (b.rating || 0) - (a.rating || 0);
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
            <form className="flex gap-2" onSubmit={searchByLocation}>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber" />
                <input
                  type="search"
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  placeholder="City, area, or address"
                  aria-label="Search restaurants by city or area"
                  className="w-56 bg-warm-800 border border-warm-700 rounded-xl pl-10 pr-3 py-3.5 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-3.5 bg-amber text-warm-950 rounded-xl text-sm font-semibold hover:bg-amber-hover transition-colors"
              >
                Search area
              </button>
            </form>
          </div>
          <p className="text-warm-500 text-xs mt-3">
            {selectedLocation
              ? `Showing nearby listings for ${selectedLocation}`
              : 'Allow location access or search any city or neighborhood.'}
          </p>
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

        {!loading && !error && liveDataUnavailable && (
          <div className="mt-6 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-center text-sm text-amber">
            Live nearby listings are temporarily unavailable. Try searching another area in a moment.
          </div>
        )}

        {/* Empty state — no restaurants in DB yet */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-cream mb-3">
              {liveDataUnavailable ? 'Could not check nearby restaurants' : 'No restaurants found nearby'}
            </p>
            <p className="text-cream-muted text-sm">
              {!selectedLocation
                ? 'Search a city, neighborhood, or address above to find nearby restaurants.'
                : liveDataUnavailable
                  ? 'Please try searching this area again later.'
                  : restaurants.length === 0
                    ? 'There are no restaurant listings in this area yet. Try a nearby city or neighborhood.'
                    : 'Try adjusting your filters.'}
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-cream-muted text-sm mb-6">{filtered.length} restaurants found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
              {filtered.map(r => {
                const cuisineList = getCuisineList(r.cuisine);
                const cuisineLabel = cuisineList.length ? cuisineList.join(', ') : 'Various cuisines';

                const isLiveListing = r.source === 'openstreetmap';
                const directionsUrl = r.location
                  ? `https://www.openstreetmap.org/?mlat=${r.location.lat}&mlon=${r.location.lng}#map=17/${r.location.lat}/${r.location.lng}`
                  : undefined;

                return (
                  <article
                    key={r._id}
                    className="group bg-warm-800 border border-warm-700 rounded-2xl overflow-hidden hover:border-amber/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber/10"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={r.images?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {isLiveListing && (
                          <span className="px-2 py-1 rounded-full bg-amber/15 text-amber border border-amber/40 text-[10px] font-semibold uppercase tracking-[0.12em]">
                            Live data
                          </span>
                        )}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          !isLiveListing && r.isActive ? 'bg-green-900/80 text-green-300' : 'bg-warm-950/80 text-warm-500'
                        }`}>
                          {isLiveListing ? 'Local listing' : r.isActive ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-1">
                        {isLiveListing ? (
                          <h3 className="font-display text-lg text-cream font-medium">{r.name}</h3>
                        ) : (
                          <h3 className="font-display text-lg text-cream font-medium group-hover:text-amber transition-colors">
                            <Link to={`/restaurant/${r._id}`}>{r.name}</Link>
                          </h3>
                        )}
                      </div>
                      <p className="text-cream-muted text-sm mb-3">{cuisineLabel}</p>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1 min-w-0">
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
                        <div className="flex items-center gap-1 text-cream-muted text-xs truncate max-w-[45%]">
                          <MapPin size={12} className="text-amber shrink-0" />
                          <span className="truncate">{r.address || 'Location TBD'}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {r.bookingUrl && (
                          <a
                            href={r.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber px-3 py-2 text-xs font-semibold text-warm-950 hover:bg-amber-hover"
                          >
                            Book online <ExternalLink size={13} />
                          </a>
                        )}
                        {r.orderingUrl && (
                          <a
                            href={r.orderingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber px-3 py-2 text-xs font-semibold text-warm-950 hover:bg-amber-hover"
                          >
                            Order online <ExternalLink size={13} />
                          </a>
                        )}
                        {!r.bookingUrl && !r.orderingUrl && r.website && (
                          <a
                            href={r.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-warm-600 px-3 py-2 text-xs font-medium text-cream-muted hover:text-cream"
                          >
                            Website <ExternalLink size={13} />
                          </a>
                        )}
                        {directionsUrl && (
                          <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-warm-600 px-3 py-2 text-xs font-medium text-cream-muted hover:text-cream"
                          >
                            Directions <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
        <p className="text-center text-warm-500 text-xs mt-8">
          Map data ©{' '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-cream-muted">
            OpenStreetMap contributors
          </a>
        </p>
      </div>
    </div>
  );
}