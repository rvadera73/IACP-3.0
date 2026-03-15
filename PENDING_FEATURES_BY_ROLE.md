# IACP Pending Features by Role

## Overview
This document outlines pending features for each role in the IACP system.
**Data Isolation:** OALJ roles only see BLA/LHC/PER cases. Boards roles only see BRB/ARB/ECAB cases.

---

## OALJ Roles (BLA, LHC, PER)

### 1. OALJ Docket Clerk

**Portal:** OALJ Portal  
**Case Types:** BLA, LHC, PER  
**Primary Goal:** Efficient intake, docketing, and judge assignment

#### ✅ Completed
- Dashboard with intake stats
- Docket Management queue with filters
- Judge Workload dashboard
- Case Record Viewer (view-only)
- Channel tracking (UFS, Email, Paper)
- AI scoring for completeness

#### 🚧 Pending (High Priority)
1. **Auto-Docketing Rules Engine**
   - [ ] Implement backend logic for auto-docketing criteria
   - [ ] AI-OCR validation integration
   - [ ] Signature verification
   - [ ] Field completeness check
   - [ ] Auto-assign docket number

2. **Smart Assignment Algorithm**
   - [ ] Weighted workload calculation (BLA=3pts, LHC=2pts, PER=1pt)
   - [ ] Geographic district matching
   - [ ] Judge expertise tags
   - [ ] Random rotation (10% weight)
   - [ ] "Top 3 Suggested Judges" display

3. **Case Transfer Workflow**
   - [ ] Initiate transfer (clerk or judge)
   - [ ] Reason codes (Conflict, Retirement, Workload, Board Remand)
   - [ ] Approval workflow (Chief Judge)
   - [ ] Auto-generate Notice of Reassignment
   - [ ] Digital hand-off between judges

4. **Deficiency Notice Automation**
   - [ ] Auto-highlight errors on PDF
   - [ ] One-click "Issue Deficiency Note"
   - [ ] Pre-populated deficiency letter templates
   - [ ] Email to filer
   - [ ] Track response deadline

5. **Bulk Actions**
   - [ ] Multi-case docketing
   - [ ] Batch assignment
   - [ ] Mass deficiency notices

#### 🚧 Pending (Medium Priority)
- [ ] Email/SMS notifications
- [ ] Reporting chatbot queries (district-level)
- [ ] Export queue to Excel/PDF
- [ ] Historical trend analysis

---

### 2. OALJ Legal Assistant

**Portal:** OALJ Portal  
**Case Types:** BLA, LHC, PER  
**Primary Goal:** Hearing scheduling and exhibit management

#### ✅ Completed
- Dashboard with hearing proximity sorting
- Case cards with timeline sparklines
- Unified Folder view
- Hearings tab in case view

#### 🚧 Pending (High Priority)
1. **Smart Scheduler**
   - [ ] Judge calendar integration
   - [ ] District courtroom availability
   - [ ] Court reporter availability
   - [ ] Optimal date suggestion (14+ days notice)
   - [ ] One-click "Confirm Venue"
   - [ ] One-click "Dispatch Court Reporter"

2. **Notice of Hearing Generator**
   - [ ] Auto-populate from case data
   - [ ] Include all parties (with Pro Se mail flag)
   - [ ] Generate PDF
   - [ ] Email + Certified Mail tracking
   - [ ] Service list validation

3. **Exhibit Management**
   - [ ] Add/Edit exhibit status (Admitted/Rejected/Pending)
   - [ ] Drag-and-drop exhibit organization
   - [ ] Exhibit numbering (CX, EX, DX)
   - [ ] Redaction tools
   - [ ] Pro Se service rules (physical mail checkbox)

4. **Transcript Tracking**
   - [ ] Request court reporter
   - [ ] Track transcript submission
   - [ ] Notify parties when uploaded
   - [ ] Add to record

#### 🚧 Pending (Medium Priority)
- [ ] Video hearing setup (WebEx integration)
- [ ] Subpoena generator
- [ ] Interpreter request workflow
- [ ] Realtime transcript ordering

---

### 3. OALJ Attorney-Advisor

**Portal:** OALJ Portal  
**Case Types:** BLA, LHC, PER  
**Primary Goal:** Draft decisions and legal research

#### ✅ Completed
- Dashboard view
- Drafting tab in Unified Folder
- Bench memo viewer
- Draft decision viewer
- Citation check display (10/10 valid)

#### 🚧 Pending (High Priority)
1. **Bench Memo Editor**
   - [ ] Rich text editor
   - [ ] Pin evidence to memo
   - [ ] Legal issue templates
   - [ ] Standard of review suggestions
   - [ ] Auto-cite regulations (20 C.F.R.)

2. **Citation Checker Integration**
   - [ ] Real-time citation validation
   - [ ] Shepardize/KeyCite integration
   - [ ] Flag overruled cases
   - [ ] Suggest leading cases
   - [ ] "10/10 precedents valid" report

3. **Draft Submission Workflow**
   - [ ] Submit draft to judge button
   - [ ] Version tracking (v1, v2, v3)
   - [ ] Notification to judge
   - [ ] Track judge's edits
   - [ ] Side-by-side comparison

4. **Template Auto-Generation**
   - [ ] Legal caption (party names, case number)
   - [ ] Notice of Appeal Rights (statutory rules)
   - [ ] Findings of Fact template
   - [ ] Conclusions of Law template
   - [ ] Order template

5. **Redline Comparison Tool**
   - [ ] Compare draft versions
   - [ ] Highlight changes
   - [ ] Accept/reject changes
   - [ ] Comment threads

#### 🚧 Pending (Medium Priority)
- [ ] Legal research database integration
- [ ] Prior decision search (same judge, same issue)
- [ ] Remand rate analytics
- [ ] Decision length tracker

---

### 4. OALJ Judge (Administrative Law Judge)

**Portal:** OALJ Portal  
**Case Types:** BLA, LHC, PER  
**Primary Goal:** Conduct hearings and issue decisions

#### ✅ Completed
- Dashboard with 270-day deadline tracking
- Case cards sorted by decision deadline
- Unified Folder view
- Drafting tab access
- Redline mode UI

#### 🚧 Pending (High Priority)
1. **Redline Mode (Decision Editing)**
   - [ ] Edit draft decision
   - [ ] Track changes
   - [ ] Add internal comments (stripped from final)
   - [ ] Sticky notes (private)
   - [ ] Accept/reject AA suggestions

2. **Sign & Release Workflow**
   - [ ] Electronic signature
   - [ ] Final review before release
   - [ ] Auto-generate signature block
   - [ ] Release to docket
   - [ ] Notify parties

3. **Seal Document Action**
   - [ ] Select documents to seal
   - [ ] Reason code (protective order, privacy)
   - [ ] Court order generator
   - [ ] Redact from public view

4. **Close Record Action**
   - [ ] Verify all exhibits admitted/rejected
   - [ ] Confirm transcript filed
   - [ ] Mark record closed
   - [ ] Start decision clock

5. **270-Day Deadline Alerts**
   - [ ] Dashboard warning (<30 days: Red)
   - [ ] Email notification (<14 days)
   - [ ] Chief Judge escalation (<7 days)
   - [ ] Auto-report on overdue cases

6. **Chambers Workspace (Private)**
   - [ ] Private drafting area
   - [ ] Law clerk collaboration
   - [ ] Internal memos (not public)
   - [ ] Research notes

#### 🚧 Pending (Medium Priority)
- [ ] Hearing conduct tools (virtual gavel, exhibit display)
- [ ] On-the-record summary decisions
- [ ] Remand order templates
- [ ] Settlement conference tools

---

## Boards Roles (BRB, ARB, ECAB)

### 5. Board Docket Clerk

**Portal:** Boards Portal  
**Case Types:** BRB, ARB, ECAB  
**Primary Goal:** Appellate intake and record management

#### ❌ Not Built - All Features Pending

#### 🚧 Required (High Priority)
1. **Appellate Intake Queue**
   - [ ] Notice of Appeal validation
   - [ ] Jurisdiction check (timely filing)
   - [ ] Cross-appeal detection
   - [ ] Standing verification
   - [ ] AI-OCR for appeal forms

2. **Record Transmission Tracking**
   - [ ] Request record from OALJ
   - [ ] Track receipt date
   - [ ] Verify completeness
   - [ ] Notify parties when record received
   - [ ] Supplemental record handling

3. **Briefing Schedule Calculator**
   - [ ] Auto-calculate due dates (14/30/14 day rules)
   - [ ] Acknowledgment date
   - [ ] Petitioner brief due
   - [ ] Respondent brief due
   - [ ] Reply brief due
   - [ ] Extension handling

4. **Panel Assignment Coordination**
   - [ ] 3-judge panel selection
   - [ ] Conflict checks
   - [ ] Lead judge designation
   - [ ] Notify panel members

5. **Docketing Actions**
   - [ ] Assign BRB/ARB/ECAB number
   - [ ] Create appellate case record
   - [ ] Link to OALJ case
   - [ ] Generate acknowledgment letter

#### 🚧 Required (Medium Priority)
- [ ] Deficiency notices for appeals
- [ ] Dismissal order generator (untimely)
- [ ] Motion for leave to file late
- [ ] Pro se assistance resources

---

### 6. Board Legal Assistant

**Portal:** Boards Portal  
**Case Types:** BRB, ARB, ECAB  
**Primary Goal:** Oral argument scheduling and panel coordination

#### ❌ Not Built - All Features Pending

#### 🚧 Required (High Priority)
1. **Oral Argument Scheduling**
   - [ ] Panel availability calendar
   - [ ] Courtroom booking
   - [ ] Party availability check
   - [ ] Notice of Argument generator
   - [ ] Video conference setup

2. **Panel Assignment Coordination**
   - [ ] Track panel compositions
   - [ ] Rotate assignments
   - [ ] Handle recusals
   - [ ] Substitute member coordination

3. **Brief Management**
   - [ ] Track brief submissions
   - [ ] Flag overdue briefs
   - [ ] Notify parties of deficiencies
   - [ ] Amicus curiae tracking

4. **Decision Distribution**
   - [ ] Generate decision letters
   - [ ] Email to parties
   - [ ] Update case status
   - [ ] Transmit to OALJ (if remanded)

#### 🚧 Required (Medium Priority)
- [ ] Transcript coordination for oral argument
- [ ] Live-stream setup for public arguments
- [ ] Post-argument briefing requests
- [ ] Settlement conference coordination

---

### 7. Board Attorney-Advisor

**Portal:** Boards Portal  
**Case Types:** BRB, ARB, ECAB  
**Primary Goal:** Appellate legal analysis and draft decisions

#### ❌ Not Built - All Features Pending

#### 🚧 Required (High Priority)
1. **Appellate Bench Memo**
   - [ ] Standard of review analysis
   - [ ] Issues on appeal summary
   - [ ] OALJ decision summary
   - [ ] Party arguments summary
   - [ ] Recommendation to panel

2. **Precedent Search**
   - [ ] Board precedent database
   - [ ] OALJ precedent search
   - [ ] Federal circuit case law
   - [ ] Citation validation

3. **Draft Decision Editor**
   - [ ] Affirm/Reverse/Remand options
   - [ ] Panel member collaboration
   - [ ] Dissent/concurrence editor
   - [ ] Precedential value flag

4. **Record Review Tools**
   - [ ] Side-by-side OALJ vs. Board record
   - [ ] Highlight errors below
   - [ ] Pinpoint citations
   - [ ] Exhibit cross-reference

#### 🚧 Required (Medium Priority)
- [ ] Motion practice (motions to dismiss, motions for reconsideration)
- [ ] Summary affirmance templates
- [ ] Remand instructions generator
- [ ] Precedential decision publication

---

### 8. Board Member

**Portal:** Boards Portal  
**Case Types:** BRB, ARB, ECAB  
**Primary Goal:** Review and decide appeals

#### ❌ Not Built - All Features Pending

#### 🚧 Required (High Priority)
1. **Panel View**
   - [ ] Assigned cases dashboard
   - [ ] Panel member list
   - [ ] Lead judge designation
   - [ ] Upcoming oral arguments

2. **Record Review**
   - [ ] Full appellate record access
   - [ ] OALJ decision below
   - [ ] Briefs (petitioner, respondent, reply)
   - [ ] Oral argument transcript (if held)

3. **Draft Circulation**
   - [ ] Circulate draft to panel
   - [ ] Track member votes
   - [ ] Request changes
   - [ ] Concur/dissent workflow

4. **Decision Actions**
   - [ ] Affirm decision
   - [ ] Reverse decision
   - [ ] Remand to OALJ
   - [ ] Modify decision
   - [ ] Sign and release

5. **Dissent/Concurrence Editor**
   - [ ] Separate opinion writer
   - [ ] Link to majority opinion
   - [ ] Circulate to panel
   - [ ] Publish with decision

#### 🚧 Required (Medium Priority)
- [ ] En banc review requests
- [ ] Reconsideration motions
- [ ] Sanctions authority
- [ ] Precedential designation

---

## Implementation Priority

### Phase 1 (Next Sprint - OALJ Focus)
1. **OALJ Docket Clerk** - Auto-docketing engine, smart assignment
2. **OALJ Legal Assistant** - Smart scheduler, exhibit management
3. **OALJ Attorney-Advisor** - Bench memo editor, citation checker
4. **OALJ Judge** - Redline mode, sign & release workflow

### Phase 2 (Following Sprint - Boards Build)
1. **Board Docket Clerk** - Full appellate intake system
2. **Board Legal Assistant** - Oral argument scheduling
3. **Board Attorney-Advisor** - Appellate bench memo
4. **Board Member** - Panel review and decision tools

### Phase 3 (Enhancements)
- AI chatbot for all roles
- Advanced reporting
- Mobile responsiveness
- Offline capabilities

---

## Data Isolation Rules

**CRITICAL:** Ensure no data overlap between OALJ and Boards

| Rule | Implementation |
|------|----------------|
| OALJ users cannot see BRB/ARB/ECAB cases | Filter by case type in all queries |
| Boards users cannot see BLA/LHC/PER cases | Filter by case type in all queries |
| Separate case number sequences | OALJ: `2024-BLA-00042`, Boards: `BRB No. 24-0123 BLA` |
| Separate filing queues | OALJ intake vs. Appellate intake |
| Separate judge/member lists | ALJs vs. Board Members |
| Separate workflows | OALJ adjudication vs. Appellate review |

---

## Next Steps

1. **Review this document** and confirm role requirements
2. **Prioritize Phase 1 features** (OALJ roles)
3. **Begin implementation** with Docket Clerk auto-docketing
4. **Test data isolation** between OALJ and Boards
5. **Deploy incrementally** by role

**Questions for clarification:**
- Should Board Members have access to OALJ cases for review purposes? (Yes, read-only)
- Should Attorney-Advisors be able to see draft decisions from other chambers? (No, private)
- Should Legal Assistants across districts see each other's schedules? (No, district-isolated)
- What's the appeal timeline for each board? (BRB: 30 days, ARB: varies, ECAB: 30 days)
