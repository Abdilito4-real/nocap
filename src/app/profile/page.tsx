import { AppLayout } from '@/components/AppLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userProfile } from '@/lib/data';
import Image from 'next/image';
import { Eye, Briefcase, BookCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <header className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary">
            {userProfile.avatarUrl && <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} data-ai-hint={userProfile.avatarHint} />}
            <AvatarFallback className="text-4xl">{userProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{userProfile.name}</h1>
            <p className="text-muted-foreground">{userProfile.university}</p>
            <p className="text-muted-foreground">{userProfile.course} - Year {userProfile.year}</p>
            <p className="mt-2 text-sm max-w-md">{userProfile.bio}</p>
            <Button variant="outline" size="sm" className="mt-4">Edit Profile</Button>
          </div>
        </header>

        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos">My Videos</TabsTrigger>
            <TabsTrigger value="jobs">Saved Jobs</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userProfile.videos.map((video) => (
                <div key={video.id} className="relative aspect-[3/4] group">
                  <Image src={video.thumbnailUrl || ''} alt="User video" layout="fill" objectFit="cover" className="rounded-lg" data-ai-hint={video.imageHint} />
                  <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <Eye className="h-5 w-5" />
                      <span>{video.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="mt-6">
            <div className="space-y-4">
              {userProfile.savedJobs.map((job) => (
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
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="mt-6">
             <div className="space-y-4">
              {userProfile.assignments.map((assignment) => (
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
