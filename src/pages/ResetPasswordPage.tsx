import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { authService } from '../services/auth.service';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(token ? '' : 'This reset link is missing or invalid.');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(token, password);
      navigate('/login', { replace: true, state: { message: 'Password reset successfully. Please sign in.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to reset password.');
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
        <LockKeyhole size={28} className="text-amber mb-4" />
        <h1 className="font-display text-3xl text-cream font-semibold">Choose a new password</h1>
        <p className="text-cream-muted text-sm mt-2 mb-6">Use at least 6 characters.</p>
        {error && <p className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-400 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" required value={password} onChange={event => setPassword(event.target.value)} placeholder="New password" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber text-sm" />
          <input type="password" required value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Confirm new password" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber text-sm" />
          <button type="submit" disabled={loading || !token} className="w-full py-3.5 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl disabled:opacity-50">
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </main>
  );
}