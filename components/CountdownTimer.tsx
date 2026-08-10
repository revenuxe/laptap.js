"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  durationMinutes: number;
  onExpire?: () => void;
}

export function CountdownTimer({ durationMinutes, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60); // Convert to seconds
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (isExpired) {
    return (
      <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
        <Clock className="h-4 w-4" />
        <span>Offer expired</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 text-destructive font-semibold animate-pulse">
      <Clock className="h-4 w-4" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
