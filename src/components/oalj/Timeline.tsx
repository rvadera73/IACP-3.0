import React from 'react';

interface TimelineItem {
  status: 'done' | 'active' | 'pending';
  icon: string;
  title: string;
  subtitle: string;
  timestamp: string;
}

interface TimelineProps {
  items: TimelineItem[];
  title?: string;
}

const Timeline: React.FC<TimelineProps> = ({ items, title }) => {
  return (
    <div className="card">
      {title && <div className="card-title">{title}</div>}
      <div className="timeline">
        {items.map((item, idx) => (
          <div key={idx} className="tl-item">
            <div className={`tl-dot ${item.status}`}>{item.icon}</div>
            <div className="tl-content">
              <div className="tl-title">{item.title}</div>
              <div className="tl-sub">{item.subtitle}</div>
              <div className="tl-date">{item.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
