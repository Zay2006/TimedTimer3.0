"use client";

import React from 'react';
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TimeRange } from '../../types/analytics';
import { CalendarIcon } from 'lucide-react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

interface FilterControlsProps {
  onTimeRangeChange: (range: TimeRange) => void;
}

export default function FilterControls({ onTimeRangeChange }: FilterControlsProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const range: TimeRange = {
        start: startOfDay(selectedDate),
        end: endOfDay(selectedDate)
      };
      onTimeRangeChange(range);
    }
  };

  const handleRangeSelect = (value: string) => {
    const now = new Date();
    let range: TimeRange;

    switch (value) {
      case 'today':
        range = {
          start: startOfDay(now),
          end: endOfDay(now)
        };
        break;
      case 'week':
        range = {
          start: startOfWeek(now),
          end: endOfWeek(now)
        };
        break;
      case 'month':
        range = {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
        break;
      case 'year':
        range = {
          start: startOfYear(now),
          end: endOfYear(now)
        };
        break;
      case 'all':
        range = {
          start: new Date(0), // Beginning of time
          end: now
        };
        break;
      default:
        range = {
          start: startOfDay(now),
          end: endOfDay(now)
        };
    }
    onTimeRangeChange(range);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Select onValueChange={handleRangeSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
