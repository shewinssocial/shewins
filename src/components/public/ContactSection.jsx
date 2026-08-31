import React, { useEffect, useState } from 'react';
import { getSettings } from '../../data/api.js';
import { SectionHeading, Button } from '../ui/Primitives.jsx';
import useReveal from '../../hooks/useReveal.js';

export default function ContactSection() {
  const [settings, setSettings] = useState(null);
  const ref = useReveal();

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
    <section  >
      <div >
           
          

           
        
      </div>
    </section>
  );
}

function ContactRow({ label, value, href }) {
  const content = href ? (
    <a href={href} className="hover:underline">
      {value}
    </a>
  ) : (
    value
  );
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-white/60">{label}</p>
      <p className="text-lg font-medium">{content}</p>
    </div>
  );
}

function SocialLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-xs font-semibold focus-ring"
      aria-label={label}
    >
      {label[0]}
    </a>
  );
}
