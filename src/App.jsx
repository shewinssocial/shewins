import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import EventsManager from './pages/admin/EventsManager.jsx';
import GalleryManager from './pages/admin/GalleryManager.jsx';
import VideosManager from './pages/admin/VideosManager.jsx';
import EnquiriesManager from './pages/admin/EnquiriesManager.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import CinematicIntro from './components/public/CinematicIntro.jsx';
import SmoothScroll from './components/public/SmoothScroll.jsx';

export default function App() {
  const location = useLocation();

  const [showIntro, setShowIntro] = React.useState(() => {
    try {
      if (typeof window !== 'undefined') {
        if (window.location.pathname.startsWith('/admin')) {
          return false;
        }
        // Remove stale localStorage flag
        try { localStorage.removeItem('shewings_intro_played'); } catch (e) {}

        // Check if intro has already played in this browser session
        const hasPlayedThisSession = sessionStorage.getItem('shewings_intro_played');
        if (hasPlayedThisSession) {
          return false;
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const loader = document.getElementById('app-loader');
    if (loader) loader.remove();

    if (typeof window !== 'undefined') {
      // Mark as played immediately so refresh during intro skips replay
      if (showIntro) {
        try { sessionStorage.setItem('shewings_intro_played', 'true'); } catch (e) {}
      }

      // Developer helper: run resetIntro() in console to replay
      window.resetIntro = () => {
        try {
          sessionStorage.removeItem('shewings_intro_played');
          localStorage.removeItem('shewings_intro_played');
          window.location.reload();
        } catch (e) {}
      };
    }
  }, [showIntro]);

  /**
   * Called by CinematicIntro when the video + logo animation completes.
   * Dispatches after two rAF frames so Hero's useLayoutEffect has already
   * set initial hidden states BEFORE the animation event fires.
   */
  const handleIntroComplete = () => {
    setShowIntro(false);
    if (typeof window !== 'undefined') {
      try { sessionStorage.setItem('shewings_intro_played', 'true'); } catch (e) {}
      window.__shewingsIntroCompleted = true;
      // Double rAF ensures Hero layout effects (which set opacity: 0) have run
      // before we trigger the reveal animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.dispatchEvent(new CustomEvent('shewings:intro-complete'));
        });
      });
    }
  };

  /**
   * When intro is SKIPPED (already played in this session), dispatch the event
   * after a small delay so all child layout effects have settled first.
   */
  useEffect(() => {
    if (!showIntro && typeof window !== 'undefined') {
      window.__shewingsIntroCompleted = true;
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('shewings:intro-complete'));
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  // Scroll to top on route changes (not hash links)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  const routeKey = location.pathname.startsWith('/admin') ? location.pathname : 'public-root';

  return (
    <>
      {/*
        CinematicIntro renders OUTSIDE SmoothScroll so Lenis's
        overflow control never interferes with video autoplay.
      */}
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}

      <SmoothScroll isPaused={showIntro}>
        <motion.div
          initial={{ opacity: 0.9, scale: 0.996 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="motion-page-container"
        >
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={routeKey}>
              <Route path="/" element={<Home />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute>
                    <EventsManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/gallery"
                element={
                  <ProtectedRoute>
                    <GalleryManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/videos"
                element={
                  <ProtectedRoute>
                    <VideosManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/enquiries"
                element={
                  <ProtectedRoute>
                    <EnquiriesManager />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </motion.div>
      </SmoothScroll>
    </>
  );
}