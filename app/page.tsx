'use client';

import { useState, useSyncExternalStore } from 'react';
import BirthdayCountdown from './components/BirthdayCountdown';
import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FactsSection from './components/FactsSection';
import GallerySection from './components/GallerySection';
import ToolsSection from './components/ToolsSection';
import RunnerGame from './components/RunnerGame';

const BIRTHDAY = new Date(2026, 3, 6, 0, 0, 0); // April 6, 2026

function MainSite() {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <FactsSection />
      <GallerySection />
      <ToolsSection />
      <section className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="w-full flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[#72C4E8] text-xs font-bold tracking-widest">🎮 FAN GAME</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <RunnerGame />
        </div>
      </section>
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
