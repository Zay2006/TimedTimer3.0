"use client";

import React, { useCallback, useEffect } from 'react';
import { useTimer } from '../../context/TimerContext';
import { useSettings } from '../../context/SettingsContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { formatTime } from '../../lib/utils';
import { Progress } from '../ui/progress';
import { Play, Pause, Square, SkipForward } from 'lucide-react';
import { cn } from '@/app/lib/utils';

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
    skipBreak 
  } = useTimer();
  const { settings } = useSettings();
  
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

  return (
    <div className="relative p-8 overflow-hidden">
      {/* Background gradient effect */}
      <div className={cn(
        "absolute inset-0 opacity-20 transition-colors duration-500",
        timerState === 'running' && "bg-gradient-to-br from-primary to-primary/30",
        timerState === 'break' && "bg-gradient-to-br from-green-500 to-green-500/30",
        timerState === 'paused' && "bg-gradient-to-br from-yellow-500 to-yellow-500/30"
      )} />

      {/* Timer content */}
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Timer display */}
          <div className="text-center">
            <div className="relative">
              <div className={cn(
                "text-8xl font-bold font-mono tracking-tight transition-colors",
                timerState === 'break' && "text-green-500",
                timerState === 'paused' && "text-yellow-500"
              )}>
                {timeDisplay}
              </div>
              <div className="absolute -bottom-6 left-0 right-0">
                <p className={cn(
                  "text-sm font-medium transition-colors",
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
                onClick={() => startTimer(1500)}
                className={cn(
                  "h-12 w-12 rounded-full transition-all hover:scale-105",
                  "bg-primary hover:bg-primary/90"
                )}
              >
                <Play className="w-6 h-6" />
              </Button>
            )}
            
            {timerState === 'running' && (
              <Button
                onClick={pauseTimer}
                className={cn(
                  "h-12 w-12 rounded-full transition-all hover:scale-105",
                  "bg-primary hover:bg-primary/90"
                )}
              >
                <Pause className="w-6 h-6" />
              </Button>
            )}
            
            {timerState === 'paused' && (
              <Button
                onClick={resumeTimer}
                className={cn(
                  "h-12 w-12 rounded-full transition-all hover:scale-105",
                  "bg-yellow-500 hover:bg-yellow-500/90"
                )}
              >
                <Play className="w-6 h-6" />
              </Button>
            )}
            
            {timerState !== 'idle' && (
              <Button
                variant="outline"
                onClick={stopTimer}
                className="h-12 w-12 rounded-full transition-all hover:scale-105 hover:bg-destructive hover:text-destructive-foreground"
              >
                <Square className="w-6 h-6" />
              </Button>
            )}
            
            {timerState === 'break' && (
              <Button
                variant="outline"
                onClick={skipBreak}
                className={cn(
                  "h-12 w-12 rounded-full transition-all hover:scale-105",
                  "bg-green-500 hover:bg-green-500/90 text-white border-0"
                )}
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
