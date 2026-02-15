'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SideNav } from '@/components/SideNav';
import { BottomNav } from '@/components/BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isFeedPage = pathname === '/feed';

  return (
    <div className="flex min-h-screen">
      {!isMobile && <SideNav />}
      <main className={cn('flex-1', { 'pb-16 md:pb-0': !isFeedPage })}>{children}</main>
      {isMobile && <BottomNav />}
    </div>
  );
}
