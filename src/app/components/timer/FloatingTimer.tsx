"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Minus, Maximize2, Minimize2, GripHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTimer } from '../../context/TimerContext';

interface Position {
  x: number;
  y: number;
}

const FloatingTimer = () => {
  const timer = useTimer();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState<Position | null>(null);

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

  return (
    <div
      className={cn(
        'floating-timer',
        isMinimized && 'minimized'
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      ref={dragRef}
    >
      <div className="floating-timer-header" onMouseDown={handleMouseDown}>
        <div className="drag-handle">
          <GripHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="floating-timer-buttons">
          <button className="floating-timer-button" onClick={toggleMinimize}>
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="timer-display">
        {formatTime(timer.timeLeft)}
      </div>

      <div className="timer-controls">
        <Button
          variant="outline"
          size="sm"
          onClick={() => timer.isRunning ? timer.pauseTimer() : timer.startTimer(timer.totalTime)}
        >
          {timer.isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={timer.resetTimer}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FloatingTimer;
