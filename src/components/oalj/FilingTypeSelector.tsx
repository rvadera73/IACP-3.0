import React from 'react';
import { FilePlus, ArrowUpRight, Activity, FileCheck } from 'lucide-react';
import { CaseType } from '../types';

interface FilingTypeSelectorProps {
  filingType: 'New Case Filing' | 'New Appeal' | 'New Motion' | 'New Brief';
  onTypeSelect: (type: 'New Case Filing' | 'New Appeal' | 'New Motion' | 'New Brief') => void;
  preselectedCase?: any | null;
}

export default function FilingTypeSelector({ 
  filingType, 
  onTypeSelect,
  preselectedCase 
}: FilingTypeSelectorProps) {
  // If case is pre-selected, only show Motion and Brief options
  if (preselectedCase) {
    return (
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => onTypeSelect('New Motion')}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            filingType === 'New Motion'
              ? 'border-purple-600 bg-purple-50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <Activity className="w-6 h-6 text-purple-600 mb-2" />
          <div className="font-bold text-slate-900">New Motion</div>
          <div className="text-xs text-slate-500">File a motion in this case</div>
        </button>
        <button
          onClick={() => onTypeSelect('New Brief')}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            filingType === 'New Brief'
              ? 'border-emerald-600 bg-emerald-50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <FileCheck className="w-6 h-6 text-emerald-600 mb-2" />
          <div className="font-bold text-slate-900">New Brief</div>
          <div className="text-xs text-slate-500">Submit a brief</div>
        </button>
      </div>
    );
  }

  // Otherwise show all OALJ filing types
  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <FilePlus className="w-6 h-6 text-blue-600" />
          <h4 className="font-bold text-blue-900">New Case Intake (OALJ)</h4>
        </div>
        <p className="text-sm text-blue-700 mb-4">
          Submit a new claim form (LS-203) for initial adjudication before an Administrative Law Judge.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-xs font-bold text-slate-500 mb-1">BLA</div>
            <div className="text-sm text-slate-700">Black Lung</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-xs font-bold text-slate-500 mb-1">LHC</div>
            <div className="text-sm text-slate-700">Longshore</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-xs font-bold text-slate-500 mb-1">PER</div>
            <div className="text-sm text-slate-700">BALCA/PERM</div>
          </div>
        </div>
      </div>
    </div>
  );
}
