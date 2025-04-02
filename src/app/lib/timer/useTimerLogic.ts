import { useCallback, useEffect, useRef } from 'react';
import { useSettings } from '@/app/context/SettingsContext';

export type TimerState = 'idle' | 'running' | 'paused' | 'break';

interface UseTimerLogicProps {
  onTick: (time: number) => void;
  onComplete: () => void;
  onBreakStart: () => void;
}

/**
 * Custom hook for managing timer logic with proper cleanup and state transitions
 * 
 * Features:
 * - Automatic cleanup on unmount
 * - Safe state transitions
 * - Debounced controls
 * - Break timer handling
 */
export function useTimerLogic({ onTick, onComplete, onBreakStart }: UseTimerLogicProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { settings } = useSettings();

  // Cleanup function to clear timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start timer with proper cleanup
  const startCountdown = useCallback((duration: number) => {
    clearTimer();
    
    let timeRemaining = duration;
    onTick(timeRemaining);

    timerRef.current = setInterval(() => {
      timeRemaining -= 1;
      
      if (timeRemaining <= 0) {
        clearTimer();
        onComplete();
      } else {
        onTick(timeRemaining);
      }
    }, 1000);

    // Return cleanup function
    return clearTimer;
  }, [clearTimer, onTick, onComplete]);

  // Start break timer
  const startBreakTimer = useCallback((duration: number) => {
    onBreakStart();
    return startCountdown(duration);
  }, [onBreakStart, startCountdown]);

  // Cleanup on unmount
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return {
    startCountdown,
    startBreakTimer,
    clearTimer
  };
}
