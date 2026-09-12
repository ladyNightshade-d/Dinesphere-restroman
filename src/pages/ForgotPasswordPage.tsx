import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { authService } from '../services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await authService.forgotPassword(email);
      setMessage(result.message);
    } catch {
      setError('Unable to send the reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-warm-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-warm-900 border border-warm-700 rounded-2xl p-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-cream-muted hover:text-cream text-sm mb-8">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
        <Mail size={28} className="text-amber mb-4" />
        <h1 className="font-display text-3xl text-cream font-semibold">Reset your password</h1>
        <p className="text-cream-muted text-sm mt-2 mb-6">Enter your email and we will send a secure reset link.</p>
        {message && <p className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-xl text-green-300 text-sm">{message}</p>}
        {error && <p className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-400 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="james@example.com"
            className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber text-sm"
          />
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl disabled:opacity-50">
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </main>
  );
}