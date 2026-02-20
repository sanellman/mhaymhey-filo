'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import AddIdolInput from './AddIdolInput';

type DayData = { [idolName: string]: number };
type AllData = Record<string, DayData>;

export default function ChekiSection() {
  const today = dayjs().format('YYYY-MM-DD');
  const [date, setDate] = useState<string>(today);

  const [allData, setAllData] = useState<AllData>(() => {
    if (typeof window === 'undefined') return {};
    const raw = localStorage.getItem('cheki-data');
    return raw ? JSON.parse(raw) : {};
  });

  const dayData = allData[date] || {};

  const saveDay = (newDayData: DayData) => {
    const next = { ...allData, [date]: newDayData };
    setAllData(next);
    localStorage.setItem('cheki-data', JSON.stringify(next));
  };

  const addCheki = (idol: string, delta: number) => {
    const current = dayData[idol] || 0;
    const nextCount = Math.max(0, current + delta);
    saveDay({ ...dayData, [idol]: nextCount });
  };

  const addIdol = (idol: string) => {
    if (dayData[idol] !== undefined) return;
    saveDay({ ...dayData, [idol]: 0 });
  };

  const totalToday = Object.values(dayData).reduce((sum, n) => sum + n, 0);

  return (
    <section className="px-4 py-8">
      <div className="max-w-md mx-auto space-y-5">

        {/* Header */}
        <div className="text-center space-y-1">
          <p className="text-xs text-[#72C4E8]/70 font-semibold uppercase tracking-widest">Fan Tool</p>
          <h2 className="text-xl font-bold text-white">📸 Cheki Count</h2>
          {totalToday > 0 && (
            <p className="text-sm text-[#72C4E8] font-semibold">รวมวันนี้: {totalToday} ใบ</p>
          )}
        </div>

        {/* Date Picker */}
        <div className="bg-white/10 rounded-2xl p-4 space-y-2 border border-white/15">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-transparent text-white px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#72C4E8] [color-scheme:dark]"
          />
          <p className="text-center text-sm text-[#72C4E8]/70">
            📅 {dayjs(date).format('DD MMM YYYY')}
          </p>
        </div>

        {/* Add Idol */}
        <AddIdolInput onAdd={addIdol} />

        {/* Empty State */}
        {Object.keys(dayData).length === 0 && (
          <p className="text-center text-white/40 text-sm">ยังไม่มีการนับเชกิวันนี้</p>
        )}

        {/* Cheki Cards */}
        <div className="space-y-3">
          {Object.entries(dayData).map(([idol, count]) => (
            <div key={idol} className="bg-white/10 rounded-2xl p-4 border border-white/15 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{idol}</p>
                <p className="text-2xl font-bold text-[#72C4E8]">{count} ใบ</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => addCheki(idol, -1)} className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-xl text-white font-bold hover:bg-white/20 transition">−</button>
                <button onClick={() => addCheki(idol, +1)} className="w-11 h-11 rounded-full bg-[#1B90C8] text-white text-xl font-bold hover:bg-[#0F75A8] transition shadow-md">+</button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-white/20 pt-2">made with 💙 for mhaymhey</p>
      </div>
    </section>
  );
}
