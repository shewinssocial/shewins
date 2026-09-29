import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CinematicIntro({ onComplete }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const centerLogoWrapRef = useRef(null);
  const centerLogoImgRef = useRef(null);
  const timelineRef = useRef(null);
  const hasTransitioned = useRef(false);
  const hasZoomedOut = useRef(false);

  // Responsive detection: < 768px is mobile view
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Keep responsive state in sync if window resizes or devtools device toolbar is toggled
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile((prev) => (prev !== mobile ? mobile : prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    hasTransitioned.current = false;
    hasZoomedOut.current = false;

    // 1. Lock scrolling during intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Hide normal navbar logo initially to prevent any visible duplication
    const realNavbarLogo =
      document.getElementById('navbar-logo-img') || document.getElementById('navbar-logo');
    if (realNavbarLogo) {
      realNavbarLogo.style.opacity = '0';
    }

    const video = videoRef.current;
    const logoWrap = centerLogoWrapRef.current;
    const logoImg = centerLogoImgRef.current;
    const container = containerRef.current;

    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Center logo initial setup using GSAP percent-centering
    gsap.set(logoWrap, {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      opacity: 0,
      scale: 1.0, // Match exact scale with video logo
      transformOrigin: 'center center',
    });

    const triggerLogoTransition = () => {
      if (hasTransitioned.current) return;
      hasTransitioned.current = true;

      if (prefersReducedMotion) {
        const reducedTl = gsap.timeline({
          onComplete: () => {
            if (realNavbarLogo) realNavbarLogo.style.opacity = '1';
            document.body.style.overflow = originalOverflow;
            if (onComplete) onComplete();
          },
        });
        reducedTl.to(video, { opacity: 0, duration: 0.25 });
        reducedTl.to(container, { opacity: 0, duration: 0.3 }, '<');
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (video) video.pause();
          if (realNavbarLogo) realNavbarLogo.style.opacity = '1';
          document.body.style.overflow = originalOverflow;
          if (onComplete) onComplete();
        },
      });

      timelineRef.current = tl;

      // STEP 2 & 3: VIDEO ENDS & INVISIBLE CROSSFADE
      // Crossfade from the video to the DOM logo with zero positional/scale pop
      tl.to(
        video,
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        },
        0
      );

      tl.to(
        logoWrap,
        {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.inOut',
        },
        0
      );

      // Short hold at center so user registers the transition
      tl.to({}, { duration: 0.2 });

      // STEP 5: LOGO MOVES UPWARD & SHRINKS INTO NAVBAR BRAND POSITION
      tl.add(() => {
        const target =
          document.getElementById('navbar-logo-img') || document.getElementById('navbar-logo');

        let destX = 0;
        let destY = 0;
        let targetScale = 0.22;

        if (target && logoImg) {
          const targetRect = target.getBoundingClientRect();
          const centerRect = logoImg.getBoundingClientRect();

          if (centerRect.width > 0) {
            targetScale = targetRect.width / centerRect.width;
          }

          const targetCenterX = targetRect.left + targetRect.width / 2;
          const targetCenterY = targetRect.top + targetRect.height / 2;
          const currentCenterX = window.innerWidth / 2;
          const currentCenterY = window.innerHeight / 2;

          destX = targetCenterX - currentCenterX;
          destY = targetCenterY - currentCenterY;
        } else {
          const isMobileView = window.innerWidth < 768;
          const containerWidth = Math.min(window.innerWidth, 1152);
          destX = isMobileView ? window.innerWidth / -2 + 75 : containerWidth / -2 + 90;
          destY = window.innerHeight / -2 + 38;
          targetScale = 0.22;
        }

        gsap.to(logoWrap, {
          x: destX,
          y: destY,
          scale: targetScale,
          duration: 0.9,
          ease: 'power3.inOut',
        });

        gsap.to(container, {
          opacity: 0,
          duration: 0.75,
          delay: 0.1,
          ease: 'power2.inOut',
        });
      });

      tl.to({}, { duration: 0.95 });
    };

    // Video playback handling
    if (video) {
      // Explicitly set muted properties to guarantee mobile autoplay approval
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      video.addEventListener('ended', triggerLogoTransition);

      // Safety fallback in case ended event is missed or delayed, plus desktop 7.5-8s zoom out
      const handleTimeUpdate = () => {
        // Zoom out around 7th-8th second for Desktop to match center logo position & scale
        if (!isMobile && video.currentTime >= 7.5 && !hasZoomedOut.current) {
          hasZoomedOut.current = true;
          const w = window.innerWidth;
          const targetScale = w < 768 ? 0.9 : (w < 1024 ? 0.2 : 0.75);
          gsap.to(video, {
            scale: targetScale,
            duration: 1.5,
            ease: 'power2.inOut',
          });
        }

        // Trigger end transition slightly before true end for smoothness
        if (video.duration > 0 && video.currentTime >= video.duration - 0.1) {
          triggerLogoTransition();
        }
      };
      video.addEventListener('timeupdate', handleTimeUpdate);

      // Autoplay attempt
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy blocks autoplay or video fails, transition directly to logo
          triggerLogoTransition();
        });
      }

      // Hard safety timeout — if something goes wrong (network, codec, policy),
      // never leave the user on a blank white screen for more than 12 seconds.
      const hardTimeout = setTimeout(() => {
        triggerLogoTransition();
      }, 12000);

      return () => {
        clearTimeout(hardTimeout);
        video.removeEventListener('ended', triggerLogoTransition);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        if (timelineRef.current) {
          timelineRef.current.kill();
        }
        if (realNavbarLogo) {
          realNavbarLogo.style.opacity = '1';
        }
        document.body.style.overflow = originalOverflow;
      };
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (realNavbarLogo) {
        realNavbarLogo.style.opacity = '1';
      }
      document.body.style.overflow = originalOverflow;
    };
  }, [onComplete, isMobile]);

  const currentVideoSrc = isMobile ? '/intro mobile.mp4' : '/intro.mp4';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden"
    >
      {/*
        Responsive Intro Video:
        - Mobile View (< 768px): Uses "/intro mobile.mp4" (9:16 vertical) with object-contain.
        - Desktop View (>= 768px): Uses "/intro.mp4" (16:9 widescreen). Starts full-screen (object-cover)
          and smoothly zooms out at 7.5-8 seconds so the baked-in logo matches the center logo position/scale.
      */}
      <video
        ref={videoRef}
        key={isMobile ? 'intro-mobile' : 'intro-desktop'}
        src={currentVideoSrc}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        controls={false}
        loop={false}
        preload="auto"
        className={`absolute inset-0 w-full h-full z-[101] ${
          isMobile ? 'object-contain' : 'object-cover'
        }`}
        style={{
          objectPosition: 'center',
          transform: 'scale(1)',
        }}
      >
        <source src={currentVideoSrc} type="video/mp4" />
      </video>

      {/*
        Complete SeaWINS Brand Logo Asset:
        Uses the exact /sl2.png image asset. Matches the baked-in logo size at the end of the video,
        then seamlessly flies into the navbar brand position.
      */}
      <div
        ref={centerLogoWrapRef}
        className="fixed z-[110] flex items-center justify-center pointer-events-none select-none w-full"
        style={{
          left: '50%',
          top: '50%',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
        aria-hidden="true"
      >
        <img
          ref={centerLogoImgRef}
          src="/sl2.png"
          alt="SheWins — Women Forum"
          className="h-auto object-contain shrink-0 w-[60%] sm:w-[50%] md:w-[750px] lg:w-[900px] max-w-[90vw]"
          style={{ aspectRatio: '1878 / 829' }}
        />
      </div>
    </div>
  );
}