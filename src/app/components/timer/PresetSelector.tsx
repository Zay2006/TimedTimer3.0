"use client";

import React, { useState } from 'react';
import { useTimer } from '../../context/TimerContext';
import { useSettings } from '../../context/SettingsContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Clock, Coffee, Brain, Zap } from 'lucide-react';
import { cn } from '@/app/lib/utils';

const presetIcons: { [key: string]: React.ReactNode } = {
  pomodoro: <Clock className="w-5 h-5" />,
  short: <Zap className="w-5 h-5" />,
  shortBreak: <Coffee className="w-5 h-5" />,
  long: <Brain className="w-5 h-5" />,
  longFocus: <Brain className="w-5 h-5" />,
  quickFocus: <Zap className="w-5 h-5" />,
};

const fallbackColors = ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];

export default function PresetSelector() {
  const { startTimer, timerState, totalTime } = useTimer();
  const { settings } = useSettings();
  const [selectedId, setSelectedId] = useState<string | null>(settings.presets[0]?.id ?? null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('25');
  const busy = timerState !== 'idle';
  const activeId = busy
    ? settings.presets.find((preset) => preset.duration === totalTime)?.id ?? selectedId
    : selectedId;

  const startCustom = () => {
    const minutes = Math.max(1, parseInt(customMinutes, 10) || 25);
    setSelectedId(null);
    startTimer(minutes * 60);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {settings.presets.map((preset, index) => {
          const color = preset.color || fallbackColors[index % fallbackColors.length];
          const selected = activeId === preset.id;
          return (
            <Button
              key={preset.id}
              variant="outline"
              disabled={busy}
              onClick={() => {
                setSelectedId(preset.id);
                startTimer(preset.duration);
              }}
              className={cn(
                "h-auto py-4 px-4 flex flex-col items-start gap-2 relative overflow-hidden",
                "hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-lg active:scale-95 transition-all duration-200",
                "disabled:opacity-70 disabled:hover:scale-100",
                selected && "scale-[1.03] shadow-lg"
              )}
              style={{
                background: `linear-gradient(160deg, ${color}33, transparent 72%)`,
                borderColor: selected ? color : `${color}66`,
                boxShadow: selected ? `0 10px 28px ${color}55` : undefined,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: color }}
              >
                {presetIcons[preset.id] || <Clock className="w-5 h-5" />}
              </div>

              <div className="space-y-1 text-left">
                <div className="font-semibold">{preset.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {Math.round(preset.duration / 60)} min
                  {preset.breakDuration > 0 && (
                    <span className="text-xs">
                      (+{Math.floor(preset.breakDuration / 60)}m break)
                    </span>
                  )}
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          disabled={busy}
          className={cn(
            "w-full h-auto py-4 flex items-center justify-center gap-2",
            "border-dashed border-fuchsia-400/70 bg-fuchsia-500/10 text-fuchsia-700 hover:bg-fuchsia-500/20 hover:border-solid",
            "dark:text-fuchsia-200 transition-all hover:scale-[1.01] active:scale-95"
          )}
          onClick={() => setCustomOpen((open) => !open)}
        >
          <Clock className="w-5 h-5" />
          <span>{customOpen ? 'Hide custom timer' : 'Custom timer'}</span>
        </Button>
        {customOpen && (
          <div className="flex items-center gap-3 rounded-xl border border-fuchsia-300/60 bg-fuchsia-500/10 p-3">
            <Input
              type="number"
              min={1}
              value={customMinutes}
              disabled={busy}
              onChange={(event) => setCustomMinutes(event.target.value)}
              className="w-24 bg-card"
              aria-label="Custom minutes"
            />
            <span className="text-sm text-muted-foreground">minutes</span>
            <Button
              disabled={busy}
              onClick={startCustom}
              className="ml-auto bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white hover:scale-105 active:scale-95 transition-transform"
            >
              Start
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
