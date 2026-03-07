'use client';

import { useState } from 'react';
import ScheduleSection from './ScheduleSection';
import ChekiCount from './ChekiCount';

const TABS = [
  { id: 'cheki',    label: '📸 Cheki Count' },
  { id: 'schedule', label: '📅 Schedule' },
];

export default function ToolsSection() {
  const [activeTab, setActiveTab] = useState('cheki');

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
        {activeTab === 'cheki'    && <ChekiCount />}
        {activeTab === 'schedule' && <ScheduleSection />}
      </div>
    </section>
  );
}
