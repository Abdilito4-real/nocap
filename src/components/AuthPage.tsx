'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/Icons';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthAction = async () => {
    // For the demo, we are not implementing real authentication.
    // The main goal is to show the notification on sign up.
    if (isLogin) {
      router.push('/feed');
      return;
    }

    // Sign-up flow
    if (!('Notification' in window)) {
      toast({
        title: 'Notifications not supported',
        description: 'This browser does not support desktop notifications.',
        variant: 'destructive',
      });
      router.push('/feed');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Welcome to NoCap', {
          body: 'Your campus just got real. Start scrolling, posting, and connecting.',
          icon: '/icons/icon-192x192.png',
        });
      } else {
        toast({
          title: 'Notifications Disabled',
          description:
            'You can enable notifications later in your browser settings if you change your mind.',
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: 'Notification Error',
        description:
          'Something went wrong while trying to show the notification.',
        variant: 'destructive',
      });
    } finally {
      // Proceed to the app after the notification logic.
      router.push('/feed');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-blue-50/20 to-purple-50/20" />
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <div className="flex items-center gap-2 mb-4">
          <Image
            src="/icons/icon-192x192.png"
            alt="NoCap Logo"
            width={32}
            height={32}
          />
        </div>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Your campus. Unfiltered. All in one.
        </p>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? 'Enter your credentials to access your account.'
                : "Let's get you started."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {!isLogin && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Alex Doe" />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@university.edu"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              onClick={handleAuthAction}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </Button>
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
          </CardFooter>
        </Card>
        <p className="mt-4 text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <Button
            variant="link"
            className="px-1"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </Button>
        </p>
      </div>
    </div>
  );
}
