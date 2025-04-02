"use client";

import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { cn } from '@/app/lib/utils';

/**
 * Interface for TimerLayout component props
 * @interface TimerLayoutProps
 * @property {React.ReactNode} children - Child components to be rendered within the layout
 */
interface TimerLayoutProps {
  children: React.ReactNode;
}

/**
 * TimerLayout Component
 * 
 * A layout component that provides consistent spacing and structure for the timer interface.
 * Handles responsive layout adjustments and integrates with the settings context for
 * YouTube embedding feature.
 * 
 * @component
 * @param {TimerLayoutProps} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within the layout
 * @returns {JSX.Element} Rendered TimerLayout component
 * 
 * @example
 * ```tsx
 * <TimerLayout>
 *   <TimerDisplay />
 *   <TimerControls />
 * </TimerLayout>
 * ```
 */
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
