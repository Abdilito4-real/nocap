'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, BookCheck, MessageSquareOff, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

const mainNavItems = [
  { href: '/feed', icon: Home, label: 'Feed' },
  { href: '/jobs', icon: Briefcase, label: 'Jobs' },
  { href: '/assignments', icon: BookCheck, label: 'Assignments' },
  { href: '/confessions', icon: MessageSquareOff, label: 'Confessions' },
];

const secondaryNavItems = [
    { href: '/summarize-video', icon: Bot, label: 'AI Summarizer' },
];

const profileNavItem = { href: '/profile', icon: User, label: 'Profile' };

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="p-4 flex items-center gap-2">
        <Image
          src="/icons/icon-192x192.png"
          alt="NoCap Logo"
          width={32}
          height={32}
        />
      </div>
      <nav className="px-4 space-y-2">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground',
                isActive && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
        <Separator className="my-4" />
        {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
                <Link
                key={item.label}
                href={item.href}
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground',
                    isActive && 'bg-primary/10 text-primary font-semibold'
                )}
                >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                </Link>
            );
        })}
      </nav>
      <div className="mt-auto p-4">
        <Link
          href={profileNavItem.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground',
            pathname === profileNavItem.href && 'bg-secondary text-foreground font-semibold'
          )}
        >
          <profileNavItem.icon className="h-5 w-5" />
          <span className="font-medium">{profileNavItem.label}</span>
        </Link>
      </div>
    </aside>
  );
}
