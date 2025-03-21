"use client";

import React from 'react';
import { ProgressOverview } from '../components/dashboard/ProgressOverview';
import { RecentMilestones } from '../components/dashboard/RecentMilestones';
import { FocusChart } from '../components/analytics/FocusChart';
import { StreakChart } from '../components/analytics/StreakChart';
import { StatsSummary } from '../components/analytics/StatsSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress, achievements, and focus habits.
        </p>
      </div>

      <ProgressOverview />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="daily" className="w-full">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <FocusChart timeRange="daily" />
            </TabsContent>
            <TabsContent value="weekly">
              <FocusChart timeRange="weekly" />
            </TabsContent>
            <TabsContent value="monthly">
              <FocusChart timeRange="monthly" />
            </TabsContent>
          </Tabs>
        </div>
        <div className="md:col-span-1">
          <RecentMilestones />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StreakChart />
        <div className="space-y-4">
          <StatsSummary />
        </div>
      </div>
    </div>
  );
}
