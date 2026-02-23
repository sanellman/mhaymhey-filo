'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import dayjs from 'dayjs';
import ScheduleSection from './ScheduleSection';
import { loadChekiData, saveChekiData, type ChekiAllData } from './ChekiSection';
import ChekiReport from './ChekiReport';

// April 6, 2026 00:00:00
const BIRTHDAY = new Date(2026, 3, 6, 0, 0, 0);

// Fixed sparkle positions to avoid hydration mismatch
const SPARKLES = [
  { x: '8%',  y: '12%', s: 5, d: 0,   dur: 3.2 },
  { x: '92%', y: '9%',  s: 4, d: 0.4, dur: 2.8 },
  { x: '18%', y: '55%', s: 3, d: 0.8, dur: 4.0 },
  { x: '78%', y: '45%', s: 6, d: 0.2, dur: 3.6 },
  { x: '50%', y: '6%',  s: 4, d: 1.0, dur: 2.5 },
  { x: '35%', y: '85%', s: 3, d: 0.6, dur: 3.9 },
  { x: '65%', y: '78%', s: 5, d: 1.4, dur: 3.1 },
  { x: '88%', y: '65%', s: 3, d: 0.3, dur: 4.2 },
  { x: '5%',  y: '80%', s: 4, d: 1.1, dur: 2.9 },
  { x: '95%', y: '32%', s: 3, d: 0.7, dur: 3.5 },
  { x: '42%', y: '22%', s: 4, d: 1.6, dur: 2.7 },
  { x: '72%', y: '18%', s: 3, d: 0.9, dur: 3.8 },
  { x: '28%', y: '38%', s: 5, d: 0.1, dur: 4.1 },
  { x: '58%', y: '92%', s: 3, d: 1.3, dur: 3.3 },
  { x: '15%', y: '28%', s: 4, d: 0.5, dur: 2.6 },
];

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number } | null;

function getTimeLeft(): TimeLeft {
  const diff = BIRTHDAY.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  };
}

function pad(n: number) { return String(n).padStart(2, '0'); }

// ─── Inline Cheki Count (shared data model with ChekiSection) ─────────────
function ChekiCount() {
  const today = dayjs().format('YYYY-MM-DD');
  const [date, setDate]       = useState(today);
  const [custom, setCustom]   = useState('');
  const [showSug, setShowSug] = useState(false);
  const [allData, setAllData] = useState<ChekiAllData>(loadChekiData);
  const [showReport, setShowReport] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const eventCount = Object.values(allData).filter(
    (d) => Object.keys(d.counts).length > 0
  ).length;

  const entry = allData[date] ?? { eventName: '', counts: {} };

  const knownMembers = [...new Set(
    Object.values(allData).flatMap((d) => Object.keys(d.counts))
  )];

  const suggestions = knownMembers.filter(
    (m) =>
      !(m in entry.counts) &&
      (custom.trim() === '' || m.toLowerCase().includes(custom.toLowerCase()))
  );

  const save = (next: typeof entry) => {
    const updated = { ...allData, [date]: next };
    setAllData(updated);
    saveChekiData(updated);
  };

  const addMember = (name: string) => {
    const t = name.trim();
    if (!t || t in entry.counts) return;
    save({ ...entry, counts: { ...entry.counts, [t]: 0 } });
    setCustom('');
    setShowSug(false);
    inputRef.current?.blur();
  };

  const addCheki = (member: string, delta: number) => {
    const current = entry.counts[member] ?? 0;
    save({ ...entry, counts: { ...entry.counts, [member]: Math.max(0, current + delta) } });
  };

  const removeMember = (member: string) => {
    if (!window.confirm(`Remove "${member}" from the list?`)) return;
    const counts = { ...entry.counts };
    delete counts[member];
    save({ ...entry, counts });
  };

  const memberList = Object.entries(entry.counts);
  const total = memberList.reduce((s, [, n]) => s + n, 0);

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#72C4E8] mb-0.5">Fan Tool</p>
          <h3 className="text-lg font-black text-white">📸 Cheki Count</h3>
          {total > 0 && <p className="text-sm text-[#72C4E8] font-semibold mt-0.5">Total: {total} pcs</p>}
        </div>
        <button
          onClick={() => setShowReport(true)}
          className="shrink-0 flex items-center gap-1.5 bg-white/10 hover:bg-[#1B90C8]/30 border border-white/15 hover:border-[#1B90C8]/50 text-white/70 hover:text-white rounded-xl px-3 py-2 text-xs font-bold transition"
        >
          📊 Report
          {eventCount > 0 && (
            <span className="bg-[#1B90C8] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
              {eventCount > 99 ? '99+' : eventCount}
            </span>
          )}
        </button>
      </div>

      {/* Date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full bg-white/10 border border-white/20 text-white text-center rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#72C4E8] [color-scheme:dark]"
      />

      {/* Input + suggestions */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={custom}
            onChange={(e) => { setCustom(e.target.value); setShowSug(true); }}
            onFocus={() => setShowSug(true)}
            onBlur={() => setTimeout(() => setShowSug(false), 150)}
            onKeyDown={(e) => e.key === 'Enter' && addMember(custom)}
            placeholder="Member name..."
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#72C4E8]"
          />
          <button
            onClick={() => addMember(custom)}
            disabled={!custom.trim()}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20 disabled:opacity-30 transition"
          >
            Add
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {showSug && suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-[#0A1E2E] border border-white/20 rounded-xl overflow-hidden shadow-2xl">
            {suggestions.map((s) => (
              <button
                key={s}
                onMouseDown={() => addMember(s)}
                className="block w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Empty */}
      {memberList.length === 0 && (
        <p className="text-center text-white/40 text-sm py-4">No members yet</p>
      )}

      {/* Cards */}
      <div className="space-y-2">
        {memberList.map(([member, count]) => (
          <div key={member} className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 flex items-center gap-2">
            <p className="flex-1 font-semibold text-white text-sm truncate">{member}</p>
            <button onClick={() => addCheki(member, -1)} disabled={count === 0} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white text-lg font-black hover:bg-white/20 disabled:opacity-30 transition flex items-center justify-center shrink-0">−</button>
            <div className="w-12 text-center shrink-0">
              <span className="text-2xl font-black text-white tabular-nums">{count}</span>
              <p className="text-[9px] text-[#72C4E8] leading-none">pcs</p>
            </div>
            <button onClick={() => addCheki(member, +1)} className="w-8 h-8 rounded-full bg-[#1B90C8] text-white text-lg font-black hover:bg-[#0F75A8] transition shadow flex items-center justify-center shrink-0">+</button>
            <button onClick={() => removeMember(member)} className="w-6 h-6 rounded-full bg-white/10 text-white/30 hover:bg-red-500/30 hover:text-red-400 text-[10px] transition flex items-center justify-center shrink-0" title="Remove">✕</button>
          </div>
        ))}
      </div>

      <ChekiReport
        open={showReport}
        onClose={() => setShowReport(false)}
        allData={allData}
      />
    </div>
  );
}

const TOOL_TABS = [
  { id: 'cheki',    label: '📸 Cheki Count' },
  { id: 'schedule', label: '📅 Schedule' },
];

// ─── Main Countdown ────────────────────────────────────────────────────────
export default function BirthdayCountdown({ onExpired }: { onExpired: () => void }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('cheki');

  useEffect(() => {
    setMounted(true);
    const tl = getTimeLeft();
    if (!tl) { onExpired(); return; }
    setTimeLeft(tl);

    const id = setInterval(() => {
      const next = getTimeLeft();
      if (!next) { clearInterval(id); onExpired(); return; }
      setTimeLeft(next);
    }, 1000);

    return () => clearInterval(id);
  }, [onExpired]);

  if (!mounted) return null;

  const units = timeLeft
    ? [
        { label: 'วัน',   value: timeLeft.days    },
        { label: 'ชั่วโมง', value: timeLeft.hours  },
        { label: 'นาที',   value: timeLeft.minutes },
        { label: 'วินาที', value: timeLeft.seconds },
      ]
    : [];

  return (
    <AnimatePresence>
      <motion.div
        key="countdown"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-50 bg-[#04111F] overflow-y-auto"
      >
        {/* Sparkle particles */}
        {SPARKLES.map((sp, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#72C4E8] pointer-events-none"
            style={{ left: sp.x, top: sp.y, width: sp.s, height: sp.s }}
            animate={{ y: [0, -14, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ repeat: Infinity, duration: sp.dur, delay: sp.d, ease: 'easeInOut' }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-10 pb-16 px-4 gap-8">

          {/* Image + title */}
          <div className="flex flex-col items-center gap-4">
            <motion.div
              className="relative"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl bg-[#1B90C8]/40 blur-2xl scale-110" />
              <Image
                src="/mm.png"
                alt="mhaymhey"
                width={220}
                height={280}
                className="relative w-44 md:w-56 rounded-3xl border-2 border-[#1B90C8]/60 object-cover shadow-2xl"
                priority
              />
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-[#72C4E8] bg-white/10 border border-white/15 px-3 py-1 rounded-full mb-2">
                Stellagrima 💙
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                ✦ mhaymhey
              </h1>
              <p className="text-[#72C4E8] text-sm font-semibold mt-1 tracking-widest">
                ✦ Countdown to mhaymhey day
              </p>
              <p className="text-white/40 text-xs mt-0.5 tracking-widest">
                🎂 06 APR 2026
              </p>
            </motion.div>
          </div>

          {/* Countdown boxes */}
          {timeLeft && (
            <motion.div
              className="flex gap-3 md:gap-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {units.map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 border border-[#1B90C8]/50 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <span className="text-2xl md:text-3xl font-black text-white tabular-nums">
                      {pad(value)}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#72C4E8] font-semibold mt-1.5 tracking-wide">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Divider */}
          <div className="w-full max-w-2xl flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[#72C4E8] text-xs font-bold tracking-widest">💙 FAN TOOLS</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Tabbed tools */}
          <motion.div
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {/* Tab bar */}
            <div className="flex gap-2 mb-4 bg-white/10 rounded-2xl p-1.5 border border-white/15">
              {TOOL_TABS.map((tab) => (
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
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
