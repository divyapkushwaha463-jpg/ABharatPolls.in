'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  expiresAt: string;
  onExpire?: () => void;
  compact?: boolean;
}

export default function CountdownTimer({ expiresAt, onExpire, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    function calculate() {
      const now = Date.now();
      const end = new Date(expiresAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setExpired(true);
        onExpire?.();
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }

    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, [expiresAt, onExpire]);

  if (expired) {
    return (
      <span className="text-red-400 text-xs font-bold uppercase tracking-wider" style={{fontFamily: 'Rajdhani, sans-serif'}}>
        🔒 Poll Closed
      </span>
    );
  }

  if (compact) {
    const { days, hours, minutes, seconds } = timeLeft;
    const label = days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`;
    return (
      <span className="text-xs text-amber-400 font-bold" style={{fontFamily: 'Rajdhani, sans-serif'}}>
        ⏱ {label} left
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider" style={{fontFamily: 'Rajdhani, sans-serif'}}>
        Closes in:
      </span>
      <div className="flex gap-1.5">
        {[
          { val: timeLeft.days, label: 'D' },
          { val: timeLeft.hours, label: 'H' },
          { val: timeLeft.minutes, label: 'M' },
          { val: timeLeft.seconds, label: 'S' },
        ].map(({ val, label }) => (
          <div key={label} className="flex flex-col items-center">
            <span
              className="w-9 h-9 flex items-center justify-center bg-dark-700 rounded-lg text-sm font-bold text-white border border-white/10"
              style={{fontFamily: 'Rajdhani, sans-serif'}}
            >
              {String(val).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-gray-500 mt-0.5">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
