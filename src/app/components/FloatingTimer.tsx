"use client";

import React, { useEffect, useState } from 'react';
import { useTimer } from '../context/TimerContext';
import { formatTime } from '../utils/time';
import { X } from 'lucide-react';

export function FloatingTimer() {
  const { currentTime, isRunning, isPaused } = useTimer();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Show floating timer when main timer is running and user navigates away
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning && !isPaused) {
        setIsVisible(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, isPaused]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - 50,
        y: e.clientY - 15
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 bg-card text-card-foreground shadow-lg rounded-lg p-3 cursor-move
                 flex items-center gap-2 min-w-[120px] select-none border border-border"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="font-mono text-lg font-semibold">
        {formatTime(currentTime)}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-auto p-1 hover:bg-muted rounded-full"
        aria-label="Close floating timer"
      >
        <X size={16} />
      </button>
    </div>
  );
}
