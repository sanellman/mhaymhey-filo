'use client';

import { motion } from 'framer-motion';

const FACTS = [
  {
    no: 1,
    emoji: '👧🏻',
    text: 'ชื่อ "เหม่เหม๋" เชื้อสายจีน แปลว่า น้องสาว เป็นน้องคนเล็กในบ้าน เรียกได้หลายชื่อเลย — เมเม่, เม, เหมย ก็ได้ทั้งนั้น 💙',
  },
  {
    no: 2,
    emoji: '👻',
    text: 'กลัวผีมาก ดูหนังผีแล้วนอนไม่หลับเป็นวัน แต่ดันชอบดูหนังผีและเล่นเกมผี เป็นทาสรักเกม Five Nights at Freddy\'s 🐻',
  },
  {
    no: 3,
    emoji: '🍜',
    text: 'ไม่กินเผ็ดเลย ❌🌶️ เผ็ดสุดที่กินได้คือมาม่าต้มยำกุ้ง 🥲',
  },
  {
    no: 4,
    emoji: '🐱',
    text: 'ชอบการ์ตูน Garfield มากกก ตอนเด็กต้องดูทุกเช้า กินลาซาญ่าตาม Garfield ด้วย ชอบซื้ออาหารแมวติดกระเป๋าไว้เผื่อเจอแมวจร 🧡',
  },
  {
    no: 5,
    emoji: '🐌',
    text: 'สัตว์ที่ชอบที่สุดคือหอยทาก! ตอนเด็กเก็บหอยทากมาเลี้ยง ซื้อแตงกวาและผลไม้มาให้กินจนคุณย่าซื้อมาไว้ให้เพราะรู้ว่าอยากเลี้ยงจริง 🥬',
  },
  {
    no: 6,
    emoji: '💌',
    text: 'เป็น Introvert แรกๆ ชวนคุยไม่เก่ง แต่อยากรู้จักทุกคนมาก บางทีเขินไม่กล้าพูด แต่ชอบเขียนจดหมาย — ลองสั่ง Thank You Card ดูได้ 💙',
  },
  {
    no: 7,
    emoji: '🧩',
    text: 'ชอบจำรายละเอียดเล็กๆ น้อยๆ ของทุกคน ไม่ว่าจะชอบแต่งตัวสไตล์ไหน งานอดิเรก เกมที่เล่น เมะที่ดู — จำได้หมดเลยนะ! 🥺',
  },
  {
    no: 8,
    emoji: '🖤',
    text: 'ชอบ Kuromi 🖤, Cinnamoroll 🩵, Buttercup จาก Powerpuff Girls 💚, และน้อง Tweety 🐤',
  },
  {
    no: 9,
    emoji: '🪳',
    text: 'กลัวแมลงสาบมากกก ตอนน้องเดินก็ไม่กล้าเข้าใกล้แล้ว บินทีพร้อมวิ่งทันที 😂',
  },
  {
    no: 10,
    emoji: '🍵',
    text: 'กินชานมเป็นชีวิตจิตใจ เมนูโปรด: Matcha Latte 🍵, Brown Sugar Fresh Milk, Cocoa Mint',
  },
  {
    no: 11,
    emoji: '⚔️',
    text: 'ชอบอนิเมะแนวต่างโลก ชอบสุดคือ Re:Zero ❤️ ชอบ Rem 🩵 กับ Beatrice 🩷 มากๆ ใครดูด้วยกันมาคุยกันได้!',
  },
  {
    no: 12,
    emoji: '🫂',
    text: 'ภายนอกดูเข้มแข็ง แต่มีเซ็นซิทีฟอยู่นิดนึง ฮีลตัวเองได้ไว แค่เห็นว่าทุกคนยังอยู่ข้างๆ ก็ไม่คิดมากแล้ว 🥺 กำลังใจจากทุกคนมีผลต่อหนูจริงๆ',
  },
  {
    no: 13,
    emoji: '🎵',
    text: 'ชอบ T-Pop มากๆ ศิลปินที่ชอบที่สุดคือพี่เบนซ์ ข้าวขวัญ 🩷 — No.1 ตลอดกาล!',
  },
  {
    no: 14,
    emoji: '😎',
    text: 'ปกติแต่งตัวสไตล์เท่ ติดขายหล่อนิดนึง ไม่ค่อยใส่ชุดไอดอลในชีวิตประจำวัน 5555',
  },
  {
    no: 15,
    emoji: '🍝',
    text: 'ชอบกินเส้นมากกว่าข้าว 1 วัน 3 มื้อ กินเมนูเส้นไปแล้ว 2 มื้อ กินทุกวันเลย 🍜🍝',
  },
  {
    no: 16,
    emoji: '🕷',
    text: 'ชอบ Marvel มาก! อวยสุดคือ Black Widow, รองลงมาให้น้อง Mantis 💪',
  },
];

export default function FactsSection() {
  return (
    <section id="facts" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">

        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#72C4E8] bg-white/10 border border-white/20 px-3 py-1 rounded-full mb-3">
            ✦ Fun Facts
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            16 เรื่องที่ควรรู้เกี่ยวกับเหม๋ 💙
          </h2>
          <p className="text-sm text-[#72C4E8]/70 mt-2">จาก X @MhayMhey_Stella</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FACTS.map((fact, i) => (
            <motion.div
              key={fact.no}
              className="bg-white border border-[#A8D8F5] rounded-2xl p-4 flex gap-3 items-start hover:shadow-md hover:border-[#1B90C8]/50 transition-all"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 4) * 0.07, duration: 0.3 }}
              viewport={{ once: true }}
            >
              {/* Number badge */}
              <div className="shrink-0 w-7 h-7 rounded-full bg-[#1B90C8] text-white text-xs font-black flex items-center justify-center shadow-sm">
                {fact.no}
              </div>
              <div>
                <span className="text-lg">{fact.emoji}</span>
                <p className="text-sm text-[#0A2234] leading-relaxed mt-0.5">{fact.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
