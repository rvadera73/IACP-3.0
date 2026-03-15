import React from 'react';
import { motion } from 'motion/react';
import {
  FilePlus,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Scale,
  TrendingUp
} from 'lucide-react';
import { Card, Badge } from '../UI';
import CasesGallery from '../oalj/CasesGallery';
import { MOCK_CASE_FOLDERS } from '../../data/mockDashboardData';

interface OALJClerkDashboardProps {
  onCaseSelect: (caseId: string) => void;
}

export default function OALJClerkDashboard({ onCaseSelect }: OALJClerkDashboardProps) {
  // Mock data - in real app, this would come from API
  const stats = {
    totalCases: 48,
    pendingDocketing: 12,
    pendingAssignment: 8,
    overdueActions: 3,
    completedToday: 15,
  };

  const recentFilings = [
    { id: 'F-2026-001', caseNumber: '2026-BLA-00089', type: 'New Claim', filedAt: '2026-03-11 09:23 AM', status: 'Pending Docketing' },
    { id: 'F-2026-002', caseNumber: '2026-LHC-00034', type: 'Motion to Compel', filedAt: '2026-03-11 08:45 AM', status: 'Pending Review' },
    { id: 'F-2026-003', caseNumber: '2026-PER-00012', type: 'Notice of Appearance', filedAt: '2026-03-10 04:15 PM', status: 'Pending Verification' },
    { id: 'F-2026-004', caseNumber: '2026-BLA-00078', type: 'Medical Evidence', filedAt: '2026-03-10 02:30 PM', status: 'Accepted' },
  ];

  const suggestedAssignments = [
    { judge: 'Hon. Sarah Jenkins', cases: 12, specialty: 'BLA', load: 'Medium' },
    { judge: 'Hon. Michael Ross', cases: 8, specialty: 'LHC', load: 'Low' },
    { judge: 'Hon. Patricia Chen', cases: 15, specialty: 'BLA', load: 'High' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Cases</div>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.totalCases}</div>
          <div className="text-xs text-slate-500 mt-1">Across all dockets</div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Pending Docketing</div>
            <FilePlus className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.pendingDocketing}</div>
          <div className="text-xs text-slate-500 mt-1">Requires immediate attention</div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Pending Assignment</div>
            <Scale className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.pendingAssignment}</div>
          <div className="text-xs text-slate-500 mt-1">Ready for judge assignment</div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Overdue Actions</div>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.overdueActions}</div>
          <div className="text-xs text-slate-500 mt-1">Requires immediate review</div>
        </Card>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Filings - 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Recent Filings - Intake Queue</h3>
                <Badge variant="info">{recentFilings.length} new</Badge>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {recentFilings.map((filing) => (
                <div
                  key={filing.id}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onCaseSelect(filing.caseNumber)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        filing.status.includes('Pending') ? 'bg-amber-50' : 'bg-green-50'
                      }`}>
                        <FilePlus className={`w-4 h-4 ${
                          filing.status.includes('Pending') ? 'text-amber-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 font-mono">
                          {filing.caseNumber}
                        </div>
                        <div className="text-xs text-slate-500">{filing.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          filing.status === 'Accepted' ? 'success' :
                          filing.status.includes('Overdue') ? 'error' :
                          'warning'
                        }
                        size="sm"
                      >
                        {filing.status}
                      </Badge>
                      <div className="text-xs text-slate-400 mt-1">{filing.filedAt}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Suggested Assignments - 1 column */}
        <div>
          <Card>
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Judicial Workload</h3>
                <TrendingUp className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            <div className="p-4 space-y-4">
              {suggestedAssignments.map((assignment, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-bold text-slate-900">{assignment.judge}</div>
                    <Badge
                      variant={
                        assignment.load === 'Low' ? 'success' :
                        assignment.load === 'Medium' ? 'warning' :
                        'error'
                      }
                      size="sm"
                    >
                      {assignment.load}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{assignment.cases} active cases</span>
                    <span className="font-mono">{assignment.specialty}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200">
              <Button variant="outline" size="sm" className="w-full">
                View All Judges
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* All Cases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">All OALJ Cases</h3>
          <Badge variant="neutral">{MOCK_CASE_FOLDERS.filter(c => c.category === 'Adjudication').length} cases</Badge>
        </div>
        <CasesGallery
          cases={MOCK_CASE_FOLDERS.filter(c => c.category === 'Adjudication')}
          onCaseClick={onCaseSelect}
        />
      </div>
    </div>
  );
}

function Button({ children, variant, size, className, onClick }: any) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variantStyles = variant === 'outline' 
    ? 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
    : 'bg-blue-600 text-white hover:bg-blue-700';
  const sizeStyles = size === 'sm' ? 'text-sm' : 'text-base';
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className || ''}`}
    >
      {children}
    </button>
  );
}
