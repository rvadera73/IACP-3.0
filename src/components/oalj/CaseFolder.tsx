import React from 'react';
import { motion } from 'motion/react';
import { Clock, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { cn } from '../UI';
import { CaseType, AppealType } from '../../types';

interface CaseFolderProps {
  docketNumber: string;
  caseType: CaseType | AppealType;
  category: 'Adjudication' | 'Appeal';
  title: string;
  nextDeadline?: string;
  nextEvent?: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  status: string;
  onClick: () => void;
}

const caseTypeColors: Record<string, string> = {
  BLA: 'border-slate-500 bg-slate-50',
  LHC: 'border-blue-500 bg-blue-50',
  PER: 'border-green-500 bg-green-50',
  DBA: 'border-emerald-500 bg-emerald-50',
  WB: 'border-purple-500 bg-purple-50',
  FECA: 'border-orange-500 bg-orange-50',
  BRB: 'border-navy-500 bg-navy-50',
  ARB: 'border-teal-500 bg-teal-50',
  ECAB: 'border-crimson-500 bg-crimson-50',
};

const caseTypeLabels: Record<string, string> = {
  BLA: 'Black Lung',
  LHC: 'Longshore',
  PER: 'BALCA',
  DBA: 'Defense Base',
  WB: 'Whistleblower',
  FECA: 'ECAB',
  BRB: 'Benefits Review',
  ARB: 'Admin Review',
  ECAB: 'Employees Comp',
};

const urgencyConfig = {
  Low: { color: 'text-slate-600', bg: 'bg-slate-100', icon: CheckCircle },
  Medium: { color: 'text-blue-600', bg: 'bg-blue-100', icon: Clock },
  High: { color: 'text-amber-600', bg: 'bg-amber-100', icon: AlertCircle },
  Critical: { color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle },
};

export default function CaseFolder({
  docketNumber,
  caseType,
  category,
  title,
  nextDeadline,
  nextEvent,
  urgency,
  status,
  onClick,
}: CaseFolderProps) {
  const UrgencyIcon = urgencyConfig[urgency].icon;
  const urgencyStyles = urgencyConfig[urgency];
  const borderColor = caseTypeColors[caseType] || 'border-slate-300 bg-slate-50';

  const getDaysUntilDeadline = () => {
    if (!nextDeadline) return null;
    const days = Math.ceil((new Date(nextDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysLeft = getDaysUntilDeadline();

  return (
    <motion.div
      whileHover={{ y: -4, shadow: '0 12px 24px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative p-5 rounded-xl border-l-4 cursor-pointer transition-all duration-200",
        "bg-white hover:bg-gray-50 shadow-sm hover:shadow-md",
        borderColor
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View case ${docketNumber}`}
    >
      {/* Header: Case Type Badge + Docket Number */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
            urgencyStyles.bg,
            urgencyStyles.color
          )}>
            {caseType}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            {category === 'Appeal' ? 'Appeal' : 'OALJ'}
          </span>
        </div>
        <UrgencyIcon className={cn("w-4 h-4", urgencyStyles.color)} />
      </div>

      {/* Docket Number */}
      <div className="font-mono text-sm font-bold text-slate-900 mb-1">
        {docketNumber}
      </div>

      {/* Case Title */}
      <div className="text-sm text-slate-700 font-medium mb-4 line-clamp-2">
        {title}
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mb-4" />

      {/* Deadline Info */}
      {nextDeadline && (
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Next Deadline
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">
              {new Date(nextDeadline).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            {daysLeft !== null && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold",
                daysLeft <= 3 ? 'bg-red-100 text-red-700' :
                daysLeft <= 7 ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              )}>
                {daysLeft <= 0 ? 'Overdue' : `in ${daysLeft}d`}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Next Event / Status */}
      {nextEvent && (
        <div className="mb-3">
          <div className="text-xs text-slate-600">{nextEvent}</div>
        </div>
      )}

      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
          status === 'Active' || status === 'On Track' ? 'bg-green-100 text-green-700' :
          status === 'Pending' || status === 'Under Review' ? 'bg-amber-100 text-amber-700' :
          status === 'Urgent' || status === 'Overdue' ? 'bg-red-100 text-red-700' :
          'bg-slate-100 text-slate-600'
        )}>
          {status}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}
