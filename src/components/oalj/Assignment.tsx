import React from 'react';
import Badge from './Badge';

const Assignment: React.FC = () => {
  const judges = [
    { name: 'ALJ Martinez', initials: 'MT', count: 78, percent: 78, status: 'green' },
    { name: 'ALJ Thompson', initials: 'TH', count: 52, percent: 52, status: 'green' },
    { name: 'ALJ Rivera', initials: 'RR', count: 91, percent: 91, status: 'amber' },
    { name: 'ALJ Chen', initials: 'JC', count: 44, percent: 44, status: 'green' },
    { name: 'ALJ Park', initials: 'SP', count: 103, percent: 100, status: 'red' },
  ];

  const recommendations = [
    { caseId: 'BLA-2024-01204', program: 'Black Lung', judge: 'ALJ Thompson', reason: 'Lowest caseload · Pittsburgh' },
    { caseId: 'LCA-2024-00912', program: 'Longshore', judge: 'ALJ Rodriguez', reason: 'Specialty match · NY' },
    { caseId: 'WB-2024-00801', program: 'Whistleblower', judge: 'ALJ Kim', reason: 'Availability · DC' },
  ];

  return (
    <div className="screen" id="screen-assignment">
      <div className="breadcrumb">OALJ CMS <span className="sep">›</span> <span>Assignment & BALCA</span></div>
      
      <div className="two-col">
        <div className="card">
          <div className="card-title">Workload-Balanced Assignment Queue</div>
          <div className="alert-bar" style={{ background: 'rgba(0,180,216,.1)', borderColor: 'rgba(0,180,216,.3)', color: 'var(--accent)' }}>
            ⚡ AI recommends 3 auto-assignments based on workload balance — <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Review & Approve</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Program</th>
                <th>Recommended ALJ</th>
                <th>Reason</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec, idx) => (
                <tr key={idx}>
                  <td><span className="case-id">{rec.caseId}</span></td>
                  <td><Badge variant={rec.program === 'Black Lung' ? 'gray' : rec.program === 'Longshore' ? 'blue' : 'purple'}>{rec.program}</Badge></td>
                  <td>{rec.judge}</td>
                  <td style={{ fontSize: '11px', color: 'var(--text3)' }}>{rec.reason}</td>
                  <td><button className="btn btn-primary btn-sm">Assign</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">Judge Workload Balance</div>
          {judges.map((judge, idx) => (
            <div key={idx} className="judge-row">
              <div className="avatar" style={{ width: '26px', height: '26px', fontSize: '10px' }}>{judge.initials}</div>
              <div className="judge-name">{judge.name}</div>
              <div className="judge-bar-wrap">
                <div className="prog-bar">
                  <div
                    className="prog-fill"
                    style={{ width: `${judge.percent}%`, background: `var(--${judge.status})` }}
                  ></div>
                </div>
              </div>
              <div className="judge-count" style={{ color: judge.status === 'red' ? 'var(--red)' : 'var(--text3)' }}>
                {judge.count}
              </div>
            </div>
          ))}
          <div style={{ fontSize: '10.5px', color: 'var(--text3)', marginTop: '10px' }}>
            Target: 85 active cases per ALJ · <span style={{ color: 'var(--red)' }}>ALJ Park over capacity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;
