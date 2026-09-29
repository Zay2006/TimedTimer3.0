"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTimer } from '../../context/TimerContext';
import { useSettings } from '../../context/SettingsContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { formatTime } from '../../utils/time';
import { Progress } from '../ui/progress';
import { Play, Pause, Square, SkipForward, BarChart, Timer as TimerIcon, Clock, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { Analytics } from '../analytics/Analytics';
import { TimerMode } from '@/app/types/timer';

/**
 * Timer component that displays the current time and state
 * Handles timer logic and state transitions with proper cleanup
 */
export default function Timer() {
  const { 
    currentTime, 
    totalTime, 
    timerState,
    timerMode,
    startTimer,
    startStopwatch,
    pauseTimer, 
    resumeTimer, 
    stopTimer, 
    skipBreak
  } = useTimer();
  const { settings } = useSettings();
  const [showAnalytics, setShowAnalytics] = React.useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/Fall.mp3');
    audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Play sound when timer finishes
    if (timerState === 'break' && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [timerState]);

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const handleStop = () => {
    stopSound();
    stopTimer();
  };

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const progress = totalTime > 0 ? ((totalTime - currentTime) / totalTime) * 100 : 0;
  const ringProgress = timerMode === TimerMode.STOPWATCH
    ? ((currentTime % 60) / 60) * 100
    : progress;
  const displaySeconds = timerState === 'idle' && currentTime === 0
    ? settings.defaultDuration
    : Math.max(0, currentTime);
  const timeDisplay = formatTime(displaySeconds);

  const ringColor = timerState === 'paused'
    ? '#f59e0b'
    : timerState === 'break'
      ? '#10b981'
      : timerState === 'running'
        ? '#8b5cf6'
        : '#6366f1';

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

  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (Math.min(100, Math.max(0, ringProgress)) / 100) * circumference;

  if (showAnalytics) {
    return <Analytics onBack={() => setShowAnalytics(false)} />;
  }

  return (
    <div className="space-y-4">
      <div 
      ref={containerRef}
      className={cn(
        "relative p-8 pt-20 overflow-hidden",
        isFullScreen && "h-screen flex items-center justify-center bg-background"
      )}
    >
      {/* Background gradient effect */}
      <div className={cn(
        "absolute inset-0 opacity-30 dark:opacity-50 transition-colors duration-500",
        timerState === 'running' && "bg-gradient-to-br from-primary to-primary/30 dark:from-primary/80",
        timerState === 'break' && "bg-gradient-to-br from-green-500 to-green-500/30 dark:from-green-500",
        timerState === 'paused' && "bg-gradient-to-br from-yellow-500 to-yellow-500/30 dark:from-yellow-500"
      )} />

      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullScreen}
        >
          {isFullScreen ? (
            <Minimize2 className="w-5 h-5" />
          ) : (
            <Maximize2 className="w-5 h-5" />
          )}
        </Button>
        {isPlaying && (
          <Button variant="ghost" size="icon" onClick={stopSound} className="text-destructive">
            <Square className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="default"
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white shadow-lg dark:shadow-blue-500/30 transition-all hover:scale-105 font-semibold"
          onClick={() => setShowAnalytics(true)}
        >
          <BarChart className="w-5 h-5 mr-2" />
          View Analytics
        </Button>
      </div>

      <Card className={cn(
        "relative p-8 space-y-8 border-white/40 bg-card/80 backdrop-blur-sm shadow-xl",
        isFullScreen && "transform scale-150"
      )}>
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold" style={{ color: ringColor }}>{getStateMessage()}</h2>
          <div className="relative h-56 w-56">
            <svg viewBox="0 0 220 220" className={cn("h-full w-full", timerState === 'running' && "timer-ring-active")} style={{ color: ringColor }}>
              <circle cx="110" cy="110" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="14" />
              <circle
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 110 110)"
                className="transition-[stroke-dashoffset] duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl font-mono font-bold tracking-wider tabular-nums" style={{ color: ringColor }}>
                {timeDisplay}
              </div>
            </div>
          </div>
        </div>

        {settings.showProgressBar && timerMode === TimerMode.COUNTDOWN && totalTime > 0 && (
          <Progress 
            value={progress} 
            className="h-2"
          />
        )}

        <div className="flex justify-center gap-4">
          {timerState === 'idle' ? (
            <>
              <Button 
                onClick={() => startTimer(settings.defaultDuration || 1500)} 
                className="gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95 transition-transform"
              >
                <TimerIcon className="w-4 h-4" />
                Timer
              </Button>
              <Button 
                onClick={() => startStopwatch()} 
                className="gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-transform"
              >
                <Clock className="w-4 h-4" />
                Stopwatch
              </Button>
            </>
          ) : timerState === 'running' ? (
            <Button 
              onClick={pauseTimer} 
              variant="outline" 
              size="icon"
              className="h-12 w-12 border-amber-400 bg-amber-400/15 text-amber-600 hover:bg-amber-400/25 hover:scale-105 active:scale-95 transition-transform"
            >
              <Pause className="w-6 h-6" />
            </Button>
          ) : timerState === 'paused' ? (
            <>
              <Button 
                onClick={resumeTimer} 
                variant="outline" 
                size="icon"
                className="h-12 w-12 border-emerald-400 bg-emerald-400/15 text-emerald-600 hover:bg-emerald-400/25 hover:scale-105 active:scale-95 transition-transform"
              >
                <Play className="w-6 h-6" />
              </Button>
              <Button 
                onClick={handleStop} 
                variant="outline" 
                size="icon"
                className="h-12 w-12 border-rose-400 bg-rose-400/15 text-rose-600 hover:bg-rose-400/25 hover:scale-105 active:scale-95 transition-transform"
              >
                <Square className="w-6 h-6" />
              </Button>
            </>
          ) : timerState === 'break' ? (
            <Button 
              onClick={skipBreak} 
              variant="outline" 
              className="gap-2 border-emerald-400 bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-transform"
            >
              <SkipForward className="w-4 h-4" />
              Skip Break
            </Button>
          ) : null}
        </div>
      </Card>
      </div>
    </div>
  );
}
