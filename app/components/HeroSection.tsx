'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const GALLERY = [
  '/gallery/20260111_183646.jpg',
  '/gallery/20260124_152737(2).jpg',
  '/gallery/20260125_222659(0).jpg',
  '/gallery/20260201_150144(0).jpg',
  '/gallery/20260206_165157(0).jpg',
  '/gallery/20260208_154428.jpg',
  '/gallery/20260215_213217.jpg',
  '/gallery/20260221_211200.jpg',
  '/gallery/20260301_162837(1).jpg',
  '/gallery/20260307_211133.jpg',
  '/gallery/20260308_213254.jpg',
  '/gallery/20260314_163011(0).jpg',
  '/gallery/20260315_204654.jpg',
  '/gallery/20260321_190447(0).jpg',
  '/gallery/20260322_165810.jpg',
  '/gallery/20260329_161543(1).jpg',
  '/gallery/20260329_161956.jpg',
  '/gallery/20260404_161716(0)(1).jpg',
];

const ROW1 = GALLERY.filter((_, i) => i % 3 === 0);
const ROW2 = GALLERY.filter((_, i) => i % 3 === 1);
const ROW3 = GALLERY.filter((_, i) => i % 3 === 2);

const fill = (arr: string[]) => [...arr, ...arr, ...arr];

function BgStrip({ images }: { images: string[] }) {
  return (
    <div className="flex gap-2 overflow-hidden">
      {fill(images).map((src, i) => (
        <div key={i} className="shrink-0 w-32 h-44 rounded-xl overflow-hidden">
          <Image src={src} alt="" width={128} height={176} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative py-12 px-6 overflow-hidden">

      {/* BG photo strip */}
      <div className="absolute inset-0 flex flex-col justify-center gap-2 opacity-20 pointer-events-none select-none">
        <BgStrip images={ROW1} />
        <BgStrip images={ROW2} />
        <BgStrip images={ROW3} />
      </div>

      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#04111F]/60 via-[#04111F]/40 to-[#04111F]/60 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">

        {/* Image */}
        <motion.div
          className="relative shrink-0 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-[#1B90C8]/40 rounded-3xl blur-2xl scale-110" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="relative"
          >
            <Image
              src="/mm.png"
              alt="mhaymhey"
              width={256}
              height={320}
              className="w-52 md:w-64 rounded-3xl shadow-2xl border-2 border-[#1B90C8]/50 object-cover"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          className="text-center md:text-left flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.span
            className="inline-block bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Stellagrima 💙
          </motion.span>

          <motion.h1
            className="text-2xl md:text-3xl font-black mb-3 text-white leading-snug"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            mhaymhey ✦
            <br />
            <span className="text-[#72C4E8] text-xl md:text-2xl">Sparkle Blue 💙</span>
          </motion.h1>

          <motion.p
            className="text-base text-[#72C4E8]/70 italic mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            ✦ Stellagrima ✦
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-2 justify-center md:justify-start"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className="bg-white/10 border border-white/20 text-[#72C4E8] text-sm px-3 py-1 rounded-full font-semibold">
              🎂 06 APR
            </span>
            <span className="bg-white/10 border border-white/20 text-[#72C4E8] text-sm px-3 py-1 rounded-full font-semibold">
              💙 Sparkle Blue
            </span>
            <span className="bg-white/10 border border-white/20 text-[#72C4E8] text-sm px-3 py-1 rounded-full font-semibold">
              INFJ
            </span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
