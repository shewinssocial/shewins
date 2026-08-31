import React, { useEffect, useState } from 'react';
import { getSettings } from '../../data/api.js';

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Join Us', href: '#join' },
  { label: 'Contact', href: '#contact' },
    { label: 'admin', href: 'admin' },
];

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let mounted = true;
    getSettings()
      .then((data) => mounted && setSettings(data))
      .catch(() => mounted && setSettings({}));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer className="bg-ink text-cream-100">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 grid sm:grid-cols-3 gap-10">
        <div className="flex flex-col gap-3">
           <a href="#home" className="flex items-center gap-2 font-display text-xl font-semibold ">
             <img src="/sl2.png" width="202" height="102" alt="Shewins"   />
            {/* Shewins */}
          </a>
          <p className="text-sm text-cream-100/70 leading-relaxed max-w-xs">
            A community bringing women together from different professions, businesses, and
            backgrounds — to connect, grow, and rise together.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-cream-100/50 mb-4">Quick Links</p>
          <ul className="flex flex-col gap-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-cream-100/80 hover:text-white transition-colors">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-cream-100/50 mb-4">Connect</p>
          {settings && (settings.email || settings.phone || settings.location) && (
            <ul className="flex flex-col gap-2 text-sm text-cream-100/80">
              {settings.email && <li>{settings.email}</li>}
              {settings.phone && <li>{settings.phone}</li>}
              {settings.location && <li>{settings.location}</li>}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-cream-100/50">
        © {new Date().getFullYear()} Shewins. All rights reserved.
      </div>
    </footer>
  );
}
