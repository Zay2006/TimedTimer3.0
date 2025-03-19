"use client";

import React from 'react';
import { useTimer } from '../../context/TimerContext';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

export default function Timer() {
  const { currentTime, timerState } = useTimer();

  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;

  return (
    <Card className={cn(
      "p-8 flex flex-col items-center justify-center text-center",
      timerState === 'break' && "bg-accent"
    )}>
      <div className="text-7xl font-bold tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <p className="text-lg text-muted-foreground mt-2">
        {timerState === 'break' ? 'Break Time' : 
         timerState === 'running' ? 'Focus Time' :
         timerState === 'paused' ? 'Paused' : 'Ready'}
      </p>
    </Card>
  );
}
