import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Scale,
  CheckCircle,
  AlertCircle,
  Gavel,
  TrendingUp,
  Edit3,
  Signature,
  LayoutDashboard,
  BarChart3,
  ShieldCheck,
  ArrowUpRight,
  History,
  Users
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import AnalyticsDashboard from './AnalyticsDashboard';
import CasesGallery from '../oalj/CasesGallery';
import { MOCK_CASE_FOLDERS } from '../../data/mockDashboardData';
import { useAuth } from '../../context/AuthContext';

interface BoardsMemberDashboardProps {
  onCaseSelect: (caseId: string) => void;
}

export default function BoardsMemberDashboard({ onCaseSelect }: BoardsMemberDashboardProps) {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'analytics'>('dashboard');

  const userDivision = user?.division || 'BRB';

  const stats = {
    activeCases: 18,
    upcomingOralArguments: 4,
    decisionsDue: 5,
    motionsPending: 6,
  };

  // Filter cases by division
  const divisionCases = MOCK_CASE_FOLDERS.filter(c => c.category === 'Appeal' && c.caseType === userDivision);

  const decisionsPending = [
    { caseNumber: `${userDivision} No. 24-0123`, claimant: 'Williams v. Black Diamond', daysPending: 30, priority: 'High' },
    { caseNumber: `${userDivision} No. 24-0456`, claimant: 'Garcia v. Logistics', daysPending: 21, priority: 'Medium' },
    { caseNumber: `${userDivision} No. 24-0789`, claimant: 'Thompson v. Federal Express', daysPending: 14, priority: 'Medium' },
  ];

  const upcomingOralArguments = [
    { caseNumber: `${userDivision} No. 24-0234`, claimant: 'Martinez v. Construction Co.', date: 'Mar 20, 2026', time: '10:00 AM' },
    { caseNumber: `${userDivision} No. 24-0567`, claimant: 'Lee v. Tech Industries', date: 'Mar 25, 2026', time: '2:00 PM' },
  ];

  const getDivisionIcon = (division: string) => {
    switch (division) {
      case 'BRB': return <ShieldCheck className="w-4 h-4" />;
      case 'ARB': return <ArrowUpRight className="w-4 h-4" />;
      case 'ECAB': return <History className="w-4 h-4" />;
      default: return <Scale className="w-4 h-4" />;
    }
  };

  const getDivisionColor = (division: string) => {
    switch (division) {
      case 'BRB': return 'border-l-amber-500';
      case 'ARB': return 'border-l-blue-500';
      case 'ECAB': return 'border-l-emerald-500';
      default: return 'border-l-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* View Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveView('analytics')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'analytics' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analytics
        </button>
      </div>

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <AnalyticsDashboard userRole={`Board Member - ${userDivision}`} />
        </motion.div>
      )}

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <>
          {/* Division Banner */}
          <div className={`p-4 rounded-xl border-l-4 ${getDivisionColor(userDivision)}`}>
            <div className="flex items-center gap-3">
              {getDivisionIcon(userDivision)}
              <div>
                <div className="font-bold text-slate-900">{userDivision} Board Member</div>
                <div className="text-sm text-slate-600">Appellate review and final agency decisions</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active Cases</div>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold">{stats.activeCases}</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Oral Arguments</div>
                <Gavel className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-3xl font-bold">{stats.upcomingOralArguments}</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-red-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Decisions Due</div>
                <Clock className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-bold">{stats.decisionsDue}</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Motions Pending</div>
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold">{stats.motionsPending}</div>
            </Card>
          </div>

          {/* Decisions Pending Draft/Review */}
          <Card>
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Decisions Pending Draft/Review</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {decisionsPending.map((decision, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold font-mono">{decision.caseNumber}</div>
                    <div className="text-xs text-slate-500">{decision.claimant}</div>
                    <div className="text-xs text-slate-500 mt-1">Pending {decision.daysPending} days</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        decision.priority === 'High' ? 'error' :
                        decision.priority === 'Medium' ? 'warning' : 'success'
                      }
                      size="sm"
                    >
                      {decision.priority}
                    </Badge>
                    <Button variant="outline" size="sm" leftIcon={<Edit3 className="w-3 h-3" />}>
                      Edit Draft
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={<Signature className="w-3 h-3" />} onClick={() => handleViewCase(decision.caseNumber)}>
                      Sign & Release
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Oral Arguments */}
          <Card>
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Upcoming Oral Arguments</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingOralArguments.map((hearing, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold font-mono">{hearing.caseNumber}</div>
                    <div className="text-xs text-slate-500">{hearing.claimant}</div>
                    <div className="text-xs text-slate-500 mt-1">{hearing.date}, {hearing.time}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<FileText className="w-3 h-3" />}>
                      Bench Memo
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<Scale className="w-3 h-3" />} onClick={() => onCaseSelect(hearing.caseNumber)}>
                      View Case
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* All {userDivision} Cases */}
          <Card>
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">{userDivision} Cases</h3>
            </div>
            <div className="p-6">
              <CasesGallery
                cases={divisionCases}
                onCaseClick={onCaseSelect}
              />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

// Add Clock icon
function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
