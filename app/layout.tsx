import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WebSocketProvider } from '@/context/WebSocketContext';
import Provider from '@/components/Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quix Chat',
  description: 'Real-time chat for Quix learning platform',
    generator: 'v0.app'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Provider>
          <WebSocketProvider>
            <main id="main-content">{children}</main>
          </WebSocketProvider>
        </Provider>
      </body>
    </html>
  );
}
