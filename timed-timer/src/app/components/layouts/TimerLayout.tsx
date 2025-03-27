"use client";

import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { cn } from '@/app/lib/utils';

interface TimerLayoutProps {
  children: React.ReactNode;
}

export default function TimerLayout({ children }: TimerLayoutProps) {
  const { settings } = useSettings();

  return (
    <div className={cn(
      "min-h-screen w-full py-8 px-4",
      "flex flex-col items-center justify-start",
      settings.youtubeEnabled && "gap-8"
    )}>
      <div className={cn(
        "w-full max-w-4xl mx-auto",
        settings.youtubeEnabled ? "flex-1" : "h-full"
      )}>
        {children}
      </div>
    </div>
  );
}
