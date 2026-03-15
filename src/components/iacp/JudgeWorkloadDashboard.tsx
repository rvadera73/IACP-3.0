import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Scale,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, Badge } from '../UI';

export default function JudgeWorkloadDashboard() {
  // Mock judge workload data
  const judges = [
    {
      id: 'J001',
      name: 'Hon. Sarah Jenkins',
      office: 'Pittsburgh, PA',
      activeCases: 24,
      weightedLoad: 58,
      capacity: 75,
      utilization: 77,
      caseTypes: { BLA: 15, LHC: 6, PER: 3 },
      pendingDecisions: 5,
      overdueDecisions: 1,
      upcomingHearings: 3,
      compliance270: 96,
      status: 'Available',
      specialty: ['BLA', 'LHC'],
    },
    {
      id: 'J002',
      name: 'Hon. Michael Ross',
      office: 'New York, NY',
      activeCases: 18,
      weightedLoad: 42,
      capacity: 75,
      utilization: 56,
      caseTypes: { BLA: 8, LHC: 7, PER: 3 },
      pendingDecisions: 3,
      overdueDecisions: 0,
      upcomingHearings: 5,
      compliance270: 100,
      status: 'Available',
      specialty: ['LHC', 'PER'],
    },
    {
      id: 'J003',
      name: 'Hon. Patricia Chen',
      office: 'San Francisco, CA',
      activeCases: 32,
      weightedLoad: 78,
      capacity: 75,
      utilization: 104,
      caseTypes: { BLA: 22, LHC: 7, PER: 3 },
      pendingDecisions: 8,
      overdueDecisions: 2,
      upcomingHearings: 2,
      compliance270: 88,
      status: 'Overloaded',
      specialty: ['BLA'],
    },
    {
      id: 'J004',
      name: 'Hon. James Wilson',
      office: 'Washington, DC',
      activeCases: 12,
      weightedLoad: 28,
      capacity: 75,
      utilization: 37,
      caseTypes: { BLA: 5, LHC: 4, PER: 3 },
      pendingDecisions: 2,
      overdueDecisions: 0,
      upcomingHearings: 1,
      compliance270: 100,
      status: 'Underutilized',
      specialty: ['PER', 'WB'],
    },
  ];

  const officeStats = {
    totalJudges: 4,
    avgUtilization: 69,
    totalActiveCases: 86,
    totalPendingDecisions: 18,
    complianceRate: 96,
  };

  const getSuggestedJudge = () => {
    // Simple algorithm: lowest utilization + available
    return judges.reduce((lowest, judge) => 
      judge.utilization < lowest.utilization ? judge : lowest
    );
  };

  const suggestedJudge = getSuggestedJudge();

  return (
    <div className="space-y-6">
      {/* Office Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Judges</div>
          <div className="text-2xl font-bold">{officeStats.totalJudges}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Avg Utilization</div>
          <div className="text-2xl font-bold">{officeStats.avgUtilization}%</div>
          <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Optimal range (60-80%)
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Active Cases</div>
          <div className="text-2xl font-bold">{officeStats.totalActiveCases}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Pending Decisions</div>
          <div className="text-2xl font-bold">{officeStats.totalPendingDecisions}</div>
          <div className="text-xs text-slate-500 mt-1">Office-wide</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">270-Day Compliance</div>
          <div className="text-2xl font-bold">{officeStats.complianceRate}%</div>
          <div className="text-xs text-emerald-600 mt-1">Above target (95%)</div>
        </Card>
      </div>

      {/* Suggested Judge for Next Assignment */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Suggested Judge for Next Assignment</h3>
                <p className="text-sm text-slate-600">Based on workload balance and case type expertise</p>
              </div>
            </div>
            <Badge variant="success" size="sm">Recommended</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900">{suggestedJudge.name}</div>
              <div className="text-xs text-slate-500">{suggestedJudge.office}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Utilization</div>
              <div className="text-lg font-bold text-emerald-600">{suggestedJudge.utilization}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Active Cases</div>
              <div className="text-lg font-bold text-slate-900">{suggestedJudge.activeCases}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Specialty</div>
              <div className="text-sm font-medium text-slate-700">{suggestedJudge.specialty.join(', ')}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Judge Workload Table */}
      <Card>
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">Judge Workload Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Judge</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Cases</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Weighted Load</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Utilization</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending Decisions</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">270-Day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {judges.map((judge) => (
                <tr key={judge.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{judge.name}</div>
                      <div className="text-xs text-slate-500">{judge.office}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {Object.entries(judge.caseTypes).map(([type, count]) => (
                          <span key={type} className="inline-block mr-2">
                            {type}: {count}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        judge.status === 'Overloaded' ? 'error' :
                        judge.status === 'Underutilized' ? 'warning' :
                        'success'
                      }
                      size="sm"
                    >
                      {judge.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{judge.activeCases}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-slate-900">{judge.weightedLoad}</div>
                      <div className="text-xs text-slate-500">/ {judge.capacity}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`text-sm font-bold ${
                        judge.utilization > 90 ? 'text-red-600' :
                        judge.utilization < 50 ? 'text-amber-600' :
                        'text-emerald-600'
                      }`}>
                        {judge.utilization}%
                      </div>
                      {judge.utilization > 90 ? <ArrowUpRight className="w-3 h-3 text-red-600" /> :
                       judge.utilization < 50 ? <ArrowDownRight className="w-3 h-3 text-amber-600" /> :
                       <CheckCircle className="w-3 h-3 text-emerald-600" />}
                    </div>
                    <div className="h-1.5 w-24 bg-slate-100 rounded-full mt-1">
                      <div
                        className={`h-full rounded-full ${
                          judge.utilization > 90 ? 'bg-red-500' :
                          judge.utilization < 50 ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${judge.utilization}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{judge.pendingDecisions}</div>
                    {judge.overdueDecisions > 0 && (
                      <div className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {judge.overdueDecisions} overdue
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-bold ${
                      judge.compliance270 >= 95 ? 'text-emerald-600' :
                      judge.compliance270 >= 85 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {judge.compliance270}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Capacity Alerts */}
      <Card className="border-amber-200 bg-amber-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-amber-900">Capacity Alerts</h3>
          </div>
          <div className="space-y-3">
            {judges.filter(j => j.utilization > 90).map(judge => (
              <div key={judge.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                <div>
                  <div className="text-sm font-bold text-amber-900">{judge.name}</div>
                  <div className="text-xs text-amber-700">
                    Utilization at {judge.utilization}% - {judge.activeCases} active cases
                  </div>
                </div>
                <Badge variant="error" size="sm">Overloaded</Badge>
              </div>
            ))}
            {judges.filter(j => j.utilization > 90).length === 0 && (
              <div className="text-sm text-amber-700">No capacity alerts at this time</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
