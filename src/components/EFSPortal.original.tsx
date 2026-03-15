import React, { useState } from 'react';
import { 
  FilePlus, 
  Search, 
  Clock, 
  FileCheck, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  User, 
  LogOut, 
  Briefcase, 
  Building2, 
  Activity,
  ShieldCheck,
  ArrowUpRight,
  History,
  Info
} from 'lucide-react';
import { Button, Card, Badge } from './UI';
import { motion, AnimatePresence } from 'motion/react';
import { CASE_TYPES, APPEAL_TYPES } from '../constants';
import { analyzeIntake, analyzeAccessRequest } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CaseType, AppealType } from '../types';

export default function EFSPortal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<'dashboard' | 'new-filing' | 'access-request' | 'my-cases' | 'case-details'>('dashboard');
  const [selectedMyCase, setSelectedMyCase] = useState<any | null>(null);
  const [filings, setFilings] = useState<any[]>([
    { id: 'INT-2024-001', type: 'New Claim', status: 'Accepted', date: '2024-02-20', caseNo: '2024-BLA-00042' },
    { id: 'INT-2024-005', type: 'Evidence Submission', status: 'Pending', date: '2024-02-24', caseNo: '2024-BLA-00042' },
    { id: 'INT-2024-008', type: 'Motion to Compel', status: 'Accepted', date: '2024-02-25', caseNo: '2024-LHC-00128' },
    { id: 'INT-2024-012', type: 'Notice of Appearance', status: 'Accepted', date: '2024-02-26', caseNo: 'BRB No. 24-0123 BLA' },
  ]);

  const [accessRequests, setAccessRequests] = useState<any[]>([
    { id: 'REQ-001', caseNumber: '2024-BLA-00042', requestedAt: '2024-02-25', status: 'Approved', reason: 'Retained as Counsel', verificationStatus: 'Verified' },
    { id: 'REQ-002', caseNumber: '2024-SOX-00015', requestedAt: '2024-02-26', status: 'Pending', reason: 'Interested Party', verificationStatus: 'Flagged' },
  ]);

  const [myCases, setMyCases] = useState<any[]>([
    { id: 'C1', docketNumber: '2024-BLA-00042', title: 'Smith v. Coal Co.', judge: 'Hon. Jane Doe', status: 'Active', type: 'BLA', parties: 'John Smith (Claimant) vs. Appalachian Coal Co. (Employer)' },
    { id: 'C2', docketNumber: '2024-LHC-00128', title: 'Johnson v. Port Authority', judge: 'Hon. Richard Roe', status: 'Active', type: 'LHC', parties: 'Robert Johnson (Claimant) vs. Metro Port Authority (Employer)' },
    { id: 'C3', docketNumber: 'BRB No. 24-0123 BLA', title: 'Williams v. Black Diamond', judge: 'Benefits Review Board', status: 'Appellate', type: 'BLA', parties: 'Sarah Williams (Petitioner) vs. Black Diamond Mining (Respondent)' },
  ]);
  const [selectedCaseForFiling, setSelectedCaseForFiling] = useState<any | null>(null);
  const [filingStep, setFilingStep] = useState<'type-selection' | 'case-selection' | 'form'>('type-selection');

  const [searchQuery, setSearchQuery] = useState('');
  const [foundCase, setFoundCase] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [requestStep, setRequestStep] = useState<'search' | 'details' | 'success'>('search');
  const [showAccessInstructions, setShowAccessInstructions] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [accessAiFeedback, setAccessAiFeedback] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [accessFile, setAccessFile] = useState<File | null>(null);
  const [filingType, setFilingType] = useState('New Case Filing');
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType>('BLA');
  const [claimNumber, setClaimNumber] = useState('');
  const [claimantDOB, setClaimantDOB] = useState('');
  const [claimantAddress, setClaimantAddress] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [insuranceCarrier, setInsuranceCarrier] = useState('');
  const [originatingDocketNumber, setOriginatingDocketNumber] = useState('');
  const [dateOfOrder, setDateOfOrder] = useState('');
  const [motionCategory, setMotionCategory] = useState('Extension of Time');
  const [opposingPartyPosition, setOpposingPartyPosition] = useState('Unopposed');
  const [isConfidential, setIsConfidential] = useState(false);
  const [briefType, setBriefType] = useState('Opening');
  const [barStatusCertified, setBarStatusCertified] = useState(false);
  const [isOCRValidated, setIsOCRValidated] = useState(false);
  const [isVirusScanned, setIsVirusScanned] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const [accessCaseType, setAccessCaseType] = useState<CaseType>('BLA');
  const [accessClaimantName, setAccessClaimantName] = useState('');
  const [accessReason, setAccessReason] = useState('Retained as Counsel');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const [isSearchingCase, setIsSearchingCase] = useState(false);
  const [caseSearchError, setCaseSearchError] = useState<string | null>(null);

  const handleSearchCaseForFiling = (docket: string) => {
    if (!docket) return;
    setIsSearchingCase(true);
    setCaseSearchError(null);
    
    setTimeout(() => {
      setIsSearchingCase(false);
      // Check if user already has access
      const accessibleCase = myCases.find(c => c.docketNumber.toLowerCase() === docket.toLowerCase());
      
      if (accessibleCase) {
        setSelectedCaseForFiling(accessibleCase);
        setFilingStep('form');
        setFilingType('New Motion');
      } else {
        // Simulate "Global" search
        if (docket.includes('00042') || docket.includes('0123') || docket.includes('12345')) {
          if (user.role.includes('Attorney')) {
            setCaseSearchError('Access Denied: You do not have an approved Notice of Appearance (NOA) for this case. You must submit an Access Request and be verified by a DOL Clerk before filing.');
          } else {
            setCaseSearchError('Access Denied: Your profile information (Name/SSN) does not match the records for this case. If you are the claimant, please submit an Access Request for manual verification.');
          }
        } else {
          setCaseSearchError('Case Not Found: The docket number entered does not match any records in CTS/AMS.');
        }
      }
    }, 1000);
  };

  const handleNewFiling = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const description = formData.get('description') as string;
    const claimantName = formData.get('claimantName') as string;
    const appealBoard = formData.get('appealBoard') as AppealType;

    let details = `Claimant: ${claimantName}. Description: ${description}. File: ${selectedFile?.name || 'None'}`;
    
    if (filingType === 'New Case Filing') {
      details += `. Claim #: ${claimNumber}. Program: ${selectedCaseType}. Employer: ${employerName}. Carrier: ${insuranceCarrier}`;
    } else {
      details += `. Anchored to Case: ${selectedCaseForFiling?.docketNumber || 'Unknown'}`;
      if (filingType === 'New Appeal') {
        details += `. Board: ${appealBoard}. Docket #: ${originatingDocketNumber}. Order Date: ${dateOfOrder}`;
      } else if (filingType === 'New Motion') {
        details += `. Category: ${motionCategory}. Position: ${opposingPartyPosition}`;
      } else if (filingType === 'New Brief') {
        details += `. Brief Type: ${briefType}. Confidential: ${isConfidential}`;
      }
    }

    setIsAnalyzing(true);
    const feedback = await analyzeIntake(details, filingType, user.role);
    setAiFeedback(feedback);
    setIsAnalyzing(false);
  };

  const handleCheckExistingCase = () => {
    if (!claimNumber) return;
    setIsCheckingExisting(true);
    setTimeout(() => {
      setIsCheckingExisting(false);
      // Mock check: if claim number contains '42', it's existing
      if (claimNumber.includes('42')) {
        if (confirm('A case with this claim number already exists in the system. Would you like to request access instead?')) {
          setSearchQuery(claimNumber);
          setView('access-request');
        }
      } else {
        alert('No existing case found. You may proceed with the new filing.');
      }
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setIsVirusScanned(false);
      setIsOCRValidated(false);
      
      // Simulate virus scan
      setTimeout(() => setIsVirusScanned(true), 1000);
      
      // Simulate OCR validation for attorneys
      if (user.role.includes('Attorney')) {
        setTimeout(() => setIsOCRValidated(true), 2000);
      }
    }
  };

  const handleConfirmSubmit = () => {
    setIsSubmitting(true);
    // Simulate automatic docketing and queue update
    const form = document.querySelector('form') as HTMLFormElement;
    const formData = new FormData(form);
    
    setTimeout(() => {
      const newId = `INT-2026-0${filings.length + 1}`;
      const isAppeal = filingType === 'Appeal';
      
      // Generate case number based on format
      const year = new Date().getFullYear();
      const seq = String(filings.length + 1).padStart(5, '0');
      
      let caseNo = '';
      if (isAppeal) {
        const appealType = formData.get('appealBoard') as AppealType || 'BRB';
        const prefix = APPEAL_TYPES[appealType]?.prefix || 'BRB No.';
        caseNo = `${prefix} ${String(year).slice(-2)}-${seq} ${selectedCaseType}`;
      } else {
        caseNo = `${year}-${selectedCaseType}-${seq}`;
      }

      const newFiling = {
        id: newId,
        type: filingType,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        caseNo: caseNo
      };

      setFilings([newFiling, ...filings]);
      setIsSubmitting(false);
      setAiFeedback(null);
      setView('dashboard');
      setSelectedFile(null);
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchCase = () => {
    if (!searchQuery) return;
    setIsSearching(true);
    // Mock search logic
    setTimeout(() => {
      setIsSearching(false);
      if (searchQuery.includes('00042') || searchQuery.includes('0123')) {
        setFoundCase({
          caseNumber: searchQuery,
          title: searchQuery.includes('BLA') ? 'Miller vs. Coal Corp' : 'Smith vs. Shipping Inc.',
          type: searchQuery.includes('BLA') ? 'Black Lung' : 'Longshore',
          status: 'Active'
        });
        setAccessClaimantName(searchQuery.includes('BLA') ? 'Robert Miller' : 'James Wilson');
        setAccessCaseType(searchQuery.includes('BLA') ? 'BLA' : 'LHC');
        setRequestStep('details');
      } else {
        alert('Case not found. Please check the case number and try again.');
      }
    }, 800);
  };

  const handleReviewAccessRequest = async () => {
    setIsAnalyzing(true);
    const details = `Case: ${foundCase?.caseNumber}. Claimant: ${accessClaimantName}. Type: ${accessCaseType}. Reason: ${accessReason}. File: ${accessFile?.name || 'None'}`;
    const feedback = await analyzeAccessRequest(details);
    setAccessAiFeedback(feedback);
    setIsAnalyzing(false);
  };

  const handleSubmitAccessRequest = (autoApprove: boolean = false) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newReq = {
        id: `REQ-00${accessRequests.length + 1}`,
        caseNumber: foundCase.caseNumber,
        requestedAt: new Date().toISOString().split('T')[0],
        status: autoApprove ? 'Approved' : 'Pending',
        reason: accessReason,
        verificationStatus: autoApprove ? 'Verified' : 'Pending Review'
      };
      setAccessRequests([newReq, ...accessRequests]);
      setIsSubmitting(false);
      setAccessAiFeedback(null);
      setRequestStep('success');
    }, 1500);
  };

  const isAttorney = user.role.includes('Attorney');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-slate-900 text-slate-300 flex flex-col">
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
        
        <nav className="flex-grow p-4 space-y-1">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 px-4">Main Menu</div>
          <button 
            id="nav-dashboard"
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${view === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            aria-label="Go to Dashboard"
          >
            <History className="w-4 h-4" />
            <span className="text-sm font-medium">My Filings</span>
          </button>
          <button 
            id="nav-new-filing"
            onClick={() => setView('new-filing')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${view === 'new-filing' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            aria-label="Submit New Filing"
          >
            <FilePlus className="w-4 h-4" />
            <span className="text-sm font-medium">New Filing</span>
          </button>
          <button 
            id="nav-access-request"
            onClick={() => setView('access-request')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${view === 'access-request' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            aria-label="Request Case Access"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-medium">Access Request</span>
          </button>
          
          {isAttorney && (
            <>
              <div className="pt-6 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">Professional</div>
              <button 
                onClick={() => setView('my-cases')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${view === 'my-cases' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
                aria-label="View My Cases"
              >
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-medium">My Cases</span>
              </button>
              <button 
                onClick={() => alert('Organization view coming soon')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all" 
                aria-label="View Organization Cases"
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
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-900/20 text-slate-500 hover:text-red-400 rounded-lg transition-all"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">
              {view === 'dashboard' ? 'Dashboard' : view === 'new-filing' ? 'Submit New Filing' : 'Request Case Access'}
            </h2>
            <Badge variant="info">{user.role} Portal</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search cases..." 
                onKeyDown={(e) => e.key === 'Enter' && alert(`Searching for: ${(e.target as HTMLInputElement).value}`)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all w-64"
              />
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 border-l-4 border-l-blue-500 cursor-pointer hover:bg-slate-50 transition-all" onClick={() => setView('my-cases')}>
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Active Cases</div>
                    <div className="text-3xl font-bold">12</div>
                  </Card>
                  <Card className="p-6 border-l-4 border-l-emerald-500 cursor-pointer hover:bg-slate-50 transition-all" onClick={() => alert('Viewing all accepted filings...')}>
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Accepted Filings</div>
                    <div className="text-3xl font-bold">48</div>
                  </Card>
                  <Card className="p-6 border-l-4 border-l-amber-500 cursor-pointer hover:bg-slate-50 transition-all" onClick={() => setView('dashboard')}>
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Pending Review</div>
                    <div className="text-3xl font-bold">3</div>
                  </Card>
                </div>

                <Card>
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2">
                      <History className="w-4 h-4 text-slate-400" />
                      Recent Filing Activity
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => alert('Full history view coming soon')}>View History</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                        <tr>
                          <th className="px-6 py-3">Intake ID</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Case Number</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filings.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{f.id}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {f.type === 'Appeal' ? <ArrowUpRight size={14} className="text-amber-500" /> : <FilePlus size={14} className="text-blue-500" />}
                                <span className="font-medium text-sm">{f.type}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{f.caseNo || 'Pending Docketing'}</td>
                            <td className="px-6 py-4">
                              <Badge variant={f.status === 'Accepted' ? 'success' : 'warning'}>{f.status}</Badge>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-medium">{f.date}</td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => alert(`Viewing details for filing ${f.id}`)}
                                className="p-2 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}

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
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => setView('dashboard')} className="p-0 h-auto text-slate-400 hover:text-blue-600">
                          <ChevronRight className="w-4 h-4 rotate-180" />
                          Back to Dashboard
                        </Button>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mt-2">New Adjudicatory Filing</h3>
                      <p className="text-sm text-slate-500 mt-1">Submit a new claim or appeal to the Department of Labor.</p>
                    </div>
                    <Badge variant="info">OALJ / Appeals</Badge>
                  </div>
                  
                  {filingStep === 'type-selection' && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Filing Category</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button 
                            onClick={() => { setFilingType('New Case Filing'); setFilingStep('form'); setSelectedCaseForFiling(null); }}
                            className="p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-left transition-all group"
                          >
                            <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4 group-hover:bg-blue-200">
                              <FilePlus className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-lg font-bold text-slate-800">New Case Intake</div>
                            <div className="text-sm text-slate-500 mt-1">Submit a new claim form to OALJ for the first time.</div>
                          </button>
                          
                          <button 
                            onClick={() => { setFilingStep('case-selection'); }}
                            className="p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-left transition-all group"
                          >
                            <div className="p-3 bg-emerald-100 rounded-xl w-fit mb-4 group-hover:bg-emerald-200">
                              <Activity className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="text-lg font-bold text-slate-800">File on Existing Case</div>
                            <div className="text-sm text-slate-500 mt-1">Submit a Motion, Evidence, or Brief on a case already in the system.</div>
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="ghost" onClick={() => setView('dashboard')}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  {filingStep === 'case-selection' && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Step 1: Select Case for Filing</label>
                        <div className="flex gap-2">
                          <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                              type="text" 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Enter Docket Number (e.g., 2024-BLA-00042)"
                              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                          </div>
                          <Button 
                            onClick={() => handleSearchCaseForFiling(searchQuery)}
                            disabled={isSearchingCase || !searchQuery}
                            className="px-8"
                          >
                            {isSearchingCase ? 'Searching...' : 'Search'}
                          </Button>
                        </div>
                        
                        {caseSearchError && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3"
                          >
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="space-y-2">
                              <p className="text-sm text-amber-800 font-medium">{caseSearchError}</p>
                              {caseSearchError.includes('Access Required') && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-amber-300 text-amber-800 hover:bg-amber-100"
                                  onClick={() => { setView('access-request'); setRequestStep('search'); setSearchQuery(searchQuery); }}
                                >
                                  Request Access Now
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Or Select from My Active Cases</label>
                        <div className="grid grid-cols-1 gap-3">
                          {myCases.map(c => (
                            <button 
                              key={c.id}
                              onClick={() => { setSelectedCaseForFiling(c); setFilingStep('form'); setFilingType('New Motion'); }}
                              className="p-4 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-left transition-all flex items-center justify-between group"
                            >
                              <div>
                                <div className="text-sm font-bold text-slate-800">{c.docketNumber}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{c.title}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant={c.status === 'Active' ? 'success' : 'info'}>{c.status}</Badge>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="ghost" onClick={() => setFilingStep('type-selection')}>Back</Button>
                        <Button variant="ghost" onClick={() => { setView('dashboard'); setFilingStep('type-selection'); }}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  {filingStep === 'form' && (
                    <>
                      <form className="space-y-8" onSubmit={handleNewFiling}>
                      {selectedCaseForFiling && (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Step 2: Case Header (Read-Only)</div>
                            <div className="flex items-center gap-2">
                              <Badge variant="info">{selectedCaseForFiling.type}</Badge>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="text-[10px] h-7 px-2 text-blue-600 hover:bg-blue-50"
                                onClick={() => { setFilingStep('case-selection'); setSelectedCaseForFiling(null); }}
                              >
                                Change Case
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase">Docket Number</div>
                              <div className="text-sm font-bold text-slate-800">{selectedCaseForFiling.docketNumber}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase">Case Title</div>
                              <div className="text-sm font-bold text-slate-800">{selectedCaseForFiling.title}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase">Presiding Authority</div>
                              <div className="text-sm font-bold text-slate-800">{selectedCaseForFiling.judge}</div>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-slate-200">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Parties</div>
                            <div className="text-xs text-slate-600 mt-1">{selectedCaseForFiling.parties}</div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Step 3: Action Selection</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {[
                            { id: 'New Case Filing', icon: FilePlus, label: 'New Case', sub: 'Trial Intake', hidden: !!selectedCaseForFiling },
                            { id: 'New Appeal', icon: ArrowUpRight, label: 'New Appeal', sub: 'Appellate' },
                            { id: 'New Motion', icon: Activity, label: 'New Motion', sub: 'Procedural', hidden: !selectedCaseForFiling },
                            { id: 'New Evidence', icon: FileCheck, label: 'Evidence', sub: 'Factual', hidden: !selectedCaseForFiling },
                            { id: 'New Brief', icon: User, label: 'New Brief', sub: 'Legal Arg', hidden: !selectedCaseForFiling },
                          ].filter(t => !t.hidden).map(t => (
                            <button 
                              key={t.id}
                              type="button"
                              onClick={() => setFilingType(t.id)}
                              className={`p-3 rounded-xl border-2 text-left transition-all ${filingType === t.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                              <t.icon className={`w-5 h-5 mb-2 ${filingType === t.id ? 'text-blue-600' : 'text-slate-400'}`} />
                              <div className="text-xs font-bold">{t.label}</div>
                              <div className="text-[10px] text-slate-500">{t.sub}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                    {filingType === 'New Case Filing' && (
                      <div className="space-y-6">
                        <div className="text-[10px] font-bold uppercase text-blue-600 tracking-widest mb-2">Step 4: Data Entry (Intake)</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Claim Identification (e.g., Claim Form)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={claimNumber}
                                onChange={(e) => setClaimNumber(e.target.value)}
                                className="flex-grow p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                placeholder="Claim Number"
                              />
                              <Button type="button" variant="outline" size="sm" onClick={handleCheckExistingCase} disabled={isCheckingExisting}>
                                {isCheckingExisting ? 'Checking...' : 'Check Existing'}
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Program Selection</label>
                            <select 
                              value={selectedCaseType}
                              onChange={(e) => setSelectedCaseType(e.target.value as CaseType)}
                              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                            >
                              {Object.entries(CASE_TYPES).map(([value, t]) => <option key={value} value={value}>{t.label}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Claimant Name</label>
                            <input name="claimantName" type="text" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Full Name" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Date of Birth</label>
                            <input type="date" value={claimantDOB} onChange={(e) => setClaimantDOB(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">SSN (Last 4)</label>
                            <input type="text" maxLength={4} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="XXXX" />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Claimant Address</label>
                          <textarea value={claimantAddress} onChange={(e) => setClaimantAddress(e.target.value)} rows={2} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Full Address"></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Employer Name</label>
                            <input type="text" value={employerName} onChange={(e) => setEmployerName(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Employer Name" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Insurance Carrier</label>
                            <input type="text" value={insuranceCarrier} onChange={(e) => setInsuranceCarrier(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Insurance Carrier" />
                          </div>
                        </div>
                      </div>
                    )}

                    {filingType === 'New Appeal' && (
                      <div className="space-y-6">
                        <div className="text-[10px] font-bold uppercase text-blue-600 tracking-widest mb-2">Step 4: Data Entry (Appeal)</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Originating Docket #</label>
                            <input type="text" value={originatingDocketNumber} onChange={(e) => setOriginatingDocketNumber(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="2023-LHC-00123" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Date of Order</label>
                            <input type="date" value={dateOfOrder} onChange={(e) => setDateOfOrder(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Board Selection</label>
                            <select name="appealBoard" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium">
                              {Object.entries(APPEAL_TYPES).map(([value, t]) => <option key={value} value={value}>{t.label}</option>)}
                            </select>
                          </div>
                        </div>
                        {user.role.includes('Attorney') && (
                          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <input type="checkbox" checked={barStatusCertified} onChange={(e) => setBarStatusCertified(e.target.checked)} className="w-4 h-4 text-blue-600" />
                            <label className="text-xs font-medium text-blue-800">I certify that I am a member in good standing of the Bar and meet the specific board's requirements.</label>
                          </div>
                        )}
                      </div>
                    )}

                    {filingType === 'New Motion' && (
                      <div className="space-y-6">
                        <div className="text-[10px] font-bold uppercase text-blue-600 tracking-widest mb-2">Step 4: Data Entry (Motion)</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Motion Category</label>
                            <select value={motionCategory} onChange={(e) => setMotionCategory(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium">
                              <option>Extension of Time</option>
                              <option>Motion to Compel</option>
                              <option>Motion to Withdraw</option>
                              <option>Motion for Summary Decision</option>
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Opposing Party Position</label>
                            <div className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                              {['Opposed', 'Unopposed', 'Unknown'].map(p => (
                                <label key={p} className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" name="position" value={p} checked={opposingPartyPosition === p} onChange={(e) => setOpposingPartyPosition(e.target.value)} className="w-4 h-4 text-blue-600" />
                                  <span className="text-xs font-medium">{p}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                        {motionCategory === 'Extension of Time' && (
                          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <div className="text-[10px] font-bold text-amber-800 uppercase mb-2">Date Calculation Widget</div>
                            <div className="text-xs text-amber-700">Based on current deadlines, the suggested new proposed deadline is: <strong>March 28, 2026</strong> (30-day extension).</div>
                          </div>
                        )}
                      </div>
                    )}

                    {(filingType === 'New Evidence' || filingType === 'New Brief') && (
                      <div className="space-y-6">
                        <div className="text-[10px] font-bold uppercase text-blue-600 tracking-widest mb-2">Step 4: Data Entry ({filingType.replace('New ', '')})</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {filingType === 'New Brief' && (
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Brief Type</label>
                              <select value={briefType} onChange={(e) => setBriefType(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium">
                                <option>Opening</option>
                                <option>Responsive</option>
                                <option>Supplemental</option>
                              </select>
                            </div>
                          )}
                          <div className="space-y-3 flex flex-col justify-end">
                            <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-xl border border-slate-200">
                              <input type="checkbox" checked={isConfidential} onChange={(e) => setIsConfidential(e.target.checked)} className="w-4 h-4 text-blue-600" />
                              <label className="text-xs font-medium text-slate-700">Privacy Shield (Medical records / Trade secrets)</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Filing Description</label>
                      <textarea 
                        name="description"
                        rows={3} 
                        required
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="Provide a detailed summary of the filing..."
                      ></textarea>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Document Upload & Validation</label>
                      <div className="relative">
                        <input 
                          type="file" 
                          id="file-upload"
                          className="hidden" 
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                        />
                        <label 
                          htmlFor="file-upload"
                          className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-blue-400 transition-all cursor-pointer bg-slate-50 block group"
                        >
                          {selectedFile ? (
                            <div className="flex flex-col items-center">
                              <div className="p-3 bg-emerald-100 rounded-full mb-3">
                                <FileCheck className="w-6 h-6 text-emerald-600" />
                              </div>
                              <div className="text-sm font-bold text-slate-700">{selectedFile.name}</div>
                              <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Click to change</div>
                              
                              <div className="mt-6 w-full max-w-xs space-y-3">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                  <span className="text-slate-500">Virus Scan</span>
                                  <span className={isVirusScanned ? 'text-emerald-600' : 'text-amber-500'}>
                                    {isVirusScanned ? 'Clean' : 'Scanning...'}
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: isVirusScanned ? '100%' : '40%' }}
                                    className={`h-full ${isVirusScanned ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                  />
                                </div>

                                {user.role.includes('Attorney') && (
                                  <>
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                      <span className="text-slate-500">OCR / Searchable PDF</span>
                                      <span className={isOCRValidated ? 'text-emerald-600' : 'text-amber-500'}>
                                        {isOCRValidated ? 'Validated' : 'Processing...'}
                                      </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: isOCRValidated ? '100%' : '20%' }}
                                        className={`h-full ${isOCRValidated ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="p-3 bg-slate-100 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                                <FilePlus className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                              </div>
                              <div className="text-sm font-bold text-slate-700">Click to upload or drag and drop</div>
                              <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">PDF, DOCX up to 50MB</div>
                              
                              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 text-[10px] text-amber-800 font-medium">
                                {filingType === 'New Case Filing' && (
                                  user.role.includes('Attorney') 
                                    ? "Mandatory: Notice of Appearance & Certificate of Service"
                                    : "Mandatory: Request for Hearing or Notification Letter"
                                )}
                                {filingType === 'New Appeal' && "Mandatory: Notice of Appeal"}
                                {filingType === 'New Brief' && user.role.includes('Attorney') && "Mandatory: Searchable PDF (OCR)"}
                              </div>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <div className="flex gap-3">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => {
                            if (selectedCaseForFiling) {
                              setFilingStep('case-selection');
                            } else {
                              setFilingStep('type-selection');
                            }
                          }}
                        >
                          Back
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => setView('dashboard')}>Cancel</Button>
                      </div>
                      <Button 
                        type="submit" 
                        disabled={
                          isAnalyzing || 
                          !selectedFile || 
                          !isVirusScanned || 
                          (user.role.includes('Attorney') && !isOCRValidated) ||
                          (filingType === 'New Appeal' && user.role.includes('Attorney') && !barStatusCertified)
                        } 
                        className="px-8"
                      >
                        {isAnalyzing ? 'AI Analyzing Filing...' : 'Review & Submit'}
                      </Button>
                    </div>
                  </form>

                  {aiFeedback && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-8 p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl"
                    >
                      <div className="flex items-center gap-3 text-blue-400 font-bold text-sm mb-4">
                        <Activity className="w-5 h-5" />
                        AI Intake Analysis (Pre-Docketing Check)
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed italic">
                        "{aiFeedback}"
                      </p>
                      <div className="mt-8 flex gap-3">
                        <Button 
                          className="flex-1 bg-blue-600 hover:bg-blue-700" 
                          onClick={handleConfirmSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Submitting...' : 'Confirm & Submit to Queue'}
                        </Button>
                        <Button variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setAiFeedback(null)}>Edit Details</Button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </Card>
          </motion.div>
        )}

            {view === 'my-cases' && (
              <motion.div 
                key="my-cases"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="p-6 border-l-4 border-l-blue-500">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Cases</div>
                    <div className="text-3xl font-bold">12</div>
                  </Card>
                  <Card className="p-6 border-l-4 border-l-amber-500">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Pending Actions</div>
                    <div className="text-3xl font-bold">4</div>
                  </Card>
                  <Card className="p-6 border-l-4 border-l-emerald-500">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Decided (YTD)</div>
                    <div className="text-3xl font-bold">8</div>
                  </Card>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800">My Represented Cases</h3>
                  <Button onClick={() => setView('access-request')} size="sm">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Request New Access
                  </Button>
                </div>

                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                        <tr>
                          <th className="px-6 py-3">Case Number</th>
                          <th className="px-6 py-3">Claimant</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Last Activity</th>
                          <th className="px-6 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {myCases.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{c.docketNumber}</td>
                            <td className="px-6 py-4 font-medium text-sm">{c.title.split(' v. ')[0]}</td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-bold uppercase">{c.type}</td>
                            <td className="px-6 py-4">
                              <Badge variant={c.status === 'Active' ? 'info' : 'success'}>{c.status}</Badge>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">{'2024-02-25'}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-xs h-8"
                                  onClick={() => {
                                    setSelectedCaseForFiling(c);
                                    setFilingStep('form');
                                    setFilingType('New Motion');
                                    setView('new-filing');
                                  }}
                                >
                                  <FilePlus className="w-3 h-3 mr-1" />
                                  File on Case
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-xs h-8"
                                  onClick={() => {
                                    setSelectedMyCase(c);
                                    setView('case-details');
                                  }}
                                >
                                  View Record
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}
            {view === 'case-details' && selectedMyCase && (
              <motion.div 
                key="case-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => setView('my-cases')}>
                      <ChevronRight className="w-4 h-4 rotate-180 mr-2" />
                      Back to Cases
                    </Button>
                    <h3 className="text-2xl font-bold text-slate-800">Case Record: {selectedMyCase.no}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => alert('Downloading full case record...')}>Download Record</Button>
                    <Button size="sm" onClick={() => { setFilingType('Evidence'); setView('new-filing'); }}>File Document</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                      <h4 className="text-sm font-bold uppercase text-slate-400 tracking-widest mb-4">Case Information</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Claimant</div>
                          <div className="text-sm font-medium">{selectedMyCase.name}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Case Status</div>
                          <Badge variant={selectedMyCase.status === 'Active' ? 'info' : 'success'}>{selectedMyCase.status}</Badge>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Case Type</div>
                          <div className="text-sm font-medium">{selectedMyCase.type}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Last Activity</div>
                          <div className="text-sm font-medium">{selectedMyCase.last}</div>
                        </div>
                      </div>
                    </Card>

                    <Card>
                      <div className="p-6 border-b border-slate-100">
                        <h4 className="text-sm font-bold uppercase text-slate-400 tracking-widest">Official Case File</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                            <tr>
                              <th className="px-6 py-3">Document Name</th>
                              <th className="px-6 py-3">Date Filed</th>
                              <th className="px-6 py-3">Filed By</th>
                              <th className="px-6 py-3"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {[
                              { name: 'Initial Claim Submission', date: '2024-01-15', by: 'Claimant' },
                              { name: 'Notice of Appearance', date: '2024-01-20', by: 'Attorney' },
                              { name: 'Medical Report - Dr. Smith', date: '2024-02-10', by: 'Attorney' },
                              { name: 'Employer Response', date: '2024-02-15', by: 'Employer' },
                            ].map((doc, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 text-sm font-medium">{doc.name}</td>
                                <td className="px-6 py-4 text-xs text-slate-500">{doc.date}</td>
                                <td className="px-6 py-4 text-xs text-slate-500">{doc.by}</td>
                                <td className="px-6 py-4 text-right">
                                  <Button variant="ghost" size="sm" onClick={() => alert(`Downloading ${doc.name}`)}>View</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="p-6 bg-slate-50 border-slate-200">
                      <h4 className="text-sm font-bold uppercase text-slate-400 tracking-widest mb-4">Upcoming Deadlines</h4>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 shrink-0">
                            <Clock size={20} />
                          </div>
                          <div>
                            <div className="text-xs font-bold">Evidence Submission</div>
                            <div className="text-[10px] text-slate-500">Due in 12 days</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                            <Activity size={20} />
                          </div>
                          <div>
                            <div className="text-xs font-bold">Status Conference</div>
                            <div className="text-[10px] text-slate-500">Scheduled for March 15</div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h4 className="text-sm font-bold uppercase text-slate-400 tracking-widest mb-4">Case Contacts</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Assigned ALJ</span>
                          <span className="text-xs font-medium">Judge Jenkins</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Docket Clerk</span>
                          <span className="text-xs font-medium">Sarah Connor</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'access-request' && (
              <motion.div 
                key="access-request"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <Card className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Request Case Access</h3>
                    <p className="text-sm text-slate-500 mt-2">Search for existing OALJ or Appeal cases to request representative access.</p>
                  </div>

                  {requestStep === 'search' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Case or Appeal Number</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="e.g., 2024-BLA-00042 or BRB No. 24-0123"
                            className="flex-grow p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          />
                          <Button variant="primary" onClick={handleSearchCase} disabled={isSearching}>
                            {isSearching ? 'Searching...' : 'Search'}
                          </Button>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                        <button 
                          onClick={() => setShowAccessInstructions(!showAccessInstructions)}
                          className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors mb-4"
                        >
                          {showAccessInstructions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {showAccessInstructions ? 'Hide Requirements & Instructions' : 'Show Requirements & Instructions'}
                        </button>
                        
                        <AnimatePresence>
                          {showAccessInstructions && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-4 pb-4">
                                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                  <div className="text-xs text-blue-800 leading-relaxed">
                                    <p className="font-bold mb-1">Core Information Requirements</p>
                                    <p>To locate the correct file, you must provide the <strong>Case Number (Docket Number)</strong>, the <strong>Claimant’s Full Legal Name</strong>, and the <strong>Case Type</strong> (e.g., Black Lung, Longshore, Whistleblower).</p>
                                  </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">Required Documentation ("The Proof")</h4>
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-[11px] font-bold text-slate-700 mb-1">For Attorneys & Professional Representatives:</p>
                                      <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 ml-2">
                                        <li><strong>Notice of Appearance:</strong> A formal legal document stating you represent a party in the case.</li>
                                        <li><strong>Evidence of Representation:</strong> A signed Retainer Agreement or Letter of Authorization if a Notice of Appearance hasn't been filed yet.</li>
                                      </ul>
                                    </div>
                                    <div>
                                      <p className="text-[11px] font-bold text-slate-700 mb-1">For Self-Represented (Pro Se) Claimants:</p>
                                      <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 ml-2">
                                        <li><strong>Government-Issued Photo ID:</strong> To verify your identity matches the claimant on record.</li>
                                        <li><strong>The Original Claim Form:</strong> A copy of the Miner’s Claim for Benefits or Employee’s Claim for Compensation.</li>
                                      </ul>
                                    </div>
                                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                      <p className="text-[11px] font-bold text-amber-800 mb-1">For Legal Support Staff:</p>
                                      <p className="text-[11px] text-amber-700">Staff members do not request access directly. The Lead Attorney must first gain access and then "delegate" that access to you within the portal settings.</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {requestStep === 'details' && foundCase && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Found Case Title</div>
                            <div className="text-sm font-bold">{foundCase.title}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Case Number</div>
                            <div className="text-sm font-bold">{foundCase.caseNumber}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Claimant Name (Verify)</label>
                          <input 
                            type="text" 
                            value={accessClaimantName}
                            onChange={(e) => setAccessClaimantName(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="Full Legal Name"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Case Type</label>
                          <select 
                            value={accessCaseType}
                            onChange={(e) => setAccessCaseType(e.target.value as CaseType)}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                          >
                            {Object.entries(CASE_TYPES).map(([value, t]) => <option key={value} value={value}>{t.label}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Reason for Access</label>
                        <select 
                          value={accessReason}
                          onChange={(e) => setAccessReason(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                        >
                          <option value="Retained as Counsel">Retained as Counsel</option>
                          <option value="Interested Party">Interested Party</option>
                          <option value="Successor in Interest">Successor in Interest</option>
                          <option value="Other Legal Representative">Other Legal Representative</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Upload Proof of Representation / Identity</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            id="access-file-upload"
                            className="hidden" 
                            onChange={(e) => e.target.files && setAccessFile(e.target.files[0])}
                            accept=".pdf,.jpg,.png"
                          />
                          <label 
                            htmlFor="access-file-upload"
                            className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-blue-400 transition-all cursor-pointer bg-slate-50 block group"
                          >
                            {accessFile ? (
                              <div className="flex flex-col items-center">
                                <div className="p-2 bg-emerald-100 rounded-full mb-2">
                                  <FileCheck className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="text-sm font-bold text-slate-700">{accessFile.name}</div>
                                <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{(accessFile.size / 1024 / 1024).toFixed(2)} MB • Click to change</div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <FilePlus className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
                                <div className="text-sm font-medium text-slate-600">Drop authorization or ID document here</div>
                                <p className="text-[10px] text-slate-400 mt-1">PDF, JPG, or PNG up to 10MB</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-6 border-t border-slate-100">
                        <Button variant="ghost" onClick={() => setRequestStep('search')}>Back</Button>
                        <Button 
                          className="flex-1 bg-dol-blue hover:bg-blue-900"
                          onClick={handleReviewAccessRequest}
                          disabled={isAnalyzing || !accessFile || !accessClaimantName}
                        >
                          {isAnalyzing ? 'AI Analyzing Request...' : 'Review Access Request'}
                        </Button>
                      </div>

                      {accessAiFeedback && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-6 p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl"
                        >
                          <div className="flex items-center gap-3 text-blue-400 font-bold text-sm mb-4">
                            <ShieldCheck className="w-5 h-5" />
                            AI Access Validation
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed italic">
                            "{accessAiFeedback}"
                          </p>
                          <div className="mt-6 flex gap-3">
                            <Button 
                              className="flex-1 bg-blue-600 hover:bg-blue-700" 
                              onClick={() => handleSubmitAccessRequest(true)}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Processing...' : 'Confirm & Submit Request'}
                            </Button>
                            <Button variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setAccessAiFeedback(null)}>Edit Details</Button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {requestStep === 'success' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileCheck className="w-10 h-10 text-emerald-600" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Request Submitted Successfully</h4>
                      <p className="text-sm text-slate-500 mb-8">
                        Your request for access to case {foundCase?.caseNumber} has been submitted. 
                        You can track the status in the "My Access Requests" table below.
                      </p>
                      <Button variant="primary" onClick={() => { setRequestStep('search'); setView('dashboard'); }}>Return to Dashboard</Button>
                    </motion.div>
                  )}
                </Card>

                <Card>
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      My Access Requests
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                        <tr>
                          <th className="px-6 py-3">Request ID</th>
                          <th className="px-6 py-3">Case Number</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Verification</th>
                          <th className="px-6 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {accessRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{req.id}</td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{req.caseNumber}</td>
                            <td className="px-6 py-4">
                              <Badge variant={req.status === 'Approved' ? 'success' : req.status === 'Denied' ? 'error' : 'warning'}>
                                {req.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${req.verificationStatus === 'Verified' ? 'bg-emerald-500' : req.verificationStatus === 'Flagged' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                                <span className="text-xs font-medium text-slate-600">{req.verificationStatus}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-medium">{req.requestedAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
