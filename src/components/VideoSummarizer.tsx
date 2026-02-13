'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Bot, FileVideo, Wand2 } from 'lucide-react';
import { summarizeVideo } from '@/ai/flows/summarize-video-flow';
import { useToast } from '@/hooks/use-toast';

export function VideoSummarizer() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSummary(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a video file to summarize.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSummary(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const videoDataUri = reader.result as string;
        const result = await summarizeVideo({ videoDataUri });
        setSummary(result.summary);
      };
      reader.onerror = (error) => {
         throw new Error('Failed to read file.');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Summarization Failed',
        description: 'Something went wrong while summarizing the video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileVideo/> Upload Video</CardTitle>
          <CardDescription>Select a video file from your device.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept="video/*" onChange={handleFileChange} />
          {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
          <Button onClick={handleSubmit} disabled={isLoading || !file} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Summarizing...' : 'Generate Summary'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot /> AI Summary</CardTitle>
          <CardDescription>The summary of your video will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Analyzing video and generating summary...</p>
            </div>
          )}
          {summary && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
                {summary.split('. ').map((sentence, index) => (
                    sentence ? <p key={index}>{sentence}.</p> : null
                ))}
            </div>
          )}
          {!isLoading && !summary && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <p>Your summary is just a click away.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
