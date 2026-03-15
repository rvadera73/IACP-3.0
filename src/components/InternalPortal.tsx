import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FilePlus, 
  UserPlus, 
  Clock, 
  MessageSquare, 
  PenTool, 
  History, 
  Activity, 
  Users, 
  Search, 
  Bell, 
  LogOut, 
  ChevronRight, 
  MoreVertical, 
  Filter, 
  Download, 
  Plus, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  Gavel,
  Shield,
  Scale,
  ExternalLink,
  ArrowLeft,
  Settings,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  MessageSquare as MessageIcon,
  FileCheck,
  Sparkles,
  History as HistoryIcon,
  Save,
  Send,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge, cn } from './UI';
import { Case, CaseStatus, CaseType, CasePhase } from '../types';
import { CASE_TYPES, PHASES } from '../constants';
import { MOCK_CASES } from '../data/mockCases';

// --- Components ---

const PHASES_ORDER: CasePhase[] = ['Intake', 'Assignment', 'Pre-Hearing', 'Hearing', 'Decision', 'Post-Decision'];

function LifecycleStepper({ currentPhase }: { currentPhase: CasePhase }) {
  const currentIndex = PHASES_ORDER.indexOf(currentPhase);

  return (
    <div className="flex items-center w-full mb-12 px-4 relative">
      {PHASES_ORDER.map((phase, index) => (
        <React.Fragment key={phase}>
          <div className="flex flex-col items-center relative z-10 flex-1">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold border-2 transition-all duration-500",
              index <= currentIndex 
                ? "bg-dol-blue-50 border-dol-blue-50 text-white shadow-lg shadow-blue-200" 
                : "bg-white border-slate-200 text-slate-400"
            )}>
              {index < currentIndex ? <CheckCircle2 size={20} /> : index + 1}
            </div>
            <div className="absolute -bottom-7 flex flex-col items-center">
              <span className={cn(
                "whitespace-nowrap text-[10px] font-bold uppercase tracking-wider transition-colors duration-500",
                index <= currentIndex ? "text-dol-blue-50" : "text-slate-400"
              )}>
                {phase}
              </span>
              {index === currentIndex && (
                <motion.div 
                  layoutId="active-dot"
                  className="w-1 h-1 bg-dol-blue-50 rounded-full mt-1"
                />
              )}
            </div>
          </div>
          {index < PHASES_ORDER.length - 1 && (
            <div className="flex-grow h-[2px] mx-[-20px] relative top-[-14px]">
              <div className="absolute inset-0 bg-slate-200" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: index < currentIndex ? '100%' : '0%' }}
                className="absolute inset-0 bg-dol-blue-50 origin-left transition-all duration-700"
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Appeals Lifecycle Tracker Component
function AppealsLifecycleTracker({ caseData }: { caseData: Case }) {
  const stages = ['Filed', 'Record Tx\'d', 'Review', 'Outcome', 'Closed'];
  
  // Calculate current stage based on appeal status and briefing schedule
  const getCurrentStage = () => {
    if (caseData.status === 'Decided' || caseData.appealData?.disposition) {
      return caseData.appealData?.disposition === 'Remanded' ? 4 : 4; // Closed/New Decision
    }
    if (caseData.status === 'Under Consideration' || caseData.status === 'Oral Argument Scheduled') {
      return 3; // Outcome
    }
    if (caseData.status === 'Briefing') {
      return 2; // Review
    }
    if (caseData.appealData?.briefingSchedule?.petitionerFiledAt) {
      return 1; // Record Transmitted
    }
    return 0; // Filed
  };

  const currentStage = getCurrentStage();

  return (
    <div className="w-full">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mb-6 text-center">
        {caseData.division} Appeal Lifecycle
      </div>
      <div className="flex items-center gap-2">
        {stages.map((stage, index) => (
          <React.Fragment key={stage}>
            <div className="flex-1 text-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all mx-auto",
                index <= currentStage
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "bg-white border-slate-200 text-slate-400"
              )}>
                {index < currentStage ? <CheckCircle2 size={14} /> : index + 1}
              </div>
              <div className={cn(
                "text-[9px] font-bold uppercase tracking-wider mt-2",
                index <= currentStage ? "text-emerald-600" : "text-slate-400"
              )}>
                {stage}
              </div>
              {index === currentStage && (
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1 mx-auto" />
              )}
            </div>
            {index < stages.length - 1 && (
              <div className="flex-grow h-[2px] relative top-[-12px]">
                <div className="absolute inset-0 bg-slate-200" />
                <div
                  className={cn(
                    "absolute inset-0 transition-all duration-700",
                    index < currentStage ? "bg-emerald-500" : "bg-emerald-500 w-0"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Appeal Details */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-dol-blue-50" />
          <h4 className="text-[12px] font-bold text-dol-blue-50 uppercase tracking-wider">Appeal Details</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-[11px]">
          <div>
            <div className="text-slate-500 mb-1">Original Case</div>
            <div className="font-mono text-dol-blue-50">{caseData.appealData?.originalCaseNumber || 'N/A'}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Decision Below</div>
            <div className="text-slate-700">{caseData.appealData?.dateOfDecisionBelow || 'N/A'}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Appealing Party</div>
            <div className="text-slate-700">{caseData.appealData?.appealingParty || 'N/A'}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Basis for Appeal</div>
            <div className="text-slate-700 truncate">{caseData.appealData?.basisForAppeal || 'N/A'}</div>
          </div>
        </div>
        {caseData.appealData?.briefingSchedule && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="text-slate-500 text-[10px] uppercase font-bold mb-2">Briefing Schedule</div>
            <div className="grid grid-cols-3 gap-3 text-[11px]">
              <div>
                <div className="text-slate-400">Petitioner Brief</div>
                <div className={cn(
                  "font-mono",
                  caseData.appealData?.briefingSchedule?.petitionerFiledAt ? "text-emerald-600" : "text-amber-600"
                )}>
                  {caseData.appealData.briefingSchedule.petitionerBriefDue}
                  {caseData.appealData.briefingSchedule.petitionerFiledAt && ' ✓'}
                </div>
              </div>
              <div>
                <div className="text-slate-400">Respondent Brief</div>
                <div className={cn(
                  "font-mono",
                  caseData.appealData?.briefingSchedule?.respondentFiledAt ? "text-emerald-600" : "text-slate-700"
                )}>
                  {caseData.appealData.briefingSchedule.respondentBriefDue}
                  {caseData.appealData.briefingSchedule.respondentFiledAt && ' ✓'}
                </div>
              </div>
              <div>
                <div className="text-slate-400">Reply Brief</div>
                <div className="font-mono text-slate-700">
                  {caseData.appealData.briefingSchedule.replyBriefDue || 'TBD'}
                </div>
              </div>
            </div>
          </div>
        )}
        {caseData.appealData?.disposition && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-bold text-emerald-600">
                {caseData.appealData.disposition === 'Affirmed' ? 'Decision Affirmed' : caseData.appealData.disposition}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InternalPortal() {
  const { user, logout } = useAuth();
  const [view, setView] = useState<string>('dashboard');
  const [cases, setCases] = useState<Case[]>(MOCK_CASES);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isNewFilingOpen, setIsNewFilingOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [activeHearing, setActiveHearing] = useState<Case | null>(null);
  const [activeDecisionDraft, setActiveDecisionDraft] = useState<Case | null>(null);

  const handleSelectCase = (c: Case) => {
    setSelectedCase(c);
    setView('casedetail');
    setAnalysisResult(null);
  };

  const handleGenerateAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult("Based on the medical evidence filed on Feb 12, there is a high probability of meeting the 15-year presumption criteria. The claimant's pulmonary function tests show severe impairment (FEV1 < 60% predicted), and the employment history confirms 17 years of underground coal mine employment.");
    }, 2000);
  };

  const handleViewRecord = (docName?: string) => {
    setActiveDoc(docName || "Full Case Record - " + selectedCase?.caseNumber);
    setIsDocViewerOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}

      <aside className="w-[260px] bg-slate-900 flex flex-col flex-shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-dol-blue-50 rounded-lg flex items-center justify-center">
            <Scale className="text-white w-5 h-5" />
          </div>
          <span className="font-serif text-[18px] font-bold tracking-tight text-white">IACP Portal</span>
        </div>

        <nav className="flex-grow overflow-y-auto py-2">
          <div className="px-4 mb-4">
            <div className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400 px-2 mb-2">Overview</div>
            <NavItem 
              icon={<LayoutDashboard size={16} />} 
              label="Dashboard" 
              active={view === 'dashboard'} 
              onClick={() => setView('dashboard')} 
            />
            <NavItem 
              icon={<Briefcase size={16} />} 
              label="All Cases" 
              active={view === 'cases'} 
              onClick={() => setView('cases')} 
            />
          </div>

          <div className="px-4 mb-4">
            <div className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400 px-2 mb-2">Lifecycle</div>
            <NavItem 
              icon={<FilePlus size={16} />} 
              label="Intake & Docketing" 
              active={view === 'intake'} 
              onClick={() => setView('intake')} 
              badge="12"
              disabled={!canAccess(user?.role, 'intake')}
            />
            <NavItem 
              icon={<UserPlus size={16} />} 
              label="Assignment" 
              active={view === 'assignment'} 
              onClick={() => setView('assignment')} 
              disabled={!canAccess(user?.role, 'assignment')}
            />
            <NavItem 
              icon={<Clock size={16} />} 
              label="Pre-Hearing" 
              active={view === 'prehearing'} 
              onClick={() => setView('prehearing')} 
              badge="4"
              disabled={!canAccess(user?.role, 'prehearing')}
            />
            <NavItem 
              icon={<MessageSquare size={16} />} 
              label="Hearings" 
              active={view === 'hearing'} 
              onClick={() => setView('hearing')} 
              disabled={!canAccess(user?.role, 'hearing')}
            />
            <NavItem 
              icon={<PenTool size={16} />} 
              label="Decisions" 
              active={view === 'decision'} 
              onClick={() => setView('decision')} 
              badge="3"
              badgeColor="amber"
              disabled={!canAccess(user?.role, 'decision')}
            />
            <NavItem 
              icon={<History size={16} />} 
              label="Post-Decision" 
              active={view === 'postdecision'} 
              onClick={() => setView('postdecision')} 
              disabled={!canAccess(user?.role, 'postdecision')}
            />
          </div>

          {selectedCase && (
            <div className="px-4 mb-4">
              <div className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400 px-2 mb-2">Active Case</div>
              <NavItem 
                icon={<Search size={16} />} 
                label={selectedCase.caseNumber} 
                active={view === 'casedetail'} 
                onClick={() => setView('casedetail')} 
              />
            </div>
          )}

          <div className="px-4 mb-4">
            <div className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400 px-2 mb-2">Administration</div>
            <NavItem 
              icon={<Activity size={16} />} 
              label="Analytics" 
              active={view === 'analytics'} 
              onClick={() => setView('analytics')} 
              disabled={!canAccess(user?.role, 'analytics')}
            />
            <NavItem 
              icon={<Users size={16} />} 
              label="Workload" 
              active={view === 'workload'} 
              onClick={() => setView('workload')} 
              disabled={!canAccess(user?.role, 'workload')}
            />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-dol-blue-50 flex items-center justify-center text-[11px] font-bold text-white">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div className="flex-grow min-w-0">
              <div className="text-[12px] font-semibold text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.role}</div>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Document Viewer Modal */}
        <AnimatePresence>
          {isDocViewerOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-full flex flex-col overflow-hidden"
              >
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <FileText className="text-dol-blue-50" />
                    <h3 className="font-bold text-slate-900">{activeDoc}</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsDocViewerOpen(false)}>
                    <Plus className="rotate-45" />
                  </Button>
                </div>
                <div className="flex-grow bg-slate-200 p-12 overflow-y-auto flex justify-center">
                  <div className="bg-white w-full max-w-[800px] min-h-[1000px] shadow-lg p-16 flex flex-col gap-8">
                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8">
                      <div className="space-y-1">
                        <div className="font-serif text-xl font-bold">U.S. DEPARTMENT OF LABOR</div>
                        <div className="text-sm font-medium">Office of Administrative Law Judges</div>
                      </div>
                      <div className="text-right text-sm">
                        <div>Case No: {selectedCase?.caseNumber}</div>
                        <div>Date: {new Date().toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex gap-8">
                        <div className="w-1/2 font-bold uppercase">{selectedCase?.claimant.name}</div>
                        <div className="w-1/2 text-right">Claimant</div>
                      </div>
                      <div className="text-center font-bold">v.</div>
                      <div className="flex gap-8">
                        <div className="w-1/2 font-bold uppercase">{selectedCase?.employer.name}</div>
                        <div className="w-1/2 text-right">Employer</div>
                      </div>
                    </div>

                    <div className="mt-12 space-y-4">
                      <h4 className="text-center font-bold underline uppercase">{activeDoc}</h4>
                      <div className="space-y-4 text-justify leading-relaxed text-slate-800">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p>
                          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <p>
                          Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.
                        </p>
                        <div className="h-32 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 italic">
                          [Digital Signature Verified]
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
                  <Button variant="outline" onClick={() => setIsDocViewerOpen(false)}>Close</Button>
                  <Button className="bg-dol-blue-50 text-white">Download PDF</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Filing Modal */}
        <AnimatePresence>
          {isNewFilingOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsNewFilingOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-bold text-blue-600 uppercase tracking-[2px] mb-1">NEW FILING</div>
                    <h3 className="font-serif text-2xl font-bold text-slate-900">Submit New Case Filing</h3>
                    <div className="text-[12px] text-slate-500 mt-1">Unified Filing Portal · Real-time validation</div>
                  </div>
                  <button onClick={() => setIsNewFilingOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  {/* Filing Information */}
                  <div>
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-[2px] mb-4 pb-2 border-b border-slate-100">Filing Information</div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Program Type <span className="text-red-500">*</span></label>
                        <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
                          <option>Select Program...</option>
                          <option>Longshore / DBA</option>
                          <option>Black Lung</option>
                          <option>PERM / Immigration</option>
                          <option>Whistleblower</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Filing Category <span className="text-red-500">*</span></label>
                        <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
                          <option>Select Category...</option>
                          <option>Initial Claim</option>
                          <option>Appeal</option>
                          <option>Motion</option>
                          <option>Supplemental</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Claimant Name <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" placeholder="Full legal name" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">SSN (Last 4 digits) <span className="text-red-500">*</span></label>
                        <input type="text" maxLength={4} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" placeholder="____" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Respondent / Employer <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" placeholder="Company or individual name" />
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div>
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-[2px] mb-4 pb-2 border-b border-slate-100">Document Upload</div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Supporting Documents <span className="text-red-500">*</span></label>
                      <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center bg-slate-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        <div className="text-4xl mb-2">📁</div>
                        <div className="text-[13px] text-slate-700 font-medium">
                          Drag & drop files here or <span className="text-blue-600">browse</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          PDF, DOC, DOCX · Max 25MB
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Description <span className="text-red-500">*</span></label>
                      <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[80px]" placeholder="Brief description of this filing..." rows={3} />
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setIsNewFilingOpen(false)}>Cancel</Button>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">Submit Filing</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="h-[64px] bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">

          <div className="flex items-center gap-4">
            <h1 className="text-[18px] font-semibold text-slate-900">
              {view === 'dashboard' ? 'Dashboard' : 
               view === 'cases' ? 'All Cases' :
               view === 'intake' ? 'Intake & Docketing' :
               view === 'assignment' ? 'Case Assignment' :
               view === 'prehearing' ? 'Pre-Hearing Management' :
               view === 'hearing' ? 'Hearing Management' :
               view === 'decision' ? 'Decision Workspace' :
               view === 'postdecision' ? 'Post-Decision Management' :
               view === 'casedetail' ? 'Case Detail' :
               view === 'analytics' ? 'Analytics' : 'Workload Management'}
            </h1>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-[12px] text-slate-500">OALJ Case Management Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search cases, parties..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-dol-blue-50 w-[280px] placeholder:text-slate-400"
              />
            </div>
            <button className="p-2 text-slate-500 hover:text-dol-blue-50 bg-white border border-slate-200 rounded-lg transition-colors">
              <Bell size={18} />
            </button>
            <Button
              className="bg-dol-blue-50 text-white hover:bg-dol-blue-60 font-bold text-[12px] px-5"
              onClick={() => setIsNewFilingOpen(true)}
            >
              <Plus size={16} className="mr-2" /> New Filing
            </Button>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-8 bg-slate-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'dashboard' && <DashboardView cases={cases} onSelectCase={handleSelectCase} />}
              {view === 'cases' && <CasesView cases={cases} onSelectCase={handleSelectCase} />}
              {view === 'intake' && <IntakeView cases={cases} onUpdateCase={(updatedCase) => setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c))} onSelectCase={handleSelectCase} />}
              {view === 'assignment' && <AssignmentView cases={cases} onSelectCase={handleSelectCase} onUpdateCase={(updatedCase) => setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c))} />}
              {view === 'prehearing' && <PreHearingView cases={cases} onSelectCase={handleSelectCase} />}
              {view === 'hearing' && (
                activeHearing ? (
                  <HearingSessionView caseData={activeHearing} onExit={() => setActiveHearing(null)} />
                ) : (
                  <HearingView cases={cases} onSelectCase={handleSelectCase} onJoinHearing={setActiveHearing} />
                )
              )}
              {view === 'decision' && (
                activeDecisionDraft ? (
                  <DecisionWorkspaceView caseData={activeDecisionDraft} onExit={() => setActiveDecisionDraft(null)} />
                ) : (
                  <DecisionView cases={cases} onSelectCase={handleSelectCase} onOpenWorkspace={setActiveDecisionDraft} />
                )
              )}
              {view === 'postdecision' && <PostDecisionView cases={cases} onSelectCase={handleSelectCase} />}
              {view === 'casedetail' && selectedCase && (
                <CaseDetailView 
                  caseData={selectedCase} 
                  isAnalyzing={isAnalyzing}
                  analysisResult={analysisResult}
                  onGenerateAnalysis={handleGenerateAnalysis}
                  onViewRecord={handleViewRecord}
                  onUpdateCase={(updatedCase) => {
                    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
                    setSelectedCase(updatedCase);
                  }}
                />
              )}
              {view === 'analytics' && <AnalyticsView cases={cases} />}
              {view === 'workload' && <WorkloadView cases={cases} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// --- Sub-components ---

function canAccess(role: string | undefined, view: string): boolean {
  if (!role) return false;
  
  // IT Admin can access everything
  if (role.includes('IT') || role.includes('Admin')) return true;

  const accessMap: Record<string, string[]> = {
    intake: ['OALJ Docket Clerk', 'OALJ Legal Assistant', 'Board Docket Clerk', 'Board Legal Assistant'],
    assignment: ['Administrative Law Judge (ALJ)', 'Board Member / Judge', 'OALJ Docket Clerk'],
    prehearing: ['Administrative Law Judge (ALJ)', 'OALJ Attorney-Advisor', 'OALJ Legal Assistant', 'Board Member / Judge', 'Board Attorney-Advisor'],
    hearing: ['Administrative Law Judge (ALJ)', 'OALJ Legal Assistant', 'Board Member / Judge', 'Board Legal Assistant'],
    decision: ['Administrative Law Judge (ALJ)', 'OALJ Attorney-Advisor', 'Board Member / Judge', 'Board Attorney-Advisor'],
    postdecision: ['OALJ Docket Clerk', 'Administrative Law Judge (ALJ)', 'Board Docket Clerk', 'Board Member / Judge'],
    analytics: ['Administrative Law Judge (ALJ)', 'Board Member / Judge'],
    workload: ['Administrative Law Judge (ALJ)', 'Board Member / Judge'],
  };

  if (!accessMap[view]) return true; // Default access for dashboard, cases, etc.
  return accessMap[view].some(r => role.includes(r));
}

function NavItem({ icon, label, active, onClick, badge, badgeColor = 'red', disabled = false }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; badge?: string; badgeColor?: 'red' | 'amber' | 'green'; disabled?: boolean }) {
  const badgeColors = {
    red: 'bg-red-500 text-white',
    amber: 'bg-amber-500 text-white',
    green: 'bg-emerald-500 text-white'
  };

  return (
    <button 
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all group relative",
        active 
          ? "text-white bg-white/10" 
          : disabled 
            ? "text-slate-600 cursor-not-allowed"
            : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <span className={cn("flex-shrink-0 transition-colors", active ? "text-white" : disabled ? "text-slate-700" : "text-slate-500 group-hover:text-slate-300")}>{icon}</span>
      <span className="truncate">{label}</span>
      {badge && !disabled && (
        <span className={cn("ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[18px] text-center", badgeColors[badgeColor])}>
          {badge}
        </span>
      )}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dol-blue-50 rounded-r-full" />
      )}
    </button>
  );
}

function DashboardView({ cases, onSelectCase }: { cases: Case[]; onSelectCase: (c: Case) => void }) {
  const recentCases = [...cases].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const intakeCount = cases.filter(c => c.phase === 'Intake').length;
  const hearingCount = cases.filter(c => c.phase === 'Hearing').length;
  const slaBreachCount = cases.filter(c => c.status === 'SLA Breach' || c.slaStatus === 'Overdue').length;
  const decisionCount = cases.filter(c => c.phase === 'Decision').length;
  
  // Phase counts for pipeline
  const phaseCounts = {
    'Intake': cases.filter(c => c.phase === 'Intake').length,
    'Assignment': cases.filter(c => c.phase === 'Assignment').length,
    'Pre-Hearing': cases.filter(c => c.phase === 'Pre-Hearing').length,
    'Hearing': cases.filter(c => c.phase === 'Hearing').length,
    'Decision': cases.filter(c => c.phase === 'Decision').length,
    'Post-Decision': cases.filter(c => c.phase === 'Post-Decision').length,
  };

  // Case type distribution
  const caseTypeDist = {
    'Longshore': cases.filter(c => c.caseType === 'LHC' || c.caseType === 'DBA').length,
    'Black Lung': cases.filter(c => c.caseType === 'BLA').length,
    'Whistleblower': cases.filter(c => c.caseType === 'WB').length,
    'PERM': cases.filter(c => c.caseType === 'PER').length,
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards - Matching OALJ Mockup */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white border-slate-200 p-4 border-l-4 border-l-blue-600">
          <div className="text-2xl font-bold text-slate-900">1,847</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Active Cases</div>
          <div className="text-[9px] text-emerald-600 font-bold mt-2">↑ 3.2% vs last month</div>
        </Card>
        <Card className="bg-white border-slate-200 p-4 border-l-4 border-l-emerald-500">
          <div className="text-2xl font-bold text-slate-900">94</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Decisions This Month</div>
          <div className="text-[9px] text-emerald-600 font-bold mt-2">↑ 12% vs target</div>
        </Card>
        <Card className="bg-white border-slate-200 p-4 border-l-4 border-l-amber-500">
          <div className="text-2xl font-bold text-slate-900">{slaBreachCount}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">SLA Warnings</div>
          <div className="text-[9px] text-red-600 font-bold mt-2">↑ 4 since last week</div>
        </Card>
        <Card className="bg-white border-slate-200 p-4 border-l-4 border-l-red-500">
          <div className="text-2xl font-bold text-slate-900">{slaBreachCount}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Overdue Actions</div>
          <div className="text-[9px] text-slate-400 font-bold mt-2">Requires attention</div>
        </Card>
        <Card className="bg-white border-slate-200 p-4 border-l-4 border-l-purple-500">
          <div className="text-2xl font-bold text-slate-900">142</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Hearings Scheduled</div>
          <div className="text-[9px] text-slate-400 font-bold mt-2">Next 30 days</div>
        </Card>
      </div>

      {/* Pipeline - Cases by Phase */}
      <Card className="bg-white border-slate-200 p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-[14px] font-bold text-slate-900">Cases by Lifecycle Phase</h3>
        </div>
        <div className="p-4">
          <div className="flex rounded-lg overflow-hidden border border-slate-200">
            {Object.entries(phaseCounts).map(([phase, count], idx) => {
              const isActive = phase === 'Pre-Hearing' || phase === 'Hearing' || phase === 'Decision';
              const isDone = phase === 'Intake' || phase === 'Assignment';
              return (
                <div
                  key={phase}
                  className={`flex-1 text-center py-3 border-r border-slate-200 last:border-r-0 cursor-pointer transition-colors ${
                    isActive ? 'bg-blue-50 text-dol-blue-50' : isDone ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'
                  } hover:bg-blue-100`}
                >
                  <div className="text-[9px] font-bold uppercase text-slate-400">Phase {idx + 1}</div>
                  <div className="text-[12px] font-bold">{phase}</div>
                  <div className="text-[16px] font-serif font-bold mt-1">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-white border-slate-200 p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-[14px] font-bold text-slate-900">Recent System Activity</h3>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[12px] font-bold">✓</div>
              <div>
                <div className="text-[13px] font-bold text-slate-900">Decision Issued — LCA-2024-00831</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Auto-published to OALJ.DOL.GOV · All parties notified</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Today, 10:42 AM · Hon. Martinez</div>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[12px] font-bold">✓</div>
              <div>
                <div className="text-[13px] font-bold text-slate-900">New Filing Auto-Docketed — BLA-2024-01204</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Black Lung · Assigned to Pittsburgh District Office</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Today, 09:17 AM · Auto-system</div>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 text-[12px] font-bold">⚡</div>
              <div>
                <div className="text-[13px] font-bold text-slate-900">SLA Alert — Decision Overdue · DBA-2024-00612</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Record closed 47 days ago · Target: 45 days</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Requires review · Hon. Rivera</div>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[12px] font-bold">✓</div>
              <div>
                <div className="text-[13px] font-bold text-slate-900">Settlement Reached — WB-2024-00743</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Agreement uploaded · Presiding judge auto-notified</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Yesterday, 2:15 PM · Hon. Chen</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column - Charts */}
        <div className="space-y-4">
          {/* Case Type Distribution */}
          <Card className="bg-white border-slate-200 p-4">
            <h3 className="text-[14px] font-bold text-slate-900 mb-4">Active Cases by Program</h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full relative" style={{
                background: `conic-gradient(#059669 0% 39%, #f59e0b 39% 57%, #dc2626 57% 68%, #64748b 68% 100%)`
              }}>
                <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center text-[14px] font-bold text-slate-900">
                  {cases.length}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="w-3 h-3 rounded-sm bg-emerald-600"></div>
                  <span className="text-slate-600">Longshore / DBA</span>
                  <span className="font-bold text-slate-900 ml-auto">{caseTypeDist['Longshore']}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="w-3 h-3 rounded-sm bg-amber-500"></div>
                  <span className="text-slate-600">Black Lung</span>
                  <span className="font-bold text-slate-900 ml-auto">{caseTypeDist['Black Lung']}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="w-3 h-3 rounded-sm bg-red-600"></div>
                  <span className="text-slate-600">PERM / Immigration</span>
                  <span className="font-bold text-slate-900 ml-auto">{caseTypeDist['PERM']}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="w-3 h-3 rounded-sm bg-slate-500"></div>
                  <span className="text-slate-600">Whistleblower</span>
                  <span className="font-bold text-slate-900 ml-auto">{caseTypeDist['Whistleblower']}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* SLA Compliance */}
          <Card className="bg-white border-slate-200 p-4">
            <h3 className="text-[14px] font-bold text-slate-900 mb-4">SLA Compliance — This Month</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Decisions on time</span>
                  <span className="text-emerald-600 font-bold">87%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: '87%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Hearing notices sent ≥21 days</span>
                  <span className="text-emerald-600 font-bold">98%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Transcripts received ≤30 days</span>
                  <span className="text-amber-600 font-bold">74%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '74%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Auto-docketing accuracy</span>
                  <span className="text-emerald-600 font-bold">99.4%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: '99%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CasesView({ cases, onSelectCase }: { cases: Case[]; onSelectCase: (c: Case) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
            <Filter size={16} className="mr-2" /> Filter
          </Button>
          <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
            <Download size={16} className="mr-2" /> Export
          </Button>
        </div>
        <div className="text-[12px] text-slate-500">Showing {cases.length} of 1,284 cases</div>
      </div>

      <Card className="bg-white border-slate-200 p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Case Number</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Parties</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Phase</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Judge</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Deadline</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onSelectCase(c)}>
                <td className="px-6 py-4">
                  <div className="text-[13px] font-bold text-dol-blue-50">{c.caseNumber}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">{c.caseType}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[13px] text-slate-900">{c.claimant.name}</div>
                  <div className="text-[11px] text-slate-500">vs {c.employer.name}</div>
                </td>
                <td className="px-6 py-4">
                  <Badge className="bg-slate-100 border-slate-200 text-slate-700 text-[10px]">{c.phase}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={c.slaStatus === 'Overdue' ? 'error' : 'success'} className="text-[10px]">{c.status}</Badge>
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-700">{c.judge || 'Unassigned'}</td>
                <td className="px-6 py-4">
                  <div className="text-[12px] font-medium text-slate-900">{c.statutoryDeadline}</div>
                  <div className="text-[10px] text-slate-500 uppercase">270-Day Target</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-dol-blue-50 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function IntakeView({ cases, onUpdateCase, onSelectCase }: { cases: Case[]; onUpdateCase: (c: Case) => void; onSelectCase: (c: Case) => void }) {
  const [isDeficiencyModalOpen, setIsDeficiencyModalOpen] = useState(false);
  const [selectedIntakeCase, setSelectedIntakeCase] = useState<Case | null>(null);
  const [deficiencyReason, setDeficiencyReason] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'portal' | 'email' | 'api'>('all');

  const intakeCases = cases.filter(c => c.phase === 'Intake');
  const autoVerifiedCount = intakeCases.filter(c => c.status === 'Auto-Docketed').length;
  const deficiencyCount = intakeCases.filter(c => c.status === 'Deficient').length;

  // Mock data for filing channels (from HTML mockup)
  const filingChannels = [
    { id: 'portal', name: 'Unified Filing Portal', icon: '🌐', status: 'Live', count: 31, description: 'Real-time · Auto-validated' },
    { id: 'email', name: 'Email / Fax Auto-Gateway', icon: '📧', status: 'Live', count: 5, description: 'OCR processed · Auto-ingested' },
    { id: 'api', name: 'Agency API (OWCP / OFLC)', icon: '🔗', status: 'Live', count: 2, description: 'Real-time sync · Zero-lag' },
  ];

  // Mock validation queue data (from HTML mockup)
  const validationQueue = [
    { id: 'DRAFT-4421', issue: 'Missing respondent address', status: 'Awaiting' as const },
    { id: 'DRAFT-4418', issue: 'Incomplete injury date', status: 'Awaiting' as const },
    { id: 'DRAFT-4415', issue: 'Missing employer EIN', status: 'Resolved' as const },
    { id: 'DRAFT-4409', issue: 'Duplicate filing detected', status: 'Review' as const },
  ];

  const handleDocket = (c: Case) => {
    onUpdateCase({
      ...c,
      phase: 'Assignment',
      status: 'Docketed',
      createdAt: new Date().toISOString().split('T')[0]
    });
    alert(`Case ${c.caseNumber} has been docketed and moved to Assignment.`);
  };

  const handleMarkDeficient = (c: Case) => {
    setSelectedIntakeCase(c);
    setIsDeficiencyModalOpen(true);
  };

  const submitDeficiency = () => {
    if (selectedIntakeCase) {
      onUpdateCase({
        ...selectedIntakeCase,
        status: 'Deficient',
        pendingActions: [...(selectedIntakeCase.pendingActions || []), `Deficiency: ${deficiencyReason}`]
      });
      setIsDeficiencyModalOpen(false);
      setDeficiencyReason('');
      alert(`Case ${selectedIntakeCase.caseNumber} marked as deficient.`);
    }
  };

  const filteredChannels = selectedChannel === 'all' 
    ? filingChannels 
    : filingChannels.filter(ch => ch.id === selectedChannel);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-200 p-6 border-l-4 border-l-emerald-500">
          <div className="text-3xl font-bold text-slate-900 mb-1">38</div>
          <div className="text-[11px] text-slate-500 font-medium">Pending Docketing</div>
          <div className="text-[9px] text-slate-400 font-bold mt-2">Auto-processing</div>
        </Card>
        <Card className="bg-white border-slate-200 p-6 border-l-4 border-l-amber-500">
          <div className="text-3xl font-bold text-slate-900 mb-1">4</div>
          <div className="text-[11px] text-slate-500 font-medium">Validation Errors</div>
          <div className="text-[9px] text-red-600 font-bold mt-2">Deficiency notices sent</div>
        </Card>
        <Card className="bg-white border-slate-200 p-6 border-l-4 border-l-blue-600">
          <div className="text-3xl font-bold text-slate-900 mb-1">99.4%</div>
          <div className="text-[11px] text-slate-500 font-medium">Auto-Docket Rate</div>
          <div className="text-[9px] text-emerald-600 font-bold mt-2">↑ from 0% AS-IS</div>
        </Card>
      </div>

      {/* Alert Bar */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 text-amber-800">
        <span className="text-xl">⚠</span>
        <span className="text-[13px] font-medium">4 filings require deficiency resolution — notices sent automatically</span>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filing Channels */}
        <Card className="bg-white border-slate-200 p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-[14px] font-bold text-slate-900">Filing Channels — Today</h3>
          </div>
          <div className="p-4 space-y-3">
            {filingChannels.map((channel) => (
              <div
                key={channel.id}
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedChannel === channel.id 
                    ? 'bg-blue-50 border-blue-300' 
                    : selectedChannel === 'all'
                      ? 'bg-slate-50 border-slate-200 hover:border-blue-300'
                      : 'bg-slate-50 border-slate-200 opacity-50'
                }`}
                onClick={() => setSelectedChannel(selectedChannel === channel.id ? 'all' : channel.id as any)}
              >
                <span className="text-3xl">{channel.icon}</span>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-slate-900">{channel.name}</div>
                  <div className="text-[11px] text-slate-500">{channel.description}</div>
                </div>
                <div className="text-right">
                  <Badge variant="success" className="text-[10px]">● {channel.status}</Badge>
                  <div className="text-[14px] font-mono font-bold text-emerald-600 mt-1">{channel.count} filings</div>
                </div>
              </div>
            ))}
          </div>
          {selectedChannel !== 'all' && (
            <div className="p-3 bg-blue-50 border-t border-blue-100 text-center">
              <button 
                className="text-[12px] text-blue-600 font-medium hover:underline"
                onClick={() => setSelectedChannel('all')}
              >
                Show all channels
              </button>
            </div>
          )}
        </Card>

        {/* Validation Queue */}
        <Card className="bg-white border-slate-200 p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-[14px] font-bold text-slate-900">Validation Queue</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Filing ID</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Issue</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {validationQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-mono font-bold text-blue-600">{item.id}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-700">{item.issue}</td>
                  <td className="px-4 py-3">
                    <Badge 
                      variant={item.status === 'Resolved' ? 'success' : item.status === 'Review' ? 'error' : 'warning'}
                      className="text-[10px]"
                    >
                      {item.status === 'Resolved' ? '✓ ' : ''}{item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Intake Queue Table */}
      <Card className="bg-white border-slate-200 p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-slate-900">Intake Queue</h3>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">Process All Auto-Verified</Button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Submission ID</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Type</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Claimant</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">AI Findings</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {intakeCases.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onSelectCase(c)}>
                <td className="px-6 py-4 text-[13px] font-bold text-blue-600">{c.caseNumber}</td>
                <td className="px-6 py-4 text-[13px] text-slate-700">{c.caseType}</td>
                <td className="px-6 py-4 text-[13px] text-slate-700">{c.claimant.name}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" title="Identity Verified"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" title="Timeliness Check Passed"></div>
                    <div className={`w-2 h-2 rounded-full ${c.status === 'Deficient' ? 'bg-red-500' : 'bg-amber-500'}`} title={c.status === 'Deficient' ? "Deficiency Detected" : "Possible Redaction Needed"}></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={c.status === 'Deficient' ? 'error' : c.status === 'Auto-Docketed' ? 'success' : 'warning'}
                    className="text-[10px]"
                  >
                    {c.status === 'Deficient' ? 'Deficient' : c.status === 'Auto-Docketed' ? 'Auto-Verified' : 'Awaiting Review'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDocket(c);
                      }}
                    >
                      <Check size={14} className="mr-1" /> Docket
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-amber-200 text-amber-700 hover:bg-amber-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkDeficient(c);
                      }}
                    >
                      <AlertTriangle size={14} className="mr-1" /> Deficiency
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Deficiency Modal */}
      <AnimatePresence>
        {isDeficiencyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Record Deficiency</h3>
                <button onClick={() => setIsDeficiencyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
                  <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                  <div className="text-[13px] text-amber-800">
                    Marking this case as deficient will notify the filing party and pause the docketing process.
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Deficiency Reason</label>
                  <textarea
                    className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-dol-blue-50/20"
                    placeholder="Describe the deficiency (e.g., Missing signature on Form CM-911, SSN mismatch...)"
                    value={deficiencyReason}
                    onChange={(e) => setDeficiencyReason(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="auto-notice" defaultChecked className="rounded border-slate-300 text-dol-blue-50 focus:ring-dol-blue-50" />
                  <label htmlFor="auto-notice" className="text-[12px] text-slate-600">Send automated notice to parties</label>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsDeficiencyModalOpen(false)}>Cancel</Button>
                <Button
                  className="bg-amber-600 text-white hover:bg-amber-700"
                  disabled={!deficiencyReason.trim()}
                  onClick={submitDeficiency}
                >
                  Confirm Deficiency
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AssignmentView({ cases, onSelectCase, onUpdateCase }: { cases: Case[]; onSelectCase: (c: Case) => void; onUpdateCase: (c: Case) => void }) {
  const unassignedCases = cases.filter(c => c.phase === 'Assignment' && !c.judge);
  
  const handleAssign = (c: Case) => {
    const judges = ['Hon. Sarah Jenkins', 'Hon. Michael Chen', 'Hon. Elena Rodriguez', 'Hon. David Thompson'];
    const randomJudge = judges[Math.floor(Math.random() * judges.length)];
    
    onUpdateCase({
      ...c,
      judge: randomJudge,
      phase: 'Pre-Hearing',
      status: 'Assigned'
    });
    alert(`Case ${c.caseNumber} has been assigned to ${randomJudge} and moved to Pre-Hearing.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-slate-900">Unassigned Cases</h3>
        <Button className="bg-dol-blue-50 text-white">Auto-Assign All</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unassignedCases.map(c => (
              <div key={c.id}>
                <Card className="bg-white border-slate-200 p-6 hover:border-dol-blue-50 transition-all cursor-pointer group" onClick={() => onSelectCase(c)}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[14px] font-bold text-dol-blue-50">{c.caseNumber}</span>
                    <Badge className="bg-slate-100 text-slate-600 text-[10px]">{c.caseType}</Badge>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Claimant</div>
                      <div className="text-[13px] text-slate-900">{c.claimant.name}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Division</div>
                      <div className="text-[13px] text-slate-900">{c.division}</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-grow bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssign(c);
                      }}
                    >
                      Assign Judge
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-dol-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(c);
                      }}
                    >
                      Details
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
            {unassignedCases.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 italic">
                No unassigned cases found in the queue.
              </div>
            )}
      </div>
    </div>
  );
}

function PreHearingView({ cases, onSelectCase }: { cases: Case[]; onSelectCase: (c: Case) => void }) {
  const preHearingCases = cases.filter(c => c.phase === 'Pre-Hearing');
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <StatCard label="Motions Pending" value="18" trend="+4" color="amber" />
        <StatCard label="Discovery Deadlines" value="12" trend="0" color="blue" />
        <StatCard label="Pre-Hearing Conf." value="5" trend="-2" color="emerald" />
        <StatCard label="Overdue Responses" value="2" trend="+1" color="red" />
      </div>

      <Card className="bg-white border-slate-200 p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-slate-900">Active Pre-Hearing Tasks</h3>
          <Button size="sm" className="bg-dol-blue-50 text-white">Schedule Conference</Button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Case Number</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Claimant</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Next Deadline</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending Motions</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {preHearingCases.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onSelectCase(c)}>
                <td className="px-6 py-4 text-[13px] font-bold text-dol-blue-50">{c.caseNumber}</td>
                <td className="px-6 py-4 text-[13px] text-slate-700">{c.claimant.name}</td>
                <td className="px-6 py-4 text-[13px] text-slate-500">Mar 15, 2024</td>
                <td className="px-6 py-4">
                  <Badge variant="warning" className="text-[10px]">2 Motions</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-dol-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCase(c);
                    }}
                  >
                    Manage
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function HearingView({ cases, onSelectCase, onJoinHearing }: { cases: Case[]; onSelectCase: (c: Case) => void; onJoinHearing: (c: Case) => void }) {
  const hearingCases = cases.filter(c => c.phase === 'Hearing');
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-slate-900">Hearing Calendar</h3>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white border-slate-200 text-slate-700">Day</Button>
          <Button variant="outline" className="bg-white border-slate-200 text-slate-700">Week</Button>
          <Button className="bg-dol-blue-50 text-white">Month</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {hearingCases.map(c => (
            <div key={c.id}>
              <Card className="bg-white border-slate-200 p-6 hover:border-dol-blue-50 transition-all cursor-pointer" onClick={() => onSelectCase(c)}>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex flex-col items-center justify-center border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">May</span>
                      <span className="text-[18px] font-bold text-dol-blue-50">15</span>
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-slate-900">{c.caseNumber}</div>
                      <div className="text-[13px] text-slate-500">{c.claimant.name} vs {c.employer.name}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock size={12} /> 10:00 AM EST
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin size={12} /> {c.hearingFormat}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-dol-blue-50 text-white hover:bg-dol-blue-60"
                    onClick={(e) => {
                      e.stopPropagation();
                      onJoinHearing(c);
                    }}
                  >
                    Join Session
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <Card className="bg-white border-slate-200 p-6">
          <h3 className="text-[16px] font-bold text-slate-900 mb-6">Hearing Logistics</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-500">Court Reporters Assigned</span>
              <span className="text-[13px] text-slate-900 font-bold">100%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-500">Interpreter Requests</span>
              <span className="text-[13px] text-slate-900 font-bold">2 Pending</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-500">Exhibits Pre-Marked</span>
              <span className="text-[13px] text-slate-900 font-bold">85%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DecisionView({ cases, onSelectCase, onOpenWorkspace }: { cases: Case[]; onSelectCase: (c: Case) => void; onOpenWorkspace: (c: Case) => void }) {
  const decisionCases = cases.filter(c => c.phase === 'Decision');
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-200 p-6">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Drafting in Progress</div>
          <div className="text-3xl font-bold text-slate-900">24</div>
        </Card>
        <Card className="bg-white border-slate-200 p-6">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Awaiting Judge Review</div>
          <div className="text-3xl font-bold text-slate-900">8</div>
        </Card>
        <Card className="bg-white border-slate-200 p-6">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Ready for Issuance</div>
          <div className="text-3xl font-bold text-slate-900">12</div>
        </Card>
      </div>

      <Card className="bg-white border-slate-200 p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-slate-900">Decision Workspace</h3>
          <Button size="sm" className="bg-dol-blue-50 text-white">New Draft</Button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Case</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Draft Type</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Assigned To</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Last Modified</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {decisionCases.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onSelectCase(c)}>
                <td className="px-6 py-4">
                  <div className="text-[13px] font-bold text-dol-blue-50">{c.caseNumber}</div>
                  <div className="text-[11px] text-slate-500">{c.claimant.name}</div>
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-700">D&O (Benefits Granted)</td>
                <td className="px-6 py-4 text-[13px] text-slate-700">Clerk Sarah Wong</td>
                <td className="px-6 py-4 text-[13px] text-slate-500">2h ago</td>
                <td className="px-6 py-4">
                  <Badge variant="warning" className="text-[10px]">In Review</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    size="sm" 
                    className="bg-dol-blue-50 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenWorkspace(c);
                    }}
                  >
                    Open Workspace
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function PostDecisionView({ cases, onSelectCase }: { cases: Case[]; onSelectCase: (c: Case) => void }) {
  const [activeTab, setActiveTab] = useState<'Appeals' | 'Remands' | 'Fees'>('Appeals');

  // Get all Post-Decision cases
  const postDecisionCases = cases.filter(c => c.phase === 'Post-Decision');

  // Simulate different data for different tabs
  const filteredCases = useMemo(() => {
    if (activeTab === 'Appeals') {
      // Show only ARB/BRB/ECAB appellate cases (nomenclature: BOARD-CASETYPE-YYYY-NNNNN)
      return postDecisionCases.filter(c =>
        c.appealType === 'ARB' ||
        c.appealType === 'BRB' ||
        c.appealType === 'ECAB' ||
        c.division === 'ARB' ||
        c.division === 'BRB' ||
        c.division === 'ECAB' ||
        c.caseNumber.startsWith('ARB-') ||
        c.caseNumber.startsWith('BRB-') ||
        c.caseNumber.startsWith('ECAB-')
      );
    }
    if (activeTab === 'Remands') {
      // Show remanded cases (case number starts with REM- or status is Remanded)
      return postDecisionCases.filter(c =>
        c.status === 'Remanded' ||
        c.appealData?.disposition === 'Remanded' ||
        c.caseNumber.startsWith('REM-')
      );
    }
    // Fees - show fee applications
    return postDecisionCases.filter(c =>
      c.caseNumber.includes('-FEE') ||
      c.filings?.some(f => f.type === 'Fee Application')
    );
  }, [activeTab, postDecisionCases]);

  // Calculate appeal lifecycle stage (0-4): Filed, Record Tx'd, Review, Outcome, Closed
  const getAppealStage = (c: Case) => {
    if (c.status === 'Decided' || c.appealData?.disposition) return 4; // Closed/New Decision
    if (c.appealData?.disposition === 'Remanded') return 4; // New Decision
    if (c.status === 'Under Consideration' || c.status === 'Oral Argument Scheduled') return 3; // Outcome
    if (c.status === 'Briefing') return 2; // Review
    if (c.appealData?.briefingSchedule?.respondentFiledAt) return 2; // Review (briefing complete)
    if (c.appealData?.briefingSchedule?.petitionerFiledAt) return 1; // Record Transmitted
    return 0; // Filed
  };

  // Stats for Appeals tab
  const appealsStats = useMemo(() => {
    const appeals = postDecisionCases.filter(c =>
      c.appealType || c.division === 'ARB' || c.division === 'BRB' || c.division === 'ECAB' ||
      c.caseNumber.startsWith('ARB-') || c.caseNumber.startsWith('BRB-') || c.caseNumber.startsWith('ECAB-')
    );
    return {
      total: appeals.length,
      active: appeals.filter(c => c.status !== 'Decided').length,
      briefing: appeals.filter(c => c.status === 'Briefing').length,
      decided: appeals.filter(c => c.status === 'Decided').length,
      remanded: appeals.filter(c => c.appealData?.disposition === 'Remanded').length
    };
  }, [postDecisionCases]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-white border-slate-200 p-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Appeals</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{appealsStats.active}</div>
          <div className="text-[9px] text-slate-400 mt-1">All tracked digitally</div>
        </Card>
        <Card className="bg-white border-slate-200 p-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">In Briefing</div>
          <div className="text-2xl font-bold text-dol-blue-50 mt-1">{appealsStats.briefing}</div>
          <div className="text-[9px] text-slate-400 mt-1">Briefs pending</div>
        </Card>
        <Card className="bg-white border-slate-200 p-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Under Review</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{appealsStats.total - appealsStats.briefing - appealsStats.decided}</div>
          <div className="text-[9px] text-slate-400 mt-1">Panel consideration</div>
        </Card>
        <Card className="bg-white border-slate-200 p-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Decided</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{appealsStats.decided}</div>
          <div className="text-[9px] text-slate-400 mt-1">This period</div>
        </Card>
        <Card className="bg-white border-slate-200 p-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Remanded</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{appealsStats.remanded}</div>
          <div className="text-[9px] text-slate-400 mt-1">Case reopened</div>
        </Card>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('Appeals')}
          className={cn(
            "px-6 py-3 text-[13px] font-bold uppercase tracking-wider transition-all",
            activeTab === 'Appeals' ? "text-dol-blue-50 border-b-2 border-dol-blue-50" : "text-slate-500 hover:text-slate-900"
          )}
        >
          ⚖️ Appeals
        </button>
        <button
          onClick={() => setActiveTab('Remands')}
          className={cn(
            "px-6 py-3 text-[13px] font-bold uppercase tracking-wider transition-all",
            activeTab === 'Remands' ? "text-dol-blue-50 border-b-2 border-dol-blue-50" : "text-slate-500 hover:text-slate-900"
          )}
        >
          🔄 Reconsideration
        </button>
        <button
          onClick={() => setActiveTab('Fees')}
          className={cn(
            "px-6 py-3 text-[13px] font-bold uppercase tracking-wider transition-all",
            activeTab === 'Fees' ? "text-dol-blue-50 border-b-2 border-dol-blue-50" : "text-slate-500 hover:text-slate-900"
          )}
        >
          💼 Attorney Fees
        </button>
      </div>

      {activeTab === 'Appeals' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Live Appeals Dashboard — all parties see real-time status</span>
            <Badge variant="success" className="ml-auto">● No paper shipping</Badge>
          </div>
          
          {filteredCases.map(c => {
            const stage = getAppealStage(c);
            const isRemand = c.appealData?.disposition === 'Remanded';
            
            return (
              <Card key={c.id} className="bg-white border-slate-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[11px] font-mono text-dol-blue-50">{c.caseNumber}</div>
                    <div className="text-[13px] font-semibold text-slate-900 mt-1">
                      {c.claimant.name} v. {c.employer.name}
                    </div>
                  </div>
                  <Badge variant={c.division === 'ARB' ? 'info' : c.division === 'BRB' ? 'brand' : 'warning'} className="text-[10px]">
                    {c.division} Review
                  </Badge>
                </div>
                
                <div className="text-[11px] text-slate-500 mb-3">
                  Filed: {c.createdAt} · Digital record transmitted · No shipping
                  {isRemand && <span className="text-amber-600 font-medium"> · Case auto-reopened</span>}
                </div>
                
                {/* Lifecycle Tracker */}
                <div className="flex items-center gap-1 mb-2">
                  {[0, 1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={cn(
                        "flex-1 h-1 rounded-full transition-all",
                        step <= stage ? "bg-emerald-500" : "bg-slate-200"
                      )}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 uppercase tracking-wide">
                  <span>Filed</span>
                  <span>Record Tx'd</span>
                  <span>Review</span>
                  <span>Outcome</span>
                  <span>{isRemand ? 'New Decision' : 'Closed'}</span>
                </div>
                
                {/* Status Bar */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    {c.status === 'Briefing' && c.appealData?.briefingSchedule && (
                      <span>
                        Respondent Brief Due: {c.appealData.briefingSchedule.respondentBriefDue}
                      </span>
                    )}
                    {c.status === 'Pending' && <span>Awaiting acknowledgment letter</span>}
                    {c.status === 'Under Consideration' && <span>Under panel consideration</span>}
                    {c.status === 'Oral Argument Scheduled' && c.hearingDate && (
                      <span>Oral Argument: {c.hearingDate}</span>
                    )}
                    {c.status === 'Decided' && (
                      <span className="text-emerald-600 font-medium">
                        {c.appealData?.disposition === 'Affirmed' ? 'Affirmed' : c.appealData?.disposition}
                      </span>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" className="text-dol-blue-50" onClick={() => onSelectCase(c)}>
                    View Record
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'Remands' && (
        <Card className="bg-white border-slate-200 p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Case</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Motion Filed</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Judge</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Determination</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-mono text-dol-blue-50">{c.caseNumber}</div>
                    <div className="text-[11px] text-slate-500">{c.claimant.name}</div>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-mono text-slate-700">{c.createdAt}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-700">{c.judge || 'Pending'}</td>
                  <td className="px-6 py-4">
                    <Badge variant="warning" className="text-[10px]">Pending Review</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="warning" className="text-[10px]">In Workspace</Badge>
                  </td>
                </tr>
              ))}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic text-[13px]">
                    No reconsideration motions pending.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === 'Fees' && (
        <Card className="bg-white border-slate-200 p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Case</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Petition Filed</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Objections</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Decision Due</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-mono text-dol-blue-50">{c.caseNumber}</div>
                    <div className="text-[11px] text-slate-500">{c.claimant.name}</div>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-mono text-slate-700">{c.createdAt}</td>
                  <td className="px-6 py-4">
                    <Badge variant="neutral" className="text-[10px]">None</Badge>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-mono text-slate-700">{c.statutoryDeadline || 'TBD'}</td>
                  <td className="px-6 py-4">
                    <Badge variant="info" className="text-[10px]">Auto-Flagged Ready</Badge>
                  </td>
                </tr>
              ))}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic text-[13px]">
                    No fee petitions pending.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function CaseDetailView({ 
  caseData, 
  isAnalyzing, 
  analysisResult, 
  onGenerateAnalysis,
  onViewRecord,
  onUpdateCase
}: { 
  caseData: Case;
  isAnalyzing: boolean;
  analysisResult: string | null;
  onGenerateAnalysis: () => void;
  onViewRecord: (docName?: string) => void;
  onUpdateCase: (c: Case) => void;
}) {
  const handleDocket = () => {
    onUpdateCase({
      ...caseData,
      phase: 'Assignment',
      status: 'Docketed',
      createdAt: new Date().toISOString().split('T')[0]
    });
    alert(`Case ${caseData.caseNumber} has been docketed and moved to Assignment.`);
  };

  const handleMarkDeficient = () => {
    const reason = prompt('Please enter the deficiency reason:');
    if (reason) {
      onUpdateCase({
        ...caseData,
        status: 'Deficient'
      });
      alert(`Case ${caseData.caseNumber} marked as deficient: ${reason}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Lifecycle Stepper at the top - Use Appeals tracker for appeal cases */}
      <Card className="bg-white border-slate-200 p-8 pb-12">
        {caseData.appealType || caseData.division === 'ARB' || caseData.division === 'BRB' || caseData.division === 'ECAB' ? (
          <AppealsLifecycleTracker caseData={caseData} />
        ) : (
          <>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-8 text-center">Case Lifecycle Status</div>
            <LifecycleStepper currentPhase={caseData.phase} />
          </>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-dol-blue-50">
            <Gavel size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[24px] font-bold text-slate-900">{caseData.caseNumber}</h2>
              <Badge className="bg-slate-100 border-slate-200 text-slate-600">{caseData.caseType}</Badge>
              <Badge className={cn(
                "border",
                caseData.status === 'SLA Breach' ? "bg-red-50 text-red-700 border-red-100" : 
                caseData.status === 'Deficient' ? "bg-rose-50 text-rose-700 border-rose-100" :
                "bg-emerald-50 text-emerald-700 border-emerald-100"
              )}>{caseData.status}</Badge>
            </div>
            <p className="text-[14px] text-slate-500 mt-1">{caseData.claimant.name} <span className="mx-2 text-slate-300">vs</span> {caseData.employer.name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {caseData.phase === 'Intake' && (
            <>
              <Button 
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50"
                onClick={handleMarkDeficient}
              >
                <AlertTriangle size={16} className="mr-2" /> Mark Deficient
              </Button>
              <Button 
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={handleDocket}
              >
                <Check size={16} className="mr-2" /> Docket Case
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            className="bg-white border-slate-200 text-slate-700"
            onClick={() => onViewRecord()}
          >
            View Record
          </Button>
          <Button 
            className="bg-dol-blue-50 text-white"
            onClick={() => alert('Opening case actions menu...')}
          >
            Actions
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white border-slate-200 p-8">
            <h3 className="text-[16px] font-bold text-slate-900 mb-6">Case Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Division</div>
                <div className="text-[14px] font-medium text-slate-900">{caseData.division}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Date Filed</div>
                <div className="text-[14px] font-medium text-slate-900">{caseData.createdAt}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Office</div>
                <div className="text-[14px] font-medium text-slate-900">{caseData.office}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Judge</div>
                <div className="text-[14px] font-medium text-slate-900">{caseData.judge || 'Unassigned'}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">SLA Status</div>
                <div className="text-[14px] font-medium text-emerald-600">{caseData.slaStatus}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Deadline</div>
                <div className="text-[14px] font-medium text-amber-600">{caseData.statutoryDeadline}</div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-bold text-slate-900">Recent Filings</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-dol-blue-50"
                onClick={() => alert('Navigating to full filings list...')}
              >
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {caseData.filings.map((filing) => (
                <FilingItem 
                  key={filing.id} 
                  label={filing.description} 
                  date={filing.submittedAt} 
                  onClick={() => onViewRecord(filing.description)}
                />
              ))}
              {caseData.filings.length === 0 && (
                <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-[13px]">No filings recorded for this case.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-white border-slate-200 p-6">
            <h3 className="text-[16px] font-bold text-slate-900 mb-6">Parties of Record</h3>
            <div className="space-y-6">
              {caseData.serviceList.map((party, i) => (
                <div key={i} className="pb-4 border-b border-slate-100 last:border-0">
                  <div className="text-[14px] font-bold text-slate-900">{party.name}</div>
                  <div className="text-[12px] text-slate-500">{party.role}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{party.organization}</div>
                </div>
              ))}
              {caseData.serviceList.length === 0 && (
                <p className="text-[12px] text-slate-400 italic">No parties of record yet.</p>
              )}
            </div>
          </Card>

          <Card className="bg-blue-50 border-blue-100 p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-dol-blue-50" />
              <h3 className="text-[14px] font-bold text-dol-blue-50 uppercase tracking-wider">AI Insights</h3>
            </div>
            
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div 
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-4 flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-6 h-6 border-2 border-dol-blue-50 border-t-transparent rounded-full animate-spin" />
                  <p className="text-[12px] text-dol-blue-50 font-medium">Analyzing case documents...</p>
                </motion.div>
              ) : analysisResult ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-[13px] text-slate-700 leading-relaxed italic">
                    "{analysisResult}"
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-bold">
                    <CheckCircle2 size={12} />
                    Confidence: 94%
                  </div>
                </motion.div>
              ) : (
                <motion.div key="initial" className="space-y-3">
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    Generate an AI-powered analysis of the medical evidence and employment history for this case.
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full bg-dol-blue-50 text-white hover:bg-blue-900"
                    onClick={onGenerateAnalysis}
                  >
                    Generate Analysis
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AnalyticsView({ cases }: { cases: Case[] }) {
  // Monthly decisions data (mock data for 2024)
  const monthlyDecisions = [
    { month: 'JAN', count: 67 },
    { month: 'FEB', count: 86 },
    { month: 'MAR', count: 76 },
    { month: 'APR', count: 98 },
    { month: 'MAY', count: 92 },
    { month: 'JUN', count: 94 }
  ];
  const maxDecisions = Math.max(...monthlyDecisions.map(d => d.count));

  // TO-BE vs AS-IS improvements
  const improvements = [
    { label: 'Second Referral loop reduction', value: 68 },
    { label: 'Manual staff scheduling hours saved', value: 71 },
    { label: 'Time from filing to docketing', value: 98 },
    { label: 'Appeal record transmission time', value: 99 },
    { label: 'Lost file incidents', value: 100 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 p-5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avg. Decision Time</div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">38.2d</div>
          <div className="text-[9px] text-emerald-600 mt-2 font-semibold">↓ 22% vs AS-IS baseline</div>
        </Card>
        <Card className="bg-white border-slate-200 p-5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Auto-Docket Rate</div>
          <div className="text-3xl font-bold text-dol-blue-50 mt-1">99.4%</div>
          <div className="text-[9px] text-emerald-600 mt-2 font-semibold">↑ from 0% AS-IS</div>
        </Card>
        <Card className="bg-white border-slate-200 p-5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lost Files YTD</div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">0</div>
          <div className="text-[9px] text-emerald-600 mt-2 font-semibold">↓ from 4 avg. AS-IS</div>
        </Card>
        <Card className="bg-white border-slate-200 p-5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">On-Time Decisions</div>
          <div className="text-3xl font-bold text-amber-600 mt-1">87%</div>
          <div className="text-[9px] text-emerald-600 mt-2 font-semibold">↑ 14pts vs AS-IS</div>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Decisions by Month */}
        <Card className="bg-white border-slate-200 p-6">
          <h3 className="text-[14px] font-bold text-slate-900 mb-6">Decisions by Month — 2024</h3>
          <div className="flex items-end justify-between gap-3 h-[220px] pb-8">
            {monthlyDecisions.map((data, index) => {
              const heightPercent = (data.count / maxDecisions) * 100;
              const barColor = index === 3 || index === 4 ? '#00A960' : index === 1 || index === 5 ? '#003366' : '#657585';
              return (
                <div key={data.month} className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="text-[10px] font-mono text-slate-600 mb-2 h-5">{data.count}</div>
                  <div 
                    className="w-full rounded-t transition-all duration-500"
                    style={{ 
                      height: `${heightPercent}%`,
                      backgroundColor: barColor,
                      minHeight: '20px'
                    }}
                  />
                  <div className="text-[9px] text-slate-500 font-bold mt-2">{data.month}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* TO-BE vs AS-IS Improvements */}
        <Card className="bg-white border-slate-200 p-6">
          <h3 className="text-[14px] font-bold text-slate-900 mb-6">TO-BE vs AS-IS — Key Improvements</h3>
          <div className="space-y-4">
            {improvements.map((imp) => (
              <div key={imp.label}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">{imp.label}</span>
                  <span className="text-emerald-600 font-bold">↓ {imp.value}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${imp.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function WorkloadView({ cases }: { cases: Case[] }) {
  const judges = [
    { name: 'Hon. Sarah Jenkins', office: 'Washington, DC' },
    { name: 'Hon. Michael Chen', office: 'San Francisco, CA' },
    { name: 'Hon. Elena Rodriguez', office: 'Newport News, VA' },
    { name: 'Hon. David Thompson', office: 'Cincinnati, OH' },
  ];

  const judgeWorkload = judges.map(j => {
    const activeCases = cases.filter(c => c.judge === j.name).length;
    const capacity = Math.min(Math.round((activeCases / 150) * 100), 100);
    return { ...j, cases: activeCases, capacity: `${capacity}%`, sla: '98%' };
  });

  return (
    <div className="space-y-8">
      <Card className="bg-white border-slate-200 p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-slate-900">Judge Workload Distribution</h3>
          <Button variant="outline" className="bg-white border-slate-200 text-slate-700">Filter by Office</Button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Judge Name</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Office</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Cases</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Capacity</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">SLA Performance</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {judgeWorkload.map((j, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-[13px] font-bold text-slate-900">{j.name}</td>
                <td className="px-6 py-4 text-[13px] text-slate-500">{j.office}</td>
                <td className="px-6 py-4 text-[13px] text-slate-900">{j.cases}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-dol-blue-50" style={{ width: j.capacity }}></div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-900">{j.capacity}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] font-bold text-emerald-600">{j.sla}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button size="sm" variant="ghost" className="text-dol-blue-50">View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function HearingSessionView({ caseData, onExit }: { caseData: Case; onExit: () => void }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  return (
    <div className="fixed inset-0 z-[150] bg-slate-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <div>
            <div className="text-white font-bold text-[15px]">LIVE HEARING: {caseData.caseNumber}</div>
            <div className="text-slate-400 text-[11px] uppercase tracking-wider">{caseData.claimant.name} v. {caseData.employer.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-slate-800 text-slate-300 border-slate-700">01:24:45</Badge>
          <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={onExit}>
            <Plus className="rotate-45" />
          </Button>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden">
        {/* Main Video Grid */}
        <div className="flex-grow p-6 grid grid-cols-2 grid-rows-2 gap-4">
          <VideoParticipant name="Hon. Michael Chen" role="Judge" active />
          <VideoParticipant name="James Smith, Esq." role="Claimant Counsel" />
          <VideoParticipant name="Robert J. Miller" role="Claimant" />
          <VideoParticipant name="Linda Vance, Esq." role="Employer Counsel" />
        </div>

        {/* Sidebar */}
        <div className="w-[380px] bg-slate-900 border-l border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800 flex gap-2">
            <Button size="sm" className="flex-1 bg-slate-800 text-white border-slate-700">Transcript</Button>
            <Button size="sm" variant="ghost" className="flex-1 text-slate-400">Exhibits (14)</Button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            <TranscriptLine speaker="Judge" text="Counsel, you may proceed with the cross-examination of the medical expert." time="10:42 AM" />
            <TranscriptLine speaker="Claimant Counsel" text="Thank you, Your Honor. Dr. Aris, looking at Exhibit C-4, the pulmonary function test..." time="10:43 AM" />
            <TranscriptLine speaker="Judge" text="Wait, let me pull up C-4 for the record." time="10:43 AM" active />
            <div className="p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400 text-[11px] font-bold uppercase mb-1">
                <Sparkles size={12} /> AI Note
              </div>
              <p className="text-slate-300 text-[12px]">The witness is referring to the FEV1/FVC ratio on page 3 of the medical report.</p>
            </div>
          </div>
          <div className="p-4 border-t border-slate-800">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Send message to clerk..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-[13px] text-white focus:outline-none focus:ring-1 focus:ring-dol-blue-50"
              />
              <Send size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-6">
        <ControlButton icon={isMuted ? <MicOff /> : <Mic />} active={!isMuted} onClick={() => setIsMuted(!isMuted)} />
        <ControlButton icon={isVideoOff ? <VideoOff /> : <Video />} active={!isVideoOff} onClick={() => setIsVideoOff(!isVideoOff)} />
        <ControlButton icon={<Monitor />} />
        <ControlButton icon={<MessageIcon />} />
        <div className="w-px h-8 bg-slate-800 mx-2" />
        <Button className="bg-red-600 hover:bg-red-700 text-white px-8 font-bold" onClick={onExit}>LEAVE HEARING</Button>
      </div>
    </div>
  );
}

function VideoParticipant({ name, role, active = false }: { name: string; role: string; active?: boolean }) {
  return (
    <div className={cn(
      "relative bg-slate-900 rounded-2xl overflow-hidden border-2 transition-all",
      active ? "border-dol-blue-50 shadow-[0_0_20px_rgba(0,82,155,0.3)]" : "border-slate-800"
    )}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-600">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
          <div className="text-white text-[13px] font-bold">{name}</div>
          <div className="text-slate-400 text-[10px] uppercase tracking-wider font-medium">{role}</div>
        </div>
        {active && (
          <div className="w-8 h-8 bg-dol-blue-50 rounded-full flex items-center justify-center text-white shadow-lg">
            <Mic size={14} />
          </div>
        )}
      </div>
    </div>
  );
}

function TranscriptLine({ speaker, text, time, active = false }: { speaker: string; text: string; time: string; active?: boolean }) {
  return (
    <div className={cn("space-y-1", active && "bg-blue-900/20 -mx-4 px-4 py-2 border-l-2 border-dol-blue-50")}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-dol-blue-50 uppercase tracking-wider">{speaker}</span>
        <span className="text-[10px] text-slate-500">{time}</span>
      </div>
      <p className="text-[13px] text-slate-300 leading-relaxed">{text}</p>
    </div>
  );
}

function ControlButton({ icon, active = false, onClick }: { icon: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
        active ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </button>
  );
}

function DecisionWorkspaceView({ caseData, onExit }: { caseData: Case; onExit: () => void }) {
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [draftContent, setDraftContent] = useState(`DECISION AND ORDER

This case arises under the Black Lung Benefits Act, 30 U.S.C. §§ 901-944. The claimant, ${caseData.claimant.name}, filed a claim for benefits on ${caseData.createdAt}.

I. PROCEDURAL HISTORY
A hearing was held on May 15, 2024, in ${caseData.office}. The parties submitted evidence and post-hearing briefs...`);

  const handleAiDraft = () => {
    setIsAiDrafting(true);
    setTimeout(() => {
      setDraftContent(prev => prev + "\n\nII. FINDINGS OF FACT\nBased on the pulmonary function tests (Exhibit C-4) and the testimony of Dr. Aris, I find that the claimant has established a totally disabling respiratory impairment. The FEV1 values were consistently below the regulatory thresholds...");
      setIsAiDrafting(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-white flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onExit}>
            <ArrowLeft size={18} className="mr-2" /> Back
          </Button>
          <div className="h-6 w-px bg-slate-300" />
          <div>
            <div className="text-[14px] font-bold text-slate-900">Decision Workspace: {caseData.caseNumber}</div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Users size={12} /> Collaborative Session: Hon. Michael Chen, Clerk Sarah Wong
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700">
            <HistoryIcon size={16} className="mr-2" /> History
          </Button>
          <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700">
            <Save size={16} className="mr-2" /> Save Draft
          </Button>
          <Button className="bg-dol-blue-50 text-white font-bold">
            Finalize & Issue
          </Button>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden">
        {/* Editor Area */}
        <div className="flex-grow flex flex-col bg-slate-100 p-8 overflow-y-auto">
          <div className="bg-white w-full max-w-[850px] mx-auto shadow-xl min-h-full p-16 font-serif text-[16px] leading-relaxed text-slate-900 focus:outline-none whitespace-pre-wrap" contentEditable>
            {draftContent}
          </div>
        </div>

        {/* AI Collaboration Sidebar */}
        <div className="w-[400px] border-l border-slate-200 flex flex-col bg-white">
          <div className="p-4 border-b border-slate-200 flex items-center gap-2">
            <Sparkles className="text-dol-blue-50 w-4 h-4" />
            <h3 className="font-bold text-slate-900 text-[14px] uppercase tracking-wider">Chambers AI Assistant</h3>
          </div>
          
          <div className="flex-grow overflow-y-auto p-6 space-y-8">
            <div className="space-y-4">
              <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Evidence Summary</h4>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-blue-100 rounded text-dol-blue-50">
                    <FileCheck size={14} />
                  </div>
                  <p className="text-[13px] text-slate-700 leading-snug">
                    <span className="font-bold">Exhibit C-4:</span> Pulmonary function test shows FEV1 of 1.42L (54% of predicted), meeting disability criteria under § 718.204(b)(2)(i).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-blue-100 rounded text-dol-blue-50">
                    <FileCheck size={14} />
                  </div>
                  <p className="text-[13px] text-slate-700 leading-snug">
                    <span className="font-bold">Employment:</span> Social Security records confirm 17.4 years of qualifying coal mine employment.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Drafting Actions</h4>
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start text-left h-auto py-3 px-4 border-slate-200 hover:border-dol-blue-50 hover:bg-blue-50"
                  onClick={handleAiDraft}
                  disabled={isAiDrafting}
                >
                  <div className="flex items-center gap-3">
                    <PenTool size={18} className="text-dol-blue-50" />
                    <div>
                      <div className="text-[13px] font-bold text-slate-900">Draft Findings of Fact</div>
                      <div className="text-[11px] text-slate-500">Generate based on medical exhibits</div>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start text-left h-auto py-3 px-4 border-slate-200 hover:border-dol-blue-50 hover:bg-blue-50">
                  <div className="flex items-center gap-3">
                    <Scale size={18} className="text-dol-blue-50" />
                    <div>
                      <div className="text-[13px] font-bold text-slate-900">Cite Legal Standards</div>
                      <div className="text-[11px] text-slate-500">Insert boilerplate for 15-year presumption</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Collaboration</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-700">SW</div>
                  <div className="flex-grow bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-900 mb-1">Sarah Wong (Clerk)</div>
                    <p className="text-[12px] text-slate-600">Judge, I've outlined the procedural history. Ready for your findings on the medical evidence.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask AI or message chambers..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-[13px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-dol-blue-50"
              />
              <Sparkles size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dol-blue-50 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function StatCard({ label, value, trend, color }: { label: string; value: string; trend: string; color: 'blue' | 'amber' | 'emerald' | 'red' }) {
  const colors = {
    blue: 'text-dol-blue-50 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    red: 'text-red-600 bg-red-50',
  };
  return (
    <Card className="bg-white border-slate-200 p-6">
      <div className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">{label}</div>
      <div className="text-3xl font-bold text-slate-900 mb-2">{value}</div>
      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${colors[color]}`}>
        {trend}
      </div>
    </Card>
  );
}

function WorkloadItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[12px]">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900 font-bold">{value}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }}></div>
      </div>
    </div>
  );
}

function FilingItem({ label, date, onClick }: { label: string; date: string; onClick?: () => void; key?: React.Key }) {
  return (
    <div 
      className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-dol-blue-50 bg-slate-50/50 transition-all group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <FileText className="w-4 h-4 text-slate-400 group-hover:text-dol-blue-50" />
        <span className="text-[13px] font-medium text-slate-700 group-hover:text-dol-blue-50">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-400">{date}</span>
        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-dol-blue-50" />
      </div>
    </div>
  );
}
