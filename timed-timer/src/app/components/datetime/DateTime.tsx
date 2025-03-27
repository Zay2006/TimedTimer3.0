"use client";

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function DateTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <div className="text-lg font-mono font-bold">
        {format(now, 'h:mm:ss a')}
      </div>
      <div className="text-sm text-muted-foreground">
        {format(now, 'EEEE, MMMM d, yyyy')}
      </div>
    </div>
  );
}
