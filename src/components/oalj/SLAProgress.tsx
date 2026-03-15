import React from 'react';

interface SLAProgressProps {
  items: {
    label: string;
    value: number;
    status: 'green' | 'amber' | 'red';
  }[];
  title?: string;
}

const SLAProgress: React.FC<SLAProgressProps> = ({ items, title }) => {
  return (
    <div className="card">
      {title && <div className="card-title">{title}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, idx) => (
          <div key={idx}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11.5px',
                marginBottom: '3px',
              }}
            >
              <span style={{ color: 'var(--text2)' }}>{item.label}</span>
              <span
                style={{
                  color: `var(--${item.status})`,
                  fontWeight: 600,
                }}
              >
                {item.value}%
              </span>
            </div>
            <div className="prog-bar">
              <div
                className="prog-fill"
                style={{ width: `${item.value}%`, background: `var(--${item.status})` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SLAProgress;
