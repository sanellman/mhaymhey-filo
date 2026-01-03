'use client';

import { useState } from 'react';

type Props = {
  onAdd: (idolName: string) => void;
};

export default function AddIdolInput({ onAdd }: Props) {
  const [input, setInput] = useState('');
  const [idols, setIdols] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem('cheki-idols');
    return raw ? JSON.parse(raw) : [];
  });
  const [show, setShow] = useState(false);

  const saveIdols = (list: string[]) => {
    setIdols(list);
    localStorage.setItem('cheki-idols', JSON.stringify(list));
  };

  const addIdol = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    onAdd(trimmed);

    if (!idols.includes(trimmed)) {
      saveIdols([...idols, trimmed]);
    }

    setInput('');
    setShow(false);
  };

  const suggestions = idols.filter((name) =>
    name.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShow(true);
        }}
        onFocus={() => setShow(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addIdol(input);
          }
        }}
        placeholder="เพิ่มไอดอลที่ถ่ายเชกิ…"
        className="w-full rounded-2xl border border-[#AEE6FF] p-3
                   focus:outline-none focus:ring-2 focus:ring-[#6EC6FF]"
      />

      {show && input && suggestions.length > 0 && (
        <div className="absolute z-10 mt-2 w-full rounded-2xl bg-white shadow">
          {suggestions.map((name) => (
            <button
              key={name}
              onClick={() => addIdol(name)}
              className="block w-full text-left px-4 py-2
                         hover:bg-[#EAF6FF]"
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
