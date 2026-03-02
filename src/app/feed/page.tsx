'use client';

import { AppLayout } from '@/components/AppLayout';
import { VideoPost } from '@/components/VideoPost';
import { useCollection } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { videoPosts as staticVideoPosts } from '@/lib/data';

export default function FeedPage() {
  const { data: videoPosts, loading, error } = useCollection('videoPosts');

  const displayPosts = videoPosts && videoPosts.length > 0 ? videoPosts : (loading ? [] : staticVideoPosts);

  return (
    <AppLayout>
      <div className="h-full w-full max-w-md mx-auto overflow-y-auto snap-y snap-mandatory bg-black">
        {loading && videoPosts === null && (
          <div className="h-full w-full flex flex-col gap-4 p-4">
            <Skeleton className="h-[80vh] w-full rounded-xl" />
            <Skeleton className="h-[80vh] w-full rounded-xl" />
          </div>
        )}

        {error && (
          <div className="p-8 text-center text-white">
            <p className="text-red-500 mb-4 font-semibold">Error loading feed</p>
            <p className="text-sm opacity-70">Showing cached content instead.</p>
          </div>
        )}

        {displayPosts.map((post: any) => (
          <VideoPost key={post.id} post={post} />
        ))}

        {!loading && displayPosts.length === 0 && (
          <div className="h-full flex items-center justify-center text-white p-8 text-center">
            <p>No videos found. Be the first to post!</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
