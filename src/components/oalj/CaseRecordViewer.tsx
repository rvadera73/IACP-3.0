import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  FileText,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Eye,
  FolderOpen,
  Gavel,
  Scale,
  ChevronRight,
  Search,
  Filter,
  Sparkles,
  Brain,
  Lightbulb,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';

interface CaseRecordViewerProps {
  caseNumber: string;
  onClose: () => void;
  userRole?: string;
}

interface Filing {
  id: string;
  type: string;
  category: string;
  description: string;
  filedBy: string;
  filedAt: string;
  status: 'Pending' | 'Accepted' | 'Deficient' | 'Rejected' | 'Admitted';
  documents: Document[];
}

interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'DOC' | 'DOCX';
  size: string;
  uploadedAt: string;
  url?: string;
}

interface Hearing {
  id: string;
  type: string;
  date: string;
  time: string;
  location: string;
  judge: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  transcript?: boolean;
}

interface Party {
  name: string;
  role: string;
  represented: boolean;
  attorney?: string;
  email?: string;
  phone?: string;
  address?: string;
}

type CasePhase = 'Intake' | 'Docketing' | 'Assignment' | 'Pre-Hearing' | 'Hearing' | 'Decision';

export default function CaseRecordViewer({ caseNumber, onClose, userRole = 'OALJ Docket Clerk' }: CaseRecordViewerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'filings' | 'documents' | 'hearings' | 'parties'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDocPreview, setShowDocPreview] = useState(false);

  // Determine case phase based on case data
  const getCasePhase = (): CasePhase => {
    if (caseNumber.includes('00080')) return 'Pre-Hearing';
    if (caseNumber.includes('00085')) return 'Assignment';
    return 'Intake';
  };

  const currentPhase = getCasePhase();

  // Check if this is a Board case (BRB/ARB/ECAB)
  const isBoardCase = caseNumber.includes('BRB') || caseNumber.includes('ARB') || caseNumber.includes('ECAB') || caseNumber.includes('No.');
  
  // Check if this is an intake case (starts with INT-)
  const isIntakeCase = caseNumber.startsWith('INT-');

  // Mock case data - LIFECYCLE ALIGNED
  const caseData = {
    docketNumber: caseNumber,
    caseType: isBoardCase ? 
      (caseNumber.includes('BRB') ? 'BRB' : caseNumber.includes('ARB') ? 'ARB' : 'ECAB') :
      (caseNumber.includes('BLA') ? 'BLA' : caseNumber.includes('LHC') ? 'LHC' : 'PER'),
    title: isBoardCase ?
      (caseNumber.includes('Williams') ? 'Williams v. Black Diamond Mining' :
       caseNumber.includes('Garcia') ? 'Garcia v. Logistics Partners' :
       caseNumber.includes('Thompson') ? 'Thompson v. Federal Express' :
       'Petitioner v. Respondent') :
      (isIntakeCase ? 'New Filing - Pending Review' :
       caseNumber.includes('00085') ? 'Estate of R. Kowalski v. Pittsburgh Coal Co.' :
       caseNumber.includes('00080') ? 'Maria Santos v. Atlantic Dockworkers' :
       'Claimant v. Employer'),
    status: isBoardCase ? 'On Appeal' : (isIntakeCase ? 'Pending Review' : (caseNumber.includes('00085') || caseNumber.includes('00080') ? 'Active' : 'Pending Docketing')),
    filedAt: '2026-03-05',
    docketedAt: caseNumber.includes('00085') ? '2026-03-05 11:30 AM' :
                caseNumber.includes('00080') ? '2026-02-28 11:45 AM' : undefined,
    judge: caseNumber.includes('00080') ? 'Hon. Michael Ross' : 'Not Assigned',
    office: 'Pittsburgh, PA',
    phase: currentPhase,
    daysElapsed: caseNumber.includes('00085') ? 8 : caseNumber.includes('00080') ? 13 : 0,
    daysToDecision: caseNumber.includes('00085') ? 262 : caseNumber.includes('00080') ? 257 : 270,

    // 6-Step Lifecycle - Safe defaults for all case types
    lifecycle: {
      intake: { status: 'completed' as const, date: '2026-03-05', completed: true },
      docketing: { status: (caseNumber.includes('00085') || caseNumber.includes('00080')) ? 'completed' as const : 'pending' as const, date: caseNumber.includes('00085') ? '2026-03-05' : caseNumber.includes('00080') ? '2026-02-28' : undefined, completed: caseNumber.includes('00085') || caseNumber.includes('00080') },
      assignment: { status: caseNumber.includes('00080') ? 'completed' as const : 'pending' as const, date: caseNumber.includes('00080') ? '2026-03-01' : undefined, completed: !!caseNumber.includes('00080') },
      preHearing: { status: 'pending' as const, date: undefined, completed: false },
      hearing: { status: 'pending' as const, date: undefined, completed: false },
      decision: { status: 'pending' as const, date: undefined, completed: false },
    },

    parties: [
      {
        name: caseNumber.includes('00085') ? 'Estate of R. Kowalski' :
              caseNumber.includes('00080') ? 'Maria Santos' : 'Claimant Name',
        role: 'Claimant',
        represented: caseNumber.includes('00080'),
        attorney: caseNumber.includes('00080') ? 'Legal Aid Society' : undefined,
        email: 'claimant@email.com',
        phone: '(412) 555-0123',
        address: '123 Main St, Pittsburgh, PA 15201',
      },
      {
        name: caseNumber.includes('00085') ? 'Pittsburgh Coal Co.' :
              caseNumber.includes('00080') ? 'Atlantic Dockworkers' : 'Employer Name',
        role: 'Employer',
        represented: true,
        attorney: caseNumber.includes('00085') ? 'Hansen & Associates' : 'Corporate Legal Dept',
        email: 'legal@employer.com',
        phone: '(412) 555-0456',
        address: '456 Business Ave, Pittsburgh, PA 15202',
      },
    ] as Party[],

    filings: [
      {
        id: 'F1',
        type: 'Initial Claim',
        category: 'Claim',
        description: 'LS-203 Claim Form with medical evidence',
        filedBy: 'Claimant',
        filedAt: '2026-03-05',
        status: 'Accepted',
        documents: [
          { id: 'D1', name: 'LS-203_Claim_Form.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '2026-03-05' },
          { id: 'D2', name: 'Medical_Evidence_Dr_Smith.pdf', type: 'PDF', size: '1.8 MB', uploadedAt: '2026-03-05' },
        ],
      },
      {
        id: 'F2',
        type: 'Notice of Appearance',
        category: 'Procedural',
        description: 'Notice of Appearance - Hansen & Associates',
        filedBy: 'Employer Counsel',
        filedAt: '2026-03-06',
        status: 'Accepted',
        documents: [
          { id: 'D3', name: 'NOA_Hansen_Firm.pdf', type: 'PDF', size: '0.5 MB', uploadedAt: '2026-03-06' },
        ],
      },
      {
        id: 'F3',
        type: 'Employment Records',
        category: 'Evidence',
        description: 'Employment history and wage records',
        filedBy: 'Employer',
        filedAt: '2026-03-08',
        status: 'Admitted',
        documents: [
          { id: 'D4', name: 'Employment_History.pdf', type: 'PDF', size: '3.2 MB', uploadedAt: '2026-03-08' },
          { id: 'D5', name: 'Wage_Records_2020-2025.xlsx', type: 'PDF', size: '1.1 MB', uploadedAt: '2026-03-08' },
        ],
      },
      {
        id: 'F4',
        type: 'Medical Examination Report',
        category: 'Medical',
        description: 'Pulmonary function test results',
        filedBy: 'Claimant',
        filedAt: '2026-03-10',
        status: 'Accepted',
        documents: [
          { id: 'D6', name: 'PFT_Results_Dr_Johnson.pdf', type: 'PDF', size: '2.0 MB', uploadedAt: '2026-03-10' },
          { id: 'D7', name: 'Chest_XRay_Report.pdf', type: 'PDF', size: '4.5 MB', uploadedAt: '2026-03-10' },
        ],
      },
    ] as Filing[],

    hearings: caseNumber.includes('00080') ? [
      {
        id: 'H1',
        type: 'Pre-Hearing Conference',
        date: '2026-03-25',
        time: '10:00 AM',
        location: 'Room 402, Pittsburgh Office',
        judge: 'Hon. Michael Ross',
        status: 'Scheduled',
        transcript: false,
      },
    ] : [] as Hearing[],

    // AI Summary - Role Specific
    aiSummary: {
      'OALJ Docket Clerk': `This ${caseData.caseType} case was filed on ${caseData.filedAt} and is currently in the ${currentPhase} phase. The case has been ${caseData.docketedAt ? 'docketed and assigned to ' + caseData.judge : 'awaiting docketing'}. All required initial filings have been received and accepted. No deficiencies detected.`,
      'OALJ Legal Assistant': `Case is in ${currentPhase} phase with ${caseData.filings.length} filings and ${caseData.hearings.length} scheduled hearing(s). All parties are properly represented. Next action: ${caseData.hearings.length > 0 ? 'Prepare for hearing on ' + caseData.hearings[0].date : 'Schedule pre-hearing conference'}.`,
      'OALJ Attorney-Advisor': `This ${caseData.caseType} case involves ${caseData.parties[0].name} vs ${caseData.parties[1].name}. Medical evidence includes pulmonary function tests and chest X-ray reports. Employment records have been submitted and admitted. Case appears ready for ${currentPhase === 'Pre-Hearing' ? 'hearing' : 'assignment'}.`,
      'Administrative Law Judge': `Case assigned on ${caseNumber.includes('00080') ? '2026-03-01' : 'TBD'}. ${caseData.filings.length} filings received, all accepted. Medical evidence establishes ${caseData.caseType === 'BLA' ? 'potential pneumoconiosis with impaired pulmonary function' : 'work-related injury'}. Next hearing scheduled for ${caseData.hearings.length > 0 ? caseData.hearings[0].date : 'TBD'}.`,
    },

    // AI Insights - Role Specific
    aiInsights: {
      'OALJ Docket Clerk': [
        {
          type: 'info' as const,
          title: 'Complete Filing',
          description: 'All required documents received. No deficiencies detected.',
          icon: 'check',
        },
        {
          type: 'warning' as const,
          title: 'Assignment Pending',
          description: caseData.judge !== 'Not Assigned' ? `Assigned to ${caseData.judge}` : 'Case requires judge assignment',
          icon: 'clock',
        },
      ],
      'OALJ Legal Assistant': [
        {
          type: 'info' as const,
          title: 'Hearing Preparation',
          description: caseData.hearings.length > 0 ? `Hearing scheduled for ${caseData.hearings[0].date}` : 'No hearing scheduled yet',
          icon: 'calendar',
        },
        {
          type: 'success' as const,
          title: 'All Parties Represented',
          description: caseData.parties.every(p => p.represented) ? 'All parties have legal representation' : 'Pro Se party detected - extra notice required',
          icon: 'users',
        },
      ],
      'OALJ Attorney-Advisor': [
        {
          type: 'info' as const,
          title: 'Evidence Complete',
          description: 'Medical and employment evidence submitted and admitted',
          icon: 'file',
        },
        {
          type: 'lightbulb' as const,
          title: 'Recommendation',
          description: 'Case appears ready for bench memo preparation',
          icon: 'lightbulb',
        },
      ],
      'Administrative Law Judge': [
        {
          type: 'info' as const,
          title: 'Case Ready',
          description: 'All evidence submitted, ready for adjudication',
          icon: 'scale',
        },
        {
          type: 'clock' as const,
          title: '270-Day Clock',
          description: `${caseData.daysToDecision} days remaining to decision (Deadline: ~${new Date(Date.now() + caseData.daysToDecision * 24 * 60 * 60 * 1000).toLocaleDateString()})`,
          icon: 'clock',
        },
        {
          type: 'trending' as const,
          title: 'Complexity Assessment',
          description: 'Standard complexity - medical evidence straightforward',
          icon: 'trending',
        },
      ],
    },
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowDocPreview(true);
  };

  const handleDownloadDocument = (doc: Document) => {
    alert(`Downloading ${doc.name}...\n\n✓ Download started`);
  };

  const filteredFilings = caseData.filings.filter(filing =>
    filing.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    filing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    filing.filedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAIInsightIcon = (iconName: string) => {
    switch (iconName) {
      case 'check': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'clock': return <Clock className="w-5 h-5 text-amber-600" />;
      case 'calendar': return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'users': return <Users className="w-5 h-5 text-purple-600" />;
      case 'file': return <FileText className="w-5 h-5 text-slate-600" />;
      case 'lightbulb': return <Lightbulb className="w-5 h-5 text-amber-600" />;
      case 'scale': return <Scale className="w-5 h-5 text-blue-600" />;
      case 'trending': return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const getAIInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-50 border-emerald-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-slate-50 border-slate-200';
    }
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="info">{caseData.caseType}</Badge>
                <Badge variant={caseData.status === 'Active' ? 'success' : 'warning'}>{caseData.status}</Badge>
                {caseData.judge !== 'Not Assigned' && (
                  <Badge variant="neutral">Assigned: {caseData.judge}</Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-mono">{caseData.docketNumber}</h2>
              <p className="text-sm text-slate-600 mt-1">{caseData.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={() => alert('Exporting case record...')}>
                Export Record
              </Button>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
          </div>

          {/* 6-Step Lifecycle Tracker */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              {['Intake', 'Docketing', 'Assignment', 'Pre-Hearing', 'Hearing', 'Decision'].map((phase, idx) => {
                const phaseKey = phase.toLowerCase() as keyof typeof caseData.lifecycle;
                const phaseData = caseData.lifecycle[phaseKey];
                const isCurrentPhase = currentPhase === phase;
                const phaseIndex = ['Intake', 'Docketing', 'Assignment', 'Pre-Hearing', 'Hearing', 'Decision'].indexOf(currentPhase);
                const thisPhaseIndex = idx;

                return (
                  <React.Fragment key={phase}>
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                        phaseData?.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isCurrentPhase
                          ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-200'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        {phaseData?.completed ? <CheckCircle className="w-5 h-5" /> : thisPhaseIndex <= phaseIndex ? idx + 1 : '•'}
                      </div>
                      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-2">{phase}</div>
                      {phaseData?.date && (
                        <div className="text-[9px] text-slate-500 mt-0.5">{phaseData.date}</div>
                      )}
                    </div>
                    {idx < 5 && (
                      <div className="flex-1 h-1 mx-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${
                          phaseData?.completed ? 'bg-emerald-500 w-full' : 'bg-slate-200 w-0'
                        }`} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Days Elapsed</div>
              <div className="text-xl font-bold text-slate-900">{caseData.daysElapsed}</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">To Decision</div>
              <div className="text-xl font-bold text-slate-900">{caseData.daysToDecision}</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Filings</div>
              <div className="text-xl font-bold text-slate-900">{caseData.filings.length}</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Hearings</div>
              <div className="text-xl font-bold text-slate-900">{caseData.hearings.length}</div>
            </div>
          </div>
        </div>

        {/* AI Summary & Insights - Role Specific */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
          {/* AI Summary */}
          <div className="lg:col-span-2">
            <Card className="h-full border-purple-200 bg-white/80">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-slate-900">AI Case Summary</h3>
                  <Badge variant="neutral" size="sm">{userRole}</Badge>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {caseData.aiSummary[userRole as keyof typeof caseData.aiSummary] || caseData.aiSummary['OALJ Docket Clerk']}
                </p>
              </div>
            </Card>
          </div>

          {/* AI Insights */}
          <div>
            <Card className="h-full border-amber-200 bg-white/80">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900">AI Insights</h3>
                </div>
                <div className="space-y-2">
                  {(caseData.aiInsights[userRole as keyof typeof caseData.aiInsights] || caseData.aiInsights['OALJ Docket Clerk']).map((insight: any, idx: number) => (
                    <div key={idx} className={`p-3 rounded-lg border ${getAIInsightColor(insight.type)}`}>
                      <div className="flex items-start gap-2">
                        {getAIInsightIcon(insight.icon)}
                        <div>
                          <div className="text-xs font-bold text-slate-900">{insight.title}</div>
                          <div className="text-[11px] text-slate-600 mt-0.5">{insight.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-3 bg-slate-50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('filings')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'filings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Filings
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Documents
          </button>
          <button
            onClick={() => setActiveTab('hearings')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'hearings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gavel className="w-4 h-4" />
            Hearings
          </button>
          <button
            onClick={() => setActiveTab('parties')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'parties' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Parties
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 bg-slate-50">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Case Timeline */}
                <Card>
                  <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Case Timeline
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {Object.entries(caseData.lifecycle).map(([phase, data]: [string, any]) => (
                        <div key={phase} className="flex items-start gap-4">
                          <div className={`w-3 h-3 rounded-full mt-1 ${
                            data.completed ? 'bg-emerald-500' : 'bg-slate-300'
                          }`} />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 capitalize">{phase}</div>
                            <div className="text-xs text-slate-500">{data.date || 'TBD'}</div>
                          </div>
                          {data.completed && (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Recent Filings */}
                <Card>
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      Recent Filings
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('filings')}>
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {caseData.filings.slice(0, 3).map((filing) => (
                      <div key={filing.id} className="p-4 hover:bg-slate-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-bold text-slate-900">{filing.type}</div>
                          <Badge variant={filing.status === 'Accepted' || filing.status === 'Admitted' ? 'success' : 'warning'} size="sm">
                            {filing.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500 mb-2">{filing.description}</div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>Filed by: {filing.filedBy}</span>
                          <span>{filing.filedAt}</span>
                          <span>{filing.documents.length} docs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Case Info */}
                <Card>
                  <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900">Case Information</h3>
                  </div>
                  <div className="p-4 space-y-3 text-sm">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Office</div>
                      <div className="font-medium text-slate-900">{caseData.office}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Filed</div>
                      <div className="font-medium text-slate-900">{caseData.filedAt}</div>
                    </div>
                    {caseData.docketedAt && (
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Docketed</div>
                        <div className="font-medium text-slate-900">{caseData.docketedAt}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Phase</div>
                      <Badge variant="info">{caseData.phase}</Badge>
                    </div>
                  </div>
                </Card>

                {/* Parties Summary */}
                <Card>
                  <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      Parties
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {caseData.parties.map((party, idx) => (
                      <div key={idx} className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium text-slate-900">{party.name}</div>
                          <Badge variant="info" size="sm">{party.role}</Badge>
                        </div>
                        {party.represented ? (
                          <div className="text-xs text-slate-500">
                            <div>Attorney: {party.attorney}</div>
                            <div>{party.email}</div>
                          </div>
                        ) : (
                          <div className="text-xs text-amber-600">
                            <AlertCircle className="w-3 h-3 inline mr-1" />
                            Pro Se (Self-Represented)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Filings Tab */}
          {activeTab === 'filings' && (
            <div className="space-y-6">
              {/* Search & Filter */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search filings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
                  Filter
                </Button>
              </div>

              {/* Filings List */}
              <Card>
                <div className="divide-y divide-slate-100">
                  {filteredFilings.map((filing) => (
                    <div key={filing.id} className="p-4 hover:bg-slate-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-sm font-bold text-slate-900">{filing.type}</div>
                            <Badge variant={filing.status === 'Accepted' || filing.status === 'Admitted' ? 'success' : 'warning'} size="sm">
                              {filing.status}
                            </Badge>
                            <Badge variant="neutral" size="sm">{filing.category}</Badge>
                          </div>
                          <div className="text-sm text-slate-600 mb-2">{filing.description}</div>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>Filed by: {filing.filedBy}</span>
                            <span>{filing.filedAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      {filing.documents.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="text-xs font-bold text-slate-500 mb-2">Documents ({filing.documents.length})</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {filing.documents.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-2 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer"
                                onClick={() => handleViewDocument(doc)}
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <div>
                                    <div className="text-xs font-medium text-slate-900">{doc.name}</div>
                                    <div className="text-[10px] text-slate-500">{doc.size} • {doc.type}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm" onClick={(e: any) => { e.stopPropagation(); handleDownloadDocument(doc); }}>
                                    <Download className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={(e: any) => { e.stopPropagation(); handleViewDocument(doc); }}>
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">All Documents ({caseData.filings.reduce((sum, f) => sum + f.documents.length, 0)})</h3>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {caseData.filings.flatMap(f => f.documents).map((doc, idx) => (
                  <Card key={idx} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleViewDocument(doc)}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <Badge variant="neutral" size="sm">{doc.type}</Badge>
                      </div>
                      <div className="text-sm font-bold text-slate-900 mb-1 truncate">{doc.name}</div>
                      <div className="text-xs text-slate-500 mb-3">{doc.size} • Uploaded {doc.uploadedAt}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={(e: any) => { e.stopPropagation(); handleDownloadDocument(doc); }}>
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e: any) => { e.stopPropagation(); handleViewDocument(doc); }}>
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Hearings Tab */}
          {activeTab === 'hearings' && (
            <div className="space-y-6">
              {caseData.hearings.length === 0 ? (
                <Card>
                  <div className="p-12 text-center">
                    <Gavel className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-slate-900 mb-2">No Hearings Scheduled</h4>
                    <p className="text-slate-600">Hearings will be scheduled once the case is assigned to a judge.</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {caseData.hearings.map((hearing) => (
                    <Card key={hearing.id}>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="info">{hearing.type}</Badge>
                              <Badge variant={hearing.status === 'Scheduled' ? 'warning' : hearing.status === 'Completed' ? 'success' : 'error'}>
                                {hearing.status}
                              </Badge>
                            </div>
                            <div className="text-lg font-bold text-slate-900">{hearing.date} at {hearing.time}</div>
                            <div className="text-sm text-slate-600">{hearing.location}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-500 mb-1">Judge</div>
                            <div className="text-sm font-bold text-slate-900">{hearing.judge}</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" size="sm" leftIcon={<Calendar className="w-3 h-3" />}>
                            Add to Calendar
                          </Button>
                          {hearing.transcript && (
                            <Button variant="outline" size="sm" leftIcon={<FileText className="w-3 h-3" />}>
                              View Transcript
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Parties Tab */}
          {activeTab === 'parties' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseData.parties.map((party, idx) => (
                <Card key={idx}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-lg font-bold text-slate-900">{party.name}</div>
                        <Badge variant="info" className="mt-1">{party.role}</Badge>
                      </div>
                      {party.represented ? (
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-amber-600" title="Pro Se" />
                      )}
                    </div>

                    {party.represented && (
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                        <div className="text-xs font-bold text-slate-500 mb-1">Attorney</div>
                        <div className="text-sm font-medium text-slate-900">{party.attorney}</div>
                      </div>
                    )}

                    <div className="space-y-2 text-sm">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Email</div>
                        <div className="text-sm font-medium text-slate-900">{party.email}</div>
                      </div>
                      {party.phone && (
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Phone</div>
                          <div className="text-sm font-medium text-slate-900">{party.phone}</div>
                        </div>
                      )}
                      {party.address && (
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Address</div>
                          <div className="text-sm font-medium text-slate-900">{party.address}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Document Preview Modal */}
        {showDocPreview && selectedDocument && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowDocPreview(false)}>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedDocument.name}</h3>
                  <p className="text-sm text-slate-600">{selectedDocument.size} • {selectedDocument.type} • Uploaded {selectedDocument.uploadedAt}</p>
                </div>
                <button onClick={() => setShowDocPreview(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-grow p-6 bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-24 h-24 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Document preview would appear here</p>
                  <p className="text-sm text-slate-400 mt-2">{selectedDocument.name}</p>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                <Button variant="outline" onClick={() => handleDownloadDocument(selectedDocument)} leftIcon={<Download className="w-4 h-4" />}>
                  Download
                </Button>
                <Button onClick={() => setShowDocPreview(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
