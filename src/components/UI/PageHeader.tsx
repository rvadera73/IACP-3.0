import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; onClick?: () => void }[];
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  breadcrumbs = [],
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex flex-col gap-1">
        {breadcrumbs.length > 0 && (
          <div className="flex items-center text-xs text-slate-500 mb-1">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <button
                  onClick={crumb.onClick}
                  className="hover:text-slate-700 focus:outline-none"
                >
                  {crumb.label}
                </button>
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2 text-slate-400">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          {badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export default PageHeader;
