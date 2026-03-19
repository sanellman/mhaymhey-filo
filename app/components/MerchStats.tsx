'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// 👉 ตั้งวันปิดขาย / วันสำคัญ
const SALE_END = new Date(2026, 2, 26, 23, 59, 59); // 26 มี.ค. 2026

type Product = {
  product_name: string;
  price: string;
  img_url: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null;

function getTimeLeft(): TimeLeft {
  const diff = SALE_END.getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function MerchStats() {
  const [product, setProduct] = useState<Product | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(null);

  useEffect(() => {
    fetch('/api/merch')
      .then((res) => res.json())
      .then((res) => {
        setProduct(res.data);
      });

    const update = () => {
      setTimeLeft(getTimeLeft());
    };

    update();
    const id = setInterval(update, 1000);

    return () => clearInterval(id);
  }, []);

  if (!product) return null;

  return (
    <div className="bg-white/10 border border-[#1B90C8]/40 rounded-2xl p-4 backdrop-blur-sm shadow-lg">

      {/* Header */}
      <p className="text-[#72C4E8] text-xs font-bold tracking-widest text-center">
        🎂 BIRTHDAY MERCH
      </p>

      {/* Image */}
      <div className="flex justify-center mt-3">
        <Image
          src={product.img_url}
          alt="merch"
          width={120}
          height={120}
          className="rounded-xl border border-white/20"
        />
      </div>

      {/* Name */}
      <p className="text-white text-sm text-center mt-3 font-semibold">
        {product.product_name}
      </p>

      {/* Countdown */}
      <div className="mt-4 text-center">
        {timeLeft ? (
          <>
            <p className="text-[#72C4E8] text-xs tracking-widest mb-2">
              ⏱ ปิดขายในอีก
            </p>

            <div className="flex justify-center gap-2">
              {[
                { label: 'วัน', value: timeLeft.days },
                { label: 'ชม.', value: timeLeft.hours },
                { label: 'นาที', value: timeLeft.minutes },
                { label: 'วิ', value: timeLeft.seconds },
              ].map((u) => (
                <div key={u.label} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/10 border border-[#1B90C8]/50 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {pad(u.value)}
                    </span>
                  </div>
                  <span className="text-[9px] text-[#72C4E8] mt-1">
                    {u.label}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-red-400 text-sm font-semibold mt-2">
            🔴 ปิดการสั่งซื้อแล้ว
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="mt-4 text-center">
        <a
          href="https://shop.line.me/@siamdol/product/1007977948"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#1B90C8] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          🛒 สั่งซื้อสินค้า
        </a>
      </div>

    </div>
  );
}