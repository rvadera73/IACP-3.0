import React from 'react';
import Badge from './Badge';

const Decision: React.FC = () => {
  const pendingDecisions = [
    { caseId: 'DBA-2024-00612', title: 'Chen v. Pacific Construction', judge: 'ALJ Rivera', days: 47, target: 45, status: 'Overdue' as const },
    { caseId: 'LCA-2024-00723', title: 'Williams v. Atlantic Shipping', judge: 'ALJ Martinez', days: 38, target: 45, status: 'Due Soon' as const },
    { caseId: 'WB-2024-00654', title: 'Taylor v. Finance Corp', judge: 'ALJ Thompson', days: 21, target: 45, status: 'On Track' as const },
    { caseId: 'BLA-2024-00987', title: 'Estate of Johnson', judge: 'ALJ Chen', days: 15, target: 45, status: 'On Track' as const },
  ];

  const issuedDecisions = [
    { caseId: 'LCA-2024-00831', title: 'Rodriguez v. Harbor Logistics', judge: 'ALJ Martinez', issuedAt: 'Today, 10:42 AM', published: true },
    { caseId: 'DBA-2024-00501', title: 'Kim v. Construction Plus', judge: 'ALJ Park', issuedAt: 'Yesterday, 3:15 PM', published: true },
    { caseId: 'WB-2024-00612', title: 'Anderson v. Tech Industries', judge: 'ALJ Kim', issuedAt: 'Yesterday, 11:30 AM', published: false },
  ];

  return (
    <div className="screen" id="screen-decision">
      <div className="breadcrumb">OALJ CMS <span className="sep">›</span> <span>Decisions</span></div>

      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '18px' }}>
        <div className="stat-card accent">
          <div className="stat-val">298</div>
          <div className="stat-lbl">Pending Decisions</div>
          <div className="stat-delta neutral">In workflow</div>
        </div>
        <div className="stat-card red">
          <div className="stat-val">7</div>
          <div className="stat-lbl">Overdue</div>
          <div className="stat-delta down">Requires attention</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-val">23</div>
          <div className="stat-lbl">Due in 7 Days</div>
          <div className="stat-delta neutral">Upcoming deadline</div>
        </div>
        <div className="stat-card green">
          <div className="stat-val">94</div>
          <div className="stat-lbl">Issued This Month</div>
          <div className="stat-delta up">↑ 12% vs target</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Pending Decisions — SLA Tracker</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Title</th>
                <th>ALJ</th>
                <th>Days</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingDecisions.map((item, idx) => (
                <tr key={idx}>
                  <td><span className="case-id">{item.caseId}</span></td>
                  <td><div className="case-name">{item.title}</div></td>
                  <td>{item.judge}</td>
                  <td>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                      <span style={{ color: item.days > item.target ? 'var(--red)' : 'var(--text)' }}>{item.days}</span>
                      {' / '}{item.target} days
                    </div>
                  </td>
                  <td>
                    <Badge variant={item.status === 'Overdue' ? 'red' : item.status === 'Due Soon' ? 'amber' : 'green'}>
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">Recently Issued</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {issuedDecisions.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface2)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="case-id">{item.caseId}</span>
                  {item.published && <Badge variant="green">✓ Published</Badge>}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text)' }}>{item.title}</div>
                <div style={{ fontSize: '10.5px', color: 'var(--text3)', marginTop: '4px' }}>
                  {item.judge} · {item.issuedAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Decision;
