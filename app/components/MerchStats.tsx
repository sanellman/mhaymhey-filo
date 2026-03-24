'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// 👉 ตั้งวันปิดขาย / วันสำคัญ
const SALE_END = new Date(2026, 2, 26, 23, 59, 59); // 26 มี.ค. 2026

type Variant = {
  variant_option_value1: string;
  available: number;
};

type Product = {
  product_name: string;
  price: string;
  img_url: string;
  product_variants: Variant[];
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
  const [showStock, setShowStock] = useState(false);

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
      <div className="flex items-center justify-center gap-2">
        <p className="text-[#72C4E8] text-xs font-bold tracking-widest">
          🎂 BIRTHDAY MERCH
        </p>
        <button
          onClick={() => setShowStock(true)}
          className="text-[10px] text-white/50 border border-white/20 rounded-full px-2 py-0.5 hover:text-white hover:border-white/50 transition"
        >
          stock
        </button>
      </div>

      {/* Stock Modal */}
      {showStock && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setShowStock(false)}
        >
          <div
            className="bg-[#04111F] border border-[#1B90C8]/40 rounded-2xl p-5 w-full max-w-xs shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#72C4E8] text-xs font-bold tracking-widest">📦 STOCK</p>
              <button
                onClick={() => setShowStock(false)}
                className="text-white/40 hover:text-white text-lg leading-none transition"
              >✕</button>
            </div>
            <div className="flex flex-col gap-2">
              {product.product_variants.map((v) => {
                const sold = 99 - v.available;
                return (
                  <div key={v.variant_option_value1} className="flex items-center justify-between">
                    <span className="text-white text-sm">{v.variant_option_value1}</span>
                    <span className={`text-sm font-semibold ${sold === 99 ? 'text-red-400' : 'text-[#72C4E8]'}`}>
                      ขายแล้ว {sold}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-white/60 text-xs">ยอดรวมทั้งหมด</span>
              <span className="text-white font-bold text-sm">
                {product.product_variants.reduce((sum, v) => sum + (99 - v.available), 0)} ชิ้น
              </span>
            </div>
          </div>
        </div>
      )}

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