'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
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
import { Skeleton } from '@/components/ui/skeleton';

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
  const [isClient, setIsClient] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    form.reset({
      name: '',
      email: '',
      password: '',
    });
  }, [isLogin, form]);

  const handleNotificationsAndRedirect = () => {
    // Request notification permission and show a welcome message
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Welcome to NoCap!', {
            body: "You're all set up. Let's explore!",
            icon: '/icon.png',
          });
        }
      });
    }
    // Redirect immediately. The notification will appear even after navigation.
    router.push('/feed');
  };
  
  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
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
        await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
      } else { // Handle Sign Up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const user = userCredential.user;
        await updateProfile(user, { displayName: values.name });
  
        const userDocRef = doc(firestore, 'users', user.uid);
        const userProfileData = {
          displayName: values.name,
          email: user.email,
          photoURL: user.photoURL,
          currentStreak: 0,
          longestStreak: 0,
          lastCheckInDate: null,
        };
        
        // This setDoc operation should not be awaited if we want to redirect immediately
        setDoc(userDocRef, userProfileData).catch(serverError => {
            const permissionError = new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'create',
              requestResourceData: userProfileData,
            });
            errorEmitter.emit('permission-error', permissionError);
            // Log the error but don't block the user flow.
            console.error("Failed to create user profile, but proceeding with login.");
        });
      }
      handleNotificationsAndRedirect();
    } catch (error: any) {
      let description = error.message || 'An unknown error occurred. Please try again.';
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
        description = 'Authentication provider is not configured. Please make sure you have enabled Email/Password sign-in method in your Firebase project console.';
      }
      toast({
        title: 'Authentication Error',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) {
      toast({
        title: 'Error',
        description: 'Firebase not initialized. Please try again later.',
        variant: 'destructive',
      });
      return;
    }
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const additionalInfo = getAdditionalUserInfo(result);
        
        if (additionalInfo?.isNewUser) {
            const userDocRef = doc(firestore, 'users', user.uid);
            const userProfileData = {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                currentStreak: 0,
                longestStreak: 0,
                lastCheckInDate: null,
            };
            await setDoc(userDocRef, userProfileData, { merge: true });
        }
        
        handleNotificationsAndRedirect();
  
    } catch (error: any) {
      let description = error.message || 'Could not sign in with Google. Please try again.';
      if (error.code === 'auth/unauthorized-domain') {
        description = `This app's domain (${window.location.hostname}) is not authorized for Google Sign-In. Go to the Firebase console > Authentication > Settings > Authorized domains and add it.`;
      } else if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
        description = 'Authentication provider is not configured. Please make sure you have enabled Google sign-in method in your Firebase project console.';
      }
      if (error.code !== 'auth/popup-closed-by-user') {
          toast({
            title: 'Google Sign-In Error',
            description: description,
            variant: 'destructive',
          });
      }
    } finally {
        setIsGoogleLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col bg-muted p-10 text-foreground">
          <div className="flex items-center gap-3">
            <Image src="/icon.png" alt="NoCap Logo" width={40} height={40} />
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

        <div className="flex items-center justify-center p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-sm">
            <Card className="w-full">
              <CardHeader className="text-center space-y-2">
                <Skeleton className="h-7 w-3/4 mx-auto" />
                <Skeleton className="h-5 w-full mx-auto" />
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
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
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
            <div className="flex justify-center">
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col bg-muted p-10 text-foreground">
        <div className="flex items-center gap-3">
          <Image src="/icon.png" alt="NoCap Logo" width={40} height={40} />
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

      <div className="flex items-center justify-center p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-sm">
          <Card className="w-full">
            <CardHeader className="text-center">
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
          <p className="text-center text-sm text-muted-foreground">
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
    </div>
  );
}
