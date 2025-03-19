"use client";

import React from 'react';
import { Progress } from '../ui/progress';

interface ProgressIndicatorProps {
  progress: number;
  showPercentage?: boolean;
}

export default function ProgressIndicator({ progress, showPercentage = false }: ProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      <Progress value={progress} />
      {showPercentage && (
        <p className="text-sm text-muted-foreground text-right">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  );
}
