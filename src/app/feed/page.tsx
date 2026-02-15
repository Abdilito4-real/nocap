import { AppLayout } from '@/components/AppLayout';
import { VideoPost } from '@/components/VideoPost';
import { videoPosts } from '@/lib/data';

export default function FeedPage() {
  return (
    <AppLayout>
      <div className="h-full w-full max-w-md mx-auto overflow-y-auto snap-y snap-mandatory">
        {videoPosts.map((post) => (
          <VideoPost key={post.id} post={post} />
        ))}
      </div>
    </AppLayout>
  );
}
