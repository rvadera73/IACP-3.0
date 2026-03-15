import React from 'react';
import StatCard from './StatCard';
import Pipeline from './Pipeline';
import Timeline from './Timeline';
import DonutChart from './DonutChart';
import SLAProgress from './SLAProgress';

interface DashboardProps {
  onNavigate?: (screen: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const statCards = [
    { value: '1,847', label: 'Active Cases', delta: '↑ 3.2% vs last month', deltaType: 'up' as const, variant: 'accent' as const },
    { value: '94', label: 'Decisions This Month', delta: '↑ 12% vs target', deltaType: 'up' as const, variant: 'green' as const },
    { value: '23', label: 'SLA Warnings', delta: '↑ 4 since last week', deltaType: 'down' as const, variant: 'amber' as const },
    { value: '7', label: 'Overdue Actions', delta: 'Requires attention', deltaType: 'neutral' as const, variant: 'red' as const },
    { value: '142', label: 'Hearings Scheduled', delta: 'Next 30 days', deltaType: 'neutral' as const, variant: 'purple' as const },
  ];

  const pipelineSteps = [
    { phase: 'PHASE 1', label: 'Intake', count: 38, status: 'done' as const, onClick: () => onNavigate?.('intake') },
    { phase: 'PHASE 2', label: 'Assignment', count: 214, status: 'done' as const, onClick: () => onNavigate?.('assignment') },
    { phase: 'PHASE 3', label: 'Pre-Hearing', count: 487, status: 'active' as const, onClick: () => onNavigate?.('prehearing') },
    { phase: 'PHASE 4', label: 'Hearing', count: 163, status: 'active' as const, onClick: () => onNavigate?.('hearing') },
    { phase: 'PHASE 5', label: 'Decision', count: 298, status: 'active' as const, onClick: () => onNavigate?.('decision') },
    { phase: 'PHASE 6', label: 'Post-Decision', count: 647, status: 'pending' as const, onClick: () => onNavigate?.('postdecision') },
  ];

  const timelineItems = [
    {
      status: 'done' as const,
      icon: '✓',
      title: 'Decision Issued — LCA-2024-00831',
      subtitle: 'Auto-published to OALJ.DOL.GOV · All parties notified',
      timestamp: 'Today, 10:42 AM · ALJ Martinez',
    },
    {
      status: 'done' as const,
      icon: '✓',
      title: 'New Filing Auto-Docketed — BLA-2024-01204',
      subtitle: 'Black Lung · Assigned to Pittsburgh District Office',
      timestamp: 'Today, 09:17 AM · Auto-system',
    },
    {
      status: 'active' as const,
      icon: '⚡',
      title: 'SLA Alert — Decision Overdue · DBA-2024-00612',
      subtitle: 'Record closed 47 days ago · Target: 45 days',
      timestamp: 'Requires review · ALJ Rivera',
    },
    {
      status: 'done' as const,
      icon: '✓',
      title: 'Appeal Record Transmitted — ARB-LCA-831',
      subtitle: 'Digital transfer to ARB · No shipping required',
      timestamp: 'Yesterday, 4:51 PM · Auto-system',
    },
    {
      status: 'done' as const,
      icon: '✓',
      title: 'Settlement Reached — WB-2024-00743',
      subtitle: 'Agreement uploaded · Presiding judge auto-notified',
      timestamp: 'Yesterday, 2:15 PM · Settlement Judge Chen',
    },
  ];

  const donutSegments = [
    { label: 'Longshore / DBA', value: 726, color: 'var(--green)' },
    { label: 'Black Lung', value: 332, color: 'var(--amber)' },
    { label: 'PERM / Immigration', value: 201, color: 'var(--red)' },
    { label: 'Whistleblower / Other', value: 588, color: 'var(--border2)' },
  ];

  const slaItems = [
    { label: 'Decisions on time', value: 87, status: 'green' as const },
    { label: 'Hearing notices sent ≥21 days', value: 98, status: 'green' as const },
    { label: 'Transcripts received ≤30 days', value: 74, status: 'amber' as const },
    { label: 'Auto-docketing accuracy', value: 99, status: 'green' as const },
  ];

  return (
    <div className="screen active" id="screen-dashboard">
      <div className="breadcrumb">OALJ CMS <span className="sep">›</span> <span>Dashboard</span></div>

      <div className="stat-row">
        {statCards.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="card" style={{ marginBottom: '18px' }}>
        <div className="card-title">Cases by Lifecycle Phase</div>
        <Pipeline steps={pipelineSteps} />
      </div>

      <div className="two-col">
        <Timeline items={timelineItems} title="Recent System Activity" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <DonutChart total={1847} segments={donutSegments} title="Active Cases by Program" />
          <SLAProgress items={slaItems} title="SLA Compliance — This Month" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
