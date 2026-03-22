# Product Requirements Document (PRD)
## Intelligent Adjudicatory Case Portal (IACP) v3.0
### Department of Labor - Office of Administrative Law Judges (OALJ)

**Document Version:** 3.1  
**Last Updated:** March 22, 2026  
**Status:** Aligned with Architecture  
**Architecture Reference:** `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`, `docs/DECISIONS.md`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Stakeholder Analysis](#3-stakeholder-analysis)
4. [System Architecture](#4-system-architecture)
5. [Data Model](#5-data-model)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [User Roles & Permissions](#8-user-roles--permissions)
9. [Case Workflow States](#9-case-workflow-states)
10. [Document Management](#10-document-management)
11. [Integration Requirements](#11-integration-requirements)
12. [Security & Compliance](#12-security--compliance)
13. [Success Metrics](#13-success-metrics)
14. [Appendices](#14-appendices)

---

## 1. Executive Summary

### 1.1 Purpose

The **Intelligent Adjudicatory Case Portal (IACP)** is a comprehensive web-based electronic filing and case management system designed to modernize the Department of Labor's Office of Administrative Law Judges (OALJ) and Appellate Boards adjudication processes. This system replaces legacy paper-based and fragmented digital workflows with a unified, AI-powered platform.

### 1.2 Business Objectives

| Objective | Target Metric | Current Baseline |
|-----------|---------------|------------------|
| Reduce manual intake time | 80% reduction | Manual processing |
| Reduce deficient filings | 95% reduction | ~30% deficiency rate |
| Improve decision turnaround | 20% faster | Variable by case type |
| Enhance judicial collaboration | Real-time redlining | Email-based review |
| Increase transparency | 100% case visibility | Limited public access |

### 1.3 Scope

**In Scope:**
- External filing portal for attorneys, claimants, and representatives
- Internal case management for OALJ and Appellate Boards
- AI-powered document intake and validation
- Electronic service and notification system
- Judicial drafting and collaboration tools
- Legal research integration
- Analytics and reporting dashboard
- Public case search interface

**Out of Scope (Phase 1):**
- Legacy data migration (separate project)
- Integration with legacy CTS/AMS databases (Phase 2)
- Mobile native applications (responsive web only)
- Offline capabilities (Phase 3)

### 1.4 Reference Architecture

This PRD draws heavily from the **US Tax Court Electronic Filing Case Management System (EF-CMS)** open-source project, adapting proven patterns for the DOL OALJ context.

**Key Adaptations:**
- Multi-program case types (BLA, LHC, PER, BRB, ARB, ECAB)
- 8 distinct user roles vs. Tax Court's 4 roles
- Black Lung-specific workflows and medical evidence handling
- Longshore Act compensation calculations
- Administrative review vs. judicial review distinction

---

## 2. Product Overview

### 2.1 System Context

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         IACP Ecosystem                                  │
│                                                                         │
│  ┌──────────────────┐         ┌──────────────────┐                    │
│  │   External Users │         │   Internal Users │                    │
│  │                  │         │                  │                    │
│  │ • Claimants      │         │ • Docket Clerks  │                    │
│  │ • Attorneys      │◄───────►│ • Judges         │                    │
│  │ • Representatives│  Portal │ • Law Clerks     │                    │
│  │ • EFSPs          │         │ • Board Members  │                    │
│  └──────────────────┘         └──────────────────┘                    │
│           │                           │                                │
│           └───────────┬───────────────┘                                │
│                       ▼                                                │
│         ┌───────────────────────────────┐                             │
│         │    Unified Filing Service     │                             │
│         │         (UFS Portal)          │                             │
│         └───────────────────────────────┘                             │
│                       │                                                │
│                       ▼                                                │
│         ┌───────────────────────────────┐                             │
│         │  Intelligent Case Portal      │                             │
│         │         (IACP)                │                             │
│         │  ┌─────────────────────────┐  │                             │
│         │  │   AI Processing Layer   │  │                             │
│         │  │ • Document Validation   │  │                             │
│         │  │ • PII Detection         │  │                             │
│         │  │ • Deficiency Detection  │  │                             │
│         │  │ • Smart Assignment      │  │                             │
│         │  └─────────────────────────┘  │                             │
│         └───────────────────────────────┘                             │
│                       │                                                │
│                       ▼                                                │
│         ┌───────────────────────────────┐                             │
│         │   FedRAMP Cloud Storage       │                             │
│         │   (DynamoDB + S3)             │                             │
│         └───────────────────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Program Areas

| Program | Code | Description | Case Types |
|---------|------|-------------|------------|
| **Black Lung** | BLA | Black Lung Benefits Act | Pneumoconiosis claims, survivor benefits |
| **Longshore** | LHC | Longshore and Harbor Workers' Compensation Act | Worker injury claims |
| **PERM** | PER | Program Electronic Review Management | Labor certification appeals |
| **Benefits Review Board** | BRB | Appellate review for BLA/LHC | Appeals from ALJ decisions |
| **Administrative Review Board** | ARB | Appellate review for employment cases | Davis-Bacon, Service Contract Act |
| **Employees' Compensation Appeals Board** | ECAB | Federal workers' compensation appeals | FECA claims |

### 2.3 User Portals

| Portal | Audience | Access Method |
|--------|----------|---------------|
| **Unified Filing Service (UFS)** | External filers | Public website with authentication |
| **Intelligent Case Portal (IACP)** | Internal staff | Secure intranet with MFA |
| **Public Search** | General public | Read-only search interface |

---

## 3. Stakeholder Analysis

### 3.1 Primary Stakeholders

| Stakeholder | Role | Interest | Influence |
|-------------|------|----------|-----------|
| **Chief Administrative Law Judge** | Executive Sponsor | System adoption, compliance | High |
| **Director, Division of Longshore and Harbor Workers' Compensation** | Program Owner | Black Lung/Longshore workflows | High |
| **Chief Board Member** | Appellate Oversight | Board case management | High |
| **OALJ Docket Clerks** | Primary Users | Intake efficiency | Medium |
| **OALJ Judges** | Primary Users | Decision drafting tools | High |
| **Board Attorney-Advisors** | Primary Users | Legal research, memo drafting | Medium |
| **External Attorneys** | External Users | Filing ease, case access | Medium |
| **Claimants/Pro Se** | External Users | Accessibility, simplicity | Medium |
| **OCIO** | Technical Oversight | Security, infrastructure | High |

### 3.2 User Personas

#### Persona 1: Docket Clerk (Primary User)
**Name:** Maria Santos  
**Role:** OALJ Docket Clerk  
**Experience:** 8 years at DOL

**Goals:**
- Process incoming filings efficiently
- Ensure all required documents are present
- Assign cases to appropriate judges
- Track case transmission to Boards

**Pain Points:**
- Manual data entry from paper forms
- Missing documents discovered late
- Unclear assignment criteria
- No visibility into judge workloads

**System Requirements:**
- Auto-docketing with AI validation
- Deficiency detection at intake
- Smart judge assignment algorithm
- Workload dashboards

---

#### Persona 2: Administrative Law Judge (Primary User)
**Name:** Hon. Robert Chen  
**Role:** Administrative Law Judge  
**Experience:** 15 years on bench

**Goals:**
- Conduct fair hearings efficiently
- Issue timely, well-reasoned decisions
- Manage heavy caseload
- Collaborate with law clerks

**Pain Points:**
- 270-day deadline pressure
- Drafting decisions in isolation
- Version control issues with clerks
- Research scattered across systems

**System Requirements:**
- Deadline tracking and alerts
- Collaborative drafting with redlines
- Integrated legal research
- Caseload management dashboard

---

#### Persona 3: External Attorney (External User)
**Name:** Sarah Mitchell, Esq.  
**Role:** Claimant's Attorney  
**Experience:** 12 years practicing before OALJ

**Goals:**
- File cases quickly and correctly
- Access case documents easily
- Receive timely notifications
- Communicate with court staff

**Pain Points:**
- Complex filing requirements
- No visibility into case status
- Paper-based service delays
- Difficulty reaching clerks

**System Requirements:**
- Guided filing workflow
- Real-time case access
- Electronic service
- Secure messaging

---

#### Persona 4: Board Attorney-Advisor (Primary User)
**Name:** James Williams  
**Role:** Board Attorney-Advisor  
**Experience:** 5 years at BRB

**Goals:**
- Research precedent decisions
- Draft bench memoranda
- Review appellate records
- Support Board members

**Pain Points:**
- Precedent search is manual
- Record review is paper-based
- No collaboration tools
- Citation verification is tedious

**System Requirements:**
- Precedent database search
- Collaborative memo editor
- Citation checker
- Record organization tools

---

## 4. System Architecture

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           IACP System                                   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Presentation Layer                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │   │
│  │  │   UFS Portal    │  │   IACP Portal   │  │  Public Search  │ │   │
│  │  │   (React 19)    │  │   (React 19)    │  │   (React 19)    │ │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        API Gateway                              │   │
│  │                    (Express.js / Node.js)                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│         ┌──────────────────────────┼──────────────────────────┐        │
│         ▼                          ▼                          ▼        │
│  ┌─────────────┐           ┌─────────────┐           ┌─────────────┐  │
│  │  Identity   │           │  Business   │           │   AI        │  │
│  │  Service    │           │  Services   │           │  Services   │  │
│  │  (Auth0/    │           │  (Node.js   │           │  (Gemini    │  │
│  │   Azure AD) │           │   Services) │           │   API)      │  │
│  └─────────────┘           └─────────────┘           └─────────────┘  │
│         │                          │                          │        │
│         ▼                          ▼                          ▼        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Data Access Layer                          │   │
│  │              (DynamoDB + S3 + Elasticsearch)                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                   FedRAMP Cloud Storage                         │   │
│  │              (AWS GovCloud or equivalent)                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Technology Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | React 19, TypeScript, Vite | Component-based, type-safe, fast builds |
| **Styling** | TailwindCSS 4.x | Utility-first, consistent design system |
| **State** | React Context, React Router | Built-in, sufficient for app complexity |
| **Backend** | Node.js 20, Express.js | JavaScript ecosystem, serverless-ready |
| **Database** | DynamoDB | Serverless, scalable, single-digit ms latency |
| **Storage** | S3 | Durable, versioned document storage |
| **Search** | Elasticsearch | Full-text search, faceted navigation |
| **AI** | Google Gemini API | Document analysis, summarization |
| **Auth** | Azure AD / Auth0 | Enterprise SSO, MFA support |
| **Deployment** | Google Cloud Run | Serverless containers, auto-scaling |
| **CI/CD** | GitHub Actions | Integrated with code repository |

### 4.3 Deployment Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                     Production Environment                           │
│                     (FedRAMP Cloud)                                  │
│  ┌────────────────────┐    ┌────────────────────┐                   │
│  │   Cloud Run        │    │   Cloud Run        │                   │
│  │   (UFS Portal)     │    │   (IACP Portal)    │                   │
│  │   :8080            │    │   :8080            │                   │
│  └────────────────────┘    └────────────────────┘                   │
│            │                        │                                │
│            └───────────┬────────────┘                                │
│                        ▼                                             │
│            ┌───────────────────────┐                                │
│            │   Load Balancer       │                                │
│            │   (Cloud Load Bal.)   │                                │
│            └───────────────────────┘                                │
│                        │                                             │
│         ┌──────────────┼──────────────┐                             │
│         ▼              ▼              ▼                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                      │
│  │  DynamoDB  │ │     S3     │ │Elasticsearch│                      │
│  │  (Primary) │ │ (Documents)│ │   (Search)  │                      │
│  └────────────┘ └────────────┘ └────────────┘                      │
└──────────────────────────────────────────────────────────────────────┘
                        ▲
                        │
┌───────────────────────┼──────────────────────────────────────────────┐
│                  Staging Environment                                 │
│                  (FedRAMP Cloud)                                     │
│                  Mirror of Production                                │
└──────────────────────────────────────────────────────────────────────┘
                        ▲
                        │
┌───────────────────────┼──────────────────────────────────────────────┐
│              Development Environment                                 │
│              (Contractor-managed, non-FedRAMP)                       │
│              Mirrors production architecture                         │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 5. Data Model

### 5.1 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │       │      Case       │       │    Program      │
│─────────────────│       │─────────────────│       │─────────────────│
│ userId (PK)     │◄──────┤ caseId (PK)     │       │ programId (PK)  │
│ email           │  1:N  │ programId (FK)  │──────►│ code (BLA/LHC)  │
│ role            │       │ title           │       │ name            │
│ barId           │       │ filingDate      │       │ description     │
│ organization    │       │ status          │       └─────────────────┘
│ admittedDate    │       │ judgeId (FK)    │
│ isActive        │       │ docketClerkId   │       ┌─────────────────┐
└─────────────────┘       │ legalAssistId   │       │      Party      │
                          │ attorneyAdvId   │       │─────────────────│
                          └────────┬────────┘       │ partyId (PK)    │
                                   │                │ caseId (FK)     │
                          ┌────────┼────────┐       │ partyType       │
                          │        │        │       │ name            │
                          ▼        ▼        ▼       │ representation  │
                   ┌──────────┐ ┌──────────┐ ┌──────────┐            │
                   │ Docket   │ │ Filing   │ │ Decision │            │
                   │  Entry   │ │          │ │          │            │
                   │──────────│ │──────────│ │──────────│            │
                   │ entryId  │ │ filingId │ │decisionId│            │
                   │ caseId   │ │ caseId   │ │ caseId   │            │
                   │ entryNum │ │ filerId  │ │ judgeId  │            │
                   │ type     │ │ docId    │ │ issueDate│            │
                   │ filedDate│ │ type     │ │ status   │            │
                   │ text     │ │ isSealed │ │ text     │            │
                   └──────────┘ └──────────┘ └──────────┘            │
                          │        │                                  │
                          │        ▼                                  │
                          │  ┌─────────────────┐                      │
                          │  │    Document     │                      │
                          │  │─────────────────│                      │
                          └─►│ documentId (PK) │◄─────────────────────┘
                             │ caseId (FK)     │
                             │ s3Key           │
                             │ fileName        │
                             │ mimeType        │
                             │ fileSize        │
                             │ uploadedBy      │
                             │ uploadedDate    │
                             │ isSealed        │
                             │ isExhibit       │
                             └─────────────────┘
```

### 5.2 Core Entities

Detailed entity definitions are provided in the companion document:
**`DATA_MODEL.md`** - Complete entity schemas, relationships, and data dictionary

### 5.3 Key Design Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| **DynamoDB (NoSQL)** | Serverless, scales automatically, single-digit ms latency | Complex queries require GSIs |
| **Single-Table Design** | Efficient queries, cost-effective | Complex data modeling |
| **S3 for Documents** | Durable, versioned, lifecycle policies | Separate from metadata |
| **Event Sourcing for Docket** | Immutable audit trail, replay capability | Storage growth over time |
| **Elasticsearch for Search** | Full-text, faceted, relevance scoring | Additional infrastructure |

---

## 6. Functional Requirements

### 6.1 Unified Filing Service (UFS) - External Portal

#### FR-UFS-001: Multi-Step Filing Flow
**Priority:** P0 (Critical)  
**User Story:** As an external filer, I want to submit new claims, appeals, and motions through a guided interface so that I can file correctly without legal expertise.

**Acceptance Criteria:**
- [ ] User can initiate a new case filing
- [ ] System guides user through required fields based on case type
- [ ] User can upload multiple documents
- [ ] System validates required documents before submission
- [ ] User receives confirmation number upon successful filing
- [ ] System generates Notice of Electronic Filing (NEF)

**Reference:** US Tax Court EFS - Case Initiation

---

#### FR-UFS-002: AI Intake Analysis
**Priority:** P0 (Critical)  
**User Story:** As a docket clerk, I want the system to automatically validate filings for completeness and detect issues so that I can focus on exceptions rather than manual review.

**Acceptance Criteria:**
- [ ] System scans uploaded documents for PII (SSN, DOB)
- [ ] System verifies signature presence on required forms
- [ ] System detects missing required fields (Date of Injury, Claimant Name)
- [ ] System flags potential deficiencies for clerk review
- [ ] System provides confidence score for AI determinations

**Reference:** US Tax Court EFS - Document Validation

---

#### FR-UFS-003: Access Request System
**Priority:** P1 (High)  
**User Story:** As an attorney, I want to request access to existing cases so that I can represent my clients effectively.

**Acceptance Criteria:**
- [ ] User can search for existing cases
- [ ] User can submit Notice of Appearance (NOA)
- [ ] System uses AI to verify NOA completeness
- [ ] Clerk receives notification for manual approval
- [ ] Upon approval, user gains access to case documents

**Reference:** US Tax Court EFS - Party Representation

---

#### FR-UFS-004: Electronic Service
**Priority:** P0 (Critical)  
**User Story:** As a party to a case, I want to receive electronic notice of all filings and orders so that I can respond timely.

**Acceptance Criteria:**
- [ ] System sends email notification for each docket entry
- [ ] NEF includes hyperlink to document
- [ ] Service is instantaneous for registered users
- [ ] System tracks service completion
- [ ] Pro Se parties receive certified mail per regulations

**Reference:** US Tax Court EFS - Notice of Electronic Filing

---

### 6.2 Intelligent Case Portal (IACP) - Internal Portal

#### FR-IACP-001: Priority Intake Queue
**Priority:** P0 (Critical)  
**User Story:** As a docket clerk, I want to see new filings sorted by urgency and completeness so that I can prioritize my work effectively.

**Acceptance Criteria:**
- [ ] Dashboard displays all pending intakes
- [ ] Cases sorted by AI-detected urgency (statute of limitations, emergency motions)
- [ ] Completeness score visible for each filing
- [ ] Clerk can filter by case type, program, filing date
- [ ] Bulk actions available for similar filings

**Reference:** US Tax Court EFS - Clerk Dashboard

---

#### FR-IACP-002: Automated Docketing
**Priority:** P0 (Critical)  
**User Story:** As a docket clerk, I want to convert verified filings into docket records with one click so that I can process cases efficiently.

**Acceptance Criteria:**
- [ ] Clerk clicks "Docket" on verified filing
- [ ] System runs AI validation (deficiency check)
- [ ] System generates docket number (e.g., 2026-BLA-00123)
- [ ] System creates initial docket entries
- [ ] System assigns judge per smart assignment algorithm
- [ ] Confirmation displayed with docket number

**Reference:** US Tax Court EFS - Docketing

---

#### FR-IACP-003: Smart Judge Assignment
**Priority:** P0 (Critical)  
**User Story:** As a docket clerk, I want the system to suggest optimal judge assignments so that I can balance workloads and leverage expertise.

**Acceptance Criteria:**
- [ ] System displays Top 3 judge suggestions
- [ ] Each suggestion shows:
  - Current workload (cases pending)
  - Geographic expertise
  - Case type expertise
  - 270-day compliance rate
- [ ] AI provides reasons for each suggestion
- [ ] Clerk can override suggestion with reason
- [ ] Assignment recorded in audit log

**Algorithm Weights:**
- Workload balance: 40%
- Geographic expertise: 30%
- Case type expertise: 20%
- Rotation fairness: 10%

**Reference:** US Tax Court EFS - Judge Assignment (adapted)

---

#### FR-IACP-004: Deficiency Management
**Priority:** P0 (Critical)  
**User Story:** As a docket clerk, I want to generate deficiency notices automatically so that I can return incomplete filings efficiently.

**Acceptance Criteria:**
- [ ] System identifies deficiencies via AI
- [ ] Clerk reviews and confirms deficiencies
- [ ] System generates "Return to Filer" notice
- [ ] Notice lists all deficiencies clearly
- [ ] Filer receives email with instructions
- [ ] System tracks resubmission deadline

**Deficiency Types:**
- Missing signature
- Missing filing fee
- Incomplete form fields
- Missing required documents
- Incorrect case type selection

**Reference:** US Tax Court EFS - Deficiency Notices

---

#### FR-IACP-005: 270-Day Deadline Tracking
**Priority:** P0 (Critical)  
**User Story:** As a judge, I want to see upcoming and overdue deadlines so that I can manage my caseload and remain compliant with regulations.

**Acceptance Criteria:**
- [ ] Dashboard shows deadline alerts (Red/Amber/Green)
- [ ] Red: Cases overdue (>270 days)
- [ ] Amber: Cases due within 30 days (240-270 days)
- [ ] Green: Cases on track (<240 days)
- [ ] Click alert to view affected cases
- [ ] System sends weekly reminder emails

**Reference:** 20 C.F.R. § 725.458 (Black Lung procedure regulations)

---

#### FR-IACP-006: Redline Decision Editor
**Priority:** P0 (Critical)  
**User Story:** As a law clerk, I want to draft decisions with tracked changes so that judges can review my work efficiently.

**Acceptance Criteria:**
- [ ] Editor supports rich text formatting
- [ ] All changes tracked with color coding:
  - Yellow: Added text
  - Green: Corrected text
  - Red strikethrough: Deleted text
- [ ] Comments can be added inline
- [ ] Version history maintained (v1, v2, v3)
- [ ] Judge can accept/reject changes
- [ ] Final version ready for signature

**Reference:** US Tax Court EFS - Chambers Collaboration

---

#### FR-IACP-007: Electronic Signature
**Priority:** P0 (Critical)  
**User Story:** As a judge, I want to sign decisions electronically so that I can release decisions without physical presence.

**Acceptance Criteria:**
- [ ] Judge clicks "Sign & Release"
- [ ] System applies electronic signature
- [ ] Signature includes:
  - Judge name
  - Date/time
  - Cryptographic hash
- [ ] Decision marked as "Signed"
- [ ] NEF generated and served to parties
- [ ] Document sealed (read-only)

**Reference:** E-SIGN Act (15 U.S.C. § 7001)

---

#### FR-IACP-008: Smart Hearing Scheduler
**Priority:** P0 (Critical)  
**User Story:** As a legal assistant, I want to schedule hearings with optimal dates so that I can coordinate judge, courtroom, and court reporter availability.

**Acceptance Criteria:**
- [ ] System suggests 3 optimal dates
- [ ] Dates consider:
  - Judge availability
  - Courtroom availability
  - Court reporter availability
  - Party availability (if entered)
- [ ] Pro Se party rules enforced (14-day notice)
- [ ] Represented party rules enforced (7-day notice)
- [ ] Notice of Hearing generated automatically
- [ ] Calendar invites sent to all parties

**Reference:** 20 C.F.R. § 702.331 (Hearing procedures)

---

#### FR-IACP-009: Legal Research Tools
**Priority:** P1 (High)  
**User Story:** As an attorney-advisor, I want to search case law and regulations so that I can support judges with accurate legal analysis.

**Acceptance Criteria:**
- [ ] Search interface for case law
- [ ] Database includes:
  - Supreme Court cases
  - Circuit Court cases
  - Benefits Review Board precedents
  - Administrative Review Board precedents
  - ECAB precedents
- [ ] Regulations database (20 C.F.R. sections)
- [ ] Citation format checker
- [ ] Quick access from drafting editor

**Reference:** US Tax Court EFS - Legal Research (adapted)

---

#### FR-IACP-010: Case Intelligence Hub
**Priority:** P0 (Critical)  
**User Story:** As any user, I want a unified view of case information so that I can access all relevant details without navigating multiple screens.

**Acceptance Criteria:**
- [ ] 3-pane layout:
  - Pane 1: Case header and metadata
  - Pane 2: Entity navigator (parties, representatives)
  - Pane 3: Workspace (documents, docket, filings)
- [ ] Role-based AI insights
- [ ] Document viewer with zoom/print/download
- [ ] Procedural history timeline
- [ ] Case heritage (related cases, appeals)

**Reference:** US Tax Court EFS - Case Record

---

### 6.3 Appellate Boards

#### FR-BRD-001: Appellate Intake Queue
**Priority:** P1 (High)  
**User Story:** As a Board docket clerk, I want to track cases transmitted from ALJ to Board so that I can ensure complete records.

**Acceptance Criteria:**
- [ ] Dashboard shows pending transmissions
- [ ] System validates record completeness
- [ ] Clerk can request missing documents
- [ ] Upon completion, case docketed at Board
- [ ] Parties notified of Board docketing

**Reference:** 20 C.F.R. § 801.201 (BRB procedure)

---

#### FR-BRD-002: Briefing Schedule Calculator
**Priority:** P1 (High)  
**User Story:** As a Board attorney-advisor, I want to calculate briefing deadlines automatically so that I can ensure compliance with Board rules.

**Acceptance Criteria:**
- [ ] System calculates deadlines based on:
  - Board docketing date
  - Appellant filing deadline (30 days)
  - Appellee cross-brief deadline (21 days)
  - Appellant reply deadline (14 days)
- [ ] Extensions tracked and recalculated
- [ ] Parties notified of deadlines
- [ ] Overdue briefs flagged

**Reference:** 20 C.F.R. § 802.201 (Briefing schedules)

---

#### FR-BRD-003: Oral Argument Scheduler
**Priority:** P2 (Medium)  
**User Story:** As a Board legal assistant, I want to schedule oral arguments before Board panels so that I can coordinate member availability.

**Acceptance Criteria:**
- [ ] System tracks Board member availability
- [ ] Panel composition (3 members)
- [ ] Oral argument requested vs. submission on record
- [ ] Notice sent to parties
- [ ] Transcript ordered if requested

**Reference:** 20 C.F.R. § 802.202 (Oral argument)

---

#### FR-BRD-004: Panel Review Tools
**Priority:** P1 (High)  
**User Story:** As a Board member, I want to review appellate records and draft decisions so that I can resolve appeals efficiently.

**Acceptance Criteria:**
- [ ] Record organized by issue
- [ ] Briefs indexed and searchable
- [ ] ALJ decision highlighted
- [ ] Draft decision circulation to panel
- [ ] Dissent/concurrence options

**Reference:** 20 C.F.R. § 802.301 (Board decisions)

---

### 6.4 Public Search

#### FR-PUB-001: Case Search
**Priority:** P1 (High)  
**User Story:** As a member of the public, I want to search for case information so that I can research legal matters.

**Acceptance Criteria:**
- [ ] Search by case number, party name, attorney
- [ ] Filter by case type, date range, status
- [ ] View docket entries (public only)
- [ ] View public documents
- [ ] Sealed documents hidden
- [ ] PII redacted from public view

**Reference:** US Tax Court EFS - Public Access

---

#### FR-PUB-002: Document Access
**Priority:** P1 (High)  
**User Story:** As a researcher, I want to access public case documents so that I can conduct legal research.

**Acceptance Criteria:**
- [ ] View documents in browser
- [ ] Download PDFs
- [ ] Pay.gov integration for copy fees
- [ ] Watermark on downloaded documents
- [ ] Usage tracking

**Reference:** 20 C.F.R. § 702.341 (Public records)

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Page load time | < 3 seconds | 95th percentile |
| API response time | < 500ms | 95th percentile |
| Document upload | < 10 seconds (10MB) | Average |
| Search results | < 2 seconds | 95th percentile |
| Concurrent users | 500+ | Peak load |
| System uptime | 99.9% | Monthly average |

### 7.2 Scalability

| Requirement | Target | Strategy |
|-------------|--------|----------|
| Case volume | 100,000+ cases | DynamoDB auto-scaling |
| Document storage | 10TB+ | S3 lifecycle policies |
| User growth | 10,000+ users | Serverless architecture |
| Geographic distribution | Nationwide | CDN for static assets |

### 7.3 Reliability

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| Availability | 99.9% | Multi-AZ deployment |
| Durability | 99.999999999% | S3 versioning |
| Recovery Time Objective | 4 hours | Backup/restore procedures |
| Recovery Point Objective | 1 hour | Continuous backup |
| No single point of failure | 100% | Redundant components |

### 7.4 Security

| Requirement | Standard | Verification |
|-------------|----------|--------------|
| Authentication | MFA required | Azure AD / Auth0 |
| Authorization | RBAC | Role-based access control |
| Encryption (at rest) | AES-256 | AWS KMS |
| Encryption (in transit) | TLS 1.3 | HTTPS everywhere |
| Vulnerability scanning | OWASP ASV 3.0 | SaaS static + OWASP ZAP |
| Audit logging | 100% of actions | CloudTrail + custom logs |
| FedRAMP compliance | Moderate | AWS GovCloud |

### 7.5 Accessibility

| Requirement | Standard | Verification |
|-------------|----------|--------------|
| WCAG compliance | WCAG 2.1 AA | Automated + manual testing |
| Section 508 | Compliant | Annual audit |
| Screen reader support | Full | NVDA, JAWS testing |
| Keyboard navigation | Full | No mouse required |
| Color contrast | AA standard | Automated checks |

### 7.6 Usability

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Learnability | < 2 hours training | User testing |
| Efficiency | 80% reduction in manual tasks | Time studies |
| Error rate | < 1% user errors | Analytics |
| Satisfaction | > 4.0/5.0 | User surveys |
| Task completion | > 95% | Analytics |

---

## 8. User Roles & Permissions

### 8.1 Role Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                        IACP Roles                               │
│                                                                 │
│  ┌─────────────────────┐           ┌─────────────────────┐     │
│  │    OALJ Roles       │           │   Boards Roles      │     │
│  │   (BLA, LHC, PER)   │           │  (BRB, ARB, ECAB)   │     │
│  │                     │           │                     │     │
│  │ ┌─────────────────┐ │           │ ┌─────────────────┐ │     │
│  │ │ Docket Clerk    │ │           │ │ Board Docket    │ │     │
│  │ │ • Auto-docket   │ │           │ │ Clerk           │ │     │
│  │ │ • Assign judges │ │           │ │ • Appellate     │ │     │
│  │ │ • Transfer      │ │           │ │   intake        │ │     │
│  │ └─────────────────┘ │           │ └─────────────────┘ │     │
│  │                     │           │                     │     │
│  │ ┌─────────────────┐ │           │ ┌─────────────────┐ │     │
│  │ │ Legal Assistant │ │           │ │ Board Legal     │ │     │
│  │ │ • Schedule      │ │           │ │ Assistant       │ │     │
│  │ │ • Notices       │ │           │ │ • Oral argument │ │     │
│  │ │ • Reporters     │ │           │ │ • Scheduling    │ │     │
│  │ └─────────────────┘ │           │ └─────────────────┘ │     │
│  │                     │           │                     │     │
│  │ ┌─────────────────┐ │           │ ┌─────────────────┐ │     │
│  │ │ Attorney-Advisor│ │           │ │ Board Attorney- │ │     │
│  │ │ • Bench memos   │ │           │ │ Advisor         │ │     │
│  │ │ • Research      │ │           │ │ • Precedents    │ │     │
│  │ │ • Draft editor  │ │           │ │ • Memo drafting │ │     │
│  │ └─────────────────┘ │           │ └─────────────────┘ │     │
│  │                     │           │                     │     │
│  │ ┌─────────────────┐ │           │ ┌─────────────────┐ │     │
│  │ │ Judge           │ │           │ │ Board Member    │ │     │
│  │ │ • Hearings      │ │           │ │ • Panel review  │ │     │
│  │ │ • Decisions     │ │           │ │ • Decisions     │ │     │
│  │ │ • Signatures    │ │           │ │ • Dissents      │ │     │
│  │ └─────────────────┘ │           │ └─────────────────┘ │     │
│  └─────────────────────┘           └─────────────────────┘     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  External Roles                         │   │
│  │                                                         │   │
│  │  • Pro Se Petitioner                                    │   │
│  │  • Member of Bar (Attorney)                             │   │
│  │  • Authorized Representative                            │   │
│  │  • EFSP (Electronic Filing Service Provider)            │   │
│  │  • Public (Search Only)                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Permission Matrix

| Action | Docket Clerk | Legal Assistant | Attorney-Advisor | Judge | Board Clerk | Board Member | External Attorney | Public |
|--------|--------------|-----------------|------------------|-------|-------------|--------------|-------------------|--------|
| **View Cases (OALJ)** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ (own) | ✅ (public) |
| **View Cases (Boards)** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ (own) | ✅ (public) |
| **Docket Cases** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Assign Judges** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Schedule Hearings** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Issue Notices** | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Draft Memos** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Edit Decisions** | ❌ | ❌ | ✅ (redline) | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Sign Decisions** | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Seal Documents** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **View Sealed** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Legal Research** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **File Documents** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Search Public** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 8.3 Access Control Rules

#### Rule 1: Program Isolation
```
OALJ Roles (BLA, LHC, PER) can only access OALJ cases
Boards Roles (BRB, ARB, ECAB) can only access Boards cases
Exception: System administrators for maintenance
```

#### Rule 2: Case Participation
```
External users can only access cases where they are:
- The claimant/petitioner
- Counsel of record
- Authorized representative
Exception: Public search of non-sealed cases
```

#### Rule 3: Document Sealing
```
Sealed documents visible only to:
- Internal users with case access
- Users with explicit "View Sealed" permission
Never visible to:
- External users (except counsel of record with permission)
- Public search
```

#### Rule 4: Audit Trail
```
All access to case data logged:
- User ID
- Action performed
- Timestamp
- Case ID
- Document ID (if applicable)
Retention: 7 years minimum
```

---

## 9. Case Workflow States

### 9.1 OALJ Case Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      OALJ Case Lifecycle                                │
│                                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │  Filed   │───►│ Pending  │───►│ Docketed │───►│ Assigned │         │
│  │          │    │  Intake  │    │          │    │          │         │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘         │
│       │               │               │               │                │
│       │               │               │               ▼                │
│       │               │               │         ┌──────────┐          │
│       │               │               │         │ Pending  │          │
│       │               │               │         │ Hearings │          │
│       │               │               │         └──────────┘          │
│       │               │               │               │                │
│       │               │               │               ▼                │
│       │               │               │         ┌──────────┐          │
│       │               │               │         │ Hearings │          │
│       │               │               │         │ Complete │          │
│       │               │               │         └──────────┘          │
│       │               │               │               │                │
│       │               │               │               ▼                │
│       │               │               │         ┌──────────┐          │
│       │               │               │         │ Pending  │          │
│       │               │               │         │ Decision │          │
│       │               │               │         └──────────┘          │
│       │               │               │               │                │
│       │               │               │               ▼                │
│       │               │               │         ┌──────────┐          │
│       │               │               │         │ Decision │          │
│       │               │               │         │  Signed  │          │
│       │               │               │         └──────────┘          │
│       │               │               │               │                │
│       │               │               │               ▼                │
│       │               │               │         ┌──────────┐          │
│       │               │◄──────────────┼─────────│  Final   │          │
│       │               │               │         └──────────┘          │
│       │               │               │               │                │
│       │               │               │               ▼                │
│       │               │               │         ┌──────────┐          │
│       │               │◄──────────────┼─────────│ Appealed │          │
│                       │                         └──────────┘          │
│                       │                                                │
│  ┌────────────────────▼────────────────────────────────────────┐     │
│  │                    Terminal States                          │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │     │
│  │  │ Closed   │  │ Remanded │  │ Settled  │  │ Dismissed│   │     │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │     │
│  └─────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.2 State Definitions

| State | Description | Entry Criteria | Exit Criteria |
|-------|-------------|----------------|---------------|
| **Filed** | Initial filing submitted | Filing complete, confirmation generated | AI intake validation complete |
| **Pending Intake** | Awaiting clerk review | Filed successfully | Docketed or returned for deficiency |
| **Docketed** | Official case opened | Clerk approved filing | Judge assigned |
| **Assigned** | Judge allocated | Assignment complete | Hearing scheduled |
| **Pending Hearings** | Awaiting hearing | Hearing scheduled | Hearing complete |
| **Hearings Complete** | Evidence closed | All hearings held, transcript filed | Ready for decision |
| **Pending Decision** | Under consideration | Submitted to judge | Decision signed |
| **Decision Signed** | Decision issued | Judge signed | Final or appealed |
| **Final** | Case resolved | No appeal within 30 days | Closed |
| **Appealed** | Transmitted to Board | Notice of appeal filed | Closed at OALJ |
| **Closed** | Case terminated | All actions complete | N/A |
| **Remanded** | Returned from Board | Board remand order | Reopened |
| **Settled** | Parties resolved | Settlement approved | Closed |
| **Dismissed** | Case dismissed | Judicial order | Closed |

### 9.3 Boards Case Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Boards Case Lifecycle                               │
│                                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │Appealed  │───►│ Pending  │───►│ Docketed │───►│ Briefing │         │
│  │  from    │    │Transmission│   │          │    │          │         │
│  │  OALJ    │    │          │    │          │    │          │         │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘         │
│                                                     │                   │
│                                                     ▼                   │
│                                               ┌──────────┐            │
│                                               │ Briefs   │            │
│                                               │ Complete │            │
│                                               └──────────┘            │
│                                                     │                   │
│                                                     ▼                   │
│                                               ┌──────────┐            │
│                                               │ Oral     │            │
│                                               │ Argument │            │
│                                               │ (Optional)│            │
│                                               └──────────┘            │
│                                                     │                   │
│                                                     ▼                   │
│                                               ┌──────────┐            │
│                                               │ Under    │            │
│                                               │ Review   │            │
│                                               └──────────┘            │
│                                                     │                   │
│                                                     ▼                   │
│                                               ┌──────────┐            │
│                                               │ Decision │            │
│                                               │ Issued   │            │
│                                               └──────────┘            │
│                                                     │                   │
│                                                     ▼                   │
│                                               ┌──────────┐            │
│                                               │  Final   │            │
│                                               └──────────┘            │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.4 State Transition Rules

```typescript
interface StateTransition {
  from: CaseState;
  to: CaseState;
  allowedRoles: UserRole[];
  requiresApproval: boolean;
  triggersNotification: boolean;
}

const stateTransitions: StateTransition[] = [
  {
    from: 'FILED',
    to: 'PENDING_INTAKE',
    allowedRoles: ['SYSTEM'],
    requiresApproval: false,
    triggersNotification: false,
  },
  {
    from: 'PENDING_INTAKE',
    to: 'DOCKETED',
    allowedRoles: ['DOCKET_CLERK'],
    requiresApproval: false,
    triggersNotification: true,
  },
  {
    from: 'PENDING_INTAKE',
    to: 'FILED', // Return for deficiency
    allowedRoles: ['DOCKET_CLERK'],
    requiresApproval: false,
    triggersNotification: true,
  },
  {
    from: 'DOCKETED',
    to: 'ASSIGNED',
    allowedRoles: ['DOCKET_CLERK'],
    requiresApproval: false,
    triggersNotification: true,
  },
  {
    from: 'PENDING_DECISION',
    to: 'DECISION_SIGNED',
    allowedRoles: ['JUDGE'],
    requiresApproval: false,
    triggersNotification: true,
  },
  // ... additional transitions
];
```

---

## 10. Document Management

### 10.1 Document Types

| Category | Document Type | Retention | Public Access |
|----------|---------------|-----------|---------------|
| **Pleadings** | Petition/Claim | Permanent | Yes |
| | Response/Answer | Permanent | Yes |
| | Motion | Permanent | Yes |
| | Opposition | Permanent | Yes |
| **Evidence** | Medical Reports | Permanent | Yes (redacted) |
| | Employment Records | Permanent | Yes (redacted) |
| | Expert Opinions | Permanent | Yes |
| | Deposition Transcripts | Permanent | Yes |
| **Orders** | Notice of Hearing | 10 years | Yes |
| | Scheduling Order | 10 years | Yes |
| | Protective Order | 10 years | No (sealed) |
| | Decision & Order | Permanent | Yes |
| **Correspondence** | Deficiency Notice | 7 years | No |
| | Service Letter | 7 years | No |
| | Administrative Letter | 7 years | No |

### 10.2 Document Lifecycle

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Upload  │───►│Validate  │───►│  Store   │───►│  Index   │
│          │    │          │    │  (S3)    │    │(Elastic) │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │                                                      │
     │                                                      ▼
     │                                               ┌──────────┐
     │                                               │  Serve   │
     │                                               │          │
     │                                               └──────────┘
     │                                                      │
     ▼                                                      ▼
┌──────────┐                                         ┌──────────┐
│  Reject  │                                         │  Access  │
│          │                                         │(View/Down)│
└──────────┘                                         └──────────┘
```

### 10.3 Document Versioning

```typescript
interface DocumentVersion {
  documentId: string;
  versionNumber: number; // 1, 2, 3...
  s3Key: string;
  uploadedBy: string;
  uploadedDate: string;
  changeDescription?: string;
  isCurrent: boolean;
  previousVersionId?: string;
}

// Versioning Rules:
// 1. Each upload creates new version
// 2. Previous versions retained (audit trail)
// 3. Only current version served by default
// 4. Version history accessible to authorized users
```

### 10.4 Document Security

| Classification | Access Level | Encryption | Retention |
|----------------|--------------|------------|-----------|
| **Public** | Anyone | TLS in transit | Permanent |
| **Case-Confidential** | Parties + Internal | AES-256 at rest | Permanent |
| **Sealed** | Internal + Court Order | AES-256 at rest | Permanent |
| **PII-Redacted** | Public (redacted version) | AES-256 at rest | Permanent |
| **Chambers-Only** | Judge + Clerks | AES-256 at rest | 7 years |

---

## 11. Integration Requirements

### 11.1 External Systems

| System | Integration Type | Purpose | Priority |
|--------|------------------|---------|----------|
| **Pay.gov** | API | Payment processing | P0 |
| **Azure AD** | SAML/OIDC | Authentication | P0 |
| **USPS Address Validation** | API | Address verification | P1 |
| **PACER** | API (future) | Case cross-reference | P2 |
| **DOL Legacy Systems** | Batch (future) | Data migration | P2 |

### 11.2 Pay.gov Integration

**Use Cases:**
- Filing fees ($200 for new cases)
- Bar admission fees
- Copy request fees
- Publication purchases

**Integration Pattern:**
```
┌──────────┐    ┌──────────┐    ┌──────────┐
│   IACP   │───►│  Pay.gov │───►│  Bank    │
│          │◄───│  API     │◄───│  ACH     │
└──────────┘    └──────────┘    └──────────┘
     │
     ▼
┌──────────┐
│  Update  │
│  Case    │
│  Record  │
└──────────┘
```

**Requirements:**
- Redirect to Pay.gov for payment
- Callback on success/failure
- Receipt generation
- Fee waiver workflow

### 11.3 Email/SMS Notifications

| Event | Recipients | Channel | Timing |
|-------|------------|---------|--------|
| New Filing | All parties | Email | Immediate |
| Deficiency Notice | Filer | Email | Immediate |
| Hearing Notice | All parties | Email + Mail | Per regulations |
| Decision Issued | All parties | Email | Immediate |
| Deadline Reminder | Attorneys | Email + SMS | 7 days before |
| 270-Day Alert | Judge, Clerk | Email | Weekly |

---

## 12. Security & Compliance

### 12.1 Regulatory Compliance

| Regulation | Requirement | Implementation |
|------------|-------------|----------------|
| **E-SIGN Act** | Electronic signatures valid | Cryptographic signatures |
| **Privacy Act of 1974** | PII protection | Redaction, access controls |
| **FedRAMP** | Cloud security | AWS GovCloud |
| **Section 508** | Accessibility | WCAG 2.1 AA |
| **NIST 800-53** | Security controls | Moderate baseline |
| **20 C.F.R. §§ 702, 718, 725** | OALJ procedures | Workflow enforcement |
| **20 C.F.R. §§ 801-802** | Board procedures | Appellate workflows |

### 12.2 Security Controls

#### Authentication
- Multi-factor authentication (MFA) required
- Password complexity: 12+ characters, special chars
- Session timeout: 30 minutes inactive
- Concurrent session limit: 3

#### Authorization
- Role-based access control (RBAC)
- Attribute-based access control (ABAC) for cases
- Just-in-time access for emergency sealing

#### Encryption
- TLS 1.3 for all traffic
- AES-256 for data at rest
- AWS KMS for key management
- Annual key rotation

#### Audit Logging
- All user actions logged
- Logs immutable (WORM storage)
- Retention: 7 years
- Real-time alerting for anomalies

### 12.3 Vulnerability Management

| Activity | Frequency | Tool |
|----------|-----------|------|
| Static analysis | Every commit | SaaS scanner |
| Dynamic analysis | Weekly | OWASP ZAP |
| Penetration testing | Annual | Third-party |
| Dependency scanning | Daily | GitHub Dependabot |
| Security review | Per release | Manual |

---

## 13. Success Metrics

### 13.1 Key Performance Indicators

| KPI | Baseline | Target | Measurement |
|-----|----------|--------|-------------|
| **Intake Processing Time** | 45 minutes/case | 9 minutes/case | Time study |
| **Deficiency Rate** | 30% | < 5% | Analytics |
| **270-Day Compliance** | 85% | > 95% | Dashboard |
| **Hearing Scheduling Time** | 3 days | < 1 day | Time study |
| **User Satisfaction** | N/A | > 4.0/5.0 | Survey |
| **System Uptime** | N/A | > 99.9% | Monitoring |
| **Page Load Time** | N/A | < 3 seconds | Analytics |
| **Error Rate** | N/A | < 1% | Analytics |

### 13.2 Business Outcomes

| Outcome | Metric | Target Date |
|---------|--------|-------------|
| **Reduced Manual Labor** | 80% reduction in intake time | 6 months post-launch |
| **Faster Adjudication** | 20% reduction in avg. case duration | 12 months post-launch |
| **Improved Accuracy** | 95% reduction in deficient filings | 3 months post-launch |
| **Enhanced Transparency** | 100% public case visibility | Launch |
| **Better Collaboration** | Real-time redlining for all judges | Launch |

### 13.3 User Adoption Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **External Filer Adoption** | 80% within 6 months | Filing analytics |
| **Internal User Adoption** | 100% within 1 month | Login analytics |
| **Feature Utilization** | > 70% for core features | Usage analytics |
| **Training Completion** | 100% before access | LMS tracking |
| **Support Tickets** | < 10 per week after 1 month | Help desk |

---

## 14. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| **ALJ** | Administrative Law Judge |
| **BRB** | Benefits Review Board |
| **ARB** | Administrative Review Board |
| **ECAB** | Employees' Compensation Appeals Board |
| **BLA** | Black Lung Benefits Act |
| **LHC** | Longshore and Harbor Workers' Compensation Act |
| **PERM** | Program Electronic Review Management |
| **NEF** | Notice of Electronic Filing |
| **NOA** | Notice of Appearance |
| **PII** | Personally Identifiable Information |
| **RBAC** | Role-Based Access Control |
| **MFA** | Multi-Factor Authentication |

### Appendix B: Document Templates

**Template 1: Deficiency Notice**
```
DEPARTMENT OF LABOR
OFFICE OF ADMINISTRATIVE LAW JUDGES

DEFICIENCY NOTICE

Case: [Pending Docket Assignment]
Filing Date: [Date]
Filer: [Name]

Dear [Filer Name],

Your filing dated [Date] has been reviewed and the following deficiencies were identified:

1. [Deficiency 1]
2. [Deficiency 2]
3. [Deficiency 3]

Please correct these deficiencies and resubmit within 14 days of the date of this notice.

If you have any questions, please contact the Docket Clerk at [contact information].

Sincerely,
[Automated System]
Office of Administrative Law Judges
```

**Template 2: Notice of Hearing**
```
DEPARTMENT OF LABOR
OFFICE OF ADMINISTRATIVE LAW JUDGES

NOTICE OF HEARING

Case No: [2026-BLA-00123]
Claimant: [Name]
Employer: [Name]

NOTICE IS HEREBY GIVEN that a hearing in the above-captioned case will be held before the undersigned Administrative Law Judge on:

Date: [Date]
Time: [Time]
Location: [Address / Video Conference Link]

The hearing will be conducted in accordance with the provisions of the Longshore and Harbor Workers' Compensation Act.

ISSUED this [Day] of [Month], [Year].

[Judge Name]
Administrative Law Judge
```

### Appendix C: API Endpoints

**External API (UFS Portal)**
```
POST   /api/v1/filings              # Create new filing
GET    /api/v1/filings/{id}         # Get filing status
POST   /api/v1/access-requests      # Request case access
GET    /api/v1/cases                # Search cases (public)
GET    /api/v1/cases/{id}           # Get case details (authorized)
GET    /api/v1/documents/{id}       # Download document
POST   /api/v1/payments             # Initiate payment
```

**Internal API (IACP)**
```
GET    /api/v1/intake               # Get pending intakes
POST   /api/v1/docket               # Docket case
POST   /api/v1/assignments          # Assign judge
GET    /api/v1/cases/{id}/docket    # Get docket entries
POST   /api/v1/documents            # Upload document
PUT    /api/v1/documents/{id}       # Update document
POST   /api/v1/notices              # Generate notice
GET    /api/v1/research             # Legal research search
POST   /api/v1/decisions            # Create decision draft
PUT    /api/v1/decisions/{id}/sign  # Sign decision
```

### Appendix D: References

1. **US Tax Court EFS** - https://github.com/ustaxcourt/ef-cms
2. **GSA 18F Front End Guide** - https://frontend.18f.gov/
3. **OWASP ASV 3.0** - https://owasp.org/www-project-application-security-verification-standard/
4. **WCAG 2.1 AA** - https://www.w3.org/WAI/WCAG21/quickref/
5. **FedRAMP** - https://www.fedramp.gov/
6. **20 C.F.R. Chapter VII** - OALJ Regulations
7. **E-SIGN Act** - 15 U.S.C. § 7001

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 11, 2026 | System | Initial draft |
| 2.0 | March 15, 2026 | System | Added US Tax Court reference |
| 3.0 | March 22, 2026 | System | Comprehensive rewrite with data model |

---

**Next Steps:**
1. Review with stakeholders
2. Validate data model with technical team
3. Create detailed DATA_MODEL.md
4. Prioritize requirements for MVP
5. Begin sprint planning
