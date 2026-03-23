import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FilePlus,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  Search,
  Filter,
  Download,
  Eye,
  Send,
  Repeat,
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Users
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import ActionMenu, { ActionItems } from '../UI/ActionMenu';
import CaseIntelligenceHub from '../oalj/CaseIntelligenceHub';
import CasesGallery from '../oalj/CasesGallery';
import AnalyticsDashboard from './AnalyticsDashboard';
import { MOCK_CASE_FOLDERS } from '../../data/mockDashboardData';
import { useAuth } from '../../context/AuthContext';
import { useAssignJudge, useAutoDocket, useIntakeQueue, useJudgeSuggestions } from '../../hooks/useFilings';
import { Spinner } from '../UI/Spinner';
import { ErrorToast } from '../UI/ErrorToast';
import { Skeleton } from '../UI/Skeleton';
import type { IntakeQueueItem } from '../../services/api';

interface DocketClerkDashboardProps {
  onCaseSelect: (caseId: string) => void;
}

type Filing = Omit<IntakeQueueItem, 'queueStatus'> & {
  status: 'Auto-Docket Ready' | 'Manual Review' | 'Processing' | 'Deficiency Notice Sent' | 'Docketed';
};

export default function DocketClerkDashboard({ onCaseSelect }: DocketClerkDashboardProps) {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'my-cases' | 'docket-queue' | 'assignment-queue' | 'analytics'>('dashboard');
  const [showCaseViewer, setShowCaseViewer] = useState(false);
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string | null>(null);
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedForAssignment, setSelectedForAssignment] = useState<any | null>(null);
  const [localQueueUpdates, setLocalQueueUpdates] = useState<Record<string, Partial<Filing>>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const {
    data: intakeQueue = [],
    isLoading,
    error,
    refetch,
  } = useIntakeQueue();
  const autoDocketMutation = useAutoDocket();
  const assignJudgeMutation = useAssignJudge();
  const { data: suggestedJudges = [], isLoading: isLoadingSuggestions } = useJudgeSuggestions(selectedForAssignment?.caseType);

  const filings: Filing[] = intakeQueue.map((item) => ({
    ...item,
    status: item.queueStatus,
    ...localQueueUpdates[item.id],
  }));

  const stats = {
    totalIntake: filings.length,
    autoDocketed: filings.filter(f => f.status === 'Docketed' || f.status === 'Auto-Docket Ready').length,
    manualReview: filings.filter(f => f.status === 'Manual Review').length,
    deficiencyNotices: filings.filter(f => f.status === 'Deficiency Notice Sent').length,
    awaitingAssignment: filings.filter(f => f.status === 'Docketed').length,
  };

  const handleViewCase = (caseNumber: string) => {
    setSelectedCaseNumber(caseNumber);
    setShowCaseViewer(true);
  };

  const handleCloseCaseViewer = () => {
    setShowCaseViewer(false);
    setSelectedCaseNumber(null);
  };

  const handleAutoDocket = async (intakeId: string) => {
    const item = filings.find(f => f.id === intakeId);
    if (!item) return;
    
    setIsProcessing(true);
    setProcessingMessage('Submitting docket request to the API...');
    
    try {
      const result = await autoDocketMutation.mutateAsync(intakeId);

      setLocalQueueUpdates((prev) => ({
        ...prev,
        [intakeId]: {
          status: 'Docketed',
          docketNumber: result.docket_number,
          docketedAt: new Date().toLocaleString(),
        },
      }));

      setProcessingMessage(`Successfully docketed as ${result.docket_number}`);
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingMessage('');
      }, 1200);
    } catch (error) {
      console.error('Auto-docketing error:', error);
      setIsProcessing(false);
    }
  };

  const handleSendDeficiency = (intakeId: string) => {
    const item = filings.find(f => f.id === intakeId);
    if (!item) return;
    
    setLocalQueueUpdates((prev) => ({
      ...prev,
      [intakeId]: {
        status: 'Deficiency Notice Sent',
        deficiencySentAt: new Date().toLocaleString(),
      },
    }));
  };

  const handleAssignToJudge = (intakeId: string) => {
    const item = filings.find(f => f.id === intakeId);
    if (!item) return;
    
    setSelectedForAssignment(item);
    setShowAssignmentModal(true);
  };

  const handleConfirmAssignment = async (judgeId: string) => {
    const judge = suggestedJudges.find((suggestion) => suggestion.judge_id === judgeId);
    if (!judge || !selectedForAssignment) return;

    await assignJudgeMutation.mutateAsync({
      filingId: selectedForAssignment.id,
      judgeId,
      judgeName: judge.name,
    });

    setLocalQueueUpdates((prev) => ({
      ...prev,
      [selectedForAssignment.id]: {
        assignedJudge: judge.name,
        assignedAt: new Date().toLocaleString(),
      },
    }));

    setShowAssignmentModal(false);
    setSelectedForAssignment(null);
  };

  const handleTransferCase = (caseNumber: string) => {
    alert(`Transfer Case: ${caseNumber}\n\nSelect reason:\n- Conflict of Interest\n- Judicial Workload Balance\n- Geographic Reassignment\n- Board Remand\n- Retirement/Recusal`);
  };

  const filteredQueue = filings.filter(item => {
    if (filterChannel !== 'all' && item.channel !== filterChannel) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (searchQuery && !item.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.claimant.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (isLoading) {
    return <Spinner label="Loading intake queue..." />;
  }

  if (error) {
    return <ErrorToast error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      {/* Analytics Bar - Always on Top */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Intake</div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalIntake}</div>
          <div className="text-xs text-slate-500 mt-1">This week</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Auto-Docketed</div>
          <div className="text-2xl font-bold text-slate-900">{stats.autoDocketed}</div>
          <div className="text-xs text-emerald-600 mt-1">{Math.round(stats.autoDocketed / stats.totalIntake * 100)}% auto-processed</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Manual Review</div>
          <div className="text-2xl font-bold text-slate-900">{stats.manualReview}</div>
          <div className="text-xs text-slate-500 mt-1">Requires action</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Deficiency Notices</div>
          <div className="text-2xl font-bold text-slate-900">{stats.deficiencyNotices}</div>
          <div className="text-xs text-slate-500 mt-1">Sent to filers</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Awaiting Assignment</div>
          <div className="text-2xl font-bold text-slate-900">{stats.awaitingAssignment}</div>
          <div className="text-xs text-slate-500 mt-1">Ready for judge</div>
        </Card>
      </div>

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
          My Cases
        </button>
        <button
          onClick={() => setActiveView('docket-queue')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'docket-queue' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FilePlus className="w-4 h-4" />
          Docket Queue
        </button>
        <button
          onClick={() => setActiveView('assignment-queue')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'assignment-queue' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Assignment Queue
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
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('docket-queue')}>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FilePlus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Docket New Filing</div>
                  <div className="text-xs text-slate-500">Process intake & assign docket number</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600">{stats.manualReview}</div>
              <div className="text-xs text-slate-500 mt-1">Cases awaiting docketing</div>
            </Card>

            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('docket-queue')}>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Issue Deficiency</div>
                  <div className="text-xs text-slate-500">Send deficiency notice to filer</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-amber-600">{stats.deficiencyNotices}</div>
              <div className="text-xs text-slate-500 mt-1">Deficiency notices sent</div>
            </Card>

            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('assignment-queue')}>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Assign to Judge</div>
                  <div className="text-xs text-slate-500">Smart assignment based on workload</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-600">{stats.awaitingAssignment}</div>
              <div className="text-xs text-slate-500 mt-1">Cases ready for assignment</div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* My Cases View */}
      {activeView === 'my-cases' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">My Cases (Read-Only)</h3>
          </div>
          <Card>
            <div className="p-6">
              <div className="text-sm text-slate-600 mb-4">View OALJ cases with read-only access. Use Docket Queue for docketing actions.</div>
              <CasesGallery cases={MOCK_CASE_FOLDERS.filter(c => c.category === 'Adjudication')} onCaseClick={handleViewCase} />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Docket Queue View */}
      {activeView === 'docket-queue' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Docket Queue</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by ID or claimant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <select
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Channels</option>
                <option value="UFS">UFS</option>
                <option value="Email">Email</option>
                <option value="Paper">Paper</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="Auto-Docket Ready">Auto-Docket Ready</option>
                <option value="Manual Review">Manual Review</option>
                <option value="Deficiency Notice Sent">Deficiency Notice Sent</option>
                <option value="Docketed">Docketed</option>
              </select>
            </div>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Channel</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Filing ID</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Case Info</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Received</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Score</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQueue.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-10">
                        <div className="text-center text-sm text-slate-500">No intake items match the current filters.</div>
                      </td>
                    </tr>
                  )}
                  {filteredQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`p-2 rounded-lg w-fit ${
                          item.channel === 'UFS' ? 'bg-blue-50' :
                          item.channel === 'Email' ? 'bg-purple-50' : 'bg-amber-50'
                        }`}>
                          {item.channel === 'UFS' ? <FilePlus className="w-4 h-4 text-blue-600" /> :
                           item.channel === 'Email' ? <Mail className="w-4 h-4 text-purple-600" /> :
                           <FileText className="w-4 h-4 text-amber-600" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold font-mono text-slate-900">{item.id}</div>
                        <div className="text-xs text-slate-500">{item.caseType}</div>
                        {item.docketNumber && (
                          <div className="text-xs text-emerald-600 font-bold mt-1">Docket: {item.docketNumber}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{item.claimant}</div>
                        <div className="text-xs text-slate-500">v. {item.employer}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">{item.receivedAt.split(' ')[0]}</div>
                        <div className="text-xs text-slate-400">{item.receivedAt.split(' ')[1]} {item.receivedAt.split(' ')[2]}</div>
                        {item.docketedAt && (
                          <div className="text-xs text-emerald-600 mt-1">Docketed: {item.docketedAt.split(' ')[0]}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`text-sm font-bold ${
                            item.aiScore >= 90 ? 'text-emerald-600' :
                            item.aiScore >= 70 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {item.aiScore}%
                          </div>
                          {item.aiScore >= 90 ? <CheckCircle className="w-4 h-4 text-emerald-600" /> :
                           item.aiScore >= 70 ? <AlertCircle className="w-4 h-4 text-amber-600" /> :
                           <AlertCircle className="w-4 h-4 text-red-600" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            item.status === 'Auto-Docket Ready' ? 'success' :
                            item.status === 'Manual Review' ? 'warning' :
                            item.status === 'Deficiency Notice Sent' ? 'error' :
                            item.status === 'Docketed' ? 'info' :
                            'neutral'
                          }
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                        {item.deficiencies.length > 0 && (
                          <div className="text-xs text-red-600 mt-1">
                            {item.deficiencies.length} issue(s)
                          </div>
                        )}
                        {item.deficiencySentAt && (
                          <div className="text-xs text-slate-500 mt-1">Sent: {item.deficiencySentAt.split(' ')[0]}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <ActionMenu
                            items={[
                              ActionItems.viewCase(() => handleViewCase(item.docketNumber || item.id)),
                              ...(item.status === 'Auto-Docket Ready' ? [
                                { ...ActionItems.autoDocket(() => handleAutoDocket(item.id)), dividerAfter: true },
                              ] : []),
                              ...(item.status === 'Manual Review' && item.deficiencies.length > 0 ? [
                                { ...ActionItems.sendDeficiency(() => handleSendDeficiency(item.id)), dividerAfter: true },
                              ] : []),
                              ...(item.status === 'Docketed' ? [
                                { ...ActionItems.assignToJudge(() => handleAssignToJudge(item.id)), dividerAfter: true },
                              ] : []),
                            ]}
                            contextInfo={[
                              {
                                label: 'Status:',
                                value: (
                                  <Badge
                                    variant={
                                      item.status === 'Auto-Docket Ready' ? 'success' :
                                      item.status === 'Manual Review' ? 'warning' :
                                      item.status === 'Deficiency Notice Sent' ? 'error' :
                                      item.status === 'Docketed' ? 'info' :
                                      'neutral'
                                    }
                                    size="sm"
                                  >
                                    {item.status}
                                  </Badge>
                                ),
                              },
                              ...(item.deficiencies.length > 0 ? [
                                {
                                  label: 'Deficiencies:',
                                  value: <span className="text-red-600">⚠️ {item.deficiencies.length} issue(s)</span>,
                                },
                              ] : []),
                            ]}
                          />
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

      {/* Assignment Queue View */}
      {activeView === 'assignment-queue' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Assignment Queue</h3>
          </div>
          <Card>
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Cases Ready for Judge Assignment</h4>
              <p className="text-slate-600 mb-6">{stats.awaitingAssignment} cases awaiting smart assignment</p>
              <Button onClick={() => setActiveView('docket-queue')} leftIcon={<FilePlus className="w-4 h-4" />}>
                Go to Docket Queue
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <AnalyticsDashboard userRole={user?.role || 'OALJ Docket Clerk'} />
        </motion.div>
      )}

      {/* Case Intelligence Hub */}
      {showCaseViewer && selectedCaseNumber && (
        <CaseIntelligenceHub
          caseNumber={selectedCaseNumber}
          onClose={handleCloseCaseViewer}
          userRole="OALJ Docket Clerk"
        />
      )}

      {/* Judge Assignment Modal */}
      {showAssignmentModal && selectedForAssignment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Assign Case to Judge</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {selectedForAssignment.docketNumber || selectedForAssignment.id} - {selectedForAssignment.claimant} v. {selectedForAssignment.employer}
                </p>
              </div>
              <button onClick={() => setShowAssignmentModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-blue-900">AI-Powered Assignment Suggestions</div>
                    <div className="text-sm text-blue-700 mt-1">
                      Based on workload balance (40%), geographic district (30%), case expertise (20%), and rotation (10%)
                    </div>
                  </div>
                </div>
              </div>

              {suggestedJudges.map((suggestion, idx) => (
                <div
                  key={suggestion.judge_id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    idx === 0 ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleConfirmAssignment(suggestion.judge_id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{suggestion.name}</div>
                        <div className="text-xs text-slate-500">{suggestion.office}</div>
                      </div>
                    </div>
                    {idx === 0 && (
                      <Badge variant="success" size="sm">Recommended</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <div className="text-xs text-slate-500">Match Score</div>
                      <div className="font-bold text-slate-900">{suggestion.score}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Case Type</div>
                      <div className="font-bold text-slate-900">{selectedForAssignment.caseType}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Office</div>
                      <div className="font-bold text-slate-900">{suggestion.office}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="neutral" size="sm">Suggested by API</Badge>
                    <Badge variant="neutral" size="sm">Score {suggestion.score}</Badge>
                  </div>
                </div>
              ))}

              {isLoadingSuggestions && (
                <div className="space-y-3">
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAssignmentModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleConfirmAssignment(suggestedJudges[0]?.judge_id)}
                isLoading={assignJudgeMutation.isPending}
                disabled={!suggestedJudges[0]}
              >
                Assign to Recommended Judge
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <div className="text-lg font-bold text-slate-900">{processingMessage}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
