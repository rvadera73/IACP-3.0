import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  FileText, 
  Users, 
  Calendar, 
  Timeline, 
  Scale,
  Clock,
  AlertCircle,
  CheckCircle,
  Download,
  Plus,
  X
} from 'lucide-react';
import { cn, Button, Card, Badge } from '../UI';
import FilingsTable, { Filing } from './FilingsTable';

export interface Party {
  name: string;
  role: string;
  organization?: string;
  email?: string;
  isRepresented: boolean;
  attorneyName?: string;
  attorneyEmail?: string;
}

export interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  type: 'Statutory' | 'Court-Ordered' | 'Filing' | 'Hearing';
  status: 'Completed' | 'Pending' | 'Overdue';
  relatedFilingId?: string;
}

export interface CaseRecordData {
  id: string;
  docketNumber: string;
  caseType: string;
  category: 'Adjudication' | 'Appeal';
  title: string;
  claimant: string;
  employer: string;
  judge?: string;
  office?: string;
  status: string;
  nextDeadline?: string;
  nextEvent?: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  filings: Filing[];
  parties: Party[];
  deadlines: Deadline[];
  createdAt: string;
}

interface CaseRecordProps {
  caseData: CaseRecordData;
  onBack: () => void;
  onNewFiling?: () => void;
}

type TabType = 'filings' | 'parties' | 'deadlines' | 'overview';

export default function CaseRecord({ 
  caseData, 
  onBack,
  onNewFiling 
}: CaseRecordProps) {
  const [activeTab, setActiveTab] = useState<TabType>('filings');

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'text-red-600 bg-red-50';
      case 'High': return 'text-amber-600 bg-amber-50';
      case 'Medium': return 'text-blue-600 bg-blue-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'filings', label: 'Filings & Motions', icon: Scale, count: caseData.filings.length },
    { id: 'parties', label: 'Parties', icon: Users, count: caseData.parties.length },
    { id: 'deadlines', label: 'Deadlines', icon: Calendar, count: caseData.deadlines.filter(d => d.status === 'Pending').length },
  ];

  const StatCard = ({ label, value, icon: Icon, color = 'text-slate-900' }: any) => (
    <div className="p-4 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className={cn("text-sm font-bold", color)}>{value}</div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Case Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Case Type" 
          value={caseData.caseType} 
          icon={Scale} 
        />
        <StatCard 
          label="Office" 
          value={caseData.office || 'N/A'} 
          icon={Users} 
        />
        <StatCard 
          label="Status" 
          value={caseData.status} 
          icon={CheckCircle}
          color={caseData.status === 'Active' ? 'text-green-600' : 'text-slate-900'}
        />
        <StatCard 
          label="Next Deadline" 
          value={caseData.nextDeadline ? new Date(caseData.nextDeadline).toLocaleDateString() : 'TBD'} 
          icon={Clock}
          color={caseData.urgency === 'Critical' || caseData.urgency === 'High' ? 'text-red-600' : 'text-slate-900'}
        />
      </div>

      {/* Case Description */}
      <Card>
        <div className="p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Case Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Claimant</div>
              <div className="text-sm font-semibold text-slate-900">{caseData.claimant}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Employer</div>
              <div className="text-sm font-semibold text-slate-900">{caseData.employer}</div>
            </div>
            {caseData.judge && (
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assigned Judge</div>
                <div className="text-sm font-semibold text-slate-900">{caseData.judge}</div>
              </div>
            )}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Filed On</div>
              <div className="text-sm font-semibold text-slate-900">
                {new Date(caseData.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Recent Filings</h3>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('filings')}>
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {caseData.filings.slice(0, 3).map((filing) => (
              <div 
                key={filing.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-sm font-medium text-slate-900">{filing.type}</div>
                    <div className="text-xs text-slate-500">{filing.description}</div>
                  </div>
                </div>
                <Badge 
                  variant={filing.status === 'Accepted' ? 'success' : filing.status === 'Pending' ? 'warning' : 'error'}
                  size="sm"
                >
                  {filing.status}
                </Badge>
              </div>
            ))}
            {caseData.filings.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No filings yet</p>
            )}
          </div>
        </div>
      </Card>

      {/* Upcoming Deadlines */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Upcoming Deadlines</h3>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('deadlines')}>
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {caseData.deadlines
              .filter(d => d.status === 'Pending')
              .slice(0, 3)
              .map((deadline) => {
                const daysLeft = Math.ceil((new Date(deadline.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <div 
                    key={deadline.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      daysLeft <= 3 ? 'bg-red-50 border border-red-100' :
                      daysLeft <= 7 ? 'bg-amber-50 border border-amber-100' :
                      'bg-slate-50 border border-slate-100'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {daysLeft <= 3 ? (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-slate-900">{deadline.title}</div>
                        <div className="text-xs text-slate-500">{deadline.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-sm font-bold",
                        daysLeft <= 3 ? 'text-red-600' :
                        daysLeft <= 7 ? 'text-amber-600' :
                        'text-slate-700'
                      )}>
                        {new Date(deadline.dueDate).toLocaleDateString()}
                      </div>
                      <div className={cn(
                        "text-xs",
                        daysLeft <= 3 ? 'text-red-600' :
                        daysLeft <= 7 ? 'text-amber-600' :
                        'text-slate-500'
                      )}>
                        {daysLeft <= 0 ? 'Overdue' : `in ${daysLeft}d`}
                      </div>
                    </div>
                  </div>
                );
              })}
            {caseData.deadlines.filter(d => d.status === 'Pending').length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No upcoming deadlines</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderParties = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {caseData.parties.map((party, index) => (
          <Card key={index} variant="outlined">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-bold text-slate-900">{party.name}</div>
                  <Badge variant="info" size="sm" className="mt-1">
                    {party.role}
                  </Badge>
                </div>
                {party.isRepresented ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                )}
              </div>
              {party.organization && (
                <div className="text-xs text-slate-500 mb-2">{party.organization}</div>
              )}
              {party.isRepresented && party.attorneyName && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Attorney</div>
                  <div className="text-sm text-slate-700">{party.attorneyName}</div>
                  {party.attorneyEmail && (
                    <div className="text-xs text-slate-500">{party.attorneyEmail}</div>
                  )}
                </div>
              )}
              {party.email && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Email</div>
                  <div className="text-xs text-slate-600">{party.email}</div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDeadlines = () => {
    const sortedDeadlines = [...caseData.deadlines].sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    return (
      <div className="space-y-4">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Deadline</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Due Date</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Days Left</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedDeadlines.map((deadline) => {
                  const daysLeft = Math.ceil((new Date(deadline.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={deadline.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-slate-900">{deadline.title}</div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="neutral" size="sm">{deadline.type}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-slate-700 font-mono">
                          {new Date(deadline.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "text-sm font-bold",
                          daysLeft <= 3 ? 'text-red-600' :
                          daysLeft <= 7 ? 'text-amber-600' :
                          daysLeft > 0 ? 'text-green-600' :
                          'text-slate-600'
                        )}>
                          {daysLeft <= 0 ? 'Overdue' : `${daysLeft} days`}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Badge 
                          variant={deadline.status === 'Completed' ? 'success' : deadline.status === 'Overdue' ? 'error' : 'warning'}
                          size="sm"
                        >
                          {deadline.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Badge variant={getUrgencyColor(caseData.urgency).replace('bg-', 'text-').split(' ')[0]} size="sm">
                {caseData.caseType}
              </Badge>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                {caseData.category === 'Appeal' ? 'Appeal' : 'OALJ'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-mono">{caseData.docketNumber}</h1>
            <p className="text-sm text-slate-600 mt-1">{caseData.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onNewFiling && (
            <Button onClick={onNewFiling} leftIcon={<Plus className="w-4 h-4" />}>
              New Filing
            </Button>
          )}
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export Record
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              )}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold",
                  activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'filings' && <FilingsTable filings={caseData.filings} />}
          {activeTab === 'parties' && renderParties()}
          {activeTab === 'deadlines' && renderDeadlines()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
