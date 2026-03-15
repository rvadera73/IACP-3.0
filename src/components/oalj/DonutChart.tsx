import React from 'react';

interface DonutChartProps {
  total: number;
  segments: {
    label: string;
    value: number;
    color: string;
  }[];
  title?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ total, segments, title }) => {
  let cumulativePercent = 0;
  const gradients = segments.map((seg) => {
    const start = cumulativePercent;
    const end = cumulativePercent + (seg.value / total) * 100;
    cumulativePercent = end;
    return `${seg.color} ${start}% ${end}%`;
  });

  return (
    <div className="card">
      {title && <div className="card-title">{title}</div>}
      <div className="donut-wrap">
        <div
          className="donut"
          style={{
            background: `conic-gradient(${gradients.join(', ')})`,
          }}
        >
          <div className="donut-hole">{total.toLocaleString()}</div>
        </div>
        <div className="donut-legend">
          {segments.map((seg, idx) => (
            <div key={idx} className="legend-item">
              <div className="legend-dot" style={{ background: seg.color }}></div>
              {seg.label}
              <strong style={{ marginLeft: 'auto', color: 'var(--text)' }}>
                {seg.value.toLocaleString()}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
