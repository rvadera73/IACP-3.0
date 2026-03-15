import React from 'react';
import DonutChart from './DonutChart';
import SLAProgress from './SLAProgress';

const Analytics: React.FC = () => {
  const monthlyData = [
    { month: 'Jan', filings: 145, decisions: 87 },
    { month: 'Feb', filings: 162, decisions: 94 },
    { month: 'Mar', filings: 178, decisions: 102 },
    { month: 'Apr', filings: 156, decisions: 98 },
    { month: 'May', filings: 189, decisions: 112 },
    { month: 'Jun', filings: 134, decisions: 76 },
  ];

  const maxVal = Math.max(...monthlyData.flatMap(d => [d.filings, d.decisions]));

  const programDistribution = [
    { label: 'Longshore / DBA', value: 726, color: 'var(--green)' },
    { label: 'Black Lung', value: 332, color: 'var(--amber)' },
    { label: 'PERM / Immigration', value: 201, color: 'var(--red)' },
    { label: 'Whistleblower / Other', value: 588, color: 'var(--border2)' },
  ];

  const slaMetrics = [
    { label: 'Decisions on time', value: 87, status: 'green' as const },
    { label: 'Hearing notices ≥21 days', value: 98, status: 'green' as const },
    { label: 'Transcripts ≤30 days', value: 74, status: 'amber' as const },
    { label: 'Auto-docketing accuracy', value: 99, status: 'green' as const },
    { label: 'Settlement rate', value: 34, status: 'green' as const },
  ];

  return (
    <div className="screen" id="screen-analytics">
      <div className="breadcrumb">OALJ CMS <span className="sep">›</span> <span>Analytics</span></div>

      <div className="stat-row" style={{ marginBottom: '18px' }}>
        <div className="stat-card accent">
          <div className="stat-val">1,847</div>
          <div className="stat-lbl">Active Cases</div>
          <div className="stat-delta up">↑ 3.2% vs last month</div>
        </div>
        <div className="stat-card green">
          <div className="stat-val">94</div>
          <div className="stat-lbl">Decisions / Month</div>
          <div className="stat-delta up">↑ 12% vs target</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-val">23.4d</div>
          <div className="stat-lbl">Avg Processing Time</div>
          <div className="stat-delta down">↓ 2.1d improvement</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-val">34%</div>
          <div className="stat-lbl">Settlement Rate</div>
          <div className="stat-delta up">↑ 5% vs last quarter</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-val">99.4%</div>
          <div className="stat-lbl">Auto-Docket Rate</div>
          <div className="stat-delta neutral">System target: 99%</div>
        </div>
      </div>

      <div className="two-col" style={{ marginBottom: '18px' }}>
        <div className="card">
          <div className="card-title">Monthly Trend — Filings vs Decisions</div>
          <div className="bar-chart">
            {monthlyData.map((data, idx) => (
              <React.Fragment key={idx}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '80px' }}>
                    <div
                      className="bar"
                      style={{
                        width: '20px',
                        background: 'var(--accent)',
                        height: `${(data.filings / maxVal) * 100}%`,
                      }}
                    >
                      <span className="bar-val">{data.filings}</span>
                    </div>
                    <div
                      className="bar"
                      style={{
                        width: '20px',
                        background: 'var(--green)',
                        height: `${(data.decisions / maxVal) * 100}%`,
                      }}
                    >
                      <span className="bar-val">{data.decisions}</span>
                    </div>
                  </div>
                  <span className="bar-label">{data.month}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text3)' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--accent)', borderRadius: '2px' }}></div>
              Filings
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text3)' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--green)', borderRadius: '2px' }}></div>
              Decisions
            </div>
          </div>
        </div>

        <DonutChart total={1847} segments={programDistribution} title="Active Cases by Program" />
      </div>

      <div className="card">
        <div className="card-title">Performance Metrics — This Month</div>
        <SLAProgress items={slaMetrics} />
      </div>
    </div>
  );
};

export default Analytics;
