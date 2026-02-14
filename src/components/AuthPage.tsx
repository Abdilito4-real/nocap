'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/Icons';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const formSchema = isLogin
    ? loginSchema
    : signupSchema.extend({ name: signupSchema.shape.name });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(isLogin ? {} : { name: '' }),
    },
  });

  React.useEffect(() => {
    form.reset({
      email: '',
      password: '',
      ...(isLogin ? {} : { name: '' }),
    });
  }, [isLogin, form]);

  const handleNotificationsAndRedirect = async () => {
    if (!isLogin && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('Welcome to NoCap', {
            body: 'Your campus just got real. Start scrolling, posting, and connecting.',
            icon: '/icons/icon-192x192.png',
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
    router.push('/feed');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!auth || !firestore) {
      toast({
        title: 'Error',
        description: 'Firebase not initialized. Please try again later.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const loginValues = values as z.infer<typeof loginSchema>;
        await signInWithEmailAndPassword(
          auth,
          loginValues.email,
          loginValues.password
        );
      } else {
        const signupValues = values as z.infer<typeof signupSchema>;
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          signupValues.email,
          signupValues.password
        );
        const user = userCredential.user;
        await updateProfile(user, { displayName: signupValues.name });
        await setDoc(doc(firestore, 'users', user.uid), {
          displayName: signupValues.name,
          email: user.email,
          photoURL: user.photoURL,
        });
      }
      await handleNotificationsAndRedirect();
    } catch (error: any) {
      toast({
        title: 'Authentication Error',
        description:
          error.code === 'auth/invalid-credential'
            ? 'Invalid email or password.'
            : 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(
        doc(firestore, 'users', user.uid),
        {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
        { merge: true }
      );
      await handleNotificationsAndRedirect();
    } catch (error: any) {
      toast({
        title: 'Google Sign-In Error',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
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
            <CardTitle>{isLogin ? 'Welcome Back' : 'Create an Account'}</CardTitle>
            <CardDescription>
              {isLogin
                ? 'Enter your credentials to access your account.'
                : "Let's get you started."}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid gap-4">
                {!isLogin && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Alex Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="student@university.edu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLogin ? 'Log In' : 'Sign Up'}
                </Button>
              </CardFooter>
            </form>
          </Form>
          <div className="relative mb-4 px-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="px-6 pb-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
          </div>
        </Card>
        <p className="mt-4 text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <Button
            variant="link"
            className="px-1"
            onClick={() => setIsLogin(!isLogin)}
            disabled={isLoading || isGoogleLoading}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </Button>
        </p>
      </div>
    </div>
  );
}
