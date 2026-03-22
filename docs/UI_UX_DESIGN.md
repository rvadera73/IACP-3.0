# IACP 3.0 - UI/UX Design Principles & Implementation Guide

**Version:** 3.0  
**Date:** March 22, 2026  
**Phase:** 1 - Core Workflows (Public E-Filing + Docket Clerk IACP)

---

## 1. Design Philosophy

### 1.1 Human-Centered Design (HCD) Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| **Clarity Over Completeness** | Show only what's needed now; progressive disclosure for details | Collapsible panels, tabbed interfaces, modal dialogs |
| **AI as Co-pilot** | AI suggests, human decides; never auto-execute judicial actions | AI scores with confidence indicators, "Review & Confirm" workflows |
| **Reduce Screen Hops** | All case information in one workspace; no navigation to see related data | 3-pane Case Intelligence Hub, embedded document viewer |
| **Prevent Errors** | Validate at point of entry; block incomplete submissions | Real-time AI validation, required field enforcement |
| **Transparent Automation** | Show what AI is doing and why; build trust through visibility | AI analysis panels, confidence scores, explanation tooltips |
| **Consistent Patterns** | Same interaction patterns across all screens | Shared component library, standardized action menus |
| **Accessible by Default** | WCAG 2.1 AA compliance from day one | Semantic HTML, ARIA labels, keyboard navigation, color contrast |

### 1.2 Visual Design Language

**Color Palette:**
```
Primary (DOL Blue):    #2563EB  (Actions, links, primary buttons)
Secondary (Slate):     #0F172A  (Headers, navigation, text)
Success (Emerald):     #10B981  (AI verified, complete, approved)
Warning (Amber):       #F59E0B  (AI caution, pending review)
Error (Red):           #EF4444  (Deficiencies, errors, overdue)
Info (Sky):            #0EA5E9  (Informational, tooltips)
Neutral (Gray):        #64748B  (Secondary text, borders)
```

**Typography:**
- **UI Text:** Inter (Sans-serif) - Clean, readable at all sizes
- **Legal Documents:** Playfair Display or Georgia (Serif) - Traditional, authoritative
- **Monospace:** JetBrains Mono - Code, docket numbers, legal citations

**Spacing System:**
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Consistent padding/margins across all components

---

## 2. User Experience Workflows

### 2.1 Public E-Filing Workflow (External Portal)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Public E-Filing Journey                       │
│                                                                  │
│  [1] Landing Page                                               │
│       │                                                         │
│       ▼                                                         │
│  [2] Google OAuth Login                                         │
│       │                                                         │
│       ▼                                                         │
│  [3] Select Filing Type                                         │
│       │  • New Case (BLA/LHC/PER)                               │
│       │  • Motion in Existing Case                              │
│       │  • Notice of Appearance                                 │
│       ▼                                                         │
│  [4] Party Information                                          │
│       │  • Claimant/Employer details                            │
│       │  • Representation status                                │
│       │  • Service preference (electronic/mail)                 │
│       ▼                                                         │
│  [5] Document Upload + AI Validation ⭐                         │
│       │  • Drag & drop upload                                   │
│       │  • Real-time AI analysis (PII, signature, fields)       │
│       │  • Immediate feedback panel                             │
│       │  • Auto-categorization of documents                     │
│       ▼                                                         │
│  [6] Review & Confirm                                           │
│       │  • Preview extracted metadata                           │
│       │  • Confirm accuracy                                     │
│       │  • Pay filing fee (Pay.gov integration)                 │
│       ▼                                                         │
│  [7] Submission Complete                                        │
│       │  • Receive Intake ID                                    │
│       │  • Track status                                         │
│       │  • Email confirmation                                   │
│       ▼                                                         │
│  [8] Dashboard                                                  │
│          • My Filings                                           │
│          • Status Updates                                       │
│          • Deficiency Responses                                 │
└─────────────────────────────────────────────────────────────────┘

⭐ Key AI Integration Point: Real-time validation during upload
```

### 2.2 Docket Clerk Workflow (Internal Portal)

```
┌─────────────────────────────────────────────────────────────────┐
│                  Docket Clerk Journey                            │
│                                                                  │
│  [1] Dashboard                                                  │
│       │  • Priority Intake Queue                                │
│       │  • Awaiting Assignment                                  │
│       │  • Deficiency Responses                                 │
│       ▼                                                         │
│  [2] Review Filing (Case Viewer) ⭐                             │
│       │  • 3-pane layout:                                       │
│       │    - Left: Party list, representatives                  │
│       │    - Center: Document viewer with AI highlights         │
│       │    - Right: AI insights, extracted metadata             │
│       │  • AI validation score (0-100)                          │
│       │  • Deficiency list (if any)                             │
│       ▼                                                         │
│  [3A] Auto-Docket (Score ≥ 90)                                  │
│       │  • Click "Assign Docket #"                              │
│       │  • System generates docket number                       │
│       │  • Creates initial docket events                        │
│       │  • Moves to Assignment Queue                            │
│       ▼                                                         │
│  [3B] Manual Review (Score < 90)                                │
│       │  • Review AI-flagged deficiencies                       │
│       │  • Override AI if needed                                │
│       │  • Send Deficiency Notice                               │
│       ▼                                                         │
│  [4] Smart Assignment ⭐                                        │
│       │  • Click "Assign Judge"                                 │
│       │  • AI suggests Top 3 judges with:                       │
│       │    - Workload score (40%)                               │
│       │    - Geography match (30%)                              │
│       │    - Expertise match (20%)                              │
│       │    - Rotation fairness (10%)                            │
│       │  • AI explains each suggestion                          │
│       │  • Clerk confirms or overrides                          │
│       ▼                                                         │
│  [5] Post-Assignment                                            │
│          • Case moves to assigned judge                         │
│          • Parties notified                                     │
│          • Appears in "My Assigned Cases" for judge             │
└─────────────────────────────────────────────────────────────────┘

⭐ Key AI Integration Points: Validation scoring, smart assignment
```

---

## 3. Component Specifications

### 3.1 AI Validation Panel (Public E-Filing)

**Location:** Right sidebar during document upload  
**Purpose:** Real-time feedback on filing completeness

```typescript
interface AIValidationPanelProps {
  // Current validation state
  aiScore: number;              // 0-100
  isComplete: boolean;
  
  // Detected elements
  detectedElements: {
    ssn: { detected: boolean; verified: boolean; redacted?: boolean };
    signature: { detected: boolean; page: number; confidence: number };
    dateOfInjury: { detected: boolean; value: string; valid: boolean };
    claimantName: { detected: boolean; value: string };
    employerName: { detected: boolean; value: string };
  };
  
  // Deficiencies
  deficiencies: Deficiency[];
  
  // Actions
  onFixClick: (deficiency: Deficiency) => void;
  onIgnoreClick: (deficiency: Deficiency) => void;
}

// Visual States:
// - Scanning: Animated spinner, "AI is analyzing..."
// - Complete: Green checkmarks, "Ready to submit"
// - Deficient: Red/yellow warnings, "Fix required fields"
```

**Mockup:**
```
┌─────────────────────────────────────────┐
│  AI Intake Analysis                     │
├─────────────────────────────────────────┤
│  Overall Score: 98/100  ✅ Excellent    │
├─────────────────────────────────────────┤
│  ✅ SSN Detected (Verified)             │
│  ✅ Signature Found (Page 3)            │
│  ✅ Date of Injury: 08/15/2025          │
│  ✅ Claimant: Robert Martinez           │
│  ✅ Employer: Harbor Freight Inc.       │
├─────────────────────────────────────────┤
│  ⚠️  Missing: Medical Evidence          │
│     [Add Document] [Ignore]             │
├─────────────────────────────────────────┤
│  Status: Ready to Submit ✅             │
└─────────────────────────────────────────┘
```

---

### 3.2 Case Intelligence Hub (3-Pane Layout)

**Location:** Main case viewer for Docket Clerk  
**Purpose:** Complete case information in one screen

```typescript
interface CaseIntelligenceHubProps {
  caseId: string;
  perspective: 'trial' | 'appellate';
  
  // Left Pane: Entity Navigator
  parties: Party[];
  representatives: Representative[];
  
  // Center Pane: Workspace
  activeTab: 'docket' | 'documents' | 'hearings' | 'motions';
  
  // Right Pane: AI Insights
  aiScore: number;
  aiInsights: AIInsight[];
  extractedMetadata: Record<string, any>;
  
  // Actions
  onDocketClick: () => void;
  onAssignClick: () => void;
  onDeficiencyClick: () => void;
}
```

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Case Header                                                    │
│  2026-BLA-00011 | Robert Martinez v. Harbor Freight Inc.       │
│  Status: Awaiting Assignment | AI Score: 98                    │
├──────────────┬─────────────────────────────┬───────────────────┤
│  ENTITIES   │  WORKSPACE                  │  AI INSIGHTS      │
│  ─────────  │  ─────────                  │  ───────────      │
│  Parties    │  [Docket] [Documents]       │  Validation       │
│  ├─ Martinez│  [Hearings] [Motions]       │  ✅ Complete      │
│  │  (Claim)│                             │                   │
│  ├─ Harbor  │  ┌─────────────────────┐   │  Detected Fields  │
│  │  (Empl) │  │ LS-203 Claim Form   │   │  ✅ SSN           │
│  │         │  │ Filed: 2026-03-15   │   │  ✅ Signature     │
│  │  Rep:   │  │                     │   │  ✅ Date of Injury│
│  │  J.Smith│  │ [Document Preview]  │   │  ✅ Employer Name │
│  │         │  │                     │   │                   │
│  Reps     │  │                     │   │  Recommendations  │
│  ├─ J.Doe │  │                     │   │  • Auto-docket    │
│  │  (Mart)│  │                     │   │    ready (98/100) │
│  ├─ Hansen│  │                     │   │  • Assign to:     │
│     (Hrb) │  │                     │   │    Hon. S.Jenkins │
│                             │  AI Reasoning     │
│  Organizations│  │                     │   │  • Low workload   │
│  ├─ Legal Aid│  │                     │   │  • Pittsburgh office│
│  ├─ Hansen & │  │                     │   │  • BLA expertise  │
│     Assoc    │  └─────────────────────┘   │                   │
│                             │  [Docket Case]    │
│                             │  [Send Deficiency]│
└──────────────┴─────────────────────────────┴───────────────────┘
```

---

### 3.3 Document Viewer with Versioning

**Location:** Center pane of Case Intelligence Hub  
**Purpose:** View, compare, and manage document versions

```typescript
interface DocumentViewerProps {
  documentId: string;
  currentVersion: number;
  versions: DocumentVersion[];
  
  // Features
  showRedlines: boolean;
  showAnnotations: boolean;
  zoom: number;  // 50-200%
  
  // Actions
  onVersionChange: (version: number) => void;
  onCompareVersions: (v1: number, v2: number) => void;
  onDownloadClick: () => void;
  onPrintClick: () => void;
  onAnnotateClick: () => void;
}

interface DocumentVersion {
  versionNumber: number;
  createdAt: string;
  createdBy: User;
  changeNote?: string;
  isCurrent: boolean;
  gcsPath: string;
}
```

**Version Comparison View:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Decision Draft v2 vs v3                                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [← Previous]  Version 2  →  Version 3  [Next →]  [Side-by-Side]│
│                                                                 │
│  ┌─────────────────────────┬─────────────────────────────────┐ │
│  │  Version 2 (Original)   │  Version 3 (Current)            │ │
│  ├─────────────────────────┼─────────────────────────────────┤ │
│  │  The claimant is        │  The claimant is                │ │
│  │  disabled.              │  <span class="delete">disabled</span>│ │
│  │                         │  <span class="insert">totally   │ │
│  │                         │  disabled due to pneumoconiosis</span>││
│  │                         │                                 │ │
│  │  Based on the medical  │  Based on Dr. Smith's 2024     │ │
│  │  evidence...           │  evaluation and qualifying     │ │
│  │                        │  pulmonary function tests...    │ │
│  └─────────────────────────┴─────────────────────────────────┘ │
│                                                                 │
│  Change Note: "Added specificity to disability finding per     │
│                20 C.F.R. § 718.204 requirements"                │
│                                                                 │
│  [Accept Changes] [Reject Changes] [Download Comparison]        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.4 Smart Assignment Modal

**Location:** Modal dialog from Docket Clerk dashboard  
**Purpose:** AI-powered judge assignment with explanations

```typescript
interface SmartAssignmentModalProps {
  caseType: ProgramCode;
  office: string;
  
  // AI suggestions
  suggestedJudges: JudgeSuggestion[];
  
  // Actions
  onAssignClick: (judgeId: string) => void;
  onOverrideClick: (judgeId: string, reason: string) => void;
}

interface JudgeSuggestion {
  rank: number;  // 1, 2, 3
  judge: Judge;
  score: number;
  breakdown: {
    workload: number;      // 40%
    geography: number;     // 30%
    expertise: number;     // 20%
    rotation: number;      // 10%
  };
  aiReasons: string[];
}
```

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Smart Case Assignment                                          │
│  Case: 2026-BLA-00011 | Pittsburgh Office                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  #1 RECOMMENDED                                           │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  Hon. Sarah Jenkins          Score: 92/100                │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  📊 Workload: 58/75 (Low)      ████████░░  40/40         │ │
│  │  📍 Pittsburgh Office          ████████░░  30/30         │ │
│  │  ⚖️ BLA Specialist             ████████░░  20/20         │ │
│  │  🔄 Last assigned: 5 days ago  ████████░░   2/10         │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  AI Reasons:                                            │ │
│  │  ✅ Lowest workload in Pittsburgh office                 │ │
│  │  ✅ Black Lung specialization matches case type          │ │
│  │  ✅ 96% on-time decision rate                            │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  [Assign to Hon. S. Jenkins]                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  #2 ALTERNATIVE                                           │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  Hon. Michael Ross             Score: 78/100              │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  📊 Workload: 42/75 (Very Low) ██████████  40/40         │ │
│  │  📍 New York Office            ████░░░░░░  12/30         │ │
│  │  ⚖️ LHC/PER Specialist         ████████░░  20/20         │ │
│  │  🔄 Last assigned: 12 days ago ██████████  10/10         │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  AI Reasons:                                            │ │
│  │  ⚠️ Different office (geography mismatch)                │ │
│  │  ✅ Available capacity                                   │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  [Assign to Hon. M. Ross]                                │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [Override AI Suggestion]  [Cancel]                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Accessibility Requirements

### 4.1 WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| **Color Contrast** | All text meets 4.5:1 ratio; UI components 3:1 |
| **Keyboard Navigation** | All interactive elements focusable; logical tab order |
| **Screen Reader Support** | ARIA labels on all buttons, icons, form fields |
| **Focus Indicators** | Visible focus rings on all interactive elements |
| **Error Identification** | Clear error messages with field identification |
| **Input Assistance** | Labels, placeholders, and help text for all inputs |
| **Responsive Design** | Works at 320px width; zoom to 200% |

### 4.2 Screen Reader Announcements

```typescript
// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {aiScore >= 90 && 'AI validation complete. Filing is ready to submit.'}
  {aiScore < 90 && aiScore >= 70 && 'AI validation complete. Some fields need review.'}
  {aiScore < 70 && 'AI validation complete. Multiple deficiencies detected.'}
</div>

// Icon descriptions
<button aria-label="Assign docket number (AI verified)">
  <CheckCircleIcon aria-hidden="true" />
  Assign Docket #
</button>
```

---

## 5. Responsive Design

### 5.1 Breakpoints

```css
/* Mobile: 320px - 639px */
@media (max-width: 639px) {
  /* Stack all panes vertically */
  /* Hide non-essential UI */
  /* Hamburger menu for navigation */
}

/* Tablet: 640px - 1023px */
@media (min-width: 640px) and (max-width: 1023px) {
  /* 2-pane layout (hide right pane) */
  /* Collapsible left pane */
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  /* Full 3-pane layout */
  /* All features visible */
}
```

### 5.2 Mobile-First Patterns

- **Priority+ Navigation:** Most important actions always visible; overflow in menu
- **Progressive Disclosure:** Show summary first; expand for details
- **Touch Targets:** Minimum 44x44px for all interactive elements
- **Swipe Gestures:** Swipe left/right to navigate between tabs

---

## 6. Design System Components

### 6.1 Core Components (from `src/components/UI.tsx`)

| Component | Props | Usage |
|-----------|-------|-------|
| `Card` | className, children, variant | Container for content blocks |
| `Badge` | variant, size, children | Status indicators, tags |
| `Button` | variant, size, leftIcon, rightIcon | All action buttons |
| `ActionMenu` | items, align | Dropdown action menus |
| `Modal` | isOpen, onClose, title, children | Dialog overlays |
| `Tabs` | tabs, activeTab, onChange | Tabbed interfaces |

### 6.2 AI-Specific Components

| Component | Purpose |
|-----------|---------|
| `AIValidationPanel` | Real-time filing validation feedback |
| `AIInsightCard` | Display AI recommendations with confidence |
| `ScoreGauge` | Circular progress indicator for AI scores |
| `DeficiencyList` | List of AI-detected issues with actions |
| `SmartAssignmentModal` | Judge assignment with AI explanations |

---

## 7. Phase 1 Implementation Priority

### Week 1-2: Public E-Filing
- [ ] Landing page with role selection
- [ ] Google OAuth login flow
- [ ] Filing type selection wizard
- [ ] Party information forms
- [ ] **Document upload + AI validation panel** ⭐
- [ ] Review & confirm screen
- [ ] Submission confirmation

### Week 3-4: Docket Clerk IACP
- [ ] Dashboard with priority intake queue
- [ ] **Case Intelligence Hub (3-pane)** ⭐
- [ ] **Document viewer with versioning** ⭐
- [ ] Auto-docketing workflow
- [ ] Deficiency notice generation
- [ ] **Smart assignment modal** ⭐
- [ ] Post-assignment notifications

### Week 5: Polish & Testing
- [ ] Accessibility audit
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] User testing sessions
- [ ] Bug fixes

---

**Next Steps:**
1. Review design principles with stakeholders
2. Create Figma mockups for key screens
3. Implement core components in `src/components/UI.tsx`
4. Build Public E-Filing flow
5. Build Docket Clerk IACP flow
6. User testing and iteration
