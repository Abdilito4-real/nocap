'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2500); // 2.5 seconds delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/icons/icon-192x192.png"
          alt="NoCap Logo"
          width={96}
          height={96}
          className="animate-subtle-bounce"
        />
        <div className="flex items-baseline">
          <h1 className="text-6xl font-bold text-primary">No</h1>
          <h1 className="text-6xl font-bold text-accent">Cap</h1>
        </div>
        <p className="text-muted-foreground">Your campus. Unfiltered. All in one.</p>
      </div>
    </div>
  );
}
