import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { confessions } from '@/lib/data';
import Image from 'next/image';
import { ArrowUp, ArrowDown, MessageCircle, Send } from 'lucide-react';

export default function ConfessionsPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-accent">Anonymous Confessions</h1>
          <p className="text-muted-foreground">Share your thoughts freely and anonymously.</p>
        </header>

        <Card className="mb-8 bg-card">
          <CardContent className="p-4">
            <Textarea
              placeholder="What's on your mind...?"
              className="mb-4 bg-background"
            />
            <div className="flex justify-end">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Send className="mr-2 h-4 w-4" /> Post
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {confessions.map((post) => (
            <Card key={post.id} className="bg-card overflow-hidden">
              <CardContent className="p-6">
                <p className="text-foreground mb-4">{post.content}</p>
                {post.image && (
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                    <Image src={post.image} alt="Confession image" layout="fill" objectFit="cover" data-ai-hint={post.imageHint} />
                  </div>
                )}
                <div className="flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-accent/10 hover:text-accent">
                        <ArrowUp className="h-5 w-5" />
                      </Button>
                      <span className="font-bold text-sm text-foreground">{post.upvotes - post.downvotes}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-accent/10 hover:text-accent">
                        <ArrowDown className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">{post.comments} Comments</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
