# Schema Alignment Verification - Task 2

## Summary

**`auth-schema-generated.ts`** matches Better Auth v1.5.6 expected schema exactly.
**`auth-schema.ts`** is a manual/hybrid schema that does NOT match Better Auth expectations.

---

## Detailed Comparison

### 1. Table Names

| Entity | `auth-schema-generated.ts` | `auth-schema.ts` | Better Auth Expected |
|--------|---------------------------|------------------|---------------------|
| User | `user` | `users` | `user` (singular) |
| Session | `session` | `sessions` | `session` (singular) |
| Account | `account` | `accounts` | `account` (singular) |
| Verification | `verification` | `verifications` | `verification` (singular) |

**Winner**: `auth-schema-generated.ts` ✓ matches Better Auth

---

### 2. Primary Key Types

| Schema | ID Type | Generation |
|--------|---------|------------|
| `auth-schema-generated.ts` | `text()` | No default - IDs passed in |
| `auth-schema.ts` | `uuid()` | `gen_random_uuid()` |

**Better Auth expects**: `text()` primary keys with NO default generation

Better Auth generates IDs externally (e.g., `user_abc123`) and passes them in. The manual schema's `uuid()` defaults are **incompatible**.

**Winner**: `auth-schema-generated.ts` ✓

---

### 3. Indexes

| Schema | Has Indexes |
|--------|-------------|
| `auth-schema-generated.ts` | ✓ `session_userId_idx`, `account_userId_idx`, `verification_identifier_idx` |
| `auth-schema.ts` | ✗ None |

Better Auth requires indexes on foreign key columns for performance.

**Winner**: `auth-schema-generated.ts` ✓

---

### 4. Timestamp Configuration

| Schema | Timestamps |
|--------|------------|
| `auth-schema-generated.ts` | Standard `timestamp()` without `withTimezone` |
| `auth-schema.ts` | `timestamp({ withTimezone: true })` |

Both are valid PostgreSQL, but `auth-schema-generated.ts` matches the Better Auth reference implementation.

---

### 5. Foreign Key References

Both schemas use `onDelete: "cascade"` correctly.

---

## drizzle-auth.config.ts Verification

```typescript
export default defineConfig({
  schema: ['./src/lib/db/auth-schema-generated.ts'],  // ✓ Points to generated schema
  out: './drizzle-auth',
  dialect: 'postgresql',
});
```

**Confirmed**: `drizzle-auth.config.ts` correctly points to `auth-schema-generated.ts`

---

## src/lib/db/index.ts Verification

```typescript
import * as authSchema from './auth-schema-generated';  // ✓ Uses generated
import * as schema from './schema';

export function createDb(databaseUrl: string) {
  const pool = new Pool({ connectionString: databaseUrl });
  return drizzle(pool, { schema: { ...schema, ...authSchema } });
}
```

**Confirmed**: Database uses `auth-schema-generated.ts` (aliased as `authSchema`)

---

## import Analysis

Searched all source files for imports of `auth-schema.ts`:
- **Result**: `auth-schema.ts` is NOT imported anywhere in the codebase
- Only `auth-schema-generated.ts` is imported via `index.ts`

---

## Decision

### ✅ DELETE `auth-schema.ts`

**Rationale**:
1. **Better Auth incompatibility**: Uses `uuid()` IDs and plural table names that don't match Better Auth v1.5.6
2. **No imports**: File is dead code - nothing imports it
3. **Wrong config**: `drizzle-auth.config.ts` points to `auth-schema-generated.ts`, not this file
4. **Redundancy**: `auth-schema-generated.ts` already exists with the correct schema
5. **Manual schema pollution**: The `auth-schema.ts` appears to be a leftover manual implementation that was never cleaned up

### Files to DELETE:
- `src/lib/db/auth-schema.ts`

### Files to KEEP:
- `src/lib/db/auth-schema-generated.ts` ✓
- `drizzle-auth.config.ts` ✓
- `src/lib/db/index.ts` ✓ (only needs `authSchema` import from generated)

---

## Evidence

Better Auth v1.5.6 expected schema (from `/better-auth/better-auth` docs):

```typescript
// Table: user (singular)
user = pgTable("user", {
  id: text("id").primaryKey(),  // text, not uuid
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
```

`auth-schema-generated.ts` matches this exactly.
`auth-schema.ts` does not.
