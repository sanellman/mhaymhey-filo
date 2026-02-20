'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const NAV_LINKS = [
  { href: '#about',   label: 'About' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#tools',   label: 'Tools' },
];

const SPARKLES = [
  { x: '6%',  y: '10%', s: 4, d: 0,   dur: 3.2 },
  { x: '90%', y: '8%',  s: 3, d: 0.4, dur: 2.8 },
  { x: '20%', y: '52%', s: 5, d: 0.8, dur: 4.0 },
  { x: '80%', y: '42%', s: 4, d: 0.2, dur: 3.6 },
  { x: '48%', y: '5%',  s: 3, d: 1.0, dur: 2.5 },
  { x: '33%', y: '88%', s: 4, d: 0.6, dur: 3.9 },
  { x: '68%', y: '76%', s: 3, d: 1.4, dur: 3.1 },
  { x: '86%', y: '62%', s: 5, d: 0.3, dur: 4.2 },
  { x: '4%',  y: '78%', s: 3, d: 1.1, dur: 2.9 },
  { x: '94%', y: '30%', s: 4, d: 0.7, dur: 3.5 },
  { x: '44%', y: '20%', s: 3, d: 1.6, dur: 2.7 },
  { x: '74%', y: '16%', s: 4, d: 0.9, dur: 3.8 },
  { x: '26%', y: '36%', s: 3, d: 0.1, dur: 4.1 },
  { x: '56%', y: '94%', s: 5, d: 1.3, dur: 3.3 },
  { x: '14%', y: '26%', s: 3, d: 0.5, dur: 2.6 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#04111F] text-white flex flex-col">

      {/* Fixed sparkle layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {SPARKLES.map((sp, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#72C4E8]"
            style={{ left: sp.x, top: sp.y, width: sp.s, height: sp.s }}
            animate={{ y: [0, -12, 0], opacity: [0.25, 0.8, 0.25] }}
            transition={{ repeat: Infinity, duration: sp.dur, delay: sp.d, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Thin gradient accent bar */}
      <div className="relative z-10 h-0.5 w-full bg-gradient-to-r from-[#1B90C8] via-[#72C4E8] to-[#1B90C8]" />

      {/* Navbar */}
      <header className="relative z-10 bg-[#04111F]/80 backdrop-blur-md border-b border-white/10 sticky top-0">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">

          {/* Left: branding */}
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-black text-white tracking-tight">✦ mhaymhey</span>
            <span className="text-[11px] font-semibold text-[#72C4E8] tracking-widest uppercase">
              Stellagrima 💙
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-white/10 transition"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className={`block h-0.5 w-5 bg-[#72C4E8] rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-5 bg-[#72C4E8] rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-[#72C4E8] rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-white/10 bg-[#04111F]/95 px-5 py-3 flex gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-[#72C4E8]"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-grow">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#020C14] border-t border-white/10">
        <div className="h-0.5 w-full bg-gradient-to-r from-[#1B90C8] via-[#72C4E8] to-[#1B90C8]" />
        <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col items-center gap-5">
          <div className="text-center">
            <p className="text-xl font-black tracking-tight">✦ mhaymhey</p>
            <p className="text-[11px] font-semibold text-[#72C4E8] tracking-widest uppercase mt-0.5">
              Stellagrima 💙
            </p>
          </div>
          <div>
            <p className="text-center text-xs text-[#5C96B8] mb-3">ติดตามได้ที่ 💙</p>
            <div className="flex justify-center gap-5 text-2xl text-[#72C4E8]">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook className="hover:text-white transition" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="hover:text-pink-400 transition" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter">
                <FaXTwitter className="hover:text-white transition" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <FaTiktok className="hover:text-white transition" />
              </a>
            </div>
          </div>
          <p className="text-xs text-white/20">© 2025 mhaymhey Fan Project</p>
        </div>
      </footer>

    </div>
  );
}
