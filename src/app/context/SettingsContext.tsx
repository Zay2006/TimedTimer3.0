 "use client";

/**
 * Settings Management System
 * 
 * This context provides centralized settings management with the following features:
 * - Timer presets management
 * - Theme customization (light/dark mode)
 * - Sound settings
 * - Notification preferences
 * - Data persistence
 * - Spotify integration settings
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TimerPreset, TimerSettings } from '../types/timer';

/**
 * Default timer presets configuration
 * @constant
 */
const defaultPresets: TimerPreset[] = [
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    duration: 25 * 60,
    breakDuration: 5 * 60,
    color: '#10b981', // emerald-500
  },
  {
    id: 'long',
    name: 'Long Focus',
    duration: 50 * 60,
    breakDuration: 10 * 60,
    color: '#3b82f6', // blue-500
  },
  {
    id: 'short',
    name: 'Quick Focus',
    duration: 15 * 60,
    breakDuration: 3 * 60,
    color: '#8b5cf6', // violet-500
  },
];

/**
 * Default application settings
 * @constant
 */
const defaultSettings: TimerSettings = {
  soundEnabled: true,
  volume: 0.5, // Changed from 50 to 0.5 (50%) for HTMLMediaElement compatibility
  notificationsEnabled: true,
  theme: 'system',
  presets: defaultPresets,
  spotifyEnabled: false,
  spotifyToken: null,
  youtubeEnabled: false,
  analyticsConfig: {
    metrics: {
      focusScore: {
        factors: ['duration', 'consistency', 'completion'],
        weights: [0.4, 0.3, 0.3]
      },
      productivity: {
        factors: ['focusTime', 'completedSessions', 'achievements'],
        weights: [0.5, 0.3, 0.2]
      }
    },
    timeRanges: {
      daily: {
        intervals: ['hour'],
        aggregation: 'sum'
      },
      weekly: {
        intervals: ['day'],
        aggregation: 'average'
      },
      monthly: {
        intervals: ['week'],
        aggregation: 'average'
      }
    }
  },
  // Timer-specific settings
  defaultDuration: 25 * 60, // 25 minutes by default
  autoStartBreaks: true,
  autoStartNextSession: false,
  longBreakInterval: 4,
  longBreakDuration: 15 * 60, // 15 minutes
  showProgressBar: true,
  showTimeInTitle: true,
};

/**
 * Settings context type definition
 * @interface
 */
interface SettingsContextType {
  /**
   * Current application settings
   */
  settings: TimerSettings;
  /**
   * Updates the application settings
   * @param {TimerSettings} settings - New settings to apply
   */
  updateSettings: (settings: TimerSettings) => void;
  /**
   * Indicates whether dark mode is enabled
   */
  isDarkMode: boolean;
  /**
   * Updates a timer preset
   * @param {TimerPreset} preset - Updated preset
   */
  updatePreset: (preset: TimerPreset) => void;
  /**
   * Deletes a timer preset
   * @param {string} presetId - ID of the preset to delete
   */
  deletePreset: (presetId: string) => void;
  /**
   * Adds a new timer preset
   * @param {TimerPreset} preset - New preset to add
   */
  addPreset: (preset: TimerPreset) => void;
}

/**
 * Settings context
 * @constant
 */
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Settings provider component
 * @param {React.ReactNode} children - Child components
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('timerSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Merge with default settings to ensure new properties are included
      setSettings({ ...defaultSettings, ...parsed });
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(settings));
  }, [settings]);

  // Handle theme changes
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(
      settings.theme === 'dark' || (settings.theme === 'system' && prefersDark)
    );

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (settings.theme === 'system') {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [settings.theme]);

  /**
   * Updates the application settings
   * @param {TimerSettings} newSettings - New settings to apply
   */
  const updateSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
  };

  /**
   * Updates a timer preset
   * @param {TimerPreset} preset - Updated preset
   */
  const updatePreset = (preset: TimerPreset) => {
    const updatedPresets = settings.presets.map(p => 
      p.id === preset.id ? preset : p
    );
    updateSettings({ ...settings, presets: updatedPresets });
  };

  /**
   * Deletes a timer preset
   * @param {string} presetId - ID of the preset to delete
   */
  const deletePreset = (presetId: string) => {
    const updatedPresets = settings.presets.filter(p => p.id !== presetId);
    updateSettings({ ...settings, presets: updatedPresets });
  };

  /**
   * Adds a new timer preset
   * @param {TimerPreset} preset - New preset to add
   */
  const addPreset = (preset: TimerPreset) => {
    updateSettings({
      ...settings,
      presets: [...settings.presets, preset],
    });
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      isDarkMode,
      updatePreset,
      deletePreset,
      addPreset,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * Hook to access the settings context
 */
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
