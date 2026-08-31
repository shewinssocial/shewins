import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6 bg-cream-100">
      <p className="font-display text-6xl font-semibold text-rose-600">404</p>
      <h1 className="font-display text-2xl font-semibold text-ink">Page not found</h1>
      <p className="text-ink-faint max-w-sm">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="mt-2 text-rose-600 font-semibold hover:underline">
        ← Back to Shewings
      </Link>
    </div>
  );
}
