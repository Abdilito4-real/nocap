'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userProfile as staticUserProfile } from '@/lib/data';
import Image from 'next/image';
import { Eye, Flame, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUser, useDoc, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, setDoc } from 'firebase/firestore';
import { format, subDays } from 'date-fns';

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { data: userProfile, loading: profileLoading } = useDoc(user ? `users/${user.uid}` : null);
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/auth');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (!firestore || !user || !userProfile || profileLoading) {
      return;
    }

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const lastCheckIn = userProfile.lastCheckInDate;

    // Already checked in today
    if (lastCheckIn === todayStr) {
      return;
    }

    const userDocRef = doc(firestore, 'users', user.uid);
    let newCurrentStreak = userProfile.currentStreak || 0;
    let newLongestStreak = userProfile.longestStreak || 0;

    if (lastCheckIn === yesterdayStr) {
      // User checked in yesterday, continue the streak
      newCurrentStreak += 1;
    } else {
      // User missed a day or it's their first time, reset streak
      newCurrentStreak = 1;
    }

    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }
    
    const updatedProfile = {
      lastCheckInDate: todayStr,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
    };

    setDoc(userDocRef, updatedProfile, { merge: true }).catch(serverError => {
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'update',
        requestResourceData: updatedProfile,
      });
      errorEmitter.emit('permission-error', permissionError);
      console.error("Failed to update streak data.");
    });

  }, [user, userProfile, firestore, profileLoading]);

  const isLoading = userLoading || profileLoading;

  const displayName = userProfile?.displayName || user?.displayName;
  const photoURL = userProfile?.photoURL || user?.photoURL;
  const email = userProfile?.email || user?.email;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-8">
          <header className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
            <div className="text-center md:text-left space-y-2">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-5 w-64" />
              <Button variant="outline" size="sm" className="mt-4 invisible">Edit Profile</Button>
            </div>
          </header>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
           </div>
        </div>
      </AppLayout>
    );
  }
  
  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <header className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary">
            {photoURL && <AvatarImage src={photoURL} alt={displayName || 'User'} />}
            <AvatarFallback className="text-4xl">
              {displayName ? displayName.charAt(0).toUpperCase() : '?'}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{displayName}</h1>
            <p className="text-muted-foreground">{email}</p>
            <Button variant="outline" size="sm" className="mt-4">Edit Profile</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card className="p-4 flex items-center gap-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <Flame className="h-10 w-10 text-amber-500" />
              <div>
                  <div className="text-3xl font-bold">{userProfile?.currentStreak ?? 0}</div>
                  <p className="text-muted-foreground">Day Streak</p>
              </div>
          </Card>
          <Card className="p-4 flex items-center gap-4 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800">
              <Trophy className="h-10 w-10 text-slate-500" />
              <div>
                  <div className="text-3xl font-bold">{userProfile?.longestStreak ?? 0}</div>
                  <p className="text-muted-foreground">Longest Streak</p>
              </div>
          </Card>
        </div>


        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos">My Videos</TabsTrigger>
            <TabsTrigger value="jobs">Saved Jobs</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {staticUserProfile.videos.map((video) => (
                <div key={video.id} className="relative aspect-[3/4] group">
                  <Image src={video.thumbnailUrl || ''} alt="User video" fill className="rounded-lg object-cover" data-ai-hint={video.imageHint} />
                  <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <Eye className="h-5 w-5" />
                      <span>{video.views}</span>
                    </div>
                  </div>
                </div>
              ))}
               {staticUserProfile.videos.length === 0 && <p className="text-muted-foreground col-span-full">You haven't posted any videos yet.</p>}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="mt-6">
            <div className="space-y-4">
              {staticUserProfile.savedJobs.map((job) => (
                <Card key={job.id} className="bg-card">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <Button>View</Button>
                  </CardContent>
                </Card>
              ))}
               {staticUserProfile.savedJobs.length === 0 && <p className="text-muted-foreground">You have no saved jobs.</p>}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="mt-6">
             <div className="space-y-4">
              {staticUserProfile.assignments.map((assignment) => (
                <Card key={assignment.id} className="bg-card">
                   <CardContent className="p-4 flex items-center justify-between">
                    <div>
                       <Badge variant="secondary" className="mb-1">{assignment.courseCode}</Badge>
                      <h3 className="font-semibold">{assignment.title}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">Due {assignment.dueDate}</div>
                  </CardContent>
                </Card>
              ))}
               {staticUserProfile.assignments.length === 0 && <p className="text-muted-foreground">You have no assignments listed.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
