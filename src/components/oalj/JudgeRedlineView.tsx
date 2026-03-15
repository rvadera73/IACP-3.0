/**
 * Judge Redline & Comparison View Interface
 * 
 * Specialized interface for Judges to review and edit attorney drafts:
 * - Side-by-side version comparison
 * - Inline redline editing with tracked changes
 * - Accept/Reject individual changes
 * - Disposition notes input
 * - E-signature integration
 * 
 * Features:
 * - Diff visualization (added/removed text)
 * - Bulk accept/reject all changes
 * - Comment/annotation system
 * - Decision disposition form
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle, XCircle, AlertCircle, Eye, Edit3, MessageSquare,
  Signature, Save, Send, Download, FileText, Plus,
  Trash2, Bookmark, Copy, ThumbsUp, ThumbsDown, HelpCircle, Layers
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import { useAuth } from '../../context/AuthContext';
import {
  compareVersions,
  type DocumentState,
  type DocumentVersion,
} from '../../services/documentVersionControl';

interface JudgeRedlineViewProps {
  document: DocumentState;
  caseNumber: string;
  caseType: string;
  userRole: string;
  onAcceptChanges: (changes: string[]) => void;
  onRejectChanges: (changes: string[]) => void;
  onAddDispositionNotes: (notes: string) => void;
  onSignAndRelease: (signature: string) => void;
}

interface Change {
  id: string;
  type: 'added' | 'removed';
  text: string;
  lineNumber: number;
  accepted: boolean;
}

interface DispositionOption {
  value: string;
  label: string;
  description: string;
}

const DISPOSITION_OPTIONS: DispositionOption[] = [
  {
    value: 'award',
    label: 'Award Benefits',
    description: 'Claimant is entitled to benefits',
  },
  {
    value: 'deny',
    label: 'Deny Benefits',
    description: 'Claimant has not met burden of proof',
  },
  {
    value: 'remand',
    label: 'Remand for Further Development',
    description: 'Additional fact-finding required',
  },
  {
    value: 'modify',
    label: 'Modify Decision',
    description: 'Change specific findings or conclusions',
  },
];

export default function JudgeRedlineView({
  document,
  caseNumber,
  caseType,
  userRole,
  onAcceptChanges,
  onRejectChanges,
  onAddDispositionNotes,
  onSignAndRelease,
}: JudgeRedlineViewProps) {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'redline' | 'side-by-side' | 'clean'>('redline');
  const [compareVersion1, setCompareVersion1] = useState(1);
  const [compareVersion2, setCompareVersion2] = useState(2);
  const [changes, setChanges] = useState<Change[]>([]);
  const [selectedChange, setSelectedChange] = useState<string | null>(null);
  const [dispositionNotes, setDispositionNotes] = useState('');
  const [selectedDisposition, setSelectedDisposition] = useState('');
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureText, setSignatureText] = useState('');

  // Calculate changes between versions
  useEffect(() => {
    if (document.versions.length >= 2) {
      const v1 = document.versions.find(v => v.versionNumber === compareVersion1);
      const v2 = document.versions.find(v => v.versionNumber === compareVersion2);
      
      if (v1 && v2) {
        const diff = compareVersions(document, compareVersion1, compareVersion2);
        
        const newChanges: Change[] = [
          ...diff.added.map((text, idx) => ({
            id: `added-${idx}`,
            type: 'added' as const,
            text,
            lineNumber: idx,
            accepted: false,
          })),
          ...diff.removed.map((text, idx) => ({
            id: `removed-${idx}`,
            type: 'removed' as const,
            text,
            lineNumber: idx,
            accepted: false,
          })),
        ];
        
        setChanges(newChanges);
      }
    }
  }, [document, compareVersion1, compareVersion2]);

  // Accept individual change
  const handleAcceptChange = (changeId: string) => {
    const change = changes.find(c => c.id === changeId);
    if (change) {
      onAcceptChanges([change.text]);
      setChanges(changes.filter(c => c.id !== changeId));
    }
  };

  // Reject individual change
  const handleRejectChange = (changeId: string) => {
    const change = changes.find(c => c.id === changeId);
    if (change) {
      onRejectChanges([change.text]);
      setChanges(changes.filter(c => c.id !== changeId));
    }
  };

  // Accept all changes
  const handleAcceptAll = () => {
    onAcceptChanges(changes.map(c => c.text));
    setChanges([]);
  };

  // Reject all changes
  const handleRejectAll = () => {
    onRejectChanges(changes.map(c => c.text));
    setChanges([]);
  };

  // Submit disposition notes
  const handleSubmitDisposition = () => {
    if (dispositionNotes.trim()) {
      onAddDispositionNotes(dispositionNotes);
      alert('Disposition notes saved and sent to Attorney-Advisor');
    }
  };

  // Sign and release
  const handleSignAndRelease = () => {
    if (signatureText.trim()) {
      onSignAndRelease(signatureText);
      setShowSignatureModal(false);
      alert('Decision signed and released. Official PDF generated.');
    }
  };

  const currentVersion = document.versions[document.versions.length - 1];
  const isLocked = document.isLocked;
  const changeCount = {
    added: changes.filter(c => c.type === 'added').length,
    removed: changes.filter(c => c.type === 'removed').length,
    total: changes.length,
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900">Judge Review Interface</h2>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>{caseNumber}</span>
                <span>•</span>
                <span>Version {currentVersion.versionNumber}</span>
                <span>•</span>
                <span>{changeCount.total} changes pending review</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
                <Button
                  variant={viewMode === 'redline' ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('redline')}
                  className="text-xs"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Redline
                </Button>
                <Button
                  variant={viewMode === 'side-by-side' ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('side-by-side')}
                  className="text-xs"
                >
                  <Layers className="w-3 h-3 mr-1" />
                  Compare
                </Button>
                <Button
                  variant={viewMode === 'clean' ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('clean')}
                  className="text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Clean
                </Button>
              </div>

              <Button
                onClick={() => setShowSignatureModal(true)}
                leftIcon={<Signature className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Sign & Release
              </Button>
            </div>
          </div>

          {/* Change Summary */}
          {changeCount.total > 0 && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-slate-600">Added: {changeCount.added}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-slate-600">Removed: {changeCount.removed}</span>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAcceptAll}
                  leftIcon={<CheckCircle className="w-3 h-3 text-emerald-600" />}
                  className="text-xs"
                >
                  Accept All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                  leftIcon={<XCircle className="w-3 h-3 text-red-600" />}
                  className="text-xs"
                >
                  Reject All
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Redline View */}
      {viewMode === 'redline' && (
        <Card>
          <div className="p-6">
            <h3 className="font-bold text-slate-900 mb-4">Tracked Changes</h3>
            <div className="space-y-2">
              {changes.length > 0 ? (
                changes.map((change) => (
                  <Card
                    key={change.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedChange === change.id
                        ? 'border-blue-500 bg-blue-50'
                        : change.type === 'added'
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                    onClick={() => setSelectedChange(change.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={change.type === 'added' ? 'success' : 'error'}
                            size="sm"
                          >
                            {change.type === 'added' ? 'ADDED' : 'REMOVED'}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            Line {change.lineNumber + 1}
                          </span>
                        </div>
                        <div
                          className={`text-sm font-mono ${
                            change.type === 'added'
                              ? 'text-emerald-800 line-through'
                              : 'text-red-800 line-through'
                          }`}
                        >
                          {change.text}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptChange(change.id);
                          }}
                          leftIcon={<CheckCircle className="w-3 h-3 text-emerald-600" />}
                          className="text-xs"
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRejectChange(change.id);
                          }}
                          leftIcon={<XCircle className="w-3 h-3 text-red-600" />}
                          className="text-xs"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
                  <p className="font-bold">No changes pending review</p>
                  <p className="text-sm mt-2">Document is clean and ready for release</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Side-by-Side Comparison */}
      {viewMode === 'side-by-side' && (
        <Card>
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-700">Compare:</span>
                <select
                  value={compareVersion1}
                  onChange={(e) => setCompareVersion1(Number(e.target.value))}
                  className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
                >
                  {document.versions.map((v) => (
                    <option key={v.versionNumber} value={v.versionNumber}>
                      Version {v.versionNumber} ({v.author})
                    </option>
                  ))}
                </select>
                <span className="text-slate-400">vs</span>
                <select
                  value={compareVersion2}
                  onChange={(e) => setCompareVersion2(Number(e.target.value))}
                  className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
                >
                  {document.versions.map((v) => (
                    <option key={v.versionNumber} value={v.versionNumber}>
                      Version {v.versionNumber} ({v.author})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 p-6">
            <div className="border-r border-slate-200 pr-4">
              <h4 className="font-bold text-slate-900 mb-2">Version {compareVersion1}</h4>
              <pre className="text-sm font-mono whitespace-pre-wrap bg-slate-50 p-4 rounded">
                {document.versions.find((v) => v.versionNumber === compareVersion1)?.content || ''}
              </pre>
            </div>
            <div className="pl-4">
              <h4 className="font-bold text-slate-900 mb-2">Version {compareVersion2}</h4>
              <pre className="text-sm font-mono whitespace-pre-wrap bg-slate-50 p-4 rounded">
                {document.versions.find((v) => v.versionNumber === compareVersion2)?.content || ''}
              </pre>
            </div>
          </div>
        </Card>
      )}

      {/* Clean View */}
      {viewMode === 'clean' && (
        <Card>
          <div className="p-6">
            <h3 className="font-bold text-slate-900 mb-4">Clean Version (Current)</h3>
            <pre className="text-sm font-mono whitespace-pre-wrap bg-slate-50 p-6 rounded">
              {currentVersion.content}
            </pre>
          </div>
        </Card>
      )}

      {/* Disposition Notes */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Disposition Notes to Attorney-Advisor</h3>
          </div>

          <div className="space-y-4">
            {/* Disposition Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Disposition
              </label>
              <div className="grid grid-cols-2 gap-3">
                {DISPOSITION_OPTIONS.map((option) => (
                  <Card
                    key={option.value}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedDisposition === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedDisposition(option.value)}
                  >
                    <div className="font-bold text-slate-900">{option.label}</div>
                    <div className="text-xs text-slate-600 mt-1">{option.description}</div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Notes Text Area */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Instructions for Drafting
              </label>
              <textarea
                value={dispositionNotes}
                onChange={(e) => setDispositionNotes(e.target.value)}
                placeholder="Provide specific instructions for the Attorney-Advisor (e.g., 'Award benefits - pneumoconiosis established by PFTs and Dr. Smith opinion. Cite Greenwich Collieries for burden of proof.')"
                className="w-full h-32 px-4 py-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              onClick={handleSubmitDisposition}
              disabled={!dispositionNotes.trim() || !selectedDisposition}
              leftIcon={<Send className="w-4 h-4" />}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Send Instructions to Attorney-Advisor
            </Button>
          </div>
        </div>
      </Card>

      {/* Signature Modal */}
      <AnimatePresence>
        {showSignatureModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowSignatureModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Signature className="w-6 h-6 text-emerald-600" />
                  Sign and Release Decision
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Type Your Full Name to Sign
                  </label>
                  <input
                    type="text"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="Hon. [Your Full Name]"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div className="text-sm text-amber-700">
                      <strong>Warning:</strong> This action will:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Lock the document from further edits</li>
                        <li>Generate official PDF with seal</li>
                        <li>Release to docket for service</li>
                        <li>Start appeal clock</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSignatureModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSignAndRelease}
                  disabled={!signatureText.trim()}
                  leftIcon={<Signature className="w-4 h-4" />}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Confirm and Release
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
