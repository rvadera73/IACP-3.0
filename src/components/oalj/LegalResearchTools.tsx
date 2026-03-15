/**
 * Legal Research Tools Component
 * 
 * Provides comprehensive legal research capabilities for:
 * - Case law search
 * - Regulations search
 * - Citation validation
 * - Precedent decisions
 * - AI-powered research assistance
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Search, BookOpen, Scale, CheckCircle, AlertCircle, FileText,
  ExternalLink, Download, Filter, Star, Bookmark, Clock, TrendingUp
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';

interface LegalResearchToolsProps {
  caseType?: 'BLA' | 'LHC' | 'PER' | 'BRB' | 'ARB' | 'ECAB';
  userRole?: string;
}

// Mock Case Law Database
const MOCK_CASE_LAW = [
  {
    id: 'SCOTUS-1994-001',
    citation: 'Director, OWCP v. Greenwich Collieries, 512 U.S. 267 (1994)',
    court: 'Supreme Court',
    date: '1994-06-24',
    relevance: 'Burden of proof in Black Lung cases',
    summary: 'Established that the true doubt rule cannot be used in Black Lung benefits cases. The burden of proof remains on the claimant to establish entitlement by a preponderance of the evidence.',
    keyPoints: [
      'True doubt rule invalidated',
      'Preponderance of evidence standard applies',
      'Burden remains with claimant',
    ],
    citedBy: 1247,
    type: 'supreme',
  },
  {
    id: '4TH-1995-002',
    citation: 'Consolidation Coal Co. v. Director, OWCP, 50 F.3d 238 (4th Cir. 1995)',
    court: '4th Circuit',
    date: '1995-03-15',
    relevance: 'Total disability definition',
    summary: 'Clarified the standard for total disability in Black Lung cases. A miner is totally disabled if his respiratory or pulmonary impairments prevent him from performing his usual coal mine work or comparable gainful employment.',
    keyPoints: [
      'Total disability standard defined',
      'Usual work or comparable employment test',
      'Respiratory impairment focus',
    ],
    citedBy: 892,
    type: 'circuit',
  },
  {
    id: 'SCOTUS-1981-003',
    citation: 'Potomac Electric Power Co. v. Director, OWCP, 449 U.S. 268 (1980)',
    court: 'Supreme Court',
    date: '1980-12-15',
    relevance: 'Longshore Act disability calculation',
    summary: 'Established the methodology for calculating disability percentages under the Longshore Act. The wage-earning capacity determination must be based on actual earnings when they fairly represent earning capacity.',
    keyPoints: [
      'Wage-earning capacity formula',
      'Actual earnings presumption',
      'Disability percentage calculation',
    ],
    citedBy: 654,
    type: 'supreme',
  },
  {
    id: '6TH-2018-004',
    citation: 'Island Creek Coal Co. v. Holder, 896 F.3d 403 (6th Cir. 2018)',
    court: '6th Circuit',
    date: '2018-07-20',
    relevance: '15-year presumption application',
    summary: 'Reinforced the application of the 15-year presumption in Black Lung cases. When a miner has 15+ years of qualifying employment, there is a rebuttable presumption of total disability due to pneumoconiosis.',
    keyPoints: [
      '15-year presumption standards',
      'Rebuttable presumption',
      'Qualifying employment definition',
    ],
    citedBy: 423,
    type: 'circuit',
  },
  {
    id: 'SCOTUS-2000-005',
    citation: 'Eastern Associated Coal Corp. v. Director, OWCP, 531 U.S. 86 (2000)',
    court: 'Supreme Court',
    date: '2000-10-31',
    relevance: 'Medical evidence standards',
    summary: 'Established standards for weighing conflicting medical evidence in Black Lung cases. ALJs must provide reasoned explanations for crediting one medical opinion over another.',
    keyPoints: [
      'Medical evidence weighing',
      'Reasoned explanation required',
      'Credibility determinations',
    ],
    citedBy: 756,
    type: 'supreme',
  },
];

// Mock Regulations Database
const MOCK_REGULATIONS = [
  {
    id: 'CFR-718-202',
    citation: '20 C.F.R. § 718.202',
    title: 'Pneumoconiosis - Definition and Establishment',
    category: 'Black Lung',
    summary: 'Defines pneumoconiosis and establishes the medical criteria for demonstrating the existence of the disease.',
    content: `§ 718.202 Pneumoconiosis.

(a) Nature of disease. Pneumoconiosis means a chronic lung disease arising out of coal mine employment.

(b) Methods of establishing.
  (1) Chest X-ray evidence
  (2) Biopsy or autopsy evidence
  (3) Medical opinions
  (4) Means other than those listed above

(c) Criteria. The disease shall be established if:
  (1) A chest radiograph demonstrates opacities
  (2) Biopsy or autopsy demonstrates pneumoconiosis
  (3) Medical opinions establish diagnosis`,
    lastUpdated: '2024-01-15',
  },
  {
    id: 'CFR-718-204',
    citation: '20 C.F.R. § 718.204',
    title: 'Total Disability - Definition and Establishment',
    category: 'Black Lung',
    summary: 'Defines total disability and establishes the criteria for demonstrating total disability due to pneumoconiosis.',
    content: `§ 718.204 Total disability.

(a) Definition. A miner is totally disabled if his respiratory or pulmonary impairments prevent him from performing his usual coal mine work or comparable gainful employment.

(b) Methods of establishing.
  (1) Pulmonary function tests
  (2) Arterial blood gas studies
  (3) Medical opinions
  (4) Documentary evidence

(c) Criteria. Total disability shall be established if:
  (1) FEV1 is below predicted values
  (2) DLCO is significantly impaired
  (3) Medical opinion supports total disability`,
    lastUpdated: '2024-01-15',
  },
  {
    id: 'CFR-702-301',
    citation: '20 C.F.R. § 702.301',
    title: 'Longshore Act - Disability Compensation',
    category: 'Longshore',
    summary: 'Establishes compensation rates and disability calculations under the Longshore and Harbor Workers Compensation Act.',
    content: `§ 702.301 Compensation rates.

(a) Permanent total disability. 66⅔% of average weekly wages

(b) Permanent partial disability. Based on schedule or wage-earning capacity

(c) Temporary total disability. 66⅔% of average weekly wages

(d) Maximum weekly rate: As prescribed by statute

(e) Minimum weekly rate: As prescribed by statute`,
    lastUpdated: '2024-02-01',
  },
  {
    id: 'CFR-655-100',
    citation: '20 C.F.R. § 655.100',
    title: 'PERM Labor Certification - General Requirements',
    category: 'PERM',
    summary: 'Establishes requirements for permanent labor certification for employment-based immigration.',
    content: `§ 655.100 Purpose and scope.

(a) This subpart governs the labor certification process for permanent employment

(b) Employer requirements:
  (1) Good faith recruitment
  (2) Prevailing wage determination
  (3) No qualified U.S. workers available

(c) Job requirements must be:
  (1) Normal for the occupation
  (2) Not unduly restrictive
  (3) Consistent with business necessity`,
    lastUpdated: '2024-03-01',
  },
];

// Mock Precedent Decisions by Board
const MOCK_PRECEDENTS = {
  BRB: [
    {
      id: 'BRB-PREC-001',
      citation: 'Smith v. Director, OWCP, 23 BLR 1-001 (2023)',
      title: 'Medical Opinion Weight Standards',
      summary: 'Established standards for weighing equally well-reasoned medical opinions in Black Lung cases.',
      keyHolding: 'When medical opinions are equally well-reasoned, the ALJ must consider all relevant factors before determining which opinion to credit.',
      year: 2023,
    },
    {
      id: 'BRB-PREC-002',
      citation: 'Jones v. Coal Operator, 22 BLR 1-089 (2022)',
      title: '15-Year Presumption Application',
      summary: 'Clarified the application of the 15-year presumption to surface miners.',
      keyHolding: 'The 15-year presumption applies to surface miners who demonstrate conditions substantially similar to underground mining.',
      year: 2022,
    },
  ],
  ARB: [
    {
      id: 'ARB-PREC-001',
      citation: 'Garcia v. Employer, ARB No. 20-050 (2021)',
      title: 'Whistleblower Burden Shifting',
      summary: 'Established burden-shifting framework for Sarbanes-Oxley whistleblower cases.',
      keyHolding: 'Complainant must prove protected activity was contributing factor; employer must prove clear and convincing evidence of independent reason.',
      year: 2021,
    },
  ],
  ECAB: [
    {
      id: 'ECAB-PREC-001',
      citation: 'Thompson v. OWCP, ECAB No. 684523 (2023)',
      title: 'Schedule Award Calculation',
      summary: 'Clarified proper application of AMA Guides 6th Edition for schedule awards.',
      keyHolding: 'Table 16-11 must be applied consistently; raters must explain any deviations from standard methodology.',
      year: 2023,
    },
  ],
};

export default function LegalResearchTools({ caseType, userRole }: LegalResearchToolsProps) {
  const [activeTab, setActiveTab] = useState<'case-law' | 'regulations' | 'precedents' | 'citation-check'>('case-law');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [citationToCheck, setCitationToCheck] = useState('');
  const [citationResult, setCitationResult] = useState<any | null>(null);

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      let results: any[] = [];
      
      if (activeTab === 'case-law') {
        results = MOCK_CASE_LAW.filter(
          (case_) =>
            case_.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            case_.relevance.toLowerCase().includes(searchQuery.toLowerCase()) ||
            case_.summary.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else if (activeTab === 'regulations') {
        results = MOCK_REGULATIONS.filter(
          (reg) =>
            reg.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else if (activeTab === 'precedents') {
        const boardPrecedents = caseType ? MOCK_PRECEDENTS[caseType as keyof typeof MOCK_PRECEDENTS] || [] : 
          Object.values(MOCK_PRECEDENTS).flat();
        results = boardPrecedents.filter(
          (prec) =>
            prec.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prec.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleCitationCheck = () => {
    // Simulate citation validation
    const isValid = citationToCheck.toLowerCase().includes('c.f.r') || 
                    citationToCheck.toLowerCase().includes('u.s.c') ||
                    citationToCheck.includes('v.') ||
                    citationToCheck.includes('F.') ||
                    citationToCheck.includes('BLR');
    
    setCitationResult({
      citation: citationToCheck,
      isValid,
      status: isValid ? 'valid' : 'invalid',
      message: isValid 
        ? 'Citation format appears valid' 
        : 'Citation format may be incorrect. Please verify.',
      suggestions: isValid ? [] : [
        'Check for proper citation format',
        'Verify volume and page numbers',
        'Ensure correct reporter abbreviation',
      ],
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">Legal Research Tools</h3>
          </div>
          
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveTab('case-law')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'case-law' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'
              }`}
            >
              Case Law
            </button>
            <button
              onClick={() => setActiveTab('regulations')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'regulations' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'
              }`}
            >
              Regulations
            </button>
            <button
              onClick={() => setActiveTab('precedents')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'precedents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'
              }`}
            >
              Precedents
            </button>
            <button
              onClick={() => setActiveTab('citation-check')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'citation-check' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'
              }`}
            >
              Citation Check
            </button>
          </div>

          {/* Search Bar */}
          {activeTab !== 'citation-check' && (
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button onClick={handleSearch} leftIcon={<Search className="w-4 h-4" />}>
                Search
              </Button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Citation Check Tab */}
          {activeTab === 'citation-check' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Enter Citation to Validate
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., 20 C.F.R. § 718.204(b) or Director, OWCP v. Greenwich Collieries"
                    value={citationToCheck}
                    onChange={(e) => setCitationToCheck(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button onClick={handleCitationCheck} leftIcon={<CheckCircle className="w-4 h-4" />}>
                    Check
                  </Button>
                </div>
              </div>

              {citationResult && (
                <Card className={`border-l-4 ${citationResult.isValid ? 'border-l-emerald-500 bg-emerald-50' : 'border-l-amber-500 bg-amber-50'}`}>
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {citationResult.isValid ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">{citationResult.message}</div>
                        <div className="text-sm text-slate-600 mt-1">Citation: {citationResult.citation}</div>
                        {citationResult.suggestions.length > 0 && (
                          <div className="mt-3">
                            <div className="text-sm font-bold text-slate-700 mb-2">Suggestions:</div>
                            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                              {citationResult.suggestions.map((suggestion: string, idx: number) => (
                                <li key={idx}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Common Citation Formats */}
              <Card>
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 mb-3">Common Citation Formats</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-slate-50 rounded">
                      <div className="font-bold text-slate-700">Regulations:</div>
                      <div className="text-slate-600">20 C.F.R. § 718.204(b)</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded">
                      <div className="font-bold text-slate-700">Statutes:</div>
                      <div className="text-slate-600">33 U.S.C. § 901 et seq.</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded">
                      <div className="font-bold text-slate-700">Supreme Court:</div>
                      <div className="text-slate-600">512 U.S. 267 (1994)</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded">
                      <div className="font-bold text-slate-700">Circuit Court:</div>
                      <div className="text-slate-600">50 F.3d 238 (4th Cir. 1995)</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded">
                      <div className="font-bold text-slate-700">BLR Reporter:</div>
                      <div className="text-slate-600">23 BLR 1-001 (2023)</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Search Results */}
          {activeTab !== 'citation-check' && (
            <>
              {isSearching && (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                  <div className="text-slate-600">Searching {activeTab}...</div>
                </div>
              )}

              {!isSearching && searchResults.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <div className="text-slate-600">No results found for "{searchQuery}"</div>
                  <div className="text-sm text-slate-500 mt-2">Try different keywords or check spelling</div>
                </div>
              )}

              {!isSearching && searchResults.length === 0 && !searchQuery && (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <div className="text-slate-600">Enter a search term to begin</div>
                  <div className="text-sm text-slate-500 mt-2">
                    {activeTab === 'case-law' && 'Search by citation, court, or legal issue'}
                    {activeTab === 'regulations' && 'Search by citation, title, or category'}
                    {activeTab === 'precedents' && 'Search by citation or case name'}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {searchResults.map((result) => (
                  <Card key={result.id} className="hover:bg-slate-50 transition-colors cursor-pointer" >
                    <div className="p-4" onClick={() => setSelectedDocument(result)}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 mb-1">{result.citation}</div>
                          {result.title && (
                            <div className="text-sm text-slate-600 mb-2">{result.title}</div>
                          )}
                          {result.relevance && (
                            <div className="text-sm text-slate-600 mb-2">{result.relevance}</div>
                          )}
                          <div className="text-sm text-slate-500">{result.summary}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.type === 'supreme' && (
                            <Badge variant="error" size="sm">SCOTUS</Badge>
                          )}
                          {result.type === 'circuit' && (
                            <Badge variant="info" size="sm">Circuit</Badge>
                          )}
                          {result.citedBy && (
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {result.citedBy} citations
                            </div>
                          )}
                        </div>
                      </div>
                      {result.keyPoints && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Points</div>
                          <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
                            {result.keyPoints.map((point: string, idx: number) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {result.keyHolding && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Holding</div>
                          <div className="text-sm text-slate-700">{result.keyHolding}</div>
                        </div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" leftIcon={<FileText className="w-3 h-3" />}>
                          View Full Text
                        </Button>
                        <Button variant="outline" size="sm" leftIcon={<Bookmark className="w-3 h-3" />}>
                          Save
                        </Button>
                        <Button variant="outline" size="sm" leftIcon={<ExternalLink className="w-3 h-3" />}>
                          External Link
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Quick Reference - Top Cited Cases */}
      {activeTab === 'case-law' && !searchQuery && (
        <Card>
          <div className="p-4 border-b border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Most Cited Cases in {caseType || 'Your Jurisdiction'}
            </h4>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_CASE_LAW.slice(0, 3).map((case_) => (
              <div key={case_.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <div className="text-sm font-bold text-slate-900">{case_.citation}</div>
                  <div className="text-xs text-slate-500">{case_.relevance}</div>
                </div>
                <Badge variant="neutral" size="sm">{case_.citedBy} citations</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Reference - Recent Regulations */}
      {activeTab === 'regulations' && !searchQuery && (
        <Card>
          <div className="p-4 border-b border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Recently Updated Regulations
            </h4>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_REGULATIONS.slice(0, 3).map((reg) => (
              <div key={reg.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <div className="text-sm font-bold text-slate-900">{reg.citation}</div>
                  <div className="text-xs text-slate-500">{reg.title}</div>
                </div>
                <Badge variant="info" size="sm">{reg.category}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
