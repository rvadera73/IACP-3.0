import React from 'react';
import Badge from './Badge';

const Hearing: React.FC = () => {
  const liveSessions = [
    {
      caseId: 'LCA-2024-00847',
      title: 'Patel v. Harbor Freight Inc.',
      judge: 'ALJ Thompson',
      format: 'Video Hearing',
      participants: 4,
      duration: '1h 23m',
      isJoinable: true,
    },
    {
      caseId: 'DBA-2024-00544',
      title: 'Chen v. Pacific Construction LLC',
      judge: 'ALJ Rivera',
      format: 'In-Person',
      location: 'LA District Office',
      duration: '0h 47m',
      isJoinable: false,
    },
  ];

  const postHearing = [
    { caseId: 'LCA-2024-00791', transcript: 'Received', briefs: 'Received', record: 'Auto-Closed' },
    { caseId: 'DBA-2024-00512', transcript: 'Pending', briefs: 'Received', record: 'Incomplete' },
    { caseId: 'WB-2024-00698', transcript: 'Received', briefs: 'Pending', record: 'Incomplete' },
  ];

  return (
    <div className="screen" id="screen-hearing">
      <div className="breadcrumb">OALJ CMS <span className="sep">›</span> <span>Hearing Management</span></div>

      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '18px' }}>
        <div className="stat-card accent">
          <div className="stat-val">3</div>
          <div className="stat-lbl">Live Now</div>
          <div className="stat-delta up">● Active sessions</div>
        </div>
        <div className="stat-card green">
          <div className="stat-val">31</div>
          <div className="stat-lbl">Awaiting Transcript</div>
          <div className="stat-delta neutral">Court reporters notified</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-val">12</div>
          <div className="stat-lbl">Record Completeness Check</div>
          <div className="stat-delta neutral">Auto-reminders sent</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Active Hearing Sessions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {liveSessions.map((session, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid rgba(0,200,150,.4)',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="case-id">{session.caseId}</span>
                  <Badge variant="green">● LIVE — {session.duration}</Badge>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text)', marginBottom: '4px' }}>{session.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                  {session.judge} · {session.format} {session.isJoinable ? `· ${session.participants} participants` : session.location}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  {session.isJoinable && <button className="btn btn-primary btn-sm">Join Session</button>}
                  <button className="btn btn-ghost btn-sm">Evidence Workspace</button>
                  <button className="btn btn-ghost btn-sm">Issue Order</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Post-Hearing — Record Closure Tracker</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Transcript</th>
                <th>Briefs</th>
                <th>Record</th>
              </tr>
            </thead>
            <tbody>
              {postHearing.map((item, idx) => (
                <tr key={idx}>
                  <td><span className="case-id">{item.caseId}</span></td>
                  <td><Badge variant={item.transcript === 'Received' ? 'green' : 'amber'}>{item.transcript}</Badge></td>
                  <td><Badge variant={item.briefs === 'Received' ? 'green' : 'amber'}>{item.briefs}</Badge></td>
                  <td><Badge variant={item.record === 'Auto-Closed' ? 'green' : 'amber'}>{item.record}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Hearing;
