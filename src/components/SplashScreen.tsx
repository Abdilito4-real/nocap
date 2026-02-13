'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="flex items-center gap-4 animate-pulse">
            <Icons.logo className="h-16 w-16 text-primary" />
            <h1 className="text-6xl font-bold text-foreground">NoCap</h1>
        </div>
    </div>
  );
}
