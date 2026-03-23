# Product Requirements Document: IACP 3.0
**Product:** Intelligent Adjudicatory Case Portal (IACP)
**Version:** 1.0 (Draft)
**Agency:** Department of Labor (DOL) — Office of Administrative Law Judges (OALJ)
**Date:** 2026-03-22
**Status:** Canonical PRD for current repository planning

> Canonical source: this file is the single maintained PRD for the repo.
> Legacy root-level `PRD.md` and `PRD_IACP3.md` now redirect here and should not contain independent requirements content.

---

## 1. Product Vision & Strategy

### 1.1 Product Vision
To establish a modern, secure, and reusable open-source eCourt platform that modernizes federal administrative adjudication. IACP 3.0 will replace legacy systems with a cloud-native, event-driven architecture that ensures transparency, reduces statutory backlog, and enhances access to justice for all parties.

While the initial deployment targets the DOL Office of Administrative Law Judges (OALJ), the core architecture is designed as a multi-tenant capable platform. Future variants will support other federal administrative boards with agency-specific configurations layered atop the common core.

### 1.2 Strategic Variant: DOL OALJ
The v1.0 launch focuses exclusively on OALJ operations, supporting the adjudication of workers' compensation cases under the Black Lung Benefits Act (BLA), Longshore and Harbor Workers' Compensation Act (LHC), Defense Base Act (DBA/DCW), and related statutes (LDA). This variant validates the platform's ability to handle complex party relationships, statutory deadlines (270-day rule), and integration with the Office of Workers' Compensation Programs (OWCP).

### 1.3 Platform Strategy
- **Core Engine:** A shared microservices backbone (Case Management, Docketing, Identity, Document Management) hosted on GCP Cloud Run.
- **Agency Configuration:** Case types, workflows, SLA rules, and form definitions are configured via metadata, not code changes, allowing rapid adaptation for future agency variants.
- **Event Sourcing:** All docket entries are immutable events published via Pub/Sub, ensuring a perfect audit trail and enabling real-time notifications.

### 1.4 Product Principles
1. **Single-Thread Justice:** A case moves through one continuous digital thread from referral to closure. No siloed systems between intake, hearing, and decision.
2. **AI-First:** Artificial Intelligence (Gemini integration) is embedded to augment human decision-making (auto-docketing, smart assignment, legal research), not replace adjudicators.
3. **Open-Source:** Core codebase will be open-sourced to foster community contribution, transparency, and reduce vendor lock-in.
4. **Role-Driven Security:** Access control is strictly enforced based on internal roles (ALJ, Clerk) and external personas (Claimant, Counsel), ensuring data segregation between cases and parties.

---

## 2. User Personas

### 2.1 Internal Roles (OALJ Staff)

#### Docket Clerk
- **Description:** Frontline staff responsible for intake, initial docketing, and ensuring case files are complete upon referral from OWCP.
- **Goals:** Accurately create case records, generate correct docket numbers, ensure all initial referrals meet filing requirements, identify and handle deficient filings.
- **Pain Points:** Manual data entry from paper referrals, duplicate party records, difficulty tracking statutory deadlines during intake, high volume of deficient filings requiring manual review.
- **Key Workflows:** Intake referral, Generate Docket Number, AI-assisted auto-docketing, Deficiency notice generation, Assign Case to ALJ.
- **Success Metrics:** % of cases docketed within 24 hours of referral, Auto-docketing accuracy rate ≥ 90%, Data entry error rate < 1%.

#### Legal Assistant (LA)
- **Description:** Supports Administrative Law Judges (ALJs) with scheduling, motion processing, exhibit management, and administrative tasks.
- **Goals:** Manage ALJ calendar efficiently, ensure motions are routed correctly, prepare hearing packets, maintain exhibit records.
- **Pain Points:** Scheduling conflicts across 8 districts, lost exhibits, version control issues, manual notice generation.
- **Key Workflows:** Schedule Hearing (judge + courtroom + reporter availability), Process Motions, Generate Notice of Hearing, Manage Exhibits, Track Transcripts.
- **Success Metrics:** Hearing notice timeliness (≤ 14 days before hearing), Motion processing turnaround time, Zero scheduling conflicts.

#### Attorney-Advisor (AA)
- **Description:** Provides legal research and drafts bench memos and decision orders for ALJ review.
- **Goals:** Efficient legal research, accurate citation checking, consistency in legal reasoning, timely draft submission.
- **Pain Points:** Disconnected research tools, difficulty searching prior case law within the system, manual citation verification, version control on draft decisions.
- **Key Workflows:** Legal Research (AI chatbot), Draft Bench Memo, Draft Decision & Order, Redline comparison, Submit draft to ALJ.
- **Success Metrics:** Reduction in decision remands due to legal error, Research time per case, Draft turnaround time.

#### Administrative Law Judge (ALJ)
- **Description:** Judicial officer who conducts formal hearings and issues decisions and orders.
- **Goals:** Impartial adjudication, timely decision issuance within statutory deadlines, clear record management, efficient case review.
- **Pain Points:** Cumbersome evidence review, lack of visibility into case history prior to hearing, administrative burden vs. judicial time, 270-day SLA pressure.
- **Key Workflows:** Review Case File (Unified Folder), Conduct Hearing, Review Draft Decision (redline mode), Sign & Release Decision, Seal/Unseal documents, Close record.
- **Success Metrics:** Decision issuance within 270-day statutory deadline, Hearing efficiency, Remand rate from BRB/ARB.

#### Chief Administrative Law Judge
- **Description:** Oversees judicial operations, workload balance across all 8 districts, and agency performance.
- **Goals:** Monitor SLA compliance agency-wide, balance caseloads across districts and ALJs, identify bottlenecks, report to DOL leadership.
- **Pain Points:** Lack of real-time dashboard data, difficulty identifying aging cases before they breach SLA, manual workload rebalancing.
- **Key Workflows:** Workload Analysis Dashboard, SLA Monitoring (agency-wide), Case Reassignment/Transfer, Performance Reporting.
- **Success Metrics:** Overall agency SLA compliance %, Caseload balance variance across ALJs, Case clearance rate.

#### System Administrator
- **Description:** Manages user access, system configuration, and technical health.
- **Goals:** System uptime, secure access management, audit compliance, user provisioning.
- **Pain Points:** Complex user provisioning, lack of granular audit logs, downtime during maintenance.
- **Key Workflows:** User Provisioning (role assignment), Role & Permission Management, Audit Log Review, System Configuration.
- **Success Metrics:** System availability 99.9%, Time to provision/deprovision users < 1 hour, Zero unauthorized access incidents.

### 2.2 External Personas

#### Claimant (Often Self-Represented)
- **Description:** The injured worker or beneficiary seeking benefits under BLA, LHC, or related statutes. ~80% of BLA claimants are pro se (self-represented). May have limited technical literacy.
- **Goals:** Easy case filing, clear status updates, accessible document submission, understanding of process.
- **Pain Points:** Confusing legal jargon, inability to reach clerks, fear of missing deadlines, accessibility barriers (vision, mobility), unfamiliar with legal process.
- **Key Workflows:** File new claim (e-filing), View case status, Upload supporting documents/evidence, Receive notices and decisions, Request case access.
- **Success Metrics:** Task completion rate without support call, Accessibility compliance (WCAG 2.1 AA), Filing error rate.

#### Claimant Attorney
- **Description:** Legal counsel representing the claimant. May represent multiple claimants across multiple cases.
- **Goals:** Efficient multi-case management, secure communication, full access to case record, timely notifications on opposing party filings.
- **Pain Points:** Redundant data entry across cases, insecure email for sensitive documents, lack of real-time notification on opposing counsel filings, managing multiple case deadlines.
- **Key Workflows:** e-Filing (motions, briefs, evidence), Service of Process, View full docket, Submit proposed orders, Manage representation across cases.
- **Success Metrics:** Filing time reduction, Notification latency < 5 minutes, Zero missed deadlines.

#### Employer/Insurer Representative
- **Description:** Counsel or representative for the responsible operator (BLA) or insurance carrier (LHC). Frequently appeals OWCP determinations.
- **Goals:** Timely notice of hearings, ability to contest claims, secure document exchange, visibility into case timeline.
- **Pain Points:** Late hearing notices, difficulty serving documents to self-represented claimants, opaque scheduling, high volume of cases to track.
- **Key Workflows:** Respond to claim, Upload medical/employment evidence, Request hearing continuance, File motions, Monitor case status.
- **Success Metrics:** On-time service of documents, Reduction in scheduling disputes, Notification timeliness.

#### OWCP Director (Referral Source)
- **Description:** Official from the Office of Workers' Compensation Programs who refers contested cases to OALJ after issuing Proposed Decision & Order (PD&O).
- **Goals:** Seamless transfer of case record, confirmation of docketing, status visibility on referred cases, participate as party of interest.
- **Pain Points:** Manual handoff of case files, lack of confirmation when OALJ receives case, duplicate data entry between OWCP and OALJ systems.
- **Key Workflows:** Refer case to OALJ (with case package), Verify docketing receipt, Track adjudication status, File Director's submissions.
- **Success Metrics:** Zero data loss during referral, Automated acknowledgment of receipt within 24 hours, End-to-end referral time reduction.

### 2.3 Future Personas (v1.1+)

| Persona | Board | Description |
|---------|-------|-------------|
| Board Member | BRB/ARB | Reviews ALJ decisions on appeal; issues affirm/reverse/remand orders |
| Board Docket Clerk | BRB/ARB | Manages appellate intake, assigns panels, tracks briefing schedules |
| Board Legal Assistant | BRB/ARB | Supports board members with scheduling oral arguments, managing briefs |
| Board Attorney-Advisor | BRB/ARB | Drafts appellate decisions for board member review |

---

## 3. Functional Requirements — Court Record Domain

### FR-CR-001: Case Creation from Referral
- **Description:** Ability to ingest case referrals from OWCP systems (via API or manual entry) and create a new case record in IACP.
- **User Story:** As a **Docket Clerk**, I want to **create a case from an OWCP referral package**, so that **the adjudication process can begin without manual data re-entry**.
- **Acceptance Criteria:**
  - System accepts referral payload containing claimant info, employer info, and claim details
  - System validates required fields (Claimant ID, Injury Date, Statute Type) before creation
  - System creates a unique Case ID linked to the OWCP Claim Number
  - System triggers a `case.created` event on the Pub/Sub bus
  - Manual entry allowed for non-electronic referrals (paper scan + data entry)
- **Priority:** P0

### FR-CR-002: Docket Number Generation
- **Description:** Automated generation of unique case docket numbers following the OALJ standard format.
- **User Story:** As a **Docket Clerk**, I want the **system to automatically assign a docket number upon intake**, so that **the case follows the standard YYYYTTTNNNNNN naming convention**.
- **Acceptance Criteria:**
  - Format: `YYYY` (Fiscal Year) + `TTT` (Case Type Code) + `NNNNNN` (6-digit sequential)
  - Sequence is unique per Case Type per Fiscal Year (FY starts Oct 1)
  - System prevents duplicate number generation even under concurrent intake loads
  - Docket number is immutable once assigned
  - Example: `2026BLA00011` = 11th Black Lung case in FY2026
- **Priority:** P0

### FR-CR-003: Case Lifecycle State Machine
- **Description:** Enforcement of valid state transitions for a case from intake to closure.
- **User Story:** As a **System**, I want **defined state transitions with guard conditions**, so that **users cannot skip critical adjudication steps (e.g., issuing a decision before a hearing)**.
- **Acceptance Criteria:**
  - Supported phases: `Intake → Docketed → Assigned → Pre-Hearing → Hearing → Post-Hearing → Decision → Closed`
  - Branch states: `Appealed`, `Remanded` (from Decision or Closed)
  - Guard conditions enforced (e.g., cannot enter Hearing without assigned judge)
  - All phase transitions emit events to Pub/Sub and create docket_event entries
  - Users see visual status indicators corresponding to the current phase and status
- **Priority:** P0

### FR-CR-004: Party-Centric Management
- **Description:** Management of persons and entities that span multiple cases, separating Party data from Case data.
- **User Story:** As a **Docket Clerk**, I want to **link existing persons to new cases**, so that **we maintain a single source of truth for Claimants and Attorneys across multiple proceedings**.
- **Acceptance Criteria:**
  - System searches existing Person database by name/email before creating new record
  - Party roles (Claimant, Employer, Responsible Operator, Insurance Carrier, Attorney, Director OWCP) are assigned per Case via junction table
  - One Person can be linked to multiple Cases with different roles
  - Contact information updates on a Person record propagate to all active case associations (with audit trail)
  - Supports representation links (Attorney represents Claimant in Case X)
- **Priority:** P0

### FR-CR-005: Case Assignment (Manual + AI-Suggested)
- **Description:** Assignment of cases to ALJs based on district, workload, expertise, or AI recommendation.
- **User Story:** As a **Docket Clerk**, I want to **assign cases to ALJs with AI-suggested recommendations**, so that **workloads are balanced and expertise is matched to case type**.
- **Acceptance Criteria:**
  - Manual assignment allows selection of any active ALJ within the relevant district
  - AI suggestion engine analyzes case type, location, and ALJ current caseload to recommend top 3 judges with scores
  - System displays current caseload count and SLA status for each ALJ during assignment
  - Assignment triggers `case.assigned` event and notification to ALJ + Legal Assistant
  - Assignment history preserved in docket events (who assigned, when, method, score)
- **Priority:** P0 (Manual), P1 (AI Suggestion)

### FR-CR-006: Case Transfer Between ALJs
- **Description:** Capability to reassign a case from one ALJ to another due to recusal, leave, or workload balancing.
- **User Story:** As a **Chief Judge**, I want to **transfer a case from one ALJ to another**, so that **adjudication continues without delay if the original ALJ is unavailable**.
- **Acceptance Criteria:**
  - Transfer requires a reason code (Recusal, Leave, Workload, Retirement, Other)
  - All case documents, docket entries, and hearing records remain intact during transfer
  - SLA clock does NOT reset upon transfer
  - Previous ALJ loses write access; new ALJ gains full access immediately
  - Parties are notified of the change in adjudicator via notification service
- **Priority:** P0

### FR-CR-007: SLA Tracking (270-Day Rule)
- **Description:** Automated tracking of statutory deadlines with visual alerts and pause/resume functionality.
- **User Story:** As a **Legal Assistant**, I want **automatic SLA tracking with color-coded alerts**, so that **we avoid statutory breaches on the 270-day decision deadline**.
- **Acceptance Criteria:**
  - System calculates deadline based on Case Type (BLA/LHC = 270 days from docketed date)
  - Visual indicators: Green (>90 days), Amber (30-90 days), Red (<30 days), Breached (past due)
  - Capability to pause SLA clock for specific events (pending motion, medical evaluation, settlement discussions) with start/stop timestamps and reason
  - Dashboard view for Chief Judge showing all cases by SLA status (filterable)
  - Automated notification to ALJ when status turns Amber, to ALJ + Chief Judge when Red
- **Priority:** P0

### FR-CR-008: Case Search and Filtering
- **Description:** Robust search capability across case metadata, parties, and docket entries.
- **User Story:** As a **Docket Clerk**, I want to **search for cases by multiple criteria**, so that **I can quickly locate files for phone inquiries or audits**.
- **Acceptance Criteria:**
  - Searchable fields: Docket Number, Party Name, Attorney Name, Case Type, Status, ALJ, Date Range, District Office
  - Search results load within < 2 seconds for queries returning up to 1000 records
  - Results display key metadata (Status, ALJ, SLA Status, Phase) without opening the case
  - Search respects RBAC (external users only see their own cases)
  - Supports partial matching and fuzzy search for party names
- **Priority:** P0

### FR-CR-009: Case Sealing and Unsealing
- **Description:** Security feature to restrict access to sensitive cases or documents based on protective orders.
- **User Story:** As an **ALJ**, I want to **seal specific documents or entire cases**, so that **sensitive medical or trade secret information is not visible to unauthorized parties**.
- **Acceptance Criteria:**
  - Ability to mark entire Case as sealed (visible only to ALJ + authorized staff)
  - Ability to mark individual Documents as sealed within an otherwise public case
  - Public Portal returns "Case Not Found" for sealed cases to unauthorized users
  - Unsealing requires ALJ or Chief Judge authorization and generates sealed_access_log entry
  - Sealed documents stored in separate GCS bucket with restricted IAM (per ADR-012)
- **Priority:** P1

### FR-CR-010: Case Closure and Disposition
- **Description:** Formal closing of a case with standardized disposition codes for reporting.
- **User Story:** As an **ALJ**, I want to **close a case with a disposition code**, so that **the agency can report accurate outcomes to Congress and DOL leadership**.
- **Acceptance Criteria:**
  - Closure requires selection of a Disposition Code (Decision for Claimant, Decision for Employer, Settled, Withdrawn, Dismissed, Transferred)
  - System prevents closure if mandatory documents (signed Decision & Order) are missing
  - Upon closure, SLA tracking stops and case enters retention period
  - Case moves to `Closed` phase; all parties receive automated notice of closure and appeal rights
  - 30-day appeal window tracked; if no appeal filed, case remains closed; if appeal filed, transitions to `Appealed`
- **Priority:** P0

---

## 4-10: Remaining Sections (In Progress)

The following sections are being developed:

| Section | Domain | Status |
|---------|--------|--------|
| 4. Filing Review Domain | Intake, validation, auto-docketing, deficiency handling | Pending |
| 5. Document Management Domain | Upload, versioning, exhibits, sealed docs, PDF generation | Pending |
| 6. Scheduling Domain | Hearings, courtrooms, reporters, notices | Pending |
| 7. Judicial Workspace Domain | Bench memos, decision drafting, sign/release, redline | Pending |
| 8. AI Engine Domain | Auto-docketing, smart assignment, document analysis, chatbot | Pending |
| 9. Public Portal Domain | Case filing, status lookup, document submission | Pending |
| 10. Notification Domain | Email, in-app, legal service of process | Pending |
| 11. Identity & Access Domain | Auth, RBAC, user management | Pending |
| 12. Reporting & Analytics Domain | Dashboards, SLA reports, caseload statistics | Pending |
| 13. Non-Functional Requirements | Performance, security, accessibility, compliance | Pending |
| 14. API Contract Standards | Error format, pagination, versioning, rate limiting | Pending |
| 15. Release Roadmap | v1.0 through v2.0 | Pending |
| 16. Success Metrics & KPIs | Agency-level success criteria | Pending |

---

*This PRD is a living document. Updates require PO approval and are tracked in the repository.*
