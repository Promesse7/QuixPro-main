import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Provider from '@/components/Provider';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#3b82f6',
};

export const metadata: Metadata = {
  title: 'QuixPro - Learning Platform',
  description: 'Interactive learning platform with quizzes, real-time chat, and progress tracking',
  generator: 'v0.app',
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QuixPro',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'QuixPro',
    title: 'QuixPro - Learning Platform',
    description: 'Interactive learning platform with quizzes, real-time chat, and progress tracking',
  },
  twitter: {
    card: 'summary',
    title: 'QuixPro - Learning Platform',
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
          <main id="main-content">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
