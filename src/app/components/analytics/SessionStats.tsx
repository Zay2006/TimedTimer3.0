"use client";

import React, { useMemo } from 'react';
import { useTimerData } from '../../context/DataContext';
import type { DailyStats } from '../../types/timer';
import { Card } from '../ui/card';
import { Clock, CheckCircle2, Timer, Coffee } from 'lucide-react';
import { formatTimeHuman } from '../../utils/time';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  tooltip?: string;
  color?: string;
  tint?: string;
}

function StatCard({ icon: Icon, title, value, tooltip, color = 'text-primary', tint = 'bg-violet-500/10 border-violet-300/50' }: StatCardProps) {
  const content = (
    <Card className={`h-full p-3 border ${tint} transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 shrink-0 ${color}`} />
        <p className="text-xs font-medium leading-tight text-muted-foreground">{title}</p>
      </div>
      <p className="mt-1 text-2xl font-semibold tabular-nums whitespace-nowrap">{value}</p>
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
  
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const stats = data.analytics.dailyStats.find((stat: DailyStats) => stat.date === today)?.metrics || {
      completedSessions: 0,
      focusTime: 0,
      productivityScore: 0,
      interrupted: false,
      breaks: 0,
      achievements: 0,
      targetSessions: 4
    };

    return {
      sessions: stats.completedSessions,
      focusTime: stats.focusTime,
      completionRate: data.analytics.completionRate || 0,
      interrupted: stats.interrupted,
      breaks: stats.breaks,
      targetSessions: stats.targetSessions
    };
  }, [data.analytics]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        icon={Timer}
        title="Sessions"
        value={`${todayStats.sessions}/${todayStats.targetSessions}`}
        tooltip="Completed sessions / Daily target"
        color="text-violet-500"
        tint="bg-violet-500/10 border-violet-300/60"
      />
      <StatCard
        icon={Clock}
        title="Focus time"
        value={formatTimeHuman(todayStats.focusTime)}
        tooltip="Total time spent focusing today"
        color="text-sky-500"
        tint="bg-sky-500/10 border-sky-300/60"
      />
      <StatCard
        icon={CheckCircle2}
        title="Completed"
        value={`${Math.round(todayStats.completionRate)}%`}
        tooltip="Share of your daily session target that is done"
        color={todayStats.completionRate >= 80 ? 'text-emerald-500' : 'text-emerald-600'}
        tint="bg-emerald-500/10 border-emerald-300/60"
      />
      <StatCard
        icon={Coffee}
        title="Breaks"
        value={todayStats.breaks}
        tooltip="Breaks taken today"
        color="text-amber-500"
        tint="bg-amber-500/10 border-amber-300/60"
      />
    </div>
  );
}
