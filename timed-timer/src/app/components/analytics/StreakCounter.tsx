"use client";

import React from 'react';
import { useTimerData } from '../../context/DataContext';
import { Card } from '../ui/card';
import { Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export default function StreakCounter() {
  const { data } = useTimerData();
  const { currentStreak, longestStreak } = data.analytics;

  return (
    <TooltipProvider>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium">Current Streak</p>
              <p className="text-2xl font-bold">{currentStreak} days</p>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-right cursor-help">
                <p className="text-sm text-muted-foreground">Best</p>
                <p className="text-lg font-medium">{longestStreak}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your longest streak was {longestStreak} days</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </Card>
    </TooltipProvider>
  );
}
