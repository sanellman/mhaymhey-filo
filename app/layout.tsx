import type { Metadata } from 'next';
import './globals.css';

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
      </body>
    </html>
  );
}
