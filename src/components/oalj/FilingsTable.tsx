import React from 'react';
import { 
  FileText, 
  Gavel, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Download,
  Eye,
  MoreVertical
} from 'lucide-react';
import { cn, Badge, Button } from '../UI';
import { motion } from 'motion/react';

export interface Filing {
  id: string;
  type: string;
  category: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  status: 'Pending' | 'Accepted' | 'Deficient' | 'Rejected';
  aiAnalysis?: string;
  hasAttachments?: boolean;
  attachmentsCount?: number;
}

interface FilingsTableProps {
  filings: Filing[];
  onViewFiling?: (filing: Filing) => void;
  onDownload?: (filing: Filing) => void;
  onAction?: (filing: Filing, action: string) => void;
}

const statusConfig = {
  'Pending': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', badge: 'warning' as const },
  'Accepted': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', badge: 'success' as const },
  'Deficient': { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', badge: 'error' as const },
  'Rejected': { icon: XCircle, color: 'text-red-700', bg: 'bg-red-100', badge: 'error' as const },
};

const typeIcons: Record<string, React.ElementType> = {
  'Claim': FileText,
  'Motion': Gavel,
  'Brief': FileText,
  'Evidence': FileText,
  'Notice': FileText,
  'Appeal': Gavel,
};

export default function FilingsTable({ 
  filings, 
  onViewFiling,
  onDownload,
  onAction 
}: FilingsTableProps) {
  const getStatusIcon = (status: Filing['status']) => {
    const config = statusConfig[status];
    return config ? config.icon : Clock;
  };

  const getTypeIcon = (type: string) => {
    return typeIcons[type] || FileText;
  };

  if (filings.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-500 font-medium">No filings yet</p>
        <p className="text-xs text-slate-400 mt-1">Filings and motions will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Submitted By
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                AI Analysis
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filings.map((filing, index) => {
              const StatusIcon = getStatusIcon(filing.status);
              const TypeIcon = getTypeIcon(filing.type);
              const statusCfg = statusConfig[filing.status];

              return (
                <motion.tr
                  key={filing.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", statusCfg.bg)}>
                        <TypeIcon className={cn("w-4 h-4", statusCfg.color)} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {filing.type}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {filing.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-slate-900 font-medium max-w-md">
                      {filing.description}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-slate-700">
                      {filing.submittedBy}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-slate-600 font-mono">
                      {new Date(filing.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={statusCfg.badge} size="sm">
                      <StatusIcon className="w-3 h-3" />
                      {filing.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    {filing.aiAnalysis ? (
                      <div className="text-xs text-slate-600 max-w-xs line-clamp-2" title={filing.aiAnalysis}>
                        {filing.aiAnalysis}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {onViewFiling && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewFiling(filing)}
                          className="p-2"
                          aria-label="View filing"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </Button>
                      )}
                      {onDownload && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownload(filing)}
                          className="p-2"
                          aria-label="Download filing"
                        >
                          <Download className="w-4 h-4 text-slate-600" />
                        </Button>
                      )}
                      {onAction && filing.status === 'Pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAction(filing, 'respond')}
                          className="p-2"
                          aria-label="Respond to filing"
                        >
                          <MoreVertical className="w-4 h-4 text-slate-600" />
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
