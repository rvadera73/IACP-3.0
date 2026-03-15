import React, { useState } from 'react';
import { Card, Button } from '../UI';
import { Search, Star, BookOpen, FileText, Scale, X } from 'lucide-react';

interface ResearchResult {
  title: string;
  citation: string;
  category: 'case-law' | 'regulations' | 'precedent';
  relevance: 'High' | 'Medium' | 'Low';
  summary: string;
}

interface LegalResearchToolsProps {
  onInsertCitation?: (citation: string) => void;
}

const allResults: ResearchResult[] = [
  { title: 'Consolidation Coal Co. v. Director, OWCP', citation: '864 F.3d 1142 (10th Cir. 2017)', category: 'case-law', relevance: 'High', summary: 'Burden of proof in Black Lung disability claims under 30 U.S.C. § 921(c)(4).' },
  { title: 'Island Creek Coal Co. v. Compton', citation: '211 F.3d 203 (4th Cir. 2000)', category: 'case-law', relevance: 'High', summary: 'Standards for evaluating medical evidence in BLA cases.' },
  { title: 'Bath Iron Works Corp. v. Director, OWCP', citation: '506 U.S. 153 (1993)', category: 'case-law', relevance: 'Medium', summary: 'Definition of responsible operator under LHWCA.' },
  { title: '20 C.F.R. § 718.204', citation: '20 CFR 718.204', category: 'regulations', relevance: 'High', summary: 'Criteria for establishing total disability due to pneumoconiosis.' },
  { title: '20 C.F.R. § 725.309', citation: '20 CFR 725.309', category: 'regulations', relevance: 'Medium', summary: 'Requirements for filing subsequent claims.' },
  { title: '33 U.S.C. § 902', citation: '33 USC 902', category: 'regulations', relevance: 'Medium', summary: 'Definitions under the Longshore and Harbor Workers Compensation Act.' },
  { title: 'Harman Mining Co. v. Director, OWCP', citation: '678 F.3d 305 (4th Cir. 2012)', category: 'precedent', relevance: 'High', summary: 'Rebuttable presumption under 30 U.S.C. § 921(c)(4).' },
  { title: 'Westmoreland Coal Co. v. Cochran', citation: '718 F.3d 319 (4th Cir. 2013)', category: 'precedent', relevance: 'Medium', summary: 'Scope of employer liability in successive claim contexts.' },
];

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'case-law', label: 'Case Law', icon: Scale },
  { id: 'regulations', label: 'Regulations', icon: FileText },
  { id: 'precedent', label: 'Precedent Decisions', icon: BookOpen },
];

export default function LegalResearchTools({ onInsertCitation }: LegalResearchToolsProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedCitations, setPinnedCitations] = useState<Set<string>>(new Set());

  const filteredResults = allResults.filter(r => {
    const matchesCategory = activeFilter === 'all' || r.category === activeFilter;
    const matchesSearch = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const togglePin = (citation: string) => {
    setPinnedCitations(prev => {
      const next = new Set(prev);
      if (next.has(citation)) next.delete(citation); else next.add(citation);
      return next;
    });
  };

  const pinnedResults = allResults.filter(r => pinnedCitations.has(r.citation));

  const relevanceColor = (r: string) =>
    r === 'High' ? 'bg-green-50 text-green-700 border-green-200' :
    r === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
    'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Legal Research</h2>
        <p className="text-sm text-slate-500">Search case law, regulations, and precedent decisions</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search case law, regulations, or precedents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filterOptions.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeFilter === f.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.icon && <f.icon className="w-3.5 h-3.5" />}
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Results */}
        <div className="flex-grow space-y-3">
          {filteredResults.map((r, i) => (
            <Card key={i}>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-blue-700">{r.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.citation}</p>
                    <p className="text-xs text-slate-400 mt-1">{r.summary}</p>
                  </div>
                  <button
                    onClick={() => togglePin(r.citation)}
                    className={`p-1 rounded ${pinnedCitations.has(r.citation) ? 'text-yellow-500' : 'text-slate-300 hover:text-slate-500'}`}
                  >
                    <Star className="w-4 h-4" fill={pinnedCitations.has(r.citation) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs px-2 py-0.5 rounded border ${relevanceColor(r.relevance)}`}>
                    {r.relevance}
                  </span>
                  <button
                    onClick={() => onInsertCitation?.(r.citation)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Insert Citation →
                  </button>
                </div>
              </div>
            </Card>
          ))}
          {filteredResults.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">No results found</p>
            </div>
          )}
        </div>

        {/* Pinned Citations Sidebar */}
        {pinnedResults.length > 0 && (
          <div className="w-64 flex-shrink-0">
            <Card className="p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Pinned Citations ({pinnedResults.length})</h3>
              <div className="space-y-2">
                {pinnedResults.map((r, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                    <p className="text-xs text-slate-700 truncate flex-grow mr-2">{r.citation}</p>
                    <button onClick={() => togglePin(r.citation)} className="text-slate-400 hover:text-red-500 flex-shrink-0">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => pinnedResults.forEach(r => onInsertCitation?.(r.citation))}
                className="w-full mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Insert All Pinned
              </button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
