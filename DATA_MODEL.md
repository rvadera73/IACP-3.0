# IACP Data Model Specification
## Department of Labor - Office of Administrative Law Judges

**Version:** 1.0  
**Date:** March 22, 2026  
**Reference:** US Tax Court EFS Data Model (ustaxcourt/ef-cms)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Design Principles](#2-design-principles)
3. [Entity Relationship Diagram](#3-entity-relationship-diagram)
4. [Core Entities](#4-core-entities)
5. [User & Authentication](#5-user--authentication)
6. [Case Management](#6-case-management)
7. [Document Management](#7-document-management)
8. [Docket & Filings](#8-docket--filings)
9. [Programs & Workflows](#9-programs--workflows)
10. [Analytics & Reporting](#10-analytics--reporting)
11. [System Entities](#11-system-entities)
12. [Data Dictionary](#12-data-dictionary)
13. [DynamoDB Schema Design](#13-dynamodb-schema-design)
14. [Validation Rules](#14-validation-rules)

---

## 1. Overview

### 1.1 Purpose

This document defines the complete data model for the Intelligent Adjudicatory Case Portal (IACP), adapted from the US Tax Court EFS system and tailored for DOL OALJ adjudication processes.

### 1.2 Database Technology

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Primary Database** | DynamoDB | Serverless, auto-scaling, single-digit ms latency |
| **Document Storage** | S3 | Durable, versioned, lifecycle policies |
| **Search Index** | Elasticsearch | Full-text search, faceted navigation |
| **Cache** | Redis (ElastiCache) | Session management, query caching |

### 1.3 Design Approach

**Single-Table Design (DynamoDB):**
- All entities in one table with composite keys
- Partition key: `pk` (primary key)
- Sort key: `sk` (sort key)
- GSIs for alternative query patterns

**Naming Conventions:**
- Entities: PascalCase (e.g., `Case`, `DocketEntry`)
- Attributes: camelCase (e.g., `caseId`, `filingDate`)
- Keys: `pk`, `sk`, `GSI1PK`, `GSI1SK`, etc.

---

## 2. Design Principles

### 2.1 Access Pattern Design

```
Query Pattern 1: Get Case by ID
pk: CASE#{caseId}
sk: METADATA

Query Pattern 2: Get All Cases for Program
GSI1PK: PROGRAM#{programId}
GSI1SK: CASE#{caseId}

Query Pattern 3: Get Cases by Status
GSI2PK: STATUS#{status}
GSI2SK: FILED_DATE#{filingDate}

Query Pattern 4: Get User's Cases
GSI3PK: USER#{userId}
GSI3SK: ROLE#{role}#CASE#{caseId}
```

### 2.2 Entity Relationships

```
User (1) ────── (N) CaseParticipant
User (1) ────── (N) DocketEntry (as filer)
User (1) ────── (N) Document (as uploader)

Case (1) ────── (N) DocketEntry
Case (1) ────── (N) Document
Case (1) ────── (N) Party
Case (1) ────── (1) Decision
Case (1) ────── (N) Hearing

Party (1) ────── (N) Representation
Party (1) ────── (1) User (if registered)

Document (1) ── (N) DocumentVersion
Document (1) ── (1) S3Object

Program (1) ─── (N) Case
Program (1) ─── (N) User (by expertise)
```

### 2.3 Data Isolation

| Isolation Level | Implementation |
|-----------------|----------------|
| **Program Isolation** | OALJ (BLA/LHC/PER) vs. Boards (BRB/ARB/ECAB) |
| **Case Access** | Party-based access control |
| **Document Sealing** | Sealed flag + access control |
| **User Roles** | RBAC with attribute-based overrides |

---

## 3. Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           IACP Data Model                                   │
│                                                                             │
│  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐        │
│  │    User      │         │   Program    │         │ Organization │        │
│  │──────────────│         │──────────────│         │──────────────│        │
│  │ userId (PK)  │         │ programId    │         │ orgId (PK)   │        │
│  │ email        │◄────┐   │ code         │         │ name         │        │
│  │ role         │     │   │ name         │         │ type         │        │
│  │ barId        │     │   │ division     │         │ address      │        │
│  │ orgId (FK)   │     │   └──────┬───────┘         │ EIN          │        │
│  └──────────────┘     │          │                 └──────────────┘        │
│         │             │          │ 1:N                                     │
│         │ 1:N         │          ▼                                         │
│         │             │   ┌──────────────┐                                │
│         │             └──►│     Case     │◄──────────────────────┐        │
│         │   ┌─────────────│──────────────│────────────────────┐   │        │
│         │   │             │ caseId (PK)  │                    │   │        │
│         │   │             │ programId    │                    │   │        │
│         │   │             │ caseNumber   │                    │   │        │
│         │   │             │ title        │                    │   │        │
│         │   │             │ filingDate   │                    │   │        │
│         │   │             │ status       │                    │   │        │
│         │   │             │ judgeId      │                    │   │        │
│         │   │             │ docketClerkId│                    │   │        │
│         │   │             └──────────────┘                    │   │        │
│         │   │                    │                            │   │        │
│         │   │         ┌──────────┼──────────┐                │   │        │
│         │   │         │          │          │                │   │        │
│         │   │         ▼          ▼          ▼                │   │        │
│         │   │  ┌──────────┐ ┌──────────┐ ┌──────────┐       │   │        │
│         │   │  │ Docket   │ │ Filing   │ │ Decision │       │   │        │
│         │   │  │  Entry   │ │          │ │          │       │   │        │
│         │   │  │──────────│ │──────────│ │──────────│       │   │        │
│         │   │  │ entryId  │ │ filingId │ │decisionId│       │   │        │
│         │   │  │ entryNum │ │ type     │ │ judgeId  │       │   │        │
│         │   │  │ text     │ │ docId    │ │ text     │       │   │        │
│         │   │  │ filedBy  │ │ isSealed │ │ type     │       │   │        │
│         │   │  └──────────┘ └──────────┘ └──────────┘       │   │        │
│         │   │         │          │                          │   │        │
│         │   │         │          │                          │   │        │
│         │   │         │          ▼                          │   │        │
│         │   │         │   ┌──────────────┐                  │   │        │
│         │   │         │   │   Document   │◄─────────────────┘   │        │
│         │   │         │   │──────────────│                      │        │
│         │   │         │   │ documentId   │                      │        │
│         │   │         │   │ caseId       │                      │        │
│         │   │         │   │ s3Key        │                      │        │
│         │   │         │   │ fileName     │                      │        │
│         │   │         │   │ mimeType     │                      │        │
│         │   │         │   │ isExhibit    │                      │        │
│         │   │         │   └──────────────┘                      │        │
│         │   │         │          │                              │        │
│         │   │         │          ▼                              │        │
│         │   │         │   ┌──────────────┐                      │        │
│         │   │         │   │  Document    │                      │        │
│         │   │         │   │  Version     │                      │        │
│         │   │         │   │──────────────│                      │        │
│         │   │         │   │ versionId    │                      │        │
│         │   │         │   │ s3Key        │                      │        │
│         │   │         │   │ versionNum   │                      │        │
│         │   │         │   └──────────────┘                      │        │
│         │   │         │                                          │        │
│         │   │         ▼                                          │        │
│         │   │  ┌──────────────┐         ┌──────────────┐        │        │
│         │   │  │    Party     │────────►│Representation │        │        │
│         │   │  │──────────────│         │──────────────│        │        │
│         │   │  │ partyId      │         │ repId        │        │        │
│         │   │  │ partyType    │         │ attorneyId   │        │        │
│         │   │  │ name         │         │ partyId      │        │        │
│         │   │  │ isProSe      │         │ startDate    │        │        │
│         │   │  └──────────────┘         │ endDate      │        │        │
│         │   │                           └──────────────┘        │        │
│         │   │                                                    │        │
│         │   ▼                                                    │        │
│         │  ┌──────────────┐         ┌──────────────┐            │        │
│         └─►│  Service     │────────►│  Service     │            │        │
│            │  Record      │         │  Proof       │            │        │
│            │──────────────│         │──────────────│            │        │
│            │ servedTo     │         │ method       │            │        │
│            │ servedDate   │         │ date         │            │        │
│            │ documentId   │         │ signer       │            │        │
│            └──────────────┘         └──────────────┘            │        │
│                                                                    │        │
│         ┌──────────────────────────────────────────────────────┐  │        │
│         │                   Workflow Entities                   │  │        │
│         │                                                       │  │        │
│         │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │        │
│         │  │ Hearing  │  │  Order   │  │  Notice  │           │  │        │
│         │  │──────────│  │──────────│  │──────────│           │  │        │
│         │  │ hearingId│  │ orderId  │  │noticeId  │           │  │        │
│         │  │ caseId   │  │ caseId   │  │ caseId   │           │  │        │
│         │  │ date     │  │ type     │  │ type     │           │  │        │
│         │  │ location │  │ text     │  │ text     │           │  │        │
│         │  └──────────┘  └──────────┘  └──────────┘           │  │        │
│         └──────────────────────────────────────────────────────┘  │        │
│                                                                    │        │
│         ┌──────────────────────────────────────────────────────┐  │        │
│         │                  System Entities                      │  │        │
│         │                                                       │  │        │
│         │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │        │
│         │  │   Audit  │  │  System  │  │  Config  │           │  │        │
│         │  │   Log    │  │  Config  │  │  Setting │           │  │        │
│         │  │──────────│  │──────────│  │──────────│           │  │        │
│         │  │ logId    │  │ configId │  │ settingId│           │  │        │
│         │  │ userId   │  │ key      │  │ key      │           │  │        │
│         │  │ action   │  │ value    │  │ value    │           │  │        │
│         │  │ timestamp│  │ scope    │  │ scope    │           │  │        │
│         │  └──────────┘  └──────────┘  └──────────┘           │  │        │
│         └──────────────────────────────────────────────────────┘  │        │
│                                                                    │        │
└────────────────────────────────────────────────────────────────────┴────────┘
```

---

## 4. Core Entities

### 4.1 User

Represents all system users (internal staff, external attorneys, pro se parties).

```typescript
interface User {
  // Keys
  userId: string;                    // UUID v4
  email: string;                     // Unique, indexed
  
  // Profile
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  phone?: string;
  
  // Authentication
  role: UserRole;                    // Enum: see User Roles
  barId?: string;                    // State bar number (attorneys)
  admittedDate?: string;             // ISO 8601 date
  organizationId?: string;           // FK to Organization
  isActive: boolean;
  mfaEnabled: boolean;
  
  // OALJ Specific
  judgeAssignment?: {
    programs: ProgramCode[];         // BLA, LHC, PER
    geographicExpertise?: string[];  // States/regions
    maxWorkload: number;             // Max concurrent cases
  };
  
  // Boards Specific
  boardAssignment?: {
    boards: BoardCode[];             // BRB, ARB, ECAB
    panelMember?: boolean;
  };
  
  // Contact
  mailingAddress: Address;
  serviceAddress?: Address;          // If different
  
  // Metadata
  createdAt: string;                 // ISO 8601 datetime
  updatedAt: string;
  lastLoginAt?: string;
  createdBy: string;                 // userId of creator
  
  // DynamoDB Keys
  pk: string;                        // USER#{userId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // EMAIL#{email}
  GSI2PK: string;                    // ROLE#{role}
  GSI3PK?: string;                   // BAR#{barId} (if attorney)
}
```

**User Roles Enum:**
```typescript
type UserRole =
  // OALJ Roles
  | 'OALJ_DOCKET_CLERK'
  | 'OALJ_LEGAL_ASSISTANT'
  | 'OALJ_ATTORNEY_ADVISOR'
  | 'OALJ_JUDGE'
  
  // Boards Roles
  | 'BOARD_DOCKET_CLERK'
  | 'BOARD_LEGAL_ASSISTANT'
  | 'BOARD_ATTORNEY_ADVISOR'
  | 'BOARD_MEMBER'
  
  // External Roles
  | 'PRO_SE_PETITIONER'
  | 'BAR_MEMBER'
  | 'AUTHORIZED_REPRESENTATIVE'
  | 'EFSP'
  | 'PUBLIC'
  
  // System Roles
  | 'SYSTEM_ADMIN'
  | 'COURT_SECURITY_OFFICER';
```

**Program Codes:**
```typescript
type ProgramCode = 'BLA' | 'LHC' | 'PER';
type BoardCode = 'BRB' | 'ARB' | 'ECAB';
```

---

### 4.2 Organization

Represents law firms, government agencies, corporations, and other entities.

```typescript
interface Organization {
  // Keys
  organizationId: string;            // UUID v4
  ein?: string;                      // Employer Identification Number
  
  // Details
  name: string;
  type: OrganizationType;
  parentOrganizationId?: string;     // For hierarchies
  
  // Contact
  address: Address;
  phone: string;
  fax?: string;
  email: string;
  website?: string;
  
  // OALJ Specific
  barMembership?: {
    state: string;
    barNumber: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  }[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // DynamoDB Keys
  pk: string;                        // ORG#{organizationId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // EIN#{ein}
  GSI2PK: string;                    // NAME#{name}
}

type OrganizationType =
  | 'LAW_FIRM'
  | 'GOVERNMENT_AGENCY'
  | 'CORPORATION'
  | 'NON_PROFIT'
  | 'PARTNERSHIP'
  | 'SOLE_PROPRIETORSHIP';

interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;                     // 2-letter code
  zipCode: string;
  country: string;                   // Default 'USA'
}
```

---

## 5. User & Authentication

### 5.1 Session

```typescript
interface Session {
  // Keys
  sessionId: string;                 // UUID v4
  userId: string;
  
  // Authentication
  token: string;                     // JWT
  refreshToken?: string;
  mfaVerified: boolean;
  
  // Context
  ipAddress: string;
  userAgent: string;
  loginAt: string;
  expiresAt: string;
  
  // Permissions (cached)
  permissions: Permission[];
  accessibleCases?: string[];        // caseIds user can access
  
  // DynamoDB Keys
  pk: string;                        // SESSION#{sessionId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // USER#{userId}
  TTL: number;                       // Unix timestamp for expiry
}

interface Permission {
  action: string;                    // e.g., 'CASE:READ', 'DOCUMENT:WRITE'
  resource: string;                  // e.g., 'CASE:*', 'CASE:2026-BLA-00123'
  conditions?: Record<string, any>;  // e.g., { isSealed: false }
}
```

### 5.2 Access Request

```typescript
interface AccessRequest {
  // Keys
  accessRequestId: string;           // UUID v4
  
  // Request Details
  userId: string;
  caseId: string;
  requestedRole: 'COUNSEL_OF_RECORD' | 'AUTHORIZED_REPRESENTATIVE' | 'OTHER';
  reason: string;
  
  // Supporting Documents
  noticeOfAppearanceId?: string;     // Document ID of NOA
  supportingDocumentIds?: string[];
  
  // Approval Workflow
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  reviewedBy?: string;               // userId of reviewer
  reviewedAt?: string;
  decisionReason?: string;
  
  // Metadata
  createdAt: string;
  
  // DynamoDB Keys
  pk: string;                        // ACCESS_REQ#{accessRequestId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // CASE#{caseId}
  GSI2PK: string;                    // USER#{userId}
  GSI3PK: string;                    // STATUS#{status}
}
```

---

## 6. Case Management

### 6.1 Case

The central entity representing an adjudicatory matter.

```typescript
interface Case {
  // Keys
  caseId: string;                    // UUID v4
  caseNumber: string;                // Human-readable: 2026-BLA-00123
  
  // Classification
  programId: string;                 // FK to Program
  programCode: ProgramCode;          // BLA, LHC, PER
  caseType: CaseType;
  
  // Title/Parties
  title: string;                     // e.g., "John Doe v. ABC Corp"
  shortTitle?: string;               // For displays
  
  // Status
  status: CaseStatus;
  subStatus?: string;                // More granular status
  
  // Dates
  filingDate: string;                // ISO 8601 date
  receivedDate?: string;             // When paper filing received
  docketedDate?: string;             // When officially docketed
  closedDate?: string;
  
  // Assignment
  judgeId?: string;                  // Assigned ALJ
  docketClerkId?: string;            // Assigned clerk
  legalAssistantId?: string;         // Assigned LA
  attorneyAdvisorId?: string;        // Assigned AA
  
  // Boards Specific
  appealedFromCaseId?: string;       // Original OALJ case
  boardDocketedDate?: string;
  boardMembers?: string[];           // Panel member userIds
  briefingSchedule?: BriefingSchedule;
  
  // Deadlines
  statutoryDeadline?: string;        // 270-day deadline for OALJ
  nextHearingDate?: string;
  
  // Flags
  isSealed: boolean;
  isHighProfile: boolean;
  isProSe: boolean;                  // Any pro se parties
  hasEmergencyMotion: boolean;
  
  // Statistics (denormalized)
  docketEntryCount: number;
  documentCount: number;
  partyCount: number;
  hearingCount: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;                 // userId of filer
  
  // DynamoDB Keys
  pk: string;                        // CASE#{caseId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // PROGRAM#{programId}
  GSI1SK: string;                    // CASE#{caseId}
  GSI2PK: string;                    // STATUS#{status}
  GSI2SK: string;                    // FILED_DATE#{filingDate}
  GSI3PK: string;                    // JUDGE#{judgeId}
  GSI3SK: string;                    // CASE#{caseId}
  GSI4PK?: string;                   // APPEALED_FROM#{appealedFromCaseId}
}

type CaseType =
  // Black Lung
  | 'BLA_INITIAL_CLAIM'
  | 'BLA_MODIFICATION'
  | 'BLA_SURVIVOR_CLAIM'
  | 'BLA_RECONSIDERATION'
  
  // Longshore
  | 'LHC_INJURY_CLAIM'
  | 'LHC_DEATH_CLAIM'
  | 'LHC_SETTLEMENT'
  
  // PERM
  | 'PER_LCA_APPEAL'
  | 'PER_H2A_APPEAL'
  | 'PER_H2B_APPEAL'
  
  // Boards (appellate)
  | 'BRB_APPEAL'
  | 'ARB_APPEAL'
  | 'ECAB_APPEAL';

type CaseStatus =
  // Intake
  | 'FILED'
  | 'PENDING_INTAKE'
  | 'DEFICIENCY_RETURNED'
  
  // Active
  | 'DOCKETED'
  | 'ASSIGNED'
  | 'PENDING_HEARING'
  | 'HEARING_SCHEDULED'
  | 'HEARING_COMPLETE'
  | 'PENDING_DECISION'
  
  // Resolved
  | 'DECISION_SIGNED'
  | 'DECISION_ISSUED'
  | 'FINAL'
  | 'APPEALED'
  | 'CLOSED'
  | 'REMANDED'
  | 'SETTLED'
  | 'DISMISSED';

interface BriefingSchedule {
  appellantDueDate: string;
  appelleeDueDate: string;
  replyDueDate: string;
  extensions?: {
    party: 'APPELLANT' | 'APPELLEE';
    newDueDate: string;
    grantedDate: string;
    reason: string;
  }[];
}
```

---

### 6.2 Party

Represents a participant in a case (claimant, employer, etc.).

```typescript
interface Party {
  // Keys
  partyId: string;                   // UUID v4
  caseId: string;
  
  // Classification
  partyType: PartyType;
  role: PartyRole;
  
  // Identity
  userId?: string;                   // FK to User (if registered)
  organizationId?: string;           // FK to Organization (if entity)
  
  // Individual Details
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  ssn?: string;                      // Encrypted, redacted for public
  
  // Contact
  address: Address;
  phone?: string;
  email?: string;
  
  // Representation
  isProSe: boolean;
  representativeUserId?: string;     // FK to User (attorney)
  
  // Case-Specific
  isClaimant: boolean;
  isEmployer: boolean;
  isIntervenor: boolean;
  
  // Metadata
  addedDate: string;
  addedBy: string;                   // userId
  
  // DynamoDB Keys
  pk: string;                        // CASE#{caseId}#PARTY#{partyId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // PARTY_TYPE#{partyType}
  GSI2PK: string;                    // USER#{userId} (if linked)
}

type PartyType =
  | 'CLAIMANT'
  | 'EMPLOYER'
  | 'CARRIER'                        // Insurance carrier
  | 'DIRECTOR_OWCP'                  // Required party in BLA/LHC
  | 'INTERVENOR'
  | 'AMICUS';

type PartyRole =
  | 'PETITIONER'
  | 'RESPONDENT'
  | 'APPELLANT'
  | 'APPELLEE'
  | 'INTERVENOR';
```

---

### 6.3 Representation

Links attorneys to parties they represent.

```typescript
interface Representation {
  // Keys
  representationId: string;          // UUID v4
  caseId: string;
  partyId: string;
  attorneyUserId: string;
  
  // Details
  type: 'COUNSEL_OF_RECORD' | 'APPEARANCE' | 'PRO_HAC_VICE';
  firmName?: string;
  
  // Dates
  startDate: string;
  endDate?: string;
  terminatedReason?: string;
  
  // Service
  servicePreference: 'ELECTRONIC' | 'PAPER' | 'FAX';
  serviceEmail?: string;             // For electronic service
  serviceAddress?: Address;
  
  // Metadata
  filedBy: string;                   // userId
  filedDate: string;
  
  // DynamoDB Keys
  pk: string;                        // CASE#{caseId}#REP#{representationId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // ATTORNEY#{attorneyUserId}
  GSI1SK: string;                    // CASE#{caseId}
  GSI2PK: string;                    // PARTY#{partyId}
}
```

---

## 7. Document Management

### 7.1 Document

Metadata for documents stored in S3.

```typescript
interface Document {
  // Keys
  documentId: string;                // UUID v4
  caseId: string;
  
  // Identification
  documentNumber?: string;           // Human-readable (e.g., "001")
  title: string;
  description?: string;
  
  // Classification
  documentType: DocumentType;
  category: DocumentCategory;
  
  // Storage
  s3Key: string;                     // Current version
  s3Bucket: string;                  // Default: iacp-documents
  fileName: string;
  mimeType: string;
  fileSize: number;                  // Bytes
  
  // Security
  isSealed: boolean;
  sealReason?: string;
  sealUntilDate?: string;
  isExhibit: boolean;
  exhibitNumber?: string;
  
  // Redaction
  isRedactedVersion: boolean;
  originalDocumentId?: string;       // FK to unredacted version
  redactionReason?: string;
  
  // Processing
  ocrStatus: 'PENDING' | 'COMPLETE' | 'FAILED';
  ocrText?: string;                  // Extracted text
  aiAnalysis?: {
    containsPII: boolean;
    containsSignature: boolean;
    confidence: number;
    detectedFields: Record<string, string>;
  };
  
  // Metadata
  uploadedBy: string;                // userId
  uploadedDate: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  
  // Versioning
  currentVersion: number;            // 1, 2, 3...
  versionHistory?: string[];         // Array of documentVersionIds
  
  // DynamoDB Keys
  pk: string;                        // CASE#{caseId}#DOC#{documentId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // DOCTYPE#{documentType}
  GSI2PK: string;                    // UPLOADED_BY#{uploadedBy}
  GSI3PK: string;                    // SEALED#{isSealed}
}

type DocumentType =
  // Pleadings
  | 'PETITION'
  | 'CLAIM'
  | 'RESPONSE'
  | 'ANSWER'
  | 'MOTION'
  | 'OPPOSITION'
  | 'REPLY'
  
  // Evidence
  | 'MEDICAL_REPORT'
  | 'EMPLOYMENT_RECORD'
  | 'EXPERT_OPINION'
  | 'DEPOSITION'
  | 'AFFIDAVIT'
  | 'EXHIBIT'
  
  // Orders
  | 'NOTICE_OF_HEARING'
  | 'SCHEDULING_ORDER'
  | 'PROTECTIVE_ORDER'
  | 'DECISION_AND_ORDER'
  | 'REMand_ORDER'
  
  // Correspondence
  | 'DEFICIENCY_NOTICE'
  | 'SERVICE_LETTER'
  | 'ADMINISTRATIVE_LETTER'
  
  // Boards
  | 'NOTICE_OF_APPEAL'
  | 'APPELLANT_BRIEF'
  | 'APPELLEE_BRIEF'
  | 'REPLY_BRIEF'
  | 'TRANSCRIPT'
  
  // Other
  | 'NOTICE_OF_APPEARANCE'
  | 'SUBSTITUTION_OF_COUNSEL'
  | 'FEE_APPLICATION'
  | 'OTHER';

type DocumentCategory =
  | 'PLEADING'
  | 'EVIDENCE'
  | 'ORDER'
  | 'CORRESPONDENCE'
  | 'TRANSCRIPT'
  | 'LEGAL_RESEARCH'
  | 'ADMINISTRATIVE';
```

---

### 7.2 DocumentVersion

Tracks versions of a document.

```typescript
interface DocumentVersion {
  // Keys
  documentVersionId: string;         // UUID v4
  documentId: string;
  versionNumber: number;             // 1, 2, 3...
  
  // Storage
  s3Key: string;
  fileName: string;
  fileSize: number;
  checksum: string;                  // SHA-256
  
  // Change Tracking
  changeDescription?: string;
  isRedline: boolean;
  trackedChanges?: TrackedChange[];
  
  // Signature
  isSigned: boolean;
  signedBy?: string;                 // userId
  signedDate?: string;
  signatureType?: 'ELECTRONIC' | 'DIGITAL' | 'HANDWRITTEN';
  
  // Metadata
  uploadedBy: string;
  uploadedDate: string;
  
  // DynamoDB Keys
  pk: string;                        // DOC#{documentId}#VER#{versionNumber}
  sk: string;                        // METADATA
  GSI1PK: string;                    // DOC#{documentId}
  GSI1SK: string;                    // VERSION#{uploadedDate}
}

interface TrackedChange {
  type: 'INSERT' | 'DELETE' | 'FORMAT';
  text: string;
  position: {
    start: number;
    end: number;
  };
  userId: string;
  timestamp: string;
}
```

---

## 8. Docket & Filings

### 8.1 DocketEntry

The official record of case proceedings.

```typescript
interface DocketEntry {
  // Keys
  docketEntryId: string;             // UUID v4
  caseId: string;
  entryNumber: number;               // Sequential: 1, 2, 3...
  
  // Content
  type: DocketEntryType;
  typeDescription: string;
  text: string;                      // Full text of entry
  
  // Filing Reference
  filingId?: string;                 // FK to Filing (if e-filed)
  documentIds?: string[];            // Associated documents
  
  // Parties
  filedBy?: string;                  // userId or party name
  filedByRole?: PartyRole;
  
  // Service
  servedDate?: string;
  servedTo?: string[];               // Array of userIds
  serviceMethod?: 'ELECTRONIC' | 'MAIL' | 'FAX';
  serviceProofDocumentId?: string;
  
  // Flags
  isPublic: boolean;
  isSealed: boolean;
  isMinuteEntry: boolean;            // Clerk-created summary
  
  // Metadata
  filedDate: string;                 // ISO 8601 datetime
  enteredBy: string;                 // userId of clerk
  enteredDate: string;
  
  // DynamoDB Keys
  pk: string;                        // CASE#{caseId}#ENTRY#{entryNumber}
  sk: string;                        // METADATA
  GSI1PK: string;                    // CASE#{caseId}
  GSI1SK: string;                    // ENTRY_DATE#{filedDate}
  GSI2PK: string;                    // TYPE#{type}
  GSI3PK: string;                    // FILED_BY#{filedBy}
}

type DocketEntryType =
  // Case Initiation
  | 'CASE_OPENED'
  | 'PETITION_FILED'
  | 'CLAIM_FILED'
  | 'FILING_FEE_PAID'
  | 'FEE_WAIVER_GRANTED'
  
  // Pleadings
  | 'MOTION_FILED'
  | 'OPPOSITION_FILED'
  | 'REPLY_FILED'
  | 'MOTION_GRANTED'
  | 'MOTION_DENIED'
  
  // Hearings
  | 'NOTICE_OF_HEARING_ISSUED'
  | 'HEARING_HELD'
  | 'TRANSCRIPT_FILED'
  | 'EXHIBIT_RECEIVED'
  
  // Decisions
  | 'DECISION_ISSUED'
  | 'ORDER_ENTERED'
  | 'JUDGMENT_ENTERED'
  
  // Service
  | 'SERVED_ELECTRONICALLY'
  | 'SERVED_BY_MAIL'
  
  // Case Status
  | 'CASE_TRANSFERRED'
  | 'CASE_REMANDED'
  | 'CASE_CLOSED'
  | 'CASE_REOPENED'
  
  // Other
  | 'DEFICIENCY_NOTICE'
  | 'ADMINISTRATIVE_NOTE'
  | 'OTHER';
```

---

### 8.2 Filing

Represents an electronic filing submission.

```typescript
interface Filing {
  // Keys
  filingId: string;                  // UUID v4
  
  // Submission
  submissionNumber: string;          // Human-readable tracking
  caseId?: string;                   // Null for new case filings
  filingType: FilingType;
  
  // Filer
  filerUserId: string;
  filerType: 'ATTORNEY' | 'PRO_SE' | 'EFSP';
  filerOrganizationId?: string;
  
  // Documents
  documentIds: string[];             // All uploaded documents
  primaryDocumentId: string;         // Main document
  
  // Validation
  validationStatus: 'PENDING' | 'VALIDATED' | 'DEFICIENT' | 'REJECTED';
  validationErrors?: ValidationError[];
  aiValidationScore?: number;        // 0-100 confidence
  
  // Processing
  processingStatus: 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'FAILED';
  docketEntryId?: string;            // Created when docketed
  docketedBy?: string;               // userId of clerk
  docketedDate?: string;
  
  // Payment
  feeAmount?: number;
  feeStatus: 'NOT_REQUIRED' | 'PENDING' | 'PAID' | 'WAIVED';
  paymentTransactionId?: string;
  
  // Metadata
  submittedDate: string;
  
  // DynamoDB Keys
  pk: string;                        // FILING#{filingId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // CASE#{caseId}
  GSI2PK: string;                    // FILER#{filerUserId}
  GSI3PK: string;                    // STATUS#{validationStatus}
}

type FilingType =
  | 'NEW_CASE'
  | 'MOTION'
  | 'BRIEF'
  | 'EXHIBIT'
  | 'NOTICE'
  | 'APPEAL'
  | 'OTHER';

interface ValidationError {
  code: string;
  field: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
}
```

---

### 8.3 ServiceRecord

Tracks service of documents to parties.

```typescript
interface ServiceRecord {
  // Keys
  serviceRecordId: string;           // UUID v4
  caseId: string;
  docketEntryId: string;
  
  // Service Details
  documentId: string;
  servedTo: string[];                // userIds or party names
  servedDate: string;
  serviceMethod: 'ELECTRONIC' | 'MAIL' | 'FAX' | 'PERSONAL';
  
  // Proof
  proofDocumentId?: string;          // Scanned return receipt
  signer?: string;                   // For certified mail
  trackingNumber?: string;
  
  // Compliance
  isCompliant: boolean;
  complianceNotes?: string;
  
  // Metadata
  createdBy: string;
  createdDate: string;
  
  // DynamoDB Keys
  pk: string;                        // CASE#{caseId}#SERVICE#{serviceRecordId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // ENTRY#{docketEntryId}
  GSI2PK: string;                    // DOC#{documentId}
}
```

---

## 9. Programs & Workflows

### 9.1 Program

Defines OALJ and Board programs.

```typescript
interface Program {
  // Keys
  programId: string;                 // UUID v4
  code: ProgramCode | BoardCode;
  
  // Details
  name: string;
  description: string;
  division: 'OALJ' | 'BOARDS';
  
  // Configuration
  statutoryDeadline?: number;        // Days (e.g., 270 for BLA)
  filingFee?: number;
  requiresHearing: boolean;
  
  // Workflow
  intakeWorkflow: WorkflowStep[];
  adjudicationWorkflow: WorkflowStep[];
  
  // Metadata
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // DynamoDB Keys
  pk: string;                        // PROGRAM#{programId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // CODE#{code}
  GSI2PK: string;                    // DIVISION#{division}
}

interface WorkflowStep {
  stepId: string;
  name: string;
  description: string;
  required: boolean;
  allowedRoles: UserRole[];
  templateDocumentIds?: string[];
}
```

---

### 9.2 Hearing

Represents a scheduled hearing.

```typescript
interface Hearing {
  // Keys
  hearingId: string;                 // UUID v4
  caseId: string;
  
  // Scheduling
  type: 'IN_PERSON' | 'VIDEO' | 'TELEPHONE' | 'SUBMISSION_ON_RECORD';
  scheduledDate: string;             // ISO 8601 datetime
  estimatedDuration: number;         // Minutes
  
  // Location
  location?: {
    address: Address;
    courtroom: string;
  };
  videoConferenceLink?: string;
  dialInNumber?: string;
  
  // Participants
  judgeId: string;
  courtReporterId?: string;
  courtReporterDispatched: boolean;
  
  // Status
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  cancellationReason?: string;
  
  // Transcript
  transcriptRequested: boolean;
  transcriptDocumentId?: string;
  transcriptFilingDate?: string;
  
  // Metadata
  scheduledBy: string;               // userId
  scheduledDate: string;
  
  // DynamoDB Keys
  pk: string;                        // CASE#{caseId}#HEARING#{hearingId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // JUDGE#{judgeId}
  GSI1SK: string;                    // DATE#{scheduledDate}
  GSI2PK: string;                    // STATUS#{status}
}
```

---

### 9.3 Decision

Represents a judicial decision or order.

```typescript
interface Decision {
  // Keys
  decisionId: string;                // UUID v4
  caseId: string;
  
  // Classification
  type: 'DECISION_AND_ORDER' | 'ORDER' | 'OPINION' | 'MEMORANDUM';
  subtype?: string;
  
  // Content
  title: string;
  text: string;                      // Full decision text
  summary?: string;                  // AI-generated summary
  
  // Drafting
  draftDocumentId: string;           // Working draft
  finalDocumentId: string;           // Signed version
  
  // Review Process
  draftedBy?: string;                // userId (law clerk)
  reviewedBy?: string;               // userId (judge)
  redlineHistory?: string[];         // Document version IDs
  
  // Signature
  signedBy?: string;                 // userId (judge)
  signedDate?: string;
  isSigned: boolean;
  isReleased: boolean;
  releaseDate?: string;
  
  // Precedential Value
  isPrecedential: boolean;
  isDesignatedForPublication: boolean;
  
  // Appeal
  isAppealable: boolean;
  appealDeadline?: string;
  appealedDate?: string;
  
  // Metadata
  createdDate: string;
  
  // DynamoDB Keys
  pk: string;                        // CASE#{caseId}#DEC#{decisionId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // JUDGE#{signedBy}
  GSI1SK: string;                    // DATE#{signedDate}
  GSI2PK: string;                    // TYPE#{type}
  GSI3PK: string;                    // PRECEDENTIAL#{isPrecedential}
}
```

---

## 10. Analytics & Reporting

### 10.1 CaseMetrics

Denormalized metrics for dashboards.

```typescript
interface CaseMetrics {
  // Keys
  caseId: string;
  date: string;                      // YYYY-MM-DD
  
  // Counts
  docketEntryCount: number;
  documentCount: number;
  motionCount: number;
  hearingCount: number;
  
  // Timing
  daysSinceFiling: number;
  daysUntilDeadline: number;
  daysToDecision?: number;
  
  // Status
  status: CaseStatus;
  isOverdue: boolean;
  
  // DynamoDB Keys
  pk: string;                        // METRICS#CASE#{caseId}
  sk: string;                        // DATE#{date}
  GSI1PK: string;                    // DATE#{date}
  GSI1SK: string;                    // CASE#{caseId}
}
```

---

### 10.2 JudgeMetrics

Workload metrics for judges.

```typescript
interface JudgeMetrics {
  // Keys
  judgeId: string;
  date: string;                      // YYYY-MM-DD
  
  // Workload
  activeCases: number;
  pendingDecisions: number;
  upcomingHearings: number;
  
  // Deadlines
  overdueCases: number;
  casesDueIn30Days: number;
  complianceRate: number;            // Percentage on-time
  
  // Productivity
  decisionsThisMonth: number;
  avgDaysToDecision: number;
  
  // DynamoDB Keys
  pk: string;                        // METRICS#JUDGE#{judgeId}
  sk: string;                        // DATE#{date}
  GSI1PK: string;                    // DATE#{date}
  GSI1SK: string;                    // JUDGE#{judgeId}
}
```

---

## 11. System Entities

### 11.1 AuditLog

Immutable audit trail.

```typescript
interface AuditLog {
  // Keys
  auditLogId: string;                // UUID v4
  
  // Actor
  userId: string;
  userEmail: string;
  userRole: UserRole;
  
  // Action
  action: string;                    // e.g., 'CASE.CREATE', 'DOCUMENT.VIEW'
  resource: string;                  // e.g., 'CASE:2026-BLA-00123'
  resourceId?: string;
  
  // Context
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  
  // Details
  requestPayload?: Record<string, any>;
  responsePayload?: Record<string, any>;
  statusCode: number;
  
  // Timestamp
  timestamp: string;                 // ISO 8601 datetime
  
  // DynamoDB Keys
  pk: string;                        // AUDIT#{auditLogId}
  sk: string;                        // METADATA
  GSI1PK: string;                    // USER#{userId}
  GSI1SK: string;                    // TIMESTAMP#{timestamp}
  GSI2PK: string;                    // RESOURCE#{resource}
  GSI3PK: string;                    // ACTION#{action}
  TTL: number;                       // 7 years from timestamp
}
```

---

### 11.2 SystemConfig

Application configuration.

```typescript
interface SystemConfig {
  // Keys
  configId: string;                  // e.g., 'DEFICIENCY_TEMPLATES'
  scope: 'GLOBAL' | 'PROGRAM' | 'USER';
  scopeId?: string;                  // programId or userId
  
  // Configuration
  key: string;
  value: any;                        // JSON value
  
  // Metadata
  updatedAt: string;
  updatedBy: string;
  
  // DynamoDB Keys
  pk: string;                        // CONFIG#{configId}
  sk: string;                        // SCOPE#{scope}
  GSI1PK: string;                    // KEY#{key}
}
```

---

## 12. Data Dictionary

### 12.1 Enumerations

```typescript
// All Program Codes
const PROGRAM_CODES = {
  OALJ: ['BLA', 'LHC', 'PER'],
  BOARDS: ['BRB', 'ARB', 'ECAB'],
} as const;

// All Case Statuses
const CASE_STATUSES = {
  INTAKE: ['FILED', 'PENDING_INTAKE', 'DEFICIENCY_RETURNED'],
  ACTIVE: ['DOCKETED', 'ASSIGNED', 'PENDING_HEARING', 'HEARING_SCHEDULED', 'HEARING_COMPLETE', 'PENDING_DECISION'],
  RESOLVED: ['DECISION_SIGNED', 'DECISION_ISSUED', 'FINAL', 'APPEALED', 'CLOSED', 'REMANDED', 'SETTLED', 'DISMISSED'],
} as const;

// Document Access Levels
const DOCUMENT_ACCESS = {
  PUBLIC: 'PUBLIC',
  CASE_PARTIES: 'CASE_PARTIES',
  INTERNAL: 'INTERNAL',
  CHAMBERS_ONLY: 'CHAMBERS_ONLY',
  SEALED: 'SEALED',
} as const;

// Service Methods
const SERVICE_METHODS = {
  ELECTRONIC: 'ELECTRONIC',
  MAIL: 'MAIL',
  FAX: 'FAX',
  PERSONAL: 'PERSONAL',
  CERTIFIED: 'CERTIFIED',
} as const;
```

### 12.2 Validation Rules

```typescript
// Case Number Format
const CASE_NUMBER_PATTERN = /^(\d{4})-(BLA|LHC|PER|BRB|ARB|ECAB)-(\d{5,})$/;

// SSN Format (for validation, stored encrypted)
const SSN_PATTERN = /^\d{3}-\d{2}-\d{4}$/;

// Bar Number Format (varies by state)
const BAR_NUMBER_PATTERN = /^[A-Z]{0,2}\d{4,10}$/;

// Email Format
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone Format
const PHONE_PATTERN = /^\+?1?\d{10}$/;

// File Size Limits
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_TOTAL_FILING_SIZE = 100 * 1024 * 1024; // 100MB

// Allowed MIME Types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
```

---

## 13. DynamoDB Schema Design

### 13.1 Table Definition

```yaml
TableName: iacp-main-table
BillingMode: PAY_PER_REQUEST

AttributeDefinitions:
  - AttributeName: pk
    AttributeType: S
  - AttributeName: sk
    AttributeType: S
  - AttributeName: GSI1PK
    AttributeType: S
  - AttributeName: GSI1SK
    AttributeType: S
  - AttributeName: GSI2PK
    AttributeType: S
  - AttributeName: GSI2SK
    AttributeType: S
  - AttributeName: GSI3PK
    AttributeType: S
  - AttributeName: GSI3SK
    AttributeType: S

KeySchema:
  - AttributeName: pk
    KeyType: HASH
  - AttributeName: sk
    KeyType: RANGE

GlobalSecondaryIndexes:
  - IndexName: GSI1
    KeySchema:
      - AttributeName: GSI1PK
        KeyType: HASH
      - AttributeName: GSI1SK
        KeyType: RANGE
    Projection:
      ProjectionType: ALL
      
  - IndexName: GSI2
    KeySchema:
      - AttributeName: GSI2PK
        KeyType: HASH
      - AttributeName: GSI2SK
        KeyType: RANGE
    Projection:
      ProjectionType: ALL
      
  - IndexName: GSI3
    KeySchema:
      - AttributeName: GSI3PK
        KeyType: HASH
      - AttributeName: GSI3SK
        KeyType: RANGE
    Projection:
      ProjectionType: ALL

StreamSpecification:
  StreamViewType: NEW_AND_OLD_IMAGES
  StreamEnabled: true
```

### 13.2 Access Patterns

```typescript
// Query 1: Get Case with all metadata
{
  pk: 'CASE#2026-BLA-00123',
  sk: 'METADATA'
}

// Query 2: Get all docket entries for a case
{
  pk: 'CASE#2026-BLA-00123',
  sk: { beginsWith: 'ENTRY#' }
}

// Query 3: Get all documents for a case
{
  pk: 'CASE#2026-BLA-00123',
  sk: { beginsWith: 'DOC#' }
}

// Query 4: Get all cases for a program
{
  GSI1PK: 'PROGRAM#BLA',
  GSI1SK: { beginsWith: 'CASE#' }
}

// Query 5: Get all cases by status
{
  GSI2PK: 'STATUS#PENDING_DECISION',
  GSI2SK: { beginsWith: 'FILED_DATE#' }
}

// Query 6: Get all cases assigned to a judge
{
  GSI3PK: 'JUDGE#judge-123',
  GSI3SK: { beginsWith: 'CASE#' }
}

// Query 7: Get all parties for a case
{
  pk: 'CASE#2026-BLA-00123',
  sk: { beginsWith: 'PARTY#' }
}

// Query 8: Get all hearings for a judge on a date
{
  GSI1PK: 'JUDGE#judge-123',
  GSI1SK: { beginsWith: 'DATE#2026-03-22' }
}

// Query 9: Get audit logs for a user
{
  GSI1PK: 'USER#user-123',
  GSI1SK: { beginsWith: 'TIMESTAMP#' }
}

// Query 10: Get all pending intakes
{
  GSI3PK: 'STATUS#PENDING_INTAKE',
  GSI3SK: { beginsWith: 'FILED_DATE#' }
}
```

---

## 14. Validation Rules

### 14.1 Business Rules

```typescript
// Rule 1: Case Number Uniqueness
// Each case number must be unique within a program
function validateCaseNumberUniqueness(caseNumber: string, programId: string): boolean {
  // Query GSI1 for PROGRAM#{programId} and check for existing caseNumber
}

// Rule 2: Docket Entry Sequential Numbering
// Entry numbers must be sequential within a case
function validateDocketEntryNumber(caseId: string, entryNumber: number): boolean {
  // Query case for max entryNumber, ensure new entry is max + 1
}

// Rule 3: Service Deadline Calculation
// Service must occur within X days based on method
function calculateServiceDeadline(filingDate: string, serviceMethod: string): string {
  const deadlines = {
    ELECTRONIC: 1,  // Next business day
    MAIL: 3,
    CERTIFIED: 5,
    FAX: 1,
  };
  // Add business days to filing date
}

// Rule 4: 270-Day Deadline
// BLA cases must be decided within 270 days of filing
function calculateStatutoryDeadline(filingDate: string, programCode: string): string | null {
  if (programCode === 'BLA') {
    return addDays(filingDate, 270);
  }
  return null;
}

// Rule 5: Party Access Control
// Users can only access cases where they are a party or representative
function validateCaseAccess(userId: string, caseId: string): boolean {
  // Check if user is:
  // 1. Assigned judge, clerk, or staff
  // 2. Party to the case
  // 3. Representative for a party
}

// Rule 6: Document Sealing
// Only judges and authorized staff can seal documents
function validateSealPermission(userId: string, role: UserRole): boolean {
  const authorizedRoles = ['OALJ_JUDGE', 'BOARD_MEMBER', 'SYSTEM_ADMIN'];
  return authorizedRoles.includes(role);
}

// Rule 7: Briefing Schedule
// Appellate briefs must follow statutory timelines
function validateBriefingSchedule(schedule: BriefingSchedule): boolean {
  // Appellant: 30 days from docketing
  // Appellee: 21 days from appellant brief
  // Reply: 14 days from appellee brief
  // Ensure dates follow this pattern
}

// Rule 8: Hearing Notice Period
// Pro Se parties require 14 days notice, represented parties 7 days
function validateHearingNotice(scheduledDate: string, partyNoticeDate: string, isProSe: boolean): boolean {
  const requiredDays = isProSe ? 14 : 7;
  return daysBetween(partyNoticeDate, scheduledDate) >= requiredDays;
}
```

### 14.2 Data Integrity Constraints

```typescript
// Constraint 1: Required Fields
const REQUIRED_FIELDS = {
  CASE: ['caseId', 'caseNumber', 'programId', 'title', 'filingDate', 'status'],
  PARTY: ['partyId', 'caseId', 'partyType', 'name', 'address'],
  DOCUMENT: ['documentId', 'caseId', 's3Key', 'fileName', 'mimeType', 'uploadedBy'],
  DOCKET_ENTRY: ['docketEntryId', 'caseId', 'entryNumber', 'type', 'text', 'filedDate'],
};

// Constraint 2: Referential Integrity
// All foreign keys must reference existing records
function validateReferentialIntegrity(entity: any): boolean {
  // For each FK field, query to ensure referenced entity exists
}

// Constraint 3: State Transitions
// Case status can only transition per allowed state machine
const ALLOWED_TRANSITIONS = {
  FILED: ['PENDING_INTAKE', 'DEFICIENCY_RETURNED'],
  PENDING_INTAKE: ['DOCKETED', 'DEFICIENCY_RETURNED'],
  DOCKETED: ['ASSIGNED'],
  ASSIGNED: ['PENDING_HEARING'],
  PENDING_HEARING: ['HEARING_SCHEDULED'],
  HEARING_SCHEDULED: ['HEARING_COMPLETE'],
  HEARING_COMPLETE: ['PENDING_DECISION'],
  PENDING_DECISION: ['DECISION_SIGNED'],
  DECISION_SIGNED: ['DECISION_ISSUED', 'APPEALED'],
  DECISION_ISSUED: ['FINAL', 'APPEALED'],
  APPEALED: ['CLOSED'],
  FINAL: ['CLOSED', 'REMANDED', 'REOPENED'],
  CLOSED: ['REOPENED'],
  REMANDED: ['REOPENED'],
};

function validateStateTransition(from: CaseStatus, to: CaseStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 22, 2026 | System | Initial comprehensive data model |

---

**Next Steps:**
1. Review with technical team
2. Validate against US Tax Court EFS patterns
3. Create DynamoDB table via Terraform/CloudFormation
4. Implement entity repositories
5. Create test data generators
