import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users, CheckCircle2, Calendar, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { restaurantService } from '../services/restaurant.service';
import { reservationService } from '../services/reservation.service';
import { useAuth } from '../context/AuthContext';

const timeSlots = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function ReservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reservation, setReservation] = useState<any>(null);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      restaurantService.getById(id)
        .then(setRestaurant)
        .catch(() => setError('Failed to load this restaurant. Please try again.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const handleConfirm = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedDay || !selectedTime) return;

    setSubmitting(true);
    setError('');

    try {
      const date = new Date(viewYear, viewMonth, selectedDay).toISOString();
      const result = await reservationService.create({
        restaurant: id!,
        date,
        time: selectedTime,
        guestCount: guests,
        specialRequests: notes,
      });
      setReservation(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to make reservation. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="bg-warm-950 min-h-screen pt-[72px] flex items-center justify-center">
      <Navbar />
      <div className="w-10 h-10 border-2 border-amber border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Confirmation screen
  if (reservation) {
    return (
      <div className="bg-warm-950 min-h-screen pt-[72px] flex items-center justify-center">
        <Navbar />
        <div className="text-center max-w-md px-8">
          <div className="w-20 h-20 bg-amber/10 border border-amber/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-amber" />
          </div>
          <p className="text-amber text-xs font-medium tracking-[0.3em] uppercase mb-3">Reservation Confirmed</p>
          <h1 className="font-display text-4xl text-cream font-semibold mb-2">You're all set!</h1>
          <p className="text-cream-muted mb-8">
            Your table at <span className="text-cream">{restaurant?.name}</span> has been reserved.
          </p>
          <div className="bg-warm-900 border border-warm-700 rounded-2xl p-6 text-left space-y-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-cream-muted">Restaurant</span>
              <span className="text-cream font-medium">{restaurant?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cream-muted">Date</span>
              <span className="text-cream font-medium">
                {MONTHS[viewMonth]} {selectedDay}, {viewYear}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cream-muted">Time</span>
              <span className="text-cream font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cream-muted">Guests</span>
              <span className="text-cream font-medium">{guests} {guests === 1 ? 'person' : 'people'}</span>
            </div>
            {notes && (
              <div className="flex justify-between text-sm">
                <span className="text-cream-muted">Notes</span>
                <span className="text-cream font-medium max-w-xs text-right">{notes}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-cream-muted">Confirmation #</span>
              <span className="text-amber font-semibold">{reservation.confirmationCode}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cream-muted">Status</span>
              <span className="text-green-400 font-medium capitalize">{reservation.status}</span>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-full transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warm-950 min-h-screen pt-[72px]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-12 py-12">
        <div className="mb-10">
          <p className="text-amber text-xs font-medium tracking-[0.3em] uppercase mb-2">Table Reservation</p>
          <h1 className="font-display text-4xl text-cream font-semibold">{restaurant?.name}</h1>
          <p className="text-cream-muted mt-1 text-sm">
            {restaurant?.address} · {restaurant?.cuisine?.join(', ')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-10">
          {/* Calendar */}
          <div className="bg-warm-900 border border-warm-700 rounded-2xl p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg text-cream flex items-center gap-2">
                <Calendar size={18} className="text-amber" />
                {MONTHS[viewMonth]} {viewYear}
              </h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg bg-warm-800 hover:bg-warm-750 text-cream-muted hover:text-cream transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg bg-warm-800 hover:bg-warm-750 text-cream-muted hover:text-cream transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-warm-500 text-xs font-medium py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(firstDayOfMonth)].map((_, i) => <div key={`e${i}`} />)}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const disabled = isDisabled(day);
                const selected = selectedDay === day && !disabled;
                return (
                  <button
                    key={day}
                    disabled={disabled}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      selected ? 'bg-amber text-warm-950 font-bold' :
                      disabled ? 'text-warm-700 cursor-not-allowed' :
                      'text-cream-muted hover:text-cream hover:bg-warm-750'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time + Guests */}
          <div className="space-y-6">
            <div className="bg-warm-900 border border-warm-700 rounded-2xl p-6">
              <h3 className="font-display text-lg text-cream mb-4 flex items-center gap-2">
                <Clock size={17} className="text-amber" />
                Available Times
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                      selectedTime === slot
                        ? 'bg-amber text-warm-950 font-bold'
                        : 'bg-warm-800 text-cream-muted hover:text-cream hover:bg-warm-750 border border-warm-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-warm-900 border border-warm-700 rounded-2xl p-6">
              <h3 className="font-display text-lg text-cream mb-4 flex items-center gap-2">
                <Users size={17} className="text-amber" />
                Party Size
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGuests(g => Math.max(1, g - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-warm-800 hover:bg-warm-750 text-cream border border-warm-700 text-xl font-light transition-colors"
                >
                  −
                </button>
                <span className="font-display text-3xl text-cream w-16 text-center">{guests}</span>
                <button
                  onClick={() => setGuests(g => Math.min(15, g + 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-warm-800 hover:bg-warm-750 text-cream border border-warm-700 text-xl font-light transition-colors"
                >
                  +
                </button>
                <span className="text-cream-muted text-sm">{guests === 1 ? 'guest' : 'guests'}</span>
              </div>
            </div>

            <div className="bg-warm-900 border border-warm-700 rounded-2xl p-6">
              <h3 className="font-display text-lg text-cream mb-4">Special Requests</h3>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Allergies, celebrations, seating preferences..."
                rows={3}
                className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber transition-colors text-sm resize-none"
              />
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedDay || !selectedTime || submitting}
              className="w-full py-4 bg-amber hover:bg-amber-hover disabled:opacity-40 disabled:cursor-not-allowed text-warm-950 font-semibold rounded-xl transition-colors text-base flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              {submitting ? 'Confirming...' : 'Confirm Reservation'}
            </button>

            {!user && (
              <p className="text-center text-cream-muted text-xs">
                You need to{' '}
                <Link to="/login" className="text-amber hover:text-amber-light">login</Link>
                {' '}to make a reservation
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}