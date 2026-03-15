import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center py-12">
      <div className="text-slate-300 w-12 h-12 mb-4">
        {icon || <FolderOpen className="w-12 h-12" />}
      </div>
      <h3 className="text-lg font-medium text-slate-500">{title}</h3>
      {description && <p className="text-sm text-slate-400 mt-1 text-center max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
