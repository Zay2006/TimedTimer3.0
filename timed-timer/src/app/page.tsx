"use client";

import React from 'react';
import { useSettings } from './context/SettingsContext';
import Timer from '@/app/components/timer/Timer';
import TimerControls from '@/app/components/timer/TimerControls';
import PresetSelector from '@/app/components/timer/PresetSelector';
import SessionStats from './components/analytics/SessionStats';
import StreakCounter from './components/analytics/StreakCounter';
import Achievements from './components/analytics/Achievements';
import SpotifyPlayer from './components/spotify/SpotifyPlayer';
import { Button } from './components/ui/button';
import { Settings, Moon, Sun } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { settings, updateSettings, isDarkMode } = useSettings();

  const toggleTheme = () => {
    updateSettings({
      ...settings,
      theme: settings.theme === 'dark' ? 'light' : 'dark'
    });
  };

  return (
    <main className="container max-w-4xl py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Focus Timer</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          <Timer />
          <TimerControls />
          <PresetSelector />
          {settings.spotifyEnabled && settings.spotifyToken && (
            <SpotifyPlayer />
          )}
        </div>
        <div className="space-y-8">
          <SessionStats />
          <StreakCounter />
        </div>
      </div>

      <Achievements />
    </main>
  );
}
