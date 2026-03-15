import React, { useState } from 'react';
import { Card, Button } from '../UI';
import { Bold, Italic, BookOpen, Save, Brain, ChevronRight } from 'lucide-react';

interface BenchMemoEditorProps {
  onCaseSelect?: (caseNumber: string) => void;
}

const caseOptions = [
  { value: '2026-BLA-00130', label: '2026-BLA-00130 — Johnson v. ABC Mining Co.' },
  { value: '2026-LHC-00125', label: '2026-LHC-00125 — Adams v. Gulf Shipping Corp.' },
  { value: '2026-BLA-00138', label: '2026-BLA-00138 — Miller v. Eastern Coal Inc.' },
];

const versions = [
  { id: 'v3', label: 'v3', date: undefined, isCurrent: true },
  { id: 'v2', label: 'v2', date: 'Mar 12, 2026', isCurrent: false },
  { id: 'v1', label: 'v1', date: 'Mar 8, 2026', isCurrent: false },
];

export default function BenchMemoEditor({ onCaseSelect }: BenchMemoEditorProps) {
  const [selectedCase, setSelectedCase] = useState('');
  const [content, setContent] = useState({
    caseSummary: '',
    issues: '',
    law: '',
    analysis: '',
    disposition: '',
  });

  const wordCount = Object.values(content).join(' ').trim().split(/\s+/).filter(Boolean).length;

  const handleCaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCase(e.target.value);
    onCaseSelect?.(e.target.value);
  };

  const updateField = (field: keyof typeof content, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Bench Memorandum</h2>
          <p className="text-sm text-slate-500">Draft bench memo for judge review</p>
        </div>
        <div className="flex gap-1">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded" title="Bold"><Bold className="w-4 h-4" /></button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded" title="Italic"><Italic className="w-4 h-4" /></button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded" title="Insert Citation"><BookOpen className="w-4 h-4" /></button>
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Save Draft"><Save className="w-4 h-4" /></button>
          <button className="p-2 text-purple-600 hover:bg-purple-50 rounded" title="AI Assist"><Brain className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Editor */}
        <div className="flex-grow space-y-5">
          <Card className="p-6">
            <div className="mb-6">
              <select
                value={selectedCase}
                onChange={handleCaseChange}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-96"
              >
                <option value="">Select a case...</option>
                {caseOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Case Summary</label>
                <textarea
                  value={content.caseSummary}
                  onChange={(e) => updateField('caseSummary', e.target.value)}
                  className="w-full h-24 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Brief summary of case background and parties..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issues for Decision</label>
                <textarea
                  value={content.issues}
                  onChange={(e) => updateField('issues', e.target.value)}
                  className="w-full h-20 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="List the key legal issues to be decided..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Applicable Law & Regulations</label>
                <textarea
                  value={content.law}
                  onChange={(e) => updateField('law', e.target.value)}
                  className="w-full h-20 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Relevant statutes, regulations, and precedent..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Analysis of Evidence</label>
                <textarea
                  value={content.analysis}
                  onChange={(e) => updateField('analysis', e.target.value)}
                  className="w-full h-32 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Detailed legal analysis applying law to facts..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Recommended Disposition</label>
                <textarea
                  value={content.disposition}
                  onChange={(e) => updateField('disposition', e.target.value)}
                  className="w-full h-20 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Recommended ruling and rationale..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
              <Button variant="outline" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>Save Draft</Button>
              <Button variant="primary" size="sm" leftIcon={<ChevronRight className="w-3.5 h-3.5" />}>Submit for Judge Review</Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-64 space-y-6 flex-shrink-0">
          <Card className="p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Version History</h3>
            <div className="space-y-2">
              {versions.map(v => (
                <div key={v.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${v.isCurrent ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <span className="text-sm text-slate-700">{v.label}</span>
                    {v.date && <span className="text-xs text-slate-400">({v.date})</span>}
                    {v.isCurrent && <span className="text-xs text-green-600">(Current)</span>}
                  </div>
                  {!v.isCurrent && (
                    <button className="text-xs text-blue-600 hover:text-blue-800">Restore</button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Auto-save</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Auto-saved 2 min ago
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Word Count</h3>
            <div className="text-2xl font-bold text-slate-900">{wordCount}</div>
            <div className="text-xs text-slate-400">words</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
