'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import AddIdolInput from './components/AddIdolInput';

type DayData = {
  [idolName: string]: number;
};

type AllData = Record<string, DayData>;

export default function Home() {
  const today = dayjs().format('YYYY-MM-DD');
  const [date, setDate] = useState<string>(today);

  const [allData, setAllData] = useState<AllData>(() => {
    if (typeof window === 'undefined') return {};
    const raw = localStorage.getItem('cheki-data');
    return raw ? JSON.parse(raw) : {};
  });

  const dayData = allData[date] || {};

  const saveDay = (newDayData: DayData) => {
    const next = {
      ...allData,
      [date]: newDayData,
    };
    setAllData(next);
    localStorage.setItem('cheki-data', JSON.stringify(next));
  };

  const addCheki = (idol: string, delta: number) => {
    const current = dayData[idol] || 0;
    const nextCount = Math.max(0, current + delta);

    saveDay({
      ...dayData,
      [idol]: nextCount,
    });
  };

  const addIdol = (idol: string) => {
    if (dayData[idol]) return;

    saveDay({
      ...dayData,
      [idol]: 0,
    });
  };

  return (
    <div className="min-h-screen bg-[#EAF6FF] px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 rounded-full bg-[#6EC6FF] flex items-center justify-center text-white text-3xl shadow">
            🐦
          </div>

          <h1 className="text-2xl font-bold text-[#1F2937]">
            mhaymhey
          </h1>

          <p className="text-sm text-[#6EC6FF]">
            mhaymhey-filo fan tool
          </p>
        </div>

        {/* Date Picker */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border px-4 py-2 text-center
                       focus:outline-none focus:ring-2 focus:ring-[#6EC6FF]"
          />

          <p className="text-center text-sm text-neutral-500">
            📅 {dayjs(date).format('DD MMM YYYY')}
          </p>
        </div>

        {/* Add Idol */}
        <AddIdolInput onAdd={addIdol} />

        {/* Empty State */}
        {Object.keys(dayData).length === 0 && (
          <p className="text-center text-neutral-400">
            ยังไม่มีการนับเชกิวันนี้
          </p>
        )}

        {/* Cheki Cards */}
        <div className="space-y-4">
          {Object.entries(dayData).map(([idol, count]) => (
            <div
              key={idol}
              className="bg-white rounded-2xl p-4 shadow
                         flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-[#1F2937]">{idol}</p>
                <p className="text-2xl font-bold text-[#6EC6FF]">
                  {count} ใบ
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => addCheki(idol, -1)}
                  className="w-11 h-11 rounded-full bg-[#EAF6FF] text-xl"
                >
                  −
                </button>
                <button
                  onClick={() => addCheki(idol, 1)}
                  className="w-11 h-11 rounded-full bg-[#6EC6FF] text-white text-xl"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-400 pt-4">
          made with 💙 for mhaymhey & filo
        </p>
      </div>
    </div>
  );
}
