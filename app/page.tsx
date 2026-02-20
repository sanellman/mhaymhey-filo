'use client';

import { useState, useEffect } from 'react';
import BirthdayCountdown from './components/BirthdayCountdown';
import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FactsSection from './components/FactsSection';
import GallerySection from './components/GallerySection';
import ScheduleSection from './components/ScheduleSection';
import ChekiSection from './components/ChekiSection';

const BIRTHDAY = new Date(2026, 3, 6, 0, 0, 0); // April 6, 2026

const TABS = [
  { id: 'schedule', label: '📅 Schedule' },
  { id: 'cheki',    label: '📸 Cheki Count' },
];

function ToolsSection() {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <section id="tools" className="px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4 bg-white/10 rounded-2xl p-1.5 border border-white/15">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1B90C8] text-white shadow'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'schedule' && <ScheduleSection />}
        {activeTab === 'cheki'    && <ChekiSection />}
      </div>
    </section>
  );
}

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
