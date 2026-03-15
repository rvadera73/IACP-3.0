import React from 'react';
import { FolderOpen, Scale, Building2 } from 'lucide-react';
import CaseFolder from './CaseFolder';
import { CaseType, AppealType } from '../../types';

export interface CaseFolderData {
  id: string;
  docketNumber: string;
  caseType: CaseType | AppealType;
  category: 'Adjudication' | 'Appeal';
  title: string;
  nextDeadline?: string;
  nextEvent?: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  status: string;
}

interface CasesGalleryProps {
  cases: CaseFolderData[];
  onCaseClick: (caseId: string) => void;
  emptyMessage?: string;
}

export default function CasesGallery({ 
  cases, 
  onCaseClick,
  emptyMessage = 'No cases found' 
}: CasesGalleryProps) {
  const adjudicationCases = cases.filter(c => c.category === 'Adjudication');
  const appealCases = cases.filter(c => c.category === 'Appeal');

  if (cases.length === 0) {
    return (
      <div className="text-center py-16">
        <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Adjudication Cases Section */}
      {adjudicationCases.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Scale className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Adjudication Cases (OALJ)
              </h3>
              <p className="text-xs text-slate-500">
                {adjudicationCases.length} active case{adjudicationCases.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {adjudicationCases.map((caseData) => (
              <CaseFolder
                key={caseData.id}
                {...caseData}
                onClick={() => onCaseClick(caseData.docketNumber)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Appeal Cases Section */}
      {appealCases.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Appeal Cases (Boards)
              </h3>
              <p className="text-xs text-slate-500">
                {appealCases.length} active appeal{appealCases.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {appealCases.map((caseData) => (
              <CaseFolder
                key={caseData.id}
                {...caseData}
                onClick={() => onCaseClick(caseData.docketNumber)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
