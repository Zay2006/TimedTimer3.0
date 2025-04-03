"use client";

import React from 'react';
import { useTimer } from '../../context/TimerContext';
import { useSettings } from '../../context/SettingsContext';
import { Button } from '../ui/button';
import { Clock, Coffee, Brain, Zap } from 'lucide-react';
import { formatTime } from '../../lib/utils';
import { cn } from '@/app/lib/utils';

const presetIcons: { [key: string]: React.ReactNode } = {
  pomodoro: <Clock className="w-5 h-5" />,
  shortBreak: <Coffee className="w-5 h-5" />,
  longFocus: <Brain className="w-5 h-5" />,
  quickFocus: <Zap className="w-5 h-5" />,
};

export default function PresetSelector() {
  const { startTimer, timerState } = useTimer();
  const { settings } = useSettings();

  if (timerState !== 'idle') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {settings.presets.map((preset) => (
          <Button
            key={preset.id}
            variant="outline"
            onClick={() => startTimer(preset.duration)}
            className={cn(
              "h-auto py-4 px-4 flex flex-col items-start gap-2",
              "hover:scale-105 transition-all duration-200",
              "bg-background/50 hover:bg-background relative group"
            )}
          >
            {/* Icon */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              "bg-primary/10 text-primary",
              "group-hover:bg-primary/20 transition-colors"
            )}>
              {presetIcons[preset.id] || <Clock className="w-5 h-5" />}
            </div>

            {/* Content */}
            <div className="space-y-1 text-left">
              <div className="font-semibold">{preset.name}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatTime(preset.duration)}
                {preset.breakDuration > 0 && (
                  <span className="text-xs">
                    (+{Math.floor(preset.breakDuration / 60)}m break)
                  </span>
                )}
              </div>
            </div>

            {/* Hover effect */}
            <div className={cn(
              "absolute inset-0 rounded-lg border-2 border-primary/0",
              "group-hover:border-primary/50 transition-colors"
            )} />
          </Button>
        ))}
      </div>

      {/* Add custom timer button */}
      <Button
        variant="outline"
        className={cn(
          "w-full h-auto py-4 flex items-center justify-center gap-2",
          "text-muted-foreground hover:text-foreground",
          "border-dashed hover:border-solid transition-all"
        )}
        onClick={() => startTimer(25 * 60)} // Default to 25 minutes
      >
        <Clock className="w-5 h-5" />
        <span>Custom Timer</span>
      </Button>
    </div>
  );
}
