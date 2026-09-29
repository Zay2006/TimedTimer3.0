"use client";

import { useSettings } from '../context/SettingsContext';
import { cn } from '../lib/utils';
import type { TimerSettings } from '../types/timer';

const themes: { id: TimerSettings['theme']; label: string; swatch: string }[] = [
  { id: 'light', label: 'Light', swatch: 'bg-gradient-to-br from-amber-200 via-white to-violet-200' },
  { id: 'dark', label: 'Dark', swatch: 'bg-gradient-to-br from-zinc-700 to-indigo-950' },
  { id: 'theme-purple', label: 'Purple', swatch: 'bg-gradient-to-br from-fuchsia-400 to-violet-600' },
  { id: 'theme-blue', label: 'Blue', swatch: 'bg-gradient-to-br from-sky-400 to-blue-600' },
];

export function ThemePicker({ className }: { className?: string }) {
  const { settings, updateSettings } = useSettings();

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={cn(
        'flex items-center gap-1 rounded-full border border-white/40 bg-card/80 p-1 shadow-sm backdrop-blur',
        className
      )}
    >
      {themes.map((theme) => {
        const selected = settings.theme === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${theme.label} theme`}
            title={theme.label}
            onClick={() => updateSettings({ ...settings, theme: theme.id })}
            className={cn(
              'h-7 w-7 rounded-full border-2 shadow-sm transition-transform duration-200 hover:scale-110 active:scale-95',
              theme.swatch,
              selected
                ? 'scale-110 border-white ring-2 ring-primary'
                : 'border-white/80'
            )}
          />
        );
      })}
    </div>
  );
}
