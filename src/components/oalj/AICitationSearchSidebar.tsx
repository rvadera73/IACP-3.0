/**
 * AI Citation Search Sidebar
 * 
 * Real-time legal research assistant that:
 * - Monitors text as AA types
 * - Detects legal citations (CFR, USC, Case Law)
 * - Surfaces relevant regulations and precedents
 * - Integrates with OALJ/Boards case law database
 * 
 * Features:
 * - Auto-detection of citations (20 C.F.R. § 718.202, 33 U.S.C. § 901, etc.)
 * - AI-powered research suggestions
 * - One-click insertion of citations
 * - Case-specific precedent matching
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, BookOpen, Scale, AlertCircle, CheckCircle,
  ExternalLink, Copy, Bookmark, Plus, X, Loader,
  MessageSquare, Quote, FileText, TrendingUp, Star
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';

interface CitationMatch {
  id: string;
  type: 'regulation' | 'statute' | 'case' | 'ruling';
  citation: string;
  title: string;
  summary: string;
  relevanceScore: number;
  source: string;
  date?: string;
  fullText?: string;
}

interface AICitationSearchSidebarProps {
  editorContent: string;
  caseType: 'BLA' | 'LHC' | 'PER' | 'BRB' | 'ARB' | 'ECAB';
  caseStatus: string;
  onInsertCitation: (citation: string) => void;
  onBookmarkCitation: (citation: CitationMatch) => void;
}

// Mock legal database (in production, this would query OALJ/Boards databases)
const LEGAL_DATABASE: Record<string, CitationMatch[]> = {
  'BLA': [
    {
      id: '1',
      type: 'regulation',
      citation: '20 C.F.R. § 718.202',
      title: 'Nature of Pneumoconiosis',
      summary: 'Defines clinical and legal pneumoconiosis for Black Lung claims. Requires evidence of dust-related lung disease.',
      relevanceScore: 98,
      source: 'Code of Federal Regulations',
      date: '2024-01-01',
      fullText: '§ 718.202 Nature of pneumoconiosis. (a) In general. A finding of pneumoconiosis requires medical evidence...'
    },
    {
      id: '2',
      type: 'regulation',
      citation: '20 C.F.R. § 718.204',
      title: 'Total Disability',
      summary: 'Establishes criteria for total disability in Black Lung claims. Includes pulmonary function tests and arterial blood gas studies.',
      relevanceScore: 95,
      source: 'Code of Federal Regulations',
      date: '2024-01-01',
    },
    {
      id: '3',
      type: 'case',
      citation: 'Director, OWCP v. Greenwich Collieries, 512 U.S. 267 (1994)',
      title: 'Greenwich Collieries - Burden of Proof',
      summary: 'Supreme Court holding on burden of proof in Black Lung cases. Establishes true doubt rule application.',
      relevanceScore: 92,
      source: 'U.S. Supreme Court',
      date: '1994-06-24',
    },
    {
      id: '4',
      type: 'case',
      citation: 'Consolidation Coal Co. v. Director, OWCP, 50 F.3d 238 (4th Cir. 1995)',
      title: 'Consolidation Coal - Medical Evidence',
      summary: 'Fourth Circuit decision on weighing conflicting medical evidence in pneumoconiosis claims.',
      relevanceScore: 88,
      source: 'Fourth Circuit Court of Appeals',
      date: '1995-03-15',
    },
  ],
  'LHC': [
    {
      id: '5',
      type: 'statute',
      citation: '33 U.S.C. § 901 et seq.',
      title: 'Longshore and Harbor Workers\' Compensation Act',
      summary: 'Federal statute providing workers\' compensation for maritime workers. Covers injury, disability, and death benefits.',
      relevanceScore: 98,
      source: 'United States Code',
      date: '2024-01-01',
    },
    {
      id: '6',
      type: 'regulation',
      citation: '20 C.F.R. § 702.301',
      title: 'Controversion of Right to Compensation',
      summary: 'Requirements for employer to controvert a Longshore claim. Must file within 14 days of knowledge.',
      relevanceScore: 94,
      source: 'Code of Federal Regulations',
      date: '2024-01-01',
    },
    {
      id: '7',
      type: 'case',
      citation: 'Norfolk Shipbuilding & Dry Dock Corp. v. Garris, 532 U.S. 811 (2001)',
      title: 'Garris - Negligence Action',
      summary: 'Supreme Court recognizing negligence action for unseaworthiness under general maritime law.',
      relevanceScore: 90,
      source: 'U.S. Supreme Court',
      date: '2001-05-14',
    },
  ],
  'PER': [
    {
      id: '8',
      type: 'statute',
      citation: '5 U.S.C. § 2302',
      title: 'Prohibited Personnel Practices',
      summary: 'Defines prohibited personnel practices for federal employees. Basis for whistleblower protections.',
      relevanceScore: 96,
      source: 'United States Code',
      date: '2024-01-01',
    },
    {
      id: '9',
      type: 'regulation',
      citation: '5 C.F.R. § 1209.1',
      title: 'Whistleblower Protection Act Procedures',
      summary: 'Procedures for filing whistleblower retaliation claims with OSC and MSPB.',
      relevanceScore: 93,
      source: 'Code of Federal Regulations',
      date: '2024-01-01',
    },
  ],
  'BRB': [
    {
      id: '10',
      type: 'regulation',
      citation: '20 C.F.R. § 802.100',
      title: 'Scope of Review',
      summary: 'Defines BRB scope of review for Longshore and Black Lung appeals. Limited to errors of law and substantial evidence.',
      relevanceScore: 97,
      source: 'Code of Federal Regulations',
      date: '2024-01-01',
    },
    {
      id: '11',
      type: 'case',
      citation: 'Potomac Elec. Power Co. v. Director, OWCP, 449 U.S. 268 (1980)',
      title: 'PEPCO - Standard of Review',
      summary: 'Supreme Court establishing standard of review for BRB decisions. Deference to ALJ factual findings.',
      relevanceScore: 94,
      source: 'U.S. Supreme Court',
      date: '1980-12-09',
    },
  ],
  'ARB': [
    {
      id: '12',
      type: 'statute',
      citation: '18 U.S.C. § 1514A',
      title: 'Sarbanes-Oxley Whistleblower Protection',
      summary: 'Federal whistleblower protection for employees of publicly traded companies. Prohibits retaliation.',
      relevanceScore: 98,
      source: 'United States Code',
      date: '2024-01-01',
    },
    {
      id: '13',
      type: 'case',
      citation: 'Sylvester v. Parexel Int\'l LLC, ARB No. 07-097 (2011)',
      title: 'Sylvester - Contributing Factor Standard',
      summary: 'ARB decision establishing contributing factor standard for SOX whistleblower claims.',
      relevanceScore: 95,
      source: 'Administrative Review Board',
      date: '2011-09-28',
    },
  ],
  'ECAB': [
    {
      id: '14',
      type: 'statute',
      citation: '5 U.S.C. § 8101 et seq.',
      title: 'Federal Employees\' Compensation Act',
      summary: 'Provides workers\' compensation for federal employees. Covers injury, disability, and death benefits.',
      relevanceScore: 98,
      source: 'United States Code',
      date: '2024-01-01',
    },
    {
      id: '15',
      type: 'regulation',
      citation: '20 C.F.R. § 10.115',
      title: 'Occupational Disease Claims',
      summary: 'Requirements for establishing occupational disease under FECA. Must show causal relationship.',
      relevanceScore: 94,
      source: 'Code of Federal Regulations',
      date: '2024-01-01',
    },
  ],
};

// Citation detection patterns
const CITATION_PATTERNS = {
  cfr: /\b(\d+)\s+C\.?F\.?R\.?\s+§?\s*(\d+\.?\d*)/gi,
  usc: /\b(\d+)\s+U\.?S\.?C\.?\s+§?\s*(\d+)/gi,
  case: /\b([A-Z][a-z]+(?:\s+&?\s+[A-Z][a-z]+)*)\s+v\.\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
  reporter: /\b(\d+)\s+(?:F\.?\d+d?|U\.?S\.?|S\.?Ct\.?|L\.?Ed\.?)\s+(\d+)/gi,
};

export default function AICitationSearchSidebar({
  editorContent,
  caseType,
  caseStatus,
  onInsertCitation,
  onBookmarkCitation,
}: AICitationSearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [detectedCitations, setDetectedCitations] = useState<CitationMatch[]>([]);
  const [searchResults, setSearchResults] = useState<CitationMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [bookmarkedCitations, setBookmarkedCitations] = useState<CitationMatch[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Auto-detect citations in editor content
  useEffect(() => {
    const detectCitations = () => {
      const matches: CitationMatch[] = [];
      const caseTypeData = LEGAL_DATABASE[caseType] || [];

      // Check for CFR citations
      const cfrMatches = [...editorContent.matchAll(CITATION_PATTERNS.cfr)];
      cfrMatches.forEach(match => {
        const citation = `${match[1]} C.F.R. § ${match[2]}`;
        const found = caseTypeData.find(c => c.citation.includes(citation));
        if (found) matches.push(found);
      });

      // Check for USC citations
      const uscMatches = [...editorContent.matchAll(CITATION_PATTERNS.usc)];
      uscMatches.forEach(match => {
        const citation = `${match[1]} U.S.C. § ${match[2]}`;
        const found = caseTypeData.find(c => c.citation.includes(citation));
        if (found) matches.push(found);
      });

      // Check for case names
      const caseMatches = [...editorContent.matchAll(CITATION_PATTERNS.case)];
      caseMatches.forEach(match => {
        const caseName = `${match[1]} v. ${match[2]}`;
        const found = caseTypeData.find(c => c.citation.includes(caseName));
        if (found) matches.push(found);
      });

      setDetectedCitations(matches);
    };

    const timeoutId = setTimeout(detectCitations, 500);
    return () => clearTimeout(timeoutId);
  }, [editorContent, caseType]);

  // Manual search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    // Simulate API call to legal database
    await new Promise(resolve => setTimeout(resolve, 500));

    const caseTypeData = LEGAL_DATABASE[caseType] || [];
    const results = caseTypeData.filter(item =>
      item.citation.toLowerCase().includes(query.toLowerCase()) ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.summary.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    setIsSearching(false);
  };

  // Get AI-powered suggestions based on context
  const aiSuggestions = useMemo(() => {
    const caseTypeData = LEGAL_DATABASE[caseType] || [];
    
    // Filter by case status relevance
    if (caseStatus.includes('Pre-Hearing')) {
      return caseTypeData.filter(c =>
        c.citation.includes('718.202') || c.citation.includes('718.204')
      ).slice(0, 3);
    }
    
    if (caseStatus.includes('Briefing') || caseStatus.includes('Appeal')) {
      return caseTypeData.filter(c =>
        c.type === 'case' || c.type === 'statute'
      ).slice(0, 3);
    }

    return caseTypeData.slice(0, 3);
  }, [caseType, caseStatus]);

  const handleInsertCitation = (citation: CitationMatch) => {
    onInsertCitation(citation.citation);
  };

  const handleBookmarkCitation = (citation: CitationMatch) => {
    if (!bookmarkedCitations.find(c => c.id === citation.id)) {
      setBookmarkedCitations([...bookmarkedCitations, citation]);
      onBookmarkCitation(citation);
    }
  };

  const removeBookmark = (citationId: string) => {
    setBookmarkedCitations(bookmarkedCitations.filter(c => c.id !== citationId));
  };

  return (
    <div className="w-80 border-l border-slate-200 bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-slate-900">AI Research Assistant</h3>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search regulations, cases..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Detected Citations */}
      {detectedCitations.length > 0 && (
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">Detected Citations</h4>
          </div>
          <div className="space-y-2">
            {detectedCitations.map((citation) => (
              <Card key={citation.id} className="p-3 bg-white border-emerald-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      {citation.citation}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">{citation.title}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleInsertCitation(citation)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmarkCitation(citation)}
                      className="h-6 w-6 p-0"
                    >
                      <Bookmark className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && !showSearchResults && (
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900">Suggested for {caseType}</h4>
          </div>
          <div className="space-y-2">
            {aiSuggestions.map((citation, idx) => (
              <Card key={citation.id} className="p-3 bg-white">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="info" size="sm" className="text-[10px]">
                        {citation.type}
                      </Badge>
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {citation.citation}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">{citation.title}</div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {citation.relevanceScore}% relevant to {caseStatus}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInsertCitation(citation)}
                    className="h-8 text-xs"
                  >
                    Insert
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {showSearchResults && (
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-600" />
              <h4 className="text-sm font-bold text-slate-900">Search Results</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSearchResults(false);
                setSearchQuery('');
              }}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((citation) => (
                <Card key={citation.id} className="p-3 bg-white">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="info" size="sm" className="text-[10px]">
                          {citation.type}
                        </Badge>
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          {citation.citation}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">{citation.title}</div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {citation.summary}
                      </div>
                      {citation.date && (
                        <div className="text-[10px] text-slate-400 mt-1">
                          {citation.source} • {citation.date}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInsertCitation(citation)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmarkCitation(citation)}
                        className="h-6 w-6 p-0"
                      >
                        <Bookmark className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      )}

      {/* Bookmarked Citations */}
      {bookmarkedCitations.length > 0 && (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bookmark className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">Bookmarked</h4>
          </div>
          <div className="space-y-2">
            {bookmarkedCitations.map((citation) => (
              <Card key={citation.id} className="p-3 bg-blue-50 border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      {citation.citation}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">{citation.title}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBookmark(citation.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Add Sparkles icon
function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
