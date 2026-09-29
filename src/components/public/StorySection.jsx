import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eyebrow } from '../ui/Primitives.jsx';
import { getOptimizedImageUrl } from '../../lib/imageUrl.js';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Editorial Story Rows Configuration.
 * Creates the continuous Zig-Zag rhythm:
 * ROW 1: [ IMAGE ] [ TEXT ]
 * ROW 2: [ TEXT ]  [ IMAGE ]
 * ROW 3: [ IMAGE ] [ TEXT ]
 */
const STORY_ROWS = [
  {
    id: 'row-1',
    eyebrow: 'Our Foundation',
    headline: 'Built by women, for women.',
    paragraph:
      'SheWins was founded on the belief that when women have access to genuine community, shared knowledge, and collaborative networks, their growth is exponential. We create spaces where ideas flourish and connections turn into lifelong opportunities.',
    image: '/women-group-1.jpg',
    imageAlt: 'Women from the Shewins community gathered together, smiling and connecting',
    layout: 'image-left',
  },
  {
    id: 'row-2',
    eyebrow: 'The Connection',
    headline: 'Real growth happens in rooms where you don’t have to prove your worth.',
    paragraph:
      'We dismantle the friction of traditional networking. In SheWins, conversations are candid, collaborations are genuine, and members lift each other across industries, backgrounds, and stages of business.',
    image: '/women-group-11.jpeg',
    imageAlt: 'SheWins community members collaborating and sharing insights at an intimate gathering',
    layout: 'image-right',
  },
  {
    id: 'row-3',
    eyebrow: 'The Horizon',
    headline: 'When one woman wins, she clears the path for ten more.',
    paragraph:
      'From emerging founders to seasoned corporate executives, our ecosystem creates pathways for mentorship, capital access, and collective influence that ripple through communities and future generations.',
    image: '/women-group-14.jpeg',
    imageAlt: 'SheWins community members celebrating milestones and leadership together',
    layout: 'image-left',
  },
];

export default function StorySection() {
  const sectionRef = useRef(null);

  // Transition Layer (travels between Hero and Row 1)
  const travelImageRef = useRef(null);

  // Row 1 Refs
  const row1Ref = useRef(null);
  const row1SlotRef = useRef(null);
  const row1StaticImageRef = useRef(null);
  const row1TextRef = useRef(null);

  // Row 2 Refs
  const row2Ref = useRef(null);
  const row2CardRef = useRef(null);
  const row2TextRef = useRef(null);

  // Row 3 Refs
  const row3Ref = useRef(null);
  const row3CardRef = useRef(null);
  const row3TextRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Accessibility: fallback to static editorial layout if reduced motion is requested
      if (prefersReducedMotion) {
        const heroCard = document.getElementById('hero-media-card');
        if (heroCard) heroCard.style.opacity = '1';
        if (row1StaticImageRef.current) row1StaticImageRef.current.style.opacity = '1';
        if (row1TextRef.current) gsap.set(row1TextRef.current, { opacity: 1, y: 0 });
        if (row2CardRef.current) gsap.set(row2CardRef.current, { opacity: 1, y: 0, scale: 1 });
        if (row2TextRef.current) gsap.set(row2TextRef.current, { opacity: 1, y: 0 });
        if (row3CardRef.current) gsap.set(row3CardRef.current, { opacity: 1, y: 0, scale: 1 });
        if (row3TextRef.current) gsap.set(row3TextRef.current, { opacity: 1, y: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      // ====================================================
      // 1. DESKTOP EXPERIENCE (>= 1024px)
      // Hero Image (Right) seamlessly travels to Row 1 (Left)
      // ====================================================
      mm.add('(min-width: 1024px)', () => {
        const heroCard = document.getElementById('hero-media-card');
        const heroText = document.getElementById('hero-text-column');
        const row1Slot = row1SlotRef.current;
        const travelImg = travelImageRef.current;
        const staticImg = row1StaticImageRef.current;
        const row1Text = row1TextRef.current;

        if (!heroCard || !row1Slot || !travelImg) return;

        // Dynamic metric calculation based on actual DOM bounds
        const getDesktopMetrics = () => {
          const heroR = heroCard.getBoundingClientRect();
          const slotR = row1Slot.getBoundingClientRect();
          const scrollY = window.scrollY || window.pageYOffset;
          return {
            startX: heroR.left,
            startY: heroR.top + scrollY,
            startW: heroR.width,
            startH: heroR.height,
            targetX: slotR.left,
            targetY: (window.innerHeight - slotR.height) / 2,
            targetW: slotR.width,
            targetH: slotR.height,
          };
        };

        // Initial states
        gsap.set(travelImg, { opacity: 0, pointerEvents: 'none', x: 0, y: 0 });
        gsap.set(staticImg, { opacity: 0 });
        gsap.set(row1Text, { opacity: 0, y: 25 });

        // ScrollTrigger scrubbed timeline for Hero -> Row 1 transition
        const desktopTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            endTrigger: row1Slot,
            end: 'center center',
            scrub: 1.2,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress <= 0.001) {
                heroCard.style.opacity = '1';
                travelImg.style.opacity = '0';
                staticImg.style.opacity = '0';
              } else if (self.progress >= 0.999) {
                heroCard.style.opacity = '0';
                travelImg.style.opacity = '0';
                staticImg.style.opacity = '1';
              }
            },
          },
        });

        // Invisible crossfade at start of scroll (Hero card -> Travel card)
        desktopTl.fromTo(
          heroCard,
          { opacity: 1 },
          { opacity: 0, duration: 0.06, ease: 'power1.out' },
          0
        );
        desktopTl.fromTo(
          travelImg,
          { opacity: 0 },
          { opacity: 1, duration: 0.06, ease: 'power1.out' },
          0
        );

        // Hero text gently recedes as the image travels downward
        if (heroText) {
          desktopTl.to(
            heroText,
            {
              opacity: 0.2,
              y: -30,
              duration: 0.45,
              ease: 'power1.out',
            },
            0
          );
        }

        // Shared Image physically travels across and into Row 1 slot
        desktopTl.fromTo(
          travelImg,
          {
            x: () => getDesktopMetrics().startX,
            y: () => getDesktopMetrics().startY,
            width: () => getDesktopMetrics().startW,
            height: () => getDesktopMetrics().startH,
          },
          {
            x: () => getDesktopMetrics().targetX,
            y: () => getDesktopMetrics().targetY,
            width: () => getDesktopMetrics().targetW,
            height: () => getDesktopMetrics().targetH,
            ease: 'power1.inOut',
            duration: 1,
          },
          0
        );

        // Row 1 text reveals subtly as the image reaches position
        desktopTl.fromTo(
          row1Text,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
          },
          0.65
        );

        // Seamless handoff at destination into static Row 1 image
        desktopTl.to(travelImg, { opacity: 0, duration: 0.06, ease: 'power1.in' }, 0.94);
        desktopTl.fromTo(staticImg, { opacity: 0 }, { opacity: 1, duration: 0.06, ease: 'power1.in' }, 0.94);
      });

      // ====================================================
      // 2. MOBILE & TABLET EXPERIENCE (< 1024px)
      // Vertical stack transition, zero horizontal overflow
      // ====================================================
      mm.add('(max-width: 1023px)', () => {
        const heroCard = document.getElementById('hero-media-card');
        const heroText = document.getElementById('hero-text-column');
        const row1Slot = row1SlotRef.current;
        const travelImg = travelImageRef.current;
        const staticImg = row1StaticImageRef.current;
        const row1Text = row1TextRef.current;

        if (!heroCard || !row1Slot || !travelImg) return;

        const getMobileMetrics = () => {
          const heroR = heroCard.getBoundingClientRect();
          const slotR = row1Slot.getBoundingClientRect();
          const scrollY = window.scrollY || window.pageYOffset;
          return {
            startX: heroR.left,
            startY: heroR.top + scrollY,
            startW: heroR.width,
            startH: heroR.height,
            targetX: slotR.left,
            targetY: (window.innerHeight - slotR.height) / 2,
            targetW: slotR.width,
            targetH: slotR.height,
          };
        };

        gsap.set(travelImg, { opacity: 0, pointerEvents: 'none', x: 0, y: 0 });
        gsap.set(staticImg, { opacity: 0 });
        gsap.set(row1Text, { opacity: 0, y: 20 });

        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            endTrigger: row1Slot,
            end: 'center center',
            scrub: 1.1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress <= 0.001) {
                heroCard.style.opacity = '1';
                travelImg.style.opacity = '0';
                staticImg.style.opacity = '0';
              } else if (self.progress >= 0.999) {
                heroCard.style.opacity = '0';
                travelImg.style.opacity = '0';
                staticImg.style.opacity = '1';
              }
            },
          },
        });

        mobileTl.fromTo(heroCard, { opacity: 1 }, { opacity: 0, duration: 0.08, ease: 'power1.out' }, 0);
        mobileTl.fromTo(travelImg, { opacity: 0 }, { opacity: 1, duration: 0.08, ease: 'power1.out' }, 0);

        if (heroText) {
          mobileTl.to(heroText, { opacity: 0.25, y: -20, duration: 0.4 }, 0);
        }

        mobileTl.fromTo(
          travelImg,
          {
            x: () => getMobileMetrics().startX,
            y: () => getMobileMetrics().startY,
            width: () => getMobileMetrics().startW,
            height: () => getMobileMetrics().startH,
          },
          {
            x: () => getMobileMetrics().targetX,
            y: () => getMobileMetrics().targetY,
            width: () => getMobileMetrics().targetW,
            height: () => getMobileMetrics().targetH,
            ease: 'power1.inOut',
            duration: 1,
          },
          0
        );

        mobileTl.fromTo(row1Text, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.65);
        mobileTl.to(travelImg, { opacity: 0, duration: 0.08, ease: 'power1.in' }, 0.92);
        mobileTl.fromTo(staticImg, { opacity: 0 }, { opacity: 1, duration: 0.08, ease: 'power1.in' }, 0.92);
      });

      // ====================================================
      // 3. ROW 2 REVEAL (REVERSE DIRECTION: TEXT -> IMAGE)
      // ====================================================
      if (row2Ref.current && row2CardRef.current && row2TextRef.current) {
        gsap.fromTo(
          row2CardRef.current,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row2Ref.current,
              start: 'top 78%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        gsap.fromTo(
          row2TextRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row2Ref.current,
              start: 'top 78%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }

      // ====================================================
      // 4. ROW 3 REVEAL (ORIGINAL DIRECTION: IMAGE -> TEXT)
      // ====================================================
      if (row3Ref.current && row3CardRef.current && row3TextRef.current) {
        gsap.fromTo(
          row3CardRef.current,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row3Ref.current,
              start: 'top 78%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        gsap.fromTo(
          row3TextRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row3Ref.current,
              start: 'top 78%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  const row1 = STORY_ROWS[0];
  const row2 = STORY_ROWS[1];
  const row3 = STORY_ROWS[2];

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative py-16 sm:py-24 lg:py-32 bg-[#FCFBF8] overflow-hidden"
    >
      {/* ---------------------------------------------------- */}
      {/* FLOATING SHARED-IMAGE TRANSITION LAYER                */}
      {/* Visually travels from Hero into Row 1 position        */}
      {/* ---------------------------------------------------- */}
      <div
        ref={travelImageRef}
        className="fixed top-0 left-0 pointer-events-none rounded-xl2 overflow-hidden shadow-soft z-40 opacity-0 will-change-transform"
        style={{ top: 0, left: 0 }}
        aria-hidden="true"
      >
        <img
          src={getOptimizedImageUrl(row1.image, 1200)}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col gap-16 sm:gap-24 lg:gap-28">
        {/* ================================================== */}
        {/* ROW 1: [ IMAGE ] [ TEXT / QUOTE ]                  */}
        {/* Destination of the Hero Image                      */}
        {/* ================================================== */}
        <div
          id="story-row-1"
          ref={row1Ref}
          className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* Column 1: Image Slot */}
          <div
            ref={row1SlotRef}
            className="relative rounded-xl2 overflow-hidden shadow-soft h-[260px] sm:h-[320px] lg:h-[360px] xl:h-[380px] w-full max-w-sm sm:max-w-md lg:max-w-[420px] aspect-[4/3] max-h-[380px] group lg:mr-auto mx-auto"
          >
            <img
              ref={row1StaticImageRef}
              src={getOptimizedImageUrl(row1.image, 1200)}
              alt={row1.imageAlt}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-0"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Column 2: Text / Quote */}
          <div
            ref={row1TextRef}
            className="flex flex-col gap-4 sm:gap-5 will-change-transform"
          >
            <div>
              <Eyebrow>{row1.eyebrow}</Eyebrow>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-3xl lg:text-[2.2rem] xl:text-[2.4rem] font-semibold text-ink leading-[1.18] tracking-tight">
              {row1.headline}
            </h2>
            <p className="text-ink-soft text-base lg:text-base xl:text-lg leading-relaxed mt-1 sm:mt-2 max-w-lg">
              {row1.paragraph}
            </p>
          </div>
        </div>

        {/* ================================================== */}
        {/* ROW 2: [ TEXT / QUOTE ] [ IMAGE ]                  */}
        {/* Reverse Composition                                */}
        {/* ================================================== */}
        <div
          id="story-row-2"
          ref={row2Ref}
          className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* Column 1: Text / Quote (order-2 on mobile, order-1 on desktop) */}
          <div
            ref={row2TextRef}
            className="flex flex-col gap-4 sm:gap-5 order-2 lg:order-1 will-change-transform"
          >
            <div>
              <Eyebrow>{row2.eyebrow}</Eyebrow>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-3xl lg:text-[2.2rem] xl:text-[2.4rem] font-semibold text-ink leading-[1.18] tracking-tight">
              {row2.headline}
            </h2>
            <p className="text-ink-soft text-base lg:text-base xl:text-lg leading-relaxed mt-1 sm:mt-2 max-w-lg">
              {row2.paragraph}
            </p>
          </div>

          {/* Column 2: Image Card (order-1 on mobile, order-2 on desktop) */}
          <div
            ref={row2CardRef}
            className="relative rounded-xl2 overflow-hidden shadow-soft h-[260px] sm:h-[320px] lg:h-[360px] xl:h-[380px] w-full max-w-sm sm:max-w-md lg:max-w-[420px] aspect-[4/3] max-h-[380px] group order-1 lg:order-2 will-change-transform lg:ml-auto mx-auto"
          >
            <img
              src={getOptimizedImageUrl(row2.image, 1200)}
              alt={row2.imageAlt}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ================================================== */}
        {/* ROW 3: [ IMAGE ] [ TEXT / QUOTE ]                  */}
        {/* Return to Original Composition                     */}
        {/* ================================================== */}
        <div
          id="story-row-3"
          ref={row3Ref}
          className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* Column 1: Image Card */}
          <div
            ref={row3CardRef}
            className="relative rounded-xl2 overflow-hidden shadow-soft h-[260px] sm:h-[320px] lg:h-[360px] xl:h-[380px] w-full max-w-sm sm:max-w-md lg:max-w-[420px] aspect-[4/3] max-h-[380px] group will-change-transform lg:mr-auto mx-auto"
          >
            <img
              src={getOptimizedImageUrl(row3.image, 1200)}
              alt={row3.imageAlt}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Column 2: Text / Quote */}
          <div
            ref={row3TextRef}
            className="flex flex-col gap-4 sm:gap-5 will-change-transform"
          >
            <div>
              <Eyebrow>{row3.eyebrow}</Eyebrow>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-3xl lg:text-[2.2rem] xl:text-[2.4rem] font-semibold text-ink leading-[1.18] tracking-tight">
              {row3.headline}
            </h2>
            <p className="text-ink-soft text-base lg:text-base xl:text-lg leading-relaxed mt-1 sm:mt-2 max-w-lg">
              {row3.paragraph}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
