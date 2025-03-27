"use client";

import React from 'react';
import { Card } from '../ui/card';
import { useTimerData } from '../../context/DataContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  type: 'focus' | 'completion';
}

export default function AnalyticsCharts({ type }: ChartProps) {
  const { data } = useTimerData();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Process the last 7 days of data
  const now = new Date();
  const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
  
  const dailyData = days.map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dayData = data.sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate.toDateString() === date.toDateString();
    });

    if (type === 'focus') {
      // Calculate total focus time in hours
      return dayData.reduce((acc, session) => acc + (session.focusTime / 3600), 0);
    } else {
      // Calculate completion rate
      if (dayData.length === 0) return 0;
      const completed = dayData.filter(session => session.completed).length;
      return (completed / dayData.length) * 100;
    }
  });

  const chartData = {
    labels: days,
    datasets: [
      {
        label: type === 'focus' ? 'Focus Time (hours)' : 'Completion Rate (%)',
        data: dailyData,
        borderColor: type === 'focus' ? 'rgb(75, 192, 192)' : 'rgb(153, 102, 255)',
        backgroundColor: type === 'focus' ? 'rgba(75, 192, 192, 0.5)' : 'rgba(153, 102, 255, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: type === 'focus' ? 'Weekly Focus Time' : 'Session Completion Rate',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ...(type === 'completion' && { max: 100 }),
        title: {
          display: true,
          text: type === 'focus' ? 'Hours' : 'Completion Rate (%)',
        },
      },
    },
  };

  const ChartComponent = type === 'focus' ? Line : Bar;

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <ChartComponent data={chartData} options={options} />
      </Card>
    </div>
  );
}
