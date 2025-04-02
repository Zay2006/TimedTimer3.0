/**
 * Timer Management System
 * 
 * This context provides centralized timer state management with the following features:
 * - Timer state tracking (idle, running, paused, break)
 * - Session management with analytics integration
 * - Break timer functionality
 * - Progress tracking
 * - Sound notifications
 * - Session persistence
 */

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSettings } from './SettingsContext';
import { useTimerData } from './DataContext';
import { TimerContextType, Session, TimerState, TimerMode } from '../types/timer';

const defaultContext: TimerContextType = {
  currentSession: null,
  totalFocusTime: 0,
  completedSessions: 0,
  startTimer: () => {},
  startStopwatch: () => {},
  pauseTimer: () => {},
  resumeTimer: () => {},
  stopTimer: () => {},
  resetTimer: () => {},
  addBreak: () => {},
  isRunning: false,
  isPaused: false,
  timeLeft: 0,
  progress: 0,
  currentTime: 0,
  totalTime: 0,
  timerState: TimerState.IDLE,
  timerMode: TimerMode.COUNTDOWN,
  skipBreak: () => {}
};

const TimerContext = createContext<TimerContextType>(defaultContext);

/**
 * Timer Provider Component
 * Manages the timer state and provides it to child components
 * 
 * @param {React.ReactNode} children - Child components to render
 */
export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const { data, updateData } = useTimerData();
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [timerState, setTimerState] = useState<TimerState>(TimerState.IDLE);
  const [timerMode, setTimerMode] = useState<TimerMode>(TimerMode.COUNTDOWN);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Load timer data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('timerData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setTotalFocusTime(data.totalFocusTime || 0);
      setCompletedSessions(data.completedSessions || 0);
    }
  }, []);

  // Save timer data to localStorage
  useEffect(() => {
    localStorage.setItem('timerData', JSON.stringify({
      totalFocusTime,
      completedSessions
    }));
  }, [totalFocusTime, completedSessions]);

  /**
   * Completes the current timer session
   */
  const completeSession = useCallback(() => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        completed: true,
        focusTime: currentSession.duration
      };

      setCurrentSession(prev => prev ? updatedSession : null);
      setCompletedSessions(prev => prev + 1);
      setTotalFocusTime(prev => prev + currentSession.duration);

      // Update analytics
      const today = new Date().toISOString().split('T')[0];
      
      // Create a safe copy of the data
      const updatedData = {
        ...data,
        analytics: {
          ...data.analytics,
          dailyStats: Array.isArray(data.analytics?.dailyStats) 
            ? [...data.analytics.dailyStats]
            : [{
                date: today,
                metrics: {
                  completedSessions: 0,
                  focusTime: 0,
                  interrupted: false,
                  breaks: 0,
                  achievements: 0,
                  productivityScore: 0,
                  targetSessions: 4
                }
              }]
        }
      };

      const todayStats = updatedData.analytics.dailyStats.find(stat => stat.date === today);

      if (todayStats) {
        todayStats.metrics = {
          ...todayStats.metrics,
          completedSessions: (todayStats.metrics.completedSessions || 0) + 1,
          focusTime: (todayStats.metrics.focusTime || 0) + currentSession.duration
        };
      } else {
        updatedData.analytics.dailyStats.push({
          date: today,
          metrics: {
            completedSessions: 1,
            focusTime: currentSession.duration,
            interrupted: false,
            breaks: 0,
            achievements: 0,
            productivityScore: 0,
            targetSessions: 4
          }
        });
      }

      // Update the data context
      updateData(updatedData);
    }

    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
    setTimerInterval(null);
    setTimerState(TimerState.IDLE);
    setCurrentTime(0);
    setTotalTime(0);

    // Play sound if enabled
    if (settings.soundEnabled) {
      const audio = new Audio('/Red Light.mp3');
      audio.volume = settings.volume;
      audio.play();
    }

    // Show notification if enabled
    if (settings.notificationsEnabled) {
      new Notification('Focus Session Complete! ', {
        body: 'Great job! Take a break before your next session.',
        icon: '/timer-icon.png'
      });
    }
  }, [currentSession, settings, data, updateData]);

  /**
   * Starts a new timer session in stopwatch mode
   */
  const startStopwatch = useCallback(() => {
    if (isRunning) return;

    const newSession: Session = {
      id: `session-${Date.now()}`,
      startTime: new Date().toISOString(),
      duration: 0,
      completed: false,
      interrupted: false,
      breaks: 0,
      focusTime: 0
    };

    setCurrentSession(newSession);
    setTimeLeft(0);
    setIsRunning(true);
    setIsPaused(false);
    setTimerState(TimerState.RUNNING);
    setTimerMode(TimerMode.STOPWATCH);
    setCurrentTime(0);
    setTotalTime(0);

    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);

    setTimerInterval(interval);
  }, [isRunning]);

  /**
   * Starts a new timer session in countdown mode
   */
  const startTimer = useCallback((duration: number) => {
    if (isRunning) return;

    const newSession: Session = {
      id: `session-${Date.now()}`,
      startTime: new Date().toISOString(),
      duration,
      completed: false,
      interrupted: false,
      breaks: 0,
      focusTime: 0
    };

    setCurrentSession(newSession);
    setTimeLeft(duration);
    setIsRunning(true);
    setIsPaused(false);
    setTimerState(TimerState.RUNNING);
    setTimerMode(TimerMode.COUNTDOWN);
    setCurrentTime(duration);
    setTotalTime(duration);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTimeLeft = prev - 1;
        setCurrentTime(newTimeLeft);
        
        if (newTimeLeft <= 0) {
          clearInterval(interval);
          completeSession();
          return 0;
        }
        return newTimeLeft;
      });
    }, 1000);

    setTimerInterval(interval);
  }, [isRunning, completeSession]);

  /**
   * Pauses the current timer session
   */
  const pauseTimer = useCallback(() => {
    if (!isRunning || isPaused) return;

    if (timerInterval) {
      clearInterval(timerInterval);
    }
    setIsPaused(true);
    setIsRunning(false);
    setTimerState(TimerState.PAUSED);

    if (currentSession) {
      const focusTime = timerMode === TimerMode.STOPWATCH ? currentTime : currentSession.duration - timeLeft;
      setTotalFocusTime(prev => prev + focusTime);
      setCurrentSession(prev => prev ? {
        ...prev,
        focusTime: (prev.focusTime || 0) + focusTime
      } : null);
    }
  }, [isRunning, isPaused, timerInterval, currentSession, timeLeft, timerMode, currentTime]);

  /**
   * Resumes a paused timer session
   */
  const resumeTimer = useCallback(() => {
    if (!isPaused) return;

    setIsRunning(true);
    setIsPaused(false);
    setTimerState(TimerState.RUNNING);

    if (timerMode === TimerMode.STOPWATCH) {
      const interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);

      setTimerInterval(interval);
    } else {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTimeLeft = prev - 1;
          setCurrentTime(currentSession!.duration - newTimeLeft);
          
          if (newTimeLeft <= 0) {
            clearInterval(interval);
            completeSession();
            return 0;
          }
          return newTimeLeft;
        });
      }, 1000);

      setTimerInterval(interval);
    }
  }, [isPaused, timerMode, currentSession, completeSession]);

  /**
   * Stops and resets the current timer session
   */
  const stopTimer = useCallback(() => {
    if (!isRunning && !isPaused) return;

    if (timerInterval) {
      clearInterval(timerInterval);
    }

    if (currentSession) {
      const focusTime = timerMode === TimerMode.STOPWATCH ? currentTime : currentSession.duration - timeLeft;
      setTotalFocusTime(prev => prev + focusTime);
      setCurrentSession(prev => prev ? {
        ...prev,
        endTime: new Date().toISOString(),
        interrupted: true,
        focusTime: (prev.focusTime || 0) + focusTime
      } : null);
    }

    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
    setTimerInterval(null);
    setTimerState(TimerState.IDLE);
    setCurrentTime(0);
    setTotalTime(0);
  }, [isRunning, isPaused, timerInterval, currentSession, timeLeft, timerMode, currentTime]);

  /**
   * Resets the timer to its initial state
   */
  const resetTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    setCurrentSession(null);
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
    setTimerInterval(null);
    setTimerState(TimerState.IDLE);
    setCurrentTime(0);
    setTotalTime(0);
  }, [timerInterval]);

  /**
   * Adds a break to the current timer session
   */
  const addBreak = useCallback(() => {
    if (!currentSession) return;

    setCurrentSession(prev => prev ? {
      ...prev,
      breaks: prev.breaks + 1
    } : null);
  }, [currentSession]);

  /**
   * Skips the current break
   */
  const skipBreak = useCallback(() => {
    if (timerState !== TimerState.BREAK) return;
    setTimerState(TimerState.IDLE);
    resetTimer();
  }, [timerState, resetTimer]);

  /**
   * Calculates the progress of the current timer session
   */
  const progress = currentSession && currentSession.duration > 0
    ? ((currentSession.duration - timeLeft) / currentSession.duration) * 100
    : timerMode === TimerMode.STOPWATCH ? 0 : 0;

  return (
    <TimerContext.Provider value={{
      currentSession,
      totalFocusTime,
      completedSessions,
      startTimer,
      startStopwatch,
      pauseTimer,
      resumeTimer,
      stopTimer,
      resetTimer,
      addBreak,
      isRunning,
      isPaused,
      timeLeft,
      progress,
      currentTime,
      totalTime,
      timerState,
      timerMode,
      skipBreak
    }}>
      {children}
    </TimerContext.Provider>
  );
}

/**
 * Custom hook to use timer context with type safety
 * 
 * @returns {TimerContextType}
 */
export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
