/**
 * Smart Assignment Algorithm
 * 
 * Suggests judges for case assignment based on:
 * - Weighted workload (40%)
 * - Geographic district (30%)
 * - Case type expertise (20%)
 * - Random rotation (10%)
 */

export interface Judge {
  id: string;
  name: string;
  office: string;
  activeCases: number;
  weightedLoad: number;
  capacity: number;
  specialty: string[];
  compliance270: number;
  pendingDecisions: number;
}

export interface AssignmentSuggestion {
  judge: Judge;
  score: number;
  rank: number;
  reasons: string[];
}

export interface AssignmentCriteria {
  caseType: 'BLA' | 'LHC' | 'PER';
  office?: string;
  complexity?: 'Low' | 'Medium' | 'High';
}

// Case complexity weights
const CASE_WEIGHTS = {
  BLA: 3, // Black Lung - medical evidence, complex
  LHC: 2, // Longshore - moderate complexity
  PER: 1, // PERM/BALCA - lower complexity
};

// Assignment weights
const ASSIGNMENT_WEIGHTS = {
  WORKLOAD: 0.40,      // 40% - Current workload balance
  GEOGRAPHIC: 0.30,    // 30% - District alignment
  EXPERTISE: 0.20,     // 20% - Case type expertise
  ROTATION: 0.10,      // 10% - Random rotation for fairness
};

/**
 * Calculate weighted workload for a judge
 */
function calculateWeightedLoad(judge: Judge, caseType: string): number {
  const caseWeight = CASE_WEIGHTS[caseType as keyof typeof CASE_WEIGHTS] || 2;
  const newWeightedLoad = judge.weightedLoad + caseWeight;
  
  // Return utilization percentage
  return (newWeightedLoad / judge.capacity) * 100;
}

/**
 * Calculate geographic match score
 */
function calculateGeographicScore(judge: Judge, office?: string): number {
  if (!office) return 100; // No preference
  
  // Perfect match
  if (judge.office === office) return 100;
  
  // Same region (simplified - in reality would have region mapping)
  const sameRegion = [
    ['Washington, DC', 'Cherry Hill, NJ', 'Newport News, VA'], // East Coast
    ['Cincinnati, OH', 'Covington, LA'], // Central
    ['Pittsburgh, PA'], // Appalachia (BLA-heavy)
    ['San Francisco, CA'], // West Coast
  ];
  
  const judgeRegion = sameRegion.find(region => region.includes(judge.office));
  const officeRegion = sameRegion.find(region => region.includes(office));
  
  if (judgeRegion && officeRegion && judgeRegion === officeRegion) {
    return 70; // Same region but different office
  }
  
  return 30; // Different region
}

/**
 * Calculate expertise match score
 */
function calculateExpertiseScore(judge: Judge, caseType: string): number {
  if (judge.specialty.includes(caseType)) {
    return 100; // Has expertise in this case type
  }
  
  // Check for related expertise
  const relatedExpertise: Record<string, string[]> = {
    BLA: ['LHC'], // Black Lung judges often handle Longshore
    LHC: ['BLA', 'DBA'], // Longshore judges handle related maritime
    PER: ['WB'], // PERM judges handle whistleblower
  };
  
  if (relatedExpertise[caseType]?.some(type => judge.specialty.includes(type))) {
    return 70; // Related expertise
  }
  
  return 40; // No specific expertise
}

/**
 * Calculate random rotation score (to ensure fair distribution)
 */
function calculateRotationScore(judge: Judge, allJudges: Judge[]): number {
  // Judges with fewer recent assignments get higher rotation score
  const avgCases = allJudges.reduce((sum, j) => sum + j.activeCases, 0) / allJudges.length;
  
  if (judge.activeCases < avgCases * 0.8) {
    return 100; // Below average - prioritize
  } else if (judge.activeCases < avgCases * 1.2) {
    return 70; // Near average
  } else {
    return 30; // Above average - deprioritize
  }
}

/**
 * Calculate overall assignment score for a judge
 */
function calculateAssignmentScore(
  judge: Judge,
  criteria: AssignmentCriteria,
  allJudges: Judge[]
): number {
  const workloadScore = 100 - calculateWeightedLoad(judge, criteria.caseType);
  const geographicScore = calculateGeographicScore(judge, criteria.office);
  const expertiseScore = calculateExpertiseScore(judge, criteria.caseType);
  const rotationScore = calculateRotationScore(judge, allJudges);
  
  const totalScore =
    workloadScore * ASSIGNMENT_WEIGHTS.WORKLOAD +
    geographicScore * ASSIGNMENT_WEIGHTS.GEOGRAPHIC +
    expertiseScore * ASSIGNMENT_WEIGHTS.EXPERTISE +
    rotationScore * ASSIGNMENT_WEIGHTS.ROTATION;
  
  return Math.round(totalScore);
}

/**
 * Get top 3 suggested judges for case assignment
 */
export function getSuggestedJudges(
  judges: Judge[],
  criteria: AssignmentCriteria
): AssignmentSuggestion[] {
  // Calculate scores for all judges
  const scoredJudges = judges.map(judge => ({
    judge,
    score: calculateAssignmentScore(judge, criteria, judges),
    reasons: generateAssignmentReasons(judge, criteria, judges),
  }));
  
  // Sort by score (descending)
  scoredJudges.sort((a, b) => b.score - a.score);
  
  // Return top 3 with rank
  return scoredJudges.slice(0, 3).map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

/**
 * Generate human-readable reasons for suggestion
 */
function generateAssignmentReasons(
  judge: Judge,
  criteria: AssignmentCriteria,
  allJudges: Judge[]
): string[] {
  const reasons: string[] = [];
  
  // Workload reason
  const utilization = calculateWeightedLoad(judge, criteria.caseType);
  if (utilization < 60) {
    reasons.push(`Low workload (${Math.round(utilization)}% capacity)`);
  } else if (utilization < 80) {
    reasons.push(`Moderate workload (${Math.round(utilization)}% capacity)`);
  }
  
  // Geographic reason
  if (criteria.office && judge.office === criteria.office) {
    reasons.push(`Same office (${judge.office})`);
  }
  
  // Expertise reason
  if (judge.specialty.includes(criteria.caseType)) {
    reasons.push(`Specializes in ${criteria.caseType}`);
  }
  
  // Compliance reason
  if (judge.compliance270 >= 95) {
    reasons.push(`Excellent 270-day compliance (${judge.compliance270}%)`);
  }
  
  // Pending decisions reason
  if (judge.pendingDecisions < 3) {
    reasons.push(`Few pending decisions (${judge.pendingDecisions})`);
  }
  
  return reasons;
}

/**
 * Check if judge is overloaded
 */
export function isJudgeOverloaded(judge: Judge): boolean {
  const utilization = (judge.weightedLoad / judge.capacity) * 100;
  return utilization > 90;
}

/**
 * Check if judge is underutilized
 */
export function isJudgeUnderutilized(judge: Judge): boolean {
  const utilization = (judge.weightedLoad / judge.capacity) * 100;
  return utilization < 50;
}

/**
 * Get judge workload status
 */
export function getJudgeWorkloadStatus(judge: Judge): 'Underutilized' | 'Available' | 'Moderate' | 'Overloaded' {
  const utilization = (judge.weightedLoad / judge.capacity) * 100;
  
  if (utilization < 50) return 'Underutilized';
  if (utilization < 75) return 'Available';
  if (utilization < 90) return 'Moderate';
  return 'Overloaded';
}

/**
 * Calculate office-level statistics
 */
export function calculateOfficeStats(judges: Judge[]) {
  const totalJudges = judges.length;
  const avgUtilization = judges.reduce((sum, j) => sum + (j.weightedLoad / j.capacity) * 100, 0) / totalJudges;
  const totalActiveCases = judges.reduce((sum, j) => sum + j.activeCases, 0);
  const totalPendingDecisions = judges.reduce((sum, j) => sum + j.pendingDecisions, 0);
  const avgCompliance = judges.reduce((sum, j) => sum + j.compliance270, 0) / totalJudges;
  
  return {
    totalJudges,
    avgUtilization: Math.round(avgUtilization),
    totalActiveCases,
    totalPendingDecisions,
    avgCompliance: Math.round(avgCompliance),
    overloadedJudges: judges.filter(j => isJudgeOverloaded(j)).length,
    underutilizedJudges: judges.filter(j => isJudgeUnderutilized(j)).length,
  };
}
