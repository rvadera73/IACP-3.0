import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Info,
  X,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { cn, Button } from '../UI';

export interface Notification {
  id: string;
  caseId: string;
  caseNumber: string;
  type: 'Deadline' | 'Action Required' | 'Status Update' | 'Event' | 'Info';
  priority: 'Urgent' | 'Upcoming' | 'Resolved';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  dueAt?: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
}

const typeConfig = {
  'Deadline': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  'Action Required': { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  'Status Update': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  'Event': { icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50' },
  'Info': { icon: Info, color: 'text-slate-600', bg: 'bg-slate-50' },
};

const priorityOrder = {
  'Urgent': 0,
  'Upcoming': 1,
  'Resolved': 2,
};

export default function NotificationsPanel({ 
  notifications, 
  onNotificationClick,
  onMarkAllRead 
}: NotificationsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'dropdown' | 'full'>('dropdown');

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const groupedNotifications = {
    Urgent: sortedNotifications.filter(n => n.priority === 'Urgent'),
    Upcoming: sortedNotifications.filter(n => n.priority === 'Upcoming'),
    Resolved: sortedNotifications.filter(n => n.priority === 'Resolved'),
  };

  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick?.(notification);
    setIsOpen(false);
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const TypeIcon = typeConfig[notification.type].icon;
    const typeStyles = typeConfig[notification.type];

    return (
      <div
        onClick={() => handleNotificationClick(notification)}
        className={cn(
          "p-3 rounded-lg cursor-pointer transition-colors",
          notification.read ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100',
          "border border-slate-100"
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleNotificationClick(notification)}
      >
        <div className="flex items-start gap-3">
          <div className={cn("p-1.5 rounded", typeStyles.bg)}>
            <TypeIcon className={cn("w-4 h-4", typeStyles.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-900 truncate">
                {notification.caseNumber}
              </span>
              {!notification.read && (
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
            <div className="text-xs font-semibold text-slate-700 mb-1">
              {notification.title}
            </div>
            <div className="text-xs text-slate-500 line-clamp-2">
              {notification.message}
            </div>
            {notification.dueAt && (
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] text-slate-500">
                  Due: {new Date(notification.dueAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
        </div>
      </div>
    );
  };

  const NotificationGroup = ({ 
    title, 
    items, 
    icon: Icon 
  }: { 
    title: string; 
    items: Notification[]; 
    icon: React.ElementType 
  }) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4 text-slate-400" />
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {title} ({items.length})
          </h4>
        </div>
        <div className="space-y-2">
          {items.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    );
  };

  const NotificationsContent = () => (
    <div className="w-96 max-h-[600px] flex flex-col">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
          <p className="text-xs text-slate-500">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMarkAllRead}
            className="text-xs"
          >
            Mark all read
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <NotificationGroup 
          title="Urgent" 
          items={groupedNotifications.Urgent} 
          icon={AlertCircle} 
        />
        <NotificationGroup 
          title="Upcoming" 
          items={groupedNotifications.Upcoming} 
          icon={Clock} 
        />
        <NotificationGroup 
          title="Resolved Today" 
          items={groupedNotifications.Resolved} 
          icon={CheckCircle} 
        />
        {notifications.length === 0 && (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setView('dropdown');
        }}
        className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && view === 'dropdown' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <NotificationsContent />
            <div className="p-3 border-t border-slate-200">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setView('full')}
              >
                View all notifications
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Panel Modal (for "View All") */}
      <AnimatePresence>
        {view === 'full' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">All Notifications</h3>
                  <p className="text-xs text-slate-500">
                    {notifications.length} total notifications
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <NotificationGroup 
                  title="Urgent" 
                  items={groupedNotifications.Urgent} 
                  icon={AlertCircle} 
                />
                <NotificationGroup 
                  title="Upcoming" 
                  items={groupedNotifications.Upcoming} 
                  icon={Clock} 
                />
                <NotificationGroup 
                  title="Resolved Today" 
                  items={groupedNotifications.Resolved} 
                  icon={CheckCircle} 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
