'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Home,
  Briefcase,
  BookCheck,
  MessageSquareOff,
  GraduationCap,
  Bot,
  User,
} from 'lucide-react';

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

// Icons configuration
const floatingIcons = [
  { icon: Home, className: 'top-[15%] left-[10%]', colorClasses: 'bg-yellow-400/10 text-yellow-200', delay: '0s', duration: '8s' },
  { icon: Briefcase, className: 'top-[20%] right-[15%]', colorClasses: 'bg-green-400/10 text-green-200', delay: '1s', duration: '10s' },
  { icon: BookCheck, className: 'bottom-[25%] left-[15%]', colorClasses: 'bg-blue-400/10 text-blue-200', delay: '2s', duration: '7s' },
  { icon: MessageSquareOff, className: 'bottom-[15%] right-[10%]', colorClasses: 'bg-red-400/10 text-red-200', delay: '3s', duration: '9s' },
  { icon: GraduationCap, className: 'top-[55%] left-[25%]', colorClasses: 'bg-purple-400/10 text-purple-200', delay: '4s', duration: '11s' },
  { icon: Bot, className: 'top-[70%] right-[20%]', colorClasses: 'bg-cyan-400/10 text-cyan-200', delay: '0.5s', duration: '12s' },
  { icon: User, className: 'bottom-[40%] right-[45%]', colorClasses: 'bg-pink-400/10 text-pink-200', delay: '1.5s', duration: '8s' },
  { icon: Home, className: 'top-[5%] right-[5%]', colorClasses: 'bg-yellow-400/10 text-yellow-200', delay: '2.5s', duration: '9s' },
  { icon: BookCheck, className: 'bottom-[5%] left-[5%]', colorClasses: 'bg-blue-400/10 text-blue-200', delay: '3.5s', duration: '10s' },
];

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
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-black overflow-hidden">
      
      {/* Background tilt */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[150vw] h-[150vh] -top-1/4 -left-1/4 bg-primary/5 transform -rotate-12" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {floatingIcons.map((item, index) => (
            <div
                key={index}
                className={cn(
                'absolute animate-float backdrop-blur-md p-4 rounded-2xl shadow-lg',
                item.className,
                item.colorClasses
                )}
                style={{ animationDelay: item.delay, animationDuration: item.duration }}
            >
                <item.icon className="h-8 w-8" />
            </div>
            ))}
      </div>

      {!isLastSlide && (
        <div className="absolute top-4 right-4 z-30">
          <Button
            asChild
            variant="outline"
            className="text-white/90 border-white/40 bg-black/20 backdrop-blur-sm hover:bg-white/10 hover:text-white"
          >
            <Link href="/auth">Skip</Link>
          </Button>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-30">
        <Image
          src="/icons/icon-192x192.png"
          alt="NoCap Logo"
          width={40}
          height={40}
        />
      </div>

      <Carousel setApi={setApi} className="w-full max-w-sm md:max-w-xl relative z-10">
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
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg shadow-lg"
                        data-ai-hint={feature.image.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 rounded-lg" />
                    <div className="relative z-30 w-full text-left mb-24 md:mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-white/90 text-base md:text-lg">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute bottom-10 z-30 w-full max-w-sm md:max-w-xl px-4 flex flex-col items-center gap-6">
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
