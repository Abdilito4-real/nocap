'use client';

import * as React from 'react';
import { SideNav } from '@/components/SideNav';
import { BottomNav } from '@/components/BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen">
      {!isMobile && <SideNav />}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      {isMobile && <BottomNav />}
    </div>
  );
}
