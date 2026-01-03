import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-neutral-100 text-neutral-900">
        <main className="max-w-md mx-auto min-h-screen p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
