import React from 'react';
import { FileCheck, Inbox, Clock, CheckCircle } from 'lucide-react';
import { Card, Badge } from '../UI';

interface DocketStaffDashboardProps {
  onCaseSelect: (caseId: string) => void;
}

export default function DocketStaffDashboard({ onCaseSelect }: DocketStaffDashboardProps) {
  const inboxItems = [
    { id: '1', type: 'New Filing', caseNumber: '2026-BLA-00089', action: 'Assign Docket Number', received: '10 mins ago', priority: 'High' },
    { id: '2', type: 'Access Request', caseNumber: '2024-BLA-00042', action: 'Verify NOA', received: '1 hour ago', priority: 'Medium' },
    { id: '3', type: 'Motion Filed', caseNumber: '2025-LHC-00034', action: 'Route to Judge', received: '2 hours ago', priority: 'Medium' },
    { id: '4', type: 'Brief Submitted', caseNumber: 'BRB No. 24-0123', action: 'Add to Record', received: '3 hours ago', priority: 'Low' },
  ];

  const recentDocketings = [
    { caseNumber: '2026-BLA-00088', docketedAt: 'Today, 9:23 AM', clerk: 'J. Smith' },
    { caseNumber: '2026-LHC-00033', docketedAt: 'Today, 8:45 AM', clerk: 'M. Johnson' },
    { caseNumber: '2026-PER-00011', docketedAt: 'Yesterday, 4:15 PM', clerk: 'J. Smith' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-amber-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Inbox Items</div>
          <div className="text-3xl font-bold">{inboxItems.length}</div>
          <div className="text-xs text-slate-500 mt-1">Requires action</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Docketed Today</div>
          <div className="text-3xl font-bold">{recentDocketings.length}</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Completed</div>
          <div className="text-3xl font-bold">28</div>
          <div className="text-xs text-slate-500 mt-1">This week</div>
        </Card>
      </div>

      {/* Inbox */}
      <Card>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Inbox className="w-5 h-5 text-slate-400" />
              Action Queue
            </h3>
            <Badge variant="info">{inboxItems.length} pending</Badge>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {inboxItems.map((item) => (
            <div key={item.id} className="p-4 hover:bg-slate-50 cursor-pointer" onClick={() => onCaseSelect(item.caseNumber)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    item.priority === 'High' ? 'bg-red-50' :
                    item.priority === 'Medium' ? 'bg-amber-50' : 'bg-slate-50'
                  }`}>
                    <FileCheck className={`w-4 h-4 ${
                      item.priority === 'High' ? 'text-red-600' :
                      item.priority === 'Medium' ? 'text-amber-600' : 'text-slate-600'
                    }`} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{item.type}</div>
                    <div className="text-xs text-slate-500 font-mono">{item.caseNumber}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-700">{item.action}</div>
                  <div className="text-xs text-slate-400 mt-1">{item.received}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Docketings */}
      <Card>
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">Recent Docketings</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {recentDocketings.map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold font-mono">{item.caseNumber}</div>
                <div className="text-xs text-slate-500">Docketed by {item.clerk}</div>
              </div>
              <div className="text-sm text-slate-500">{item.docketedAt}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
