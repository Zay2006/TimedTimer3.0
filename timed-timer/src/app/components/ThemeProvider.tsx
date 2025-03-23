"use client";

import { useSettings } from '../context/SettingsContext';
import { useEffect, useState } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if we should use system preference
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);

      // Listen for system theme changes
      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setIsDark(settings.theme === 'dark');
    }
  }, [settings.theme]);

  return (
    <div className={`min-h-screen bg-background ${isDark ? 'dark' : ''}`}>
      {children}
    </div>
  );
}
