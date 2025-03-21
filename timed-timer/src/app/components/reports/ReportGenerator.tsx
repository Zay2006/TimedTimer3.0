"use client";

import React from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TimeRange, ReportTemplate } from '../../types/analytics';
import { Download, FileType, Share2 } from 'lucide-react';
import FilterControls from '../analytics/FilterControls';
import { useAnalytics } from '../../context/AnalyticsContext';

const defaultTemplates: ReportTemplate[] = [
  {
    id: 'daily',
    name: 'Daily Summary',
    sections: [
      { type: 'summary', title: 'Overview', data: 'dailyStats' },
      { type: 'chart', title: 'Productivity Trend', data: 'dailyStats' },
      { type: 'table', title: 'Session Details', data: 'dailyStats' }
    ]
  },
  {
    id: 'weekly',
    name: 'Weekly Analysis',
    sections: [
      { type: 'summary', title: 'Weekly Overview', data: 'weeklyStats' },
      { type: 'chart', title: 'Weekly Comparison', data: 'weeklyStats' },
      { type: 'chart', title: 'Focus Patterns', data: 'focusPatterns' }
    ]
  },
  {
    id: 'monthly',
    name: 'Monthly Report',
    sections: [
      { type: 'summary', title: 'Monthly Overview', data: 'monthlyStats' },
      { type: 'chart', title: 'Monthly Trends', data: 'monthlyStats' },
      { type: 'table', title: 'Achievement Summary', data: 'monthlyStats' }
    ]
  }
];

export function ReportGenerator() {
  const { generateReport, exportData } = useAnalytics();
  const [timeRange, setTimeRange] = React.useState<TimeRange>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('daily');
  const [exportFormat, setExportFormat] = React.useState<'pdf' | 'csv'>('pdf');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const blob = await (exportFormat === 'pdf' 
        ? generateReport(timeRange, selectedTemplate)
        : exportData(timeRange, exportFormat));
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `productivity-report-${timeRange.start.toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating report:', error);
      // You would want to show a proper error message to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Report Generator</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Range</label>
            <FilterControls onTimeRangeChange={setTimeRange} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Report Template</label>
            <Select defaultValue="daily" onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {defaultTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <Select defaultValue="pdf" onValueChange={(value: 'pdf' | 'csv') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="csv">CSV Export</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share Report
            </Button>
            <Button variant="outline" className="w-12">
              <FileType className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {defaultTemplates
              .find(t => t.id === selectedTemplate)
              ?.sections.map((section, index) => (
                <div key={index} className="border rounded p-4">
                  <h3 className="font-medium mb-2">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {section.type.charAt(0).toUpperCase() + section.type.slice(1)} section
                  </p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
