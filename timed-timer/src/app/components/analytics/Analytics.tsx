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
  data: {
    sessions: Array<{
      startTime: string;
      endTime?: string;
      focusTime: number;
    }>;
  };
}

export function Analytics({ onBack, data }: AnalyticsProps) {
  const chartData = {
    labels: data.sessions.map(session => new Date(session.startTime).toLocaleDateString()),
    datasets: [
      {
        label: 'Focus Time (minutes)',
        data: data.sessions.map(session => session.focusTime / 60),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Focus Time Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes',
        },
      },
    },
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          className="mr-4"
          onClick={onBack}
        >
          ← Back
        </Button>
        <h2 className="text-2xl font-bold">Analytics</h2>
      </div>
      <div className="bg-card p-6 rounded-lg">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
