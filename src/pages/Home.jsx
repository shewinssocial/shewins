import React from 'react';
import Navbar from '../components/public/Navbar.jsx';
import Hero from '../components/public/Hero.jsx';
import About from '../components/public/About.jsx';
import WhatWeDo from '../components/public/WhatWeDo.jsx';
import EventsSection from '../components/public/EventsSection.jsx';
import QuoteBreak from '../components/public/QuoteBreak.jsx';
import GallerySection from '../components/public/GallerySection.jsx';
import VideosSection from '../components/public/VideosSection.jsx';
import JoinSection from '../components/public/JoinSection.jsx';
import ContactSection from '../components/public/ContactSection.jsx';
import Footer from '../components/public/Footer.jsx';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <About />
        <WhatWeDo />
        <EventsSection />
        <QuoteBreak />
        <GallerySection />
        <VideosSection />
        <JoinSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

