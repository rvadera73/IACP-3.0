import React, { memo } from 'react';
import {
  Inbox,
  FileCheck,
  UserCheck,
  FolderOpen,
  Eye,
  Briefcase,
  FileText,
  FilePen,
  Search,
  Calendar,
  Mail,
  FileAudio,
  Scale,
  Video,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';

interface SideNavProps {
  items: { id: string; label: string; icon: string; description?: string }[];
  activeItem: string;
  onItemClick: (id: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  roleName?: string;
  division?: string;
}

const iconMap: Record<string, React.ElementType> = {
  Inbox,
  FileCheck,
  UserCheck,
  FolderOpen,
  Eye,
  Briefcase,
  FileText,
  FilePen,
  Search,
  Calendar,
  Mail,
  FileAudio,
  Scale,
  Video,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Menu,
};

const SideNav: React.FC<SideNavProps> = ({
  items,
  activeItem,
  onItemClick,
  collapsed = false,
  onToggleCollapse,
  roleName,
  division,
}) => {
  return (
    <aside
      className={`flex flex-col bg-[#1B2A3D] text-white transition-all duration-200 flex-shrink-0 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top section - Role info */}
      <div className={`px-3 py-4 border-b border-white/10 ${collapsed ? 'px-2' : ''}`}>
        {!collapsed && roleName && (
          <div className="mb-1">
            <span className="text-sm font-medium text-slate-300">{roleName}</span>
          </div>
        )}
        {!collapsed && division && (
          <div className="flex items-center">
            <span className="bg-blue-600 text-white rounded px-2 py-0.5 text-xs">
              {division}
            </span>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <Scale className="w-5 h-5 text-slate-400" />
          </div>
        )}
      </div>

      {/* Navigation items */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="flex-1 px-2 py-2 space-y-1 overflow-y-auto"
      >
        {items.map((item) => {
          const IconComponent = iconMap[item.icon] || Menu;
          const isActive = item.id === activeItem;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              title={collapsed ? `${item.label}${item.description ? ': ' + item.description : ''}` : item.description}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-white/15 text-white font-medium border-l-4 border-blue-400 pl-2'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom collapse toggle */}
      {onToggleCollapse && (
        <div className="p-2 border-t border-white/10">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!collapsed && <span className="text-xs ml-2">Collapse</span>}
          </button>
        </div>
      )}
    </aside>
  );
};

export default memo(SideNav);
