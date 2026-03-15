import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut } from 'lucide-react';
import { Button } from '../UI';
import { useAuth } from '../../context/AuthContext';
import SideNav from '../UI/SideNav';
import { getNavForRole } from '../../core/roleNavConfig';
import NotificationsPanel from '../oalj/NotificationsPanel';
import { MOCK_NOTIFICATIONS } from '../../data/mockDashboardData';

interface AppShellProps {
  activeNavItem: string;
  onNavItemClick: (id: string) => void;
  children: React.ReactNode;
}

export default function AppShell({ activeNavItem, onNavItemClick, children }: AppShellProps) {
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);
  const [notifications] = useState(MOCK_NOTIFICATIONS);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const navItems = getNavForRole(user.role);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen h-screen flex flex-row overflow-hidden">
      {/* Left: Side Navigation */}
      <SideNav
        items={navItems}
        activeItem={activeNavItem}
        onItemClick={onNavItemClick}
        roleName={user.role}
        division={user.division || 'OALJ'}
        collapsed={sideNavCollapsed}
        onToggleCollapse={() => setSideNavCollapsed(!sideNavCollapsed)}
      />

      {/* Right: Header + Content */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Government Banner */}
        <div className="bg-slate-800 text-white text-[10px] px-6 py-0.5 flex items-center gap-1">
          <span className="font-semibold">An official website of the United States government</span>
        </div>

        {/* App Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">U.S. Department of Labor</span>
              <span className="text-sm font-semibold text-slate-800">OALJ Case Management</span>
            </div>
          </div>

          {/* Center: Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search cases, docket numbers..."
              className="pl-10 pr-4 py-1.5 rounded-full bg-slate-100 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Right: Notifications + User */}
          <div className="flex items-center gap-4">
            <NotificationsPanel
              notifications={notifications}
              onNotificationClick={(n) => console.log('Notification:', n)}
              onMarkAllRead={() => console.log('Mark all read')}
            />
            <span className="text-sm text-slate-600">{user.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
              className="text-slate-500 hover:text-red-600 hover:border-red-200"
            >
              Sign Out
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
