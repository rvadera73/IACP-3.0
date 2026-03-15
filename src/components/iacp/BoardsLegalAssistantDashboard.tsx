import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Video,
  Users,
  FileText,
  Eye,
  Send,
  Bell,
  AlertTriangle,
  LayoutDashboard,
  Briefcase,
  BarChart3,
  ShieldCheck,
  ArrowUpRight,
  History
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import { findOptimalHearingDates, generateNoticeOfHearing, type HearingSchedule } from '../../services/smartScheduler';
import CaseIntelligenceHub from '../oalj/CaseIntelligenceHub';
import AnalyticsDashboard from './AnalyticsDashboard';
import { useAuth } from '../../context/AuthContext';

interface BoardsLegalAssistantDashboardProps {
  onCaseSelect: (caseId: string) => void;
}

export default function BoardsLegalAssistantDashboard({ onCaseSelect }: BoardsLegalAssistantDashboardProps) {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'schedule' | 'notices' | 'analytics'>('dashboard');
  const [showCaseViewer, setShowCaseViewer] = useState(false);
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string | null>(null);

  const userDivision = user?.division || 'BRB';

  const stats = {
    hearingsThisMonth: 3,
    noticesIssued: 8,
    pendingScheduling: 2,
    transcriptsPending: 1,
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
      default: return <Calendar className="w-4 h-4" />;
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
          onClick={() => setActiveView('schedule')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'schedule' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Schedule
        </button>
        <button
          onClick={() => setActiveView('notices')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'notices' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          Notices
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
                <div className="font-bold text-slate-900">{userDivision} Legal Assistant</div>
                <div className="text-sm text-slate-600">Managing {userDivision} hearing schedules and oral arguments</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className={`p-6 border-l-4 ${getDivisionColor(userDivision)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Hearings This Month</div>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold">{stats.hearingsThisMonth}</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Notices Issued</div>
                <Mail className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold">{stats.noticesIssued}</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Pending Scheduling</div>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-3xl font-bold">{stats.pendingScheduling}</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Transcripts Pending</div>
                <FileText className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold">{stats.transcriptsPending}</div>
            </Card>
          </div>

          {/* Upcoming Oral Arguments */}
          <Card>
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Upcoming Oral Arguments - {userDivision}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { caseNumber: `${userDivision} No. 24-0123`, claimant: 'Williams v. Black Diamond', date: 'Mar 20, 2026', time: '10:00 AM', panel: 'Panel A' },
                { caseNumber: `${userDivision} No. 24-0456`, claimant: 'Garcia v. Logistics', date: 'Mar 25, 2026', time: '2:00 PM', panel: 'Panel B' },
                { caseNumber: `${userDivision} No. 25-0089`, claimant: 'Thompson v. FedEx', date: 'Apr 10, 2026', time: '11:00 AM', panel: 'Panel C' },
              ].map((hearing, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold font-mono">{hearing.caseNumber}</div>
                    <div className="text-xs text-slate-500">{hearing.claimant}</div>
                    <div className="text-xs text-slate-500 mt-1">{hearing.date}, {hearing.time} • {hearing.panel}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Mail className="w-3 h-3" />}>
                      Notice
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewCase(hearing.caseNumber)}
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

      {/* Schedule View */}
      {activeView === 'schedule' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Schedule Oral Argument</h4>
              <p className="text-slate-600">Select from pending {userDivision} appeals</p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Notices View */}
      {activeView === 'notices' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Notices of Oral Argument</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { caseNumber: `${userDivision} No. 24-0123`, issuedAt: 'Mar 1, 2026' },
                { caseNumber: `${userDivision} No. 24-0456`, issuedAt: 'Mar 5, 2026' },
              ].map((notice, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold font-mono">{notice.caseNumber}</div>
                    <div className="text-xs text-slate-500">Issued: {notice.issuedAt}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Mail className="w-3 h-3" />}>
                      Resend
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3 h-3" />}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <AnalyticsDashboard userRole={`Board Legal Assistant - ${userDivision}`} />
        </motion.div>
      )}

      {/* Case Intelligence Hub */}
      {showCaseViewer && selectedCaseNumber && (
        <CaseIntelligenceHub
          caseNumber={selectedCaseNumber}
          onClose={() => setShowCaseViewer(false)}
          userRole={`Board Legal Assistant - ${userDivision}`}
        />
      )}
    </div>
  );
}
