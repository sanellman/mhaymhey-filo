'use client';

import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { loadChekiData, saveChekiData, type ChekiAllData } from './ChekiSection';
import ChekiReport from './ChekiReport';

export default function ChekiCount() {
  const today = dayjs().format('YYYY-MM-DD');
  const [date, setDate]       = useState(today);
  const [custom, setCustom]   = useState('');
  const [showSug, setShowSug] = useState(false);
  const [allData, setAllData] = useState<ChekiAllData>(loadChekiData);
  const [showReport, setShowReport] = useState(false);
  const inputRef  = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): ChekiAllData => {
    const lines = text.trim().split('\n');
    const header = lines[0].split(',');
    // columns: Date, Event, ...members, Total
    const memberCols = header.slice(2, header.length - 1);
    const result: ChekiAllData = {};
    for (const line of lines.slice(1)) {
      if (!line.trim()) continue;
      // handle quoted event name
      const match = line.match(/^([^,]+),("(?:[^"]|"")*"|[^,]*),(.*)/);
      if (!match) continue;
      const date      = match[1].trim();
      const eventName = match[2].replace(/^"|"$/g, '').replace(/""/g, '"').trim();
      const rest      = match[3].split(',');
      const counts: Record<string, number> = {};
      memberCols.forEach((m, i) => {
        const n = parseInt(rest[i] ?? '0', 10);
        if (!isNaN(n) && n > 0) counts[m] = n;
      });
      result[date] = { eventName, counts };
    }
    return result;
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isCSV = file.name.endsWith('.csv');
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        let parsed: ChekiAllData;
        if (isCSV) {
          parsed = parseCSV(text);
        } else {
          parsed = JSON.parse(text) as ChekiAllData;
          if (typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
        }
        const merged = { ...allData, ...parsed };
        setAllData(merged);
        saveChekiData(merged);
        alert(`นำเข้าสำเร็จ ${Object.keys(parsed).length} รายการ`);
      } catch {
        alert('ไฟล์ไม่ถูกต้อง กรุณาใช้ไฟล์ .json หรือ .csv ที่ export จาก Cheki Report');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

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
        <div className="flex items-center gap-2 shrink-0">
          <input
            ref={importRef}
            type="file"
            accept=".json,.csv"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => importRef.current?.click()}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white/70 hover:text-white rounded-xl px-3 py-2 text-xs font-bold transition"
          >
            ⬆ Import
          </button>
          <button
            onClick={() => setShowReport(true)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-[#1B90C8]/30 border border-white/15 hover:border-[#1B90C8]/50 text-white/70 hover:text-white rounded-xl px-3 py-2 text-xs font-bold transition"
          >
            📊 Report
            {eventCount > 0 && (
              <span className="bg-[#1B90C8] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {eventCount > 99 ? '99+' : eventCount}
              </span>
            )}
          </button>
        </div>
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
