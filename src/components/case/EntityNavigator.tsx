import { Badge } from '../UI';
import { Users, FolderOpen, History, Calendar, BookOpen, Scale, Link } from 'lucide-react';

interface EntityNavigatorProps {
  activeView: string;
  onViewChange: (view: string) => void;
  perspective: 'trial' | 'appellate';
  caseData: {
    parties?: any[];
    documents?: any[];
    motions?: any[];
    daysElapsed?: number;
  };
}

export default function EntityNavigator({
  activeView,
  onViewChange,
  perspective,
  caseData
}: EntityNavigatorProps) {
  const navItems = [
    { id: 'parties', label: 'Parties', icon: Users, count: caseData.parties?.length },
    { id: 'evidence', label: 'Evidence Vault', icon: FolderOpen },
    { id: 'history', label: 'Procedural History', icon: History },
    ...(perspective === 'trial'
      ? [{ id: 'logistics', label: 'Logistics', icon: Calendar }]
      : [
          { id: 'briefing', label: 'Briefing Timeline', icon: BookOpen },
          { id: 'record', label: 'Lower Court Record', icon: Scale }
        ]
    ),
    { id: 'heritage', label: 'Case Heritage', icon: Link }
  ];

  return (
    <div className="w-64 border-r border-slate-200 bg-slate-50 overflow-y-auto flex flex-col h-full">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <Badge variant="neutral" size="sm">{item.count}</Badge>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Documents</span>
            <span className="font-bold text-slate-900">{caseData.documents?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Motions</span>
            <span className="font-bold text-slate-900">{caseData.motions?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Days Active</span>
            <span className="font-bold text-slate-900">{caseData.daysElapsed || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
