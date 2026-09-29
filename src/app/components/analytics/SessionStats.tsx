"use client";

import React, { useMemo } from 'react';
import { useTimerData } from '../../context/DataContext';
import type { DailyStats } from '../../types/timer';
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

function StatCard({ icon: Icon, title, value, tooltip, color = 'text-primary', tint = 'bg-violet-500/10 border-violet-300/50' }: StatCardProps & { tint?: string }) {
  const content = (
    <Card className={`p-4 border ${tint} transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        Today&apos;s Progress
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          title="Focus Time"
          value={formatTime(todayStats.focusTime)}
          tooltip="Total time spent focusing today"
          color="text-sky-500"
          tint="bg-sky-500/10 border-sky-300/60"
        />
        <StatCard
          icon={CheckCircle2}
          title="Completion Rate"
          value={`${Math.round(todayStats.completionRate)}%`}
          tooltip="Percentage of completed sessions"
          color={todayStats.completionRate >= 80 ? 'text-emerald-500' : 'text-emerald-600'}
          tint="bg-emerald-500/10 border-emerald-300/60"
        />
        <StatCard
          icon={Flame}
          title="Streak"
          value={data.analytics.currentStreak}
          tooltip={`Best streak: ${data.analytics.longestStreak} days`}
          color="text-orange-500"
          tint="bg-orange-500/10 border-orange-300/60"
        />
      </div>
    </div>
  );
}
