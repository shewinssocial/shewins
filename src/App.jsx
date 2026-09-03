// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Home from './pages/Home.jsx';
// import NotFound from './pages/NotFound.jsx';
// import AdminLogin from './pages/admin/AdminLogin.jsx';
// import Dashboard from './pages/admin/Dashboard.jsx';
// import EventsManager from './pages/admin/EventsManager.jsx';
// import GalleryManager from './pages/admin/GalleryManager.jsx';
// import VideosManager from './pages/admin/VideosManager.jsx';
// import EnquiriesManager from './pages/admin/EnquiriesManager.jsx';
// import ProtectedRoute from './components/admin/ProtectedRoute.jsx';

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />

//       <Route path="/admin/login" element={<AdminLogin />} />
//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/events"
//         element={
//           <ProtectedRoute>
//             <EventsManager />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/gallery"
//         element={
//           <ProtectedRoute>
//             <GalleryManager />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/videos"
//         element={
//           <ProtectedRoute>
//             <VideosManager />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/enquiries"
//         element={
//           <ProtectedRoute>
//             <EnquiriesManager />
//           </ProtectedRoute>
//         }
//       />

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }


import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import EventsManager from './pages/admin/EventsManager.jsx';
import GalleryManager from './pages/admin/GalleryManager.jsx';
import VideosManager from './pages/admin/VideosManager.jsx';
import EnquiriesManager from './pages/admin/EnquiriesManager.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';

// Premium brand reveal duration on first visit — allows the logo to scale
// gracefully (small -> normal -> slight pop) and blur-to-sharp before lifting.
// On subsequent page transitions or returns, sessionStorage skips this completely.
const BRAND_REVEAL_MS = 1100;

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const loader = document.getElementById('app-loader');
    if (!loader) return undefined;

    // If previously viewed in this browser session, dismiss immediately without wait
    if (sessionStorage.getItem('shewins_loaded') === 'true') {
      loader.remove();
      return undefined;
    }

    const startedAt = window.__appLoaderStart || Date.now();
    const remaining = Math.max(BRAND_REVEAL_MS - (Date.now() - startedAt), 0);

    const hideTimer = setTimeout(() => {
      loader.classList.add('app-loader-hidden');
      try {
        sessionStorage.setItem('shewins_loaded', 'true');
      } catch (e) {}

      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
      setTimeout(() => loader.remove(), 700);
    }, remaining);

    return () => clearTimeout(hideTimer);
  }, []);

  // Handle route change scroll position
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  return (
    <div className="motion-page-container transition-opacity duration-300">
    <Routes>
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
    </div>
  );
}