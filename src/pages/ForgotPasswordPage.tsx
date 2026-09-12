import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, LockKeyhole, Mail } from 'lucide-react';
import { authService } from '../services/auth.service';
import { getApiErrorMessage } from '../services/apiError';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (step === 1) {
        const result = await authService.forgotPassword(email);
        setMessage(result.message);
        setStep(2);
      } else if (step === 2) {
        const result = await authService.verifyResetOtp(email, otp);
        setResetToken(result.resetToken);
        setMessage('Code verified. Choose a new password.');
        setStep(3);
      } else {
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        await authService.resetPassword(resetToken, password);
        setMessage('Password updated successfully. You can now sign in.');
        setStep(1);
        setEmail('');
        setOtp('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setError(getApiErrorMessage(error, 'Unable to complete password reset.'));
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
        {step === 1 ? <Mail size={28} className="text-amber mb-4" /> : step === 2 ? <KeyRound size={28} className="text-amber mb-4" /> : <LockKeyhole size={28} className="text-amber mb-4" />}
        <h1 className="font-display text-3xl text-cream font-semibold">{step === 1 ? 'Reset your password' : step === 2 ? 'Enter your code' : 'Choose a new password'}</h1>
        <p className="text-cream-muted text-sm mt-2 mb-6">{step === 1 ? 'Enter your email and we will send a six-digit code.' : step === 2 ? 'Check your email and enter the six-digit code.' : 'Use at least 6 characters.'}</p>
        {message && <p className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-xl text-green-300 text-sm">{message}</p>}
        {error && <p className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-400 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && <input type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="james@example.com" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber text-sm" />}
          {step === 2 && <input type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={event => setOtp(event.target.value.replace(/\D/g, ''))} placeholder="123456" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber text-sm tracking-[0.5em] text-center" />}
          {step === 3 && <><input type="password" required value={password} onChange={event => setPassword(event.target.value)} placeholder="New password" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber text-sm" /><input type="password" required value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Confirm new password" className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3 text-cream placeholder-warm-500 focus:outline-none focus:border-amber text-sm" /></>}
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-amber hover:bg-amber-hover text-warm-950 font-semibold rounded-xl disabled:opacity-50">
            {loading ? 'Please wait...' : step === 1 ? 'Send code' : step === 2 ? 'Verify code' : 'Update password'}
          </button>
        </form>
      </div>
    </main>
  );
}