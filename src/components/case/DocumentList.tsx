import { useState } from 'react';
import { Card, Badge, Button } from '../UI';
import { FileText, Eye, Download, Upload, Filter } from 'lucide-react';

interface DocumentItem {
  name: string;
  type: string;
  filedAt: string;
  filedBy: string;
  size: string;
  pages: number;
  status: string;
}

interface DocumentListProps {
  documents: DocumentItem[];
  onViewDocument?: (doc: DocumentItem) => void;
  onDownloadDocument?: (doc: DocumentItem) => void;
}

const TABS = ['filings', 'exhibits', 'decisions', 'orders', 'transcripts', 'memos'];

export default function DocumentList({ documents, onViewDocument, onDownloadDocument }: DocumentListProps) {
  const [activeTab, setActiveTab] = useState('filings');

  const filteredDocuments = documents.filter(doc =>
    doc.type.toLowerCase() === activeTab.toLowerCase()
  );

  const getStatusVariant = (status: string): 'success' | 'error' | 'warning' => {
    if (status === 'Accepted' || status === 'Admitted') return 'success';
    if (status === 'Rejected') return 'error';
    return 'warning';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 border-b border-slate-200">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" leftIcon={<Upload className="w-3 h-3" />}>Upload</Button>
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-3 h-3" />}>Filter</Button>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <FileText className="w-12 h-12 mb-4" />
          <p className="text-sm">No {activeTab} found for this case</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredDocuments.map((doc, index) => (
            <Card key={index}>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="font-bold text-slate-900">{doc.name}</div>
                    <div className="text-xs text-slate-500">
                      Filed: {doc.filedAt} &bull; By: {doc.filedBy} &bull; {doc.size} &bull; {doc.pages} pages
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(doc.status)} size="sm">
                    {doc.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Eye className="w-3 h-3" />}
                    onClick={() => onViewDocument?.(doc)}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Download className="w-3 h-3" />}
                    onClick={() => onDownloadDocument?.(doc)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
