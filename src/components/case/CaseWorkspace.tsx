import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Badge, Button } from '../UI';
import CaseHeader from './CaseHeader';
import EntityNavigator from './EntityNavigator';
import ContextPanel from './ContextPanel';
import DocumentList from './DocumentList';
import { COMPREHENSIVE_MOCK_CASES } from '../../data/mockCaseData';
import {
  Users, FileText, History, Calendar, Link, FolderOpen, Clock
} from 'lucide-react';

const getFallbackCaseData = (caseNumber: string) => {
  const isBoard = caseNumber.includes('BRB') || caseNumber.includes('ARB') || caseNumber.includes('ECAB');
  const caseType = caseNumber.includes('BLA') ? 'Black Lung' :
                   caseNumber.includes('LHC') ? 'Longshore' :
                   caseNumber.includes('PER') ? 'BALCA/PERM' :
                   caseNumber.includes('BRB') ? 'Benefits Review Board' :
                   caseNumber.includes('ARB') ? 'Administrative Review Board' : 'Unknown';

  return {
    docketNumber: caseNumber,
    programArea: isBoard ? `${caseType} (Appeal)` : caseType,
    proceduralState: isBoard ? 'On Appeal' : 'Active',
    perspective: isBoard ? 'appellate' as const : 'trial' as const,
    filedAt: '2026-01-15',
    docketedAt: '2026-01-16',
    daysElapsed: 45,
    daysToDecision: isBoard ? 60 : 225,
    deadlineDate: isBoard ? '2026-06-01' : '2026-10-12',
    claimant: 'Claimant',
    employer: 'Employer',
    office: 'Washington, DC',
    parties: [],
    motions: [],
    documents: [],
    heritage: { priorClaims: [], consolidatedCases: [], relatedAppeals: [] },
    aiSummary: `This ${caseType} case is currently ${isBoard ? 'on appeal' : 'active'}. The case was filed on 2026-01-15 and is proceeding through the adjudication process.`,
    aiInsights: [
      { type: 'info' as const, title: 'Case Loading', description: 'Limited data available. Complete case summary pending.' },
    ],
  };
};

interface CaseWorkspaceProps {
  caseNumber: string;
  onClose: () => void;
  userRole?: string;
}

export default function CaseWorkspace({ caseNumber, onClose, userRole = '' }: CaseWorkspaceProps) {
  const [activeView, setActiveView] = useState('parties');
  const [contextCollapsed, setContextCollapsed] = useState(false);

  const caseData = (COMPREHENSIVE_MOCK_CASES as any)[caseNumber] || getFallbackCaseData(caseNumber);
  const perspective = caseData.perspective || 'trial';

  const renderContent = () => {
    switch (activeView) {
      case 'parties':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Parties & Representatives
            </h3>
            {caseData.parties?.length > 0 ? (
              <div className="space-y-3">
                {caseData.parties.map((party: any, idx: number) => (
                  <Card key={idx}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-slate-900">{party.name}</div>
                          <div className="text-sm text-slate-500">{party.role}</div>
                        </div>
                        <Badge variant={party.represented ? 'success' : 'warning'} size="sm">
                          {party.represented ? 'Represented' : 'Pro Se'}
                        </Badge>
                      </div>
                      {party.attorney && (
                        <div className="text-sm text-slate-600 space-y-0.5">
                          <div>Attorney: {party.attorney}</div>
                          {party.email && <div>Email: {party.email}</div>}
                          {party.servicePreference && <div>Service: {party.servicePreference === 'electronic' ? 'Electronic' : 'Certified Mail'}</div>}
                        </div>
                      )}
                      {!party.represented && (
                        <div className="text-sm text-slate-600 space-y-0.5">
                          <div className="text-amber-600 font-medium">Self-Represented</div>
                          {party.email && <div>Email: {party.email}</div>}
                          {party.phone && <div>Phone: {party.phone}</div>}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">No party information available</p>
              </Card>
            )}
          </div>
        );

      case 'evidence':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-600" />
              Evidence & Documents
            </h3>
            <DocumentList
              documents={caseData.documents || []}
              onViewDocument={(doc) => console.log('View:', doc.name)}
              onDownloadDocument={(doc) => console.log('Download:', doc.name)}
            />
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Procedural History
            </h3>
            <div className="relative pl-6 space-y-4">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200" />
              {[
                { label: 'Case Filed', date: caseData.filedAt, icon: FileText },
                { label: 'Case Docketed', date: caseData.docketedAt, icon: FolderOpen },
                { label: 'Current Status', date: caseData.proceduralState, icon: Clock },
              ].map((event, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <div className="absolute -left-4 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
                  <Card className="flex-1">
                    <div className="p-3 flex items-center justify-between">
                      <span className="font-medium text-slate-800">{event.label}</span>
                      <span className="text-sm text-slate-500">{event.date}</span>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        );

      case 'logistics':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Hearing Logistics
            </h3>
            <Card className="p-8 text-center text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Hearing logistics and scheduling information will be displayed here.</p>
            </Card>
          </div>
        );

      case 'briefing':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Appellate Briefing Timeline
            </h3>
            <Card className="p-8 text-center text-slate-400">
              <p className="text-sm">Appellate briefing timeline will be displayed here.</p>
            </Card>
          </div>
        );

      case 'record':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Link className="w-5 h-5 text-blue-600" />
              Lower Court Record
            </h3>
            <Card className="p-8 text-center text-slate-400">
              <p className="text-sm">Lower court record information will be displayed here.</p>
            </Card>
          </div>
        );

      case 'heritage':
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Link className="w-5 h-5 text-blue-600" />
              Case Heritage
            </h3>
            {['priorClaims', 'consolidatedCases', 'relatedAppeals'].map((key) => {
              const label = key === 'priorClaims' ? 'Prior Claims' : key === 'consolidatedCases' ? 'Consolidated Cases' : 'Related Appeals';
              const items = caseData.heritage?.[key] || [];
              return (
                <div key={key}>
                  <h4 className="font-medium text-slate-700 mb-2">{label}</h4>
                  {items.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                      {items.map((item: any, idx: number) => (
                        <li key={idx}>{typeof item === 'string' ? item : item.docketNumber || JSON.stringify(item)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400">None on record</p>
                  )}
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-white h-full flex flex-col">
          <CaseHeader
            caseData={caseData}
            onClose={onClose}
            userRole={userRole}
          />

          <div className="flex flex-row flex-grow overflow-hidden">
            <EntityNavigator
              activeView={activeView}
              onViewChange={setActiveView}
              perspective={perspective}
              caseData={caseData}
            />

            <div className="flex-grow overflow-y-auto p-6 bg-slate-50">
              {renderContent()}
            </div>

            <ContextPanel
              caseData={caseData}
              userRole={userRole}
              collapsed={contextCollapsed}
              onToggle={() => setContextCollapsed(!contextCollapsed)}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
