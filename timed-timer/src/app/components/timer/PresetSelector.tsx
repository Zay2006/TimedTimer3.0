"use client";

import React from 'react';
import { useTimer } from '../../context/TimerContext';
import { useSettings } from '../../context/SettingsContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Clock } from 'lucide-react';
import { formatTime } from '../../lib/utils';

export default function PresetSelector() {
  const { startTimer, timerState } = useTimer();
  const { settings } = useSettings();

  if (timerState !== 'idle') {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-medium">Timer Presets</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {settings.presets.map((preset) => (
            <Button
              key={preset.id}
              variant="outline"
              onClick={() => startTimer(preset.duration, preset.id)}
              className="w-full justify-start"
            >
              <span className="truncate">{preset.name}</span>
              <span className="ml-auto text-muted-foreground">
                {formatTime(preset.duration)}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
