'use client';

import { useState, useSyncExternalStore } from 'react';
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
  const isBefore = useSyncExternalStore(
    () => () => {},
    () => Date.now() < BIRTHDAY.getTime(),
    () => true,
  );
  const [expired, setExpired] = useState(false);

  if (isBefore && !expired) {
    return <BirthdayCountdown onExpired={() => setExpired(true)} />;
  }

  return <MainSite />;
}
