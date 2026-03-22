/**
 * Auto-Docketing Rules Engine
 * 
 * Validates filings and determines if they can be auto-docketed
 * or require manual review by Docket Clerk
 */

export interface FilingValidation {
  isValid: boolean;
  aiScore: number;
  deficiencies: Deficiency[];
  canAutoDocket: boolean;
  recommendedAction: 'Auto-Docket' | 'Manual Review' | 'Deficiency Notice';
}

export interface Deficiency {
  id: string;
  type: 'Missing Signature' | 'Illegible Field' | 'Missing Required Field' | 'Invalid Format' | 'Missing Document';
  field: string;
  description: string;
  severity: 'Critical' | 'Warning';
  autoFixable: boolean;
}

export interface AutoDocketResult {
  success: boolean;
  docketNumber?: string;
  message: string;
  validation: FilingValidation;
}

// Validation Rules
const VALIDATION_RULES = {
  // Required fields for each case type
  REQUIRED_FIELDS: {
    BLA: ['claimantName', 'ssn', 'dateOfBirth', 'employerName', 'dateOfInjury', 'signature'],
    LHC: ['claimantName', 'ssn', 'dateOfBirth', 'employerName', 'dateOfInjury', 'signature', 'insuranceCarrier'],
    PER: ['petitionerName', 'employerName', 'dateOfDecision', 'signature'],
  },

  // AI Score thresholds
  THRESHOLDS: {
    AUTO_DOCKET_MIN_SCORE: 90,
    MANUAL_REVIEW_MIN_SCORE: 70,
    DEFICIENCY_MAX_COUNT: 0,
  },

  // Signature validation patterns
  SIGNATURE_PATTERNS: [
    /signed/i,
    /\/s\//i,
    /signature/i,
    /[a-zA-Z]+\s+[a-zA-Z]+/i, // Typed name as signature
  ],
};

/**
 * Validate a filing for auto-docketing
 */
export function validateFilingForDocketing(
  filingData: any,
  caseType: string,
  documentText?: string
): FilingValidation {
  const deficiencies: Deficiency[] = [];
  
  // 1. Check AI Score (from OCR/ML analysis)
  const aiScore = calculateAIScore(filingData, documentText);
  
  // 2. Check required fields
  const requiredFields = VALIDATION_RULES.REQUIRED_FIELDS[caseType as keyof typeof VALIDATION_RULES.REQUIRED_FIELDS] || [];
  requiredFields.forEach(field => {
    if (!filingData[field] || filingData[field].trim() === '') {
      deficiencies.push({
        id: `missing-${field}`,
        type: 'Missing Required Field',
        field,
        description: `Required field "${field}" is empty`,
        severity: 'Critical',
        autoFixable: false,
      });
    }
  });
  
  // 3. Check signature
  if (documentText && !hasValidSignature(documentText)) {
    deficiencies.push({
      id: 'missing-signature',
      type: 'Missing Signature',
      field: 'signature',
      description: 'No signature detected on document',
      severity: 'Critical',
      autoFixable: false,
    });
  }
  
  // 4. Check for illegible fields (from OCR confidence)
  if (documentText) {
    const illegibleFields = detectIllegibleFields(filingData);
    illegibleFields.forEach(field => {
      deficiencies.push({
        id: `illegible-${field}`,
        type: 'Illegible Field',
        field,
        description: `Field "${field}" could not be read clearly`,
        severity: 'Warning',
        autoFixable: false,
      });
    });
  }
  
  // 5. Determine if can auto-docket
  const canAutoDocket = 
    aiScore >= VALIDATION_RULES.THRESHOLDS.AUTO_DOCKET_MIN_SCORE &&
    deficiencies.filter(d => d.severity === 'Critical').length === 0;
  
  // 6. Determine recommended action
  let recommendedAction: 'Auto-Docket' | 'Manual Review' | 'Deficiency Notice';
  if (canAutoDocket) {
    recommendedAction = 'Auto-Docket';
  } else if (deficiencies.length > 0) {
    recommendedAction = 'Deficiency Notice';
  } else {
    recommendedAction = 'Manual Review';
  }
  
  return {
    isValid: deficiencies.filter(d => d.severity === 'Critical').length === 0,
    aiScore,
    deficiencies,
    canAutoDocket,
    recommendedAction,
  };
}

/**
 * Calculate AI completeness score
 */
function calculateAIScore(filingData: any, documentText?: string): number {
  let score = 100;
  
  // Deduct for missing fields
  const fieldCount = Object.keys(filingData).length;
  if (fieldCount < 5) score -= 20;
  else if (fieldCount < 8) score -= 10;
  
  // Deduct for low OCR confidence (if document text provided)
  if (documentText) {
    const wordCount = documentText.split(/\s+/).length;
    if (wordCount < 50) score -= 15;
    else if (wordCount < 100) score -= 5;
  }
  
  // Deduct for missing dates
  const dateFields = ['dateOfBirth', 'dateOfInjury', 'dateOfDecision'];
  dateFields.forEach(field => {
    if (!filingData[field]) score -= 5;
  });
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Check if document has valid signature
 */
function hasValidSignature(documentText: string): boolean {
  return VALIDATION_RULES.SIGNATURE_PATTERNS.some(pattern => pattern.test(documentText));
}

/**
 * Detect illegible fields from OCR data
 */
function detectIllegibleFields(filingData: any): string[] {
  const illegible: string[] = [];
  
  Object.entries(filingData).forEach(([field, value]) => {
    if (typeof value === 'string') {
      // Check for OCR garbage characters
      if (/[?#*]{3,}/.test(value) || value.length < 2) {
        illegible.push(field);
      }
    }
  });
  
  return illegible;
}

/**
 * Generate docket number
 */
export function generateDocketNumber(caseType: string): string {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 90000) + 10000;
  return `${year}-${caseType}-${sequence}`;
}

/**
 * Auto-docket a filing
 */
export async function autoDocketFiling(
  filingData: any,
  caseType: string,
  documentText?: string
): Promise<AutoDocketResult> {
  // 1. Validate filing
  const validation = validateFilingForDocketing(filingData, caseType, documentText);
  
  // 2. Check if can auto-docket
  if (!validation.canAutoDocket) {
    return {
      success: false,
      message: `Filing cannot be auto-docketed. ${validation.deficiencies.length} deficiency(ies) found.`,
      validation,
    };
  }
  
  // 3. Generate docket number
  const docketNumber = generateDocketNumber(caseType);
  
  // 4. Return success
  return {
    success: true,
    docketNumber,
    message: `Successfully docketed as ${docketNumber}`,
    validation,
  };
}

/**
 * Generate deficiency notice letter
 */
export function generateDeficiencyNotice(
  filingData: any,
  deficiencies: Deficiency[],
  claimantName: string,
  caseNumber?: string
): string {
  const today = new Date().toLocaleDateString();
  const deadline = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString();

  let notice = `NOTICE OF DEFICIENCY\n\n`;
  notice += `Date: ${today}\n`;
  if (caseNumber) {
    notice += `Case Number: ${caseNumber}\n`;
  }
  notice += `To: ${claimantName}\n\n`;
  notice += `Your filing has been reviewed and the following deficiencies were found:\n\n`;

  deficiencies.forEach((def, idx) => {
    notice += `${idx + 1}. ${def.type}: ${def.description}\n`;
  });

  notice += `\nPlease correct these deficiencies and resubmit by ${deadline}.\n`;
  notice += `Failure to do so may result in dismissal of your claim.\n\n`;
  notice += `Office of Administrative Law Judges\n`;
  notice += `U.S. Department of Labor`;

  return notice;
}

/**
 * Enhanced Auto-Docketing Result with tracking
 */
export interface EnhancedAutoDocketResult extends AutoDocketResult {
  intakeId: string;
  processedAt: string;
  processingTimeMs: number;
  channel: string;
  assignedClerk?: string;
}

/**
 * Batch auto-docketing for multiple filings
 */
export interface BatchDocketResult {
  total: number;
  successful: number;
  failed: number;
  requiresManualReview: number;
  results: EnhancedAutoDocketResult[];
}

/**
 * Auto-docketing statistics
 */
export interface AutoDocketStats {
  totalProcessed: number;
  autoDocketed: number;
  manualReview: number;
  deficiencyNotices: number;
  averageProcessingTime: number;
  successRate: number;
}

/**
 * Track auto-docketing session
 */
let processingStats: AutoDocketStats = {
  totalProcessed: 0,
  autoDocketed: 0,
  manualReview: 0,
  deficiencyNotices: 0,
  averageProcessingTime: 0,
  successRate: 0,
};

/**
 * Enhanced auto-docketing with tracking and statistics
 */
export async function enhancedAutoDocketFiling(
  intakeId: string,
  filingData: any,
  caseType: string,
  channel: string,
  documentText?: string,
  assignedClerk?: string
): Promise<EnhancedAutoDocketResult> {
  const startTime = Date.now();

  // 1. Validate filing
  const validation = validateFilingForDocketing(filingData, caseType, documentText);

  // 2. Check if can auto-docket
  if (!validation.canAutoDocket) {
    const processingTime = Date.now() - startTime;
    
    // Update statistics
    processingStats.totalProcessed++;
    if (validation.recommendedAction === 'Deficiency Notice') {
      processingStats.deficiencyNotices++;
    } else {
      processingStats.manualReview++;
    }
    updateAverageProcessingTime(processingTime);

    return {
      success: false,
      intakeId,
      processedAt: new Date().toISOString(),
      processingTimeMs: processingTime,
      channel,
      assignedClerk,
      message: `Filing cannot be auto-docketed. ${validation.deficiencies.length} deficiency(ies) found.`,
      validation,
    };
  }

  // 3. Generate docket number
  const docketNumber = generateDocketNumber(caseType);

  // 4. Update statistics
  const processingTime = Date.now() - startTime;
  processingStats.totalProcessed++;
  processingStats.autoDocketed++;
  updateAverageProcessingTime(processingTime);

  // 5. Return success
  return {
    success: true,
    intakeId,
    docketNumber,
    processedAt: new Date().toISOString(),
    processingTimeMs: processingTime,
    channel,
    assignedClerk,
    message: `Successfully docketed as ${docketNumber}`,
    validation,
  };
}

/**
 * Process batch of filings
 */
export async function batchAutoDocketFilings(
  filings: Array<{
    intakeId: string;
    filingData: any;
    caseType: string;
    channel: string;
    documentText?: string;
  }>
): Promise<BatchDocketResult> {
  const results: EnhancedAutoDocketResult[] = [];

  for (const filing of filings) {
    const result = await enhancedAutoDocketFiling(
      filing.intakeId,
      filing.filingData,
      filing.caseType,
      filing.channel,
      filing.documentText
    );
    results.push(result);
  }

  return {
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    requiresManualReview: results.filter(r => r.validation.recommendedAction === 'Manual Review').length,
    results,
  };
}

/**
 * Get auto-docketing statistics
 */
export function getAutoDocketStats(): AutoDocketStats {
  return { ...processingStats };
}

/**
 * Reset statistics (for testing)
 */
export function resetAutoDocketStats(): void {
  processingStats = {
    totalProcessed: 0,
    autoDocketed: 0,
    manualReview: 0,
    deficiencyNotices: 0,
    averageProcessingTime: 0,
    successRate: 0,
  };
}

/**
 * Update average processing time
 */
function updateAverageProcessingTime(newTime: number): void {
  const total = processingStats.totalProcessed;
  const oldAvg = processingStats.averageProcessingTime;
  processingStats.averageProcessingTime = ((oldAvg * (total - 1)) + newTime) / total;
  processingStats.successRate = (processingStats.autoDocketed / processingStats.totalProcessed) * 100;
}

/**
 * Generate deficiency notice with enhanced formatting
 */
export function generateEnhancedDeficiencyNotice(
  filingData: any,
  deficiencies: Deficiency[],
  claimantName: string,
  caseNumber: string,
  claimantAddress?: string
): {
  content: string;
  deadline: string;
  noticeId: string;
} {
  const today = new Date();
  const deadline = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const noticeId = `DN-${Date.now()}`;

  const deadlineStr = deadline.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let notice = `═══════════════════════════════════════════════════════════\n`;
  notice += `                    NOTICE OF DEFICIENCY\n`;
  notice += `═══════════════════════════════════════════════════════════\n\n`;
  notice += `Date: ${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n`;
  notice += `Case Number: ${caseNumber}\n`;
  notice += `Notice ID: ${noticeId}\n\n`;
  notice += `TO:\n`;
  notice += `    ${claimantName}\n`;
  if (claimantAddress) {
    notice += `    ${claimantAddress}\n`;
  }
  notice += `\n`;
  notice += `───────────────────────────────────────────────────────────\n`;
  notice += `DEFICIENCIES IDENTIFIED\n`;
  notice += `───────────────────────────────────────────────────────────\n\n`;
  notice += `Your filing has been reviewed by our automated system and the\n`;
  notice += `following deficiencies were identified:\n\n`;

  deficiencies.forEach((def, idx) => {
    notice += `  ${idx + 1}. ${def.type.toUpperCase()}\n`;
    notice += `     Field: ${def.field}\n`;
    notice += `     Issue: ${def.description}\n`;
    notice += `     Severity: ${def.severity}\n\n`;
  });

  notice += `───────────────────────────────────────────────────────────\n`;
  notice += `REQUIRED ACTION\n`;
  notice += `───────────────────────────────────────────────────────────\n\n`;
  notice += `You must correct the deficiencies listed above and resubmit\n`;
  notice += `your filing no later than ${deadlineStr}.\n\n`;
  notice += `FAILURE TO COMPLY:\n`;
  notice += `If you fail to correct these deficiencies by the deadline,\n`;
  notice += `your claim may be DISMISSED without further notice.\n\n`;
  notice += `SUBMISSION INSTRUCTIONS:\n`;
  notice += `You may resubmit your corrected filing through:\n`;
  notice += `  - UFS Portal: https://ufs.dol.gov\n`;
  notice += `  - Email: oalj@dol.gov\n`;
  notice += `  - Mail: Office of Administrative Law Judges\n`;
  notice += `           U.S. Department of Labor\n\n`;
  notice += `If you have questions, contact the Docket Clerk at:\n`;
  notice += `  Phone: (202) 555-0100\n`;
  notice += `  Email: docket.clerk@dol.gov\n\n`;
  notice += `═══════════════════════════════════════════════════════════\n`;
  notice += `Office of Administrative Law Judges\n`;
  notice += `U.S. Department of Labor\n`;
  notice += `═══════════════════════════════════════════════════════════\n`;

  return {
    content: notice,
    deadline: deadlineStr,
    noticeId,
  };
}

/**
 * Validate deficiency correction
 */
export function validateDeficiencyCorrection(
  originalDeficiency: Deficiency,
  correctedValue: any
): {
  isCorrected: boolean;
  message: string;
} {
  if (!correctedValue || correctedValue.toString().trim() === '') {
    return {
      isCorrected: false,
      message: 'Field cannot be empty',
    };
  }

  // Check for signature pattern
  if (originalDeficiency.type === 'Missing Signature') {
    const hasSignature = VALIDATION_RULES.SIGNATURE_PATTERNS.some(pattern =>
      pattern.test(correctedValue.toString())
    );
    if (!hasSignature) {
      return {
        isCorrected: false,
        message: 'Invalid signature format. Use /s/ Your Name or type your name',
      };
    }
  }

  // Check for SSN format
  if (originalDeficiency.field === 'ssn') {
    const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
    if (!ssnPattern.test(correctedValue.toString())) {
      return {
        isCorrected: false,
        message: 'Invalid SSN format. Use XXX-XX-XXXX',
      };
    }
  }

  return {
    isCorrected: true,
    message: 'Deficiency corrected successfully',
  };
}
