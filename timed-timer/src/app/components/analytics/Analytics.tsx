"use client";

import { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button } from '../ui/button';
import { useTimerData } from '../../context/DataContext';
import { Card } from '../ui/card';
import SessionStats from './SessionStats';
import AnalyticsCharts from './AnalyticsCharts';
import StreakCounter from './StreakCounter';
import AchievementsDialog from '../achievements/AchievementsDialog';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsProps {
  onBack: () => void;
}

export function Analytics({ onBack }: AnalyticsProps) {
  const { data } = useTimerData();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onBack}
          >
            ← Back
          </Button>
          <h2 className="text-2xl font-bold">Analytics</h2>
        </div>
        <AchievementsDialog />
      </div>
      <div className="space-y-6">
        <SessionStats />
        <StreakCounter />
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-4">
            <AnalyticsCharts type="focus" />
          </Card>
          <Card className="p-4">
            <AnalyticsCharts type="completion" />
          </Card>
        </div>
      </div>
    </div>
  );
}
