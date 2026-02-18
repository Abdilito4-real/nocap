import { AppLayout } from '@/components/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { jobs as staticJobs } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/firebase';

export default function JobsPage() {
  const { data: jobs, loading, error } = useCollection('jobs');

  const displayJobs = jobs && jobs.length > 0 ? jobs : (loading ? [] : staticJobs);

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Job Board</h1>
          <p className="text-muted-foreground">Find part-time jobs, internships, and gigs tailored for you.</p>
          <div className="relative mt-4 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search jobs by title, company..." className="pl-10" />
          </div>
        </header>

        {loading && jobs === null && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 text-sm">
            Failed to load live jobs. Showing preview data.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayJobs.map((job: any) => (
            <Card key={job.id} className="bg-card flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{job.title}</CardTitle>
                  <Badge variant={job.location === 'Remote' ? 'default' : 'secondary'} className={job.location === 'Remote' ? 'bg-accent text-accent-foreground' : ''}>{job.location}</Badge>
                </div>
                <CardDescription>{job.company}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{job.description}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
