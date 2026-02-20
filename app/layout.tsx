import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'ExpenseTracker – Manage Your Finances',
  description: 'A modern, professional expense tracking application to manage your personal finances.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f5f5f7]">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          {children}
        </main>
      </body>
    </html>
  );
}
