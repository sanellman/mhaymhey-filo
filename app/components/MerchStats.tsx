'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Variant = {
  id: number;
  available: number;
  variant_option_value1: string;
};

type Product = {
  product_name: string;
  price: string;
  img_url: string;
  product_variants: Variant[];
};

export default function MerchStats() {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
  fetch('/api/merch')
    .then((res) => res.json())
    .then((res) => {
      setProduct(res.data);
    });
}, []);

  if (!product) return null;

  // 👉 คำนวณยอดขาย
  const totalSold = product.product_variants.reduce((sum, v) => {
    return sum + (99 - v.available);
  }, 0);

  const totalStock = product.product_variants.reduce((sum, v) => {
    return sum + v.available;
  }, 0);

  const totalMax = product.product_variants.length * 99;

  const percent = Math.round((totalSold / totalMax) * 100);

  return (
    <div className="bg-white/10 border border-[#1B90C8]/40 rounded-2xl p-4 backdrop-blur-sm shadow-lg">

      {/* Header */}
      <p className="text-[#72C4E8] text-xs font-bold tracking-widest text-center">
        🎂 BIRTHDAY MERCH
      </p>

      <div className="mt-3 text-center">
  <a
    href="https://shop.line.me/@siamdol/product/1007977948"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-[#1B90C8] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow hover:scale-105 transition"
  >
    🛒 สั่งซื้อสินค้า
  </a>
</div>

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

      {/* Sold */}
      <p className="text-white text-3xl font-black text-center mt-3">
        {totalSold.toLocaleString()}
      </p>

      <p className="text-[#72C4E8] text-xs text-center tracking-widest">
        SOLD
      </p>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B90C8]"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Variant breakdown (optional เท่ๆ) */}
      <div className="mt-4 space-y-1 max-h-32 overflow-auto pr-1">
        {product.product_variants.map((v) => {
          const sold = 99 - v.available;

          return (
            <div
              key={v.id}
              className="flex justify-between text-xs text-white/70"
            >
              <span>{v.variant_option_value1}</span>
              <span>{sold} sold</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}