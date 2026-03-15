import React from 'react';
import Badge from './Badge';
import Timeline from './Timeline';

const CaseDetail: React.FC = () => {
  const caseTimeline = [
    {
      status: 'done' as const,
      icon: '✓',
      title: 'Case Filed & Auto-Docketed',
      subtitle: 'Initial filing received via Unified Filing Portal',
      timestamp: 'Mar 14, 2024 · Auto-system',
    },
    {
      status: 'done' as const,
      icon: '✓',
      title: 'Assigned to ALJ Thompson',
      subtitle: 'Workload-balanced assignment based on NY district',
      timestamp: 'Mar 15, 2024 · Auto-system',
    },
    {
      status: 'done' as const,
      icon: '✓',
      title: 'Initial Pre-Hearing Conference',
      subtitle: 'Video conference · Issues defined · Schedule set',
      timestamp: 'Apr 22, 2024 · 10:00 AM',
    },
    {
      status: 'done' as const,
      icon: '✓',
      title: 'Discovery Period Closed',
      subtitle: 'All exhibits exchanged · No disputes pending',
      timestamp: 'May 15, 2024 · Auto-system',
    },
    {
      status: 'active' as const,
      icon: '⚡',
      title: 'Hearing Scheduled',
      subtitle: 'Video hearing scheduled for Jun 4, 2024 at 10:00 AM',
      timestamp: 'Jun 4, 2024 · 10:00 AM EST',
    },
    {
      status: 'pending' as const,
      icon: '○',
      title: 'Decision Due',
      subtitle: 'Target: 45 days after record closure',
      timestamp: 'Target: Jul 30, 2024',
    },
  ];

  return (
    <div className="screen" id="screen-casedetail">
      <div className="breadcrumb">OALJ CMS <span className="sep">›</span> <span>All Cases</span> <span className="sep">›</span> <span>LCA-2024-00847</span></div>

      <div className="alert-bar">
        ⚠ Hearing scheduled for Jun 4, 2024 — All parties have been notified · Pre-hearing briefs due May 28
      </div>

      <div className="two-col" style={{ marginBottom: '18px' }}>
        <div className="card">
          <div className="card-title">Case Information</div>
          <div className="case-meta-grid">
            <div className="meta-item">
              <div className="meta-label">Case Number</div>
              <div className="meta-value mono">LCA-2024-00847</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Program</div>
              <div className="meta-value"><Badge variant="blue">Longshore</Badge></div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Phase</div>
              <div className="meta-value"><Badge variant="amber">Pre-Hearing</Badge></div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Claimant</div>
              <div className="meta-value">Patel, Rajesh</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Respondent</div>
              <div className="meta-value">Harbor Freight Inc.</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">District Office</div>
              <div className="meta-value">New York</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Assigned ALJ</div>
              <div className="meta-value">ALJ Thompson</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Filed Date</div>
              <div className="meta-value">Mar 14, 2024</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">SLA Status</div>
              <div className="meta-value"><Badge variant="green">On Track</Badge></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Hearing Information</div>
          <div className="case-meta-grid">
            <div className="meta-item">
              <div className="meta-label">Hearing Date</div>
              <div className="meta-value mono">Jun 4, 2024 · 10:00 AM</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Format</div>
              <div className="meta-value"><Badge variant="blue">💻 Video</Badge></div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Status</div>
              <div className="meta-value"><Badge variant="green">Confirmed</Badge></div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Court Reporter</div>
              <div className="meta-value">M. Rodriguez</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Participants</div>
              <div className="meta-value">4 Registered</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Link</div>
              <div className="meta-value"><a href="#" style={{ color: 'var(--accent)' }}>Join Session</a></div>
            </div>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Service List</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Party</th>
                <th>Role</th>
                <th>Organization</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Rajesh Patel</td>
                <td>Claimant</td>
                <td>—</td>
                <td>r.patel@email.com</td>
              </tr>
              <tr>
                <td>M. Thompson, Esq.</td>
                <td>Claimant Rep.</td>
                <td>Legal Aid Society</td>
                <td>mthompson@legalaid.org</td>
              </tr>
              <tr>
                <td>Harbor Freight Inc.</td>
                <td>Respondent</td>
                <td>—</td>
                <td>legal@harborfreight.com</td>
              </tr>
              <tr>
                <td>J. Wilson, Esq.</td>
                <td>Respondent Rep.</td>
                <td>Wilson & Associates</td>
                <td>jwilson@wilsonlaw.com</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Timeline items={caseTimeline} title="Case Timeline" />
      </div>
    </div>
  );
};

export default CaseDetail;
