'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// ใส่รูปเพิ่มได้ใน /public/gallery/
const images: string[] = [
  '/mm.png',
];

const doubled = [...images, ...images];

export default function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedIndex]);

  const close = useCallback(() => setSelectedIndex(null), []);
  const prev = useCallback(() =>
    setSelectedIndex((i) => (i !== null ? (i > 0 ? i - 1 : images.length - 1) : 0)), []);
  const next = useCallback(() =>
    setSelectedIndex((i) => (i !== null ? (i < images.length - 1 ? i + 1 : 0) : 0)), []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIndex, prev, next, close]);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || images.length <= 1) return;
    const speed = 0.6;
    let rafId: number;
    const tick = () => {
      if (!isPausedRef.current) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const pauseScroll = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    isPausedRef.current = true;
  };

  const resumeScroll = (delay = 0) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, delay);
  };

  return (
    <section id="gallery" className="py-14 overflow-hidden">
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-center mb-8 px-4 text-white"
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        📸 แกลเลอรี่ mhaymhey
      </motion.h2>

      {images.length === 0 ? (
        <p className="text-center text-white/40 text-sm">ยังไม่มีรูปในแกลเลอรี่</p>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3 px-4 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          onMouseEnter={pauseScroll}
          onMouseLeave={() => resumeScroll(0)}
          onTouchStart={pauseScroll}
          onTouchEnd={() => resumeScroll(2500)}
        >
          {doubled.map((src, i) => (
            <div
              key={i}
              className="shrink-0 w-44 sm:w-52 md:w-60 rounded-2xl overflow-hidden shadow-lg cursor-pointer group border border-white/20"
              onClick={() => setSelectedIndex(i % images.length)}
            >
              <Image
                src={src}
                alt={`mhaymhey ${(i % images.length) + 1}`}
                width={300}
                height={400}
                className="w-full h-52 sm:h-60 md:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="relative max-w-2xl w-full mx-4"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]}
                alt="Selected"
                width={1000}
                height={1000}
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
              />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                {selectedIndex + 1} / {images.length}
              </div>
            </motion.div>

            <button
              className="absolute left-3 md:left-6 text-white bg-black/40 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center text-xl transition"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >‹</button>

            <button
              className="absolute right-3 md:right-6 text-white bg-black/40 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center text-xl transition"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >›</button>

            <button
              className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/70 rounded-full w-9 h-9 flex items-center justify-center transition"
              onClick={close}
            >✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
