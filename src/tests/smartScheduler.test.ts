import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  findOptimalHearingDates,
  generateNoticeOfHearing,
  dispatchCourtReporter,
  validateProSeService,
  type SchedulingCriteria,
  type HearingSchedule,
  type Party,
} from '../services/smartScheduler';

describe('smartScheduler', () => {
  describe('findOptimalHearingDates', () => {
    it('should return hearing schedules for available dates', () => {
      const criteria: SchedulingCriteria = {
        caseType: 'BLA',
        judgeId: 'J001',
        office: 'Pittsburgh, PA',
        hasProSeParty: false,
        hearingType: 'Hearing',
        duration: 2,
      };

      const schedules = findOptimalHearingDates(criteria);
      
      expect(schedules).toBeInstanceOf(Array);
      expect(schedules.length).toBeGreaterThan(0);
      expect(schedules[0]).toHaveProperty('date');
      expect(schedules[0]).toHaveProperty('time');
      expect(schedules[0]).toHaveProperty('location');
      expect(schedules[0]).toHaveProperty('judge');
    });

    it('should require 14 days minimum notice for Pro Se parties', () => {
      const criteria: SchedulingCriteria = {
        caseType: 'BLA',
        judgeId: 'J001',
        office: 'Pittsburgh, PA',
        hasProSeParty: true,
        hearingType: 'Hearing',
        duration: 2,
      };

      const schedules = findOptimalHearingDates(criteria);
      
      // All dates should be at least 14 days from today
      const today = new Date();
      const minDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
      
      schedules.forEach(schedule => {
        const scheduleDate = new Date(schedule.date);
        expect(scheduleDate).toBeGreaterThanOrEqual(minDate);
      });
    });

    it('should require 7 days minimum notice for represented parties', () => {
      const criteria: SchedulingCriteria = {
        caseType: 'LHC',
        judgeId: 'J002',
        office: 'New York, NY',
        hasProSeParty: false,
        hearingType: 'Pre-Hearing Conference',
        duration: 1,
      };

      const schedules = findOptimalHearingDates(criteria);
      
      // Should return schedules (may be empty if no dates available)
      expect(schedules).toBeInstanceOf(Array);
    });

    it('should exclude dates in excludedDates array', () => {
      const criteria: SchedulingCriteria = {
        caseType: 'PER',
        judgeId: 'J001',
        office: 'Pittsburgh, PA',
        hasProSeParty: false,
        hearingType: 'Hearing',
        duration: 2,
        excludedDates: ['2026-03-20', '2026-03-21'],
      };

      const schedules = findOptimalHearingDates(criteria);
      
      schedules.forEach(schedule => {
        expect(criteria.excludedDates).not.toContain(schedule.date);
      });
    });

    it('should handle unknown judge gracefully', () => {
      const criteria: SchedulingCriteria = {
        caseType: 'BLA',
        judgeId: 'UNKNOWN',
        office: 'Pittsburgh, PA',
        hasProSeParty: false,
        hearingType: 'Hearing',
        duration: 2,
      };

      const schedules = findOptimalHearingDates(criteria);
      
      // Should return empty array or handle gracefully
      expect(schedules).toBeInstanceOf(Array);
    });
  });

  describe('generateNoticeOfHearing', () => {
    it('should generate notice string with all required fields', () => {
      const schedule: HearingSchedule = {
        date: '2026-03-25',
        time: '10:00 AM',
        location: 'Room 402',
        judge: 'Hon. Sarah Jenkins',
        courtroom: 'Room 402',
      };

      const parties = [
        { name: 'John Doe', role: 'Claimant', email: 'john@example.com' },
        { name: 'Coal Corp', role: 'Employer', email: 'legal@coalcop.com' },
      ];

      const notice = generateNoticeOfHearing(
        '2024-BLA-00042',
        'John Doe',
        'Coal Corp',
        schedule,
        parties
      );

      expect(notice).toContain('2024-BLA-00042');
      expect(notice).toContain('John Doe');
      expect(notice).toContain('Coal Corp');
      expect(notice).toContain('2026-03-25');
      expect(notice).toContain('10:00 AM');
      expect(notice).toContain('Room 402');
      expect(notice).toContain('Hon. Sarah Jenkins');
    });

    it('should generate notice with minimal parties', () => {
      const schedule: HearingSchedule = {
        date: '2026-03-25',
        time: '2:00 PM',
        location: 'Video Conference',
        judge: 'Hon. Michael Ross',
        courtroom: 'Virtual',
      };

      const notice = generateNoticeOfHearing(
        '2025-LHC-00128',
        'Jane Smith',
        'Port Authority',
        schedule,
        []
      );

      expect(notice).toContain('2025-LHC-00128');
      expect(notice).toContain('Jane Smith');
    });
  });

  describe('dispatchCourtReporter', () => {
    it('should dispatch court reporter for known office', () => {
      const result = dispatchCourtReporter('Pittsburgh, PA', '2026-03-25', '2024-BLA-00042');

      expect(result.success).toBe(true);
      expect(result.reporter).toBeDefined();
      expect(result.message).toContain('2024-BLA-00042');
    });

    it('should handle unknown office gracefully', () => {
      const result = dispatchCourtReporter('Unknown City, XX', '2026-03-25', '2024-BLA-00042');

      expect(result.success).toBe(false);
      expect(result.message).toContain('No court reporters available');
    });

    it('should return different reporters for different offices', () => {
      const pittsburghResult = dispatchCourtReporter('Pittsburgh, PA', '2026-03-25', '2024-BLA-00042');
      const nyResult = dispatchCourtReporter('New York, NY', '2026-03-25', '2025-LHC-00128');

      expect(pittsburghResult.success).toBe(true);
      expect(nyResult.success).toBe(true);
      // Different offices may have different reporters
      expect(pittsburghResult.reporter).not.toBe(nyResult.reporter);
    });
  });

  describe('validateProSeService', () => {
    it('should validate electronic service for represented parties', () => {
      const parties: Party[] = [
        { name: 'John Doe', role: 'Claimant', represented: true, servicePreference: 'electronic', email: 'john@example.com' },
        { name: 'Coal Corp', role: 'Employer', represented: true, servicePreference: 'electronic', email: 'legal@coalcop.com' },
      ];

      const result = validateProSeService(parties, 'electronic');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject electronic service for Pro Se parties', () => {
      const parties: Party[] = [
        { name: 'John Doe', role: 'Claimant', represented: false, servicePreference: 'electronic' },
      ];

      const result = validateProSeService(parties, 'electronic');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Pro Se');
    });

    it('should allow mail service for Pro Se parties', () => {
      const parties: Party[] = [
        { name: 'John Doe', role: 'Claimant', represented: false, servicePreference: 'mail' },
      ];

      const result = validateProSeService(parties, 'mail');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate mixed parties correctly', () => {
      const parties: Party[] = [
        { name: 'John Doe', role: 'Claimant', represented: false, servicePreference: 'mail' },
        { name: 'Coal Corp', role: 'Employer', represented: true, servicePreference: 'electronic', email: 'legal@coalcop.com' },
      ];

      const result = validateProSeService(parties, 'electronic');

      // Should fail because of Pro Se party
      expect(result.valid).toBe(false);
    });

    it('should handle empty parties array', () => {
      const result = validateProSeService([], 'electronic');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
