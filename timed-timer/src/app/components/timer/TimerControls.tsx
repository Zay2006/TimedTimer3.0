"use client";

import React from 'react';
import { useTimer } from '../../context/TimerContext';
import { Button } from '../ui/button';
import { Play, Pause, Square, SkipForward } from 'lucide-react';
import { Card } from '../ui/card';

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
    <Card className="p-4">
      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          onClick={handleStartPause}
          className="w-32"
        >
          {timerState === 'idle' ? (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start
            </>
          ) : timerState === 'running' ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Resume
            </>
          )}
        </Button>

        {timerState !== 'idle' && (
          <Button
            size="lg"
            variant="outline"
            onClick={stopTimer}
            className="w-32"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
        )}

        {timerState === 'break' && (
          <Button
            size="lg"
            variant="outline"
            onClick={skipBreak}
            className="w-32"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Skip Break
          </Button>
        )}
      </div>
    </Card>
  );
}
