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
import { Greeting } from './components/Greeting';

export default function Home() {
  const { settings, updateSettings, isDarkMode } = useSettings();

  const toggleTheme = () => {
    updateSettings({
      ...settings,
      theme: settings.theme === 'dark' ? 'light' : 'dark'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container max-w-6xl mx-auto py-4">
          <div className="flex items-center justify-between px-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Focus Timer
              </h1>
              <p className="text-sm">
                <Greeting />, let's focus!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground transition-colors"
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
        </div>
      </header>

      <main className="container max-w-6xl mx-auto py-8 px-4">
        <div className="grid gap-8 lg:grid-cols-[1.5fr,1fr] items-start">
          <div className="space-y-8">
            <div className="bg-card rounded-lg shadow-lg overflow-hidden">
              <Timer />
              <TimerControls />
            </div>
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Timer Presets</h2>
              <PresetSelector />
            </div>
            {settings.spotifyEnabled && settings.spotifyToken && (
              <div className="bg-card rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Music</h2>
                <SpotifyPlayer />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Today's Progress</h2>
              <div className="space-y-6">
                <SessionStats />
                <StreakCounter />
              </div>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>
              <Achievements />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
