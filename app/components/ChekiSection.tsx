'use client';

import { useState, useRef } from 'react';
import dayjs from 'dayjs';

// ─── Types ───────────────────────────────────────────────────────────────
export type DayEntry = {
  eventName: string;
  counts: { [member: string]: number };
};
export type ChekiAllData = Record<string, DayEntry>;

// Migrate old format { [name]: number } → new { eventName, counts }
function migrate(raw: unknown): ChekiAllData {
  if (!raw || typeof raw !== 'object') return {};
  const result: ChekiAllData = {};
  for (const [date, val] of Object.entries(raw as Record<string, unknown>)) {
    if (val && typeof val === 'object' && 'counts' in val) {
      result[date] = val as DayEntry;
    } else if (val && typeof val === 'object') {
      result[date] = { eventName: '', counts: val as Record<string, number> };
    }
  }
  return result;
}

export function loadChekiData(): ChekiAllData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('cheki-data');
    return raw ? migrate(JSON.parse(raw)) : {};
  } catch { return {}; }
}

export function saveChekiData(data: ChekiAllData) {
  localStorage.setItem('cheki-data', JSON.stringify(data));
}

export default function ChekiSection() {
  const today = dayjs().format('YYYY-MM-DD');
  const [date, setDate]           = useState(today);
  const [customInput, setCustom]  = useState('');
  const [showSuggest, setShowSug] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [allData, setAllData] = useState<ChekiAllData>(loadChekiData);

  const knownMembers = [...new Set(
    Object.values(allData).flatMap((d) => Object.keys(d.counts))
  )];

  const entry: DayEntry = allData[date] ?? { eventName: '', counts: {} };

  const save = (next: DayEntry) => {
    const updated = { ...allData, [date]: next };
    setAllData(updated);
    saveChekiData(updated);
  };

  const setEventName = (name: string) => save({ ...entry, eventName: name });

  const addMember = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || trimmed in entry.counts) return;
    save({ ...entry, counts: { ...entry.counts, [trimmed]: 0 } });
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

  const total      = Object.values(entry.counts).reduce((s, n) => s + n, 0);
  const memberList = Object.entries(entry.counts);
  const suggestions = knownMembers.filter(
    (m) =>
      !(m in entry.counts) &&
      (customInput.trim() === '' || m.toLowerCase().includes(customInput.toLowerCase()))
  );

  return (
    <section className="px-4 py-6">
      <div className="max-w-md mx-auto space-y-4">

        {/* Header */}
        <div>
          <p className="text-[10px] font-bold text-[#72C4E8]/70 uppercase tracking-widest mb-0.5">
            Fan Tool
          </p>
          <h2 className="text-xl font-black text-white">📸 Cheki Count</h2>
          <p className="text-xs text-white/40 mt-0.5">
            Track cheki counts per event — report-ready
          </p>
        </div>

        {/* ── Step 1: วันที่และงาน ───────────────────────────────────── */}
        <div className="bg-white/8 rounded-2xl border border-white/12">
          <div className="px-4 pt-3 pb-0.5">
            <p className="text-[10px] font-bold text-[#72C4E8] uppercase tracking-widest">
              📅 Step 1 — Date &amp; Event
            </p>
          </div>
          <div className="px-4 pb-4 pt-2 space-y-2">
            <div>
              <label className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#72C4E8] [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block mb-1">
                Event Name <span className="normal-case font-normal">(optional — used for report)</span>
              </label>
              <input
                type="text"
                value={entry.eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Stellagrima Live Vol.1"
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/25 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#72C4E8]"
              />
            </div>
          </div>
        </div>

        {/* ── Step 2: เพิ่มสมาชิก ────────────────────────────────────── */}
        <div className="bg-white/8 rounded-2xl border border-white/12">
          <div className="px-4 pt-3 pb-0.5">
            <p className="text-[10px] font-bold text-[#72C4E8] uppercase tracking-widest">
              💙 Step 2 — Members
            </p>
          </div>
          <div className="px-4 pb-4 pt-2 space-y-3">
            {/* Custom input */}
            <div>
              <p className="text-[10px] text-white/40 mb-1.5">Type member name</p>
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={customInput}
                    onChange={(e) => { setCustom(e.target.value); setShowSug(true); }}
                    onFocus={() => setShowSug(true)}
                    onBlur={() => setTimeout(() => setShowSug(false), 150)}
                    onKeyDown={(e) => e.key === 'Enter' && addMember(customInput)}
                    placeholder="Name..."
                    className="flex-1 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/25 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#72C4E8]"
                  />
                  <button
                    onClick={() => addMember(customInput)}
                    disabled={!customInput.trim()}
                    className="px-4 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20 disabled:opacity-30 transition"
                  >
                    Add
                  </button>
                </div>

                {/* Autocomplete dropdown */}
                {showSuggest && suggestions.length > 0 && (
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
            </div>
          </div>
        </div>

        {/* ── Step 3: นับเชกิ ─────────────────────────────────────────── */}
        {memberList.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-[#72C4E8] uppercase tracking-widest px-1">
              🔢 Step 3 — Count
            </p>

            {memberList.map(([member, count]) => (
              <div key={member} className="bg-white/10 rounded-xl border border-white/15 px-3 py-2 flex items-center gap-2">
                <p className="flex-1 font-semibold text-white text-sm truncate">{member}</p>
                <button
                  onClick={() => addCheki(member, -1)}
                  disabled={count === 0}
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white text-lg font-black hover:bg-white/20 disabled:opacity-30 transition flex items-center justify-center shrink-0"
                >−</button>
                <div className="w-12 text-center shrink-0">
                  <span className="text-2xl font-black text-white tabular-nums">{count}</span>
                  <p className="text-[9px] text-[#72C4E8] leading-none">pcs</p>
                </div>
                <button
                  onClick={() => addCheki(member, +1)}
                  className="w-8 h-8 rounded-full bg-[#1B90C8] text-white text-lg font-black hover:bg-[#0F75A8] transition shadow flex items-center justify-center shrink-0"
                >+</button>
                <button
                  onClick={() => removeMember(member)}
                  className="w-6 h-6 rounded-full bg-white/10 text-white/30 hover:bg-red-500/30 hover:text-red-400 text-[10px] transition flex items-center justify-center shrink-0"
                  title="Remove"
                >✕</button>
              </div>
            ))}

            {/* Total summary */}
            <div className="bg-[#1B90C8]/20 border border-[#1B90C8]/40 rounded-2xl px-4 py-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#72C4E8] font-bold uppercase tracking-wider">
                  Total
                </p>
                {entry.eventName ? (
                  <p className="text-[11px] text-white/40 mt-0.5">{entry.eventName}</p>
                ) : (
                  <p className="text-[11px] text-white/25 mt-0.5">
                    {dayjs(date).format('DD MMM YYYY')}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-white tabular-nums">{total}</span>
                <span className="text-sm text-[#72C4E8] ml-1.5">pcs</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {memberList.length === 0 && (
          <div className="text-center py-10 space-y-2">
            <p className="text-5xl">📸</p>
            <p className="text-white/60 text-sm font-semibold">No members yet</p>
            <p className="text-white/30 text-xs">
              Type a member name above to get started
            </p>
          </div>
        )}

        <p className="text-center text-xs text-white/15 pt-1">made with 💙 for mhaymhey</p>
      </div>
    </section>
  );
}
