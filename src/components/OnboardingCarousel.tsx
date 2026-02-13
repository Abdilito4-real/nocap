'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

const getImage = (id: string): ImagePlaceholder | undefined => PlaceHolderImages.find(img => img.id === id);

const features = [
  {
    title: 'Your Campus Life, Reimagined',
    description: "Connect with friends, share moments, and stay in the loop with our dynamic video feed.",
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
];

export function OnboardingCarousel() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-background overflow-hidden">
        <Carousel className="w-full max-w-sm" opts={{ loop: true }}>
            <CarouselContent>
            {features.map((feature, index) => (
                <CarouselItem key={index}>
                <div className="p-1">
                    <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-[600px]">
                        {feature.image && (
                            <Image
                                src={feature.image.imageUrl}
                                alt={feature.title}
                                width={300}
                                height={400}
                                className="rounded-lg object-cover w-[300px] h-[400px] mb-6 shadow-lg"
                                data-ai-hint={feature.image.imageHint}
                            />
                        )}
                        <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                    </Card>
                </div>
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex left-[-50px]" />
            <CarouselNext className="hidden sm:flex right-[-50px]" />
        </Carousel>
        <div className="absolute bottom-16 z-10 w-full max-w-sm px-4">
             <Button asChild className="w-full" size="lg">
                <Link href="/auth">Get Started</Link>
            </Button>
        </div>
    </div>
  );
}
