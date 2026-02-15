'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

/**
 * Interface for the BeforeInstallPromptEvent
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleInstallable = () => {
      setShowBanner(true);
    };

    window.addEventListener('pwa-installable', handleInstallable);

    // Check if already installable (event might have fired before component mounted)
    if ((window as any).deferredPrompt) {
      setShowBanner(true);
    }

    // Check if the app is already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowBanner(false);
    }

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = (window as any).deferredPrompt as BeforeInstallPromptEvent | undefined;
    if (!promptEvent) return;

    // Show the install prompt
    await promptEvent.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await promptEvent.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    (window as any).deferredPrompt = null;
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      id="pwa-install-banner"
      className="fixed bottom-24 left-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-primary text-primary-foreground p-4 rounded-xl shadow-lg flex items-center justify-between gap-4 border border-primary-foreground/10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Install NoCap</p>
            <p className="text-xs opacity-90 text-primary-foreground/80">Get the full experience on your home screen</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleInstallClick}
            className="whitespace-nowrap font-semibold h-9"
          >
            Install
          </Button>
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
