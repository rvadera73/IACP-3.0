import React from 'react';
import Badge from './Badge';

const PostDecision: React.FC = () => {
  const appeals = [
    { caseId: 'LCA-2024-00901', title: 'Okafor v. Meridian Shipping', status: 'Appeal Pending', statusVariant: 'amber' as const, court: 'ARB', filed: 'Nov 15, 2023' },
    { caseId: 'DBA-2024-00445', title: 'Martinez v. Coastal Build', status: 'Briefing', statusVariant: 'blue' as const, court: 'BRB', filed: 'Oct 3, 2023' },
    { caseId: 'WB-2024-00512', title: 'Johnson v. Finance Plus', status: 'Decision Awaited', statusVariant: 'purple' as const, court: 'ECAB', filed: 'Sep 22, 2023' },
    { caseId: 'LCA-2024-00723', title: 'Williams v. Atlantic Shipping', status: 'Remanded', statusVariant: 'red' as const, court: 'ARB', filed: 'Aug 14, 2023' },
    { caseId: 'BLA-2024-00834', title: 'Estate of Davis', status: 'Closed', statusVariant: 'gray' as const, court: 'BRB', filed: 'Jul 5, 2023' },
  ];

  const complianceItems = [
    { caseId: 'ARB-LCA-831', title: 'Patel v. Harbor Freight - Compliance', dueDate: 'Jun 15, 2024', status: 'Pending' as const },
    { caseId: 'BRB-DBA-744', title: 'Chen v. Pacific Construction - Reopening', dueDate: 'May 30, 2024', status: 'Overdue' as const },
  ];

  return (
    <div className="screen" id="screen-postdecision">
      <div className="breadcrumb">OALJ CMS <span className="sep">›</span> <span>Post-Decision & Appeals</span></div>

      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '18px' }}>
        <div className="stat-card accent">
          <div className="stat-val">647</div>
          <div className="stat-lbl">Active Appeals</div>
          <div className="stat-delta neutral">Across all courts</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-val">34</div>
          <div className="stat-lbl">Briefs Due</div>
          <div className="stat-delta neutral">Next 30 days</div>
        </div>
        <div className="stat-card green">
          <div className="stat-val">128</div>
          <div className="stat-lbl">Transmitted</div>
          <div className="stat-delta up">↑ This month</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-val">23</div>
          <div className="stat-lbl">Compliance Reviews</div>
          <div className="stat-delta neutral">Pending</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Appeals Tracker</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Court</th>
                <th>Filed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appeals.map((item, idx) => (
                <tr key={idx}>
                  <td><span className="case-id">{item.caseId}</span></td>
                  <td><div className="case-name">{item.title}</div></td>
                  <td><Badge variant="gray">{item.court}</Badge></td>
                  <td>{item.filed}</td>
                  <td><Badge variant={item.statusVariant}>{item.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">Compliance & Remand Tracker</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {complianceItems.map((item, idx) => (
                <tr key={idx}>
                  <td><span className="case-id">{item.caseId}</span></td>
                  <td><div className="case-name">{item.title}</div></td>
                  <td>{item.dueDate}</td>
                  <td><Badge variant={item.status === 'Overdue' ? 'red' : 'amber'}>{item.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PostDecision;
