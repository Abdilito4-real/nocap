import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send } from 'lucide-react';
import type { videoPosts } from '@/lib/data';

type VideoPostProps = {
  post: (typeof videoPosts)[0];
};

export function VideoPost({ post }: VideoPostProps) {
  return (
    <div className="h-screen w-full flex-shrink-0 snap-start flex items-center justify-center bg-black relative">
      <div className="relative w-full h-full">
        {post.videoUrl && (
          <Image
            src={post.videoUrl}
            alt={post.caption}
            layout="fill"
            objectFit="cover"
            className="opacity-80"
            data-ai-hint={post.videoHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
      </div>

      <div className="absolute bottom-16 md:bottom-20 left-4 right-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-10 w-10 border-2 border-primary">
            {post.user.avatarUrl && <AvatarImage src={post.user.avatarUrl} alt={post.user.name} data-ai-hint={post.user.avatarHint} />}
            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="font-bold">{post.user.name}</p>
        </div>
        <p className="text-sm">{post.caption}</p>
      </div>

      <div className="absolute right-4 bottom-24 md:bottom-28 flex flex-col gap-4 text-white">
        <Button variant="ghost" size="icon" className="flex flex-col h-auto gap-1 text-white hover:text-white hover:bg-white/10">
          <Heart className="h-8 w-8" />
          <span className="text-xs">{post.likes}</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex flex-col h-auto gap-1 text-white hover:text-white hover:bg-white/10">
          <MessageCircle className="h-8 w-8" />
          <span className="text-xs">{post.comments}</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex flex-col h-auto gap-1 text-white hover:text-white hover:bg-white/10">
          <Send className="h-8 w-8" />
          <span className="text-xs">{post.shares}</span>
        </Button>
      </div>
    </div>
  );
}
