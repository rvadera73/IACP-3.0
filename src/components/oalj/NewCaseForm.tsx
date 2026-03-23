import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Loader2,
  Scale,
  Building2,
  Wind,
  Ship,
  FileCheck,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { cn, Button, Card, Input, Select, Textarea, Alert } from '../UI';
import { CaseType, AppealType } from '../../types';
import { CASE_TYPES, APPEAL_TYPES } from '../../constants';
import { analyzeIntake } from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';

interface NewCaseFormProps {
  onCancel: () => void;
  onSubmit: (caseData: any) => void;
}

type FilingCategory = 'Adjudication' | 'Appeal';

export default function NewCaseForm({ onCancel, onSubmit }: NewCaseFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<FilingCategory>('Adjudication');
  const [caseType, setCaseType] = useState<CaseType | AppealType>('BLA');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileValidated, setIsFileValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    claimantName: '',
    claimantSSN: '',
    claimantDOB: '',
    claimantAddress: '',
    claimantEmail: '',
    claimantPhone: '',
    employerName: '',
    employerEIN: '',
    employerAddress: '',
    insuranceCarrier: '',
    carrierCode: '',
    attorneyName: '',
    attorneyBarNumber: '',
    attorneyEmail: '',
    attorneyPhone: '',
    lawFirm: '',
    incidentDate: '',
    incidentLocation: '',
    injuryDescription: '',
    occupation: '',
    isRepresented: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setIsFileValidated(false);
      
      // Simulate file validation
      setTimeout(() => {
        setIsFileValidated(true);
      }, 1500);
    }
  };

  const handleAIValidation = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    const details = `Form: ${selectedFile.name}. Claimant: ${formData.claimantName}. Employer: ${formData.employerName}. Type: ${caseType}`;
    const feedback = await analyzeIntake(details, 'New Case Filing', user?.role || 'Attorney');
    setAiFeedback(feedback);
    setIsAnalyzing(false);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Generate case data
    const newCaseData = {
      id: `case-${Date.now()}`,
      docketNumber: `${new Date().getFullYear()}-${caseType}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      caseType,
      category,
      title: `${formData.claimantName} v. ${formData.employerName}`,
      claimant: formData.claimantName,
      employer: formData.employerName,
      status: 'Active',
      urgency: 'Medium' as const,
      createdAt: new Date().toISOString(),
      filings: [{
        id: `filing-${Date.now()}`,
        type: 'Claim',
        category: 'Initial Filing',
        description: `${caseType} Claim Form`,
        submittedBy: formData.claimantName,
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'Accepted' as const,
      }],
      parties: [
        {
          name: formData.claimantName,
          role: 'Claimant',
          isRepresented: formData.isRepresented,
          attorneyName: formData.isRepresented ? formData.attorneyName : undefined,
          email: formData.claimantEmail,
        },
        {
          name: formData.employerName,
          role: 'Employer',
          isRepresented: true,
          organization: formData.employerName,
        }
      ],
      deadlines: [],
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(newCaseData);
    }, 1500);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderTypeSelection = () => (
    <div className="space-y-8">
      {/* Category Selection */}
      <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
          Case Category
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { setCategory('Adjudication'); setCaseType('BLA'); }}
            className={cn(
              "p-6 rounded-xl border-2 transition-all text-left",
              category === 'Adjudication'
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            )}
          >
            <Scale className={cn(
              "w-8 h-8 mb-3",
              category === 'Adjudication' ? 'text-blue-600' : 'text-slate-400'
            )} />
            <div className="text-lg font-bold text-slate-900">Adjudication (OALJ)</div>
            <div className="text-sm text-slate-500 mt-1">Initial claims for Black Lung, Longshore, etc.</div>
          </button>
          <button
            onClick={() => { setCategory('Appeal'); setCaseType('BRB'); }}
            className={cn(
              "p-6 rounded-xl border-2 transition-all text-left",
              category === 'Appeal'
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            )}
          >
            <Building2 className={cn(
              "w-8 h-8 mb-3",
              category === 'Appeal' ? 'text-blue-600' : 'text-slate-400'
            )} />
            <div className="text-lg font-bold text-slate-900">Appeal (Boards)</div>
            <div className="text-sm text-slate-500 mt-1">Appeals to BRB, ARB, or ECAB</div>
          </button>
        </div>
      </div>

      {/* Case Type Selection */}
      <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
          {category === 'Adjudication' ? 'Program Type' : 'Appellate Board'}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {category === 'Adjudication' ? (
            Object.entries(CASE_TYPES).map(([type, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={type}
                  onClick={() => setCaseType(type as CaseType)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-left",
                    caseType === type
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <Icon className={cn(
                    "w-6 h-6 mb-2",
                    caseType === type ? 'text-blue-600' : 'text-slate-400'
                  )} />
                  <div className="text-sm font-bold text-slate-900">{type}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{config.label.replace(`(${type})`, '').trim()}</div>
                </button>
              );
            })
          ) : (
            Object.entries(APPEAL_TYPES).map(([type, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={type}
                  onClick={() => setCaseType(type as AppealType)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-left",
                    caseType === type
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <Icon className={cn(
                    "w-6 h-6 mb-2",
                    caseType === type ? 'text-blue-600' : 'text-slate-400'
                  )} />
                  <div className="text-sm font-bold text-slate-900">{type}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{config.label}</div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setStep(2)} rightIcon={<CheckCircle className="w-4 h-4" />}>
          Continue
        </Button>
      </div>
    </div>
  );

  const renderFormFields = () => (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto">
      {/* Claimant Information */}
      <section>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <FileText className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Claimant Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Full Legal Name *"
            value={formData.claimantName}
            onChange={(e) => updateField('claimantName', e.target.value)}
            placeholder="e.g., John Michael Smith"
            required
          />
          <Input
            label="SSN (Last 4 digits) *"
            value={formData.claimantSSN}
            onChange={(e) => updateField('claimantSSN', e.target.value.slice(0, 4))}
            placeholder="____"
            maxLength={4}
            required
          />
          <Input
            label="Date of Birth *"
            type="date"
            value={formData.claimantDOB}
            onChange={(e) => updateField('claimantDOB', e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            value={formData.claimantPhone}
            onChange={(e) => updateField('claimantPhone', e.target.value)}
            placeholder="(555) 123-4567"
          />
          <Input
            label="Email"
            type="email"
            value={formData.claimantEmail}
            onChange={(e) => updateField('claimantEmail', e.target.value)}
            placeholder="claimant@email.com"
          />
          <Input
            label="Address"
            value={formData.claimantAddress}
            onChange={(e) => updateField('claimantAddress', e.target.value)}
            placeholder="Street Address"
          />
        </div>
      </section>

      {/* Employer Information */}
      <section>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <Building2 className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Employer Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Employer Name *"
            value={formData.employerName}
            onChange={(e) => updateField('employerName', e.target.value)}
            placeholder="e.g., ABC Coal Company"
            required
          />
          <Input
            label="Employer EIN *"
            value={formData.employerEIN}
            onChange={(e) => updateField('employerEIN', e.target.value)}
            placeholder="XX-XXXXXXX"
            required
          />
          <Input
            label="Address"
            value={formData.employerAddress}
            onChange={(e) => updateField('employerAddress', e.target.value)}
            placeholder="Street Address"
          />
          <Input
            label="Insurance Carrier"
            value={formData.insuranceCarrier}
            onChange={(e) => updateField('insuranceCarrier', e.target.value)}
            placeholder="Carrier Name"
          />
        </div>
      </section>

      {/* Incident Details */}
      <section>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <Activity className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Incident Details</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date of Injury/Incident *"
            type="date"
            value={formData.incidentDate}
            onChange={(e) => updateField('incidentDate', e.target.value)}
            required
          />
          <Input
            label="Location"
            value={formData.incidentLocation}
            onChange={(e) => updateField('incidentLocation', e.target.value)}
            placeholder="City, State"
          />
          <div className="col-span-2">
            <Textarea
              label="Description of Injury/Incident *"
              value={formData.injuryDescription}
              onChange={(e) => updateField('injuryDescription', e.target.value)}
              placeholder="Describe the nature of the injury or incident..."
              rows={4}
              required
            />
          </div>
          <Input
            label="Occupation"
            value={formData.occupation}
            onChange={(e) => updateField('occupation', e.target.value)}
            placeholder="e.g., Coal Miner"
          />
        </div>
      </section>

      {/* Representation */}
      <section>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Legal Representation</h3>
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isRepresented}
              onChange={(e) => updateField('isRepresented', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">I am representing the claimant as an attorney</span>
          </label>
        </div>
        {formData.isRepresented && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Attorney Name *"
              value={formData.attorneyName}
              onChange={(e) => updateField('attorneyName', e.target.value)}
              placeholder="Full Name"
              required={formData.isRepresented}
            />
            <Input
              label="Bar Number *"
              value={formData.attorneyBarNumber}
              onChange={(e) => updateField('attorneyBarNumber', e.target.value)}
              placeholder="e.g., DC-123456"
              required={formData.isRepresented}
            />
            <Input
              label="Law Firm"
              value={formData.lawFirm}
              onChange={(e) => updateField('lawFirm', e.target.value)}
              placeholder="Firm Name"
            />
            <Input
              label="Email *"
              type="email"
              value={formData.attorneyEmail}
              onChange={(e) => updateField('attorneyEmail', e.target.value)}
              required={formData.isRepresented}
            />
            <Input
              label="Phone"
              value={formData.attorneyPhone}
              onChange={(e) => updateField('attorneyPhone', e.target.value)}
            />
          </div>
        )}
      </section>

      {/* Document Upload */}
      <section>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <Upload className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Supporting Documents</h3>
        </div>
        <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <div className="text-sm font-medium text-slate-700">
                {selectedFile ? selectedFile.name : 'Click to upload form'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'PDF, DOC, or DOCX (max 10MB)'}
              </div>
            </div>
          </label>
          {selectedFile && isFileValidated && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700">File uploaded successfully</span>
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
              {isAnalyzing ? 'Analyzing...' : 'Run AI Validation'}
            </Button>
            {aiFeedback && (
              <Alert variant="success" className="mt-3" title="AI Analysis Complete">
                {aiFeedback}
              </Alert>
            )}
          </div>
        )}
      </section>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
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
              <Badge variant="info" size="sm">{category}</Badge>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {step === 1 ? 'Select Case Type' : step === 2 ? 'Case Information' : 'Review & Submit'}
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
        {step === 1 && renderTypeSelection()}
        {step === 2 && renderFormFields()}
        {step === 3 && (
          <div className="space-y-6">
            <Alert variant="info" title="Review Your Information">
              Please review all entered information before submitting. Once submitted, 
              this case will be assigned a docket number and enter the intake queue.
            </Alert>
            
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Case Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Case Type:</span>
                  <span className="ml-2 font-semibold">{caseType}</span>
                </div>
                <div>
                  <span className="text-slate-500">Category:</span>
                  <span className="ml-2 font-semibold">{category}</span>
                </div>
                <div>
                  <span className="text-slate-500">Claimant:</span>
                  <span className="ml-2 font-semibold">{formData.claimantName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Employer:</span>
                  <span className="ml-2 font-semibold">{formData.employerName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Date of Injury:</span>
                  <span className="ml-2 font-semibold">{formData.incidentDate}</span>
                </div>
                {formData.isRepresented && (
                  <div>
                    <span className="text-slate-500">Attorney:</span>
                    <span className="ml-2 font-semibold">{formData.attorneyName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                isLoading={isSubmitting}
                leftIcon={<CheckCircle className="w-4 h-4" />}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Case'}
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Buttons for Step 2 */}
        {step === 2 && (
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)} rightIcon={<CheckCircle className="w-4 h-4" />}>
              Review
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function Badge({ variant, size, children }: any) {
  const variants: any = {
    info: 'bg-blue-100 text-blue-700',
  };
  const sizes: any = {
    sm: 'px-2 py-0.5 text-[10px]',
  };
  return (
    <span className={cn("inline-flex items-center rounded-full font-semibold uppercase", variants[variant], sizes[size])}>
      {children}
    </span>
  );
}
