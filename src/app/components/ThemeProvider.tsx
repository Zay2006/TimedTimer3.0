"use client";

import { useSettings } from '../context/SettingsContext';
import { useEffect, useState } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [theme, setTheme] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Check if we should use system preference
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const newTheme = mediaQuery.matches ? 'dark' : 'light';
      if (newTheme !== theme) {
        setIsTransitioning(true);
        setTheme(newTheme);
      }

      // Listen for system theme changes
      const handler = (e: MediaQueryListEvent) => {
        setIsTransitioning(true);
        setTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else if (settings.theme !== theme) {
      setIsTransitioning(true);
      setTheme(settings.theme || 'light');
    }
  }, [settings.theme, theme]);

  // Reset transition flag
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const themeClasses = [
    'min-h-screen',
    'bg-background',
    'text-foreground',
    'transition-all',
    'duration-300',
    theme,
    theme === 'purple' && 'theme-purple',
    theme === 'blue' && 'theme-blue',
    isTransitioning && 'theme-transitioning'
  ].filter(Boolean).join(' ');

  return (
    <div className={themeClasses}>
      {children}
    </div>
  );
}
