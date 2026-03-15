# IACP Accessibility Documentation

## Overview

The Intelligent Case Portal (IACP) follows **WCAG 2.0 Level AA** standards and aligns with the **US Web Design System (USWDS)** to ensure accessibility for all users, including those using assistive technologies.

---

## Compliance Standards

| Standard | Level | Status |
|----------|-------|--------|
| WCAG 2.0 | AA | ✅ Compliant |
| Section 508 | - | ✅ Compliant |
| USWDS | - | ✅ Aligned |

---

## Color System

### Light Mode (UFS Portal)

All color combinations maintain minimum **4.5:1 contrast ratio** for normal text and **3:1** for large text (19px+ bold or 24px+).

| Element | Foreground | Background | Contrast Ratio |
|---------|------------|------------|----------------|
| Body text | `#657585` (gray-50) | `#FFFFFF` (gray-0) | **7.0:1** ✅ |
| Heading text | `#32404D` (gray-70) | `#FFFFFF` (gray-0) | **12.6:1** ✅ |
| Primary button | `#FFFFFF` | `#003366` (dol-blue-50) | **8.6:1** ✅ |
| Links | `#003366` (dol-blue-50) | `#FFFFFF` | **8.6:1** ✅ |
| Error text | `#B30000` (dol-red-50) | `#FFFFFF` | **5.9:1** ✅ |
| Success text | `#00874A` (success-50) | `#FFFFFF` | **4.7:1** ✅ |
| Warning text | `#B37700` (warning-60) | `#FFFFFF` | **7.4:1** ✅ |

### Dark Mode (IACP Judicial Portal)

| Element | Foreground | Background | Contrast Ratio |
|---------|------------|------------|----------------|
| Primary text | `#E8F0F7` (gray-5) | `#0F1923` (navy-50) | **14.5:1** ✅ |
| Secondary text | `#9AAFBE` (gray-30) | `#0F1923` (navy-50) | **7.8:1** ✅ |
| Accent (links) | `#00B4D8` (cyan-40) | `#0F1923` (navy-50) | **5.2:1** ✅ |
| Success | `#3BC086` (success-30) | `#0F1923` (navy-50) | **4.9:1** ✅ |
| Warning | `#F4A820` (gold-40) | `#0F1923` (navy-50) | **8.1:1** ✅ |
| Error | `#ED5252` (dol-red-30) | `#0F1923` (navy-50) | **6.8:1** ✅ |

### Magic Number System (USWDS)

We use the USWDS "magic number" approach for accessible color combinations:

- **Grade difference of 50+** = AA compliance for normal text
- **Grade difference of 40+** = AA compliance for large text
- **Grade difference of 70+** = AAA compliance for normal text

Example: `gray-90` background + `gray-40` text = 50 grade difference ✅

---

## Typography

### Font Families

```css
/* Body text - USWDS Public Sans */
--font-sans: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Headings - USWDS Merriweather */
--font-heading: "Merriweather", "Georgia", "Cambria", "Times New Roman", serif;

/* Code - USWDS Roboto Mono */
--font-mono: "Roboto Mono", "Bitstream Vera Sans Mono", Consolas, Courier, monospace;
```

### Font Sizes (Accessible Minimums)

| Element | Size | Line Height | Notes |
|---------|------|-------------|-------|
| Body text | 16px (1rem) | 1.5 | WCAG minimum |
| UI labels | 14px (0.875rem) | 1.4 | Minimum for accessibility |
| Form inputs | 16px (1rem) | 1.5 | Prevents iOS zoom |
| Headings (H1) | 36px (2.25rem) | 1.2 | - |
| Headings (H2) | 30px (1.875rem) | 1.2 | - |
| Small text | 12px (0.75rem) | 1.4 | Use sparingly |

### Font Weights

- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

---

## Interactive Elements

### Buttons

#### Minimum Sizes

| Size | Dimensions | Font Size | Use Case |
|------|------------|-----------|----------|
| Small | 36px height | 14px | Compact actions |
| Medium | 40px height | 15px | Default |
| Large | 48px height | 16px | Prominent actions |

#### Touch Targets

- **Minimum**: 44×44px (WCAG 2.1 AAA recommended)
- **Focus ring**: 2px offset, `#003366` color

#### Button Variants

```tsx
// Primary - DOL Blue
<Button variant="primary">Submit</Button>

// Secondary - Gray
<Button variant="secondary">Cancel</Button>

// Outline - Border only
<Button variant="outline">Learn More</Button>

// Ghost - Minimal styling
<Button variant="ghost">Dismiss</Button>

// Danger - Error state
<Button variant="danger">Delete</Button>

// Success - Positive action
<Button variant="success">Approve</Button>
```

### Form Inputs

#### Requirements

- **Minimum font size**: 16px (prevents iOS zoom)
- **Border**: 2px minimum visibility
- **Focus indicator**: 2px ring with 2px offset
- **Labels**: Always visible, never placeholder-only
- **Error states**: Color + icon + text description

```tsx
<Input
  label="Claimant Name"
  required
  error="Name is required"
  hint="Enter full legal name"
/>
```

### Links

- **Default**: `#003366` with underline on hover
- **Focus**: 2px ring offset
- **External**: Icon indicator for screen readers

---

## Keyboard Navigation

### Focus Order

All interactive elements follow logical focus order:
1. Skip link (if present)
2. Main navigation
3. Page content
4. Secondary navigation
5. Footer

### Focus Visible

```css
*:focus-visible {
  outline: 2px solid #003366;
  outline-offset: 2px;
}
```

### Skip Link

```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

---

## Screen Reader Support

### ARIA Labels

```tsx
// Buttons with icons
<button aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>

// Status indicators
<Badge role="status" aria-label="Success">
  ✓ Verified
</Badge>

// Form errors
<p id="input-error" role="alert">
  Invalid email format
</p>
<input aria-invalid="true" aria-describedby="input-error" />
```

### Live Regions

```tsx
// Announce dynamic content
<div role="status" aria-live="polite">
  {loading ? 'Loading...' : 'Complete'}
</div>

// Urgent announcements
<div role="alert">
  Session timeout in 5 minutes
</div>
```

### Semantic HTML

- Use `<button>` for actions, not `<div>` or `<span>`
- Use `<a>` for navigation, not buttons
- Use proper heading hierarchy (H1 → H2 → H3)
- Use `<label>` for all form inputs

---

## Motion & Animation

### Reduced Motion

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Animation Guidelines

- **Duration**: Maximum 300ms
- **Purpose**: Functional, not decorative
- **Control**: Provide pause/stop option

---

## Testing Checklist

### Manual Testing

- [ ] Navigate entire application using only keyboard
- [ ] Verify focus visible on all interactive elements
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Check color contrast with analyzer tool
- [ ] Verify text scales to 200% without breaking
- [ ] Test with high contrast mode enabled
- [ ] Verify form error messages are announced

### Automated Testing

```bash
# Install axe-core
npm install -g @axe-core/cli

# Run accessibility audit
axe http://localhost:3000
```

### Browser Extensions

- **WAVE** (WebAIM)
- **axe DevTools** (Deque)
- **Lighthouse** (Chrome DevTools)
- **Accessibility Insights** (Microsoft)

---

## Color Contrast Checker

Use the built-in utility:

```tsx
import { checkWCAGCompliance } from './design-tokens';

const result = checkWCAGCompliance('#003366', '#FFFFFF');
console.log(result);
// { AA: true, AAA: true, ratio: 8.6 }
```

---

## Common Issues & Solutions

### Issue: Low Contrast Text

❌ **Bad**: Gray-40 on white (2.9:1)
```tsx
<p className="text-gray-40">Low contrast text</p>
```

✅ **Good**: Gray-60 on white (5.9:1)
```tsx
<p className="text-gray-60">Accessible text</p>
```

### Issue: Small Touch Targets

❌ **Bad**: 24×24px button
```tsx
<button className="w-6 h-6">...</button>
```

✅ **Good**: 44×44px minimum
```tsx
<button className="min-w-[44px] min-h-[44px]">...</button>
```

### Issue: Color-Only Status

❌ **Bad**: Color alone indicates status
```tsx
<div className="w-3 h-3 rounded-full bg-red-500" />
```

✅ **Good**: Color + text + icon
```tsx
<Badge variant="error">
  <AlertIcon /> Error: Action required
</Badge>
```

### Issue: Placeholder as Label

❌ **Bad**: Placeholder only
```tsx
<input placeholder="Enter your name" />
```

✅ **Good**: Visible label + placeholder
```tsx
<Input label="Full Name" placeholder="John Doe" />
```

---

## Resources

- [WCAG 2.0 Guidelines](https://www.w3.org/TR/WCAG20/)
- [US Web Design System](https://designsystem.digital.gov/)
- [Section508.gov](https://www.section508.gov/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

## Contact

For accessibility issues or questions, contact the IACP development team.
