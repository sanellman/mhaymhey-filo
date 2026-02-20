'use client';

import { motion } from 'framer-motion';

const INFO_CARDS = [
  { icon: '💙', label: 'ชื่อเล่น / Nickname', value: 'เหม่เหม๋ · mhaymhey' },
  { icon: '✨', label: 'สีประจำตัว / Color',  value: 'Sparkle Blue 💙' },
  { icon: '🎂', label: 'วันเกิด / Birthday',  value: '06 APR' },
  { icon: '🎤', label: 'วง / Group',           value: 'Stellagrima' },
  { icon: '🧠', label: 'MBTI',                 value: 'INFJ' },
  { icon: '🐌', label: 'สัตว์โปรด',            value: 'หอยทาก + แมว 🐱' },
  { icon: '🍵', label: 'เครื่องดื่มโปรด',      value: 'Matcha Latte · Brown Sugar · Cocoa Mint' },
  { icon: '🎮', label: 'เกมโปรด',              value: 'Five Nights at Freddy\'s 🐻' },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 px-6 bg-white text-[#0A2234]">
      <div className="max-w-4xl mx-auto">

        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#1B90C8] bg-[#EAF6FF] px-3 py-1 rounded-full mb-3">
            ✦ Profile
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#0A2234]">
            เกี่ยวกับ mhaymhey 💙
          </h2>
        </motion.div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {INFO_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              className="bg-[#F2F9FF] border border-[#A8D8F5] rounded-2xl p-4 flex gap-3 items-start"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              viewport={{ once: true }}
            >
              <span className="text-xl mt-0.5 shrink-0">{card.icon}</span>
              <div>
                <p className="text-[10px] text-[#5C96B8] font-semibold uppercase tracking-widest mb-0.5">
                  {card.label}
                </p>
                <p className="font-bold text-sm text-[#0A2234]">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fav characters */}
        <motion.div
          className="bg-gradient-to-br from-[#EAF6FF] to-[#F2F9FF] border border-[#A8D8F5] rounded-2xl p-5"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#1B90C8] mb-3">
            💜 ตัวละครที่ชอบ
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { e: '🖤', n: 'Kuromi' },
              { e: '🩵', n: 'Cinnamoroll' },
              { e: '🐱', n: 'Garfield' },
              { e: '💚', n: 'Buttercup' },
              { e: '🐤', n: 'Tweety' },
              { e: '🕷', n: 'Black Widow' },
              { e: '🌿', n: 'Mantis' },
              { e: '🩵', n: 'Rem' },
              { e: '🩷', n: 'Beatrice' },
            ].map(({ e, n }) => (
              <span key={n} className="flex items-center gap-1 bg-white border border-[#A8D8F5] text-[#0A2234] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                {e} {n}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
