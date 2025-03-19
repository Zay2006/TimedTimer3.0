"use client";

import React from 'react';
import { useTimer } from '../context/TimerContext';
import { useSettings } from '../context/SettingsContext';
import { Card } from './ui/card';
import { formatTime } from '../lib/utils';
import { Progress } from './ui/progress';

export default function TimerDisplay() {
  const { currentTime, totalTime, timerState } = useTimer();
  const { settings } = useSettings();

  const progress = totalTime > 0 ? ((totalTime - currentTime) / totalTime) * 100 : 0;
  const timeDisplay = formatTime(currentTime);

  const getStateMessage = () => {
    switch (timerState) {
      case 'running':
        return "Let&apos;s focus!";
      case 'paused':
        return "Take a moment";
      case 'break':
        return "Time for a break";
      default:
        return "Ready when you are";
    }
  };

  return (
    <Card className={`p-6 w-full max-w-md mx-auto ${settings.theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold font-mono" role="timer" aria-label={`Time remaining: ${timeDisplay}`}>
            {timeDisplay}
          </h2>
          <p className="text-sm text-muted-foreground mt-2" aria-live="polite">
            {getStateMessage()}
          </p>
        </div>
        <Progress 
          value={progress} 
          className="h-2" 
          aria-label={`Timer progress: ${Math.round(progress)}%`}
        />
      </div>
    </Card>
  );
}
