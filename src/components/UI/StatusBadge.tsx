import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = status.toLowerCase();

  let colorClass = 'bg-gray-100 text-gray-800';
  if (['active', 'docketed', 'assigned'].some((k) => s.includes(k))) {
    colorClass = 'bg-blue-100 text-blue-800';
  } else if (['pending', 'in progress', 'scheduled'].some((k) => s.includes(k))) {
    colorClass = 'bg-amber-100 text-amber-800';
  } else if (['decided', 'completed', 'released'].some((k) => s.includes(k))) {
    colorClass = 'bg-green-100 text-green-800';
  } else if (['overdue', 'deficient', 'urgent'].some((k) => s.includes(k))) {
    colorClass = 'bg-red-100 text-red-800';
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full ${sizeClass} font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
