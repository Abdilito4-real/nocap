import { AppLayout } from '@/components/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { assignments } from '@/lib/data';
import { AddAssignmentDialog } from '@/components/AddAssignmentDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AssignmentsPage() {
  const upcomingAssignments = assignments.filter(a => !a.completed);
  const completedAssignments = assignments.filter(a => a.completed);

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Assignment Tracker</h1>
          <AddAssignmentDialog />
        </header>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAssignments.map((assignment) => (
                <Card key={assignment.id} className="bg-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="secondary" className="mb-2">{assignment.courseCode}</Badge>
                        <CardTitle>{assignment.title}</CardTitle>
                      </div>
                       <div className="flex items-center space-x-2 pt-1">
                        <Checkbox id={`task-${assignment.id}`} />
                        <label htmlFor={`task-${assignment.id}`} className="text-sm font-medium">Done</label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Due on {format(new Date(assignment.dueDate), "MMMM d, yyyy")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
             {upcomingAssignments.length === 0 && <p className="text-muted-foreground">No upcoming assignments. Great job!</p>}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Completed</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedAssignments.map((assignment) => (
                <Card key={assignment.id} className="bg-card opacity-60">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="secondary" className="mb-2">{assignment.courseCode}</Badge>
                        <CardTitle className="line-through">{assignment.title}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2 pt-1">
                        <Checkbox id={`task-${assignment.id}`} checked={true} />
                        <label htmlFor={`task-${assignment.id}`} className="text-sm font-medium">Done</label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Completed on {format(new Date(assignment.dueDate), "MMMM d, yyyy")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {completedAssignments.length === 0 && <p className="text-muted-foreground">No completed assignments yet.</p>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
