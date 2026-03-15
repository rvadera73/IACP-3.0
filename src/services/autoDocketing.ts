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
  claimantName: string
): string {
  const today = new Date().toLocaleDateString();
  const deadline = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString();
  
  let notice = `NOTICE OF DEFICIENCY\n\n`;
  notice += `Date: ${today}\n`;
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
