
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { AddAssignmentDialog } from '@/components/AddAssignmentDialog';
import { AssignmentAssistantDialog } from '@/components/AssignmentAssistantDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { assignments as initialAssignments } from '@/lib/data';
import { format, differenceInDays, isToday, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Assignment = typeof initialAssignments[0];

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleToggleComplete = (id: number) => {
    setAssignments(
      assignments.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const getUrgency = (dueDateStr: string, completed: boolean) => {
    if (completed) {
      return {
        label: 'Completed',
        cardClass: 'bg-muted opacity-60',
        badgeClass: 'bg-gray-200 text-gray-800',
        titleClass: 'line-through'
      };
    }
    const dueDate = new Date(dueDateStr);
    const daysUntilDue = differenceInDays(dueDate, new Date());
    const isDueToday = isToday(dueDate);
    const isOverdue = !isDueToday && isPast(dueDate);

    if (isOverdue) {
      return {
        label: 'Overdue',
        cardClass: 'bg-red-50 border-red-200',
        badgeClass: 'bg-red-500 text-white animate-pulse',
        titleClass: ''
      };
    }
    if (isDueToday) {
      return {
        label: 'Due Today',
        cardClass: 'bg-red-50 border-red-200',
        badgeClass: 'bg-red-500 text-white',
        titleClass: ''
      };
    }
    if (daysUntilDue < 3) {
      return {
        label: `${daysUntilDue + 1} days left`,
        cardClass: 'bg-amber-50 border-amber-200',
        badgeClass: 'bg-amber-400 text-amber-900',
        titleClass: ''
      };
    }
    return {
      label: 'Upcoming',
      cardClass: 'bg-green-50 border-green-200',
      badgeClass: 'bg-green-400 text-green-900',
      titleClass: ''
    };
  };
  
  const upcomingAssignments = assignments.filter((a) => !a.completed);
  const completedAssignments = assignments.filter((a) => a.completed);

  const AssignmentCard = ({ assignment, onToggle, index }: { assignment: Assignment, onToggle: (id: number) => void, index: number }) => {
    const urgency = getUrgency(assignment.dueDate, assignment.completed);
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className={cn("transition-all hover:shadow-md border-2 flex flex-col", urgency.cardClass)}>
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="secondary" className="mb-2 font-normal">{assignment.courseCode}</Badge>
                <CardTitle className={cn("text-lg", urgency.titleClass)}>{assignment.title}</CardTitle>
              </div>
              <Badge variant="outline" className={cn("border-2", urgency.badgeClass)}>{urgency.label}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex-grow">
             <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {assignment.completed ? `Completed on ${isClient ? format(new Date(assignment.dueDate), "EEE, MMM d") : ''}` : `Due on ${isClient ? format(new Date(assignment.dueDate), "EEE, MMM d") : ''}`}
                </p>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={`task-${assignment.id}`}
                        checked={assignment.completed}
                        onCheckedChange={() => onToggle(assignment.id)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <label
                        htmlFor={`task-${assignment.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Done
                    </label>
                </div>
            </div>
          </CardContent>
          {!assignment.completed && (
            <CardFooter className="p-2 border-t bg-card mt-auto">
                <AssignmentAssistantDialog assignment={assignment} />
            </CardFooter>
          )}
        </Card>
      </motion.div>
    );
  };
  
  const SkeletonGrid = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
    </div>
  );

  return (
    <AppLayout>
      <div className="h-full overflow-y-auto p-4 md:p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Assignment Tracker</h1>
            <p className="text-muted-foreground">Stay on top of your coursework.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <AddAssignmentDialog />
          </div>
        </header>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Upcoming</h2>
             {!isClient ? <SkeletonGrid /> : (
                upcomingAssignments.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingAssignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((assignment, index) => (
                      <AssignmentCard key={assignment.id} assignment={assignment} onToggle={handleToggleComplete} index={index} />
                    ))}
                  </div>
                ) : (
                  <Card className="flex flex-col items-center justify-center p-8 text-center bg-muted/50 border-dashed">
                    <p className="mb-4 text-muted-foreground">No upcoming assignments. Time to relax or get ahead!</p>
                    <AddAssignmentDialog />
                  </Card>
                )
             )}
          </div>

          {isClient && completedAssignments.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Completed</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedAssignments.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).map((assignment, index) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} onToggle={handleToggleComplete} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
