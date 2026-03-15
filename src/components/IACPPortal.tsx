import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDefaultNavItem } from '../core/roleNavConfig';
import AppShell from './layouts/AppShell';
import CaseWorkspace from './case/CaseWorkspace';

// Role workspaces
import DocketClerkWorkspace from './roles/DocketClerkWorkspace';
import AttorneyAdvisorWorkspace from './roles/AttorneyAdvisorWorkspace';
import LegalAssistantWorkspace from './roles/LegalAssistantWorkspace';
import JudgeWorkspace from './roles/JudgeWorkspace';

export default function IACPPortal() {
  const { user } = useAuth();

  const [activeNavItem, setActiveNavItem] = useState(() =>
    getDefaultNavItem(user?.role || '')
  );
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  if (!user) return null;

  const handleCaseSelect = (caseNumber: string) => {
    setSelectedCase(caseNumber);
  };

  // Render the correct workspace based on role
  const renderWorkspace = () => {
    const role = user.role;

    // OALJ Docket Clerk or Board Docket Clerk
    if (role.includes('Docket')) {
      return <DocketClerkWorkspace activeView={activeNavItem} onCaseSelect={handleCaseSelect} />;
    }

    // Attorney-Advisor
    if (role.includes('Attorney-Advisor')) {
      return <AttorneyAdvisorWorkspace activeView={activeNavItem} onCaseSelect={handleCaseSelect} />;
    }

    // Legal Assistant
    if (role.includes('Legal Assistant')) {
      return <LegalAssistantWorkspace activeView={activeNavItem} onCaseSelect={handleCaseSelect} />;
    }

    // Judge or Board Member
    if (role.includes('Judge') || role.includes('Member')) {
      return <JudgeWorkspace activeView={activeNavItem} onCaseSelect={handleCaseSelect} />;
    }

    // Fallback
    return <DocketClerkWorkspace activeView={activeNavItem} onCaseSelect={handleCaseSelect} />;
  };

  return (
    <>
      <AppShell activeNavItem={activeNavItem} onNavItemClick={setActiveNavItem}>
        {renderWorkspace()}
      </AppShell>

      {/* Case Intelligence Hub Modal — opens when a case is selected from any view */}
      {selectedCase && (
        <CaseWorkspace
          caseNumber={selectedCase}
          onClose={() => setSelectedCase(null)}
          userRole={user.role}
        />
      )}
    </>
  );
}
