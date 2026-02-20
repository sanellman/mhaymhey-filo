'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="py-12 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">

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
