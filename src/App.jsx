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
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import EventsManager from './pages/admin/EventsManager.jsx';
import GalleryManager from './pages/admin/GalleryManager.jsx';
import VideosManager from './pages/admin/VideosManager.jsx';
import EnquiriesManager from './pages/admin/EnquiriesManager.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';

// Minimum time the splash in index.html stays visible, so a fast load
// doesn't just flash it for a frame — but it never waits longer than the
// app actually took to mount. See the #app-loader markup in index.html.
const MIN_SPLASH_MS = 500;

export default function App() {
  useEffect(() => {
    const loader = document.getElementById('app-loader');
    if (!loader) return undefined;

    const startedAt = window.__appLoaderStart || Date.now();
    const remaining = Math.max(MIN_SPLASH_MS - (Date.now() - startedAt), 0);

    const hideTimer = setTimeout(() => {
      loader.classList.add('app-loader-hidden');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
      // Fallback in case transitionend doesn't fire (e.g. reduced-motion).
      setTimeout(() => loader.remove(), 600);
    }, remaining);
    
    return () => clearTimeout(hideTimer);
  }, []);

  return (
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
  );
}