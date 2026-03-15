import React from 'react';
import { cn } from '../UI';

interface TimelineSparklineProps {
  phase: 'Intake' | 'Assigned' | 'Hearing' | 'Decision' | 'Post-Decision';
  daysElapsed: number;
  totalDays: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
}

export default function TimelineSparkline({ 
  phase, 
  daysElapsed, 
  totalDays,
  urgency 
}: TimelineSparklineProps) {
  const progress = Math.min((daysElapsed / totalDays) * 100, 100);
  
  const phases = ['Intake', 'Assigned', 'Hearing', 'Decision', 'Post-Decision'];
  const currentPhaseIndex = phases.indexOf(phase);
  
  const urgencyColors = {
    Low: 'bg-emerald-500',
    Medium: 'bg-blue-500',
    High: 'bg-amber-500',
    Critical: 'bg-red-500',
  };

  const urgencyTextColors = {
    Low: 'text-emerald-600',
    Medium: 'text-blue-600',
    High: 'text-amber-600',
    Critical: 'text-red-600',
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
        <div
          className={cn("h-full transition-all duration-500", urgencyColors[urgency])}
          style={{ width: `${progress}%` }}
        />
        {/* Phase Markers */}
        <div className="absolute inset-0 flex justify-between items-center px-1">
          {phases.map((p, index) => (
            <div
              key={p}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index <= currentPhaseIndex ? urgencyColors[urgency] : 'bg-slate-300'
              )}
            />
          ))}
        </div>
      </div>
      
      {/* Phase Labels */}
      <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-wider">
        <span>Intake</span>
        <span>Assigned</span>
        <span>Hearing</span>
        <span>Decision</span>
      </div>
      
      {/* Days Info */}
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className={cn("font-bold", urgencyTextColors[urgency])}>
          {daysElapsed} days elapsed
        </span>
        <span className="text-slate-500">
          {totalDays - daysElapsed} days remaining
        </span>
      </div>
    </div>
  );
}
