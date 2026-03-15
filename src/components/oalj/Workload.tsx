import React from 'react';
import Badge from './Badge';

const Workload: React.FC = () => {
  const judges = [
    { name: 'ALJ Martinez', initials: 'MT', office: 'National', cases: 78, target: 85, hearings: 12, decisions: 8, status: 'green' },
    { name: 'ALJ Thompson', initials: 'TH', office: 'New York', cases: 52, target: 85, hearings: 8, decisions: 11, status: 'green' },
    { name: 'ALJ Rivera', initials: 'RR', office: 'Los Angeles', cases: 91, target: 85, hearings: 15, decisions: 6, status: 'amber' },
    { name: 'ALJ Chen', initials: 'JC', office: 'National', cases: 44, target: 85, hearings: 6, decisions: 9, status: 'green' },
    { name: 'ALJ Park', initials: 'SP', office: 'Baltimore', cases: 103, target: 85, hearings: 18, decisions: 4, status: 'red' },
    { name: 'ALJ Kim', initials: 'HK', office: 'DC', cases: 67, target: 85, hearings: 10, decisions: 7, status: 'green' },
    { name: 'ALJ Rodriguez', initials: 'MR', office: 'New York', cases: 71, target: 85, hearings: 9, decisions: 10, status: 'green' },
    { name: 'ALJ Wilson', initials: 'JW', office: 'Pittsburgh', cases: 88, target: 85, hearings: 14, decisions: 5, status: 'amber' },
  ];

  const officeSummary = [
    { office: 'National Office', cases: 312, judges: 4, avgLoad: 78 },
    { office: 'New York', cases: 187, judges: 2, avgLoad: 94 },
    { office: 'Los Angeles', cases: 143, judges: 2, avgLoad: 72 },
    { office: 'Baltimore', cases: 156, judges: 2, avgLoad: 78 },
    { office: 'Pittsburgh', cases: 201, judges: 2, avgLoad: 101 },
  ];

  return (
    <div className="screen" id="screen-workload">
      <div className="breadcrumb">OALJ CMS <span className="sep">›</span> <span>Workload Management</span></div>

      <div className="stat-row" style={{ marginBottom: '18px' }}>
        <div className="stat-card accent">
          <div className="stat-val">24</div>
          <div className="stat-lbl">Total ALJs</div>
          <div className="stat-delta neutral">Across all offices</div>
        </div>
        <div className="stat-card green">
          <div className="stat-val">1,847</div>
          <div className="stat-lbl">Active Cases</div>
          <div className="stat-delta neutral">System-wide</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-val">77</div>
          <div className="stat-lbl">Avg Cases / ALJ</div>
          <div className="stat-delta neutral">Target: 85</div>
        </div>
        <div className="stat-card red">
          <div className="stat-val">3</div>
          <div className="stat-lbl">Over Capacity</div>
          <div className="stat-delta down">Needs rebalance</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-val">142</div>
          <div className="stat-lbl">Hearings / Month</div>
          <div className="stat-delta up">↑ Next 30 days</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">ALJ Workload Details</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ALJ</th>
                <th>Office</th>
                <th>Active Cases</th>
                <th>Hearings</th>
                <th>Decisions</th>
                <th>Load</th>
              </tr>
            </thead>
            <tbody>
              {judges.map((judge, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="avatar" style={{ width: '24px', height: '24px', fontSize: '9px' }}>{judge.initials}</div>
                      {judge.name}
                    </div>
                  </td>
                  <td>{judge.office}</td>
                  <td>{judge.cases}</td>
                  <td>{judge.hearings}</td>
                  <td>{judge.decisions}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div className="prog-bar" style={{ width: '80px' }}>
                        <div
                          className="prog-fill"
                          style={{ width: `${Math.min((judge.cases / judge.target) * 100, 100)}%`, background: `var(--${judge.status})` }}
                        ></div>
                      </div>
                      <Badge variant={judge.status}>{Math.round((judge.cases / judge.target) * 100)}%</Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">Office Summary</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Office</th>
                <th>Cases</th>
                <th>Judges</th>
                <th>Avg Load</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {officeSummary.map((office, idx) => {
                const status = office.avgLoad > 90 ? 'red' : office.avgLoad > 80 ? 'amber' : 'green';
                return (
                  <tr key={idx}>
                    <td>{office.office}</td>
                    <td>{office.cases}</td>
                    <td>{office.judges}</td>
                    <td>{office.avgLoad}</td>
                    <td><Badge variant={status as any}>{status === 'green' ? 'Balanced' : status === 'amber' ? 'High' : 'Overloaded'}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ fontSize: '10.5px', color: 'var(--text3)', marginTop: '12px' }}>
            Target: 85 active cases per ALJ · Rebalance recommended for Pittsburgh and New York offices
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workload;
