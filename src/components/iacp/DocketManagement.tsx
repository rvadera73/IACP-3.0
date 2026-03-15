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
  Download
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import { autoDocketFiling, generateDeficiencyNotice, validateFilingForDocketing } from '../../services/autoDocketing';
import { getSuggestedJudges, type Judge } from '../../services/smartAssignment';
import CaseIntelligenceHub from '../oalj/CaseIntelligenceHub';

interface DocketManagementProps {
  onCaseSelect: (caseId: string) => void;
}

export default function DocketManagement({ onCaseSelect }: DocketManagementProps) {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [showCaseViewer, setShowCaseViewer] = useState(false);
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedForAssignment, setSelectedForAssignment] = useState<any | null>(null);
  const [suggestedJudges, setSuggestedJudges] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  // Mock judges data for assignment
  const judges: Judge[] = [
    { id: 'J001', name: 'Hon. Sarah Jenkins', office: 'Pittsburgh, PA', activeCases: 24, weightedLoad: 58, capacity: 75, specialty: ['BLA', 'LHC'], compliance270: 96, pendingDecisions: 5 },
    { id: 'J002', name: 'Hon. Michael Ross', office: 'New York, NY', activeCases: 18, weightedLoad: 42, capacity: 75, specialty: ['LHC', 'PER'], compliance270: 100, pendingDecisions: 3 },
    { id: 'J003', name: 'Hon. Patricia Chen', office: 'San Francisco, CA', activeCases: 32, weightedLoad: 78, capacity: 75, specialty: ['BLA'], compliance270: 88, pendingDecisions: 8 },
    { id: 'J004', name: 'Hon. James Wilson', office: 'Washington, DC', activeCases: 12, weightedLoad: 28, capacity: 75, specialty: ['PER', 'WB'], compliance270: 100, pendingDecisions: 2 },
  ];

  // Mock intake queue data
  const intakeQueue = [
    {
      id: 'INT-2026-00089',
      channel: 'UFS',
      caseType: 'BLA',
      claimant: 'Robert Martinez',
      employer: 'Apex Coal Mining',
      receivedAt: '2026-03-11 09:23 AM',
      status: 'Auto-Docket Ready',
      deficiencies: [],
      aiScore: 98,
      documents: [{ name: 'LS-203.pdf', pages: 4 }],
    },
    {
      id: 'INT-2026-00090',
      channel: 'Email',
      caseType: 'LHC',
      claimant: 'Sarah Chen',
      employer: 'Pacific Stevedoring',
      receivedAt: '2026-03-11 08:45 AM',
      status: 'Manual Review',
      deficiencies: ['Missing Signature', 'Illegible SSN'],
      aiScore: 65,
      documents: [{ name: 'scan_20260311.pdf', pages: 3 }],
    },
    {
      id: 'INT-2026-00091',
      channel: 'Paper',
      caseType: 'PER',
      claimant: 'TechCorp Industries',
      employer: 'N/A',
      receivedAt: '2026-03-10 04:15 PM',
      status: 'Processing',
      deficiencies: [],
      aiScore: 88,
      documents: [{ name: 'BALCA_Appeal.pdf', pages: 12 }],
    },
    {
      id: 'INT-2026-00092',
      channel: 'UFS',
      caseType: 'BLA',
      claimant: 'James Wilson',
      employer: 'Eastern Coal Co.',
      receivedAt: '2026-03-10 02:30 PM',
      status: 'Deficiency Notice Sent',
      deficiencies: ['Missing Employer EIN'],
      aiScore: 72,
      documents: [{ name: 'Claim_Form.pdf', pages: 5 }],
      deficiencySentAt: '2026-03-10 03:00 PM',
    },
  ];

  const handleViewCase = (caseId: string) => {
    setSelectedCase(caseId);
    setShowCaseViewer(true);
  };

  const handleAutoDocket = async (intakeId: string) => {
    const item = intakeQueue.find(i => i.id === intakeId);
    if (!item) return;
    
    setIsProcessing(true);
    setProcessingMessage('Running AI validation...');
    
    // Simulate filing data
    const filingData = {
      claimantName: item.claimant,
      employerName: item.employer,
      ssn: '***-**-4567',
      dateOfBirth: '1970-01-15',
      dateOfInjury: '2025-12-15',
      signature: 'Signed',
    };
    
    try {
      const result = await autoDocketFiling(filingData, item.caseType, 'Sample document text');
      
      if (result.success) {
        setProcessingMessage(`✅ Successfully docketed as ${result.docketNumber}`);
        // Update the queue item status
        setTimeout(() => {
          setIsProcessing(false);
          setProcessingMessage('');
          alert(`Case ${result.docketNumber} has been docketed. Ready for judge assignment.`);
        }, 2000);
      } else {
        setProcessingMessage(`⚠️ ${result.message}`);
        setTimeout(() => {
          setIsProcessing(false);
          setProcessingMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Auto-docketing error:', error);
      setIsProcessing(false);
    }
  };

  const handleSendDeficiency = (intakeId: string) => {
    const item = intakeQueue.find(i => i.id === intakeId);
    if (!item) return;
    
    const notice = generateDeficiencyNotice(
      { claimantName: item.claimant },
      item.deficiencies.map((d: string) => ({
        id: '1',
        type: 'Missing Required Field' as const,
        field: d,
        description: d,
        severity: 'Critical' as const,
        autoFixable: false,
      })),
      item.claimant
    );
    
    console.log('Deficiency Notice:', notice);
    alert('Deficiency notice generated and sent to filer.');
  };

  const handleAssignToJudge = (intakeId: string) => {
    const item = intakeQueue.find(i => i.id === intakeId);
    if (!item) return;
    
    setSelectedForAssignment(item);
    
    // Get suggested judges
    const suggestions = getSuggestedJudges(judges, {
      caseType: item.caseType as 'BLA' | 'LHC' | 'PER',
      office: 'Pittsburgh, PA',
    });
    
    setSuggestedJudges(suggestions);
    setShowAssignmentModal(true);
  };

  const handleConfirmAssignment = (judgeId: string) => {
    const judge = judges.find(j => j.id === judgeId);
    if (!judge || !selectedForAssignment) return;
    
    alert(`Case assigned to ${judge.name}\n\nLoad Score: ${judge.weightedLoad}/${judge.capacity}\nSpecialty: ${judge.specialty.join(', ')}\n270-Day Compliance: ${judge.compliance270}%`);
    setShowAssignmentModal(false);
    setSelectedForAssignment(null);
  };

  // Filter intake queue
  const filteredQueue = intakeQueue.filter(item => {
    if (filterChannel !== 'all' && item.channel !== filterChannel) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (searchQuery && !item.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.claimant.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button leftIcon={<Upload className="w-4 h-4" />}>
            Upload Document
          </Button>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export Queue
          </Button>
        </div>
        
        {/* Filters */}
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
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Intake</div>
          <div className="text-2xl font-bold text-slate-900">{intakeQueue.length}</div>
          <div className="text-xs text-slate-500 mt-1">This week</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Ready to Docket</div>
          <div className="text-2xl font-bold text-slate-900">
            {intakeQueue.filter(i => i.status === 'Auto-Docket Ready').length}
          </div>
          <div className="text-xs text-emerald-600 mt-1">AI-verified</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Needs Review</div>
          <div className="text-2xl font-bold text-slate-900">
            {intakeQueue.filter(i => i.status === 'Manual Review').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Clerk action required</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Deficiency Notices</div>
          <div className="text-2xl font-bold text-slate-900">
            {intakeQueue.filter(i => i.status === 'Deficiency Notice Sent').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Awaiting response</div>
        </Card>
      </div>

      {/* Intake Queue Table */}
      <Card>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Intake Queue</h3>
            <Badge variant="info">{filteredQueue.length} items</Badge>
          </div>
        </div>
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
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{item.claimant}</div>
                    <div className="text-xs text-slate-500">v. {item.employer}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">{item.receivedAt.split(' ')[0]}</div>
                    <div className="text-xs text-slate-400">{item.receivedAt.split(' ')[1]} {item.receivedAt.split(' ')[2]}</div>
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
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCase(item.id)}
                        leftIcon={<Eye className="w-3 h-3" />}
                      >
                        View
                      </Button>
                      
                      {item.status === 'Auto-Docket Ready' && (
                        <Button
                          size="sm"
                          onClick={() => handleAutoDocket(item.id)}
                          leftIcon={<CheckCircle className="w-3 h-3" />}
                        >
                          Docket
                        </Button>
                      )}
                      
                      {item.status === 'Manual Review' && item.deficiencies.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendDeficiency(item.id)}
                          leftIcon={<AlertCircle className="w-3 h-3" />}
                        >
                          Deficiency
                        </Button>
                      )}
                      
                      {item.status === 'Auto-Docket Ready' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignToJudge(item.id)}
                          rightIcon={<ArrowRight className="w-3 h-3" />}
                        >
                          Assign
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Case Intelligence Hub */}
      {showCaseViewer && selectedCase && (
        <CaseIntelligenceHub
          caseNumber={selectedCase}
          onClose={() => setShowCaseViewer(false)}
          userRole="OALJ Docket Clerk"
        />
      )}

      {/* Judge Assignment Modal */}
      {showAssignmentModal && selectedForAssignment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Assign Case to Judge</h3>
                <button onClick={() => setShowAssignmentModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Case: {selectedForAssignment.id} - {selectedForAssignment.claimant} v. {selectedForAssignment.employer}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-blue-900">AI-Powered Assignment Suggestions</div>
                    <div className="text-sm text-blue-700 mt-1">
                      Based on workload balance (40%), geographic district (30%), case expertise (20%), and rotation (10%)
                    </div>
                  </div>
                </div>
              </div>

              {suggestedJudges.map((suggestion, idx) => (
                <div
                  key={suggestion.judge.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    idx === 0 ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleConfirmAssignment(suggestion.judge.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {suggestion.rank}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{suggestion.judge.name}</div>
                        <div className="text-xs text-slate-500">{suggestion.judge.office}</div>
                      </div>
                    </div>
                    {idx === 0 && (
                      <Badge variant="success" size="sm">Recommended</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <div className="text-xs text-slate-500">Workload</div>
                      <div className="font-bold text-slate-900">{suggestion.judge.weightedLoad}/{suggestion.judge.capacity}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Specialty</div>
                      <div className="font-bold text-slate-900">{suggestion.judge.specialty.join(', ')}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">270-Day</div>
                      <div className={`font-bold ${
                        suggestion.judge.compliance270 >= 95 ? 'text-emerald-600' :
                        suggestion.judge.compliance270 >= 85 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {suggestion.judge.compliance270}%
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {suggestion.reasons.map((reason: string, rIdx: number) => (
                      <Badge key={rIdx} variant="neutral" size="sm">{reason}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAssignmentModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleConfirmAssignment(suggestedJudges[0]?.judge.id)}>
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
