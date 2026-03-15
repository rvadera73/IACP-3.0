import React from 'react';
import Badge from './Badge';

const PreHearing: React.FC = () => {
  const hearings = [
    { caseId: 'LCA-2024-00847', date: 'Jun 4 · 10:00 AM', format: 'Video', formatVariant: 'blue' as const, status: 'Confirmed', statusVariant: 'green' as const },
    { caseId: 'DBA-2024-00544', date: 'Jun 5 · 9:30 AM', format: 'In-Person', formatVariant: 'gray' as const, status: 'Confirmed', statusVariant: 'green' as const },
    { caseId: 'WB-2024-00711', date: 'Jun 6 · 2:00 PM', format: 'Hybrid', formatVariant: 'purple' as const, status: 'Conflict', statusVariant: 'amber' as const },
    { caseId: 'BLA-2024-01044', date: 'Jun 10 · 10:00 AM', format: 'Video', formatVariant: 'blue' as const, status: 'Rescheduling', statusVariant: 'amber' as const },
    { caseId: 'LCA-2024-00812', date: 'Jun 12 · 1:30 PM', format: 'In-Person', formatVariant: 'gray' as const, status: 'Confirmed', statusVariant: 'green' as const },
  ];

  const settlements = [
    { caseId: 'WB-2024-00743', title: 'Nguyen v. TechCorp', judge: 'Settlement Judge Chen', status: '✓ Settlement Reached', statusVariant: 'green' as const, note: '🔒 Workspace encrypted · Agreement uploaded · Presiding judge notified' },
    { caseId: 'LCA-2024-00799', title: 'Patel v. Global Shipping', judge: 'Settlement Judge Kim', status: 'In Progress', statusVariant: 'purple' as const, note: '🔒 Workspace active · Session 3 of negotiations' },
    { caseId: 'DBA-2024-00501', title: 'Chen v. BrightStar LLC', judge: 'Settlement Judge Park', status: 'Awaiting Party', statusVariant: 'amber' as const, note: '🔒 Workspace created · Awaiting respondent acceptance' },
  ];

  return (
    <div className="screen" id="screen-prehearing">
      <div className="breadcrumb">OALJ CMS <span className="sep">›</span> <span>Pre-Hearing Management</span></div>
      
      <div className="alert-bar">
        ⚠ 2 hearing scheduling conflicts auto-detected — alternative dates have been proposed to parties
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Upcoming Hearings — Next 14 Days</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Date / Time</th>
                <th>Format</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {hearings.map((hearing, idx) => (
                <tr key={idx}>
                  <td><span className="case-id">{hearing.caseId}</span></td>
                  <td style={{ fontSize: '11px', fontFamily: "'IBM Plex Mono', monospace" }}>{hearing.date}</td>
                  <td><Badge variant={hearing.formatVariant}>{hearing.format}</Badge></td>
                  <td><Badge variant={hearing.statusVariant}>{hearing.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">Active Settlement Tracks</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {settlements.map((settlement, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface2)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: settlement.statusVariant === 'green' 
                    ? '1px solid rgba(139,120,240,.3)' 
                    : '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="case-id">{settlement.caseId}</span>
                  <Badge variant={settlement.statusVariant}>{settlement.status}</Badge>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text2)' }}>{settlement.title} · {settlement.judge}</div>
                <div style={{ fontSize: '10.5px', color: 'var(--text3)', marginTop: '4px' }}>{settlement.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreHearing;
