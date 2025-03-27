"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Settings, BarChart2 } from 'lucide-react';
import { ModeToggle } from '@/app/components/mode-toggle';
import { Clock } from './ui/clock';

export function Header() {
  const pathname = usePathname();
  const isAnalyticsPage = pathname === '/analytics';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex-1">
          <Link href="/" className="font-bold text-xl">
            TimedTimer
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <Clock />
        </div>

        <div className="flex-1 flex items-center justify-end gap-2">
          {!isAnalyticsPage && (
            <Link href="/analytics">
              <Button variant="ghost" size="icon">
                <BarChart2 className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
