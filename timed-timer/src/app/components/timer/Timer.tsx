"use client";

import React, { useCallback, useEffect, useRef } from 'react';
import { useTimer } from '../../context/TimerContext';
import { useSettings } from '../../context/SettingsContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { formatTime } from '../../lib/utils';
import { Progress } from '../ui/progress';
import { Play, Pause, Square, SkipForward, BarChart } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { Analytics } from '../analytics/Analytics';

/**
 * Timer component that displays the current time and state
 * Handles timer logic and state transitions with proper cleanup
 */
export default function Timer() {
  const { 
    currentTime, 
    totalTime, 
    timerState, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    stopTimer, 
    skipBreak,
    sessionData 
  } = useTimer();
  const { settings } = useSettings();
  const [showAnalytics, setShowAnalytics] = React.useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/Red Light.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Play sound when timer finishes
    if (timerState === 'break' && audioRef.current) {
      audioRef.current.play();
    }
  }, [timerState]);

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopTimer();
  };

  const handleStartTimer = () => {
    startTimer(1500); // 25 minutes in seconds
    resumeTimer();
  };

  const progress = totalTime > 0 ? ((totalTime - currentTime) / totalTime) * 100 : 0;
  const timeDisplay = formatTime(currentTime);

  const getStateMessage = () => {
    switch (timerState) {
      case 'running':
        return "Let's focus!";
      case 'paused':
        return "Take a moment";
      case 'break':
        return "Time for a break";
      default:
        return "Ready when you are";
    }
  };

  if (showAnalytics) {
    return <Analytics onBack={() => setShowAnalytics(false)} data={sessionData} />;
  }

  return (
    <div className="relative p-8 overflow-hidden">
      {/* Background gradient effect */}
      <div className={cn(
        "absolute inset-0 opacity-20 transition-colors duration-500",
        timerState === 'running' && "bg-gradient-to-br from-primary to-primary/30",
        timerState === 'break' && "bg-gradient-to-br from-green-500 to-green-500/30",
        timerState === 'paused' && "bg-gradient-to-br from-yellow-500 to-yellow-500/30"
      )} />

      {/* Analytics button */}
      <Button
        variant="outline"
        className="absolute top-4 right-4"
        onClick={() => setShowAnalytics(true)}
      >
        <BarChart className="w-4 h-4 mr-2" />
        Analytics
      </Button>

      {/* Timer content */}
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Timer display */}
          <div className="text-center">
            <div className="relative">
              <div className={cn(
                "text-8xl font-bold font-mono tracking-tight transition-colors dark:text-white",
                timerState === 'break' && "text-green-500",
                timerState === 'paused' && "text-yellow-500"
              )}>
                {timeDisplay}
              </div>
              <div className="absolute -bottom-6 left-0 right-0">
                <p className={cn(
                  "text-sm font-medium transition-colors dark:text-white",
                  timerState === 'break' && "text-green-500",
                  timerState === 'paused' && "text-yellow-500",
                  "text-muted-foreground"
                )}>
                  {getStateMessage()}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md">
            <Progress 
              value={progress} 
              className={cn(
                "h-2 transition-all duration-500",
                timerState === 'break' && "bg-green-500/20 [&>div]:bg-green-500",
                timerState === 'paused' && "bg-yellow-500/20 [&>div]:bg-yellow-500"
              )}
              aria-label={`Timer progress: ${Math.round(progress)}%`}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mt-8">
            {timerState === 'idle' && (
              <Button
                onClick={handleStartTimer}
                className={cn(
                  "h-12 w-12 rounded-full transition-all hover:scale-105",
                  "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Play className="w-6 h-6" />
              </Button>
            )}

            {timerState === 'running' && (
              <Button
                onClick={pauseTimer}
                className="h-12 w-12 rounded-full transition-all hover:scale-105"
              >
                <Pause className="w-6 h-6" />
              </Button>
            )}

            {timerState === 'paused' && (
              <Button
                onClick={resumeTimer}
                className="h-12 w-12 rounded-full transition-all hover:scale-105 bg-yellow-500 hover:bg-yellow-600"
              >
                <Play className="w-6 h-6" />
              </Button>
            )}

            {timerState !== 'idle' && (
              <Button
                onClick={handleStop}
                variant="destructive"
                className="h-12 w-12 rounded-full transition-all hover:scale-105"
              >
                <Square className="w-6 h-6" />
              </Button>
            )}

            {timerState === 'break' && (
              <Button
                onClick={skipBreak}
                className="h-12 w-12 rounded-full transition-all hover:scale-105 bg-green-500 hover:bg-green-600"
              >
                <SkipForward className="w-6 h-6" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
