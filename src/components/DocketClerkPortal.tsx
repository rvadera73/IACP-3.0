import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  FilePlus,
  BarChart3,
  Users,
  Bell,
  Search,
  LogOut,
  Scale,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { Button, Card, Badge } from '../UI';
import { useAuth } from '../context/AuthContext';
import DocketClerkDashboard from './iacp/DocketClerkDashboard';
import DocketManagement from './iacp/DocketManagement';
import JudgeWorkloadDashboard from './iacp/JudgeWorkloadDashboard';
import AnalyticsDashboard from './iacp/AnalyticsDashboard';

export default function DocketClerkPortal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'docket' | 'workload' | 'analytics'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'docket', label: 'Docket Management', icon: FilePlus },
    { id: 'workload', label: 'Judge Workload', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const;

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DocketClerkDashboard onCaseSelect={() => {}} />;
      case 'docket':
        return <DocketManagement onCaseSelect={() => {}} />;
      case 'workload':
        return <JudgeWorkloadDashboard />;
      case 'analytics':
        return <AnalyticsDashboard userRole={user.role} />;
      default:
        return <DocketClerkDashboard onCaseSelect={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-0'
      } bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-white leading-tight">IACP Portal</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Docket Clerk</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {activeView === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-grow min-w-0">
              <div className="text-sm font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">{user.role}</div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-900/20 text-slate-500 hover:text-red-400 rounded-lg transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-bold text-slate-900">
              {navItems.find(n => n.id === activeView)?.label || 'Dashboard'}
            </h1>
            <Badge variant="info">OALJ</Badge>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Global Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search cases, filings..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all w-64"
              />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
