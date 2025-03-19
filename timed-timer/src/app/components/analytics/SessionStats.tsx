"use client";

import React, { useMemo } from 'react';
import { useTimerData } from '../../context/DataContext';
import { Card } from '../ui/card';
import { Clock, Calendar, CheckCircle2, Timer, Flame } from 'lucide-react';
import { formatTime } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  tooltip?: string;
  color?: string;
}

function StatCard({ icon: Icon, title, value, tooltip, color = 'text-primary' }: StatCardProps) {
  const content = (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Icon className={`w-8 h-8 ${color}`} />
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </Card>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">{content}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}

export default function SessionStats() {
  const { data } = useTimerData();
  
  const { todayStats, preferredDuration } = useMemo(() => {
    const todayKey = new Date().toISOString().split('T')[0];
    const todayGoal = data.analytics.dailyGoals[todayKey] || {
      completed: false,
      focusTime: 0,
      sessions: 0
    };

    return {
      todayStats: {
        sessions: todayGoal.sessions,
        focusTime: todayGoal.focusTime,
        completionRate: data.analytics.completionRate || 0
      },
      preferredDuration: data.analytics.bestFocusTime || 0
    };
  }, [data.analytics]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        Today&apos;s Progress
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Timer}
          title="Sessions"
          value={todayStats.sessions}
          tooltip="Number of focus sessions completed today"
        />
        <StatCard
          icon={Clock}
          title="Focus Time"
          value={formatTime(todayStats.focusTime)}
          tooltip="Total time spent focusing today"
        />
        <StatCard
          icon={CheckCircle2}
          title="Completion Rate"
          value={`${Math.round(todayStats.completionRate)}%`}
          tooltip="Percentage of completed sessions today"
          color={todayStats.completionRate >= 80 ? 'text-green-500' : 'text-primary'}
        />
        <StatCard
          icon={Flame}
          title="Streak"
          value={data.analytics.currentStreak}
          tooltip={`Best streak: ${data.analytics.longestStreak} days`}
          color={data.analytics.currentStreak >= 3 ? 'text-orange-500' : 'text-primary'}
        />
      </div>
      {preferredDuration > 0 && (
        <p className="text-sm text-muted-foreground mt-2">
          Your preferred session duration: {formatTime(preferredDuration)}
        </p>
      )}
    </div>
  );
}
