import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'mhaymhey ✦ Stellagrima',
  description: 'mhaymhey fan site — Stellagrima 💙',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-[#EFF8FF] text-[#1A3A5C]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
