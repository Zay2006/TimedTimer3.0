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
import { TimerContextType, Session } from '../types/timer';

const defaultContext: TimerContextType = {
  currentSession: null,
  totalFocusTime: 0,
  completedSessions: 0,
  startTimer: () => {},
  pauseTimer: () => {},
  resumeTimer: () => {},
  stopTimer: () => {},
  resetTimer: () => {},
  addBreak: () => {},
  isRunning: false,
  isPaused: false,
  timeLeft: 0,
  progress: 0
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
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

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
   * Starts a new timer session
   * @param {number} duration - Duration in seconds
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

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  }, [isRunning]);

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

    if (currentSession) {
      const focusTime = currentSession.duration - timeLeft;
      setTotalFocusTime(prev => prev + focusTime);
      setCurrentSession(prev => prev ? {
        ...prev,
        focusTime: (prev.focusTime || 0) + focusTime
      } : null);
    }
  }, [isRunning, isPaused, timerInterval, currentSession, timeLeft]);

  /**
   * Resumes a paused timer session
   */
  const resumeTimer = useCallback(() => {
    if (!isPaused) return;

    setIsRunning(true);
    setIsPaused(false);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  }, [isPaused]);

  /**
   * Stops and resets the current timer session
   */
  const stopTimer = useCallback(() => {
    if (!isRunning && !isPaused) return;

    if (timerInterval) {
      clearInterval(timerInterval);
    }

    if (currentSession) {
      const focusTime = currentSession.duration - timeLeft;
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
  }, [isRunning, isPaused, timerInterval, currentSession, timeLeft]);

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
  }, [timerInterval]);

  /**
   * Completes the current timer session
   */
  const completeSession = useCallback(() => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        endTime: new Date().toISOString(),
        completed: true,
        focusTime: prev.duration
      } : null);
      setCompletedSessions(prev => prev + 1);
      setTotalFocusTime(prev => prev + currentSession.duration);
    }

    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
    setTimerInterval(null);

    // Play sound if enabled
    if (settings.soundEnabled) {
      const audio = new Audio('/sounds/complete.mp3');
      audio.volume = settings.volume;
      audio.play();
    }

    // Show notification if enabled
    if (settings.notificationsEnabled) {
      new Notification('Focus Session Complete! 🎉', {
        body: 'Great job! Take a break before your next session.',
        icon: '/timer-icon.png'
      });
    }
  }, [currentSession, settings]);

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
   * Calculates the progress of the current timer session
   */
  const progress = currentSession && currentSession.duration > 0
    ? ((currentSession.duration - timeLeft) / currentSession.duration) * 100
    : 0;

  return (
    <TimerContext.Provider value={{
      currentSession,
      totalFocusTime,
      completedSessions,
      startTimer,
      pauseTimer,
      resumeTimer,
      stopTimer,
      resetTimer,
      addBreak,
      isRunning,
      isPaused,
      timeLeft,
      progress
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
