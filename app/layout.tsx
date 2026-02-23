import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { SecurityGate } from '@/components/security-gate';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hostel Management System',
  description: 'Manage organisations, hostels, and room configurations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SecurityGate>
          {children}
        </SecurityGate>
        <Toaster />
      </body>
    </html>
  );
}
