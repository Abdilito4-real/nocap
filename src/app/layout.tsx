import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { PwaRegistry } from '@/components/PwaRegistry';
import { PwaInstallBanner } from '@/components/PwaInstallBanner';

export const metadata: Metadata = {
  title: 'NoCap',
  description: 'A student-centric social and utility app.',
  icons: {
    icon: '/icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <PwaRegistry />
          <PwaInstallBanner />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
