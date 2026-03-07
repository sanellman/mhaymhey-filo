'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import type { ChekiAllData } from './ChekiSection';

type Tab = 'overview' | 'monthly' | 'events';

// ─── Data helpers ─────────────────────────────────────────────────────────────

function getEvents(allData: ChekiAllData) {
  return Object.entries(allData)
    .filter(([, d]) => Object.keys(d.counts).length > 0)
    .sort(([a], [b]) => b.localeCompare(a)); // newest first
}

function sumCounts(counts: Record<string, number>) {
  return Object.values(counts).reduce((s, n) => s + n, 0);
}

function getMemberTotals(events: ReturnType<typeof getEvents>) {
  const totals: Record<string, number> = {};
  for (const [, d] of events) {
    for (const [m, n] of Object.entries(d.counts)) {
      totals[m] = (totals[m] ?? 0) + n;
    }
  }
  return Object.entries(totals).sort(([, a], [, b]) => b - a);
}

function getMonthlyData(events: ReturnType<typeof getEvents>) {
  const monthly: Record<string, { total: number; eventCount: number; entries: typeof events }> = {};
  for (const entry of events) {
    const month = entry[0].slice(0, 7);
    if (!monthly[month]) monthly[month] = { total: 0, eventCount: 0, entries: [] };
    monthly[month].total += sumCounts(entry[1].counts);
    monthly[month].eventCount++;
    monthly[month].entries.push(entry);
  }
  return Object.entries(monthly).sort(([a], [b]) => b.localeCompare(a));
}

function exportCSV(events: ReturnType<typeof getEvents>) {
  const allMembers = [...new Set(events.flatMap(([, d]) => Object.keys(d.counts)))];
  const header = ['Date', 'Event', ...allMembers, 'Total'].join(',');
  const rows = events.map(([date, d]) => {
    const total = sumCounts(d.counts);
    const cols = [
      date,
      `"${d.eventName || ''}"`,
      ...allMembers.map((m) => d.counts[m] ?? 0),
      total,
    ];
    return cols.join(',');
  });
  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cheki-report-${dayjs().format('YYYYMMDD')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportJSON(allData: ChekiAllData) {
  const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cheki-backup-${dayjs().format('YYYYMMDD')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white/8 border border-white/12 rounded-2xl px-4 py-3.5 flex flex-col gap-0.5">
      <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-white tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-[#72C4E8]/70 truncate">{sub}</p>}
    </div>
  );
}

function ProgressBar({ value, max, color = '#1B90C8' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── Tab: ภาพรวม ──────────────────────────────────────────────────────────────

function OverviewTab({ events }: { events: ReturnType<typeof getEvents> }) {
  const grandTotal = events.reduce((s, [, d]) => s + sumCounts(d.counts), 0);
  const memberLeaderboard = getMemberTotals(events);
  const topMember = memberLeaderboard[0];
  const maxCount = memberLeaderboard[0]?.[1] ?? 1;

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <p className="text-5xl">📸</p>
        <p className="text-white/60 text-sm font-semibold">ยังไม่มีข้อมูล</p>
        <p className="text-white/30 text-xs">ลองเพิ่ม cheki ก่อนแล้วกลับมาดูรายงาน</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard label="Cheki ทั้งหมด" value={grandTotal} sub="ใบ" />
        <StatCard label="งานทั้งหมด" value={events.length} sub="งาน" />
        <StatCard label="สมาชิก" value={memberLeaderboard.length} sub="คน" />
        {topMember && (
          <StatCard label="Top Member" value={topMember[1]} sub={topMember[0]} />
        )}
      </div>

      {/* Member leaderboard */}
      {memberLeaderboard.length > 0 && (
        <div className="bg-white/8 border border-white/12 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-[10px] font-bold text-[#72C4E8] uppercase tracking-widest">
              🏆 Member Leaderboard
            </p>
          </div>
          <div className="divide-y divide-white/8">
            {memberLeaderboard.map(([member, count], i) => (
              <div key={member} className="px-4 py-2.5 flex items-center gap-3">
                <span className="text-[11px] font-black text-white/30 w-4 shrink-0 text-center">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-white truncate">{member}</p>
                    <p className="text-sm font-black text-white tabular-nums ml-2 shrink-0">
                      {count}
                      <span className="text-[10px] text-[#72C4E8] ml-0.5">pcs</span>
                    </p>
                  </div>
                  <ProgressBar value={count} max={maxCount} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: รายเดือน ────────────────────────────────────────────────────────────

function MonthlyTab({ events }: { events: ReturnType<typeof getEvents> }) {
  const monthlyData = getMonthlyData(events);
  const [expanded, setExpanded] = useState<string | null>(null);
  const maxMonthTotal = Math.max(...monthlyData.map(([, d]) => d.total), 1);

  if (monthlyData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <p className="text-5xl">📅</p>
        <p className="text-white/60 text-sm font-semibold">ยังไม่มีข้อมูล</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {monthlyData.map(([month, data]) => {
        const isOpen = expanded === month;
        const label = dayjs(month + '-01').format('MMMM YYYY');
        return (
          <div key={month} className="bg-white/8 border border-white/12 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : month)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition text-left"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{label}</p>
                <div className="mt-1.5">
                  <ProgressBar value={data.total} max={maxMonthTotal} />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-black text-white tabular-nums">
                  {data.total}
                  <span className="text-[10px] text-[#72C4E8] ml-1">pcs</span>
                </p>
                <p className="text-[10px] text-white/30">{data.eventCount} งาน</p>
              </div>
              <span className="text-white/30 text-xs ml-1">{isOpen ? '▲' : '▼'}</span>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/10 divide-y divide-white/8">
                    {data.entries.map(([date, d]) => {
                      const eventTotal = sumCounts(d.counts);
                      return (
                        <div key={date} className="px-4 py-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[11px] text-white/40 font-medium">
                                {dayjs(date).format('DD MMM YYYY')}
                              </p>
                              {d.eventName && (
                                <p className="text-xs text-white font-semibold mt-0.5 truncate">
                                  {d.eventName}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {Object.entries(d.counts).map(([m, n]) => (
                                  <span
                                    key={m}
                                    className="inline-flex items-center gap-1 bg-white/10 rounded-lg px-2 py-0.5 text-[10px] text-white/70"
                                  >
                                    {m}
                                    <span className="text-[#72C4E8] font-bold">{n}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-lg font-black text-white tabular-nums shrink-0">
                              {eventTotal}
                              <span className="text-[9px] text-[#72C4E8] ml-0.5">pcs</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab: งานทั้งหมด ──────────────────────────────────────────────────────────

function EventsTab({ events, allData }: { events: ReturnType<typeof getEvents>; allData: ChekiAllData }) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <p className="text-5xl">📋</p>
        <p className="text-white/60 text-sm font-semibold">ยังไม่มีข้อมูล</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Export buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => exportCSV(events)}
          className="flex-1 flex items-center justify-center gap-2 bg-white/8 border border-white/15 hover:bg-white/12 transition rounded-xl py-2.5 text-sm font-semibold text-white/70 hover:text-white"
        >
          <span>⬇</span> CSV
        </button>
        <button
          onClick={() => exportJSON(allData)}
          className="flex-1 flex items-center justify-center gap-2 bg-white/8 border border-white/15 hover:bg-white/12 transition rounded-xl py-2.5 text-sm font-semibold text-white/70 hover:text-white"
        >
          <span>⬇</span> JSON
        </button>
      </div>

      {/* Event list */}
      <div className="space-y-2">
        {events.map(([date, d]) => {
          const total = sumCounts(d.counts);
          const isOpen = expandedEvent === date;
          return (
            <div key={date} className="bg-white/8 border border-white/12 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedEvent(isOpen ? null : date)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-white/40 font-medium">
                    {dayjs(date).format('DD MMM YYYY')}
                  </p>
                  <p className="text-sm font-semibold text-white truncate mt-0.5">
                    {d.eventName || <span className="text-white/30 italic">ไม่ระบุชื่องาน</span>}
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5">
                    {Object.keys(d.counts).length} สมาชิก
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-black text-white tabular-nums">
                    {total}
                    <span className="text-[10px] text-[#72C4E8] ml-0.5">pcs</span>
                  </p>
                </div>
                <span className="text-white/30 text-xs ml-1">{isOpen ? '▲' : '▼'}</span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/10 px-4 py-3">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(d.counts).map(([member, count]) => (
                          <div
                            key={member}
                            className="flex items-center justify-between bg-white/8 rounded-xl px-3 py-2"
                          >
                            <p className="text-xs text-white truncate">{member}</p>
                            <p className="text-sm font-black text-[#72C4E8] tabular-nums ml-2 shrink-0">
                              {count}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'overview', label: 'ภาพรวม', emoji: '📊' },
  { id: 'monthly', label: 'รายเดือน', emoji: '📅' },
  { id: 'events', label: 'ทุกงาน', emoji: '📋' },
];

type Props = {
  open: boolean;
  onClose: () => void;
  allData: ChekiAllData;
};

export default function ChekiReport({ open, onClose, allData }: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const events = getEvents(allData);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed inset-x-0 bottom-0 md:inset-0 md:m-auto z-50
                       flex flex-col
                       md:max-w-[680px] md:max-h-[88vh] md:rounded-3xl
                       rounded-t-3xl max-h-[92vh]
                       bg-[#04111F] border border-white/15 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0 border-b border-white/10">
              <div>
                <p className="text-[10px] font-bold text-[#72C4E8]/70 uppercase tracking-widest mb-0.5">
                  Fan Tool
                </p>
                <h2 className="text-lg font-black text-white">📊 Cheki Report</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-5 py-3 shrink-0 border-b border-white/8">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition
                    ${tab === t.id
                      ? 'bg-[#1B90C8] text-white shadow'
                      : 'bg-white/8 text-white/50 hover:bg-white/12 hover:text-white'
                    }`}
                >
                  <span>{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
              {tab === 'overview' && <OverviewTab events={events} />}
              {tab === 'monthly' && <MonthlyTab events={events} />}
              {tab === 'events' && <EventsTab events={events} allData={allData} />}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 shrink-0 border-t border-white/8">
              <p className="text-center text-[10px] text-white/15">made with 💙 for mhaymhey</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
