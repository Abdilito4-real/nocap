'use client';

import { OnboardingCarousel } from '@/components/OnboardingCarousel';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function OnboardingPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Skeleton className="h-full w-full" />
            </div>
        );
    }

    return <OnboardingCarousel />;
}
