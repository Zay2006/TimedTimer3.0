 "use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TimerPreset, TimerSettings } from '../types/timer';

const defaultPresets: TimerPreset[] = [
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    duration: 25 * 60,
    breakDuration: 5 * 60,
  },
  {
    id: 'long',
    name: 'Long Focus',
    duration: 50 * 60,
    breakDuration: 10 * 60,
  },
  {
    id: 'short',
    name: 'Short Focus',
    duration: 15 * 60,
    breakDuration: 3 * 60,
  },
];

const defaultSettings: TimerSettings = {
  soundEnabled: true,
  volume: 50,
  notificationsEnabled: true,
  theme: 'system',
  presets: defaultPresets,
  spotifyEnabled: false,
  spotifyToken: null,
};

interface SettingsContextType {
  settings: TimerSettings;
  updateSettings: (settings: TimerSettings) => void;
  isDarkMode: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('timerSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(settings));
  }, [settings]);

  // Handle theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = settings.theme === 'dark' || 
      (settings.theme === 'system' && prefersDark);
    
    setIsDarkMode(isDark);
    root.classList.toggle('dark', isDark);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.theme === 'system') {
        const newIsDark = mediaQuery.matches;
        setIsDarkMode(newIsDark);
        root.classList.toggle('dark', newIsDark);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  const updateSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
