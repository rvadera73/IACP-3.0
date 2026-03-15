/**
 * Smart Scheduler Service
 * 
 * Schedules hearings based on:
 * - Judge availability
 * - Courtroom availability
 * - Court reporter availability
 * - Party availability
 * - Minimum notice periods (14+ days for Pro Se)
 */

export interface HearingSchedule {
  date: string;
  time: string;
  location: string;
  judge: string;
  courtroom: string;
  courtReporter?: string;
  videoConference?: boolean;
}

export interface Availability {
  date: string;
  available: boolean;
  reason?: string;
}

export interface SchedulingCriteria {
  caseType: 'BLA' | 'LHC' | 'PER';
  judgeId: string;
  office: string;
  hasProSeParty: boolean;
  preferredDates?: string[];
  excludedDates?: string[];
  hearingType: 'Hearing' | 'Pre-Hearing Conference' | 'Status Conference';
  duration: number; // in hours
}

// Mock data for scheduling
const JUDGE_SCHEDULES: Record<string, Availability[]> = {
  'J001': [ // Hon. Sarah Jenkins
    { date: '2026-03-20', available: true },
    { date: '2026-03-21', available: false, reason: 'Hearing in another case' },
    { date: '2026-03-22', available: true },
    { date: '2026-03-25', available: true },
    { date: '2026-03-27', available: false, reason: 'Vacation' },
  ],
  'J002': [ // Hon. Michael Ross
    { date: '2026-03-20', available: false, reason: 'Conference' },
    { date: '2026-03-21', available: true },
    { date: '2026-03-22', available: true },
    { date: '2026-03-25', available: true },
  ],
};

const COURTROOMS: Record<string, string[]> = {
  'Pittsburgh, PA': ['Room 402', 'Room 405', 'Room 501'],
  'New York, NY': ['Room 301', 'Room 302'],
  'San Francisco, CA': ['Room 201', 'Room 202'],
  'Washington, DC': ['Room 101', 'Room 102', 'Room 103'],
};

const COURT_REPORTERS: Record<string, string[]> = {
  'Pittsburgh, PA': ['J. Smith', 'M. Johnson', 'R. Williams'],
  'New York, NY': ['A. Brown', 'K. Davis'],
  'San Francisco, CA': ['L. Miller', 'T. Wilson'],
  'Washington, DC': ['P. Moore', 'S. Taylor', 'D. Anderson'],
};

/**
 * Find optimal hearing dates
 */
export function findOptimalHearingDates(criteria: SchedulingCriteria): HearingSchedule[] {
  const schedules: HearingSchedule[] = [];
  const judgeAvailability = JUDGE_SCHEDULES[criteria.judgeId] || [];
  const courtrooms = COURTROOMS[criteria.office] || ['Room TBD'];
  const reporters = COURT_REPORTERS[criteria.office] || ['TBD'];
  
  // Calculate minimum notice period
  const today = new Date();
  const minNoticeDays = criteria.hasProSeParty ? 14 : 7;
  const minDate = new Date(today.getTime() + minNoticeDays * 24 * 60 * 60 * 1000);
  
  // Filter available dates
  const availableDates = judgeAvailability.filter(
    slot => {
      const slotDate = new Date(slot.date);
      return slot.available && 
             slotDate >= minDate &&
             !criteria.excludedDates?.includes(slot.date);
    }
  );
  
  // Generate schedules for top 3 available dates
  availableDates.slice(0, 3).forEach(slot => {
    schedules.push({
      date: slot.date,
      time: '10:00 AM',
      location: courtrooms[0],
      judge: getJudgeName(criteria.judgeId),
      courtroom: courtrooms[0],
      courtReporter: reporters[0],
      videoConference: false,
    });
  });
  
  return schedules;
}

/**
 * Get judge name from ID
 */
function getJudgeName(judgeId: string): string {
  const names: Record<string, string> = {
    'J001': 'Hon. Sarah Jenkins',
    'J002': 'Hon. Michael Ross',
    'J003': 'Hon. Patricia Chen',
    'J004': 'Hon. James Wilson',
  };
  return names[judgeId] || 'Judge TBD';
}

/**
 * Check if date is valid for scheduling
 */
export function isValidHearingDate(date: string, hasProSeParty: boolean): boolean {
  const today = new Date();
  const hearingDate = new Date(date);
  const daysDiff = (hearingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  
  const minDays = hasProSeParty ? 14 : 7;
  return daysDiff >= minDays;
}

/**
 * Generate Notice of Hearing
 */
export function generateNoticeOfHearing(
  caseNumber: string,
  claimant: string,
  employer: string,
  schedule: HearingSchedule,
  parties: Array<{ name: string; role: string; email: string; address?: string }>
): string {
  const notice = `NOTICE OF HEARING

United States Department of Labor
Office of Administrative Law Judges

Case Number: ${caseNumber}
Claimant: ${claimant}
Employer: ${employer}

NOTICE IS HEREBY GIVEN that a hearing in the above-captioned case will be held before an Administrative Law Judge on:

Date: ${schedule.date}
Time: ${schedule.time}
Location: ${schedule.location}
        ${schedule.courtroom}
        ${schedule.judge}

${schedule.videoConference ? 'VIDEO CONFERENCE: Instructions will be sent separately.' : 'IN-PERSON HEARING'}

PLEASE TAKE NOTICE that:
1. All parties must appear at the scheduled time.
2. Failure to appear may result in dismissal or default judgment.
3. If you have a disability requiring accommodation, contact the court reporter immediately.
4. Pro Se parties will receive this notice via certified mail.

Court Reporter: ${schedule.courtReporter || 'TBD'}

Issued: ${new Date().toLocaleDateString()}

Office of Administrative Law Judges
U.S. Department of Labor`;

  return notice;
}

/**
 * Dispatch court reporter request
 */
export function dispatchCourtReporter(
  office: string,
  date: string,
  caseNumber: string
): { success: boolean; reporter?: string; message: string } {
  const reporters = COURT_REPORTERS[office] || [];
  
  if (reporters.length === 0) {
    return {
      success: false,
      message: `No court reporters available in ${office}`,
    };
  }
  
  // Simple round-robin assignment (in production, would check actual availability)
  const reporterIndex = date.length % reporters.length;
  const reporter = reporters[reporterIndex];
  
  return {
    success: true,
    reporter,
    message: `Court reporter ${reporter} assigned to ${caseNumber} on ${date}`,
  };
}

/**
 * Validate service requirements for Pro Se parties
 */
export function validateProSeService(
  parties: Array<{ role: string; represented: boolean }>,
  serviceMethod: 'electronic' | 'mail'
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const proSeParties = parties.filter(p => !p.represented);
  
  proSeParties.forEach(party => {
    if (serviceMethod === 'electronic') {
      errors.push(`Pro Se party (${party.role}) requires physical mail service`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
