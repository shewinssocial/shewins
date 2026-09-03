import React, { useState } from 'react';
import { createEnquiry } from '../../data/api.js';
import { SectionHeading, Button } from '../ui/Primitives.jsx';
import useReveal from '../../hooks/useReveal.js';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  location: '',
  profession: '',
  reason: '',
  message: '',
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Enter your full name.';
  if (!form.email.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.phone.trim()) {
    errors.phone = 'Enter your phone number.';
  } else if (!/^[+()\d\s-]{7,}$/.test(form.phone)) {
    errors.phone = 'Enter a valid phone number.';
  }
  return errors;
}

export default function JoinSection() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const headingRef = useReveal({ variant: 'fade-up' });
  const formCardRef = useReveal({ variant: 'scale' });

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      await createEnquiry(form);
      setSubmitted(true);
      setForm(initialForm);
    } catch {
      setSubmitError('We couldn\u2019t submit your enquiry. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="join" className="py-16 sm:py-24 bg-white/60 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div ref={headingRef} className="reveal-fade-up">
          <SectionHeading
            eyebrow="Be Part of Shewins"
            title="Ready to be part of the community?"
            description="Whether you want to participate, collaborate, volunteer, or simply meet other women doing brilliant things — tell us a little about you and we'll be in touch."
            align="center"
            wordReveal={true}
          />
        </div>

        <div
          ref={formCardRef}
          className="reveal-scale mt-12 rounded-xl2 bg-white shadow-soft p-6 sm:p-10 border border-ink/[0.04] transition-all duration-500"
        >
          {submitted ? (
            <div className="text-center py-10 flex flex-col items-center gap-4 animate-fadeUp">
              <div className="h-14 w-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center animate-bounce">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink">Thank you!</h3>
              <p className="text-ink-faint max-w-sm">
                Thank you for reaching out to Shewins. We will get back to you soon.
              </p>
              <Button variant="secondary" onClick={() => setSubmitted(false)}>
                Submit another enquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid sm:grid-cols-2 gap-5">
              <Field label="Full Name" error={errors.name}>
                <input
                  value={form.name}
                  onChange={update('name')}
                  className={inputClass(errors.name)}
                  placeholder="Your full name"
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  className={inputClass(errors.email)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone Number" error={errors.phone}>
                <input
                  value={form.phone}
                  onChange={update('phone')}
                  className={inputClass(errors.phone)}
                  placeholder="+91 98765 43210"
                />
              </Field>
              <Field label="Location (optional)" error={errors.location}>
                <input
                  value={form.location}
                  onChange={update('location')}
                  className={inputClass(errors.location)}
                  placeholder="City, Country"
                />
              </Field>
              <Field label="Profession (optional)" error={errors.profession} className="sm:col-span-2">
                <input
                  value={form.profession}
                  onChange={update('profession')}
                  className={inputClass(errors.profession)}
                  placeholder="What do you do?"
                />
              </Field>
              <Field label="Reason for Joining (optional)" error={errors.reason} className="sm:col-span-2">
                <input
                  value={form.reason}
                  onChange={update('reason')}
                  className={inputClass(errors.reason)}
                  placeholder="Connect, collaborate, volunteer…"
                />
              </Field>
              <Field label="Message (optional)" error={errors.message} className="sm:col-span-2">
                <textarea
                  value={form.message}
                  onChange={update('message')}
                  rows={4}
                  className={inputClass(errors.message)}
                  placeholder="Tell us a bit more"
                />
              </Field>

              {submitError && (
                <p className="sm:col-span-2 text-sm text-rose-600 text-center">{submitError}</p>
              )}

              <div className="sm:col-span-2 flex justify-center pt-2">
                <Button type="submit" variant="primary" disabled={submitting} className="min-w-[200px]">
                  {submitting ? 'Submitting…' : 'Submit Enquiry'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function inputClass(error) {
  return `w-full rounded-xl border bg-cream-50 px-4 py-3 text-sm text-ink placeholder:text-ink-faint/70 focus-ring transition-all duration-200 focus:bg-white focus:shadow-sm ${
    error ? 'border-rose-500' : 'border-ink/10 focus:border-rose-400'
  }`;
}

function Field({ label, error, children, className = '' }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      <span className="font-medium text-ink-soft">{label}</span>
      {children}
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </label>
  );
}
