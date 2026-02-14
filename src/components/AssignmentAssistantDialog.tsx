'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  assistWithAssignment,
  type AssistAssignmentOutput,
} from '@/ai/flows/assist-assignment-flow';
import { Bot, Loader2, Lightbulb, CheckSquare, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from './ui/badge';

interface AssignmentAssistantDialogProps {
  assignment: {
    title: string;
    courseCode: string;
  };
}

export function AssignmentAssistantDialog({ assignment }: AssignmentAssistantDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AssistAssignmentOutput | null>(null);
  const { toast } = useToast();

  const handleGetAssistance = async () => {
    setIsLoading(true);
    setAiResponse(null);
    try {
      const response = await assistWithAssignment({
        title: assignment.title,
        courseCode: assignment.courseCode,
      });
      setAiResponse(response);
    } catch (error: any) {
      console.error('Failed to get AI assistance:', error);
      let description = error.message || 'Could not get suggestions. Please try again.';

      if (error.message && (error.message.includes('403 Forbidden') || error.message.includes('permission is denied'))) {
        description = `AI service access denied (403 Forbidden). You've confirmed the API is enabled—thank you! This error now likely means the API key is missing or invalid in your app's configuration.

Please check for a file named '.env' in your project's root folder and ensure it contains your Gemini API Key like this:
GEMINI_API_KEY="YOUR_API_KEY_HERE"

If the file or key is missing, you can create a key in the Google Cloud Console for project 'studio-1986122519-7a15c' under 'APIs & Services > Credentials'. After adding the key, the application may need to be restarted.`;

      } else if (error.message && error.message.includes('generativelanguage.googleapis.com')) {
        description = `AI service access denied. This usually means the 'Generative Language API' (also known as the Gemini API) isn't enabled. Please go to your Google Cloud Console for project 'studio-1986122519-7a15c', search for and enable the "Generative Language API", and then try again.`;
      }
      
      toast({
        title: 'AI Assistant Configuration Error',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when dialog is closed
  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setAiResponse(null);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-accent-foreground gap-2">
          <Bot className="h-4 w-4 text-primary" />
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Assignment Assistant</DialogTitle>
          <DialogDescription>
            Get help planning your assignment: "{assignment.title}"
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!aiResponse && !isLoading && (
            <div className="flex flex-col items-center justify-center text-center gap-4 p-8 bg-muted/50 rounded-lg">
                <Bot className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Let AI help you break down this task, find resources, and estimate the time required.</p>
                <Button onClick={handleGetAssistance}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Get Suggestions
                </Button>
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Your AI assistant is thinking...</p>
            </div>
          )}
          {aiResponse && (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><CheckSquare />Suggested Sub-tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            {aiResponse.subTasks.map((task, index) => <li key={index}>{task}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                         <CardTitle className="text-lg flex items-center gap-2"><Lightbulb />Research Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {aiResponse.suggestedResources.map((resource, index) => (
                                <Badge key={index} variant="secondary">{resource}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Timer />Estimated Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold text-lg">{aiResponse.timeEstimate}</p>
                    </CardContent>
                </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
