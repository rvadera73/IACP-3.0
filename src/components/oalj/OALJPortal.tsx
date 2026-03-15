import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Dashboard from './Dashboard';
import AllCases from './AllCases';
import Intake from './Intake';
import Assignment from './Assignment';
import PreHearing from './PreHearing';
import Hearing from './Hearing';
import Decision from './Decision';
import PostDecision from './PostDecision';
import CaseDetail from './CaseDetail';
import Analytics from './Analytics';
import Workload from './Workload';

const screenTitles: Record<string, { title: string; subtitle?: string }> = {
  dashboard: { title: 'Dashboard' },
  cases: { title: 'All Cases' },
  intake: { title: 'Intake & Docketing' },
  assignment: { title: 'Assignment' },
  prehearing: { title: 'Pre-Hearing' },
  hearing: { title: 'Hearings' },
  decision: { title: 'Decisions' },
  postdecision: { title: 'Post-Decision' },
  casedetail: { title: 'Case Detail', subtitle: 'LCA-2024-00847' },
  analytics: { title: 'Analytics' },
  workload: { title: 'Workload Management' },
};

const OALJPortal: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
  };

  const handleNewFiling = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'cases':
        return <AllCases onCaseClick={() => handleNavigate('casedetail')} />;
      case 'intake':
        return <Intake />;
      case 'assignment':
        return <Assignment />;
      case 'prehearing':
        return <PreHearing />;
      case 'hearing':
        return <Hearing />;
      case 'decision':
        return <Decision />;
      case 'postdecision':
        return <PostDecision />;
      case 'casedetail':
        return <CaseDetail />;
      case 'analytics':
        return <Analytics />;
      case 'workload':
        return <Workload />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  const currentScreen = screenTitles[activeScreen] || { title: 'Dashboard' };

  return (
    <div className="shell">
      <Sidebar activeScreen={activeScreen} onNavigate={handleNavigate} />
      
      <div className="main">
        <Topbar 
          title={currentScreen.title} 
          subtitle={currentScreen.subtitle}
          onNewFiling={handleNewFiling}
        />
        
        <div className="content">
          {renderScreen()}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay open" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-eyebrow">NEW FILING</div>
                <div className="modal-title">Submit New Case Filing</div>
                <div className="modal-sub">Unified Filing Portal · Real-time validation</div>
              </div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-section-title">Filing Information</div>
              
              <div className="form-row cols-2">
                <div className="form-group">
                  <label className="form-label">Program Type <span className="required-star">*</span></label>
                  <select className="form-select">
                    <option>Select Program...</option>
                    <option>Longshore / DBA</option>
                    <option>Black Lung</option>
                    <option>PERM / Immigration</option>
                    <option>Whistleblower</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Filing Category <span className="required-star">*</span></label>
                  <select className="form-select">
                    <option>Select Category...</option>
                    <option>Initial Claim</option>
                    <option>Appeal</option>
                    <option>Motion</option>
                    <option>Supplemental</option>
                  </select>
                </div>
              </div>

              <div className="form-row cols-2">
                <div className="form-group">
                  <label className="form-label">Claimant Name <span className="required-star">*</span></label>
                  <input className="form-input" placeholder="Full legal name" />
                </div>
                <div className="form-group">
                  <label className="form-label">SSN (Last 4 digits) <span className="required-star">*</span></label>
                  <input className="form-input" placeholder="____" maxLength={4} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Respondent / Employer <span className="required-star">*</span></label>
                <input className="form-input" placeholder="Company or individual name" />
              </div>

              <div className="form-section-title">Document Upload</div>
              
              <div className="form-group">
                <label className="form-label">Supporting Documents <span className="required-star">*</span></label>
                <div style={{ 
                  border: '2px dashed var(--border)', 
                  borderRadius: '8px', 
                  padding: '24px',
                  textAlign: 'center',
                  background: 'var(--surface2)',
                  cursor: 'pointer',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text)' }}>
                    Drag & drop files here or <span style={{ color: 'var(--accent)' }}>browse</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text3)', marginTop: '4px' }}>
                    PDF, DOC, DOCX · Max 25MB
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description <span className="required-star">*</span></label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Brief description of this filing..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary">Submit Filing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OALJPortal;
