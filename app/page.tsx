'use client';

import { useState, useEffect } from 'react';
import BirthdayCountdown from './components/BirthdayCountdown';
import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FactsSection from './components/FactsSection';
import GallerySection from './components/GallerySection';
import ToolsSection from './components/ToolsSection';

const BIRTHDAY = new Date(2026, 3, 6, 0, 0, 0); // April 6, 2026

function MainSite() {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <FactsSection />
      <GallerySection />
      <ToolsSection />
    </Layout>
  );
}

export default function Home() {
  // null = not yet determined (SSR safe), true = show countdown, false = show main site
  const [showCountdown, setShowCountdown] = useState<boolean | null>(null);

  useEffect(() => {
    setShowCountdown(Date.now() < BIRTHDAY.getTime());
  }, []);

  // Avoid SSR mismatch — render nothing on server
  if (showCountdown === null) return null;

  if (showCountdown) {
    return (
      <BirthdayCountdown onExpired={() => setShowCountdown(false)} />
    );
  }

  return <MainSite />;
}
