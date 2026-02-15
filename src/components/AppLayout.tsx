'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SideNav } from '@/components/SideNav';
import { BottomNav } from '@/components/BottomNav';
import { PwaInstallBanner } from '@/components/PwaInstallBanner';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isFeedPage = pathname === '/feed';

  React.useEffect(() => {
    if (window.localStorage.getItem('showWelcomeNotification') === 'true') {
      if ('Notification' in window && 'serviceWorker' in navigator && Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification('Welcome to NoCap!', {
                body: "You're all set up. Let's explore!",
                icon: '/icon.png',
              });
            });
          }
          // Always remove the flag after the permission prompt is handled
          window.localStorage.removeItem('showWelcomeNotification');
        });
      } else {
         // If notifications aren't supported or are denied, just remove the flag
         window.localStorage.removeItem('showWelcomeNotification');
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      {!isMobile && <SideNav />}
      <main className={cn('flex-1', { 'pb-16 md:pb-0': !isFeedPage })}>{children}</main>
      <PwaInstallBanner />
      {isMobile && <BottomNav />}
    </div>
  );
}
