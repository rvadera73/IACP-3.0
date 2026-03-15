/**
 * Case Intelligence Hub - IACP Case Viewer Component
 * 
 * A high-fidelity, role-adaptive case viewer for OALJ and Boards adjudication.
 * Aligns with HCD Principles and Digital Playbook standards.
 * 
 * Features:
 * - 3-Pane Layout (Header, Entity Navigator, Workspace)
 * - Procedural & Appellate attribute support
 * - Role-based AI Intelligence widgets
 * - Modern Gov-Tech aesthetic
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, FileText, Users, Calendar, Scale, BookOpen, Clock, AlertCircle,
  CheckCircle, Search, MessageSquare, Download, Upload, Eye, Edit3,
  MessageSquareText, TrendingUp, Shield, Gavel, Briefcase, History,
  FolderOpen, Tag, Link, ChevronRight, ChevronDown, Star, Bookmark,
  Filter, SortAsc, ExternalLink, Copy, Share2, MoreVertical, Plus,
  AlertTriangle, Info, Zap, Brain, Target, Activity, BarChart3
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import { useAuth } from '../../context/AuthContext';
import { COMPREHENSIVE_MOCK_CASES, type MockCaseData } from '../../data/mockCaseData';
import DocumentViewer from './DocumentViewer';

// ============================================================================
// Type Definitions
// ============================================================================

interface CaseIntelligenceHubProps {
  caseNumber: string;
  onClose: () => void;
  userRole?: string;
}

type PaneView = 'parties' | 'evidence' | 'history' | 'logistics' | 'heritage' | 'briefing' | 'record';
type DocumentTab = 'filings' | 'decisions' | 'orders' | 'transcripts' | 'exhibits' | 'memos';
type CasePerspective = 'trial' | 'appellate';

// Re-export types from mock data
type Party = import('../../data/mockCaseData').Party;
type Document = import('../../data/mockCaseData').Document;
type Motion = import('../../data/mockCaseData').Motion;
type AIInsight = import('../../data/mockCaseData').AIInsight;

// ============================================================================
// Helper Functions
// ============================================================================

// Fallback data generator for unknown cases
const getFallbackCaseData = (caseNumber: string): MockCaseData => {
  const isBoard = caseNumber.includes('BRB') || caseNumber.includes('ARB') || caseNumber.includes('ECAB');
  const caseType = caseNumber.includes('BLA') ? 'Black Lung' :
                   caseNumber.includes('LHC') ? 'Longshore' :
                   caseNumber.includes('PER') ? 'BALCA/PERM' :
                   caseNumber.includes('BRB') ? 'Benefits Review Board' :
                   caseNumber.includes('ARB') ? 'Administrative Review Board' :
                   caseNumber.includes('ECAB') ? 'Employees Compensation' : 'Unknown';

  return {
    docketNumber: caseNumber,
    programArea: isBoard ? `${caseType} (Appeal)` : `${caseType}`,
    proceduralState: isBoard ? 'On Appeal' : 'Active',
    perspective: isBoard ? 'appellate' : 'trial',
    filedAt: '2024-01-15',
    docketedAt: '2024-01-16',
    daysElapsed: 45,
    daysToDecision: isBoard ? 60 : 225,
    deadlineDate: isBoard ? '2024-06-01' : '2024-10-12',
    claimant: isBoard ? 'Petitioner' : 'Claimant',
    employer: isBoard ? 'Respondent' : 'Employer',
    office: 'Washington, DC',
    parties: [],
    motions: [],
    documents: [],
    heritage: { priorClaims: [], consolidatedCases: [], relatedAppeals: [] },
    aiSummary: `This ${caseType} case is currently ${isBoard ? 'on appeal' : 'active'}. The case was filed on 2024-01-15 and is proceeding through the adjudication process. No detailed AI summary is available for this case yet. Please check back after initial filings have been reviewed.`,
    aiInsights: [
      { type: 'info' as const, title: 'Case Loading', description: 'Limited data available. Complete case summary pending.' },
    ],
  };
};

// ============================================================================
// Role-Based AI Intelligence Configuration
// ============================================================================

const getAIInsights = (role: string, caseData: any): AIInsight[] => {
  const insights: AIInsight[] = [];

  switch (role) {
    case 'OALJ Docket Clerk':
    case 'Board Docket Clerk':
      if (!caseData.parties?.every((p: Party) => p.represented)) {
        insights.push({
          type: 'warning',
          title: 'Pro Se Party Detected',
          description: 'This case has a self-represented party. Ensure proper service via certified mail.',
          action: 'Review Service Requirements',
        });
      }
      if (caseData.daysElapsed > 30 && caseData.proceduralState === 'Pending Docketing') {
        insights.push({
          type: 'error',
          title: 'Docketing Delay',
          description: `Case has been pending docketing for ${caseData.daysElapsed} days.`,
          action: 'Expedite Docketing',
        });
      }
      break;

    case 'OALJ Legal Assistant':
    case 'Board Legal Assistant':
      if (caseData.proceduralState === 'Pre-Hearing' || caseData.proceduralState === 'Hearing') {
        insights.push({
          type: 'info',
          title: 'Hearing Logistics',
          description: 'Verify court reporter and interpreter assignments for upcoming hearings.',
          action: 'Check Logistics',
        });
      }
      break;

    case 'OALJ Attorney-Advisor':
    case 'Board Attorney-Advisor':
      insights.push({
        type: 'success',
        title: 'Precedent Match',
        description: 'Found 3 relevant prior decisions based on legal issues in this case.',
        action: 'View Precedents',
      });
      if (caseData.motions?.some((m: Motion) => m.status === 'Pending')) {
        insights.push({
          type: 'warning',
          title: 'Pending Motions',
          description: `${caseData.motions.filter((m: Motion) => m.status === 'Pending').length} motion(s) awaiting review.`,
          action: 'Review Motions',
        });
      }
      break;

    case 'Administrative Law Judge':
    case 'Board Member':
      if (caseData.daysElapsed > 180 && !caseData.hasDraftDecision) {
        insights.push({
          type: 'error',
          title: 'Adjudication Risk',
          description: `Case is ${caseData.daysElapsed} days old with no draft decision.`,
          action: 'Start Draft',
        });
      }
      if (caseData.daysToDecision < 30) {
        insights.push({
          type: 'warning',
          title: 'Deadline Approaching',
          description: `Only ${caseData.daysToDecision} days remaining to statutory deadline.`,
          action: 'Prioritize Decision',
        });
      }
      break;
  }

  return insights;
};

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Header Component - Identity Block
 */
const Header: React.FC<{
  caseData: any;
  onClose: () => void;
  userRole: string;
  perspective: CasePerspective;
}> = ({ caseData, onClose, userRole, perspective }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);

  const deadlineColor = caseData.daysToDecision < 30 ? 'text-red-600 bg-red-50' :
                        caseData.daysToDecision < 60 ? 'text-amber-600 bg-amber-50' :
                        'text-emerald-600 bg-emerald-50';

  return (
    <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
      {/* Top Bar - Identity */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="info" size="sm">{caseData.programArea}</Badge>
              <Badge variant={caseData.proceduralState === 'Active' ? 'success' : 'warning'} size="sm">
                {caseData.proceduralState}
              </Badge>
              {perspective === 'appellate' && (
                <Badge variant="neutral" size="sm">Appeal</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-mono">{caseData.docketNumber}</h1>
            <p className="text-sm text-slate-600 mt-1">
              {perspective === 'trial' ? `${caseData.claimant} v. ${caseData.employer}` :
                                        `${caseData.petitioner} v. ${caseData.respondent}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Export Record
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Statutory Countdown */}
        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg ${deadlineColor}`}>
          <Clock className="w-5 h-5" />
          <div className="text-sm">
            <span className="font-bold">{caseData.daysToDecision} days</span>
            <span className="ml-2">to statutory deadline</span>
            <span className="ml-2 text-slate-500">(Due: {caseData.deadlineDate})</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Search & AI */}
      <div className="px-6 pb-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents, filings, motions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<MessageSquareText className="w-4 h-4 text-purple-600" />}
          onClick={() => setShowChatbot(!showChatbot)}
        >
          Ask AI
        </Button>
      </div>

      {/* AI Chatbot Panel */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-4 overflow-hidden"
          >
            <Card className="border-purple-200 bg-purple-50">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-slate-900">AI Case Assistant</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask about this case..."
                    className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button variant="outline" size="sm">Ask</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Left Pane - Entity Navigator
 */
const EntityNavigator: React.FC<{
  activeView: PaneView;
  onViewChange: (view: PaneView) => void;
  perspective: CasePerspective;
  caseData: any;
}> = ({ activeView, onViewChange, perspective, caseData }) => {
  const navItems: { id: PaneView; label: string; icon: any; count?: number }[] = [
    { id: 'parties', label: 'Parties', icon: Users, count: caseData.parties?.length },
    { id: 'evidence', label: 'Evidence Vault', icon: FolderOpen },
    { id: 'history', label: 'Procedural History', icon: History },
  ];

  if (perspective === 'trial') {
    navItems.push({ id: 'logistics', label: 'Logistics', icon: Calendar });
  } else {
    navItems.push({ id: 'briefing', label: 'Briefing Timeline', icon: BookOpen });
    navItems.push({ id: 'record', label: 'Lower Court Record', icon: Scale });
  }

  navItems.push({ id: 'heritage', label: 'Case Heritage', icon: Link });

  return (
    <div className="w-64 border-r border-slate-200 bg-slate-50 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeView === item.id
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-4 h-4 ${activeView === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </div>
            {item.count !== undefined && (
              <Badge variant="neutral" size="sm">{item.count}</Badge>
            )}
          </button>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-slate-200">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Case Stats</h3>
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
            <span className="font-bold text-slate-900">{caseData.daysElapsed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Center Pane - Workspace
 */
const Workspace: React.FC<{
  activeView: PaneView;
  caseData: any;
  userRole: string;
  perspective: CasePerspective;
  setSelectedDocument: (doc: any) => void;
  setShowDocumentViewer: (show: boolean) => void;
}> = ({ activeView, caseData, userRole, perspective, setSelectedDocument, setShowDocumentViewer }) => {
  const [activeDocTab, setActiveDocTab] = useState<DocumentTab>('filings');
  const [showAnnotation, setShowAnnotation] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedFiling, setSelectedFiling] = useState<Motion | null>(null);
  const [showFilingDetails, setShowFilingDetails] = useState(false);

  const aiInsights = useMemo(() => getAIInsights(userRole, caseData), [userRole, caseData]);

  // Render content based on active view
  const renderViewContent = () => {
    switch (activeView) {
      case 'parties':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Parties & Representatives
            </h3>
            <div className="space-y-3">
              {caseData.parties?.map((party: Party, idx: number) => (
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
                    {party.represented && party.attorney && (
                      <div className="text-sm text-slate-600">
                        <div>Attorney: {party.attorney}</div>
                        <div>Email: {party.email}</div>
                        <div>Service: {party.servicePreference === 'electronic' ? 'Electronic' : 'Certified Mail'}</div>
                      </div>
                    )}
                    {!party.represented && (
                      <div className="text-sm text-slate-600">
                        <div className="text-amber-600 font-medium">⚠️ Self-Represented</div>
                        <div>Email: {party.email || 'N/A'}</div>
                        <div>Phone: {party.phone || 'N/A'}</div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'evidence':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                Evidence Vault
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" leftIcon={<Upload className="w-3 h-3" />}>Upload</Button>
                <Button variant="outline" size="sm" leftIcon={<Filter className="w-3 h-3" />}>Filter</Button>
              </div>
            </div>

            {/* Document Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200">
              {(['filings', 'exhibits', 'decisions', 'orders', 'transcripts', 'memos'] as DocumentTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDocTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
                    activeDocTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Document List */}
            <div className="space-y-2">
              {caseData.documents?.filter((d: Document) => d.type === activeDocTab).map((doc: Document, idx: number) => (
                <Card key={idx}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="font-bold text-slate-900">{doc.name}</div>
                        <div className="text-xs text-slate-500">
                          Filed: {doc.filedAt} • By: {doc.filedBy} • {doc.size} • {doc.pages} pages
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          doc.status === 'Accepted' || doc.status === 'Admitted' ? 'success' :
                          doc.status === 'Rejected' ? 'error' :
                          'warning'
                        }
                        size="sm"
                      >
                        {doc.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye className="w-3 h-3" />}
                        onClick={() => {
                          console.log('View clicked for document:', doc);
                          setSelectedDocument(doc);
                          setShowDocumentViewer(true);
                          console.log('State set - selectedDocument:', doc, 'showDocumentViewer: true');
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Download className="w-3 h-3" />}
                        onClick={() => {
                          console.log('Download clicked for document:', doc.name);
                          // Download functionality - create text file
                          const mockContent = `
DEPARTMENT OF LABOR - ${doc.type.toUpperCase()}
Document: ${doc.name}
Filed: ${doc.filedAt}
By: ${doc.filedBy}
Status: ${doc.status}
Size: ${doc.size}
Pages: ${doc.pages}

This is a text representation of the document.
In production, this would be the actual PDF content.
`.trim();
                          
                          const blob = new Blob([mockContent], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${doc.name.replace(/\s+/g, '_')}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          console.log('Download completed');
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Procedural History & Motions
            </h3>

            {/* Motions Log */}
            <Card>
              <div className="p-4 border-b border-slate-200">
                <h4 className="font-bold text-slate-900">Motions</h4>
              </div>
              <div className="divide-y divide-slate-100">
                {caseData.motions?.map((motion: Motion, idx: number) => (
                  <div 
                    key={idx} 
                    className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                    onClick={() => {
                      setSelectedFiling(motion);
                      setShowFilingDetails(true);
                    }}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{motion.type}</div>
                      <div className="text-xs text-slate-500">Filed: {motion.filedAt}</div>
                      {motion.ruling && (
                        <div className="text-xs text-slate-600 mt-1">Ruling: {motion.ruling} ({motion.rulingDate})</div>
                      )}
                    </div>
                    <Badge
                      variant={
                        motion.status === 'Granted' ? 'success' :
                        motion.status === 'Denied' ? 'error' :
                        motion.status === 'Pending' ? 'warning' :
                        'neutral'
                      }
                      size="sm"
                    >
                      {motion.status}
                    </Badge>
                  </div>
                ))}
                {(!caseData.motions || caseData.motions.length === 0) && (
                  <div className="p-8 text-center text-slate-500">No motions filed</div>
                )}
              </div>
            </Card>

            {/* Timeline */}
            <Card>
              <div className="p-4 border-b border-slate-200">
                <h4 className="font-bold text-slate-900">Case Timeline</h4>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-900">Case Filed</div>
                    <div className="text-xs text-slate-500">{caseData.filedAt}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-900">Docketed</div>
                    <div className="text-xs text-slate-500">{caseData.docketedAt}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-900">Current State</div>
                    <div className="text-xs text-slate-500">{caseData.proceduralState}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'briefing':
        if (perspective !== 'appellate') return <div>Not applicable for trial cases</div>;
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Appellate Briefing Timeline
            </h3>

            <div className="grid grid-cols-3 gap-4">
              {Object.entries(caseData.briefingSchedule || {}).map(([stage, data]: [string, any]) => (
                <Card key={stage}>
                  <div className="p-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{stage.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className={`text-lg font-bold mb-1 ${
                      data.status === 'Filed' ? 'text-emerald-600' :
                      data.status === 'Pending' ? 'text-amber-600' :
                      'text-slate-400'
                    }`}>
                      {data.status}
                    </div>
                    <div className="text-xs text-slate-500">Due: {data.due}</div>
                    {data.filedDate && (
                      <div className="text-xs text-emerald-600 mt-1">Filed: {data.filedDate}</div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'record':
        if (perspective !== 'appellate') return <div>Not applicable for trial cases</div>;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                Certified Record Snapshot
              </h3>
              <Badge variant="neutral">Read-Only</Badge>
            </div>

            <Card className="border-slate-200 bg-slate-50">
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-slate-500">OALJ Docket Number</div>
                    <div className="font-bold text-slate-900 font-mono">{caseData.oaljRecord?.docketNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">ALJ Decision</div>
                    <div className="font-bold text-slate-900">{caseData.oaljRecord?.aljDecision}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Decision Date</div>
                    <div className="font-bold text-slate-900">{caseData.oaljRecord?.aljDecisionDate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Record Size</div>
                    <div className="font-bold text-slate-900">{caseData.oaljRecord?.recordPages} pages</div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-200">
                  <Button variant="outline" size="sm" leftIcon={<FileText className="w-3 h-3" />}>
                    View Exhibits ({caseData.oaljRecord?.exhibits})
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<BookOpen className="w-3 h-3" />}>
                    View Transcripts ({caseData.oaljRecord?.transcripts})
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<Download className="w-3 h-3" />}>
                    Download Record
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'heritage':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Link className="w-5 h-5 text-blue-600" />
              Case Heritage & Related Matters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <div className="p-4">
                  <div className="text-xs text-slate-500 mb-2">Prior Claims</div>
                  <div className="space-y-2">
                    {caseData.heritage?.priorClaims?.map((claim: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-slate-700">{claim.split(' ')[0]}</span>
                        <Badge variant="neutral" size="sm">{claim.split(' ')[1]?.replace(/[()]/g, '')}</Badge>
                      </div>
                    ))}
                    {(!caseData.heritage?.priorClaims || caseData.heritage.priorClaims.length === 0) && (
                      <div className="text-sm text-slate-500">No prior claims</div>
                    )}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-4">
                  <div className="text-xs text-slate-500 mb-2">Consolidated Cases</div>
                  <div className="space-y-2">
                    {caseData.heritage?.consolidatedCases?.map((claim: string, idx: number) => (
                      <div key={idx} className="text-sm font-mono text-slate-700">{claim}</div>
                    ))}
                    {(!caseData.heritage?.consolidatedCases || caseData.heritage.consolidatedCases.length === 0) && (
                      <div className="text-sm text-slate-500">No consolidated cases</div>
                    )}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-4">
                  <div className="text-xs text-slate-500 mb-2">Related Appeals</div>
                  <div className="space-y-2">
                    {caseData.heritage?.relatedAppeals?.map((claim: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-slate-700">{claim.split(' ')[0]}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </div>
                    ))}
                    {(!caseData.heritage?.relatedAppeals || caseData.heritage.relatedAppeals.length === 0) && (
                      <div className="text-sm text-slate-500">No related appeals</div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="p-6 space-y-6">
        {/* AI Summary Panel - Always shown first */}
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-bold text-slate-900">AI Case Summary</h3>
                <p className="text-xs text-slate-500">Intelligent analysis of case record</p>
              </div>
              <Badge variant="info" size="sm" className="ml-auto">Auto-Generated</Badge>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{caseData.aiSummary || 'No AI summary available for this case.'}</p>
            {caseData.aiInsights && caseData.aiInsights.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-purple-200">
                {caseData.aiInsights.map((insight: AIInsight, idx: number) => (
                  <Badge
                    key={idx}
                    variant={
                      insight.type === 'error' ? 'error' :
                      insight.type === 'warning' ? 'warning' :
                      insight.type === 'success' ? 'success' :
                      'info'
                    }
                    size="sm"
                  >
                    {insight.title}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* AI Intelligence Widget - Role Specific */}
        {aiInsights.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              Role-Based Intelligence ({userRole})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsights.map((insight, idx) => (
                <Card
                  key={idx}
                  className={`border-l-4 ${
                    insight.type === 'error' ? 'border-l-red-500 bg-red-50' :
                    insight.type === 'warning' ? 'border-l-amber-500 bg-amber-50' :
                    insight.type === 'success' ? 'border-l-emerald-500 bg-emerald-50' :
                    'border-l-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {insight.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-600" /> :
                       insight.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
                       insight.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> :
                       <Info className="w-5 h-5 text-blue-600" />}
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">{insight.title}</div>
                        <div className="text-sm text-slate-700 mt-1">{insight.description}</div>
                        {insight.action && (
                          <Button variant="outline" size="sm" className="mt-2">
                            {insight.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* View Content */}
        {renderViewContent()}

        {/* Filing Details Modal */}
        {showFilingDetails && selectedFiling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowFilingDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Filing Details</h3>
                  <p className="text-sm text-slate-600">{selectedFiling.type}</p>
                </div>
                <button onClick={() => setShowFilingDetails(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Filed</div>
                    <div className="font-bold text-slate-900">{selectedFiling.filedAt}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Status</div>
                    <Badge
                      variant={
                        selectedFiling.status === 'Granted' ? 'success' :
                        selectedFiling.status === 'Denied' ? 'error' :
                        selectedFiling.status === 'Pending' ? 'warning' :
                        'neutral'
                      }
                      size="sm"
                    >
                      {selectedFiling.status}
                    </Badge>
                  </div>
                </div>

                {selectedFiling.ruling && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Ruling</div>
                    <div className="font-bold text-slate-900">{selectedFiling.ruling}</div>
                    {selectedFiling.rulingDate && (
                      <div className="text-xs text-slate-500 mt-1">Date: {selectedFiling.rulingDate}</div>
                    )}
                  </div>
                )}

                <Card className="bg-slate-50">
                  <div className="p-4">
                    <div className="text-xs text-slate-500 mb-2">Documents Associated</div>
                    <div className="space-y-2">
                      {caseData.documents?.filter((d: Document) => d.type === 'filings').slice(0, 3).map((doc: Document, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <div>
                              <div className="text-sm font-bold text-slate-900">{doc.name}</div>
                              <div className="text-xs text-slate-500">{doc.size} • {doc.pages} pages</div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Download className="w-3 h-3" />}
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDocumentViewer(true);
                            }}
                          >
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" leftIcon={<Eye className="w-4 h-4" />}>
                    View All Documents
                  </Button>
                  <Button variant="outline" className="flex-1" leftIcon={<MessageSquare className="w-4 h-4" />}>
                    Add Comment
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export default function CaseIntelligenceHub({ caseNumber, onClose, userRole = 'OALJ Docket Clerk' }: CaseIntelligenceHubProps) {
  const [activeView, setActiveView] = useState<PaneView>('parties');
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const { user } = useAuth();

  // Get case data (in production, fetch from API)
  const caseData = useMemo(() => {
    // Try exact match first
    if (COMPREHENSIVE_MOCK_CASES[caseNumber]) {
      return COMPREHENSIVE_MOCK_CASES[caseNumber];
    }

    // Try partial match for Board cases
    const partialMatch = Object.keys(COMPREHENSIVE_MOCK_CASES).find(key =>
      key.includes(caseNumber) || caseNumber.includes(key)
    );
    if (partialMatch) {
      return COMPREHENSIVE_MOCK_CASES[partialMatch];
    }

    // Use fallback data generator for unknown cases
    return getFallbackCaseData(caseNumber);
  }, [caseNumber]);

  const perspective = caseData.perspective || 'trial';

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[1600px] max-h-[95vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Identity Block */}
        <Header
          caseData={caseData}
          onClose={onClose}
          userRole={userRole}
          perspective={perspective}
        />

        {/* Main Content - 2-Pane Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Pane - Entity Navigator */}
          <EntityNavigator
            activeView={activeView}
            onViewChange={setActiveView}
            perspective={perspective}
            caseData={caseData}
          />

          {/* Center Pane - Workspace */}
          <Workspace
            activeView={activeView}
            caseData={caseData}
            userRole={userRole}
            perspective={perspective}
            setSelectedDocument={setSelectedDocument}
            setShowDocumentViewer={setShowDocumentViewer}
          />
        </div>
      </motion.div>

      {/* Document Viewer Modal - Moved outside main container */}
      <DocumentViewer
        isOpen={showDocumentViewer}
        onClose={() => {
          setShowDocumentViewer(false);
          setSelectedDocument(null);
        }}
        docData={selectedDocument}
      />
    </motion.div>
  );
}
