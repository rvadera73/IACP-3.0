import React, { useState } from 'react';
import { Card, Button } from '../UI';
import { Bold, Italic, BookOpen, FileText, Save, GitCompareArrows, Check, X } from 'lucide-react';

interface DraftDecisionEditorProps {
  onCaseSelect?: (caseNumber: string) => void;
  mode?: 'draft' | 'redline';
}

const caseOptions = [
  { value: '2026-BLA-00130', label: '2026-BLA-00130 — Johnson v. ABC Mining Co.' },
  { value: '2026-LHC-00125', label: '2026-LHC-00125 — Adams v. Gulf Shipping Corp.' },
  { value: '2026-BLA-00138', label: '2026-BLA-00138 — Miller v. Eastern Coal Inc.' },
];

const templates = ['BLA Decision & Order', 'LHC Decision & Order', 'Blank Decision'];

export default function DraftDecisionEditor({ onCaseSelect, mode = 'draft' }: DraftDecisionEditorProps) {
  const [selectedCase, setSelectedCase] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showRedline, setShowRedline] = useState(mode === 'redline');

  return (
    <div className="space-y-6">
      {/* Redline Banner */}
      {showRedline && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex justify-between items-center">
          <span className="text-sm text-amber-800 font-medium">Showing changes from v2 → v3</span>
          <div className="flex gap-2">
            <Button variant="success" size="sm" leftIcon={<Check className="w-3.5 h-3.5" />}>Accept All</Button>
            <Button variant="danger" size="sm" leftIcon={<X className="w-3.5 h-3.5" />}>Reject All</Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Draft Decision & Order</h2>
          <p className="text-sm text-slate-500">Prepare decision document for judge signature</p>
        </div>
        <div className="flex gap-1">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded" title="Bold"><Bold className="w-4 h-4" /></button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded" title="Italic"><Italic className="w-4 h-4" /></button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded" title="Insert Citation"><BookOpen className="w-4 h-4" /></button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded" title="Insert Template Section"><FileText className="w-4 h-4" /></button>
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Save Draft"><Save className="w-4 h-4" /></button>
          <button
            className={`p-2 rounded ${showRedline ? 'text-amber-600 bg-amber-50' : 'text-slate-500 hover:bg-slate-100'}`}
            title="Toggle Redline"
            onClick={() => setShowRedline(!showRedline)}
          >
            <GitCompareArrows className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <select
            value={selectedCase}
            onChange={(e) => { setSelectedCase(e.target.value); onCaseSelect?.(e.target.value); }}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-80"
          >
            <option value="">Select a case...</option>
            {caseOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-60"
          >
            <option value="">Select template...</option>
            {templates.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Caption</label>
            <textarea
              className="w-full h-16 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder={"UNITED STATES DEPARTMENT OF LABOR\nOffice of Administrative Law Judges"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Procedural History</label>
            <textarea className="w-full h-24 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Describe the procedural posture of the case..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Statement of the Case</label>
            <textarea className="w-full h-32 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Factual background and evidence summary..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Findings of Fact</label>
            <textarea className="w-full h-32 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Findings based on the evidence of record..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Conclusions of Law</label>
            <textarea className="w-full h-32 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Legal conclusions applying law to findings..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
            <textarea className="w-full h-24 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="IT IS HEREBY ORDERED that..." />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
          <Button variant="outline" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>Save Draft</Button>
          {mode === 'draft' && (
            <Button variant="primary" size="sm">Submit to Judge</Button>
          )}
          {mode === 'redline' && (
            <Button variant="success" size="sm" disabled>Sign & Release</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
