import React from 'react';
import { Upload, FileCheck, X } from 'lucide-react';
import { CaseType, AppealType } from '../types';

interface OALJFilingFormProps {
  filingType: 'New Case Filing' | 'New Motion' | 'New Brief';
  selectedCaseType: CaseType;
  preselectedCase?: any | null;
  formData: any;
  selectedFile: File | null;
  onUpdateFormData: (field: string, value: any) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

export default function OALJFilingForm({
  filingType,
  selectedCaseType,
  preselectedCase,
  formData,
  selectedFile,
  onUpdateFormData,
  onFileChange,
  onRemoveFile,
}: OALJFilingFormProps) {
  return (
    <div className="space-y-6">
      {/* Case Type Dropdown */}
      <div>
        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
          Program Type *
        </label>
        <select
          value={selectedCaseType}
          onChange={(e) => onUpdateFormData('caseType', e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="BLA">BLA - Black Lung</option>
          <option value="LHC">LHC - Longshore</option>
          <option value="PER">PER - BALCA/PERM</option>
        </select>
      </div>

      {/* Dynamic fields based on filing type */}
      {filingType === 'New Case Filing' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
                Claim Number *
              </label>
              <input
                type="text"
                value={formData.claimNumber}
                onChange={(e) => onUpdateFormData('claimNumber', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 12345-67-8901"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
                Employer Name *
              </label>
              <input
                type="text"
                value={formData.employerName}
                onChange={(e) => onUpdateFormData('employerName', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </>
      )}

      {filingType === 'New Motion' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
                Motion Category *
              </label>
              <select
                value={formData.motionCategory}
                onChange={(e) => onUpdateFormData('motionCategory', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Extension of Time</option>
                <option>Motion to Compel</option>
                <option>Motion in Limine</option>
                <option>Motion for Summary Decision</option>
                <option>Motion to Strike</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
                Opposing Party Position *
              </label>
              <select
                value={formData.opposingPartyPosition}
                onChange={(e) => onUpdateFormData('opposingPartyPosition', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Unopposed</option>
                <option>Opposed</option>
                <option>Unknown</option>
              </select>
            </div>
          </div>
          {preselectedCase && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-bold text-blue-900">Filing in Case:</div>
              <div className="text-sm text-blue-700">{preselectedCase.docketNumber}</div>
            </div>
          )}
        </>
      )}

      {filingType === 'New Brief' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
                Brief Type *
              </label>
              <select
                value={formData.briefType}
                onChange={(e) => onUpdateFormData('briefType', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Opening</option>
                <option>Respondent</option>
                <option>Reply</option>
                <option>Amicus Curiae</option>
              </select>
            </div>
          </div>
          {preselectedCase && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-bold text-blue-900">Filing in Case:</div>
              <div className="text-sm text-blue-700">{preselectedCase.docketNumber}</div>
            </div>
          )}
        </>
      )}

      {/* Common Fields */}
      <div>
        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
          Claimant Name *
        </label>
        <input
          type="text"
          value={formData.claimantName}
          onChange={(e) => onUpdateFormData('claimantName', e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onUpdateFormData('description', e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Brief description of the filing..."
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
          Upload Document *
        </label>
        <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
          <input
            id="oalj-filing-upload"
            type="file"
            onChange={onFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
          <label htmlFor="oalj-filing-upload" className="cursor-pointer text-center">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <div className="text-sm font-medium text-slate-700">
              {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
            </div>
            <div className="text-xs text-slate-500 mt-1">PDF, DOC, or DOCX (max 10MB)</div>
          </label>
          {selectedFile && (
            <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-700">{selectedFile.name}</span>
              </div>
              <button onClick={onRemoveFile} className="text-slate-400 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
