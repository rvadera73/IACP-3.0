# Wave 2 Tasks - Copilot (Frontend Focus)

**Date:** March 23, 2026  
**Agent:** GitHub Copilot  
**Focus:** Frontend Integration & Testing

---

## 🎯 Wave 2 Goal

Connect existing UI to real backend:
- EFSPortal.tsx uses real API
- DocketClerkDashboard.tsx uses real API
- Loading states throughout
- Error handling throughout
- Comprehensive tests

---

## 📋 Tasks

### Task 1: Connect EFSPortal to API
**Priority:** P0  
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

---

### Task 2: Connect DocketClerkDashboard to API
**Priority:** P0  
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

---

### Task 3: Add Loading States
**Priority:** P1  
**Files:** All components using hooks

**Requirements:**
- [ ] Create `<Spinner />` component
- [ ] Create `<Skeleton />` component
- [ ] Add to all data-fetching components
- [ ] Consistent styling

**Implementation:**
```typescript
// src/components/UI/Spinner.tsx
export function Spinner() {
  return <div className="spinner">Loading...</div>;
}

// Usage
if (isLoading) return <Spinner />;
```

---

### Task 4: Add Error Handling
**Priority:** P1  
**Files:** All components using hooks

**Requirements:**
- [ ] Create `<ErrorToast />` component
- [ ] Create error boundaries
- [ ] Add retry logic
- [ ] User-friendly error messages

**Implementation:**
```typescript
// src/components/UI/ErrorToast.tsx
export function ErrorToast({ error, onRetry }) {
  return (
    <div className="error-toast">
      <p>{error.message}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
}
```

---

### Task 5: Write Component Tests
**Priority:** P1  
**Files:** `src/components/**/*.test.tsx`

**Requirements:**
- [ ] Test EFSPortal renders
- [ ] Test DocketClerkDashboard renders
- [ ] Test loading states
- [ ] Test error states
- [ ] 70%+ coverage

**Implementation:**
```typescript
// src/components/EFSPortal.test.tsx
describe('EFSPortal', () => {
  it('renders loading state', () => {
    // Mock API to delay
    render(<EFSPortal />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  it('renders filings data', async () => {
    // Mock API response
    render(<EFSPortal />);
    expect(await screen.findByText(/Robert Martinez/i)).toBeInTheDocument();
  });
});
```

---

### Task 6: Write E2E Tests
**Priority:** P2  
**Files:** `tests/e2e/**/*.test.ts`

**Requirements:**
- [ ] Test filing submission flow
- [ ] Test docket clerk workflow
- [ ] Test judge assignment
- [ ] Playwright tests

**Implementation:**
```typescript
// tests/e2e/filing-flow.test.ts
test('user can submit filing', async ({ page }) => {
  await page.goto('/');
  await page.click('text=File a Case');
  await page.fill('[name="claimantName"]', 'Test User');
  await page.click('text=Submit');
  await expect(page.locator('text=Success')).toBeVisible();
});
```

---

## ✅ Definition of Done

- [ ] All 6 tasks complete
- [ ] EFSPortal connected to API
- [ ] DocketClerkDashboard connected to API
- [ ] Loading states everywhere
- [ ] Error handling everywhere
- [ ] Tests written (70%+ coverage)
- [ ] Code committed to git
- [ ] Frontend builds without errors

---

## 📞 How to Work

1. **Read context from files:**
   - `todo.md` - Overall tasks
   - `src/components/` - Existing components
   - `src/hooks/` - API hooks
   - `docs/EXISTING_COMPONENTS_INVENTORY.md` - What exists

2. **Update components as specified above**

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
   git commit -m "feat: Wave 2 - Connect UI to API, add tests"
   git push origin main
   ```

---

**Start with Task 1 (EFSPortal), then Task 2 (DocketClerk), then Task 3 (Loading), then Task 4 (Error handling), then Task 5-6 (Tests)**

Good luck! 🚀
