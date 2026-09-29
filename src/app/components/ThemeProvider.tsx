"use client";

import { useSettings } from '../context/SettingsContext';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

function themeClassName(theme: string) {
  if (theme === 'dark') return 'dark';
  if (theme === 'theme-purple' || theme === 'purple') return 'theme-purple';
  if (theme === 'theme-blue' || theme === 'blue') return 'theme-blue';
  return '';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [systemDark, setSystemDark] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const skipFirstTransition = useRef(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const resolved = settings.theme === 'system'
    ? (systemDark ? 'dark' : 'light')
    : settings.theme;

  useEffect(() => {
    if (skipFirstTransition.current) {
      skipFirstTransition.current = false;
      return;
    }
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [resolved]);

  return (
    <div
      className={cn(
        'min-h-screen bg-background text-foreground transition-colors duration-300',
        themeClassName(resolved),
        isTransitioning && 'theme-transitioning'
      )}
    >
      {children}
    </div>
  );
}
