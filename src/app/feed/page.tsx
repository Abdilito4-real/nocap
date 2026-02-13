import { AppLayout } from '@/components/AppLayout';
import { VideoPost } from '@/components/VideoPost';
import { videoPosts } from '@/lib/data';

export default function FeedPage() {
  return (
    <AppLayout>
      <div className="h-full w-full overflow-y-auto snap-y snap-mandatory">
        <div className="max-w-md mx-auto">
          {videoPosts.map((post) => (
            <VideoPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
