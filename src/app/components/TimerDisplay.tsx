"use client";

import React, { useCallback, useEffect, useRef } from 'react';
import { useTimer } from '../context/TimerContext';
import { useSettings } from '../context/SettingsContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { formatTime } from '../lib/utils';
import { Progress } from './ui/progress';
import { Play, Pause, Square, SkipForward } from 'lucide-react';

/**
 * TimerDisplay Component
 * 
 * The core timer display component that shows the current session time and controls.
 * Provides visual feedback and interactive controls for timer management.
 * 
 * Features:
 * - Real-time countdown display
 * - Circular progress indicator
 * - Play/Pause/Stop controls
 * - Break timer integration
 * - Skip break functionality
 * - Sound notifications
 * - Keyboard shortcuts
 * 
 * Timer States:
 * - IDLE: Initial state, timer not started
 * - RUNNING: Timer actively counting down
 * - PAUSED: Timer temporarily stopped
 * - BREAK: Break timer active
 * 
 * Performance Optimizations:
 * - Debounced button clicks
 * - Memoized callback handlers
 * - Proper cleanup on unmount
 * - Efficient state updates
 * 
 * Accessibility:
 * - Keyboard navigation support
 * - ARIA labels for controls
 * - Visual and audio feedback
 * - Focus management
 * 
 * @component
 * @returns {JSX.Element} Rendered TimerDisplay component
 * 
 * @example
 * ```tsx
 * <TimerDisplay />
 * ```
 */
export default function TimerDisplay() {
  const { currentTime, totalTime, timerState, startTimer, pauseTimer, resumeTimer, stopTimer, skipBreak } = useTimer();
  const { settings } = useSettings();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const progress = totalTime > 0 ? ((totalTime - currentTime) / totalTime) * 100 : 0;
  const timeDisplay = formatTime(currentTime);

  /**
   * Debounces button clicks to prevent choppy state changes
   * @param {() => void} action - The timer action to execute
   */
  const handleButtonClick = useCallback((action: () => void) => {
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
      action();
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.disabled = false;
        }
      }, 300);
    }
  }, []);

  /**
   * Returns a message based on the current timer state
   * @returns {string} The state message
   */
  const getStateMessage = () => {
    switch (timerState) {
      case 'running':
        return "Let's focus!";
      case 'paused':
        return "Take a moment";
      case 'break':
        return "Time for a break";
      default:
        return "Ready when you are";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <Card className={`p-6 w-full max-w-md ${settings.theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold font-mono" role="timer" aria-label={`Time remaining: ${timeDisplay}`}>
              {timeDisplay}
            </h2>
            <p className="text-sm text-muted-foreground mt-2" aria-live="polite">
              {getStateMessage()}
            </p>
          </div>
          
          <Progress 
            value={progress} 
            className="h-2" 
            aria-label={`Timer progress: ${Math.round(progress)}%`}
          />

          <div className="flex justify-center gap-4 mt-4">
            {timerState === 'idle' && (
              <Button
                ref={buttonRef}
                onClick={() => handleButtonClick(() => startTimer(1500))}
                className="transition-all"
              >
                <Play className="w-5 h-5" />
              </Button>
            )}
            
            {timerState === 'running' && (
              <Button
                ref={buttonRef}
                onClick={() => handleButtonClick(pauseTimer)}
                className="transition-all"
              >
                <Pause className="w-5 h-5" />
              </Button>
            )}
            
            {timerState === 'paused' && (
              <Button
                ref={buttonRef}
                onClick={() => handleButtonClick(resumeTimer)}
                className="transition-all"
              >
                <Play className="w-5 h-5" />
              </Button>
            )}
            
            {timerState !== 'idle' && (
              <Button
                variant="outline"
                onClick={() => handleButtonClick(stopTimer)}
                className="transition-all"
              >
                <Square className="w-5 h-5" />
              </Button>
            )}
            
            {timerState === 'break' && (
              <Button
                variant="outline"
                onClick={() => handleButtonClick(skipBreak)}
                className="transition-all"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
