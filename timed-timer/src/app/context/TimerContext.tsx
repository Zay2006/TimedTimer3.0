"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSettings } from './SettingsContext';
import { useTimerData } from './DataContext';
import { Session } from '../types/timer';
import { v4 as uuidv4 } from 'uuid';

type TimerState = 'idle' | 'running' | 'paused' | 'break';

interface TimerContextType {
  currentTime: number;
  totalTime: number;
  breakTime: number;
  timerState: TimerState;
  activePresetId?: string;
  startTimer: (duration: number, presetId?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  skipBreak: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const { data, updateData } = useTimerData();
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [activePresetId, setActivePresetId] = useState<string>();
  const [startTime, setStartTime] = useState<Date>();
  const [breakStartTime, setBreakStartTime] = useState<Date>();
  const [breaks, setBreaks] = useState<number>(0);

  const addSession = useCallback((completed: boolean) => {
    const endTime = new Date();
    const sessionDuration = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;
    const totalBreakTime = breaks * (breakTime || 0);
    const focusTime = Math.max(0, sessionDuration - totalBreakTime);

    const newSession: Session = {
      id: uuidv4(),
      startTime: startTime?.toISOString() || new Date().toISOString(),
      endTime: endTime.toISOString(),
      duration: totalTime,
      completed,
      breaks,
      focusTime,
    };

    updateData({
      ...data,
      sessions: [...data.sessions, newSession],
      analytics: {
        ...data.analytics,
        totalSessions: data.analytics.totalSessions + 1,
        totalFocusTime: data.analytics.totalFocusTime + focusTime,
        completedSessions: data.analytics.completedSessions + (completed ? 1 : 0),
        completionRate: ((data.analytics.completedSessions + (completed ? 1 : 0)) / (data.analytics.totalSessions + 1)) * 100,
      }
    });
  }, [data, updateData, startTime, totalTime, breaks, breakTime]);

  const startBreak = useCallback(() => {
    setTimerState('break');
    setCurrentTime(breakTime);
    setBreakStartTime(new Date());
    setBreaks(prev => prev + 1);
  }, [breakTime]);

  const startTimer = useCallback((duration: number, presetId?: string) => {
    setCurrentTime(duration);
    setTotalTime(duration);
    setBreakTime(settings.presets.find(p => p.id === presetId)?.breakDuration || 300);
    setTimerState('running');
    setActivePresetId(presetId);
    setStartTime(new Date());
    setBreaks(0);
  }, [settings.presets]);

  const pauseTimer = useCallback(() => {
    setTimerState('paused');
  }, []);

  const resumeTimer = useCallback(() => {
    setTimerState('running');
  }, []);

  const stopTimer = useCallback(() => {
    if (timerState !== 'idle') {
      addSession(false);
    }
    setTimerState('idle');
    setCurrentTime(0);
    setTotalTime(0);
    setBreakTime(0);
    setActivePresetId(undefined);
    setStartTime(undefined);
    setBreakStartTime(undefined);
    setBreaks(0);
  }, [timerState, addSession]);

  const skipBreak = useCallback(() => {
    setTimerState('idle');
    setCurrentTime(0);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timerState === 'running' || timerState === 'break') {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev <= 1) {
            if (timerState === 'running') {
              startBreak();
            } else {
              setTimerState('idle');
              addSession(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timerState, addSession, startBreak]);

  const value = {
    currentTime,
    totalTime,
    breakTime,
    timerState,
    activePresetId,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    skipBreak,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
