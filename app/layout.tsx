import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WebSocketProvider } from '@/context/WebSocketContext';
import Provider from '@/components/Provider';
import 
import { FloatingNavbar } from '@/components/floating-navbar';
const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#4a5361ff',
};

export const metadata: Metadata = {
  title: 'Kwix - Learning Platform',
  description: 'Interactive learning platform with quizzes, real-time chat, and progress tracking',
  generator: 'Prometheus',
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kwix',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Kwix',
    title: 'Kwix - Learning Platform',
    description: 'Interactive learning platform with quizzes, real-time chat, and progress tracking',
  },
  twitter: {
    card: 'summary',
    title: 'Kwix - Learning Platform',
    description: 'Interactive learning platform with quizzes, real-time chat, and progress tracking',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Provider>
          <FloatingNavbar />
          <main id="main-content">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
