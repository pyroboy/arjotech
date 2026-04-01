# Agent Team Roster: Booking Flow Streamline

## Mission
Restructure a 6-step, 22-field tattoo booking flow into a streamlined 4-step, 15-field flow based on UX research. Move the legacy TattooCalculator to a standalone tool page. Verify with Playwright end-to-end tests.

## Goal
- Reduce booking abandonment by cutting superfluous fields (pain level, sq-inch slider, complexity score, urgency, creative freedom slider)
- Keep the impressive TattooCalculator alive as a legacy showcase tool
- Zero compile errors, all Playwright tests green before declaring done

## Team Size
10 agents across 4 phases (max 6 concurrent)

## Execution Time
~10 minutes total (phases overlap)

---

## Phase 1: Foundation (parallel)

### Agent: `data-layer`
- **Type:** general-purpose
- **Mode:** auto
- **Scope:** Types, data files, store — everything other agents depend on
- **Files:**
  - Create `src/lib/data/sizeCategoryMap.ts` (size categories + price range helper)
  - Update `src/lib/types/bookings.ts` (add new fields)
  - Update `src/lib/data/bookingInitialData.ts` (add defaults)
  - Update `src/lib/stores/booking.svelte.ts` (4-step definitions, new validation, localStorage guard)
- **Must finish before:** Phase 2 agents

### Agent: `legacy-tool`
- **Type:** general-purpose
- **Mode:** auto
- **Scope:** Standalone legacy tool page (independent, no dependencies)
- **Files:**
  - Create `src/routes/tools/tattoo-calculator/+page.svelte`
  - Update `src/routes/tools/+page.svelte` (add listing entry)

---

## Phase 2: Components (parallel, after `data-layer` completes)

### Agent: `design-step`
- **Type:** general-purpose
- **Mode:** auto
- **Scope:** Build Step 0 "Your Tattoo" component
- **Files:**
  - Create `src/lib/components/booking/steps/TattooDesignStep.svelte`
  - Sections: style carousel, 2-level body placement, 5 size category cards, color/coverup toggles, optional image upload

### Agent: `vision-step`
- **Type:** general-purpose
- **Mode:** auto
- **Scope:** Build Step 1 "Your Vision" component
- **Files:**
  - Create `src/lib/components/booking/steps/TattooVisionStep.svelte`
  - Sections: single textarea, 3-button creative freedom, first tattoo toggle, conditional cover-up photo upload

### Agent: `contact-step`
- **Type:** general-purpose
- **Mode:** auto
- **Scope:** Build Step 2 "Your Details" component (merges PersonalInfo + Scheduling)
- **Files:**
  - Create `src/lib/components/booking/steps/ContactScheduleStep.svelte`
  - Sections: name/email/phone/DOB, budget range, date picker, time slot grid, referral source dropdown

### Agent: `flow-wiring`
- **Type:** general-purpose
- **Mode:** auto
- **Scope:** Rewire the orchestrator + update review/submit
- **Files:**
  - Update `src/lib/components/booking/BookingFlow.svelte` (4-step routing, preview on step 0, new imports)
  - Update `src/lib/components/booking/steps/ReviewStep.svelte` (price range, new fields, payload mapping, remove ageConfirmed)

---

## Phase 3: Verification (parallel, after all Phase 2 agents complete)

### Agent: `verify-compile`
- **Type:** general-purpose
- **Mode:** auto
- **Scope:** Get dev server running with zero errors. Fix any compile/import/type errors.
- **Actions:** Kill server, clear cache, restart, check output, fix errors, repeat until clean

### Agent: `verify-steps`
- **Type:** general-purpose
- **Mode:** auto
- **Scope:** Playwright tests for the 4-step booking flow
- **Tests:** Modal opens, Step 0 fields enable Next, Step 0 Next disabled without fields, Step 1 renders after Step 0, Step 1 Next always enabled

### Agent: `verify-legacy`
- **Type:** general-purpose
- **Mode:** auto
- **Scope:** Playwright tests for the legacy tool page
- **Tests:** Page loads (200), title + badge visible, CTA to book visible, tools listing includes calculator

### Agent: `verify-persist`
- **Type:** general-purpose
- **Mode:** auto
- **Scope:** Playwright tests for localStorage persistence
- **Tests:** Data stores on open, stale step index resets, stale form data doesn't crash modal

---

## Phase 4: Fix Cycle (conditional, only if Phase 3 finds errors)

### Agents: `fix-1` through `fix-4`
- **Type:** general-purpose
- **Mode:** auto
- **Scope:** Each agent assigned specific errors from verifier reports
- **Actions:** Read error, read file, fix, confirm
- **Cycle:** After fixes, re-run Phase 3 verifiers. Repeat until all tests green.

---

## Execution Order Diagram

```
Phase 1:  [data-layer]──────┐   [legacy-tool]──────────────────
                             │
Phase 2:                     ├──>[design-step]────┐
                             ├──>[vision-step]────┤
                             ├──>[contact-step]───┤
                             └──>[flow-wiring]────┤
                                                  │
Phase 3:                     [verify-compile]─────┤
                             [verify-steps]───────┤
                             [verify-legacy]──────┤
                             [verify-persist]─────┤
                                                  │
Phase 4 (if needed):         [fix-1..fix-4]───────┘──> re-verify
```

## Notes
- All agents use `mode: auto` for autonomous editing
- Phase 2 agents can start immediately (types will exist by compile time) but ideally wait for `data-layer`
- `verify-compile` should launch first in Phase 3 — other verifiers need the dev server running
- Playwright tests need `--headed` flag if WebGL/Three.js is involved (headless Chromium lacks WebGL)
- The team lead coordinates: shuts down completed agents, launches next phase, collects errors, dispatches fix agents
