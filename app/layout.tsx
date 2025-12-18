// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WebSocketProvider } from '@/context/WebSocketContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quix Chat',
  description: 'Real-time chat for Quix learning platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebSocketProvider>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <main id="main-content">{children}</main>
        </WebSocketProvider>
      </body>
    </html>
  );
}