import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: { value: number; direction: 'up' | 'down' };
  icon?: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
}

const colorMap: Record<string, string> = {
  blue: 'border-blue-500',
  green: 'border-green-500',
  amber: 'border-amber-500',
  red: 'border-red-500',
  purple: 'border-purple-500',
  indigo: 'border-indigo-500',
  cyan: 'border-cyan-500',
  slate: 'border-slate-500',
};

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  icon,
  accentColor = 'blue',
  onClick,
}) => {
  const trendColor =
    trend?.direction === 'up' ? 'text-green-600' : 'text-red-600';
  const trendIcon = trend?.direction === 'up' ? '↑' : '↓';

  return (
    <div
      onClick={onClick}
      className={`p-5 border-l-4 ${colorMap[accentColor] || colorMap.blue} bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {trend && (
            <p className={`text-xs font-medium mt-1 ${trendColor}`}>
              {trendIcon} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && <div className="text-slate-300 w-8 h-8">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
