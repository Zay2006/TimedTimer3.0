"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { AdvancedDashboard } from '../components/analytics/AdvancedDashboard';
import { ReportGenerator } from '../components/reports/ReportGenerator';

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Report Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AdvancedDashboard />
        </TabsContent>

        <TabsContent value="reports">
          <ReportGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
