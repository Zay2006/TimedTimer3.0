"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTimer } from '../../context/TimerContext';
import { useSettings } from '../../context/SettingsContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { formatTime } from '../../lib/utils';
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

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/Fall.mp3');
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
  const timeDisplay = formatTime(timerMode === TimerMode.STOPWATCH ? currentTime : Math.max(0, currentTime));

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
    return <Analytics onBack={() => setShowAnalytics(false)} />;
  }

  return (
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
        "relative p-8 space-y-8 dark:bg-gray-900/90 dark:border-gray-600 backdrop-blur-sm shadow-xl dark:shadow-gray-900/50",
        isFullScreen && "transform scale-150"
      )}>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold dark:text-white">{getStateMessage()}</h2>
          <div className="text-6xl font-mono font-bold tracking-wider dark:text-blue-300">
            {timeDisplay}
          </div>
        </div>

        {timerMode === TimerMode.COUNTDOWN && totalTime > 0 && (
          <Progress 
            value={progress} 
            className="h-2 dark:bg-gray-800 dark:[&>div]:bg-blue-500"
          />
        )}

        <div className="flex justify-center gap-4">
          {timerState === 'idle' ? (
            <>
              <Button 
                onClick={() => startTimer(1500)} 
                className="gap-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white font-semibold shadow-lg dark:shadow-blue-500/30"
              >
                <TimerIcon className="w-4 h-4" />
                Timer
              </Button>
              <Button 
                onClick={() => startStopwatch()} 
                className="gap-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white font-semibold shadow-lg dark:shadow-blue-500/30"
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
              className="dark:border-blue-400 dark:hover:bg-blue-500/20 dark:text-blue-300 dark:hover:text-blue-200"
            >
              <Pause className="w-6 h-6" />
            </Button>
          ) : timerState === 'paused' ? (
            <>
              <Button 
                onClick={resumeTimer} 
                variant="outline" 
                size="icon"
                className="dark:border-blue-400 dark:hover:bg-blue-500/20 dark:text-blue-300 dark:hover:text-blue-200"
              >
                <Play className="w-6 h-6" />
              </Button>
              <Button 
                onClick={handleStop} 
                variant="outline" 
                size="icon"
                className="dark:border-blue-400 dark:hover:bg-blue-500/20 dark:text-blue-300 dark:hover:text-blue-200"
              >
                <Square className="w-6 h-6" />
              </Button>
            </>
          ) : timerState === 'break' ? (
            <Button 
              onClick={skipBreak} 
              variant="outline" 
              className="gap-2 dark:border-green-400 dark:hover:bg-green-500/20 dark:text-green-300 dark:hover:text-green-200"
            >
              <SkipForward className="w-4 h-4" />
              Skip Break
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
