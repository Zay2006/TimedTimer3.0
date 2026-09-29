"use client";

import React from 'react';
import { useTimer } from '../../context/TimerContext';
import { Button } from '../ui/button';
import { Play, Pause, Square, SkipForward, Clock } from 'lucide-react';
import { cn } from '@/app/lib/utils';

const quickStarts = [
  { label: 'Quick 15', minutes: 15, className: 'border-violet-400/70 bg-violet-500/10 hover:bg-violet-500/20 text-violet-700 dark:text-violet-200' },
  { label: 'Focus 25', minutes: 25, className: 'border-emerald-400/70 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-200' },
  { label: 'Deep 50', minutes: 50, className: 'border-sky-400/70 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-200' },
];

export default function TimerControls() {
  const { 
    timerState,
    totalTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    skipBreak
  } = useTimer();

  const handleStartPause = () => {
    if (timerState === 'idle') {
      startTimer(25 * 60); // Default to 25 minutes
    } else if (timerState === 'running') {
      pauseTimer();
    } else if (timerState === 'paused') {
      resumeTimer();
    }
  };

  return (
    <div className="p-6 border-t border-border/50">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-4">
          {quickStarts.map((option) => {
            const active = timerState !== 'idle' && totalTime === option.minutes * 60;
            return (
              <Button
                key={option.label}
                variant="outline"
                className={cn(
                  "flex-1 min-w-[120px] max-w-[200px] h-20 flex flex-col items-center justify-center gap-1",
                  "hover:scale-105 active:scale-95 transition-all duration-200",
                  option.className,
                  active && "ring-2 ring-offset-2 ring-current scale-105 shadow-lg"
                )}
                onClick={() => startTimer(option.minutes * 60)}
              >
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">{option.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Main controls */}
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            onClick={handleStartPause}
            className={cn(
              "min-w-[140px] h-12 transition-all text-white",
              timerState === 'running' && "bg-amber-500 hover:bg-amber-500/90",
              timerState === 'paused' && "bg-emerald-500 hover:bg-emerald-500/90",
              timerState === 'idle' && "bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:opacity-95",
              "hover:scale-105 active:scale-95"
            )}
          >
            {timerState === 'idle' ? (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Focus
              </>
            ) : timerState === 'running' ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Resume
              </>
            )}
          </Button>

          {timerState !== 'idle' && (
            <Button
              size="lg"
              variant="outline"
              onClick={stopTimer}
              className={cn(
                "min-w-[100px] h-12",
                "hover:bg-destructive hover:text-destructive-foreground",
                "transition-all hover:scale-105"
              )}
            >
              <Square className="w-5 h-5 mr-2" />
              Stop
            </Button>
          )}

          {timerState === 'break' && (
            <Button
              size="lg"
              variant="outline"
              onClick={skipBreak}
              className={cn(
                "min-w-[100px] h-12",
                "bg-green-500 hover:bg-green-500/90 text-white border-0",
                "transition-all hover:scale-105"
              )}
            >
              <SkipForward className="w-5 h-5 mr-2" />
              Skip
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
