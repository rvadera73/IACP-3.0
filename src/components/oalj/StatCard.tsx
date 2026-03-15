import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  delta: string;
  deltaType: 'up' | 'down' | 'neutral';
  variant: 'accent' | 'green' | 'amber' | 'red' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ value, label, delta, deltaType, variant }) => {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-val">{value}</div>
      <div className="stat-lbl">{label}</div>
      <div className={`stat-delta ${deltaType}`}>{delta}</div>
    </div>
  );
};

export default StatCard;
