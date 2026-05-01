import type { Metadata, Viewport } from 'next';
import { Nunito, Noto_Sans_Sinhala } from 'next/font/google';
import './globals.css';

const nunito = Nunito({ 
  subsets: ['latin'], 
  variable: '--font-nunito' 
});

const notoSansSinhala = Noto_Sans_Sinhala({ 
  subsets: ['sinhala'], 
  variable: '--font-sinhala' 
});

export const viewport: Viewport = {
  themeColor: '#FFF9F5', // Warm off-white
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Maathru Care — Pregnancy AI Companion',
  description: 'AI-powered pregnancy support with passive mood detection, bilingual chat, and offline-first capabilities.',
  applicationName: 'Maathru Care',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default', // Changed from black-translucent to default for light theme
    title: 'Maathru Care',
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#FFF9F5" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${nunito.variable} ${notoSansSinhala.variable} font-sans bg-bg-primary text-brand-textPrimary antialiased`}>
        {children}
      </body>
    </html>
  );
}
