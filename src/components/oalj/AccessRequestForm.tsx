import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Upload, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  X,
  Loader2,
  FileText,
  User,
  Briefcase
} from 'lucide-react';
import { cn, Button, Card, Input, Select, Textarea, Alert } from '../UI';
import { analyzeAccessRequest } from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';
import { CaseType } from '../../types';

interface AccessRequestFormProps {
  onCancel: () => void;
  onSubmit: (request: any) => void;
}

interface CaseSearchResult {
  caseNumber: string;
  title: string;
  caseType: string;
  status: string;
  claimant: string;
  employer: string;
  judge?: string;
}

export default function AccessRequestForm({ onCancel, onSubmit }: AccessRequestFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>('search' | 'details' | 'success');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<CaseSearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    requestReason: 'Retained as Counsel',
    representingParty: 'Claimant',
    attorneyName: user?.name || '',
    barNumber: '',
    lawFirm: '',
    email: user?.id ? '' : '',
    phone: '',
    additionalNotes: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileValidated, setIsFileValidated] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter a case number or claim number');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    // Simulate case search
    setTimeout(() => {
      setIsSearching(false);
      
      // Mock search results
      const mockCases: Record<string, CaseSearchResult> = {
        '2024-BLA-00042': {
          caseNumber: '2024-BLA-00042',
          title: 'Estate of R. Kowalski v. Pittsburgh Coal Co.',
          caseType: 'BLA',
          status: 'Active',
          claimant: 'Estate of R. Kowalski',
          employer: 'Pittsburgh Coal Co.',
          judge: 'Hon. Sarah Jenkins',
        },
        '2024-LHC-00128': {
          caseNumber: '2024-LHC-00128',
          title: 'Maria Santos v. Atlantic Dockworkers Inc.',
          caseType: 'LHC',
          status: 'Active',
          claimant: 'Maria Santos',
          employer: 'Atlantic Dockworkers Inc.',
          judge: 'Hon. Michael Ross',
        },
        'BRB-24-0123': {
          caseNumber: 'BRB No. 24-0123 BLA',
          title: 'Williams v. Black Diamond Mining',
          caseType: 'BRB',
          status: 'Under Review',
          claimant: 'Sarah Williams',
          employer: 'Black Diamond Mining Co.',
        },
      };

      const normalizedQuery = searchQuery.trim().toUpperCase();
      const foundCase = Object.values(mockCases).find(
        c => c.caseNumber.replace(/[^A-Z0-9-]/g, '').includes(normalizedQuery.replace(/[^A-Z0-9-]/g, ''))
      );

      if (foundCase) {
        setSearchResult(foundCase);
        setStep(2);
      } else {
        setSearchError('Case not found. Please verify the case number and try again.');
      }
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setIsFileValidated(false);
      
      setTimeout(() => {
        setIsFileValidated(true);
      }, 1500);
    }
  };

  const handleAIValidation = async () => {
    if (!selectedFile || !searchResult) return;
    
    setIsAnalyzing(true);
    const details = `Case: ${searchResult.caseNumber}. Attorney: ${formData.attorneyName}. Bar: ${formData.barNumber}. Firm: ${formData.lawFirm}. Document: ${selectedFile.name}`;
    const feedback = await analyzeAccessRequest(details);
    setAiFeedback(feedback);
    setIsAnalyzing(false);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    const newRequest = {
      id: `req-${Date.now()}`,
      caseNumber: searchResult?.caseNumber || '',
      caseTitle: searchResult?.title || '',
      requestedBy: formData.attorneyName,
      requestedAt: new Date().toISOString().split('T')[0],
      status: 'Pending' as const,
      reason: formData.requestReason,
      representingParty: formData.representingParty,
      barNumber: formData.barNumber,
      lawFirm: formData.lawFirm,
      verificationStatus: 'Pending Review' as const,
      document: selectedFile?.name,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(newRequest);
      setStep(3);
    }, 1500);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderSearchStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <ShieldCheck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Request Case Access</h3>
        <p className="text-sm text-slate-600">
          Search for a case to request access as an attorney or representative
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Case Number or Claim Number
        </label>
        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
            placeholder="e.g., 2024-BLA-00042"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} isLoading={isSearching} leftIcon={<Search className="w-4 h-4" />}>
            Search
          </Button>
        </div>
        {searchError && (
          <Alert variant="error" className="mt-4" title="Search Error">
            {searchError}
          </Alert>
        )}
      </div>

      <div className="mt-8 p-6 bg-slate-50 rounded-xl">
        <h4 className="text-sm font-bold text-slate-900 mb-4">Common Case Number Formats</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900">OALJ Cases</div>
              <div className="text-slate-600 font-mono text-xs mt-1">2024-BLA-00042</div>
              <div className="text-slate-500 text-xs">Year-Program-Sequence</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900">BRB Appeals</div>
              <div className="text-slate-600 font-mono text-xs mt-1">BRB No. 24-0123 BLA</div>
              <div className="text-slate-500 text-xs">Board No. YY-Sequence Program</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900">ARB Appeals</div>
              <div className="text-slate-600 font-mono text-xs mt-1">ARB No. 24-045 PER</div>
              <div className="text-slate-500 text-xs">Board No. YY-Sequence Program</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900">ECAB Appeals</div>
              <div className="text-slate-600 font-mono text-xs mt-1">ECAB No. 24-789</div>
              <div className="text-slate-500 text-xs">Board No. YY-Sequence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      {/* Case Information */}
      {searchResult && (
        <Card variant="outlined">
          <div className="p-4 bg-slate-50">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Case Found</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Case Number:</span>
                <span className="text-sm font-semibold text-slate-900 font-mono">{searchResult.caseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Title:</span>
                <span className="text-sm text-slate-700">{searchResult.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Type:</span>
                <Badge variant="info">{searchResult.caseType}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Status:</span>
                <Badge variant="success">{searchResult.status}</Badge>
              </div>
              {searchResult.judge && (
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Judge:</span>
                  <span className="text-sm text-slate-700">{searchResult.judge}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Attorney Information */}
      <section>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <User className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Attorney Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Attorney Name *"
            value={formData.attorneyName}
            onChange={(e) => updateField('attorneyName', e.target.value)}
            required
          />
          <Input
            label="Bar Number *"
            value={formData.barNumber}
            onChange={(e) => updateField('barNumber', e.target.value)}
            placeholder="e.g., DC-123456"
            required
          />
          <Input
            label="Law Firm"
            value={formData.lawFirm}
            onChange={(e) => updateField('lawFirm', e.target.value)}
          />
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            required
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
        </div>
      </section>

      {/* Request Details */}
      <section>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <Briefcase className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Request Details</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
              Representing
            </label>
            <div className="flex gap-4">
              {['Claimant', 'Employer', 'Party-in-Interest', 'Other'].map((party) => (
                <label key={party} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="representingParty"
                    checked={formData.representingParty === party}
                    onChange={() => updateField('representingParty', party)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{party}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
              Reason for Request *
            </label>
            <Select
              value={formData.requestReason}
              onChange={(e) => updateField('requestReason', e.target.value)}
              options={[
                { value: 'Retained as Counsel', label: 'Retained as Counsel' },
                { value: 'Pro Hac Vice', label: 'Pro Hac Vice (Temporary Admission)' },
                { value: 'Substitute Counsel', label: 'Substitute Counsel' },
                { value: 'Associate Attorney', label: 'Associate Attorney' },
                { value: 'Legal Assistant', label: 'Legal Assistant / Paralegal' },
                { value: 'Interested Party', label: 'Interested Party' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>
          <Textarea
            label="Additional Notes"
            value={formData.additionalNotes}
            onChange={(e) => updateField('additionalNotes', e.target.value)}
            placeholder="Any additional information about your request..."
            rows={3}
          />
        </div>
      </section>

      {/* Document Upload */}
      <section>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <Upload className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Notice of Appearance (NOA)</h3>
        </div>
        <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
          <input
            type="file"
            id="noa-upload"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
          <label htmlFor="noa-upload" className="cursor-pointer">
            <div className="text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <div className="text-sm font-medium text-slate-700">
                {selectedFile ? selectedFile.name : 'Upload Notice of Appearance'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'PDF, DOC, or DOCX (max 10MB)'}
              </div>
            </div>
          </label>
          {selectedFile && isFileValidated && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700">Document uploaded successfully</span>
            </div>
          )}
        </div>
        {selectedFile && isFileValidated && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={handleAIValidation}
              isLoading={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? 'Validating...' : 'Run AI Validation'}
            </Button>
            {aiFeedback && (
              <Alert variant="success" className="mt-3" title="AI Validation Complete">
                {aiFeedback}
              </Alert>
            )}
          </div>
        )}
      </section>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t border-slate-100">
        <Button variant="outline" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          isLoading={isSubmitting}
          leftIcon={<ShieldCheck className="w-4 h-4" />}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
      </motion.div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted!</h3>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        Your access request has been submitted for review. You will receive an email notification 
        once a clerk has processed your request.
      </p>
      <Card className="max-w-md mx-auto mb-8">
        <div className="p-6 text-left">
          <h4 className="text-sm font-bold text-slate-900 mb-4">What happens next?</h4>
          <div className="space-y-3">
            <StepItem 
              number={1} 
              title="Clerk Review" 
              description="A DOL clerk will review your NOA and verify your bar status"
            />
            <StepItem 
              number={2} 
              title="Verification" 
              description="Your bar certification will be verified with the appropriate authority"
            />
            <StepItem 
              number={3} 
              title="Access Granted" 
              description="Once approved, you'll receive email confirmation and case access"
            />
          </div>
        </div>
      </Card>
      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={onCancel}>
          Back to Dashboard
        </Button>
        <Button onClick={() => window.print()} leftIcon={<FileText className="w-4 h-4" />}>
          Print Confirmation
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                Step {step} of 3
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {step === 1 ? 'Search for Case' : step === 2 ? 'Request Details' : 'Confirmation'}
            </h2>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
              step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            )}>
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div className={cn(
                "flex-1 h-1 rounded",
                step > s ? 'bg-blue-600' : 'bg-slate-200'
              )} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Content */}
      <Card className="p-6">
        {step === 1 && renderSearchStep()}
        {step === 2 && renderDetailsStep()}
        {step === 3 && renderSuccessStep()}
      </Card>
    </div>
  );
}

function StepItem({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="text-xs text-slate-500">{description}</div>
      </div>
    </div>
  );
}

function Badge({ variant, children }: any) {
  const variants: any = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", variants[variant])}>
      {children}
    </span>
  );
}
