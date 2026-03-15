import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onNavigate }) => {
  const navigate = useNavigate();

  const navItems = [
    { section: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: '⬛' },
      { id: 'cases', label: 'All Cases', icon: '📋', badge: '4', badgeColor: 'amber' },
    ]},
    { section: 'Lifecycle', items: [
      { id: 'intake', label: 'Intake & Docketing', icon: '📥' },
      { id: 'assignment', label: 'Assignment', icon: '⚖️' },
      { id: 'prehearing', label: 'Pre-Hearing', icon: '📅', badge: '2' },
      { id: 'hearing', label: 'Hearings', icon: '🎤' },
      { id: 'decision', label: 'Decisions', icon: '✍️', badge: '3', badgeColor: 'amber' },
      { id: 'postdecision', label: 'Post-Decision', icon: '🔁', badge: '5' },
    ]},
    { section: 'Case Detail', items: [
      { id: 'casedetail', label: 'LCA-2024-00847', icon: '🔍' },
    ]},
    { section: 'Administration', items: [
      { id: 'analytics', label: 'Analytics', icon: '📊' },
      { id: 'workload', label: 'Workload', icon: '👥' },
    ]},
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="agency">DOL · OALJ</div>
        <div className="system">Case Management<br />Platform</div>
        <div className="version">v2.0 · TO-BE PROTOTYPE</div>
      </div>

      {navItems.map((section, idx) => (
        <div key={idx} className="nav-section">
          <div className="nav-label">{section.section}</div>
          {section.items.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeScreen === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className={`nav-badge ${item.badgeColor || ''}`}>{item.badge}</span>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="sidebar-user">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="avatar">SJ</div>
          <div>
            <div className="name">Sarah Johnson</div>
            <div className="role">Chief ALJ · National Office</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
