'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { onboardingFeatures } from '@/lib/data';
import { cn } from '@/lib/utils';

export function OnboardingCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const isLastSlide = current === count - 1;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-background overflow-hidden">
        
        {!isLastSlide && (
          <div className="absolute top-4 right-4 z-20">
              <Button asChild variant="outline" className="text-white/90 border-white/40 bg-black/20 backdrop-blur-sm hover:bg-white/10 hover:text-white">
                  <Link href="/auth">Skip</Link>
              </Button>
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-20">
            <Image src="/icons/icon-192x192.png" alt="NoCap Logo" width={40} height={40} />
        </div>

        <Carousel setApi={setApi} className="w-full max-w-sm md:max-w-xl">
            <CarouselContent>
            {onboardingFeatures.map((feature, index) => (
                <CarouselItem key={index}>
                <div className="p-1">
                    <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="relative flex flex-col items-center justify-end p-6 h-[600px] md:h-[450px] text-white">
                        {feature.image && (
                            <Image
                                src={feature.image.imageUrl}
                                alt={feature.title}
                                fill
                                style={{objectFit: "cover"}}
                                className="rounded-lg shadow-lg"
                                data-ai-hint={feature.image.imageHint}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 rounded-lg" />
                        <div className="relative z-10 w-full text-left mb-24 md:mb-6">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-white/90 text-base md:text-lg">{feature.description}</p>
                        </div>
                    </CardContent>
                    </Card>
                </div>
                </CarouselItem>
            ))}
            </CarouselContent>
        </Carousel>

        <div className="absolute bottom-10 z-10 w-full max-w-sm md:max-w-xl px-4 flex flex-col items-center gap-6">
            <div className="flex gap-2">
                {Array.from({ length: count }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={cn(
                            'h-2 w-2 rounded-full transition-all bg-white/50',
                            current === index ? 'w-4 bg-primary' : 'bg-white/80'
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            <div className="w-full flex flex-col items-center gap-2">
              {isLastSlide && count > 0 ? (
                  <Button asChild className="w-full" size="lg">
                      <Link href="/auth">Get Started</Link>
                  </Button>
              ) : (
                  <Button onClick={handleNext} className="w-full" size="lg">
                      Next
                  </Button>
              )}
            </div>
        </div>
    </div>
  );
}
