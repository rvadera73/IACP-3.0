/**
 * Role-Specific Analytics Dashboard
 * 
 * Each role sees relevant metrics and reports based on their job function:
 * - Docket Clerk: Intake metrics, docketing efficiency, assignment tracking
 * - Judge: Caseload, decision timelines, hearing schedule
 * - Legal Assistant: Hearing scheduling, notice delivery, transcript tracking
 * - Attorney-Advisor: Bench memo status, draft decisions, citation analysis
 * - Board Roles: Appellate-specific metrics, briefing timelines, oral arguments
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, AlertCircle, Clock, BarChart3, Download, Calendar, Users, TrendingUp,
  CheckCircle, X, Sparkles, MessageSquare, PieChart, Activity, Filter, RefreshCw,
  Copy, Share2, Save, Play, Loader, Zap, Target, Award, TrendingDown, Gavel,
  Scale, BookOpen, Signature, Briefcase
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import { useAuth } from '../../context/AuthContext';

interface Report {
  id: string;
  name: string;
  type: string;
  generatedAt?: string;
  data?: any;
  prompt?: string;
}

// Role-specific configurations
const ROLE_ANALYTICS_CONFIG: Record<string, any> = {
  // OALJ Roles
  'OALJ Docket Clerk': {
    title: 'Docket Operations Analytics',
    description: 'Track intake efficiency, docketing rates, and case assignment',
    metrics: [
      { label: 'Total Filings', value: 47, trend: '+12%', trendUp: true },
      { label: 'Auto-Docket Rate', value: '68%', trend: '+5%', trendUp: true },
      { label: 'Avg Processing Time', value: '2.3 hrs', trend: '-0.5 hrs', trendUp: true },
      { label: 'Awaiting Assignment', value: 12, trend: '-3', trendUp: true },
    ],
    reports: ['docketing', 'deficiency', 'processing', 'intake'],
    charts: ['channelDistribution', 'caseTypeBreakdown', 'processingTrend'],
  },
  'OALJ Legal Assistant': {
    title: 'Hearing Operations Analytics',
    description: 'Monitor hearing schedules, notice delivery, and court reporter availability',
    metrics: [
      { label: 'Hearings This Month', value: 15, trend: '+3', trendUp: true },
      { label: 'Notices Issued', value: 28, trend: '+5', trendUp: true },
      { label: 'Avg Scheduling Time', value: '4.2 days', trend: '-1 day', trendUp: true },
      { label: 'Pro Se Notices', value: 8, trend: 'Same', trendUp: true },
    ],
    reports: ['hearings', 'notices', 'scheduling', 'reporters'],
    charts: ['hearingTypes', 'noticeDelivery', 'schedulingEfficiency'],
  },
  'OALJ Attorney-Advisor': {
    title: 'Legal Research Analytics',
    description: 'Track bench memos, draft decisions, and citation analysis',
    metrics: [
      { label: 'Active Bench Memos', value: 8, trend: '+2', trendUp: false },
      { label: 'Drafts in Review', value: 5, trend: '-1', trendUp: true },
      { label: 'Citations Checked', value: 42, trend: '+8', trendUp: true },
      { label: 'Precedent Matches', value: 15, trend: '+3', trendUp: true },
    ],
    reports: ['memos', 'drafts', 'citations', 'precedents'],
    charts: ['memoStatus', 'draftProgress', 'citationAccuracy'],
  },
  'Administrative Law Judge': {
    title: 'Judicial Analytics',
    description: 'Monitor caseload, decision timelines, and 270-day compliance',
    metrics: [
      { label: 'Active Cases', value: 24, trend: '-2', trendUp: true },
      { label: 'Decisions Due', value: 3, trend: 'Same', trendUp: true },
      { label: '270-Day Compliance', value: '96%', trend: '+2%', trendUp: true },
      { label: 'Avg Decision Time', value: '184 days', trend: '-12 days', trendUp: true },
    ],
    reports: ['caseload', 'decisions', 'compliance', 'hearings'],
    charts: ['caseloadDistribution', 'decisionTimeline', 'complianceTrend'],
  },

  // Boards Roles
  'Board Docket Clerk': {
    title: 'Appellate Docket Analytics',
    description: 'Track appeal filings, briefing schedules, and panel assignments',
    metrics: [
      { label: 'Total Appeals', value: 32, trend: '+5', trendUp: true },
      { label: 'Timely Filed', value: '94%', trend: '+2%', trendUp: true },
      { label: 'Awaiting Panel', value: 8, trend: '-2', trendUp: true },
      { label: 'Record Transfers', value: 12, trend: '+3', trendUp: false },
    ],
    reports: ['appeals', 'briefing', 'panels', 'transfers'],
    charts: ['appealTypes', 'jurisdictionCompliance', 'panelWorkload'],
  },
  'Board Legal Assistant': {
    title: 'Oral Argument Analytics',
    description: 'Monitor oral argument schedules, panel availability, and transcript delivery',
    metrics: [
      { label: 'Arguments Scheduled', value: 12, trend: '+2', trendUp: true },
      { label: 'Panels Confirmed', value: 10, trend: 'Same', trendUp: true },
      { label: 'Transcripts Pending', value: 3, trend: '-2', trendUp: true },
      { label: 'Avg Notice Time', value: '21 days', trend: '+3 days', trendUp: false },
    ],
    reports: ['oralArguments', 'panels', 'transcripts', 'notices'],
    charts: ['argumentTypes', 'panelAvailability', 'transcriptTurnaround'],
  },
  'Board Attorney-Advisor': {
    title: 'Appellate Research Analytics',
    description: 'Track appellate briefs, precedent analysis, and draft decisions',
    metrics: [
      { label: 'Briefs Under Review', value: 15, trend: '+3', trendUp: false },
      { label: 'Precedent Searches', value: 28, trend: '+5', trendUp: true },
      { label: 'Draft Decisions', value: 6, trend: '+1', trendUp: true },
      { label: 'Citation Verification', value: '98%', trend: '+1%', trendUp: true },
    ],
    reports: ['briefs', 'precedents', 'drafts', 'citations'],
    charts: ['briefingProgress', 'precedentMatches', 'draftStatus'],
  },
  'Board Member': {
    title: 'Panel Analytics',
    description: 'Monitor panel caseload, decision circulation, and dissent tracking',
    metrics: [
      { label: 'Cases on Panel', value: 18, trend: '-2', trendUp: true },
      { label: 'Decisions Circulated', value: 8, trend: '+2', trendUp: true },
      { label: 'Dissents Filed', value: 2, trend: 'Same', trendUp: true },
      { label: 'Avg Decision Time', value: '62 days', trend: '-5 days', trendUp: true },
    ],
    reports: ['caseload', 'decisions', 'dissents', 'compliance'],
    charts: ['panelWorkload', 'decisionTimeline', 'unanimityRate'],
  },
};

export default function AnalyticsDashboard({ userRole }: { userRole: string }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'custom' | 'saved'>('overview');
  const [selectedReportType, setSelectedReportType] = useState<string>('docketing');
  const [generatedReports, setGeneratedReports] = useState<Report[]>([]);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // AI Custom Report State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReportResult, setAiReportResult] = useState<any>(null);

  // Get role-specific configuration
  const roleConfig = ROLE_ANALYTICS_CONFIG[userRole] || ROLE_ANALYTICS_CONFIG['OALJ Docket Clerk'];

  // Mock data for reports
  const docketingData = {
    totalFilings: 47,
    autoDocketed: 32,
    manualReview: 8,
    deficiencyNotices: 5,
    awaitingAssignment: 12,
    autoDocketRate: 68,
    avgProcessingTime: '2.3 hrs',
    byChannel: { UFS: 28, Email: 12, Paper: 7 },
    byCaseType: { BLA: 25, LHC: 15, PER: 7 },
    trendData: [
      { month: 'Jan', filings: 35, docketed: 28 },
      { month: 'Feb', filings: 42, docketed: 35 },
      { month: 'Mar', filings: 47, docketed: 32 },
    ],
  };

  const hearingsData = {
    hearingsThisMonth: 15,
    noticesIssued: 28,
    avgSchedulingTime: '4.2 days',
    proSeNotices: 8,
    byType: { 'Pre-Hearing': 8, 'Hearing': 5, 'Status Conference': 2 },
    byLocation: { 'Room 402': 6, 'Room 301': 5, 'Video': 4 },
    trendData: [
      { month: 'Jan', hearings: 12, notices: 24 },
      { month: 'Feb', hearings: 14, notices: 26 },
      { month: 'Mar', hearings: 15, notices: 28 },
    ],
  };

  const caseloadData = {
    activeCases: 24,
    decisionsDue: 3,
    compliance270: 96,
    avgDecisionTime: '184 days',
    byStatus: { 'Pre-Hearing': 10, 'Hearing': 6, 'Decision': 8 },
    trendData: [
      { month: 'Jan', cases: 28, decisions: 5 },
      { month: 'Feb', cases: 26, decisions: 6 },
      { month: 'Mar', cases: 24, decisions: 8 },
    ],
  };

  const handleGenerateReport = () => {
    const newReport: Report = {
      id: `RPT-${Date.now()}`,
      name: `${selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} Report`,
      type: selectedReportType,
      generatedAt: new Date().toLocaleString(),
      data: selectedReportType === 'docketing' ? docketingData :
            selectedReportType === 'hearings' ? hearingsData : caseloadData,
    };

    setGeneratedReports([newReport, ...generatedReports]);
    setSelectedReport(newReport);
    setShowReportPreview(true);
  };

  const handleGenerateAIReport = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiResult = {
      title: 'Custom Analytics Report',
      prompt: aiPrompt,
      generatedAt: new Date().toLocaleString(),
      insights: roleConfig.metrics.map((m: any) => ({
        metric: m.label,
        value: typeof m.value === 'string' ? m.value : String(m.value),
        change: m.trend,
        trend: m.trendUp ? 'up' : 'down',
      })),
      charts: {
        overview: [
          { label: 'Q1', value: 42, color: '#3b82f6' },
          { label: 'Q2', value: 38, color: '#3b82f6' },
          { label: 'Q3', value: 45, color: '#3b82f6' },
          { label: 'Q4', value: 47, color: '#3b82f6' },
        ],
      },
      recommendations: [
        'Continue current workflow - metrics trending positively',
        'Consider additional training for deficiency reduction',
        'Review resource allocation for peak filing periods',
      ],
    };
    
    setAiReportResult(aiResult);
    setIsGenerating(false);
    
    const newReport: Report = {
      id: `AI-${Date.now()}`,
      name: `Custom: ${aiPrompt.slice(0, 50)}...`,
      type: 'custom',
      generatedAt: new Date().toLocaleString(),
      prompt: aiPrompt,
    };
    setGeneratedReports([newReport, ...generatedReports]);
  };

  // Simple Bar Chart Component
  const BarChart: React.FC<{ data: any[]; height?: number }> = ({ data, height = 200 }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="flex items-end justify-around gap-2" style={{ height }}>
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1">
            <div className="text-xs font-bold text-slate-700 mb-1">{item.value}</div>
            <div
              className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
              style={{
                height: `${(item.value / maxValue) * (height - 40)}px`,
                backgroundColor: item.color || '#3b82f6',
                minHeight: '20px',
              }}
            />
            <div className="text-xs text-slate-500 mt-2 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderRoleOverview = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Role-Specific Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{roleConfig.title}</h2>
              <p className="text-sm text-slate-600">{roleConfig.description}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Role-Specific Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {roleConfig.metrics.map((metric: any, idx: number) => (
          <Card key={idx} className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{metric.label}</div>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {typeof metric.value === 'number' && metric.value > 100 ? metric.value.toLocaleString() : metric.value}
            </div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${
              metric.trendUp ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {metric.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {metric.trend}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Quick Stats</h3>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('reports')}>
              View Reports
            </Button>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: 'Pending Review', value: '12', color: 'blue' },
              { label: 'Overdue Items', value: '3', color: 'red' },
              { label: 'Completed Today', value: '8', color: 'emerald' },
              { label: 'Scheduled This Week', value: '15', color: 'purple' },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="text-sm text-slate-600">{stat.label}</div>
                <div className={`text-lg font-bold text-${stat.color}-600`}>{stat.value}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Insights for {userRole}
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { type: 'success', title: 'Performance exceeding targets', desc: 'Continue current workflow' },
              { type: 'warning', title: '3 items require attention', desc: 'Review pending queue' },
              { type: 'info', title: 'Workload balanced', desc: 'No action required' },
            ].map((insight, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'success' ? 'bg-emerald-50 border-emerald-500' :
                insight.type === 'warning' ? 'bg-amber-50 border-amber-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <div className="font-bold text-slate-900 text-sm">{insight.title}</div>
                <div className="text-xs text-slate-600 mt-1">{insight.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Tab Navigation */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'overview' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'reports' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Role Reports
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'custom' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Custom
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'saved' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Save className="w-4 h-4" />
          Saved
        </button>
      </div>

      {/* Overview Tab - Role Specific */}
      {activeTab === 'overview' && renderRoleOverview()}

      {/* Standard Reports Tab - Role Specific */}
      {activeTab === 'reports' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    {roleConfig.title} - Reports
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Reports relevant to your role</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Report Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {roleConfig.reports.map((reportType: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedReportType(reportType)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedReportType === reportType ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <FileText className="w-6 h-6 text-blue-600 mb-2" />
                      <div className="font-bold text-slate-900 capitalize">{reportType.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-xs text-slate-500 mt-1">Detailed {reportType} analytics</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button onClick={handleGenerateReport} leftIcon={<BarChart3 className="w-4 h-4" />}>
                  Generate Report
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* AI Custom Report Tab */}
      {activeTab === 'custom' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card>
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900">AI-Powered Custom Report</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Describe the report you need (specific to {userRole})
                </label>
                <div className="relative">
                  <MessageSquare className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder={`e.g., Show me ${userRole.includes('Docket') ? 'docketing efficiency trends' : userRole.includes('Judge') ? 'decision timeline analysis' : 'performance metrics'} for the last quarter...`}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleGenerateAIReport}
                  disabled={!aiPrompt.trim() || isGenerating}
                  leftIcon={isGenerating ? <Loader className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isGenerating ? 'Generating...' : 'Generate AI Report'}
                </Button>
              </div>
            </div>
          </Card>

          {aiReportResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-purple-200">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{aiReportResult.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Generated: {aiReportResult.generatedAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Download className="w-3 h-3" />}>Export</Button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {aiReportResult.insights.map((insight: any, idx: number) => (
                      <Card key={idx} className="p-4">
                        <div className="text-xs text-slate-500 mb-1">{insight.metric}</div>
                        <div className="text-2xl font-bold text-slate-900">{insight.value}</div>
                        <div className={`text-xs mt-1 flex items-center gap-1 ${
                          insight.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {insight.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {insight.change}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Saved Reports Tab */}
      {activeTab === 'saved' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Saved Reports</h3>
            </div>
            <div className="p-6">
              {generatedReports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm">No saved reports yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedReports.map((report) => (
                    <div key={report.id} className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{report.name}</div>
                        <div className="text-xs text-slate-500">Generated: {report.generatedAt}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedReport(report); setShowReportPreview(true); }}>View</Button>
                        <Button variant="outline" size="sm" leftIcon={<Download className="w-3 h-3" />}>Export</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Report Preview Modal */}
      {showReportPreview && selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedReport.name}</h3>
                <p className="text-sm text-slate-600">Generated: {selectedReport.generatedAt}</p>
              </div>
              <button onClick={() => setShowReportPreview(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6">
              {/* Render report data based on type */}
              {selectedReport.data ? (
                <div className="space-y-6">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {selectedReport.type === 'docketing' && (
                      <>
                        <Card className="p-4">
                          <div className="text-xs text-slate-500 mb-1">Total Filings</div>
                          <div className="text-2xl font-bold text-slate-900">{selectedReport.data.totalFilings}</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-xs text-slate-500 mb-1">Auto-Docket Rate</div>
                          <div className="text-2xl font-bold text-emerald-600">{selectedReport.data.autoDocketRate}%</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-xs text-slate-500 mb-1">Avg Processing</div>
                          <div className="text-2xl font-bold text-blue-600">{selectedReport.data.avgProcessingTime}</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-xs text-slate-500 mb-1">Awaiting Assignment</div>
                          <div className="text-2xl font-bold text-purple-600">{selectedReport.data.awaitingAssignment}</div>
                        </Card>
                      </>
                    )}
                    {selectedReport.type === 'hearings' && (
                      <>
                        <Card className="p-4">
                          <div className="text-xs text-slate-500 mb-1">Hearings This Month</div>
                          <div className="text-2xl font-bold text-slate-900">{selectedReport.data.hearingsThisMonth}</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-xs text-slate-500 mb-1">Notices Issued</div>
                          <div className="text-2xl font-bold text-emerald-600">{selectedReport.data.noticesIssued}</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-xs text-slate-500 mb-1">Avg Scheduling</div>
                          <div className="text-2xl font-bold text-blue-600">{selectedReport.data.avgSchedulingTime}</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-xs text-slate-500 mb-1">Pro Se Notices</div>
                          <div className="text-2xl font-bold text-purple-600">{selectedReport.data.proSeNotices}</div>
                        </Card>
                      </>
                    )}
                    {selectedReport.type === 'caseload' && (
                      <>
                        <Card className="p-4">
                          <div className="text-xs text-slate-500 mb-1">Active Cases</div>
                          <div className="text-2xl font-bold text-slate-900">{selectedReport.data.activeCases}</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-xs text-slate-500 mb-1">Decisions Due</div>
                          <div className="text-2xl font-bold text-amber-600">{selectedReport.data.decisionsDue}</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-xs text-slate-500 mb-1">270-Day Compliance</div>
                          <div className="text-2xl font-bold text-emerald-600">{selectedReport.data.compliance270}%</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-xs text-slate-500 mb-1">Avg Decision Time</div>
                          <div className="text-2xl font-bold text-blue-600">{selectedReport.data.avgDecisionTime}</div>
                        </Card>
                      </>
                    )}
                  </div>

                  {/* Charts */}
                  {selectedReport.type === 'docketing' && selectedReport.data.byChannel && (
                    <Card>
                      <div className="p-4 border-b border-slate-200">
                        <h4 className="font-bold text-slate-900">Filings by Channel</h4>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          {Object.entries(selectedReport.data.byChannel).map(([channel, count]: [string, any]) => (
                            <div key={channel} className="flex items-center justify-between">
                              <span className="text-sm text-slate-600">{channel}</span>
                              <div className="flex items-center gap-3">
                                <div className="w-48 h-3 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500" style={{ width: `${(count / selectedReport.data.totalFilings) * 100}%` }} />
                                </div>
                                <span className="text-sm font-bold w-12 text-right">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="font-bold">Report Data Not Generated</p>
                  <p className="text-sm mt-2">Click "Generate Report" to create charts and graphs</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => handleSaveReport(selectedReport)} leftIcon={<CheckCircle className="w-4 h-4" />}>Save Report</Button>
              <Button variant="outline" onClick={() => handleExportReport(selectedReport)} leftIcon={<Download className="w-4 h-4" />}>Export PDF</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
