"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Timer, Settings, BarChart2, Trophy } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();

  const navItems = [
    {
      title: 'Timer',
      href: '/',
      icon: Timer
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: BarChart2
    },
    {
      title: 'Achievements',
      href: '/achievements',
      icon: Trophy
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings
    }
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map(({ title, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            pathname === href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Icon className="h-4 w-4 mr-2" />
          {title}
        </Link>
      ))}
    </nav>
  );
}
