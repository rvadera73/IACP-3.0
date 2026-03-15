import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Bell, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  ChevronRight, 
  ArrowLeft, 
  Filter, 
  Download, 
  ExternalLink, 
  Scale, 
  ShieldCheck, 
  History, 
  ArrowUpRight,
  Database,
  Link as LinkIcon,
  FileSearch,
  Gavel,
  Users,
  Plus,
  MoreHorizontal,
  Mail,
  RefreshCw
} from 'lucide-react';
import { 
  Case, 
  CaseStatus, 
  Filing, 
  RecordStatus, 
  JurisdictionBasis, 
  AppealDisposition 
} from '../types';
import { APPEAL_TYPES, MOCK_OALJ_CASES } from '../constants';

// --- UI Components ---

const Card = ({ children, className = "", onClick, ...props }: { children: React.ReactNode; className?: string; onClick?: () => void; [key: string]: any }) => (
  <div 
    {...props}
    className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-md transition-all' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', size = 'md', className = "", onClick, disabled = false }: any) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
    success: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button 
      className={`rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'purple' }) => {
  const variants = {
    neutral: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-indigo-100 text-indigo-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant]}`}>
      {children}
    </span>
  );
};

// --- Main Component ---

export default function AppellatePortal() {
  const [view, setView] = useState<'dashboard' | 'intake' | 'case-detail' | 'record-scan'>('dashboard');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CaseStatus | 'All'>('All');
  
  // Mock Appellate Cases
  const [cases, setCases] = useState<Case[]>([
    {
      id: 'app-1',
      caseNumber: 'BRB No. 26-0042 BLA',
      intakeId: 'int-101',
      caseType: 'BLA',
      appealType: 'BRB',
      claimant: { name: 'John Doe', ssnLast4: '1234' },
      employer: { name: 'Coal Corp' },
      status: 'Review',
      phase: 'Post-Decision',
      division: 'BRB',
      office: 'Washington, DC',
      createdAt: '2026-02-15',
      judge: 'Hon. Sarah Jenkins',
      filings: [],
      serviceList: [
        { name: 'John Doe', role: 'Claimant', email: 'john@example.com', organization: 'Self', addedAt: '2026-02-15' },
        { name: 'Coal Corp', role: 'Employer', email: 'legal@coalcorp.com', organization: 'Coal Corp', addedAt: '2026-02-15' }
      ],
      appealData: {
        originalCaseNumber: '2024-BLA-00042',
        dateOfDecisionBelow: '2026-01-15',
        appealingParty: 'Employer',
        basisForAppeal: 'Error in fact finding regarding medical evidence.',
        jurisdictionBasis: 'Final Order Review',
        recordStatus: 'Certified',
        briefingSchedule: {
          acknowledgmentDate: '2026-02-20',
          petitionerBriefDue: '2026-03-22', // 20th + 30 days (weekend adjust)
          respondentBriefDue: '2026-04-21',
          replyBriefDue: '2026-05-06',
        },
        panel: ['Judge A', 'Judge B', 'Judge C'],
        leadJudge: 'Judge A',
        findings: {
          timeliness: { status: 'Timely', details: 'Filed 31 days after decision (within 30-day window + weekend grace).' },
          crossAppeal: { detected: false },
          standing: { status: 'Verified', details: 'Employer was a party in the lower court.' }
        }
      }
    },
    {
      id: 'app-2',
      caseNumber: 'BRB No. 26-0123 LHC',
      intakeId: 'int-102',
      caseType: 'LHC',
      appealType: 'BRB',
      claimant: { name: 'Jane Smith', ssnLast4: '5678' },
      employer: { name: 'Port Authority' },
      status: 'Intake',
      phase: 'Intake',
      division: 'BRB',
      office: 'Washington, DC',
      createdAt: '2026-02-25',
      filings: [],
      serviceList: [
        { name: 'Jane Smith', role: 'Claimant', email: 'jane@example.com', organization: 'Self', addedAt: '2026-02-25' },
        { name: 'Port Authority', role: 'Employer', email: 'hr@portauth.gov', organization: 'Port Authority', addedAt: '2026-02-25' }
      ],
      appealData: {
        originalCaseNumber: '2024-LHC-00123',
        dateOfDecisionBelow: '2026-02-10',
        appealingParty: 'Claimant',
        basisForAppeal: 'Denial of benefits contrary to evidence.',
        jurisdictionBasis: 'Final Order Review',
        recordStatus: 'Incomplete',
        findings: {
          timeliness: { status: 'Timely', details: 'Filed 15 days after decision.' },
          crossAppeal: { detected: true, relatedCase: 'BRB No. 26-0124' },
          standing: { status: 'Verified', details: 'Claimant has standing.' }
        }
      }
    }
  ]);

  // --- Helpers ---

  const adjustForWeekend = (date: Date): Date => {
    const day = date.getDay();
    const result = new Date(date);
    if (day === 0) result.setDate(result.getDate() + 1); // Sunday -> Monday
    if (day === 6) result.setDate(result.getDate() + 2); // Saturday -> Monday
    return result;
  };

  const calculateBriefingSchedule = (ackDateStr: string) => {
    const ackDate = new Date(ackDateStr);
    
    const petDue = new Date(ackDate);
    petDue.setDate(petDue.getDate() + 30);
    const petDueAdj = adjustForWeekend(petDue);

    const respDue = new Date(petDueAdj);
    respDue.setDate(respDue.getDate() + 30);
    const respDueAdj = adjustForWeekend(respDue);

    const replyDue = new Date(respDueAdj);
    replyDue.setDate(replyDue.getDate() + 15);
    const replyDueAdj = adjustForWeekend(replyDue);

    return {
      acknowledgmentDate: ackDateStr,
      petitionerBriefDue: petDueAdj.toISOString().split('T')[0],
      respondentBriefDue: respDueAdj.toISOString().split('T')[0],
      replyBriefDue: replyDueAdj.toISOString().split('T')[0],
    };
  };

  // --- Handlers ---

  const handleCaseSelect = (c: Case) => {
    setSelectedCase(c);
    setView('case-detail');
  };

  const handleBack = () => {
    setView('dashboard');
    setSelectedCase(null);
  };

  const handleCompleteIntake = (foundCase: any, jurisdiction: JurisdictionBasis) => {
    const newCase: Case = {
      id: `app-${Date.now()}`,
      caseNumber: `BRB No. 26-${Math.floor(1000 + Math.random() * 9000)} ${foundCase.caseNumber.split('-')[1]}`,
      intakeId: `int-${Math.floor(1000 + Math.random() * 9000)}`,
      caseType: foundCase.caseNumber.includes('BLA') ? 'BLA' : 'LHC',
      appealType: 'BRB',
      claimant: { name: foundCase.claimant },
      employer: { name: foundCase.employer },
      status: 'Intake',
      phase: 'Intake',
      division: 'BRB',
      office: 'Washington, DC',
      createdAt: new Date().toISOString().split('T')[0],
      filings: [],
      serviceList: foundCase.parties.map((p: any) => ({
        ...p,
        organization: p.role === 'Employer' ? foundCase.employer : 'Private',
        addedAt: new Date().toISOString().split('T')[0]
      })),
      appealData: {
        originalCaseNumber: foundCase.caseNumber,
        dateOfDecisionBelow: foundCase.decisionDate,
        appealingParty: 'Petitioner', // Default
        basisForAppeal: 'Pending detailed statement.',
        jurisdictionBasis: jurisdiction,
        recordStatus: 'Incomplete',
        findings: {
          timeliness: { status: 'Timely', details: 'Automated check: Filed within statutory window.' },
          crossAppeal: { detected: false },
          standing: { status: 'Verified', details: 'Party of record in lower court.' }
        }
      }
    };

    setCases(prev => [newCase, ...prev]);
    setSelectedCase(newCase);
    setView('case-detail');
  };

  const updateCaseRecordStatus = (caseId: string, status: RecordStatus) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updatedCase = {
          ...c,
          appealData: {
            ...c.appealData!,
            recordStatus: status,
            // If certifying, trigger briefing schedule
            briefingSchedule: status === 'Certified' 
              ? calculateBriefingSchedule(new Date().toISOString().split('T')[0])
              : c.appealData?.briefingSchedule
          },
          status: status === 'Certified' ? 'Briefing' : c.status
        };
        if (selectedCase?.id === caseId) setSelectedCase(updatedCase);
        return updatedCase;
      }
      return c;
    }));
  };

  const handleRemand = (caseId: string) => {
    if (window.confirm('Are you sure you want to remand this case to OALJ? This will re-open the original docket and notify the ALJ.')) {
      setCases(prev => prev.map(c => {
        if (c.id === caseId) {
          const updated = { ...c, status: 'Remanded' as CaseStatus };
          if (selectedCase?.id === caseId) setSelectedCase(updated);
          return updated;
        }
        return c;
      }));
      alert('Remand Loop Triggered: Board Order pushed to OALJ system. Original docket re-opened.');
    }
  };

  const handleConsolidate = (caseId: string, relatedCase: string) => {
    alert(`Consolidation Request Triggered: Merging ${selectedCase?.caseNumber} with ${relatedCase}. All future filings will be docketed under the lead case.`);
  };

  // --- Dashboard View ---

  const Dashboard = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appellate Board Dashboard</h1>
          <p className="text-slate-500 text-sm">Managing the Administrative Record & Review Lifecycle</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">
            <Download size={16} /> Export Report
          </Button>
          <Button variant="primary" size="sm" onClick={() => setView('intake')}>
            <Plus size={16} /> New Appeal Intake
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', value: '12', trend: '+2 this week', color: 'blue' },
          { label: 'Incomplete Records', value: '5', trend: 'Requires Action', color: 'amber' },
          { label: 'In Briefing', value: '24', trend: 'On Schedule', color: 'emerald' },
          { label: 'Awaiting Decision', value: '8', trend: '3 Overdue', color: 'red' },
        ].map((m, i) => (
          <Card key={i} className="p-5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{m.label}</div>
            <div className="text-3xl font-bold text-slate-900">{m.value}</div>
            <div className={`text-[10px] font-bold mt-2 ${m.color === 'red' ? 'text-red-500' : m.color === 'amber' ? 'text-amber-500' : 'text-emerald-500'}`}>
              {m.trend}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Case List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Active Appeals</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search docket..." 
                  className="pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                />
              </div>
              <Button variant="secondary" size="sm" className="h-8 px-2">
                <Filter size={14} />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {cases.map((c) => (
              <Card key={c.id} className="p-4" onClick={() => handleCaseSelect(c)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.caseType === 'BLA' ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600'}`}>
                      {c.caseType === 'BLA' ? <ShieldCheck size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{c.caseNumber}</span>
                        <Badge variant={c.status === 'Intake' ? 'warning' : c.status === 'Review' ? 'info' : 'success'}>
                          {c.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {c.claimant.name} v. {c.employer.name} • Original: {c.appealData?.originalCaseNumber}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Record Status</div>
                    <div className={`text-xs font-bold ${c.appealData?.recordStatus === 'Certified' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {c.appealData?.recordStatus}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar: Smart Findings */}
        <div className="space-y-6">
          <Card className="p-6 bg-slate-50 border-slate-200">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Board Alerts</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Potential Late Filing</div>
                  <p className="text-[10px] text-slate-500 mt-1">BRB No. 26-0042: Filed 31 days after decision. Flagged for Jurisdictional Review.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <RefreshCw size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Cross-Appeal Detection</div>
                  <p className="text-[10px] text-slate-500 mt-1">Jane Smith (LHC): Detected separate NOA from Employer. Recommendation: Consolidate.</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[9px] text-blue-600 mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConsolidate('app-2', 'BRB No. 26-0124');
                    }}
                  >
                    Consolidate Now
                  </Button>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <Users size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Standing Issue</div>
                  <p className="text-[10px] text-slate-500 mt-1">Petitioner "Global Logistics" was not a party in the lower court record.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {[
                { label: 'Petitioner Brief', case: '26-0042', date: 'Mar 22', status: 'Upcoming' },
                { label: 'Record Certification', case: '26-0123', date: 'Mar 05', status: 'Urgent' },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{d.label}</div>
                    <div className="text-[10px] text-slate-500">Case {d.case}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-[10px] font-bold ${d.status === 'Urgent' ? 'text-red-500' : 'text-slate-600'}`}>{d.date}</div>
                    <div className="text-[8px] uppercase font-bold text-slate-400">{d.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  // --- Intake View ---

  const IntakeView = () => {
    const [originalCaseNum, setOriginalCaseNum] = useState('');
    const [foundCase, setFoundCase] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [jurisdiction, setJurisdiction] = useState<JurisdictionBasis>('Final Order Review');

    const handleLookup = () => {
      setIsSearching(true);
      setTimeout(() => {
        const match = MOCK_OALJ_CASES.find(c => c.caseNumber === originalCaseNum);
        setFoundCase(match || null);
        setIsSearching(false);
      }, 800);
    };

    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => setView('dashboard')}>
            <ArrowLeft size={16} /> Back
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">New Appeal Intake</h1>
        </div>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">1. Link to OALJ Record</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Database className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Enter OALJ Case Number (e.g., 2024-BLA-00042)" 
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={originalCaseNum}
                  onChange={(e) => setOriginalCaseNum(e.target.value)}
                />
              </div>
              <Button onClick={handleLookup} disabled={!originalCaseNum || isSearching}>
                {isSearching ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                Lookup
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {foundCase && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-blue-50 rounded-xl border border-blue-100 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-700 font-bold">
                    <LinkIcon size={16} />
                    <span>OALJ Record Found</span>
                  </div>
                  <Badge variant="success">Verified</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Claimant</div>
                    <div className="font-medium text-slate-800">{foundCase.claimant}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Employer</div>
                    <div className="font-medium text-slate-800">{foundCase.employer}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Decision Date</div>
                    <div className="font-medium text-slate-800">{foundCase.decisionDate}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">ALJ</div>
                    <div className="font-medium text-slate-800">{foundCase.judge}</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-blue-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Administrative Record (AR) Summary</div>
                  <div className="flex flex-wrap gap-2">
                    {foundCase.record.map((r: any, i: number) => (
                      <span key={i} className="px-2 py-1 bg-white rounded text-[10px] text-slate-600 border border-blue-50">
                        {r.type}: {r.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4 pt-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">2. Basis of Jurisdiction</label>
            <select 
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value as JurisdictionBasis)}
            >
              <option value="Final Order Review">Final Order Review</option>
              <option value="Interlocutory">Interlocutory</option>
              <option value="Petition for Reconsideration">Petition for Reconsideration</option>
            </select>
          </div>

          <div className="pt-6">
            <Button 
              className="w-full py-4 text-lg" 
              disabled={!foundCase}
              onClick={() => handleCompleteIntake(foundCase, jurisdiction)}
            >
              Complete Intake & Assign Docket
            </Button>
            <p className="text-center text-[10px] text-slate-400 mt-4">
              Upon validation, system will pull Parties of Record and AR into the Board's "Pending Review" folder.
            </p>
          </div>
        </Card>
      </div>
    );
  };

  // --- Case Detail View ---

  const CaseDetailView = () => {
    if (!selectedCase) return null;
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<any>(null);

    const runRecordScan = () => {
      setIsScanning(true);
      setTimeout(() => {
        const oaljCase = MOCK_OALJ_CASES.find(c => c.caseNumber === selectedCase.appealData?.originalCaseNumber);
        const hasTranscript = oaljCase?.record.some(r => r.type === 'Transcript');
        const hasDecision = oaljCase?.record.some(r => r.type === 'Decision');
        
        setScanResult({
          complete: hasTranscript && hasDecision,
          missing: !hasTranscript ? ['Hearing Transcript'] : [],
          found: oaljCase?.record.length || 0
        });
        setIsScanning(false);
      }, 1500);
    };

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft size={16} /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{selectedCase.caseNumber}</h1>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <Database size={12} /> Linked to OALJ: {selectedCase.appealData?.originalCaseNumber}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm">
              <Mail size={16} /> Send Notice
            </Button>
            <Button variant="primary" size="sm">
              <Gavel size={16} /> Draft Order
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Record Certification Workflow */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Record Certification Workflow</h3>
                <Badge variant={selectedCase.appealData?.recordStatus === 'Certified' ? 'success' : 'warning'}>
                  {selectedCase.appealData?.recordStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Completeness Scan</span>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-7 text-[10px]" 
                      onClick={runRecordScan}
                      disabled={isScanning}
                    >
                      {isScanning ? <RefreshCw className="animate-spin" size={12} /> : <FileSearch size={12} />}
                      Run Scan
                    </Button>
                  </div>
                  
                  {scanResult ? (
                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 text-xs font-bold ${scanResult.complete ? 'text-emerald-600' : 'text-red-600'}`}>
                        {scanResult.complete ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {scanResult.complete ? 'Record Complete' : 'Record Incomplete'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {scanResult.found} items found in OALJ database.
                        {!scanResult.complete && (
                          <div className="mt-2 p-2 bg-red-50 rounded border border-red-100 text-red-700">
                            Missing: {scanResult.missing.join(', ')}
                            <Button variant="ghost" size="sm" className="w-full mt-2 h-6 text-[9px] text-red-600 hover:bg-red-100">
                              Auto-Generate Status Request to OALJ
                            </Button>
                          </div>
                        )}
                        {scanResult.complete && selectedCase.appealData?.recordStatus !== 'Certified' && (
                          <Button 
                            variant="success" 
                            size="sm" 
                            className="w-full mt-2 h-8 text-xs"
                            onClick={() => updateCaseRecordStatus(selectedCase.id, 'Certified')}
                          >
                            Certify Record & Trigger Briefing
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">No scan performed yet for this appeal.</p>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-4">
                  <span className="text-xs font-bold text-slate-700">Certification Status</span>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">OALJ Decision</span>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Hearing Transcripts</span>
                      {selectedCase.appealData?.recordStatus === 'Certified' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Exhibits (DX/CX)</span>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Briefing Schedule Engine */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Briefing Schedule Engine</h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Calendar size={12} />
                  Calculated based on Certification Date
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Petitioner Brief', date: selectedCase.appealData?.briefingSchedule?.petitionerBriefDue, icon: ArrowUpRight, color: 'blue' },
                  { label: 'Respondent Brief', date: selectedCase.appealData?.briefingSchedule?.respondentBriefDue, icon: ArrowLeft, color: 'slate' },
                  { label: 'Reply Brief', date: selectedCase.appealData?.briefingSchedule?.replyBriefDue, icon: RefreshCw, color: 'indigo' },
                ].map((b, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <b.icon size={14} className={`text-${b.color}-500`} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{b.label}</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">{b.date || 'TBD'}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Due by 5:00 PM ET</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Calendar Conflict Check</div>
                    <p className="text-[10px] text-slate-500">System auto-adjusted 2 dates to next business day due to Federal Holidays.</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-[10px] text-blue-600">View Calendar</Button>
              </div>
            </Card>

            {/* Smart Findings (Appellate Filter) */}
            <Card className="p-6 bg-slate-900 text-white">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Scale size={14} /> Smart Findings: Appellate Filter
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedCase.appealData?.findings?.timeliness?.status === 'Timely' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Timeliness Check</div>
                    <p className="text-xs text-slate-400 mt-1">{selectedCase.appealData?.findings?.timeliness?.details}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedCase.appealData?.findings?.crossAppeal?.detected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    <RefreshCw size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Cross-Appeal Detection</div>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedCase.appealData?.findings?.crossAppeal?.detected 
                        ? `System detected a separate Notice of Appeal for the same OALJ Case (${selectedCase.appealData.findings.crossAppeal.relatedCase}). Recommendation: Consolidate.`
                        : 'No related appeals detected for this OALJ record.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedCase.appealData?.findings?.standing?.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Standing Verification</div>
                    <p className="text-xs text-slate-400 mt-1">{selectedCase.appealData?.findings?.standing?.details}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar: Role-Specific Data & Actions */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Board Assignment</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Lead Judge</label>
                  <div className="text-sm font-bold text-slate-800 mt-1">{selectedCase.appealData?.leadJudge || 'Unassigned'}</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Board Panel</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCase.appealData?.panel?.map((j, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 rounded text-[10px] font-medium text-slate-600 border border-slate-200">
                        {j}
                      </span>
                    )) || <span className="text-xs text-slate-400 italic">No panel assigned</span>}
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="w-full mt-2">Modify Panel</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Parties of Record</h3>
              <div className="space-y-4">
                {selectedCase.serviceList.map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{p.name}</div>
                      <div className="text-[10px] text-slate-500">{p.role}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ExternalLink size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-amber-200 bg-amber-50/30">
              <h3 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-4">Pending Motions</h3>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-amber-100 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-amber-700">Motion for Extension</span>
                    <Badge variant="warning">Consented</Badge>
                  </div>
                  <p className="text-[10px] text-slate-600">Requested: Mar 30, 2026</p>
                  <p className="text-[10px] text-slate-500 mt-1 italic">Reason: Workload / Medical</p>
                  <div className="mt-3 flex gap-2">
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="flex-1 h-7 text-[10px]"
                      onClick={() => {
                        const newDate = '2026-04-30';
                        setCases(prev => prev.map(c => {
                          if (c.id === selectedCase.id) {
                            const updated = {
                              ...c,
                              appealData: {
                                ...c.appealData!,
                                briefingSchedule: {
                                  ...c.appealData!.briefingSchedule!,
                                  petitionerBriefDue: newDate
                                }
                              }
                            };
                            setSelectedCase(updated);
                            return updated;
                          }
                          return c;
                        }));
                        alert(`Motion Auto-Granted. New Petitioner Brief Due: ${newDate}`);
                      }}
                    >
                      Auto-Grant
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1 h-7 text-[10px]">Review</Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-blue-200 bg-blue-50/30">
              <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">Remand Logic</h3>
              <p className="text-[10px] text-slate-600 mb-4">
                Sending this case back to OALJ will re-open the original docket and place it on the ALJ's priority list.
              </p>
              <Button 
                variant="danger" 
                size="sm" 
                className="w-full" 
                onClick={() => handleRemand(selectedCase.id)}
                disabled={selectedCase.status === 'Remanded'}
              >
                <RefreshCw size={14} /> {selectedCase.status === 'Remanded' ? 'Case Remanded' : 'Trigger Remand Loop'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Scale className="text-white" size={20} />
              </div>
              <span className="font-bold text-slate-900 tracking-tight">Appellate Board Portal</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button className={`text-sm font-medium ${view === 'dashboard' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`} onClick={() => setView('dashboard')}>Dashboard</button>
              <button className="text-sm font-medium text-slate-500 hover:text-slate-900">Reports</button>
              <button className="text-sm font-medium text-slate-500 hover:text-slate-900">Calendar</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search cases..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
              <User size={18} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'dashboard' && <Dashboard />}
            {view === 'intake' && <IntakeView />}
            {view === 'case-detail' && <CaseDetailView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
