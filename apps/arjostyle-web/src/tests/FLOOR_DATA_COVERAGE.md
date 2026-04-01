# Floor Data (Body Part Mappings) — Test Coverage Plan

**Schema source:** `src/lib/db/schema.ts` — `bodyPartMappings` table
**Type definitions:** `src/lib/types/mapping.ts`
**Default data:** `src/lib/data/defaultMappings.ts`
**API endpoints:** `GET/PUT /api/mappings`, `POST /api/mappings/sync`
**Storage:** Neon Postgres (permanent) + Cloudflare KV (edge cache)

---

## 1. Fields Under Test

### DB Table: `body_part_mappings`

| Field | Type | Nullable | Notes |
|---|---|---|---|
| `id` | uuid | NO | PK, auto-generated |
| `created_at` | timestamptz | YES | defaultNow |
| `updated_at` | timestamptz | YES | defaultNow |
| `category` | text | NO | e.g. "Head & Face", "Arms" |
| `placement` | text | NO | e.g. "Bicep", "Full Face" |
| `position_x` | real | NO | 3D X coordinate |
| `position_y` | real | NO | 3D Y coordinate |
| `position_z` | real | NO | 3D Z coordinate |
| `scale` | real | NO | default 1 |
| `camera_azimuth` | real | YES | radians |
| `camera_polar` | real | YES | radians |
| `camera_distance` | real | YES | positive float |
| `size_limit_min` | real | YES | must be < max |
| `size_limit_max` | real | YES | must be > min |
| `size_limit_multiplier` | real | YES | pricing multiplier |
| `pain_level` | real | YES | 1–10 scale |
| `pain_reason` | text | YES | human-readable |
| `is_active` | boolean | NO | default true |

### Nested TypeScript types (read/write roundtrip)

| Field path | Type | Required |
|---|---|---|
| `position[0..2]` | `[number, number, number]` | YES |
| `scale` | `number` | YES |
| `cameraAzimuth` | `number \| undefined` | NO |
| `cameraPolar` | `number \| undefined` | NO |
| `cameraDistance` | `number \| undefined` | NO |
| `placementSizeLimits.min` | `number` | YES |
| `placementSizeLimits.max` | `number` | YES |
| `placementSizeLimits.multiplier` | `number` | YES |
| `placementPainInfo.level` | `number` | YES |
| `placementPainInfo.reason` | `string \| undefined` | NO |

---

## 2. Operations Requiring Coverage

| Operation | Description | Target % |
|---|---|---|
| `rowsToMappings()` | DB rows → nested BodyPartMappings object | **100%** |
| `mappingsToRows()` | Nested object → flat DB rows for upsert | **100%** |
| `GET /api/mappings` (KV hit) | Returns cached data from KV | **100%** |
| `GET /api/mappings` (KV miss, Neon hit) | Falls back to Neon, re-populates KV | **100%** |
| `GET /api/mappings` (all miss) | Falls back to defaults, seeds both stores | **100%** |
| `PUT /api/mappings` (dual write) | Writes to Neon + KV simultaneously | **100%** |
| `PUT /api/mappings` (Neon only) | KV absent, writes to Neon only | **100%** |
| `PUT /api/mappings` (KV only) | Neon absent, writes to KV only | **100%** |
| `PUT /api/mappings` (neither) | Both unavailable → 503 error | **100%** |
| `POST /api/mappings/sync` | Generates TS file content from mappings | **90%** |
| Validation: required fields | Rejects missing category/placement/position | **100%** |
| Validation: body type check | Rejects non-object body in PUT | **100%** |
| DB schema constraint: notNull | category, placement, position_x/y/z, scale | **100%** |
| DB schema: isActive filter | GET only returns isActive=true rows | **100%** |
| Soft delete pattern | PUT marks old rows inactive before insert | **100%** |

**Overall line coverage target: 90%**
**Branch coverage target: 85%**
**API endpoint coverage: 100% of handler branches**

---

## 3. Edge Cases to Cover

### 3.1 Null / Missing Values

- `painLevel` is null in DB → defaults to `1` in `rowsToMappings()`
- `painReason` is null → maps to `undefined` (not string "null")
- `sizeLimitMin/Max/Multiplier` all null → defaults applied (0.5, 12, 1)
- `cameraAzimuth`, `cameraPolar`, `cameraDistance` all null → `undefined` in output
- `scale` defaults to `1` at DB level — test that default is used when not supplied
- `placementPainInfo` object missing from input → `mappingsToRows()` uses null

### 3.2 Out-of-Range / Invalid Values

- `painLevel` = 0 (below expected 1–10 range)
- `painLevel` = 10.5 (above max)
- `painLevel` = -1 (negative)
- `scale` = 0 (zero scale causes invisible element)
- `scale` = negative value
- `position` coords as `Infinity`, `NaN`, very large floats (e.g. 1e38)
- `sizeLimitMin` > `sizeLimitMax` (inverted range)
- `sizeLimitMin` = `sizeLimitMax` (zero-width range)
- `sizeLimitMultiplier` = 0 (zero multiplier breaks pricing)
- `cameraDistance` = 0 or negative (invalid camera)
- `cameraAzimuth` outside [−2π, 2π] (angle wrapping)

### 3.3 String / Text Edge Cases

- `category` = empty string ""
- `placement` = empty string ""
- `category` with special characters: `"Head & Face"`, `"Rib / Side Torso"` — verify JSON→TS key quoting
- `placement` with parentheses: `"Armpit / Underarm"` — ensure sync endpoint re-quotes correctly
- `painReason` = very long string (>1000 chars)
- `category` + `placement` combination that is a duplicate (same pair, two active rows)

### 3.4 Structural / JSON Integrity

- `position` array with fewer than 3 elements: `[0, 1]`
- `position` array with more than 3 elements: `[0, 1, 2, 3]`
- `position` array with non-numeric values: `[0, "hello", null]`
- Empty `BodyPartMappings` object `{}` submitted to PUT
- Empty `placements` object for a category: `{ "Arms": {} }`
- Mappings object with 1 category/placement vs full 60+ placements

### 3.5 Concurrent Write Scenarios

- Two simultaneous PUT requests for the same mapping → second write wins (last writer wins strategy)
- PUT during GET (KV read) — KV should return stale data until KV.put completes
- Neon write succeeds but KV.put throws — partial write state; `savedToNeon=true, savedToKV=false`
- KV.put succeeds but Neon write throws — partial write state; `savedToNeon=false, savedToKV=true`
- PUT soft-delete (UPDATE isActive=false) succeeds but INSERT fails — leaves no active rows (GET returns defaults)
- Rapid back-to-back PUTs — verify deduplication / no phantom active rows

### 3.6 `isActive` Soft Delete Pattern

- After PUT: verify all pre-existing rows have `isActive=false`
- After PUT: verify new rows have `isActive=true`
- GET must filter out `isActive=false` rows
- `rowsToMappings()` with a mix of active and inactive rows — inactive rows must be excluded

### 3.7 KV Cache Consistency

- KV returns empty object `{}` → should be treated as cache miss and fall through to Neon
- KV returns non-object value → should be treated as cache miss
- KV key absent → fall through to Neon
- After successful GET from Neon → KV is populated with the fetched data (side-effect test)
- After fallback to defaults → KV is seeded with defaults

### 3.8 API Input Validation

- PUT with `body = null` → 400 error
- PUT with `body = []` (array not object) → 400 error
- PUT with `body = "string"` → 400 error
- PUT with `body = 42` → 400 error
- POST to `/api/mappings/sync` with invalid JSON body → 400 error
- POST to `/api/mappings/sync` with valid mappings → returns `content` string containing TypeScript

### 3.9 `generateTsFile` (sync endpoint logic)

- Keys with spaces are re-quoted: `"Head & Face":` not `Head & Face:`
- Keys with slashes re-quoted: `"Rib / Side Torso":`
- Simple word keys unquoted: `Chest:`, `Neck:`
- Nested arrays: `position: [0, 1, 2]` serialized correctly
- Large mappings object (all 60+ placements) roundtrips without truncation

---

## 4. Coverage Targets Summary

| Category | Target |
|---|---|
| Unit (pure functions: rowsToMappings, mappingsToRows, generateTsFile) | **100% line, 95% branch** |
| Integration (API handlers: GET/PUT with mocked stores) | **90% line, 85% branch** |
| Integration (DB round-trip via Neon test instance) | **80% of operations** |
| E2E (admin model editor save + booking modal read) | **Key user flows covered** |
| Edge case scenarios (from section 3) | **All named cases have at least one test** |

---

## 5. Test File Plan

| File | Type | Task |
|---|---|---|
| `floor-data-validation.unit.test.ts` | Unit (Vitest) | rowsToMappings, mappingsToRows — all edge cases |
| `floor-data-api.unit.test.ts` | Unit (Vitest) | GET/PUT handlers with mocked KV + Neon |
| `floor-data-sync.unit.test.ts` | Unit (Vitest) | generateTsFile, sync POST handler |
| `floor-data-db.integration.test.ts` | Integration | DB round-trip read/write against Neon test DB |
| `floor-data-fixtures.ts` | Fixture factory | Reusable test data for all above |
| `floor-data-financial.integration.test.ts` | Integration | Financial field guards (pricingDetails, estimatedValue) |
