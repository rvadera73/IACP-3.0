import React from 'react';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills';
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, variant = 'underline' }) => {
  if (variant === 'pills') {
    return (
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-1.5 text-[10px] ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-0 border-b border-slate-200">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              isActive
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs text-slate-400">({tab.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
