import React from 'react';
import { motion } from 'motion/react';
import { X, FileText, Users, Calendar, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Card, Badge, Button } from '../UI';

interface CaseRecordViewerProps {
  caseId: string;
  onClose: () => void;
}

export default function CaseRecordViewer({ caseId, onClose }: CaseRecordViewerProps) {
  // Mock case data
  const caseData = {
    id: caseId,
    docketNumber: '2026-BLA-00089',
    caseType: 'BLA',
    status: 'Pending Docketing',
    claimant: 'Robert Martinez',
    employer: 'Apex Coal Mining',
    filedAt: '2026-03-11 09:23 AM',
    channel: 'UFS',
    office: 'Pittsburgh, PA',
    filings: [
      { id: 'F1', type: 'Initial Claim', form: 'LS-203', filedAt: '2026-03-11 09:23 AM', status: 'Pending Review' },
    ],
    parties: [
      { name: 'Robert Martinez', role: 'Claimant', represented: false, email: 'r.martinez@email.com', phone: '(412) 555-0123' },
      { name: 'Apex Coal Mining', role: 'Employer', represented: true, attorney: 'Hansen & Associates', email: 'legal@hansenlaw.com' },
    ],
    aiAnalysis: {
      score: 98,
      complete: true,
      deficiencies: [],
      extracted: {
        ssn: '***-**-4567',
        doi: '2025-12-15',
        employer: 'Apex Coal Mining',
        carrier: 'Coal Workers Comp Ins.',
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="info">{caseData.caseType}</Badge>
              <Badge variant={caseData.status === 'Pending Docketing' ? 'warning' : 'success'}>
                {caseData.status}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-mono">{caseData.docketNumber}</h2>
            <p className="text-sm text-slate-600 mt-1">
              {caseData.claimant} <span className="text-slate-400">v.</span> {caseData.employer}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content - Three Column Layout */}
        <div className="flex-grow overflow-hidden">
          <div className="flex h-full">
            {/* Left Panel - Case Info (25%) */}
            <div className="w-1/4 border-r border-slate-200 overflow-y-auto bg-slate-50 p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Case Information</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Filed At</div>
                  <div className="text-sm font-medium text-slate-900">{caseData.filedAt}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Channel</div>
                  <Badge variant="neutral">{caseData.channel}</Badge>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Office</div>
                  <div className="text-sm font-medium text-slate-900">{caseData.office}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Assigned Judge</div>
                  <div className="text-sm font-medium text-slate-900">Not Assigned</div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Parties</h3>
                <div className="space-y-3">
                  {caseData.parties.map((party, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-bold text-slate-900">{party.name}</div>
                        <Badge variant="info" size="sm">{party.role}</Badge>
                      </div>
                      {party.represented ? (
                        <div className="text-xs text-slate-500">
                          <div>Attorney: {party.attorney}</div>
                          <div>{party.email}</div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500">
                          <div className="text-amber-600 font-medium mb-1">⚠️ Pro Se (Self-Represented)</div>
                          <div>{party.email}</div>
                          <div>{party.phone}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Panel - Main Content (50%) */}
            <div className="w-1/2 overflow-y-auto p-6">
              {/* Filings */}
              <Card className="mb-6">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Filings
                  </h3>
                  <Badge variant="neutral">{caseData.filings.length}</Badge>
                </div>
                <div className="divide-y divide-slate-100">
                  {caseData.filings.map((filing) => (
                    <div key={filing.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{filing.type}</div>
                        <div className="text-xs text-slate-500">{filing.form} • {filing.filedAt}</div>
                      </div>
                      <Badge variant="warning" size="sm">{filing.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Timeline */}
              <Card>
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Case Timeline
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">Filed</div>
                        <div className="text-xs text-slate-500">{caseData.filedAt}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-300 mt-2" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">Docketing Pending</div>
                        <div className="text-xs text-slate-500">Awaiting clerk action</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-300 mt-2" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">Judge Assignment</div>
                        <div className="text-xs text-slate-500">Will be assigned after docketing</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Panel - AI Analysis (25%) */}
            <div className="w-1/4 border-l border-slate-200 overflow-y-auto bg-gradient-to-b from-emerald-50 to-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">AI Analysis</h3>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-emerald-600 mb-2">{caseData.aiAnalysis.score}%</div>
                <div className="text-sm text-slate-600">Completeness Score</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700">All fields complete</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700">Signature verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700">No deficiencies</span>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-200">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Extracted Data</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">SSN:</span>
                    <span className="font-mono text-slate-700">{caseData.aiAnalysis.extracted.ssn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">DOI:</span>
                    <span className="font-mono text-slate-700">{caseData.aiAnalysis.extracted.doi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Employer:</span>
                    <span className="font-mono text-slate-700">{caseData.aiAnalysis.extracted.employer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Carrier:</span>
                    <span className="font-mono text-slate-700">{caseData.aiAnalysis.extracted.carrier}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <Button className="w-full" leftIcon={<CheckCircle className="w-4 h-4" />}>
                  Auto-Docket
                </Button>
                <Button variant="outline" className="w-full">
                  Assign to Judge
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
