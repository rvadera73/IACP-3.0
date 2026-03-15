import { Card, Badge, Button } from '../UI';
import {
  Clock,
  X,
  Search,
  Brain,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface CaseHeaderProps {
  caseData: any;
  onClose: () => void;
  userRole: string;
}

const CaseHeader = ({ caseData, onClose, userRole }: CaseHeaderProps) => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiInput, setAiInput] = useState('');

  const isAppellate = caseData.perspective === 'appellate';

  const deadlineColor = caseData.daysToDecision < 30 ? 'text-red-600 bg-red-50' :
                        caseData.daysToDecision < 60 ? 'text-amber-600 bg-amber-50' :
                        'text-emerald-600 bg-emerald-50';

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AI Input:', aiInput);
    setAiInput('');
  };

  return (
    <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="info" size="sm">{caseData.programArea}</Badge>
              <Badge variant={caseData.proceduralState === 'Active' ? 'success' : 'warning'} size="sm">
                {caseData.proceduralState}
              </Badge>
              {isAppellate && (
                <Badge variant="neutral" size="sm">Appeal</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-mono">{caseData.docketNumber}</h1>
            <p className="text-sm text-slate-600 mt-1">
              {isAppellate
                ? `${caseData.petitioner || 'Petitioner'} v. ${caseData.respondent || 'Respondent'}`
                : `${caseData.claimant} v. ${caseData.employer}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Export Record
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>

        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg ${deadlineColor}`}>
          <Clock className="w-5 h-5" />
          <div className="text-sm">
            <span className="font-bold">{caseData.daysToDecision} days</span>
            <span className="ml-2">to statutory deadline</span>
            <span className="ml-2 text-slate-500">(Due: {caseData.deadlineDate})</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents, filings, motions..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Brain className="w-4 h-4 text-purple-600" />}
          onClick={() => setShowAIAssistant(!showAIAssistant)}
        >
          Ask AI
        </Button>
      </div>

      <AnimatePresence>
        {showAIAssistant && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-4 overflow-hidden"
          >
            <Card className="border-purple-200 bg-purple-50">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-slate-900">AI Case Assistant</h3>
                </div>
                <form onSubmit={handleAISubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask about this case..."
                    className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button variant="outline" size="sm">Ask</Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CaseHeader;
