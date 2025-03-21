"use client";

import React, { useState } from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FocusChart } from './FocusChart';
import { StreakChart } from './StreakChart';
import { StatsSummary } from './StatsSummary';
import { InsightPanel } from './InsightPanel';
import { TimeRange } from '../../types/analytics';

export function AdvancedDashboard() {
  const { analyticsData, getProductivityScore } = useAnalytics();
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="focus">Focus</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid gap-4">
                <StatsSummary />
                <StreakChart />
              </div>
            </TabsContent>
            <TabsContent value="focus">
              <div className="grid gap-4">
                <FocusChart timeRange="daily" />
                <FocusChart timeRange="weekly" />
              </div>
            </TabsContent>
            <TabsContent value="insights">
              <InsightPanel timeRange={timeRange} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
