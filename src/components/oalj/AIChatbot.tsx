import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, BarChart3, Download, Sparkles } from 'lucide-react';
import { Button, Card, Badge } from '../UI';

interface AIChatbotProps {
  caseId?: string;
  caseData?: any;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function AIChatbot({ caseId, caseData }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your IACP AI Assistant. I can help you with case information, workload reports, and scheduling. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Status of this case",
        "Show me all BLA cases past 270 days",
        "Which judges have hearings this week?",
        "Generate workload report",
      ],
    },
  ]);

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setQuery('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(query, caseData);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (query: string, data?: any) => {
    const lowerQuery = query.toLowerCase();

    // Case status query
    if (lowerQuery.includes('status') && caseData) {
      return {
        content: `📊 **Case ${caseData.docketNumber} - Status Summary**

**Timeline Progress:** ${Math.round((caseData.daysElapsed / caseData.totalDays) * 100)}% Complete

✓ Intake & Docketing (Completed ${caseData.filedAt})
✓ Assignment to ${caseData.judge || 'Pending'}
${caseData.hearingDate ? `✓ Hearing (${caseData.hearingDate})` : '○ Hearing (Not scheduled)'}
○ Decision (Due by ${caseData.decisionDue} - ${caseData.daysRemaining} days remaining)

${caseData.daysRemaining < 30 ? '⚠️ **Warning:** Less than 30 days to statutory deadline!' : '✅ No action items require your attention.'}`,
        suggestions: ['Show me all filings', 'When is the hearing?', 'Who represents the claimant?'],
      };
    }

    // District-level queries
    if (lowerQuery.includes('bla cases') && lowerQuery.includes('270')) {
      return {
        content: `📊 **BLA Cases Past 270-Day Goal**

Found **3 cases** exceeding the 270-day statutory timeline:

| Case Number | Judge | Days Overdue |
|-------------|-------|--------------|
| 2024-BLA-00038 | Hon. P. Chen | 45 days |
| 2024-BLA-00042 | Hon. S. Jenkins | 32 days |
| 2024-BLA-00029 | Hon. M. Ross | 18 days |

**Recommendation:** Consider prioritizing these cases for decision drafting.`,
        suggestions: ['Generate PDF report', 'Email judges', 'Show me details'],
      };
    }

    if (lowerQuery.includes('judges') && lowerQuery.includes('hearings')) {
      return {
        content: `📅 **Judges with Hearings This Week**

**March 11-17, 2026**

**Hon. Sarah Jenkins** (Pittsburgh)
- Mar 12, 10:00 AM: 2024-BLA-00042 (Hearing)
- Mar 14, 2:00 PM: 2025-LHC-00089 (Pre-Hearing)

**Hon. Michael Ross** (New York)
- Mar 13, 11:00 AM: 2025-PER-00015 (Hearing)
- Mar 15, 9:00 AM: 2025-WB-00034 (Conference)

**Hon. Patricia Chen** (San Francisco)
- Mar 16, 1:00 PM: 2024-BLA-00038 (Hearing)

Total: **5 hearings** scheduled this week.`,
        suggestions: ['Show me next week', 'Export calendar', 'Email reminders'],
      };
    }

    if (lowerQuery.includes('workload report')) {
      return {
        content: `📊 **Office Workload Report**

**Pittsburgh District Office**
Generated: ${new Date().toLocaleDateString()}

**Summary Statistics:**
- Total Active Cases: 86
- Average Judge Utilization: 69%
- Cases Awaiting Assignment: 12
- 270-Day Compliance Rate: 96%

**Judge Workload:**
- Hon. S. Jenkins: 24 cases (77% capacity) ✅
- Hon. M. Ross: 18 cases (56% capacity) ✅
- Hon. P. Chen: 32 cases (104% capacity) ⚠️
- Hon. J. Wilson: 12 cases (37% capacity) ✅

**Recommendations:**
1. Consider reassigning 2-3 cases from Hon. P. Chen
2. Hon. J. Wilson has capacity for additional assignments`,
        suggestions: ['Download PDF', 'Email to Chief Judge', 'Show trends'],
      };
    }

    // Default response
    return {
      content: `I can help you with:

**Case Information:**
- "Status of case 2024-BLA-00042"
- "When is the hearing?"
- "Show me all exhibits"

**Workload Management:**
- "Show me all BLA cases past 270 days"
- "Which judges have hearings this week?"
- "Generate workload report for Pittsburgh"

**Scheduling:**
- "Schedule hearing for this case"
- "Find available courtroom dates"
- "Send deficiency notice"

What would you like to do?`,
      suggestions: ['Status of this case', 'Show BLA cases past 270 days', 'Generate workload report'],
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <>
      {/* Chatbot Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chatbot Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">IACP AI Assistant</h3>
                  <p className="text-xs text-slate-500">Natural Language Queries</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-line">{message.content}</div>
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`block w-full text-left text-xs p-2 rounded ${
                              message.role === 'user'
                                ? 'bg-blue-700 hover:bg-blue-800'
                                : 'bg-slate-100 hover:bg-slate-200'
                            }`}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className={`text-[10px] mt-2 ${
                      message.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                  placeholder="Ask about cases, workload, scheduling..."
                  className="flex-grow px-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Button
                  onClick={handleSendQuery}
                  disabled={!query.trim() || isLoading}
                  size="sm"
                  className="p-2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                <BarChart3 className="w-3 h-3" />
                <span>Try: "Show me all BLA cases past 270 days"</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
