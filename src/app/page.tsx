"use client";

import React from 'react';
import { useSettings } from './context/SettingsContext';
import Timer from '@/app/components/timer/Timer';
import TimerControls from '@/app/components/timer/TimerControls';
import PresetSelector from '@/app/components/timer/PresetSelector';
import SessionStats from './components/analytics/SessionStats';
import StreakCounter from './components/analytics/StreakCounter';
import Achievements from './components/analytics/Achievements';
import YouTubePlayer from './components/youtube/YouTubePlayer';
import { Button } from './components/ui/button';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { Greeting } from './components/Greeting';
import { ThemePicker } from './components/ThemePicker';
import { useTimer } from './context/TimerContext';
import { TimerState } from './types/timer';

const ambientBackgrounds: Record<TimerState, string> = {
  [TimerState.IDLE]:
    'radial-gradient(900px circle at 8% -10%, rgba(139,92,246,0.38), transparent 55%), radial-gradient(700px circle at 100% 0%, rgba(56,189,248,0.28), transparent 50%), radial-gradient(800px circle at 70% 120%, rgba(244,114,182,0.22), transparent 45%)',
  [TimerState.RUNNING]:
    'radial-gradient(900px circle at 15% 0%, rgba(139,92,246,0.5), transparent 55%), radial-gradient(700px circle at 100% 20%, rgba(99,102,241,0.35), transparent 48%), radial-gradient(640px circle at 40% 100%, rgba(236,72,153,0.28), transparent 46%)',
  [TimerState.PAUSED]:
    'radial-gradient(900px circle at 10% 0%, rgba(245,158,11,0.42), transparent 55%), radial-gradient(700px circle at 100% 10%, rgba(251,191,36,0.28), transparent 50%), radial-gradient(640px circle at 50% 110%, rgba(249,115,22,0.22), transparent 46%)',
  [TimerState.BREAK]:
    'radial-gradient(900px circle at 12% -8%, rgba(16,185,129,0.42), transparent 55%), radial-gradient(700px circle at 100% 8%, rgba(45,212,191,0.3), transparent 50%), radial-gradient(640px circle at 60% 110%, rgba(52,211,153,0.24), transparent 46%)',
};

export default function Home() {
  const { settings } = useSettings();
  const { timerState } = useTimer();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {(Object.keys(ambientBackgrounds) as TimerState[]).map((state) => (
        <div
          key={state}
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            background: ambientBackgrounds[state],
            opacity: timerState === state ? 1 : 0,
          }}
        />
      ))}
      <div className="relative">
      <header className="border-b border-white/30 bg-card/40 backdrop-blur-md">
        <div className="container max-w-6xl mx-auto py-4">
          <div className="flex items-center justify-between px-4 gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 via-fuchsia-400 to-sky-400 bg-clip-text text-transparent">
                Focus Timer
              </h1>
              <p className="text-sm">
                <Greeting />, let's focus!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemePicker />
              <Button variant="ghost" size="icon" asChild className="rounded-full bg-card/70 hover:bg-card">
                <Link href="/settings" aria-label="Settings">
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
            <div className="bg-card/90 rounded-2xl shadow-xl shadow-violet-500/10 border border-white/50 overflow-hidden backdrop-blur-sm">
              <Timer />
              <TimerControls />
            </div>
            <div className="bg-card/90 rounded-2xl p-6 shadow-xl shadow-fuchsia-500/10 border border-white/50 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Timer Presets</h2>
              <PresetSelector />
            </div>
            {settings.youtubeEnabled && (
              <div className="bg-card/90 rounded-2xl p-6 shadow-xl shadow-rose-500/10 border border-white/50 backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-4">Music</h2>
                <YouTubePlayer />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-card/90 rounded-2xl p-6 shadow-xl shadow-sky-500/10 border border-white/50 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">Today's Progress</h2>
              <div className="space-y-6">
                <SessionStats />
                <StreakCounter />
              </div>
            </div>
            <div className="bg-card/90 rounded-2xl p-6 shadow-xl shadow-amber-500/10 border border-white/50 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">Achievements</h2>
              <Achievements />
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
