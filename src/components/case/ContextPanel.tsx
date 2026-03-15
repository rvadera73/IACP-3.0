import { Card, Button } from '../UI';
import { Brain, ChevronLeft, ChevronRight, AlertTriangle, AlertCircle, CheckCircle, Info, Zap } from 'lucide-react';

interface ContextPanelProps {
  caseData: {
    aiSummary: string;
    aiInsights: { type: 'info' | 'warning' | 'error' | 'success'; title: string; description: string; action?: string }[];
  };
  userRole: string;
  collapsed: boolean;
  onToggle: () => void;
}

const getSuggestedActions = (role: string): string[] => {
  if (role.includes('Judge') || role.includes('ALJ')) {
    return ['Review Draft Decision', 'Schedule Hearing', 'Sign & Release'];
  }
  if (role.includes('Attorney')) {
    return ['Start Bench Memo', 'Run Citation Check', 'Draft Decision'];
  }
  if (role.includes('Docket')) {
    return ['Process Filing', 'Assign Judge', 'Issue Deficiency Notice'];
  }
  if (role.includes('Legal Assistant')) {
    return ['Schedule Hearing', 'Generate Notice', 'Track Transcript'];
  }
  return ['View Case Record'];
};

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
    case 'error': return <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
    case 'success': return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
    default: return <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  }
};

const getInsightBorder = (type: string) => {
  switch (type) {
    case 'warning': return 'border-l-4 border-l-amber-500';
    case 'error': return 'border-l-4 border-l-red-500';
    case 'success': return 'border-l-4 border-l-green-500';
    default: return 'border-l-4 border-l-blue-500';
  }
};

export default function ContextPanel({ caseData, userRole, collapsed, onToggle }: ContextPanelProps) {
  const suggestedActions = getSuggestedActions(userRole);

  return (
    <div className={`relative border-l border-slate-200 bg-white transition-all duration-300 ${collapsed ? 'w-0 overflow-hidden' : 'w-72'}`}>
      <button
        onClick={onToggle}
        className="absolute top-4 -left-3 z-10 bg-white border border-slate-300 rounded-full p-1 shadow-sm hover:bg-slate-50 transition-colors"
        aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
      >
        {collapsed ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>

      <div className="p-4 space-y-6 overflow-y-auto h-full">
        {/* AI Summary */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-800">AI Case Summary</h3>
          </div>
          <Card className="bg-purple-50 border-purple-200">
            <div className="p-3">
              <p className="text-sm text-slate-700 leading-relaxed">{caseData.aiSummary}</p>
            </div>
          </Card>
        </div>

        {/* AI Insights */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3">AI Insights</h3>
          <div className="space-y-2">
            {caseData.aiInsights.map((insight, index) => (
              <div
                key={index}
                className={`${getInsightBorder(insight.type)} p-3 bg-white rounded-r-lg`}
              >
                <div className="flex items-start gap-2">
                  {getInsightIcon(insight.type)}
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-slate-800">{insight.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{insight.description}</p>
                    {insight.action && (
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1">
                        {insight.action} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Actions */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3">Suggested Actions</h3>
          <div className="space-y-2">
            {suggestedActions.map((action, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
