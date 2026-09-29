import React, { useEffect, useState } from 'react';
import { listGallery } from '../../data/api.js';
import { getOptimizedImageUrl } from '../../lib/imageUrl.js';
import CircularSplitRoll from '@/components/ui/circular-split-roll';

const FALLBACK_ITEMS = [
  { id: 0, title: 'Leadership Circle', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', alt: 'Leadership Circle' },
  { id: 1, title: 'Voices of Strength', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', alt: 'Voices of Strength' },
  { id: 2, title: 'Collaborative Growth', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', alt: 'Collaborative Growth' },
  { id: 3, title: 'Aspire & Empower', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', alt: 'Aspire & Empower' },
  { id: 4, title: 'Unified Vision', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80', alt: 'Unified Vision' },
  { id: 5, title: 'Creative Horizons', image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80', alt: 'Creative Horizons' },
  { id: 6, title: 'Annual Gala Moments', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80', alt: 'Annual Gala Moments' },
  { id: 7, title: 'Community Roots', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80', alt: 'Community Roots' },
  { id: 8, title: 'Executive Fellowship', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80', alt: 'Executive Fellowship' },
  { id: 9, title: 'Next Gen Leaders', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', alt: 'Next Gen Leaders' },
];

export default function GallerySection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Cloudinary images from Supabase
  useEffect(() => {
    let mounted = true;
    listGallery()
      .then((data) => {
        if (!mounted) return;
        setItems(data || []);
      })
      .catch((err) => {
        console.error('Gallery fetch error:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Format images from Cloudinary database items, falling back to curated images
  const galleryItems =
    items && items.length > 0
      ? items.map((item, index) => ({
          id: item.id || index,
          title: item.title || item.category || FALLBACK_ITEMS[index % FALLBACK_ITEMS.length].title,
          image: getOptimizedImageUrl(item.image, 1200) || item.image || FALLBACK_ITEMS[index % FALLBACK_ITEMS.length].image,
          alt: item.title || item.caption || `SeaWINS Photo ${index + 1}`,
        }))
      : FALLBACK_ITEMS;

  return (
    <div id="gallery" className="relative w-full bg-[#fdfbf7]">
      <CircularSplitRoll
        items={galleryItems}
        radius={500}
        cardSize={205}
        textSideScale={0.68}
        textSideOpacity={0.18}
        background="#fdfbf7"
        titleColor="#1a1a1a"
      />
    </div>
  );
}
