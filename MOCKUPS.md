# Intelligent Case Portal (IACP) - Prototype Mockups & Storyboard

This document provides high-fidelity visual representations of the key screens within the IACP prototype. These mockups illustrate the modern, human-centered design and AI-integrated workflows.

---

## 1. Unified Landing Page
**Purpose**: The secure entry point for all Department of Labor adjudicatory stakeholders.

![Landing Page Mockup](https://picsum.photos/seed/dol-landing/1200/600?blur=2)

*   **Key Features**:
    *   Role-based entry (Attorney, Claimant, DOL Staff).
    *   Integrated Login.gov authentication.
    *   Direct access to the Interactive Walkthrough module.

---

## 2. UFS External Filing (AI Analysis)
**Purpose**: Real-time validation of legal filings to ensure data quality at the source.

```xml
<svg width="800" height="500" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="500" rx="12" fill="#F8FAFC"/>
  <rect width="200" height="500" fill="#0F172A"/>
  <rect x="220" y="20" width="560" height="460" rx="8" fill="white" stroke="#E2E8F0"/>
  <text x="240" y="50" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1E293B">New Case Filing - Step 2 of 4</text>
  
  <!-- Document Upload Area -->
  <rect x="240" y="80" width="300" height="150" rx="8" fill="#EFF6FF" stroke="#3B82F6" stroke-dasharray="4 4"/>
  <text x="320" y="150" font-family="sans-serif" font-size="12" fill="#3B82F6">Claim_Form_Miller.pdf</text>
  
  <!-- AI Analysis Panel -->
  <rect x="560" y="80" width="220" height="380" rx="8" fill="#ECFDF5" stroke="#10B981"/>
  <text x="575" y="110" font-family="sans-serif" font-size="14" font-weight="bold" fill="#065F46">AI Intake Analysis</text>
  <circle cx="585" cy="140" r="6" fill="#10B981"/>
  <text x="600" y="145" font-family="sans-serif" font-size="10" fill="#065F46">SSN Detected (Verified)</text>
  <circle cx="585" cy="170" r="6" fill="#10B981"/>
  <text x="600" y="175" font-family="sans-serif" font-size="10" fill="#065F46">Signature Found (Page 3)</text>
  <circle cx="585" cy="200" r="6" fill="#10B981"/>
  <text x="600" y="205" font-family="sans-serif" font-size="10" fill="#065F46">Date of Injury Valid</text>
</svg>
```

*   **Differentiator**: The **AI Intake Analysis** panel provides immediate feedback, preventing "incomplete filing" delays.

---

## 3. IACP Internal Intake Queue
**Purpose**: High-speed processing for DOL Clerks using AI-extracted metadata.

```xml
<svg width="800" height="400" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="400" rx="12" fill="#F1F5F9"/>
  <rect x="20" y="20" width="760" height="60" rx="8" fill="white" stroke="#E2E8F0"/>
  <text x="40" y="55" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1E293B">Priority Intake Queue</text>
  
  <!-- Table Row -->
  <rect x="20" y="100" width="760" height="80" rx="8" fill="white" stroke="#E2E8F0"/>
  <text x="40" y="135" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1E293B">INT-2024-081</text>
  <text x="160" y="135" font-family="sans-serif" font-size="12" fill="#64748B">Miller, Robert (BLA)</text>
  <rect x="350" y="120" width="80" height="24" rx="12" fill="#FEF3C7"/>
  <text x="365" y="136" font-family="sans-serif" font-size="10" font-weight="bold" fill="#92400E">AI Verified</text>
  
  <!-- Action Button -->
  <rect x="640" y="120" width="120" height="40" rx="8" fill="#2563EB"/>
  <text x="665" y="145" font-family="sans-serif" font-size="12" font-weight="bold" fill="white">Assign Docket #</text>
</svg>
```

*   **Differentiator**: Clerks can process cases in seconds rather than days by trusting the **AI-Verified** flags.

---

## 4. Chambers Workspace (Judicial Collaboration)
**Purpose**: A secure, integrated environment for drafting and research.

```xml
<svg width="800" height="500" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="500" rx="12" fill="#1E1B4B"/> <!-- Dark Indigo Theme -->
  <rect x="0" y="0" width="800" height="50" fill="#312E81"/>
  <text x="20" y="32" font-family="sans-serif" font-size="14" font-weight="bold" fill="white">Judicial Chambers: Case 2024-BLA-00042</text>
  
  <!-- Three Pane Layout -->
  <rect x="10" y="60" width="180" height="430" rx="8" fill="#312E81" opacity="0.5"/> <!-- Research -->
  <rect x="200" y="60" width="400" height="430" rx="8" fill="white"/> <!-- Editor -->
  <rect x="610" y="60" width="180" height="430" rx="8" fill="#312E81" opacity="0.5"/> <!-- Comments -->
  
  <text x="220" y="100" font-family="serif" font-size="12" fill="#1E293B">DECISION AND ORDER...</text>
  <line x1="220" y1="120" x2="580" y2="120" stroke="#E2E8F0"/>
  
  <!-- Redline Mockup -->
  <text x="220" y="150" font-family="serif" font-size="11" fill="#DC2626" text-decoration="line-through">who performed a study</text>
  <text x="350" y="150" font-family="serif" font-size="11" fill="#2563EB" font-weight="bold">[REVISED: Dr. Miller's 2023 study]</text>
</svg>
```

*   **Differentiator**: The **"Chinese Wall"** protected workspace ensures internal deliberations remain secure and collaborative.

---

## 5. Interactive Walkthrough Module
**Purpose**: High-fidelity stakeholder demonstrations of the end-to-end lifecycle.

![Walkthrough Mockup](https://picsum.photos/seed/dol-walkthrough/1200/600?grayscale)

*   **Key Features**:
    *   Contextual "Key Feature Highlights".
    *   Role-switching (see the system as an Attorney vs. a Judge).
    *   Simulated real-time AI processing.

---

## Summary of Design Language
*   **Palette**: Slate (#0F172A), Indigo (#312E81), Emerald (#10B981), and DOL Blue (#2563EB).
*   **Typography**: Inter (Sans-serif) for UI, Playfair Display (Serif) for legal documents.
*   **Philosophy**: Human-Centered Design (HCD) that prioritizes clarity, speed, and trust.
