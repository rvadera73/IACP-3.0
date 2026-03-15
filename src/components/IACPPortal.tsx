import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  LogOut,
  Scale
} from 'lucide-react';
import { Button, Card, Badge } from './UI';
import { useAuth } from '../context/AuthContext';
import { MOCK_CASE_FOLDERS, MOCK_NOTIFICATIONS } from '../data/mockDashboardData';
import CasesGallery from './oalj/CasesGallery';
import NotificationsPanel from './oalj/NotificationsPanel';
import CaseIntelligenceHub from './oalj/CaseIntelligenceHub';
import OALJClerkDashboard from './iacp/OALJClerkDashboard';
import OALJJudgeDashboard from './iacp/OALJJudgeDashboard';
import OALJLegalAssistantDashboard from './iacp/OALJLegalAssistantDashboard';
import OALJAttorneyAdvisorDashboard from './iacp/OALJAttorneyAdvisorDashboard';
import DocketClerkDashboard from './iacp/DocketClerkDashboard';
import AnalyticsDashboard from './iacp/AnalyticsDashboard';
import BoardsDocketClerkDashboard from './iacp/BoardsDocketClerkDashboard';
import BoardsLegalAssistantDashboard from './iacp/BoardsLegalAssistantDashboard';
import BoardsAttorneyAdvisorDashboard from './iacp/BoardsAttorneyAdvisorDashboard';
import BoardsMemberDashboard from './iacp/BoardsMemberDashboard';

export default function IACPPortal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [notifications] = useState(MOCK_NOTIFICATIONS);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNotificationClick = (notification: any) => {
    console.log('Notification clicked:', notification);
  };

  const handleMarkAllNotificationsRead = () => {
    console.log('Mark all as read');
  };

  // Determine which dashboard to show based on role
  const renderDashboard = () => {
    // Board Roles - Division-specific
    if (user.role === 'Board Docket Clerk') {
      return <BoardsDocketClerkDashboard onCaseSelect={setSelectedCase} />;
    } else if (user.role === 'Board Legal Assistant') {
      return <BoardsLegalAssistantDashboard onCaseSelect={setSelectedCase} />;
    } else if (user.role === 'Board Attorney-Advisor') {
      return <BoardsAttorneyAdvisorDashboard onCaseSelect={setSelectedCase} />;
    } else if (user.role === 'Board Member') {
      return <BoardsMemberDashboard onCaseSelect={setSelectedCase} />;
    }
    
    // OALJ Roles
    if (user.role.includes('Docket')) {
      return <DocketClerkDashboard onCaseSelect={setSelectedCase} />;
    } else if (user.role.includes('Legal Assistant')) {
      return <OALJLegalAssistantDashboard onCaseSelect={setSelectedCase} />;
    } else if (user.role.includes('Attorney-Advisor')) {
      return <OALJAttorneyAdvisorDashboard onCaseSelect={setSelectedCase} />;
    } else if (user.role.includes('Clerk') && !user.role.includes('Docket')) {
      return <OALJClerkDashboard onCaseSelect={setSelectedCase} />;
    } else if (user.role.includes('Judge') || user.role.includes('Member')) {
      return <OALJJudgeDashboard onCaseSelect={setSelectedCase} />;
    } else {
      // Default dashboard for other roles
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">My Cases</div>
              <div className="text-3xl font-bold">12</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-amber-500">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Pending Actions</div>
              <div className="text-3xl font-bold">5</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-emerald-500">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Completed Today</div>
              <div className="text-3xl font-bold">8</div>
            </Card>
          </div>

          <CasesGallery
            cases={MOCK_CASE_FOLDERS.filter(c => c.category === 'Adjudication')}
            onCaseClick={setSelectedCase}
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">
              {user.role} Portal
            </h2>
            <Badge variant="info">{user.division || 'OALJ'}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search cases, filings..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all w-64"
              />
            </div>
            <NotificationsPanel
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onMarkAllRead={handleMarkAllNotificationsRead}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut className="w-4 h-4" />}
              className="text-slate-600 hover:text-red-600"
            >
              Sign Out
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow overflow-y-auto p-8">
          {renderDashboard()}
        </main>
      </div>

      {/* Case Intelligence Hub Modal - Global for all roles */}
      {selectedCase && (
        <CaseIntelligenceHub
          caseNumber={selectedCase}
          onClose={() => setSelectedCase(null)}
          userRole={user.role}
        />
      )}
    </div>
  );
}
