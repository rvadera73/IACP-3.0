import React, { useState } from 'react';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onNewFiling: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ title, subtitle = '· OALJ Case Management Platform', onNewFiling }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="topbar">
      <div>
        <span className="topbar-title">{title}</span>
        <span className="topbar-sub">{subtitle}</span>
      </div>
      <div className="topbar-right">
        <input
          className="topbar-search"
          placeholder="🔍  Search cases, parties, judges..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-ghost btn-sm">🔔</button>
        <button className="btn btn-primary btn-sm" onClick={onNewFiling}>+ New Filing</button>
      </div>
    </div>
  );
};

export default Topbar;
