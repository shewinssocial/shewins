import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FormField, inputClass } from '../../components/admin/FormField.jsx';

export default function AdminLogin() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={location.state?.from || '/admin'} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
    } else {
      navigate(location.state?.from || '/admin', { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 relative">
      <a
        href="/"
        className="absolute top-5 left-5 sm:top-8 sm:left-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-rose-600 transition-colors focus-ring rounded"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Home
      </a>

      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <span className="h-12 w-12 rounded-full bg-rose-600 flex items-center justify-center text-white font-display text-xl">
            S
          </span>
          <h1 className="font-display text-2xl font-semibold text-ink">Shewings Admin</h1>
          <p className="text-sm text-ink-faint">Sign in to manage your site</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl2 shadow-soft p-7 flex flex-col gap-4">
          <FormField label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass()}
              placeholder="admin@shewings.com"
              autoFocus
            />
          </FormField>
          <FormField label="Password">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass()}
              placeholder="••••••••"
            />
          </FormField>

          {error && <p className="text-sm text-rose-600 -mt-1">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-full bg-rose-600 text-white py-2.5 text-sm font-semibold hover:bg-rose-700 transition-colors focus-ring disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>

        </form>
      </div>
    </div>
  );
}
