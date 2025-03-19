"use client";

import React, { useEffect } from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  isBreak: boolean;
  onStart: (duration: number) => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkipBreak?: () => void;
}

export default function TimerControls({
  isRunning,
  isPaused,
  isBreak,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkipBreak,
}: TimerControlsProps) {
  const { settings } = useSettings();
  const defaultPreset = settings.presets.find(p => p.id === 'pomodoro');

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (isRunning) {
            onPause();
          } else if (isPaused) {
            onResume();
          } else if (!isBreak) {
            onStart(defaultPreset?.duration || 25 * 60);
          }
          break;
        case 'KeyR':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onReset();
          }
          break;
        case 'KeyS':
          if (isBreak && onSkipBreak) {
            e.preventDefault();
            onSkipBreak();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRunning, isPaused, isBreak, onStart, onPause, onResume, onReset, onSkipBreak, defaultPreset]);

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => {
            if (isRunning) {
              onPause();
            } else if (isPaused) {
              onResume();
            } else if (!isBreak) {
              onStart(defaultPreset?.duration || 25 * 60);
            }
          }}
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-primary/90 transition"
          title={isRunning ? "Pause (Space)" : isPaused ? "Resume (Space)" : "Start Focus Session (Space)"}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : isPaused ? (
            <>
              <Play className="w-5 h-5 mr-2" />
              Resume
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start Focus Session
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="inline-flex items-center px-6 py-3 bg-destructive text-destructive-foreground rounded-lg shadow-sm hover:bg-destructive/90 transition"
          title="Reset Timer (Ctrl/⌘ + R)"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </button>
      </div>

      {isBreak && onSkipBreak && (
        <div className="flex justify-center">
          <button
            onClick={onSkipBreak}
            className="inline-flex items-center px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg shadow-sm hover:bg-secondary/90 transition"
            title="Skip Break (S)"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Skip Break
          </button>
        </div>
      )}

      {!isRunning && !isPaused && !isBreak && (
        <div className="flex justify-center gap-2 mt-2">
          {settings.presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onStart(preset.duration)}
              className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition"
            >
              {preset.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
