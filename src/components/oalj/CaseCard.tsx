import React from 'react';
import { motion } from 'motion/react';
import { Clock, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { cn, Badge } from '../UI';
import TimelineSparkline from './TimelineSparkline';

interface CaseCardProps {
  docketNumber: string;
  caseType: string;
  title: string;
  parties: string;
  phase: 'Intake' | 'Assigned' | 'Hearing' | 'Decision' | 'Post-Decision';
  daysElapsed: number;
  totalDays: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  status: string;
  nextAction?: string;
  isProSe?: boolean;
  onClick: () => void;
  role?: string;
}

export default function CaseCard({
  docketNumber,
  caseType,
  title,
  parties,
  phase,
  daysElapsed,
  totalDays,
  urgency,
  status,
  nextAction,
  isProSe = false,
  onClick,
  role = 'default',
}: CaseCardProps) {
  const urgencyConfig = {
    Low: { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-600', badge: 'success' as const },
    Medium: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-600', badge: 'info' as const },
    High: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-600', badge: 'warning' as const },
    Critical: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600', badge: 'error' as const },
  };

  const config = urgencyConfig[urgency];
  const daysRemaining = totalDays - daysElapsed;

  // Role-based next action display
  const getRoleAction = () => {
    if (nextAction) return nextAction;
    
    switch (role) {
      case 'Docket Clerk':
        return phase === 'Intake' ? 'Assign to Judge' : 'Track Progress';
      case 'Legal Assistant':
        return phase === 'Hearing' ? 'Schedule Venue' : 'Prepare Notice';
      case 'Judge':
        return phase === 'Decision' ? 'Review Draft' : 'Prepare for Hearing';
      default:
        return 'View Case';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, shadow: '0 8px 16px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative p-5 rounded-xl border-l-4 cursor-pointer transition-all bg-white hover:bg-slate-50",
        config.border
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View case ${docketNumber}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant={config.badge} size="sm">
            {caseType}
          </Badge>
          {isProSe && (
            <Badge variant="warning" size="sm" title="Pro Se - Self-Represented">
              ⚠️ Pro Se
            </Badge>
          )}
        </div>
        {urgency === 'Critical' && (
          <AlertCircle className={cn("w-4 h-4", config.text)} />
        )}
      </div>

      {/* Docket Number */}
      <div className="font-mono text-sm font-bold text-slate-900 mb-1">
        {docketNumber}
      </div>

      {/* Case Title */}
      <div className="text-sm text-slate-700 font-medium mb-1 line-clamp-2">
        {title}
      </div>
      
      {/* Parties */}
      <div className="text-xs text-slate-500 mb-4 line-clamp-1">
        {parties}
      </div>

      {/* Timeline Sparkline */}
      <div className="mb-4">
        <TimelineSparkline
          phase={phase}
          daysElapsed={daysElapsed}
          totalDays={totalDays}
          urgency={urgency}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-200 mb-3" />

      {/* Status & Action */}
      <div className="flex items-center justify-between">
        <Badge variant={config.badge} size="sm">
          {status}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <Clock className="w-3 h-3" />
          <span className={cn("font-bold", config.text)}>
            {daysRemaining <= 0 ? 'Overdue' : `${daysRemaining}d left`}
          </span>
        </div>
      </div>

      {/* Next Action (Role-Based) */}
      {getRoleAction() && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Next Action:</span>
            <span className={cn("font-bold", config.text)}>{getRoleAction()}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
