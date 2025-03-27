"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AnalyticsCharts from "./AnalyticsCharts";

export default function AnalyticsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <BarChart className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Analytics
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="focus" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="focus" className="flex-1">Focus Time</TabsTrigger>
            <TabsTrigger value="completion" className="flex-1">Completion Rate</TabsTrigger>
          </TabsList>
          <TabsContent value="focus">
            <AnalyticsCharts type="focus" />
          </TabsContent>
          <TabsContent value="completion">
            <AnalyticsCharts type="completion" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
