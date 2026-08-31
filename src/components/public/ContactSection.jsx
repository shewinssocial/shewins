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
           
          

          <div className="flex flex-col gap-4 relative">
            {settings ? (
              <>
                {settings.email && (
                  <ContactRow label="Email" value={settings.email} href={`mailto:${settings.email}`} />
                )}
                {settings.phone && <ContactRow label="Phone" value={settings.phone} href={`tel:${settings.phone}`} />}
                {settings.location && <ContactRow label="Location" value={settings.location} />}
                {(settings.instagram || settings.linkedin || settings.facebook) && (
                  <div className="flex gap-3 pt-2">
                    {settings.instagram && <SocialLink href={settings.instagram} label="Instagram" />}
                    {settings.linkedin && <SocialLink href={settings.linkedin} label="LinkedIn" />}
                    {settings.facebook && <SocialLink href={settings.facebook} label="Facebook" />}
                  </div>
                )}
                
              </>
            ) : (
              <div   />
            )}
          </div>
        
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
