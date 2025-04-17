"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Minus, Maximize2, Minimize2, GripHorizontal, Play, Pause, Square, SkipForward, X, Youtube } from 'lucide-react';
import YouTubePlayer from '../youtube/YouTubePlayer';
import { cn } from '../../lib/utils';
import { useTimer } from '../../context/TimerContext';
import { useSettings } from '../../context/SettingsContext';
import { formatTime } from '../../lib/utils';

interface Position {
  x: number;
  y: number;
}

const FloatingTimer = () => {
  const { currentTime, totalTime, timerState, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: window.innerWidth - 300, y: 100 });
  const [isMinimized, setIsMinimized] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState<Position | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStart) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        setPosition(prev => ({
          x: prev.x + dx,
          y: prev.y + dy
        }));
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-4">
      {settings.youtubeEnabled && <YouTubePlayer />}
      <div
        className={cn(
          'fixed z-50 bg-card border rounded-lg shadow-lg overflow-hidden',
          'transition-all duration-200 ease-in-out',
          isMinimized ? 'w-24 h-12' : 'w-72 h-40'
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        ref={dragRef}
      >
        <div className="bg-muted/10 p-2 flex justify-between items-center cursor-move" onMouseDown={handleMouseDown}>
          <div className="flex items-center gap-2">
            <GripHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Timer</span>
          </div>
          <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleMinimize}>
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsVisible(false)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1">
        {!isMinimized ? (
          <div className="p-4 space-y-4">
            <div className="flex justify-center gap-4">
              {timerState === 'running' ? (
                <Button
                  onClick={pauseTimer}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Pause className="h-4 w-4" />
                </Button>
              ) : timerState === 'paused' ? (
                <>
                  <Button
                    onClick={resumeTimer}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={stopTimer}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </>
              ) : null}
            </div>

            <div className="text-center text-xl font-mono">
              {formatTime(currentTime)}
            </div>
          </div>
        ) : (
          <div className="text-center text-sm font-mono p-2">
            {formatTime(currentTime)}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default FloatingTimer;
