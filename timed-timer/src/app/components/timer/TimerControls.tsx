"use client";

import React from 'react';
import { useTimer } from '../../context/TimerContext';
import { Button } from '../ui/button';
import { Play, Pause, Square, SkipForward, Clock } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function TimerControls() {
  const { 
    timerState,
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
          {/* Quick start buttons */}
          <Button
            variant="outline"
            className={cn(
              "flex-1 min-w-[120px] max-w-[200px] h-20 flex flex-col items-center justify-center gap-1",
              "hover:scale-105 transition-all duration-200",
              "bg-background/50 hover:bg-background"
            )}
            onClick={() => startTimer(15 * 60)}
          >
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Quick 15</span>
          </Button>

          <Button
            variant="outline"
            className={cn(
              "flex-1 min-w-[120px] max-w-[200px] h-20 flex flex-col items-center justify-center gap-1",
              "hover:scale-105 transition-all duration-200",
              "bg-background/50 hover:bg-background"
            )}
            onClick={() => startTimer(25 * 60)}
          >
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Focus 25</span>
          </Button>

          <Button
            variant="outline"
            className={cn(
              "flex-1 min-w-[120px] max-w-[200px] h-20 flex flex-col items-center justify-center gap-1",
              "hover:scale-105 transition-all duration-200",
              "bg-background/50 hover:bg-background"
            )}
            onClick={() => startTimer(50 * 60)}
          >
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Deep 50</span>
          </Button>
        </div>

        {/* Main controls */}
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            onClick={handleStartPause}
            className={cn(
              "min-w-[140px] h-12 transition-all",
              timerState === 'running' && "bg-primary hover:bg-primary/90",
              timerState === 'paused' && "bg-yellow-500 hover:bg-yellow-500/90",
              "hover:scale-105"
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
