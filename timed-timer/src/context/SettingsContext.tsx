"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TimerSettings, TimerPreset } from '@/types/timer';

interface SettingsContextType {
  settings: TimerSettings;
  updateSettings: (newSettings: TimerSettings) => void;
}

const defaultPresets: TimerPreset[] = [
  { id: 'pomodoro', name: 'Pomodoro', duration: 1500 },
  { id: 'shortBreak', name: 'Short Break', duration: 300 },
  { id: 'longFocus', name: 'Long Focus', duration: 3600 },
  { id: 'quickFocus', name: 'Quick Focus', duration: 900 },
];

const defaultSettings: TimerSettings = {
  theme: 'light',
  volume: 50,
  notifications: true,
  autoStartBreaks: true,
  autoStartNextSession: false,
  defaultDuration: 1500,
  defaultBreakDuration: 300,
  spotifyEnabled: false,
  presets: defaultPresets,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('timerSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
