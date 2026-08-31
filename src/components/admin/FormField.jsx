import React from 'react';

export function FormField({ label, error, children, className = '', hint }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      <span className="font-medium text-ink-soft">{label}</span>
      {children}
      {hint && !error && <span className="text-xs text-ink-faint">{hint}</span>}
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </label>
  );
}

export function inputClass(error) {
  return `w-full rounded-xl border bg-cream-50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/70 focus-ring transition-colors ${
    error ? 'border-rose-500' : 'border-ink/10 focus:border-rose-400'
  }`;
}

export function Toast({ message, tone = 'success', onDismiss }) {
  if (!message) return null;
  const tones = {
    success: 'bg-rose-600 text-white',
    error: 'bg-ink text-white',
  };
  return (
    <div className={`fixed bottom-6 right-6 z-[90] px-5 py-3 rounded-xl shadow-soft text-sm font-medium ${tones[tone]}`}>
      <div className="flex items-center gap-3">
        {message}
        <button onClick={onDismiss} className="text-white/70 hover:text-white" aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  );
}
