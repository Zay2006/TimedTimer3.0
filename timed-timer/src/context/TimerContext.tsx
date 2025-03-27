"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';
import { useSettings } from '@/context/SettingsContext';

type TimerState = 'idle' | 'running' | 'paused' | 'break';

interface TimerContextType {
  currentTime: number;
  totalTime: number;
  timerState: TimerState;
  isRunning: boolean;
  isBreak: boolean;
  startTimer: (duration?: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  skipBreak: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

type TimerAction =
  | { type: 'START'; duration?: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'RESET' }
  | { type: 'SKIP_BREAK' }
  | { type: 'TICK' };

interface TimerStateData {
  currentTime: number;
  totalTime: number;
  timerState: TimerState;
  isRunning: boolean;
  isBreak: boolean;
}

function timerReducer(state: TimerStateData, action: TimerAction): TimerStateData {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        isRunning: true,
        timerState: 'running',
        currentTime: action.duration || state.totalTime,
        totalTime: action.duration || state.totalTime,
      };
    case 'PAUSE':
      return {
        ...state,
        isRunning: false,
        timerState: 'paused',
      };
    case 'RESUME':
      return {
        ...state,
        isRunning: true,
        timerState: 'running',
      };
    case 'STOP':
      return {
        ...state,
        isRunning: false,
        timerState: 'idle',
        currentTime: state.totalTime,
      };
    case 'RESET':
      return {
        ...state,
        isRunning: false,
        timerState: 'idle',
        currentTime: state.totalTime,
        isBreak: false,
      };
    case 'SKIP_BREAK':
      return {
        ...state,
        isRunning: false,
        timerState: 'idle',
        isBreak: false,
        currentTime: state.totalTime,
      };
    case 'TICK':
      if (state.currentTime <= 0) {
        return {
          ...state,
          isRunning: false,
          timerState: state.isBreak ? 'idle' : 'break',
          isBreak: !state.isBreak,
          currentTime: state.isBreak ? state.totalTime : (state.totalTime * 0.2), // 20% break time
        };
      }
      return {
        ...state,
        currentTime: state.currentTime - 1,
      };
    default:
      return state;
  }
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [state, dispatch] = useReducer(timerReducer, {
    currentTime: settings.defaultDuration,
    totalTime: settings.defaultDuration,
    timerState: 'idle',
    isRunning: false,
    isBreak: false,
  });

  const intervalRef = React.useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning]);

  const startTimer = useCallback((duration?: number) => {
    dispatch({ type: 'START', duration });
  }, []);

  const pauseTimer = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, []);

  const resumeTimer = useCallback(() => {
    dispatch({ type: 'RESUME' });
  }, []);

  const stopTimer = useCallback(() => {
    dispatch({ type: 'STOP' });
  }, []);

  const resetTimer = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const skipBreak = useCallback(() => {
    dispatch({ type: 'SKIP_BREAK' });
  }, []);

  const value = useMemo(() => ({
    ...state,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    skipBreak,
  }), [state, startTimer, pauseTimer, resumeTimer, stopTimer, resetTimer, skipBreak]);

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer(): TimerContextType {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
