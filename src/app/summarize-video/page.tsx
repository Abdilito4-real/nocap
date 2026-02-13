import { AppLayout } from '@/components/AppLayout';
import { VideoSummarizer } from '@/components/VideoSummarizer';

export default function SummarizeVideoPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">AI Video Summarizer</h1>
          <p className="text-muted-foreground">
            Upload a video lecture or meeting to get a quick, AI-powered summary.
          </p>
        </header>
        <VideoSummarizer />
      </div>
    </AppLayout>
  );
}
