import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('Completing Google sign-in...');

  useEffect(() => {
    const completeSignIn = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setError('Google sign-in could not be completed.');
        return;
      }

      localStorage.setItem('token', token);
      try {
        const data = await authService.getMe();
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/discover', { replace: true });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Google sign-in could not be completed.');
      }
    };

    completeSignIn();
  }, [navigate, searchParams]);

  return (
    <main className="min-h-screen bg-warm-950 flex items-center justify-center px-6">
      <p className="text-cream-muted text-sm">{error}</p>
    </main>
  );
}
