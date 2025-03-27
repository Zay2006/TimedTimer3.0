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
import { TimerStateType, Session } from '../types/timer';

interface TimerContextType extends TimerStateType {
  startTimer: (duration: number, presetId?: string | null) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  skipBreak: () => void;
  updateTime: (time: number) => void;
  sessionData: {
    sessions: Session[];
  };
}

const defaultState: TimerStateType = {
  currentTime: 0,
  totalTime: 0,
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
  sessionData: {
    sessions: [],
  },
});

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [timerState, setTimerState] = useState<TimerStateType>(defaultState);
  const [sessions, setSessions] = useState<Session[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const originalDurationRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(Date.now());
  const currentSessionRef = useRef<Session | null>(null);

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

    if (!isBreak && currentSessionRef.current) {
      const session = currentSessionRef.current;
      session.endTime = new Date().toISOString();
      session.focusTime = elapsedTime;
      session.completed = true;
      setSessions(prev => [...prev, session]);
    }

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

    // Play sound
    if (settings.soundEnabled) {
      const audio = new Audio('/Red Light.mp3');
      audio.volume = settings.volume;
      audio.play();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [timerState.timerState, settings.notificationsEnabled, settings.soundEnabled, settings.volume]);

  const startTimer = useCallback((duration: number, presetId: string | null = null) => {
    startTimeRef.current = Date.now();
    originalDurationRef.current = duration;

    // Create new session
    currentSessionRef.current = {
      id: crypto.randomUUID(),
      startTime: new Date().toISOString(),
      duration,
      completed: false,
      breaks: 0,
      focusTime: 0,
    };

    setTimerState(prev => ({
      ...prev,
      currentTime: duration,
      totalTime: duration,
      timerState: 'running',
      activePresetId: presetId,
    }));

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastUpdateRef.current) / 1000);
      lastUpdateRef.current = now;

      setTimerState(prev => {
        const newTime = Math.max(0, prev.currentTime - elapsed);
        if (newTime === 0) {
          handleComplete();
          return prev;
        }
        return { ...prev, currentTime: newTime };
      });
    }, 1000);
  }, [handleComplete]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerState(prev => ({ ...prev, timerState: 'paused' }));
  }, []);

  const resumeTimer = useCallback(() => {
    lastUpdateRef.current = Date.now();
    setTimerState(prev => ({ ...prev, timerState: 'running' }));

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastUpdateRef.current) / 1000);
      lastUpdateRef.current = now;

      setTimerState(prev => {
        const newTime = Math.max(0, prev.currentTime - elapsed);
        if (newTime === 0) {
          handleComplete();
          return prev;
        }
        return { ...prev, currentTime: newTime };
      });
    }, 1000);
  }, [handleComplete]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (currentSessionRef.current && timerState.timerState === 'running') {
      const session = currentSessionRef.current;
      session.endTime = new Date().toISOString();
      session.focusTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      session.completed = false;
      setSessions(prev => [...prev, session]);
      currentSessionRef.current = null;
    }

    setTimerState(prev => ({
      ...prev,
      currentTime: 0,
      timerState: 'idle',
      activePresetId: null,
    }));
  }, [timerState.timerState]);

  const skipBreak = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerState(prev => ({
      ...prev,
      currentTime: 0,
      timerState: 'idle',
      activePresetId: null,
    }));
  }, []);

  const updateTime = useCallback((time: number) => {
    setTimerState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const value = useMemo(() => ({
    ...timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    skipBreak,
    updateTime,
    sessionData: {
      sessions,
    },
  }), [timerState, startTimer, pauseTimer, resumeTimer, stopTimer, skipBreak, updateTime, sessions]);

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}

// Custom hook to use timer context with type safety
export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
