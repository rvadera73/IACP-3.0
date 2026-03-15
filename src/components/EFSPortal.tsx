import React, { useState, useRef } from 'react';
import {
  FilePlus,
  Search,
  Clock,
  FileCheck,
  AlertCircle,
  ChevronRight,
  User,
  LogOut,
  Briefcase,
  Building2,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  ArrowLeft,
  X,
  Plus,
  Bell,
  Upload,
  CheckCircle
} from 'lucide-react';
import { Button, Card, Badge } from './UI';
import { motion, AnimatePresence } from 'motion/react';
import { CASE_TYPES, APPEAL_TYPES } from '../constants';
import { analyzeIntake, analyzeAccessRequest } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CaseType, AppealType } from '../types';

// Folder-centric components
import CasesGallery, { CaseFolderData } from './oalj/CasesGallery';
import CaseRecord, { CaseRecordData } from './oalj/CaseRecord';
import NotificationsPanel, { Notification } from './oalj/NotificationsPanel';
import CaseIntelligenceHub from './oalj/CaseIntelligenceHub';
import { getCaseRecord, MOCK_CASE_FOLDERS, MOCK_NOTIFICATIONS } from '../data/mockDashboardData';

export default function EFSPortal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // View state - default to my-cases instead of dashboard
  const [view, setView] = useState<'my-cases' | 'case-details' | 'new-filing' | 'new-appeal' | 'access-request'>('my-cases');

  // Pre-selected case for filing (passed from case record)
  const [preselectedCaseForFiling, setPreselectedCaseForFiling] = useState<any | null>(null);
  const [preselectedCaseForAccess, setPreselectedCaseForAccess] = useState<any | null>(null);

  // My Cases for folder-centric view (includes cases with pending access requests)
  const [myCases, setMyCases] = useState<CaseFolderData[]>(MOCK_CASE_FOLDERS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [selectedMyCase, setSelectedMyCase] = useState<string | null>(null);
  const [selectedCaseForViewer, setSelectedCaseForViewer] = useState<string | null>(null);

  // Filings tracking
  const [filings, setFilings] = useState<any[]>([
    { id: 'INT-2024-001', type: 'New Claim', status: 'Accepted', date: '2024-02-20', caseNo: '2024-BLA-00042' },
    { id: 'INT-2024-005', type: 'Evidence Submission', status: 'Pending', date: '2024-02-24', caseNo: '2024-BLA-00042' },
    { id: 'INT-2024-008', type: 'Motion to Compel', status: 'Accepted', date: '2024-02-25', caseNo: '2024-LHC-00128' },
  ]);

  const [accessRequests, setAccessRequests] = useState<any[]>([
    { id: 'REQ-001', caseNumber: '2024-BLA-00042', requestedAt: '2024-02-25', status: 'Approved', reason: 'Retained as Counsel' },
  ]);

  // Pending access requests (shown in My Cases as "Awaiting Access")
  const [pendingAccessCases, setPendingAccessCases] = useState<any[]>([]);

  // Filing state
  const [filingType, setFilingType] = useState<'New Case Filing' | 'New Appeal' | 'New Motion' | 'New Brief'>('New Case Filing');
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType>('BLA');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    claimantName: '',
    claimNumber: '',
    employerName: '',
    insuranceCarrier: '',
    description: '',
    appealBoard: 'BRB',
    originatingDocketNumber: '',
    dateOfOrder: '',
    motionCategory: 'Extension of Time',
    opposingPartyPosition: 'Unopposed',
    briefType: 'Opening',
  });

  // Access request state
  const [accessSearchQuery, setAccessSearchQuery] = useState('');
  const [foundCase, setFoundCase] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [accessRequestStep, setAccessRequestStep] = useState<'search' | 'details' | 'success'>('search');
  const [accessAiFeedback, setAccessAiFeedback] = useState<string | null>(null);
  const [accessFile, setAccessFile] = useState<File | null>(null);
  const [accessFormData, setAccessFormData] = useState({
    claimantName: '',
    reason: 'Retained as Counsel',
    barNumber: '',
    lawFirm: '',
    email: '',
  });

  const isAttorney = user?.role?.includes('Attorney') || true;

  // Handle case click from folder gallery - opens Case Intelligence Hub
  const handleSelectCase = (caseId: string) => {
    setSelectedCaseForViewer(caseId);
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
    const caseFolder = myCases.find(c => c.docketNumber === notification.caseNumber);
    if (caseFolder) {
      handleSelectCase(caseFolder.id);
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Start new filing with optional pre-selected case
  const handleStartNewFiling = (preselectedCase?: any) => {
    setPreselectedCaseForFiling(preselectedCase || null);
    setFilingType('New Case Filing');
    setSelectedFile(null);
    setAiFeedback(null);
    setFormData({
      claimantName: '',
      claimNumber: '',
      employerName: '',
      insuranceCarrier: '',
      description: '',
      appealBoard: 'BRB',
      originatingDocketNumber: '',
      dateOfOrder: '',
      motionCategory: 'Extension of Time',
      opposingPartyPosition: 'Unopposed',
      briefType: 'Opening',
    });
    setView('new-filing');
  };

  // Start access request with optional pre-selected case
  const handleStartAccessRequest = (preselectedCase?: any) => {
    if (preselectedCase) {
      setFoundCase(preselectedCase);
      setAccessFormData({
        ...accessFormData,
        claimantName: preselectedCase.claimant || '',
      });
      setAccessRequestStep('details');
    } else {
      setFoundCase(null);
      setAccessRequestStep('search');
    }
    setView('access-request');
  };

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setAiFeedback(null);
    }
  };

  // Access request file upload
  const handleAccessFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAccessFile(e.target.files[0]);
      setAccessAiFeedback(null);
    }
  };

  // Run AI analysis
  const handleRunAIAnalysis = async () => {
    if (!selectedFile) {
      alert('Please upload a document first');
      return;
    }

    setIsAnalyzing(true);
    
    let details = `Claimant: ${formData.claimantName}. Description: ${formData.description}. File: ${selectedFile.name}`;
    
    if (filingType === 'New Case Filing') {
      details += `. Claim #: ${formData.claimNumber}. Program: ${selectedCaseType}. Employer: ${formData.employerName}`;
    } else if (filingType === 'New Appeal') {
      details += `. Board: ${formData.appealBoard}. Docket #: ${formData.originatingDocketNumber}`;
    } else if (filingType === 'New Motion') {
      details += `. Case: ${preselectedCaseForFiling?.docketNumber || 'N/A'}. Motion: ${formData.motionCategory}`;
    } else if (filingType === 'New Brief') {
      details += `. Case: ${preselectedCaseForFiling?.docketNumber || 'N/A'}. Brief: ${formData.briefType}`;
    }

    try {
      const feedback = await analyzeIntake(details, filingType, user?.role || 'Attorney');
      setAiFeedback(feedback);
    } catch (error) {
      setAiFeedback('AI analysis unavailable. Please proceed with manual review.');
    }
    setIsAnalyzing(false);
  };

  // Submit filing
  const handleSubmitFiling = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      const year = new Date().getFullYear();
      const seq = String(filings.length + 1).padStart(5, '0');
      let caseNo = '';

      if (filingType === 'New Appeal') {
        const prefix = APPEAL_TYPES[formData.appealBoard as AppealType]?.prefix || 'BRB No.';
        caseNo = `${prefix} ${String(year).slice(-2)}-${seq} ${selectedCaseType}`;
      } else if (preselectedCaseForFiling) {
        caseNo = preselectedCaseForFiling.docketNumber;
      } else {
        caseNo = `${year}-${selectedCaseType}-${seq}`;
      }

      const newFiling = {
        id: `INT-${year}-${seq}`,
        type: filingType,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        caseNo: caseNo
      };

      setFilings([newFiling, ...filings]);
      setIsSubmitting(false);
      setAiFeedback(null);
      setSelectedFile(null);
      setShowConfirmDialog(false);
      setView('my-cases');
    }, 1500);
  };

  // Access request search
  const handleAccessSearch = () => {
    if (!accessSearchQuery.trim()) {
      alert('Please enter a case number');
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      
      // Mock search - check against myCases first
      const found = myCases.find(c => 
        c.docketNumber.toUpperCase().includes(accessSearchQuery.toUpperCase())
      );

      if (found) {
        setFoundCase({
          caseNumber: found.docketNumber,
          title: found.title,
          type: found.caseType,
          status: found.status,
          claimant: found.title.split(' v. ')[0],
        });
        setAccessFormData({
          ...accessFormData,
          claimantName: found.title.split(' v. ')[0],
        });
        setAccessRequestStep('details');
      } else if (accessSearchQuery.includes('00042') || accessSearchQuery.includes('0123')) {
        // Mock external case
        setFoundCase({
          caseNumber: accessSearchQuery,
          title: accessSearchQuery.includes('BLA') ? 'Miller vs. Coal Corp' : 'Smith vs. Shipping Inc.',
          type: accessSearchQuery.includes('BLA') ? 'Black Lung' : 'Longshore',
          status: 'Active',
          claimant: accessSearchQuery.includes('BLA') ? 'Robert Miller' : 'James Wilson',
        });
        setAccessFormData({
          ...accessFormData,
          claimantName: accessSearchQuery.includes('BLA') ? 'Robert Miller' : 'James Wilson',
        });
        setAccessRequestStep('details');
      } else {
        alert('Case not found. Please verify the case number.');
      }
    }, 800);
  };

  // Access request AI review
  const handleAccessAIReview = async () => {
    if (!accessFile) {
      alert('Please upload the Notice of Appearance document');
      return;
    }

    setIsAnalyzing(true);
    const details = `Case: ${foundCase?.caseNumber}. Claimant: ${accessFormData.claimantName}. Reason: ${accessFormData.reason}. Bar: ${accessFormData.barNumber}. File: ${accessFile.name}`;
    
    try {
      const feedback = await analyzeAccessRequest(details);
      setAccessAiFeedback(feedback);
    } catch (error) {
      setAccessAiFeedback('AI validation unavailable. Please proceed manually.');
    }
    setIsAnalyzing(false);
  };

  // Submit access request
  const handleSubmitAccessRequest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newReq = {
        id: `REQ-00${accessRequests.length + 1}`,
        caseNumber: foundCase?.caseNumber || 'Unknown',
        requestedAt: new Date().toISOString().split('T')[0],
        status: 'Pending',
        reason: accessFormData.reason,
        verificationStatus: 'Pending Review'
      };
      setAccessRequests([newReq, ...accessRequests]);
      
      // Add to pending access cases (shown in My Cases section)
      setPendingAccessCases([
        ...pendingAccessCases,
        {
          id: `pending-${Date.now()}`,
          docketNumber: foundCase?.caseNumber || 'Unknown',
          caseType: 'BLA' as CaseType,
          category: 'Adjudication' as const,
          title: foundCase?.title || 'Pending Access',
          status: 'Awaiting Access',
          urgency: 'Medium' as const,
          requestedAt: new Date().toISOString().split('T')[0],
        }
      ]);
      
      setIsSubmitting(false);
      setAccessRequestStep('success');
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAccessFormData = (field: string, value: any) => {
    setAccessFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedCaseRecord = selectedMyCase ? getCaseRecord(selectedMyCase) : null;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-white leading-tight">Unified Filing Service</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">UFS Portal</div>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 px-4">Main Menu</div>
          
          <button
            onClick={() => setView('my-cases')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
              view === 'my-cases' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span className="text-sm font-medium">My Cases</span>
          </button>
          
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">Filings</div>
          
          <button
            onClick={() => handleStartNewFiling()}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
              view === 'new-filing' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FilePlus className="w-4 h-4" />
            <span className="text-sm font-medium">New OALJ Filing</span>
          </button>
          
          <button
            onClick={() => setView('new-appeal')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
              view === 'new-appeal' ? 'bg-amber-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm font-medium">New Appeal (Boards)</span>
          </button>
          
          <button
            onClick={() => handleStartAccessRequest()}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
              view === 'access-request' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-medium">Access Request</span>
          </button>

          {isAttorney && (
            <>
              <div className="pt-6 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">Professional</div>
              <button
                onClick={() => alert('Organization view coming soon')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              >
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Organization</span>
              </button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-grow min-w-0">
              <div className="text-sm font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">{user.role}</div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-900/20 text-slate-500 hover:text-red-400 rounded-lg transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            {(view === 'case-details' || view === 'new-filing' || view === 'access-request') && (
              <Button variant="ghost" size="sm" onClick={() => view === 'case-details' ? setView('my-cases') : setView('my-cases')} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <h2 className="text-lg font-bold text-slate-800">
              {view === 'my-cases' ? 'My Cases' :
               view === 'case-details' ? 'Case Record' :
               view === 'new-filing' ? 'New OALJ Filing' :
               view === 'new-appeal' ? 'New Appeal to Board' :
               'Request Case Access'}
            </h2>
            <Badge variant="info">{user.role} Portal</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search cases..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all w-64"
              />
            </div>
            <NotificationsPanel
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onMarkAllRead={handleMarkAllNotificationsRead}
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {/* My Cases - Folder-Centric Gallery (DEFAULT VIEW) */}
            {view === 'my-cases' && (
              <motion.div
                key="my-cases"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Button onClick={() => handleStartNewFiling()} leftIcon={<Plus className="w-4 h-4" />}>
                      New OALJ Filing
                    </Button>
                    <Button variant="outline" onClick={() => handleStartAccessRequest()} leftIcon={<ShieldCheck className="w-4 h-4" />}>
                      Request Access
                    </Button>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{myCases.length + pendingAccessCases.length}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Total Cases</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{filings.length}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Total Filings</div>
                    </div>
                  </div>
                </div>
                
                {/* Pending Access Requests Section */}
                {pendingAccessCases.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-50 rounded-lg">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Awaiting Access</h3>
                        <p className="text-xs text-slate-500">{pendingAccessCases.length} pending approval</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {pendingAccessCases.map((caseData) => (
                        <div
                          key={caseData.id}
                          className="p-5 rounded-xl border-l-4 border-amber-400 bg-amber-50 border border-amber-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                              {caseData.caseType}
                            </span>
                            <Clock className="w-4 h-4 text-amber-600" />
                          </div>
                          <div className="font-mono text-sm font-bold text-slate-900 mb-1">
                            {caseData.docketNumber}
                          </div>
                          <div className="text-sm text-slate-700 mb-4 line-clamp-2">
                            {caseData.title}
                          </div>
                          <div className="h-px bg-amber-200 mb-3" />
                          <div className="flex items-center justify-between">
                            <Badge variant="warning" size="sm">
                              <Clock className="w-3 h-3" />
                              Awaiting Access
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Active Cases Section */}
                <CasesGallery cases={myCases} onCaseClick={handleSelectCase} />
              </motion.div>
            )}

            {/* Case Details */}
            {view === 'case-details' && selectedCaseRecord && (
              <motion.div
                key="case-details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CaseRecord
                  caseData={selectedCaseRecord}
                  onBack={() => setView('my-cases')}
                  onNewFiling={() => handleStartNewFiling(selectedCaseRecord)}
                />
              </motion.div>
            )}

            {/* New OALJ Filing */}
            {view === 'new-filing' && (
              <motion.div
                key="new-filing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">New OALJ Filing</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {preselectedCaseForFiling 
                          ? `Filing in case: ${preselectedCaseForFiling.docketNumber}`
                          : 'File a new case or motion in OALJ'}
                      </p>
                    </div>
                    <Badge variant="info">
                      {selectedCaseType}
                    </Badge>
                  </div>

                  {/* Filing Type Selection - Only show Motion/Brief if case is pre-selected */}
                  {!preselectedCaseForFiling ? (
                    /* New Case Intake for OALJ */
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
                  ) : (
                    /* Motion/Brief for existing case */
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <button
                        onClick={() => setFilingType('New Motion')}
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
                        onClick={() => setFilingType('New Brief')}
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
                  )}

                  {/* Form Fields */}
                  <div className="space-y-6">
                    {/* Case Type Dropdown (BLA, LHC, PER only) */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
                        Program Type *
                      </label>
                      <select
                        value={selectedCaseType}
                        onChange={(e) => setSelectedCaseType(e.target.value as CaseType)}
                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="BLA">BLA - Black Lung</option>
                        <option value="LHC">LHC - Longshore</option>
                        <option value="PER">PER - BALCA/PERM</option>
                      </select>
                    </div>

                    {/* Dynamic fields based on filing type */}
                    {filingType === 'New Case Filing' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Claim Number *</label>
                            <input
                              type="text"
                              value={formData.claimNumber}
                              onChange={(e) => updateFormData('claimNumber', e.target.value)}
                              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., 12345-67-8901"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Employer Name *</label>
                            <input
                              type="text"
                              value={formData.employerName}
                              onChange={(e) => updateFormData('employerName', e.target.value)}
                              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {filingType === 'New Appeal' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Appellate Board *</label>
                            <select
                              value={formData.appealBoard}
                              onChange={(e) => updateFormData('appealBoard', e.target.value)}
                              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="BRB">BRB - Benefits Review Board</option>
                              <option value="ARB">ARB - Administrative Review Board</option>
                              <option value="ECAB">ECAB - Employees' Comp Appeals Board</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Originating Docket Number *</label>
                            <input
                              type="text"
                              value={formData.originatingDocketNumber}
                              onChange={(e) => updateFormData('originatingDocketNumber', e.target.value)}
                              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., 2024-BLA-00042"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Date of Order *</label>
                            <input
                              type="date"
                              value={formData.dateOfOrder}
                              onChange={(e) => updateFormData('dateOfOrder', e.target.value)}
                              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {filingType === 'New Motion' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Motion Category *</label>
                            <select
                              value={formData.motionCategory}
                              onChange={(e) => updateFormData('motionCategory', e.target.value)}
                              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option>Extension of Time</option>
                              <option>Motion to Compel</option>
                              <option>Motion in Limine</option>
                              <option>Motion for Summary Decision</option>
                              <option>Motion to Strike</option>
                              <option>Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Opposing Party Position *</label>
                            <select
                              value={formData.opposingPartyPosition}
                              onChange={(e) => updateFormData('opposingPartyPosition', e.target.value)}
                              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option>Unopposed</option>
                              <option>Opposed</option>
                              <option>Unknown</option>
                            </select>
                          </div>
                        </div>
                        {preselectedCaseForFiling && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-sm font-bold text-blue-900">Filing in Case:</div>
                            <div className="text-sm text-blue-700">{preselectedCaseForFiling.docketNumber}</div>
                          </div>
                        )}
                      </>
                    )}

                    {filingType === 'New Brief' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Brief Type *</label>
                            <select
                              value={formData.briefType}
                              onChange={(e) => updateFormData('briefType', e.target.value)}
                              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option>Opening</option>
                              <option>Respondent</option>
                              <option>Reply</option>
                              <option>Amicus Curiae</option>
                            </select>
                          </div>
                        </div>
                        {preselectedCaseForFiling && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-sm font-bold text-blue-900">Filing in Case:</div>
                            <div className="text-sm text-blue-700">{preselectedCaseForFiling.docketNumber}</div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Common Fields */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Claimant Name *</label>
                      <input
                        type="text"
                        value={formData.claimantName}
                        onChange={(e) => updateFormData('claimantName', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Description *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Brief description of the filing..."
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Upload Document *</label>
                      <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                        <input
                          id="filing-upload"
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                        />
                        <label htmlFor="filing-upload" className="cursor-pointer text-center">
                          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                          <div className="text-sm font-medium text-slate-700">
                            {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">PDF, DOC, or DOCX (max 10MB)</div>
                        </label>
                        {selectedFile && (
                          <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-slate-700">{selectedFile.name}</span>
                            </div>
                            <button
                              onClick={() => { setSelectedFile(null); setAiFeedback(null); }}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Analysis */}
                    {aiFeedback && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-blue-600" />
                          <div className="text-sm font-bold text-blue-900">AI Analysis</div>
                        </div>
                        <div className="text-sm text-blue-700 whitespace-pre-line">{aiFeedback}</div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                      <Button
                        variant="outline"
                        onClick={() => setView('my-cases')}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleRunAIAnalysis}
                        disabled={!selectedFile || isAnalyzing}
                        leftIcon={<ShieldCheck className="w-4 h-4" />}
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Review with AI'}
                      </Button>
                      <Button
                        onClick={() => setShowConfirmDialog(true)}
                        disabled={!aiFeedback || !selectedFile}
                        leftIcon={<CheckCircle className="w-4 h-4" />}
                      >
                        Submit Filing
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* New Appeal to Boards */}
            {view === 'new-appeal' && (
              <motion.div
                key="new-appeal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">New Appeal to Board</h3>
                      <p className="text-sm text-slate-500 mt-1">Appeal an OALJ decision to the appellate boards</p>
                    </div>
                    <Badge variant="brand">
                      Appeals
                    </Badge>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <ArrowUpRight className="w-6 h-6 text-amber-600" />
                        <h4 className="font-bold text-amber-900">Select Appellate Board</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <button
                          onClick={() => setSelectedCaseType('BRB' as CaseType)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            selectedCaseType === 'BRB'
                              ? 'border-amber-600 bg-amber-100'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-lg font-bold text-slate-900">BRB</div>
                          <div className="text-xs text-slate-600 mt-1">Benefits Review Board</div>
                        </button>
                        <button
                          onClick={() => setSelectedCaseType('ARB' as CaseType)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            selectedCaseType === 'ARB'
                              ? 'border-amber-600 bg-amber-100'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-lg font-bold text-slate-900">ARB</div>
                          <div className="text-xs text-slate-600 mt-1">Admin Review Board</div>
                        </button>
                        <button
                          onClick={() => setSelectedCaseType('FECA' as CaseType)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            selectedCaseType === 'FECA'
                              ? 'border-amber-600 bg-amber-100'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-lg font-bold text-slate-900">ECAB</div>
                          <div className="text-xs text-slate-600 mt-1">Employees' Comp Appeals</div>
                        </button>
                      </div>
                    </div>

                    {/* Appeal form fields would go here - similar to New OALJ Filing */}
                    <div className="text-center py-8 text-slate-500">
                      <p>Appeal filing form coming soon...</p>
                      <p className="text-sm mt-2">For now, use the OALJ filing for motions and briefs.</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Access Request */}
            {view === 'access-request' && (
              <motion.div
                key="access-request"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="p-8">
                  {accessRequestStep === 'search' && (
                    <>
                      <div className="text-center mb-8">
                        <ShieldCheck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-slate-900">Request Case Access</h3>
                        <p className="text-slate-600 mt-2">Search for a case to request access as an attorney</p>
                      </div>
                      <div className="max-w-md mx-auto space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Case Number or Claim Number</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={accessSearchQuery}
                              onChange={(e) => setAccessSearchQuery(e.target.value.toUpperCase())}
                              placeholder="e.g., 2024-BLA-00042"
                              className="flex-grow px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onKeyDown={(e) => e.key === 'Enter' && handleAccessSearch()}
                            />
                            <Button onClick={handleAccessSearch} isLoading={isSearching}>
                              Search
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {accessRequestStep === 'details' && foundCase && (
                    <>
                      <div className="p-4 bg-slate-50 rounded-lg mb-6">
                        <div className="text-sm font-bold text-slate-900 mb-1">Case Found</div>
                        <div className="text-sm text-slate-700 font-mono">{foundCase.caseNumber}</div>
                        <div className="text-sm text-slate-700">{foundCase.title}</div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Claimant Name *</label>
                            <input
                              type="text"
                              value={accessFormData.claimantName}
                              onChange={(e) => updateAccessFormData('claimantName', e.target.value)}
                              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Bar Number *</label>
                            <input
                              type="text"
                              value={accessFormData.barNumber}
                              onChange={(e) => updateAccessFormData('barNumber', e.target.value)}
                              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., DC-123456"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Reason for Request *</label>
                          <select
                            value={accessFormData.reason}
                            onChange={(e) => updateAccessFormData('reason', e.target.value)}
                            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option>Retained as Counsel</option>
                            <option>Substitute Counsel</option>
                            <option>Associate Attorney</option>
                            <option>Legal Assistant</option>
                            <option>Interested Party</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Law Firm</label>
                          <input
                            type="text"
                            value={accessFormData.lawFirm}
                            onChange={(e) => updateAccessFormData('lawFirm', e.target.value)}
                            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Email *</label>
                          <input
                            type="email"
                            value={accessFormData.email}
                            onChange={(e) => updateAccessFormData('email', e.target.value)}
                            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Upload Notice of Appearance (NOA) *</label>
                          <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                            <input
                              type="file"
                              onChange={handleAccessFileChange}
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              id="access-upload"
                            />
                            <label htmlFor="access-upload" className="cursor-pointer text-center">
                              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                              <div className="text-sm font-medium text-slate-700">
                                {accessFile ? accessFile.name : 'Click to upload NOA'}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">PDF, DOC, or DOCX (max 10MB)</div>
                            </label>
                          </div>
                        </div>

                        {accessAiFeedback && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Activity className="w-4 h-4 text-blue-600" />
                              <div className="text-sm font-bold text-blue-900">AI Validation</div>
                            </div>
                            <div className="text-sm text-blue-700 whitespace-pre-line">{accessAiFeedback}</div>
                          </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setFoundCase(null);
                              setAccessRequestStep('search');
                            }}
                          >
                            Back
                          </Button>
                          <Button
                            onClick={handleAccessAIReview}
                            disabled={!accessFile || isAnalyzing}
                            leftIcon={<ShieldCheck className="w-4 h-4" />}
                          >
                            {isAnalyzing ? 'Reviewing...' : 'Review with AI'}
                          </Button>
                          <Button
                            onClick={handleSubmitAccessRequest}
                            isLoading={isSubmitting}
                            leftIcon={<CheckCircle className="w-4 h-4" />}
                          >
                            Submit Request
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {accessRequestStep === 'success' && (
                    <div className="text-center py-12">
                      <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted!</h3>
                      <p className="text-slate-600 mb-6">
                        Your access request has been submitted. You will receive an email notification once a clerk reviews your request.
                      </p>
                      <Button onClick={() => setView('my-cases')} leftIcon={<Briefcase className="w-4 h-4" />}>
                        Back to My Cases
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">Confirm Submission</h3>
              <p className="text-slate-600 mt-2">
                You are about to submit a <strong>{filingType}</strong> filing.
              </p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Case Type:</span>
                <span className="font-semibold">{selectedCaseType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Claimant:</span>
                <span className="font-semibold">{formData.claimantName}</span>
              </div>
              {preselectedCaseForFiling && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Case Number:</span>
                  <span className="font-semibold font-mono">{preselectedCaseForFiling.docketNumber}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Document:</span>
                <span className="font-semibold">{selectedFile?.name}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitFiling}
                isLoading={isSubmitting}
                className="flex-1"
                leftIcon={<CheckCircle className="w-4 h-4" />}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Case Intelligence Hub - Modern Case Viewer */}
      {selectedCaseForViewer && (
        <CaseIntelligenceHub
          caseNumber={selectedCaseForViewer}
          onClose={() => setSelectedCaseForViewer(null)}
          userRole={user?.role || 'Attorney'}
        />
      )}
    </div>
  );
}
