"use client";

import { useState, useEffect, useRef } from 'react';
import { useTimerData } from '../context/DataContext';
import { Session } from '../types/timer';
import { v4 as uuidv4 } from 'uuid';

interface UseTimerOptions {
  initialTime?: number;
  onComplete?: () => void;
}

export function useTimer({ initialTime = 25 * 60, onComplete }: UseTimerOptions = {}) {
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const { data, updateData } = useTimerData();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const addSession = (duration: number, completed: boolean) => {
    const newSession: Session = {
      id: uuidv4(),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration,
      completed,
      breaks: 0,
      focusTime: completed ? duration : Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000)
    };

    updateData({
      ...data,
      sessions: [...data.sessions, newSession],
      analytics: {
        ...data.analytics,
        totalSessions: data.analytics.totalSessions + 1,
        completedSessions: completed ? data.analytics.completedSessions + 1 : data.analytics.completedSessions,
        totalFocusTime: data.analytics.totalFocusTime + newSession.focusTime,
        completionRate: ((data.analytics.completedSessions + (completed ? 1 : 0)) / (data.analytics.totalSessions + 1)) * 100
      }
    });
  };

  const start = () => {
    if (!isRunning && !isPaused) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setIsRunning(false);
            addSession(initialTime, true);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pause = () => {
    if (isRunning && timerRef.current) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (isPaused) {
      setIsRunning(true);
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setIsRunning(false);
            addSession(initialTime, true);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (isRunning || isPaused) {
      addSession(initialTime, false);
    }
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(initialTime);
  };

  return {
    timeRemaining,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop
  };
}
