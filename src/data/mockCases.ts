/**
 * Comprehensive Mock Data for IACP Portal
 * Aligned with US Digital Workbook and WCAG 2.0 AA Standards
 * 
 * This file provides realistic test data for all case phases:
 * - Intake
 * - Assignment
 * - Pre-Hearing
 * - Hearing
 * - Decision
 * - Post-Decision
 */

import { Case } from '../types';

export const MOCK_CASES: Case[] = [
  // ==================== INTAKE PHASE ====================
  {
    id: '1',
    caseNumber: 'BLA-2024-01204',
    intakeId: 'int-1204',
    caseType: 'BLA',
    division: 'OALJ',
    status: 'Auto-Docketed',
    phase: 'Intake',
    channel: 'E-Filing',
    claimant: { name: 'Estate of R. Kowalski' },
    employer: { name: 'Pittsburgh Coal Co.', ein: '25-1234567' },
    createdAt: new Date().toISOString().split('T')[0],
    office: 'Pittsburgh, PA',
    statutoryDeadline: '2025-06-01',
    slaStatus: 'OK',
    filings: [
      { id: 'f1', intakeId: 'int-1204', description: 'Black Lung Claim - Auto-verified', type: 'Claim', category: 'Initial Filing', submittedBy: 'Estate of R. Kowalski', submittedAt: new Date().toISOString().split('T')[0], status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Estate of R. Kowalski', role: 'Claimant', organization: 'Self', email: 'kowalski.estate@email.com', addedAt: new Date().toISOString().split('T')[0] },
      { name: 'Pittsburgh Coal Co.', role: 'Employer', organization: 'Pittsburgh Coal', email: 'legal@pittsburghcoal.com', addedAt: new Date().toISOString().split('T')[0] }
    ]
  },
  {
    id: '2',
    caseNumber: 'LCA-2024-01305',
    intakeId: 'int-1305',
    caseType: 'LHC',
    division: 'OALJ',
    status: 'Pending Review',
    phase: 'Intake',
    channel: 'Mail',
    claimant: { name: 'Maria Santos' },
    employer: { name: 'Atlantic Dockworkers Inc.', ein: '33-5566778' },
    createdAt: '2024-02-28',
    office: 'New York',
    statutoryDeadline: '2024-11-28',
    slaStatus: 'OK',
    filings: [
      { id: 'f2', intakeId: 'int-1305', description: 'Initial Claim Form LS-203', type: 'Claim', category: 'Initial Filing', submittedBy: 'Maria Santos', submittedAt: '2024-02-28', status: 'Pending' }
    ],
    serviceList: [
      { name: 'Maria Santos', role: 'Claimant', organization: 'Self', email: 'm.santos@email.com', addedAt: '2024-02-28' }
    ]
  },
  {
    id: '3',
    caseNumber: 'DBA-2024-00892',
    intakeId: 'int-892',
    caseType: 'DBA',
    division: 'OALJ',
    status: 'Deficient',
    phase: 'Intake',
    channel: 'E-Filing',
    claimant: { name: 'Ahmed Hassan' },
    employer: { name: 'Global Defense Contractors', ein: '88-1122334' },
    createdAt: '2024-03-01',
    office: 'Washington, DC',
    statutoryDeadline: '2024-12-01',
    slaStatus: 'Warning',
    filings: [
      { id: 'f3', intakeId: 'int-892', description: 'DBA Claim Form', type: 'Claim', category: 'Initial Filing', submittedBy: 'Ahmed Hassan', submittedAt: '2024-03-01', status: 'Deficient', aiAnalysis: 'Missing employer EIN verification' }
    ],
    serviceList: [
      { name: 'Ahmed Hassan', role: 'Claimant', organization: 'Self', email: 'a.hassan@email.com', addedAt: '2024-03-01' }
    ]
  },

  // ==================== ASSIGNMENT PHASE ====================
  {
    id: '4',
    caseNumber: 'WB-2024-00445',
    intakeId: 'int-445',
    caseType: 'WB',
    division: 'OALJ',
    status: 'Awaiting Assignment',
    phase: 'Assignment',
    channel: 'E-Filing',
    claimant: { name: 'Jennifer Wu' },
    employer: { name: 'TechGlobal Industries', ein: '77-8899001' },
    createdAt: '2024-02-15',
    office: 'San Francisco, CA',
    statutoryDeadline: '2024-11-15',
    slaStatus: 'OK',
    filings: [
      { id: 'f4', intakeId: 'int-445', description: 'Whistleblower Complaint - SOX', type: 'Complaint', category: 'Initial Filing', submittedBy: 'Jennifer Wu', submittedAt: '2024-02-15', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Jennifer Wu', role: 'Complainant', organization: 'Self', email: 'j.wu@email.com', addedAt: '2024-02-15' },
      { name: 'TechGlobal Industries', role: 'Respondent', organization: 'TechGlobal', email: 'legal@techglobal.com', addedAt: '2024-02-16' }
    ]
  },
  {
    id: '5',
    caseNumber: 'LCA-2024-00556',
    intakeId: 'int-556',
    caseType: 'LHC',
    division: 'OALJ',
    status: 'Awaiting Assignment',
    phase: 'Assignment',
    channel: 'UFS',
    claimant: { name: 'Robert Jackson' },
    employer: { name: 'Coastal Marine Services', ein: '44-5566778' },
    createdAt: '2024-02-20',
    office: 'Newport News, VA',
    statutoryDeadline: '2024-11-20',
    slaStatus: 'OK',
    filings: [
      { id: 'f5', intakeId: 'int-556', description: 'Contested Claim - Hearing Requested', type: 'Claim', category: 'Initial Filing', submittedBy: 'Robert Jackson', submittedAt: '2024-02-20', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Robert Jackson', role: 'Claimant', organization: 'Self', email: 'r.jackson@email.com', addedAt: '2024-02-20' },
      { name: 'Coastal Marine Services', role: 'Employer', organization: 'Coastal Marine', email: 'claims@coastalmarine.com', addedAt: '2024-02-21' }
    ]
  },
  {
    id: '6',
    caseNumber: 'BLA-2024-00667',
    intakeId: 'int-667',
    caseType: 'BLA',
    division: 'OALJ',
    status: 'Awaiting Assignment',
    phase: 'Assignment',
    channel: 'Mail',
    claimant: { name: 'Estate of Thomas Miller' },
    employer: { name: 'Appalachian Coal Company', ein: '55-6677889' },
    createdAt: '2024-02-25',
    office: 'Cincinnati, OH',
    statutoryDeadline: '2024-11-25',
    slaStatus: 'OK',
    filings: [
      { id: 'f6', intakeId: 'int-667', description: 'Black Lung Claim with Medical Evidence', type: 'Claim', category: 'Initial Filing', submittedBy: 'Estate of Thomas Miller', submittedAt: '2024-02-25', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Estate of Thomas Miller', role: 'Claimant', organization: 'Self', email: 'miller.estate@email.com', addedAt: '2024-02-25' }
    ]
  },

  // ==================== PRE-HEARING PHASE ====================
  {
    id: '7',
    caseNumber: 'LCA-2024-00847',
    intakeId: 'int-847',
    caseType: 'LHC',
    division: 'OALJ',
    status: 'On Track',
    phase: 'Pre-Hearing',
    channel: 'UFS',
    claimant: { name: 'Chuck Patel' },
    employer: { name: 'Harbor Freight Inc.', ein: '33-4455667' },
    createdAt: '2024-03-14',
    office: 'New York',
    judge: 'Hon. Thompson',
    statutoryDeadline: '2024-12-14',
    slaStatus: 'OK',
    hearingDate: '2024-06-04',
    hearingFormat: 'Video',
    filings: [
      { id: 'f7', intakeId: 'int-847', description: 'Initial Claim - Longshore', type: 'Claim', category: 'Initial Filing', submittedBy: 'Chuck Patel', submittedAt: '2024-03-14', status: 'Accepted' },
      { id: 'f7b', intakeId: 'int-847', description: 'Motion to Compel Medical Records', type: 'Motion', category: 'Party Filing', submittedBy: 'Claimant', submittedAt: '2024-04-10', status: 'Pending' },
      { id: 'f7c', intakeId: 'int-847', description: 'Response to Motion', type: 'Response', category: 'Party Filing', submittedBy: 'Respondent', submittedAt: '2024-04-17', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Chuck Patel', role: 'Claimant', organization: 'Self', email: 'c.patel@email.com', addedAt: '2024-03-14' },
      { name: 'Harbor Freight Inc.', role: 'Respondent', organization: 'Harbor Freight', email: 'legal@harborfreight.com', addedAt: '2024-03-14' },
      { name: 'M. Thompson, Esq.', role: 'Claimant Counsel', organization: 'Legal Aid Society', email: 'mthompson@legalaid.org', addedAt: '2024-03-16' },
      { name: 'J. Wilson, Esq.', role: 'Respondent Counsel', organization: 'Wilson & Associates', email: 'jwilson@wilsonlaw.com', addedAt: '2024-03-18' }
    ],
    pendingActions: ['Ruling on Motion to Compel', 'Pre-Hearing Conference Scheduled']
  },
  {
    id: '8',
    caseNumber: 'PERM-2024-00334',
    intakeId: 'int-334',
    caseType: 'PER',
    division: 'OALJ',
    status: 'On Track',
    phase: 'Pre-Hearing',
    channel: 'UFS',
    claimant: { name: 'DataSystems Inc.' },
    employer: { name: 'DataSystems Inc.', ein: '55-6667778' },
    createdAt: '2024-04-02',
    office: 'Washington, DC',
    judge: 'BALCA Panel',
    statutoryDeadline: '2025-01-02',
    slaStatus: 'OK',
    hearingDate: '2024-07-15',
    hearingFormat: 'Record',
    filings: [
      { id: 'f8', intakeId: 'int-334', description: 'Petition for Review', type: 'Petition', category: 'Initial Filing', submittedBy: 'DataSystems Inc.', submittedAt: '2024-04-02', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'DataSystems Inc.', role: 'Petitioner', organization: 'DataSystems', email: 'legal@datasystems.com', addedAt: '2024-04-02' },
      { name: 'Department of Labor', role: 'Respondent', organization: 'DOL', email: 'dol.oflc@dol.gov', addedAt: '2024-04-03' }
    ],
    pendingActions: ['Briefing Schedule Set', 'Record Certification Pending']
  },
  {
    id: '9',
    caseNumber: 'WB-2024-00711',
    intakeId: 'int-711',
    caseType: 'WB',
    division: 'OALJ',
    status: 'Pending',
    phase: 'Pre-Hearing',
    channel: 'E-Filing',
    claimant: { name: 'Taylor' },
    employer: { name: 'Finance Corp', ein: '88-9990001' },
    createdAt: '2024-03-01',
    office: 'Washington, DC',
    judge: 'Hon. Kim',
    statutoryDeadline: '2024-12-01',
    slaStatus: 'Warning',
    hearingDate: '2024-06-06',
    hearingFormat: 'Hybrid',
    filings: [
      { id: 'f9', intakeId: 'int-711', description: 'Complaint - AIR21', type: 'Complaint', category: 'Initial Filing', submittedBy: 'Taylor', submittedAt: '2024-03-01', status: 'Accepted' },
      { id: 'f9b', intakeId: 'int-711', description: 'Motion for Summary Decision', type: 'Motion', category: 'Party Filing', submittedBy: 'Respondent', submittedAt: '2024-04-20', status: 'Pending' }
    ],
    serviceList: [
      { name: 'Taylor', role: 'Complainant', organization: 'Self', email: 'taylor@email.com', addedAt: '2024-03-01' },
      { name: 'Finance Corp', role: 'Respondent', organization: 'Finance Corp', email: 'legal@financecorp.com', addedAt: '2024-03-02' }
    ],
    pendingActions: ['Motion for Summary Decision Pending', 'Discovery Deadline: 2024-05-15']
  },
  {
    id: '10',
    caseNumber: 'BLA-2024-01044',
    intakeId: 'int-1044',
    caseType: 'BLA',
    division: 'OALJ',
    status: 'Pending',
    phase: 'Pre-Hearing',
    channel: 'Mail',
    claimant: { name: 'Anderson' },
    employer: { name: 'Mountain Coal', ein: '99-1112223' },
    createdAt: '2024-01-20',
    office: 'Pittsburgh, PA',
    judge: 'Hon. Thompson',
    statutoryDeadline: '2024-10-20',
    slaStatus: 'OK',
    hearingDate: '2024-06-10',
    hearingFormat: 'Video',
    filings: [
      { id: 'f10', intakeId: 'int-1044', description: 'Claim for Benefits', type: 'Claim', category: 'Initial Filing', submittedBy: 'Anderson', submittedAt: '2024-01-20', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Anderson', role: 'Claimant', organization: 'Self', email: 'anderson@email.com', addedAt: '2024-01-20' },
      { name: 'Mountain Coal', role: 'Employer', organization: 'Mountain Coal', email: 'legal@mountaincoal.com', addedAt: '2024-01-22' }
    ],
    pendingActions: ['Pre-Hearing Conference: 2024-05-20']
  },

  // ==================== HEARING PHASE ====================
  {
    id: '11',
    caseNumber: 'DBA-2024-00544',
    intakeId: 'int-544',
    caseType: 'DBA',
    division: 'OALJ',
    status: 'Scheduled',
    phase: 'Hearing',
    channel: 'Mail',
    claimant: { name: 'Chen' },
    employer: { name: 'Pacific Construction', ein: '33-4445556' },
    createdAt: '2024-01-05',
    office: 'Los Angeles, CA',
    judge: 'Hon. Rivera',
    statutoryDeadline: '2024-06-05',
    slaStatus: 'OK',
    hearingDate: '2024-06-05',
    hearingFormat: 'In-Person',
    filings: [
      { id: 'f11', intakeId: 'int-544', description: 'DBA Claim', type: 'Claim', category: 'Initial Filing', submittedBy: 'Chen', submittedAt: '2024-01-05', status: 'Accepted' },
      { id: 'f11b', intakeId: 'int-544', description: 'Pre-Hearing Statement', type: 'Statement', category: 'Party Filing', submittedBy: 'Claimant', submittedAt: '2024-05-01', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Chen', role: 'Claimant', organization: 'Self', email: 'chen@email.com', addedAt: '2024-01-05' },
      { name: 'Pacific Construction', role: 'Employer', organization: 'Pacific Construction', email: 'legal@pacificconstruct.com', addedAt: '2024-01-06' }
    ],
    pendingActions: ['Hearing Scheduled: June 5, 2024', 'Court Reporter Assigned']
  },
  {
    id: '12',
    caseNumber: 'LCA-2024-00678',
    intakeId: 'int-678',
    caseType: 'LHC',
    division: 'OALJ',
    status: 'Scheduled',
    phase: 'Hearing',
    channel: 'E-Filing',
    claimant: { name: 'Williams' },
    employer: { name: 'Atlantic Shipping', ein: '11-2223334' },
    createdAt: '2024-01-10',
    office: 'Baltimore, MD',
    judge: 'Hon. Martinez',
    statutoryDeadline: '2024-06-10',
    slaStatus: 'OK',
    hearingDate: '2024-06-08',
    hearingFormat: 'Video',
    filings: [
      { id: 'f12', intakeId: 'int-678', description: 'Contested Claim', type: 'Claim', category: 'Initial Filing', submittedBy: 'Williams', submittedAt: '2024-01-10', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Williams', role: 'Claimant', organization: 'Self', email: 'williams@email.com', addedAt: '2024-01-10' },
      { name: 'Atlantic Shipping', role: 'Employer', organization: 'Atlantic Shipping', email: 'claims@atlanticship.com', addedAt: '2024-01-11' }
    ],
    pendingActions: ['Hearing Scheduled: June 8, 2024', 'Interpreter Requested']
  },

  // ==================== DECISION PHASE ====================
  {
    id: '13',
    caseNumber: 'DBA-2024-00612',
    intakeId: 'int-612',
    caseType: 'DBA',
    division: 'OALJ',
    status: 'SLA Breach',
    phase: 'Decision',
    channel: 'Mail',
    claimant: { name: 'Chen' },
    employer: { name: 'Pacific Construction LLC', ein: '88-9876543' },
    createdAt: '2024-01-08',
    office: 'San Francisco, CA',
    judge: 'Hon. Rivera',
    statutoryDeadline: '2024-04-08',
    slaStatus: 'Overdue',
    hearingDate: '2024-03-15',
    hearingFormat: 'Video',
    filings: [
      { id: 'f13', intakeId: 'int-612', description: 'Post-Hearing Brief', type: 'Brief', category: 'Party Filing', submittedBy: 'Claimant', submittedAt: '2024-03-15', status: 'Accepted' },
      { id: 'f13b', intakeId: 'int-612', description: 'Respondent Brief', type: 'Brief', category: 'Party Filing', submittedBy: 'Respondent', submittedAt: '2024-03-29', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Chen', role: 'Claimant', organization: 'Self', email: 'chen@email.com', addedAt: '2024-01-08' },
      { name: 'Pacific Construction LLC', role: 'Employer', organization: 'Pacific Construction', email: 'legal@pacificconstruct.com', addedAt: '2024-01-08' }
    ],
    pendingActions: ['Decision Drafting In Progress', 'Clerk Review Pending'],
    chambersData: {
      assignedClerk: 'Sarah Wong',
      drafts: [
        { id: 'd1', version: 1, type: 'FDO', content: 'Initial draft', status: 'Draft', createdAt: '2024-05-01', createdBy: 'Sarah Wong' }
      ]
    }
  },
  {
    id: '14',
    caseNumber: 'LCA-2024-00723',
    intakeId: 'int-723',
    caseType: 'LHC',
    division: 'OALJ',
    status: 'Pending',
    phase: 'Decision',
    channel: 'UFS',
    claimant: { name: 'Williams' },
    employer: { name: 'Atlantic Shipping', ein: '11-2223334' },
    createdAt: '2024-01-15',
    office: 'Baltimore, MD',
    judge: 'Hon. Martinez',
    statutoryDeadline: '2024-06-15',
    slaStatus: 'Warning',
    hearingDate: '2024-04-10',
    hearingFormat: 'Video',
    filings: [
      { id: 'f14', intakeId: 'int-723', description: 'Post-Hearing Brief', type: 'Brief', category: 'Party Filing', submittedBy: 'Claimant', submittedAt: '2024-04-20', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Williams', role: 'Claimant', organization: 'Self', email: 'williams@email.com', addedAt: '2024-01-15' },
      { name: 'Atlantic Shipping', role: 'Employer', organization: 'Atlantic Shipping', email: 'claims@atlanticship.com', addedAt: '2024-01-16' }
    ],
    pendingActions: ['Awaiting Decision Draft'],
    chambersData: {
      assignedClerk: 'Michael Chen'
    }
  },
  {
    id: '15',
    caseNumber: 'BLA-2024-00987',
    intakeId: 'int-987',
    caseType: 'BLA',
    division: 'OALJ',
    status: 'Pending',
    phase: 'Decision',
    channel: 'E-Filing',
    claimant: { name: 'Estate of Johnson' },
    employer: { name: 'Deep Mine Corp', ein: '22-3334445' },
    createdAt: '2024-02-01',
    office: 'Pittsburgh, PA',
    judge: 'Hon. Chen',
    statutoryDeadline: '2024-07-01',
    slaStatus: 'OK',
    hearingDate: '2024-04-20',
    hearingFormat: 'Video',
    filings: [
      { id: 'f15', intakeId: 'int-987', description: 'Post-Hearing Brief', type: 'Brief', category: 'Party Filing', submittedBy: 'Claimant', submittedAt: '2024-05-01', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Estate of Johnson', role: 'Claimant', organization: 'Self', email: 'johnson.estate@email.com', addedAt: '2024-02-01' },
      { name: 'Deep Mine Corp', role: 'Employer', organization: 'Deep Mine', email: 'legal@deepmine.com', addedAt: '2024-02-02' }
    ],
    pendingActions: ['Decision Under Review'],
    chambersData: {
      assignedClerk: 'Jennifer Park',
      drafts: [
        { id: 'd2', version: 2, type: 'FDO', content: 'Revised draft', status: 'Ready for Review', createdAt: '2024-05-10', createdBy: 'Jennifer Park' }
      ]
    }
  },

  // ==================== POST-DECISION PHASE ====================
  {
    id: '16',
    caseNumber: 'LCA-2024-00901',
    intakeId: 'int-901',
    caseType: 'LHC',
    division: 'OALJ',
    status: 'Appealed',
    phase: 'Post-Decision',
    channel: 'UFS',
    claimant: { name: 'Okafor' },
    employer: { name: 'Meridian Shipping Co.', ein: '44-3332221' },
    createdAt: '2023-11-03',
    office: 'Baltimore, MD',
    judge: 'Hon. Park',
    statutoryDeadline: '2024-08-03',
    slaStatus: 'Warning',
    hearingDate: '2024-02-15',
    hearingFormat: 'Video',
    filings: [
      { id: 'f16', intakeId: 'int-901', description: 'Decision and Order', type: 'Decision', category: 'Judicial Order', submittedBy: 'Hon. Park', submittedAt: '2024-03-01', status: 'Accepted' },
      { id: 'f16b', intakeId: 'int-901', description: 'Notice of Appeal to BRB', type: 'Appeal', category: 'Appellate Filing', submittedBy: 'Respondent', submittedAt: '2024-03-25', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Okafor', role: 'Claimant', organization: 'Self', email: 'okafor@email.com', addedAt: '2023-11-03' },
      { name: 'Meridian Shipping Co.', role: 'Employer', organization: 'Meridian Shipping', email: 'legal@meridianship.com', addedAt: '2023-11-03' }
    ],
    appealData: {
      originalCaseNumber: 'LCA-2024-00901',
      dateOfDecisionBelow: '2024-03-01',
      appealingParty: 'Respondent',
      basisForAppeal: 'Error of law in causation analysis'
    }
  },
  {
    id: '17',
    caseNumber: 'LCA-2024-00831',
    intakeId: 'int-831',
    caseType: 'LHC',
    division: 'OALJ',
    status: 'Decided',
    phase: 'Post-Decision',
    channel: 'E-Filing',
    claimant: { name: 'Rodriguez' },
    employer: { name: 'Harbor Logistics', ein: '66-7778889' },
    createdAt: '2024-02-10',
    office: 'New York',
    judge: 'Hon. Martinez',
    statutoryDeadline: '2024-11-10',
    slaStatus: 'OK',
    hearingDate: '2024-04-05',
    hearingFormat: 'Video',
    filings: [
      { id: 'f17', intakeId: 'int-831', description: 'Decision and Order Awarding Benefits', type: 'Decision', category: 'Judicial Order', submittedBy: 'Hon. Martinez', submittedAt: '2024-05-15', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Rodriguez', role: 'Claimant', organization: 'Self', email: 'rodriguez@email.com', addedAt: '2024-02-10' },
      { name: 'Harbor Logistics', role: 'Employer', organization: 'Harbor Logistics', email: 'legal@harborlogistics.com', addedAt: '2024-02-10' }
    ]
  },
  {
    id: '18',
    caseNumber: 'ARB-BLA-2024-00234',
    intakeId: 'int-234-arb',
    caseType: 'BLA',
    appealType: 'ARB',
    division: 'ARB',
    status: 'Briefing',
    phase: 'Post-Decision',
    channel: 'E-Filing',
    claimant: { name: 'Samuel Gray' },
    employer: { name: 'Eastern Coal Operators', ein: '66-7788990' },
    createdAt: '2024-01-15',
    office: 'Washington, DC',
    judge: 'ARB Panel A',
    statutoryDeadline: '2024-07-15',
    slaStatus: 'OK',
    originalCaseNumber: 'BLA-2024-00234',
    filings: [
      { id: 'f18', intakeId: 'int-234-arb', description: 'Petition for Review', type: 'Appeal', category: 'Appellate Filing', submittedBy: 'Claimant', submittedAt: '2024-01-15', status: 'Accepted' },
      { id: 'f18b', intakeId: 'int-234-arb', description: 'Petitioner Brief', type: 'Brief', category: 'Party Filing', submittedBy: 'Claimant', submittedAt: '2024-03-01', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Samuel Gray', role: 'Petitioner', organization: 'Self', email: 's.gray@email.com', addedAt: '2024-01-15' },
      { name: 'Eastern Coal Operators', role: 'Respondent', organization: 'Eastern Coal', email: 'legal@easterncoal.com', addedAt: '2024-01-16' },
      { name: 'Director, OWCP', role: 'Party-in-Interest', organization: 'DOL', email: 'owcp@dol.gov', addedAt: '2024-01-17' }
    ],
    appealData: {
      originalCaseNumber: 'BLA-2024-00234',
      dateOfDecisionBelow: '2023-12-15',
      appealingParty: 'Claimant',
      basisForAppeal: 'Unsupported credibility findings',
      briefingSchedule: {
        acknowledgmentDate: '2024-01-25',
        petitionerBriefDue: '2024-03-01',
        respondentBriefDue: '2024-04-01',
        replyBriefDue: '2024-04-15',
        petitionerFiledAt: '2024-03-01'
      }
    },
    pendingActions: ['Respondent Brief Due: 2024-04-01']
  },
  {
    id: '19',
    caseNumber: 'BRB-WB-2024-00123',
    intakeId: 'int-123-brb',
    caseType: 'WB',
    appealType: 'BRB',
    division: 'BRB',
    status: 'Decided',
    phase: 'Post-Decision',
    channel: 'E-Filing',
    claimant: { name: 'Lisa Chen' },
    employer: { name: 'National Airlines', ein: '88-9900112' },
    createdAt: '2023-10-01',
    office: 'Washington, DC',
    judge: 'BRB Panel C',
    statutoryDeadline: '2024-04-01',
    slaStatus: 'OK',
    originalCaseNumber: 'WB-2024-00123',
    filings: [
      { id: 'f19', intakeId: 'int-123-brb', description: 'Decision and Order Affirming ALJ', type: 'Decision', category: 'Appellate Decision', submittedBy: 'BRB Panel C', submittedAt: '2024-03-15', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Lisa Chen', role: 'Petitioner', organization: 'Self', email: 'l.chen@email.com', addedAt: '2023-10-01' },
      { name: 'National Airlines', role: 'Respondent', organization: 'National Airlines', email: 'legal@nationalair.com', addedAt: '2023-10-02' }
    ],
    appealData: {
      originalCaseNumber: 'WB-2024-00123',
      dateOfDecisionBelow: '2023-09-01',
      appealingParty: 'Respondent',
      basisForAppeal: 'Insufficient evidence of protected activity',
      disposition: 'Affirmed'
    }
  },
  {
    id: '20',
    caseNumber: 'REM-2024-00456',
    intakeId: 'int-456-rem',
    caseType: 'LHC',
    division: 'OALJ',
    status: 'Remanded',
    phase: 'Post-Decision',
    channel: 'UFS',
    claimant: { name: 'Marcus Johnson' },
    employer: { name: 'Coastal Stevedoring', ein: '55-6677880' },
    createdAt: '2023-06-15',
    office: 'Norfolk, VA',
    judge: 'Hon. Thompson',
    statutoryDeadline: '2024-06-15',
    slaStatus: 'Warning',
    filings: [
      { id: 'f20', intakeId: 'int-456-rem', description: 'Remand Order from BRB', type: 'Order', category: 'Appellate Order', submittedBy: 'BRB', submittedAt: '2024-02-01', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Marcus Johnson', role: 'Claimant', organization: 'Self', email: 'm.johnson@email.com', addedAt: '2023-06-15' },
      { name: 'Coastal Stevedoring', role: 'Employer', organization: 'Coastal Stevedoring', email: 'legal@coastalsteve.com', addedAt: '2023-06-16' }
    ],
    appealData: {
      originalCaseNumber: 'LCA-2023-00789',
      dateOfDecisionBelow: '2023-08-15',
      appealingParty: 'Claimant',
      basisForAppeal: 'Inadequate medical analysis',
      disposition: 'Remanded'
    },
    pendingActions: ['Supplemental Hearing Required', 'New Medical Evaluation']
  },

  // ==================== ADDITIONAL ARB/BRB/ECAB APPEALS ====================
  // ARB/BRB/ECAB cases use nomenclature: BOARD-CASETYPE-YYYY-NNNNN
  // Appellate lifecycle statuses: Pending, Briefing, Oral Argument, Under Consideration, Decided
  {
    id: '20b',
    caseNumber: 'BRB-DBA-2024-00789',
    intakeId: 'int-789-brb',
    caseType: 'DBA',
    appealType: 'BRB',
    division: 'BRB',
    status: 'Briefing',
    phase: 'Post-Decision',
    channel: 'E-Filing',
    claimant: { name: 'Patricia Moore' },
    employer: { name: 'Overseas Construction Ltd.', ein: '99-8877665' },
    createdAt: '2024-02-01',
    office: 'Washington, DC',
    judge: 'BRB Panel B',
    statutoryDeadline: '2024-08-01',
    slaStatus: 'OK',
    originalCaseNumber: 'DBA-2024-00789',
    filings: [
      { id: 'f20b', intakeId: 'int-789-brb', description: 'Petition for Review', type: 'Appeal', category: 'Appellate Filing', submittedBy: 'Claimant', submittedAt: '2024-02-01', status: 'Accepted' },
      { id: 'f20c', intakeId: 'int-789-brb', description: 'Petitioner Brief', type: 'Brief', category: 'Party Filing', submittedBy: 'Claimant', submittedAt: '2024-04-01', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Patricia Moore', role: 'Petitioner', organization: 'Self', email: 'p.moore@email.com', addedAt: '2024-02-01' },
      { name: 'Overseas Construction Ltd.', role: 'Respondent', organization: 'Overseas Construction', email: 'legal@overseasconstruct.com', addedAt: '2024-02-02' }
    ],
    appealData: {
      originalCaseNumber: 'DBA-2024-00789',
      dateOfDecisionBelow: '2024-01-15',
      appealingParty: 'Claimant',
      basisForAppeal: 'Error in impairment rating calculation',
      briefingSchedule: {
        acknowledgmentDate: '2024-02-15',
        petitionerBriefDue: '2024-04-01',
        respondentBriefDue: '2024-05-01',
        replyBriefDue: '2024-05-15',
        petitionerFiledAt: '2024-04-01'
      }
    },
    pendingActions: ['Respondent Brief Due: 2024-05-01']
  },
  {
    id: '20c',
    caseNumber: 'ARB-LCA-2024-00321',
    intakeId: 'int-321-arb',
    caseType: 'LHC',
    appealType: 'ARB',
    division: 'ARB',
    status: 'Pending',
    phase: 'Post-Decision',
    channel: 'UFS',
    claimant: { name: 'James Robinson' },
    employer: { name: 'Maritime Services Inc.', ein: '77-6655443' },
    createdAt: '2024-03-15',
    office: 'Washington, DC',
    judge: 'ARB Panel C',
    statutoryDeadline: '2024-09-15',
    slaStatus: 'OK',
    originalCaseNumber: 'LCA-2024-00321',
    filings: [
      { id: 'f20d', intakeId: 'int-321-arb', description: 'Petition for Review', type: 'Appeal', category: 'Appellate Filing', submittedBy: 'Respondent', submittedAt: '2024-03-15', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'James Robinson', role: 'Petitioner', organization: 'Self', email: 'j.robinson@email.com', addedAt: '2024-03-15' },
      { name: 'Maritime Services Inc.', role: 'Respondent', organization: 'Maritime Services', email: 'legal@maritimeservices.com', addedAt: '2024-03-16' }
    ],
    appealData: {
      originalCaseNumber: 'LCA-2024-00321',
      dateOfDecisionBelow: '2024-02-28',
      appealingParty: 'Respondent',
      basisForAppeal: 'Unsupported credibility determinations',
      briefingSchedule: {
        acknowledgmentDate: '2024-03-25',
        petitionerBriefDue: '2024-05-15',
        respondentBriefDue: '2024-06-15'
      }
    },
    pendingActions: ['Acknowledgment Letter Sent', 'Petitioner Brief Due: 2024-05-15']
  },
  {
    id: '20d',
    caseNumber: 'ECAB-FECA-2024-00156',
    intakeId: 'int-156-ecab',
    caseType: 'FECA',
    appealType: 'ECAB',
    division: 'ECAB',
    status: 'Under Consideration',
    phase: 'Post-Decision',
    channel: 'E-Filing',
    claimant: { name: 'Dorothy Williams' },
    employer: { name: 'US Postal Service', ein: '11-0000001' },
    createdAt: '2024-04-01',
    office: 'Washington, DC',
    judge: 'ECAB Panel A',
    statutoryDeadline: '2024-10-01',
    slaStatus: 'OK',
    originalCaseNumber: 'FECA-2024-00156',
    filings: [
      { id: 'f20e', intakeId: 'int-156-ecab', description: 'Appeal from OWCP Decision', type: 'Appeal', category: 'Appellate Filing', submittedBy: 'Claimant', submittedAt: '2024-04-01', status: 'Accepted' },
      { id: 'f20f', intakeId: 'int-156-ecab', description: 'Claimant Brief', type: 'Brief', category: 'Party Filing', submittedBy: 'Claimant', submittedAt: '2024-06-01', status: 'Accepted' },
      { id: 'f20g', intakeId: 'int-156-ecab', description: 'OWCP Response Brief', type: 'Brief', category: 'Agency Filing', submittedBy: 'OWCP', submittedAt: '2024-07-01', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Dorothy Williams', role: 'Claimant', organization: 'Self', email: 'd.williams@email.com', addedAt: '2024-04-01' },
      { name: 'US Postal Service', role: 'Employer', organization: 'USPS', email: 'labor.relations@usps.gov', addedAt: '2024-04-02' },
      { name: 'OWCP', role: 'Agency', organization: 'DOL-OWCP', email: 'owcp@dol.gov', addedAt: '2024-04-02' }
    ],
    appealData: {
      originalCaseNumber: 'FECA-2024-00156',
      dateOfDecisionBelow: '2024-03-01',
      appealingParty: 'Claimant',
      basisForAppeal: 'Error in causation analysis for occupational disease',
      briefingSchedule: {
        petitionerBriefDue: '2024-06-01',
        respondentBriefDue: '2024-07-01',
        petitionerFiledAt: '2024-06-01',
        respondentFiledAt: '2024-07-01'
      }
    },
    pendingActions: ['Under Panel Consideration', 'Decision Expected: September 2024']
  },
  {
    id: '20e',
    caseNumber: 'BRB-LCA-2024-00445',
    intakeId: 'int-445-brb',
    caseType: 'LHC',
    appealType: 'BRB',
    division: 'BRB',
    status: 'Oral Argument Scheduled',
    phase: 'Post-Decision',
    channel: 'UFS',
    claimant: { name: 'Robert Hayes' },
    employer: { name: 'General Dynamics Corp.', ein: '55-4433221' },
    createdAt: '2023-12-01',
    office: 'Washington, DC',
    judge: 'BRB Panel A',
    statutoryDeadline: '2024-06-01',
    slaStatus: 'OK',
    originalCaseNumber: 'LCA-2024-00445',
    hearingDate: '2024-09-15',
    hearingFormat: 'Video',
    filings: [
      { id: 'f20h', intakeId: 'int-445-brb', description: 'Petition for Review', type: 'Appeal', category: 'Appellate Filing', submittedBy: 'Claimant', submittedAt: '2023-12-01', status: 'Accepted' },
      { id: 'f20i', intakeId: 'int-445-brb', description: 'Petitioner Brief', type: 'Brief', category: 'Party Filing', submittedBy: 'Claimant', submittedAt: '2024-02-01', status: 'Accepted' },
      { id: 'f20j', intakeId: 'int-445-brb', description: 'Respondent Brief', type: 'Brief', category: 'Party Filing', submittedBy: 'Respondent', submittedAt: '2024-03-01', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Robert Hayes', role: 'Petitioner', organization: 'Self', email: 'r.hayes@email.com', addedAt: '2023-12-01' },
      { name: 'General Dynamics Corp.', role: 'Respondent', organization: 'General Dynamics', email: 'legal@gencorp.com', addedAt: '2023-12-02' }
    ],
    appealData: {
      originalCaseNumber: 'LCA-2024-00445',
      dateOfDecisionBelow: '2023-11-15',
      appealingParty: 'Claimant',
      basisForAppeal: 'Error in substantial evidence standard application'
    },
    pendingActions: ['Oral Argument Scheduled: September 15, 2024']
  },
  {
    id: '20f',
    caseNumber: 'ARB-WB-2023-00892',
    intakeId: 'int-892-arb',
    caseType: 'WB',
    appealType: 'ARB',
    division: 'ARB',
    status: 'Decided',
    phase: 'Post-Decision',
    channel: 'E-Filing',
    claimant: { name: 'Michelle Torres' },
    employer: { name: 'AeroSpace Industries', ein: '88-7766554' },
    createdAt: '2023-08-15',
    office: 'Washington, DC',
    judge: 'ARB Panel B',
    statutoryDeadline: '2024-02-15',
    slaStatus: 'OK',
    originalCaseNumber: 'WB-2023-00892',
    filings: [
      { id: 'f20k', intakeId: 'int-892-arb', description: 'Decision and Order', type: 'Decision', category: 'Appellate Decision', submittedBy: 'ARB Panel B', submittedAt: '2024-01-15', status: 'Accepted' }
    ],
    serviceList: [
      { name: 'Michelle Torres', role: 'Petitioner', organization: 'Self', email: 'm.torres@email.com', addedAt: '2023-08-15' },
      { name: 'AeroSpace Industries', role: 'Respondent', organization: 'AeroSpace', email: 'legal@aerospace.com', addedAt: '2023-08-16' }
    ],
    appealData: {
      originalCaseNumber: 'WB-2023-00892',
      dateOfDecisionBelow: '2023-07-30',
      appealingParty: 'Respondent',
      basisForAppeal: 'Protected activity determination',
      disposition: 'Affirmed'
    }
  },

  // ==================== ATTORNEY FEES CASES ====================
  {
    id: '21',
    caseNumber: 'LCA-2024-00847-FEE',
    intakeId: 'int-847-fee',
    caseType: 'LHC',
    division: 'OALJ',
    status: 'Pending',
    phase: 'Post-Decision',
    channel: 'E-Filing',
    claimant: { name: 'Chuck Patel' },
    employer: { name: 'Harbor Freight Inc.', ein: '33-4455667' },
    createdAt: '2024-05-01',
    office: 'New York',
    judge: 'Hon. Thompson',
    statutoryDeadline: '2024-08-01',
    slaStatus: 'OK',
    filings: [
      { id: 'f21', intakeId: 'int-847-fee', description: 'Application for Attorney Fees', type: 'Fee Application', category: 'Fee Request', submittedBy: 'M. Thompson, Esq.', submittedAt: '2024-05-01', status: 'Pending' }
    ],
    serviceList: [
      { name: 'Chuck Patel', role: 'Claimant', organization: 'Self', email: 'c.patel@email.com', addedAt: '2024-03-14' },
      { name: 'Harbor Freight Inc.', role: 'Employer', organization: 'Harbor Freight', email: 'legal@harborfreight.com', addedAt: '2024-03-14' },
      { name: 'M. Thompson, Esq.', role: 'Claimant Counsel', organization: 'Legal Aid Society', email: 'mthompson@legalaid.org', addedAt: '2024-03-16' }
    ],
    pendingActions: ['Fee Application Under Review', 'Response Due: 2024-05-20']
  }
];

export default MOCK_CASES;
