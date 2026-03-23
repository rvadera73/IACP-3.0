# Wave 2 Tasks - Codex (Full-Stack Takeover)

**Date:** March 23, 2026  
**Agent:** OpenAI Codex  
**Focus:** Frontend Integration + Testing (originally Copilot's work)

---

## 🎯 Wave 2 Goal

Connect existing UI to real backend API and add comprehensive testing.

**Why Codex is doing this:** GitHub Copilot hit daily quota limit. Codex will complete both backend AND frontend tasks.

---

## 📋 6 Tasks

### Task 1: Connect EFSPortal to API (P0)
**File:** `src/components/EFSPortal.tsx` (update)

**Requirements:**
- [ ] Replace mock data with `useFilings()` hook
- [ ] Replace mock filing submission with `useCreateFiling()` mutation
- [ ] Add loading states
- [ ] Add error handling

**Changes:**
```typescript
// BEFORE (mock data)
const [filings, setFilings] = useState(MOCK_FILINGS);

// AFTER (real API)
const { data: filings, isLoading, error } = useFilings();

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
```

**Context:**
- Read: `src/components/EFSPortal.tsx` (1,238 lines)
- Read: `src/hooks/useFilings.ts` (already created)
- Read: `src/services/api.ts` (already created)

---

### Task 2: Connect DocketClerkDashboard to API (P0)
**File:** `src/components/iacp/DocketClerkDashboard.tsx` (update)

**Requirements:**
- [ ] Replace mock intake queue with API hook
- [ ] Replace mock auto-docket with mutation
- [ ] Replace mock judge assignment with mutation
- [ ] Add loading states
- [ ] Add error handling

**Changes:**
```typescript
// BEFORE
const handleDocket = async (intakeId) => { /* mock */ };

// AFTER
const docketMutation = useMutation({
  mutationFn: (intakeId) => api.docket(intakeId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['intake-queue'] });
  }
});
```

**Context:**
- Read: `src/components/iacp/DocketClerkDashboard.tsx` (752 lines)
- Read: `src/hooks/useFilings.ts`
- Read: `backend/app/api/ai.py` (for docket endpoint)

---

### Task 3: Add Loading States (P1)
**Files:** Create `src/components/UI/Spinner.tsx` and `src/components/UI/Skeleton.tsx`

**Requirements:**
- [ ] Create `<Spinner />` component for full-page loading
- [ ] Create `<Skeleton />` component for content placeholders
- [ ] Add to all data-fetching components
- [ ] Consistent Tailwind styling

**Implementation:**
```typescript
// src/components/UI/Spinner.tsx
export function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

// src/components/UI/Skeleton.tsx
export function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>;
}
```

---

### Task 4: Add Error Handling (P1)
**Files:** Create `src/components/UI/ErrorToast.tsx` and `src/components/UI/ErrorBoundary.tsx`

**Requirements:**
- [ ] Create `<ErrorToast />` for API errors with retry button
- [ ] Create `<ErrorBoundary />` for React error boundaries
- [ ] User-friendly error messages
- [ ] Toast notifications

**Implementation:**
```typescript
// src/components/UI/ErrorToast.tsx
export function ErrorToast({ error, onRetry }) {
  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
      <p className="font-bold">Error</p>
      <p className="text-sm">{error.message}</p>
      <button onClick={onRetry} className="mt-2 bg-white text-red-500 px-3 py-1 rounded">
        Retry
      </button>
    </div>
  );
}
```

---

### Task 5: Write Component Tests (P1)
**Files:** `src/components/**/*.test.tsx`

**Requirements:**
- [ ] Test EFSPortal renders correctly
- [ ] Test DocketClerkDashboard renders correctly
- [ ] Test loading states display
- [ ] Test error states display
- [ ] Achieve 70%+ code coverage

**Test Example:**
```typescript
// src/components/EFSPortal.test.tsx
describe('EFSPortal', () => {
  it('renders loading state', () => {
    // Mock API to delay
    render(<EFSPortal />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  it('renders filings data', async () => {
    // Mock API response with seeded data
    render(<EFSPortal />);
    expect(await screen.findByText(/Robert Martinez/i)).toBeInTheDocument();
  });
});
```

**Testing Commands:**
```bash
npm test
npm run test:coverage
```

---

### Task 6: Write E2E Tests (P2)
**Files:** `tests/e2e/**/*.test.ts`

**Requirements:**
- [ ] Test filing submission flow
- [ ] Test docket clerk workflow
- [ ] Test judge assignment flow
- [ ] Playwright tests

**Test Example:**
```typescript
// tests/e2e/filing-flow.test.ts
import { test, expect } from '@playwright/test';

test('user can submit filing', async ({ page }) => {
  await page.goto('/');
  await page.click('text=File a Case');
  await page.fill('[name="claimantName"]', 'Test User');
  await page.click('text=Submit');
  await expect(page.locator('text=Success')).toBeVisible();
});
```

**E2E Testing Commands:**
```bash
npx playwright test
```

---

## ✅ Definition of Done

- [ ] All 6 tasks complete
- [ ] EFSPortal connected to real API
- [ ] DocketClerkDashboard connected to real API
- [ ] Loading states throughout app
- [ ] Error handling throughout app
- [ ] Tests written (70%+ coverage)
- [ ] Code committed to git
- [ ] Frontend builds without errors

---

## 📞 How to Work

1. **Read context from files:**
   - `WAVE_2_COPILOT.md` - Original task spec
   - `src/components/` - Existing components
   - `src/hooks/` - API hooks (already created)
   - `docs/EXISTING_COMPONENTS_INVENTORY.md` - What exists

2. **Start with Task 1** (EFSPortal), then Task 2 (DocketClerk), then Task 3 (Loading), then Task 4 (Error handling), then Task 5-6 (Tests)

3. **Test each component:**
   ```bash
   # Run component tests
   npm test
   
   # Run E2E tests
   npx playwright test
   
   # Check coverage
   npm run test:coverage
   ```

4. **Commit when done:**
   ```bash
   git add -A
   git commit -m "feat: Wave 2 - Connect UI to API + Loading/Error states + Tests (Codex takeover)
   
   - Task 1: EFSPortal connected to real API
   - Task 2: DocketClerkDashboard connected to real API
   - Task 3: Loading states added (Spinner, Skeleton)
   - Task 4: Error handling added (ErrorToast, ErrorBoundary)
   - Task 5: Component tests written (75% coverage)
   - Task 6: E2E tests written (Playwright)
   
   All components tested and working with backend API."
   git push origin main
   ```

---

## 🔗 Related Files

**Backend (Already Complete by Codex):**
- `backend/app/services/google_oauth.py`
- `backend/app/services/ai_stream.py`
- `backend/app/services/email.py`
- `backend/app/models/database.py`

**Frontend (To Update):**
- `src/components/EFSPortal.tsx`
- `src/components/iacp/DocketClerkDashboard.tsx`
- `src/components/UI/` (create Spinner, Skeleton, ErrorToast, ErrorBoundary)
- `src/components/**/*.test.tsx` (create)
- `tests/e2e/` (create)

---

**Start NOW by reading `src/components/EFSPortal.tsx` and `src/hooks/`, then implement Task 1 (EFSPortal API integration).**

Good luck! 🚀
