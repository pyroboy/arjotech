# Auth Fix Plan - ArjoStyle Web

## TL;DR

> **Quick Summary**: Fix Better Auth v1.5.6 configuration - align schema, add missing env vars, verify login/logout/session flows for the single admin user.
> 
> **Deliverables**:
> - Auth schema unified (single source of truth)
> - All required env vars in `.env`
> - Working login at `/admin/login`
> - Working logout at `/admin/logout`
> - Sessions persist correctly across requests
> - Admin routes protected
> 
> **Estimated Effort**: Short (3-5 tasks, focused fix)
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Schema check → Env vars → Login/logout verification → Test

---

## Context

### Original Request
Fix auth so login, logout, and sessions work. User reports "nothing works." Single admin user only - no registration needed.

### Interview Summary
- **User confirmed**: Only one admin user exists, created via `seed-admin.ts`
- **Auth method**: Better Auth v1.5.6 (already installed)
- **Issue**: "Nothing works" - auth system misconfigured/broken

### Research Findings
- **Root cause identified**: Two conflicting auth schemas exist:
  - `auth-schema.ts`: manual, UUID PKs, **plural** table names (`users`, `sessions`)
  - `auth-schema-generated.ts`: Better Auth expected, text PKs, **singular** names (`user`, `session`)
  - Drizzle adapter points to `auth-schema-generated.ts` but confusion may exist
- **Missing env vars**: `BETTER_AUTH_URL`, `TURNSTILE_SECRET_KEY`
- **Hardcoded secrets**: Turnstile secret in `+page.server.ts`
- **Trusted origins**: Missing `https://www.arjostyle.com`

### Metis Review (Gaps Identified)
- **CRITICAL**: No database backup before schema migration
- **CRITICAL**: No rollback plan if migration fails
- **HIGH**: Missing executable acceptance criteria (curl commands)
- **HIGH**: Edge cases not tested (wrong password, expired session, etc.)
- **MEDIUM**: No CSRF protection verification
- **MEDIUM**: No rate limiting verification on auth endpoints

---

## Work Objectives

### Core Objective
Make login, logout, and sessions work for the single admin user via Better Auth v1.5.6.

### Concrete Deliverables
- [Exact file] `src/lib/server/auth.ts` - Auth configuration cleaned up
- [Exact file] `src/lib/db/auth-schema.ts` - Removed or aligned
- [Exact file] `.env` - All required env vars present
- [Exact route] `/admin/login` - Working login form
- [Exact route] `/admin/logout` - Working logout action
- [Exact route] `/admin/*` - Protected routes redirect to login

### Definition of Done
- [ ] Login with admin credentials redirects to `/admin` without error
- [ ] Logout clears session and redirects to `/admin/login`
- [ ] Protected route access without session redirects to login
- [ ] Session persists across page refreshes for 7 days

### Must Have
- Login works with admin email/password
- Logout clears session cookie
- Admin routes redirect to login when unauthenticated
- Session cookie is httpOnly and secure (in production)

### Must NOT Have (Guardrails)
- NO register/signup route (user confirmed single admin)
- NO new user creation UI
- NO password reset flow
- NO OAuth providers
- NO exposing internal errors to users
- NO committing secrets to git

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** - ALL verification is agent-executed. No exceptions.

### QA Policy
Every task includes agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/`.

- **Frontend/UI**: Use Playwright - Navigate, fill form, assert DOM, screenshot
- **TUI/CLI**: Use interactive_bash (tmux) - Run command, send keystrokes, validate output
- **API/Backend**: Use Bash (curl) - Send requests, assert status + response fields

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - foundation):
├── Task 1: Database backup (backup before any changes)
└── Task 2: Schema alignment verification (inspect generated schema)

Wave 2 (After Wave 1 - config fixes, MAX PARALLEL):
├── Task 3: Environment variables fix (add BETTER_AUTH_URL, TURNSTILE_SECRET_KEY)
├── Task 4: Trusted origins fix (add www subdomain)
├── Task 5: Hardcoded secret removal (move Turnstile to env)
└── Task 6: Auth config cleanup (remove duplicate schema references)

Wave 3 (After Wave 2 - verification):
├── Task 7: Login flow verification (test with actual admin credentials)
├── Task 8: Logout flow verification (test session clearing)
└── Task 9: Session persistence test (cookie settings correct)

Wave FINAL (After ALL tasks - 4 parallel reviews):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
```

### Dependency Matrix

| Task | Blocks | Blocked By |
|------|--------|------------|
| 1 | 2 | - |
| 2 | 3,4,5,6 | 1 |
| 3 | 7 | 2 |
| 4 | 7 | 2 |
| 5 | 7 | 2 |
| 6 | 7 | 2 |
| 7 | F1-F4 | 3,4,5,6 |
| 8 | F1-F4 | 7 |
| 9 | F1-F4 | 7 |

---

## TODOs

- [ ] 1. **Database Backup**

  **What to do**:
  - Enable Neon point-in-time recovery OR create a full database backup
  - Run `neon-plugin` tool to verify backup exists
  - Document restore command in `.sisyphus/evidence/backup-info.md`

  **Must NOT do**:
  - Proceed to schema changes without verified backup
  - Skip this step even if "just checking"

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward backup operation, well-defined steps
  - **Skills**: [`neon-plugin`]
    - `neon-plugin`: Backup/restore for Neon database
  - **Skills Evaluated but Omitted**:
    - None needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 2
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `scripts/create-auth-tables.ts` - Shows raw SQL approach for auth tables
  - `scripts/seed-admin.ts` - Shows how admin user is created

  **API/Type References**:
  - `src/lib/db/index.ts:getDb()` - Database connection pattern

  **Test References**:
  - None (backup is safety step, not feature test)

  **Acceptance Criteria**:
  - [ ] Backup created and verified exists
  - [ ] Restore command documented

  **QA Scenarios**:

  \`\`\`
  Scenario: Verify Neon point-in-time recovery is enabled
    Tool: Bash (curl to Neon API)
    Preconditions: Valid Neon API key in env
    Steps:
      1. curl -X GET 'https://console.neon.tech/api/v1/projects/{project_id}/branches'
         -H 'Authorization: Bearer $NEON_API_KEY'
      2. Check response for 'pin_point_time_recovery_enabled': true
    Expected Result: PITR enabled OR manual backup confirmed
    Failure Indicators: PITR disabled and no manual backup exists
    Evidence: .sisyphus/evidence/task-1-pitr-status.json
  \`\`\`

  **Commit**: NO

  ---

- [ ] 2. **Schema Alignment Verification**

  **What to do**:
  - Read `src/lib/db/auth-schema-generated.ts` in detail
  - Read `src/lib/db/auth-schema.ts` and compare
  - Check Better Auth v1.5.6 docs for expected schema
  - Verify `drizzle-auth.config.ts` points to correct schema
  - Check `src/lib/db/index.ts` exports

  **Must NOT do**:
  - Delete any schema file yet
  - Modify database (read-only verification)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Requires careful schema comparison and doc lookup
  - **Skills**: [`study`]
    - `study`: Deep investigation of Better Auth schema requirements
  - **Skills Evaluated but Omitted**:
    - None

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 1)
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Tasks 3, 4, 5, 6
  - **Blocked By**: Task 1 (backup must complete first)

  **References**:

  **Pattern References**:
  - `src/lib/db/auth-schema-generated.ts` - Better Auth's expected schema (singular names, text PKs)
  - `src/lib/db/auth-schema.ts` - Manual schema (plural names, UUID PKs) - compare against
  - `drizzle-auth.config.ts` - Drizzle config pointing to generated schema
  - `src/lib/db/index.ts` - Database exports and schema references

  **External References**:
  - Better Auth docs: Schema requirements for PostgreSQL drizzle adapter

  **WHY Each Reference Matters**:
  - Need to understand exact differences between the two schemas
  - Need to verify which one Better Auth v1.5.6 actually expects

  **Acceptance Criteria**:
  - [ ] Written comparison of both schemas
  - [ ] Confirmed which schema Better Auth expects
  - [ ] Decision documented: delete or keep `auth-schema.ts`

  **QA Scenarios**:

  \`\`\`
  Scenario: Compare schema structures
    Tool: Bash (read files + diff)
    Preconditions: Both schema files exist
    Steps:
      1. Read auth-schema-generated.ts - note table names, PK types, indexes
      2. Read auth-schema.ts - note table names, PK types, indexes
      3. Create comparison document
    Expected Result: Clear diff showing singular vs plural names, text vs UUID PKs
    Failure Indicators: Files identical (no diff needed) or missing tables
    Evidence: .sisyphus/evidence/task-2-schema-comparison.md
  \`\`\`

  **Commit**: NO (verification only)

  ---

- [ ] 3. **Environment Variables Fix**

  **What to do**:
  - Read current `.env` file
  - Add `BETTER_AUTH_URL=https://arjostyle.com` (or appropriate URL)
  - Add `TURNSTILE_SECRET_KEY=` (user needs to provide)
  - Document all required env vars in `.env.example`
  - Verify `BETTER_AUTH_SECRET` exists OR generate one

  **Must NOT do**:
  - Commit actual secrets to git (use `.env.example` for template)
  - Overwrite existing `DATABASE_URL`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple file edits, well-defined changes
  - **Skills**: []
    - None needed
  - **Skills Evaluated but Omitted**:
    - None

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 4, 5, 6)
  - **Parallel Group**: Wave 2 (with Tasks 4, 5, 6)
  - **Blocks**: Task 7
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `.env` - Current env file to modify
  - `src/lib/server/auth.ts` - Shows which env vars are expected:
    - `BETTER_AUTH_URL` (baseURL)
    - `BETTER_AUTH_SECRET` (crypto secret)
    - `TURNSTILE_SECRET_KEY` (currently hardcoded)

  **External References**:
  - Cloudflare Turnstile docs for secret key setup

  **WHY Each Reference Matters**:
  - `auth.ts` line 7 shows `baseUrl` defaults to `https://arjostyle.com` - needs explicit env var
  - Turnstile verification in login page needs secret from env

  **Acceptance Criteria**:
  - [ ] `.env` contains `BETTER_AUTH_URL`
  - [ ] `.env` contains `TURNSTILE_SECRET_KEY` (placeholder if user doesn't have one)
  - [ ] `.env` contains `BETTER_AUTH_SECRET` (generate if missing)
  - [ ] `.env.example` documents all required vars

  **QA Scenarios**:

  \`\`\`
  Scenario: Verify all required env vars present
    Tool: Bash
    Preconditions: .env file modified
    Steps:
      1. grep -E "BETTER_AUTH_URL|BETTER_AUTH_SECRET|TURNSTILE_SECRET_KEY" .env
    Expected Result: All three variables present with non-empty values
    Failure Indicators: Any variable missing or empty
    Evidence: .sisyphus/evidence/task-3-env-check.txt

  Scenario: Generate BETTER_AUTH_SECRET if missing
    Tool: Bash
    Preconditions: BETTER_AUTH_SECRET not in .env
    Steps:
      1. openssl rand -base64 32 (or similar secure random)
      2. Add to .env
    Expected Result: Secret generated and added
    Failure Indicators: openssl not available or write fails
    Evidence: .sisyphus/evidence/task-3-secret-generated.txt
  \`\`\`

  **Commit**: YES
  - Message: `fix(auth): add required environment variables`
  - Files: `.env`, `.env.example`

  ---

- [ ] 4. **Trusted Origins Fix**

  **What to do**:
  - Read `src/lib/server/auth.ts`
  - Add `https://www.arjostyle.com` to `trustedOrigins` array
  - Keep existing `https://arjostyle.com` and `http://localhost:5173`

  **Must NOT do**:
  - Remove localhost (needed for development)
  - Add untrusted origins

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single array modification
  - **Skills**: []
    - None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 5, 6)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 7
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `src/lib/server/auth.ts` - Line with `trustedOrigins: [...]`

  **WHY Each Reference Matters**:
  - Cookie issues from www subdomain would be caused by missing trusted origin

  **Acceptance Criteria**:
  - [ ] `trustedOrigins` array contains `https://www.arjostyle.com`

  **QA Scenarios**:

  \`\`\`
  Scenario: Verify trusted origins include www subdomain
    Tool: Read
    Preconditions: auth.ts modified
    Steps:
      1. grep -A5 "trustedOrigins" src/lib/server/auth.ts
    Expected Result: Array includes both arjostyle.com and www.arjostyle.com
    Failure Indicators: www missing from array
    Evidence: .sisyphus/evidence/task-4-trusted-origins.txt
  \`\`\`

  **Commit**: YES
  - Message: `fix(auth): add www subdomain to trusted origins`
  - Files: `src/lib/server/auth.ts`

  ---

- [ ] 5. **Hardcoded Secret Removal**

  **What to do**:
  - Read `src/routes/admin/login/+page.server.ts`
  - Move Turnstile secret key from hardcoded to `process.env.TURNSTILE_SECRET_KEY`
  - Verify env var is loaded correctly

  **Must NOT do**:
  - Hardcode any new secrets
  - Expose secret in error messages

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single env var reference change
  - **Skills**: []
    - None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 4, 6)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 7
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `src/routes/admin/login/+page.server.ts` - Turnstile verification code (line ~4)
  - `.env` - Where secret should come from

  **WHY Each Reference Matters**:
  - Secrets should never be hardcoded in source

  **Acceptance Criteria**:
  - [ ] No hardcoded Turnstile secret in `+page.server.ts`
  - [ ] `process.env.TURNSTILE_SECRET_KEY` used instead

  **QA Scenarios**:

  \`\`\`
  Scenario: Verify no hardcoded secrets
    Tool: grep
    Preconditions: File modified
    Steps:
      1. grep -n "turnstile.*secret\|TS_SECRET" src/routes/admin/login/+page.server.ts
    Expected Result: No hardcoded secret value found
    Failure Indicators: Secret value still visible in source
    Evidence: .sisyphus/evidence/task-5-no-hardcoded.txt
  \`\`\`

  **Commit**: YES
  - Message: `fix(auth): move Turnstile secret to environment variable`
  - Files: `src/routes/admin/login/+page.server.ts`

  ---

- [ ] 6. **Auth Config Cleanup**

  **What to do**:
  - Based on Task 2 findings, either:
    - DELETE `auth-schema.ts` if confirmed redundant
    - OR update it to match Better Auth expectations
  - Update `src/lib/db/index.ts` if needed to ensure single schema export
  - Verify `auth.ts` imports only the correct schema

  **Must NOT do**:
  - Delete without confirming no other imports depend on it
  - Delete without backup complete (Task 1)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Needs to verify all imports before deletion
  - **Skills**: [`study`]
    - `study`: Verify no broken imports after schema change

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 4, 5)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 7
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `src/lib/db/auth-schema-generated.ts` - Schema to keep
  - `src/lib/db/auth-schema.ts` - Schema to potentially delete
  - `src/lib/db/index.ts` - Exports both, may need update
  - `src/lib/server/auth.ts` - Imports schema via index

  **External References**:
  - Better Auth docs for exact schema requirements

  **WHY Each Reference Matters**:
  - If other files import from `auth-schema.ts`, deleting will break them

  **Acceptance Criteria**:
  - [ ] Only one auth schema exists in codebase
  - [ ] No import errors after cleanup
  - [ ] Drizzle adapter uses correct schema

  **QA Scenarios**:

  \`\`\`
  Scenario: Verify no broken imports after schema cleanup
    Tool: Bash (tsc)
    Preconditions: Schema files modified
    Steps:
      1. pnpm exec tsc --noEmit 2>&1 | head -50
    Expected Result: No import errors related to auth-schema
    Failure Indicators: Cannot find module './auth-schema' errors
    Evidence: .sisyphus/evidence/task-6-tsc-check.txt
  \`\`\`

  **Commit**: YES
  - Message: `chore(auth): remove redundant schema file`
  - Files: `src/lib/db/auth-schema.ts` (potentially deleted)

  ---

- [ ] 7. **Login Flow Verification**

  **What to do**:
  - Test login at `/admin/login` with actual admin credentials
  - Verify Turnstile can be bypassed or mocked for testing
  - Verify session cookie is set correctly
  - Verify redirect to `/admin` on success

  **Must NOT do**:
  - Test with fake credentials that don't exist
  - Lock out admin by too many failed attempts

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: End-to-end flow testing, needs actual browser/curl
  - **Skills**: [`playwright`]
    - `playwright`: For browser-based form submission testing

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 8, 9)
  - **Parallel Group**: Wave 3
  - **Blocks**: Final verification
  - **Blocked By**: Tasks 3, 4, 5, 6

  **References**:

  **Pattern References**:
  - `src/routes/admin/login/+page.server.ts` - Login form action
  - `src/routes/admin/login/+page.svelte` - Login form UI
  - `src/routes/admin/+layout.server.ts` - Route protection

  **WHY Each Reference Matters**:
  - Need to understand the full login flow to test it properly

  **Acceptance Criteria**:
  - [ ] Login with valid credentials succeeds
  - [ ] Session cookie `better-auth.session_token` is set
  - [ ] Redirect to `/admin` occurs on success
  - [ ] Error message shown on failure (without revealing which field was wrong)

  **QA Scenarios**:

  \`\`\`
  Scenario: Login with valid admin credentials
    Tool: Playwright
    Preconditions: Admin user exists in database
    Steps:
      1. Navigate to http://localhost:5173/admin/login
      2. Fill email field with admin email (from seed-admin.ts)
      3. Fill password field with admin password
      4. Bypass or mock Turnstile (add ?turnstile=valid to disable)
      5. Click login button
      6. Wait for navigation
    Expected Result: Redirected to /admin, no login error shown
    Failure Indicators: Still on /admin/login, error message visible
    Evidence: .sisyphus/evidence/task-7-login-success.png

  Scenario: Login with wrong password
    Tool: Playwright
    Preconditions: Admin user exists
    Steps:
      1. Navigate to http://localhost:5173/admin/login?turnstile=bypass
      2. Fill email with valid admin email
      3. Fill password with "wrongpassword123"
      4. Click login
    Expected Result: Error "Invalid credentials" shown, not "Email not found" or "Password not found"
    Failure Indicators: Reveals which field is wrong (security issue)
    Evidence: .sisyphus/evidence/task-7-login-fail.png
  \`\`\`

  **Commit**: NO

  ---

- [ ] 8. **Logout Flow Verification**

  **What to do**:
  - After successful login (Task 7), test logout
  - Navigate to `/admin/logout`
  - Verify session cookie is cleared
  - Verify redirect to `/admin/login`
  - Verify subsequent access to `/admin` redirects to login

  **Must NOT do**:
  - None (straightforward logout test)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: End-to-end flow testing
  - **Skills**: [`playwright`]
    - `playwright`: Browser-based testing

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 7, 9)
  - **Parallel Group**: Wave 3
  - **Blocks**: Final verification
  - **Blocked By**: Task 7

  **References**:

  **Pattern References**:
  - `src/routes/admin/logout/+page.server.ts` - Logout action

  **WHY Each Reference Matters**:
  - Need to verify signOut() clears the cookie correctly

  **Acceptance Criteria**:
  - [ ] Logout button/action exists and works
  - [ ] Session cookie cleared after logout
  - [ ] Redirect to `/admin/login` after logout
  - [ ] Protected routes inaccessible after logout

  **QA Scenarios**:

  \`\`\`
  Scenario: Logout clears session and redirects
    Tool: Playwright
    Preconditions: Logged in (from Task 7)
    Steps:
      1. Navigate to http://localhost:5173/admin/logout
      2. Observe automatic redirect
      3. Check browser cookies - better-auth.session_token should be gone
      4. Try navigating to http://localhost:5173/admin
    Expected Result: Redirected to /admin/login, cookie deleted
    Failure Indicators: Still authenticated, cookie present, or wrong redirect
    Evidence: .sisyphus/evidence/task-8-logout.png
  \`\`\`

  **Commit**: NO

  ---

- [ ] 9. **Session Persistence Test**

  **What to do**:
  - Login and verify session cookie settings
  - Check cookie is httpOnly
  - Check cookie sameSite policy
  - Verify session doesn't expire immediately (7 day expiry configured)
  - Verify session persists across page refreshes

  **Must NOT do**:
  - None

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Cookie inspection is straightforward
  - **Skills**: []
    - None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 7, 8)
  - **Parallel Group**: Wave 3
  - **Blocks**: Final verification
  - **Blocked By**: Task 7

  **References**:

  **Pattern References**:
  - `src/lib/server/auth.ts` - Session config: `expiresIn: 60 * 60 * 24 * 7`

  **WHY Each Reference Matters**:
  - Session should last 7 days per Better Auth config

  **Acceptance Criteria**:
  - [ ] Cookie `better-auth.session_token` present after login
  - [ ] Cookie is httpOnly (not accessible via JavaScript)
  - [ ] Cookie has reasonable expiry (7 days)
  - [ ] Cookie sameSite or equivalent CSRF protection

  **QA Scenarios**:

  \`\`\`
  Scenario: Verify session cookie settings
    Tool: Playwright
    Preconditions: Logged in
    Steps:
      1. Execute: await page.context().cookies()
      2. Find cookie named 'better-auth.session_token'
      3. Check: httpOnly=true, secure matches environment, sameSite is set
    Expected Result: httpOnly=true, secure=true (in prod), sameSite=lax or strict
    Failure Indicators: httpOnly=false (XSS risk), missing sameSite
    Evidence: .sisyphus/evidence/task-9-cookie-settings.json

  Scenario: Session persists across page refresh
    Tool: Playwright
    Preconditions: Logged in
    Steps:
      1. Navigate to http://localhost:5173/admin
      2. Verify logged in state visible
      3. Press F5 (refresh)
      4. Verify still logged in (no redirect to login)
    Expected Result: Still authenticated after refresh
    Failure Indicators: Redirected to login on refresh (session not persisting)
    Evidence: .sisyphus/evidence/task-9-session-persist.png
  \`\`\`

  **Commit**: NO

  ---

## Final Verification Wave (MANDATORY)

> 4 review agents run in PARALLEL. ALL must APPROVE.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search codebase — reject with file:line if found. Check evidence files exist.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `pnpm exec tsc --noEmit` + linter. Review changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check no secrets committed.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Secrets [CLEAN] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright`)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test edge cases: empty state, invalid input. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Detect cross-task contamination.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **1**: `fix(auth): add required environment variables` - .env, .env.example
- **2**: `fix(auth): add www subdomain to trusted origins` - auth.ts
- **3**: `fix(auth): move Turnstile secret to environment variable` - login/+page.server.ts
- **4**: `chore(auth): remove redundant schema file` - auth-schema.ts (potentially deleted)
- **Pre-commit**: `pnpm exec tsc --noEmit`

---

## Success Criteria

### Verification Commands
```bash
# Schema check - only auth-schema-generated.ts should exist
ls src/lib/db/auth-*.ts | wc -l  # Expected: 1

# Env vars check
grep -E "BETTER_AUTH" .env | wc -l  # Expected: 2+ (URL + SECRET)

# Login test (requires actual admin credentials)
curl -X POST http://localhost:5173/admin/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=admin@arjostyle.com&password=ACTUAL_PASSWORD&turnstile=bypass" \
  -c cookies.txt -L
# Expected: redirect to /admin, cookie file created

# Logout test
curl -X POST http://localhost:5173/admin/logout -b cookies.txt -L
# Expected: redirect to /admin/login

# Session check
curl http://localhost:5173/admin -b cookies.txt | grep -c "admin"
# Expected: page content indicates authenticated state
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Login works with admin credentials
- [ ] Logout clears session
- [ ] Admin routes protected
- [ ] No hardcoded secrets
- [ ] Env vars properly configured
- [ ] Evidence files captured
