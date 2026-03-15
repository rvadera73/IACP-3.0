import React from 'react';
import Badge from './Badge';

const Intake: React.FC = () => {
  const validationQueue = [
    { id: 'DRAFT-4421', issue: 'Missing respondent address', status: 'Awaiting' as const },
    { id: 'DRAFT-4418', issue: 'Incomplete injury date', status: 'Awaiting' as const },
    { id: 'DRAFT-4415', issue: 'Missing employer EIN', status: 'Resolved' as const },
    { id: 'DRAFT-4409', issue: 'Duplicate filing detected', status: 'Review' as const },
  ];

  return (
    <div className="screen" id="screen-intake">
      <div className="breadcrumb">OALJ CMS <span className="sep">›</span> <span>Intake & Docketing</span></div>
      
      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '18px' }}>
        <div className="stat-card green">
          <div className="stat-val">38</div>
          <div className="stat-lbl">Pending Docketing</div>
          <div className="stat-delta neutral">Auto-processing</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-val">4</div>
          <div className="stat-lbl">Validation Errors</div>
          <div className="stat-delta down">Deficiency notices sent</div>
        </div>
        <div className="stat-card accent">
          <div className="stat-val">99.4%</div>
          <div className="stat-lbl">Auto-Docket Rate</div>
          <div className="stat-delta up">↑ from 0% AS-IS</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Filing Channels — Today</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '20px' }}>🌐</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)' }}>Unified Filing Portal</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Real-time · Auto-validated</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-green">● Live</span>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', fontWeight: 600, color: 'var(--green)', marginTop: '3px' }}>31 filings</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '20px' }}>📧</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)' }}>Email / Fax Auto-Gateway</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>OCR processed · Auto-ingested</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-green">● Live</span>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', fontWeight: 600, color: 'var(--green)', marginTop: '3px' }}>5 filings</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '20px' }}>🔗</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)' }}>Agency API (OWCP / OFLC)</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Real-time sync · Zero-lag</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-green">● Live</span>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', fontWeight: 600, color: 'var(--green)', marginTop: '3px' }}>2 filings</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Validation Queue</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="alert-bar">⚠ 4 filings require deficiency resolution — notices sent automatically</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Filing ID</th>
                  <th>Issue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {validationQueue.map((item, idx) => (
                  <tr key={idx}>
                    <td><span className="case-id">{item.id}</span></td>
                    <td style={{ fontSize: '11.5px' }}>{item.issue}</td>
                    <td>
                      <Badge variant={item.status === 'Resolved' ? 'green' : item.status === 'Review' ? 'red' : 'amber'}>
                        {item.status === 'Resolved' ? '✓ ' : ''}{item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intake;
