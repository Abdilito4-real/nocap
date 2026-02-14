'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { onboardingFeatures } from '@/lib/data';
import { CheckCircle } from 'lucide-react';

export function DesktopOnboarding() {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col bg-muted p-10 text-foreground">
        <div className="flex items-center gap-3">
          <Image src="/icons/icon-192x192.png" alt="NoCap Logo" width={40} height={40} />
        </div>
        <div className="m-auto max-w-md space-y-8">
            <h1 className="text-4xl font-bold tracking-tight">Your campus life, organized.</h1>
            <p className="text-muted-foreground">From assignments and job hunts to late-night confessions and viral campus clips, NoCap brings it all together.</p>
        </div>
        <div className="space-y-6">
            <blockquote className="border-l-2 pl-6 italic">
                "This is the one app every student needs. It's made my university experience so much more connected and manageable."
            </blockquote>
            <div className="text-sm">
                <p className="font-semibold">Jessica P.</p>
                <p className="text-muted-foreground">Computer Science, State University</p>
            </div>
             <div className="mt-8">
                <p className="text-sm font-semibold text-muted-foreground mb-4">JOINING 10,000+ STUDENTS FROM</p>
                 <div className="flex gap-6 items-center text-muted-foreground font-mono font-semibold">
                     <span>State University</span>
                     <span>City College</span>
                     <span>Tech Institute</span>
                 </div>
             </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
            <header className="text-center mb-8">
                <h2 className="text-3xl font-bold">Everything a student needs, in one app.</h2>
                <p className="text-muted-foreground mt-2">Discover the features that will transform your campus experience.</p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {onboardingFeatures.slice(1, 7).map((feature, index) => (
                    <Card key={index} className="bg-card flex flex-col">
                        <CardContent className="p-4">
                            {feature.image && (
                                <div className="relative aspect-video mb-4">
                                     <Image
                                        src={feature.image.imageUrl}
                                        alt={feature.title}
                                        fill
                                        style={{objectFit: "cover"}}
                                        className="rounded-md"
                                        data-ai-hint={feature.image.imageHint}
                                    />
                                </div>
                            )}
                            <h3 className="font-semibold mb-2 text-base">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="text-center mt-12">
                <Button asChild size="lg">
                    <Link href="/auth">Get Started Now</Link>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
