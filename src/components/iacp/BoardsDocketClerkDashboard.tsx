import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FilePlus,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  Eye,
  ArrowRight,
  Search,
  Filter,
  Download,
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Users,
  ShieldCheck,
  ArrowUpRight,
  History
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import CaseIntelligenceHub from '../oalj/CaseIntelligenceHub';
import CasesGallery from '../oalj/CasesGallery';
import AnalyticsDashboard from './AnalyticsDashboard';
import { MOCK_CASE_FOLDERS } from '../../data/mockDashboardData';
import { useAuth } from '../../context/AuthContext';

interface BoardsDocketClerkDashboardProps {
  onCaseSelect: (caseId: string) => void;
}

export default function BoardsDocketClerkDashboard({ onCaseSelect }: BoardsDocketClerkDashboardProps) {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'my-cases' | 'docket-queue' | 'assignment-queue' | 'analytics'>('dashboard');
  const [showCaseViewer, setShowCaseViewer] = useState(false);
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string | null>(null);
  const [filterDivision, setFilterDivision] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Get division from user context
  const userDivision = user?.division || 'BRB';

  // Filter cases by division and category
  const appealCases = MOCK_CASE_FOLDERS.filter(c => {
    const isAppeal = c.category === 'Appeal';
    const matchesDivision = filterDivision === 'all' || c.caseType === filterDivision;
    const matchesStatus = filterStatus === 'all' || c.urgency === filterStatus;
    
    // For Board roles, only show cases matching their division
    const matchesUserDivision = c.caseType === userDivision;
    
    return isAppeal && matchesDivision && matchesStatus && matchesUserDivision;
  });

  const stats = {
    totalAppeals: appealCases.length,
    pendingDocketing: appealCases.filter(c => c.status === 'New Filing').length,
    briefingDeadlines: appealCases.filter(c => c.nextEvent.includes('Brief')).length,
    urgentActions: appealCases.filter(c => c.urgency === 'High' || c.urgency === 'Critical').length,
  };

  const handleViewCase = (caseNumber: string) => {
    setSelectedCaseNumber(caseNumber);
    setShowCaseViewer(true);
  };

  const getDivisionIcon = (division: string) => {
    switch (division) {
      case 'BRB': return <ShieldCheck className="w-4 h-4" />;
      case 'ARB': return <ArrowUpRight className="w-4 h-4" />;
      case 'ECAB': return <History className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getDivisionColor = (division: string) => {
    switch (division) {
      case 'BRB': return 'border-amber-500 bg-amber-50';
      case 'ARB': return 'border-blue-500 bg-blue-50';
      case 'ECAB': return 'border-emerald-500 bg-emerald-50';
      default: return 'border-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* View Navigation */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'dashboard' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveView('my-cases')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'my-cases' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          All Appeals
        </button>
        <button
          onClick={() => setActiveView('docket-queue')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'docket-queue' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Docket Queue
        </button>
        <button
          onClick={() => setActiveView('analytics')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'analytics' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analytics
        </button>
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Division Banner */}
          <div className={`p-4 rounded-xl border-l-4 ${getDivisionColor(userDivision)}`}>
            <div className="flex items-center gap-3">
              {getDivisionIcon(userDivision)}
              <div>
                <div className="font-bold text-slate-900">{userDivision} Docket Clerk</div>
                <div className="text-sm text-slate-600">Managing {userDivision} appeals only</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Appeals</div>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold">{stats.totalAppeals}</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Pending Docketing</div>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-3xl font-bold">{stats.pendingDocketing}</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Briefing Deadlines</div>
                <Calendar className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold">{stats.briefingDeadlines}</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-red-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Urgent Actions</div>
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-bold">{stats.urgentActions}</div>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                Filter Appeals
              </h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Division</label>
                <select
                  value={userDivision}
                  disabled
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                >
                  <option value="BRB">BRB - Benefits Review Board</option>
                  <option value="ARB">ARB - Administrative Review Board</option>
                  <option value="ECAB">ECAB - Employees' Compensation Appeals Board</option>
                </select>
                <div className="text-xs text-slate-500 mt-1">Locked to your assigned division</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="High">High Urgency</option>
                  <option value="Medium">Medium Urgency</option>
                  <option value="Low">Low Urgency</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Recent Appeals */}
          <Card>
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Recent {userDivision} Appeals</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {appealCases.slice(0, 5).map((caseItem) => (
                <div key={caseItem.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      caseItem.caseType === 'BRB' ? 'bg-amber-50' :
                      caseItem.caseType === 'ARB' ? 'bg-blue-50' : 'bg-emerald-50'
                    }`}>
                      {getDivisionIcon(caseItem.caseType)}
                    </div>
                    <div>
                      <div className="text-sm font-bold font-mono">{caseItem.docketNumber}</div>
                      <div className="text-xs text-slate-500">{caseItem.title}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Next: {caseItem.nextEvent} • Due: {caseItem.nextDeadline}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        caseItem.urgency === 'Critical' ? 'error' :
                        caseItem.urgency === 'High' ? 'warning' :
                        caseItem.urgency === 'Medium' ? 'info' : 'success'
                      }
                      size="sm"
                    >
                      {caseItem.urgency}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewCase(caseItem.docketNumber)}
                      leftIcon={<Eye className="w-3 h-3" />}
                    >
                      View Case
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* My Cases View - All Appeals */}
      {activeView === 'my-cases' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <CasesGallery
            cases={appealCases}
            onCaseClick={handleViewCase}
          />
        </motion.div>
      )}

      {/* Docket Queue View */}
      {activeView === 'docket-queue' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Docket Queue - {userDivision}</h3>
            </div>
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Docket Management</h4>
              <p className="text-slate-600">Manage {userDivision} appeal docketing and panel assignments</p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <AnalyticsDashboard userRole={`Board Docket Clerk - ${userDivision}`} />
        </motion.div>
      )}

      {/* Case Intelligence Hub */}
      {showCaseViewer && selectedCaseNumber && (
        <CaseIntelligenceHub
          caseNumber={selectedCaseNumber}
          onClose={() => setShowCaseViewer(false)}
          userRole={`Board Docket Clerk - ${userDivision}`}
        />
      )}
    </div>
  );
}

// Add Calendar icon
function Calendar({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
