import React from 'react';
import { motion } from 'framer-motion';

export function StitchDivider({ className = '' }) {
  return <div className={`stitch-line w-full ${className}`} aria-hidden="true" />;
}

export function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-pink-600">
      <span className="h-px w-6 bg-pink-400" aria-hidden="true" />
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, description, align = 'left', className = '' }) {
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col gap-4 max-w-2xl ${alignment} ${className}`}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.1] text-ink font-semibold">
        {title}
      </h2>
      {description && <p className="text-ink-soft text-base sm:text-lg leading-relaxed">{description}</p>}
    </motion.div>
  );
}

export function Badge({ children, tone = 'pink' }) {
  const tones = {
    pink: 'bg-pink-100 text-pink-700',
    cream: 'bg-white text-ink-soft',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Button({ as: Comp = 'button', variant = 'primary', className = '', children, ...props }) {
  const MotionTag = typeof Comp === 'string' && motion[Comp] ? motion[Comp] : motion.button;
  const base =
    'btn-premium inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 focus-ring cursor-pointer select-none';
  const variants = {
    primary:
      'bg-pink-600 text-white hover:bg-pink-700 shadow-soft hover:shadow-[0_10px_28px_-6px_rgba(219,39,119,0.35)]',
    secondary:
      'bg-white text-ink border border-ink/10 hover:border-pink-300 hover:text-pink-600 hover:bg-rose-50/40 shadow-sm hover:shadow-card',
    ghost: 'bg-transparent text-ink hover:text-pink-600 hover:bg-pink-50/50',
    outlineLight: 'bg-white/10 text-white border border-white/40 hover:bg-white/20 backdrop-blur shadow-sm',
  };
  return (
    <MotionTag
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ y: 0, scale: 0.99 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl2 bg-white shadow-card overflow-hidden animate-pulse">
      <div className="h-48 bg-cream-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-1/3 bg-cream-200 rounded" />
        <div className="h-5 w-4/5 bg-cream-200 rounded" />
        <div className="h-4 w-full bg-cream-200 rounded" />
        <div className="h-4 w-2/3 bg-cream-200 rounded" />
      </div>
    </div>
  );
}

export function EmptyState({ title, description, icon }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-16 px-6 rounded-xl2 border border-dashed border-pink-200 bg-white/60">
      {icon && <div className="text-pink-400">{icon}</div>}
      <h3 className="font-display text-xl text-ink font-semibold">{title}</h3>
      {description && <p className="text-ink-faint max-w-sm">{description}</p>}
    </div>
  );
}
