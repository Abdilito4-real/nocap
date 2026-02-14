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
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

const getImage = (id: string): ImagePlaceholder | undefined => PlaceHolderImages.find(img => img.id === id);

const features = [
  {
    title: 'Your campus. Unfiltered. All in one.',
    description: "The first app that brings together academics, confessions, jobs, and community – built for students, by students.",
    image: getImage('onboarding_video_feed'),
  },
  {
    title: 'Never Miss a Deadline',
    description: 'Track all your assignments, quizzes, and exams in one place. Stay organized and on top of your coursework.',
    image: getImage('onboarding_assignments'),
  },
  {
    title: 'Find Your Next Opportunity',
    description: 'Discover part-time jobs, internships, and on-campus gigs tailored for students.',
    image: getImage('onboarding_jobs'),
  },
  {
    title: 'Share Your Thoughts Anonymously',
    description: 'A safe space to share confessions, thoughts, and feelings without revealing your identity.',
    image: getImage('onboarding_confessions'),
  },
  {
    title: 'Discover and Join Events',
    description: "From campus parties to study workshops, find out what's happening and get involved.",
    image: getImage('onboarding_events'),
  },
  {
    title: 'Collaborate and Succeed',
    description: 'Create or join study groups to conquer challenging subjects together with your peers.',
    image: getImage('onboarding_study_groups'),
  },
  {
    title: 'Master Your Finances',
    description: 'A simple budgeting tool to help you manage your expenses, save money, and stay on track.',
    image: getImage('onboarding_budgeting'),
  },
  {
    title: 'Your Entire Campus Life, Organized',
    description: "From your video posts and saved jobs to upcoming assignments, your profile keeps everything in one place.",
    image: getImage('onboarding_profile_summary'),
  },
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
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-background overflow-hidden">
        
        {!isLastSlide && (
          <div className="absolute top-4 right-4 z-20">
              <Button asChild variant="ghost" className="text-white/80 hover:text-white">
                  <Link href="/auth">Skip</Link>
              </Button>
          </div>
        )}

        <Carousel setApi={setApi} className="w-full max-w-sm md:max-w-xl">
            <CarouselContent>
            {features.map((feature, index) => (
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
                      <Link href="/auth">Get It</Link>
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
