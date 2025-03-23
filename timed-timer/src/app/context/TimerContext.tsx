/**
 * Timer Management System
 * 
 * This context provides centralized timer state management with the following features:
 * - Timer state tracking (idle, running, paused, break)
 * - Session management with analytics integration
 * - Break timer functionality
 * - Progress tracking
 */

"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useSettings } from './SettingsContext';
import { TimerStateType } from '../types/timer';

interface TimerContextType extends TimerStateType {
  startTimer: (duration: number, presetId?: string | null) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  skipBreak: () => void;
  updateTime: (time: number) => void;
}

const defaultState: TimerStateType = {
  currentTime: 0,
  timerState: 'idle',
  activePresetId: null,
  completedSessions: 0,
  totalFocusTime: 0,
  totalBreakTime: 0,
};

// Create context with a default value that throws an error if accessed outside of provider
const TimerContext = createContext<TimerContextType>({
  ...defaultState,
  startTimer: () => {
    throw new Error('Timer context not initialized');
  },
  pauseTimer: () => {
    throw new Error('Timer context not initialized');
  },
  resumeTimer: () => {
    throw new Error('Timer context not initialized');
  },
  stopTimer: () => {
    throw new Error('Timer context not initialized');
  },
  skipBreak: () => {
    throw new Error('Timer context not initialized');
  },
  updateTime: () => {
    throw new Error('Timer context not initialized');
  },
});

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [timerState, setTimerState] = useState<TimerStateType>(defaultState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const originalDurationRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(Date.now());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update document title with remaining time
  useEffect(() => {
    if (settings.showTimeInTitle && timerState.timerState !== 'idle') {
      const minutes = Math.floor(timerState.currentTime / 60);
      const seconds = timerState.currentTime % 60;
      document.title = `${minutes}:${seconds.toString().padStart(2, '0')} - Timer`;
    } else {
      document.title = 'Timer';
    }
  }, [timerState.currentTime, timerState.timerState, settings.showTimeInTitle]);

  const handleComplete = useCallback(() => {
    const isBreak = timerState.timerState === 'break';
    const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);

    setTimerState((prev: TimerStateType) => ({
      ...prev,
      completedSessions: isBreak ? prev.completedSessions : prev.completedSessions + 1,
      totalFocusTime: isBreak ? prev.totalFocusTime : prev.totalFocusTime + elapsedTime,
      totalBreakTime: isBreak ? prev.totalBreakTime + elapsedTime : prev.totalBreakTime,
      timerState: 'idle',
      currentTime: 0,
    }));

    // Handle notifications
    if (settings.notificationsEnabled) {
      new Notification(isBreak ? 'Break Complete!' : 'Focus Session Complete!', {
        body: isBreak ? 'Ready to focus?' : 'Time for a break!',
      });
    }

    // Play sound if enabled
    if (settings.soundEnabled) {
      const audio = new Audio('/complete.mp3');
      audio.volume = settings.volume / 100;
      audio.play();
    }

    // Auto-start break or next session based on settings
    if (!isBreak && settings.autoStartBreaks) {
      const preset = settings.presets.find(p => p.id === timerState.activePresetId);
      const breakDuration = preset?.breakDuration || 5 * 60;
      startTimer(breakDuration, preset?.id || null);
    } else if (isBreak && settings.autoStartNextSession) {
      const preset = settings.presets.find(p => p.id === timerState.activePresetId);
      if (preset) {
        startTimer(preset.duration, preset.id);
      }
    }
  }, [timerState.timerState, timerState.activePresetId, settings]);

  const updateTime = useCallback((initialTime: number): void => {
    if (timerState.timerState === 'idle') return;
    
    const now = Date.now();
    const elapsed = Math.floor((now - startTimeRef.current) / 1000);
    const updatedTime = Math.max(0, originalDurationRef.current - elapsed);
    
    setTimerState(prev => ({
      ...prev,
      currentTime: updatedTime
    }));

    if (updatedTime <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      handleComplete();
    }
  }, [timerState.timerState, handleComplete]);

  const startTimer = useCallback((duration: number, presetId?: string | null): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    originalDurationRef.current = duration;
    startTimeRef.current = Date.now();

    setTimerState(prev => ({
      ...prev,
      currentTime: duration,
      timerState: 'running',
      activePresetId: presetId || null,
    }));

    // Use a more frequent interval for smoother updates
    timerRef.current = setInterval(() => {
      updateTime(duration);
    }, 100);
  }, [updateTime]);

  const pauseTimer = useCallback((): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerState(prev => ({ ...prev, timerState: 'paused' }));
  }, []);

  const resumeTimer = useCallback((): void => {
    if (timerState.currentTime <= 0) return;

    startTimeRef.current = Date.now() - (originalDurationRef.current - timerState.currentTime) * 1000;
    
    setTimerState(prev => ({ 
      ...prev, 
      timerState: prev.timerState === 'break' ? 'break' : 'running' 
    }));

    timerRef.current = setInterval(() => {
      updateTime(timerState.currentTime);
    }, 100);
  }, [timerState.currentTime, updateTime]);

  const stopTimer = useCallback((): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const isBreak = timerState.timerState === 'break';

    setTimerState(prev => ({
      ...prev,
      currentTime: 0,
      timerState: 'idle',
      totalFocusTime: isBreak ? prev.totalFocusTime : prev.totalFocusTime + elapsedTime,
      totalBreakTime: isBreak ? prev.totalBreakTime + elapsedTime : prev.totalBreakTime,
    }));
  }, [timerState.timerState]);

  const skipBreak = useCallback((): void => {
    if (timerState.timerState !== 'break') return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimerState(prev => ({
      ...prev,
      currentTime: 0,
      timerState: 'idle',
      totalBreakTime: prev.totalBreakTime + Math.floor((Date.now() - startTimeRef.current) / 1000),
    }));

    // Auto-start next session if enabled
    if (settings.autoStartNextSession) {
      const preset = settings.presets.find(p => p.id === timerState.activePresetId);
      if (preset) {
        startTimer(preset.duration, preset.id);
      }
    }
  }, [timerState.timerState, timerState.activePresetId, settings.autoStartNextSession, settings.presets, startTimer]);

  const value = useMemo<TimerContextType>(() => ({
    ...timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    skipBreak,
    updateTime,
  }), [timerState, startTimer, pauseTimer, resumeTimer, stopTimer, skipBreak, updateTime]);

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}

// Custom hook to use timer context with type safety
export function useTimer(): TimerContextType {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
