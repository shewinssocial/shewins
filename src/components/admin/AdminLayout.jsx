import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true, icon: 'grid' },
  { to: '/admin/events', label: 'Events', icon: 'calendar' },
  { to: '/admin/gallery', label: 'Gallery', icon: 'image' },
  { to: '/admin/videos', label: 'Videos', icon: 'play' },
  { to: '/admin/enquiries', label: 'Enquiries', icon: 'mail' },
];

export default function AdminLayout({ children, title }) {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Leaving the admin area for the public site always signs the admin out
  // (see master prompt §36) — navigating between admin pages never does.
  async function handleBackToSite() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-ink/5 fixed inset-y-0">
        <SidebarContent onNavigate={() => {}} onBackToSite={handleBackToSite} user={user} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white flex flex-col">
            <SidebarContent onNavigate={() => setOpen(false)} onBackToSite={handleBackToSite} user={user} />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-ink/5 px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg text-ink focus-ring"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-ink">{title}</h1>
          </div>
          <button
            onClick={handleBackToSite}
            className="text-sm text-ink-faint hover:text-rose-600 hidden sm:inline-flex items-center gap-1.5 focus-ring rounded"
          >
            Back to Site ↗
          </button>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 6, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.995 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 p-5 sm:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate, onBackToSite, user }) {
  return (
    <>
      <div className="px-6 py-6 flex items-center gap-2 border-b border-ink/5">
        <span className="h-9 w-9 rounded-full bg-rose-600 flex items-center justify-center text-white font-display">
          S
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-ink leading-none">Shewings</p>
          <p className="text-[11px] text-ink-faint mt-1">Admin Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors focus-ring ${
                isActive ? 'bg-rose-100 text-rose-700' : 'text-ink-soft hover:bg-cream-100'
              }`
            }
          >
            <NavIcon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-5 border-t border-ink/5">
        <p className="text-xs text-ink-faint px-2 truncate">{user?.email}</p>
        <button
          onClick={onBackToSite}
          className="mt-2 w-full text-left px-2 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 font-medium focus-ring"
        >
          Back to Site &amp; Sign Out
        </button>
      </div>
    </>
  );
}

function NavIcon({ name }) {
  const paths = {
    grid: <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />,
    calendar: <path d="M4 7h16M7 3v4M17 3v4M5 21h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v13a1 1 0 001 1z" />,
    image: <path d="M4 5h16v14H4V5zm3 10l3.5-4.5 2.5 3L16 9l4 6H7z" />,
    play: <path d="M5 4l15 8-15 8V4z" />,
    mail: <path d="M4 6h16v12H4V6zm0 0l8 7 8-7" />,
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}
