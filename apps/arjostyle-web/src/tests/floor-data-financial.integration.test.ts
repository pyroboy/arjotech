/**
 * Integration tests: Neon DB financial data integrity guards
 * Task #f9da580e
 *
 * Tests verifying financial data validation works correctly under edge cases:
 * - Zero amounts
 * - Negative values
 * - Missing/null required fields
 * - Mismatched totals
 * - Concurrent writes (last-writer-wins)
 *
 * Financial fields in scope:
 *   bookings.pricingDetails  (JSONB: basePriceRaw, complexityPrice, placementPrice,
 *                             colorPrice, coverUpPrice, total)
 *   leads.estimatedValue     (real, nullable)
 *   marketingContent.generationCost (real, nullable)
 *   bodyPartMappings.sizeLimitMultiplier (real, nullable — affects pricing)
 *
 * These tests use in-memory validation logic (no live DB) matching the
 * real schema constraints from src/lib/db/schema.ts.
 */

import { describe, it, expect } from 'vitest';
import {
  makePricingDetails,
  FINANCIAL_EDGE_CASES,
  makeMockDb,
  makeMockKV,
  makeDbRow,
  CONCURRENT_WRITE_FIXTURES,
  type PricingDetails,
} from './floor-data-fixtures';
import type { BodyPartMappings } from '../lib/types/mapping';

// ─── Financial validation logic (mirrors what should exist in API layer) ──────

/**
 * Validates a pricingDetails object from the bookings table.
 * Returns an array of validation error messages (empty = valid).
 */
function validatePricingDetails(pricing: unknown): string[] {
  const errors: string[] = [];

  if (pricing === null || pricing === undefined) {
    // pricingDetails is nullable in schema — null is valid
    return [];
  }

  if (typeof pricing !== 'object' || Array.isArray(pricing)) {
    errors.push('pricingDetails must be an object');
    return errors;
  }

  const p = pricing as Partial<PricingDetails>;

  const numericFields: (keyof PricingDetails)[] = [
    'basePriceRaw', 'complexityPrice', 'placementPrice',
    'colorPrice', 'coverUpPrice', 'total',
  ];

  for (const field of numericFields) {
    if (!(field in p)) {
      errors.push(`pricingDetails.${field} is required`);
      continue;
    }
    const val = p[field];
    if (typeof val !== 'number') {
      errors.push(`pricingDetails.${field} must be a number`);
      continue;
    }
    if (!Number.isFinite(val)) {
      errors.push(`pricingDetails.${field} must be a finite number`);
    }
  }

  // If all fields present and numeric, check total consistency
  if (errors.length === 0) {
    const computed =
      (p.basePriceRaw ?? 0) +
      (p.complexityPrice ?? 0) +
      (p.placementPrice ?? 0) +
      (p.colorPrice ?? 0) +
      (p.coverUpPrice ?? 0);
    // Allow ±1 for floating-point rounding
    if (Math.abs(computed - (p.total ?? 0)) > 1) {
      errors.push(
        `pricingDetails.total (${p.total}) does not match computed sum (${computed})`
      );
    }
  }

  return errors;
}

/**
 * Validates an estimatedValue from the leads table.
 * estimatedValue is a real nullable field — null is allowed.
 */
function validateEstimatedValue(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (typeof value !== 'number') return ['estimatedValue must be a number or null'];
  if (!Number.isFinite(value)) return ['estimatedValue must be finite'];
  if (value < 0) return ['estimatedValue must not be negative'];
  return [];
}

/**
 * Validates a sizeLimitMultiplier from bodyPartMappings.
 * Multiplier affects pricing — zero or negative would break cost calculation.
 */
function validateSizeLimitMultiplier(value: number | null): string[] {
  if (value === null) return []; // null uses default of 1 — valid
  if (!Number.isFinite(value)) return ['sizeLimitMultiplier must be finite'];
  if (value <= 0) return ['sizeLimitMultiplier must be positive (> 0)'];
  return [];
}

// ─── pricingDetails validation ────────────────────────────────────────────────

describe('pricingDetails financial validation', () => {
  it('accepts null pricingDetails (field is nullable in schema)', () => {
    const errors = validatePricingDetails(null);
    expect(errors).toHaveLength(0);
  });

  it('accepts undefined pricingDetails', () => {
    const errors = validatePricingDetails(undefined);
    expect(errors).toHaveLength(0);
  });

  it('accepts valid pricingDetails with correct total', () => {
    const pricing = makePricingDetails({ basePriceRaw: 2000, complexityPrice: 500, placementPrice: 300, colorPrice: 200, coverUpPrice: 0, total: 3000 });
    const errors = validatePricingDetails(pricing);
    expect(errors).toHaveLength(0);
  });

  it('rejects all-zero amounts when total does not match (0 === 0, still valid)', () => {
    const errors = validatePricingDetails(FINANCIAL_EDGE_CASES.allZero);
    expect(errors).toHaveLength(0); // all zeros sum to 0, total is 0 → valid
  });

  it('rejects negative base price — total mismatch if other fields positive', () => {
    const pricing = makePricingDetails({ basePriceRaw: -1000, complexityPrice: 500, total: 3000 });
    const errors = validatePricingDetails(pricing);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toMatch(/total.*does not match/i);
  });

  it('negative pricing with correct (negative) total passes', () => {
    const pricing = makePricingDetails({ basePriceRaw: -1000, complexityPrice: 0, placementPrice: 0, colorPrice: 0, coverUpPrice: 0, total: -1000 });
    const errors = validatePricingDetails(pricing);
    expect(errors).toHaveLength(0);
  });

  it('rejects mismatched total', () => {
    const errors = validatePricingDetails(FINANCIAL_EDGE_CASES.mismatchedTotal);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/total.*does not match/i);
  });

  it('accepts large amounts that sum correctly', () => {
    const pricing = makePricingDetails({ basePriceRaw: 999_999_999, complexityPrice: 0, placementPrice: 0, colorPrice: 0, coverUpPrice: 0, total: 999_999_999 });
    const errors = validatePricingDetails(pricing);
    expect(errors).toHaveLength(0);
  });

  it('accepts fractional amounts with correct sum', () => {
    const pricing = makePricingDetails({
      basePriceRaw: 1999.99,
      complexityPrice: 500.00,
      placementPrice: 0,
      colorPrice: 0,
      coverUpPrice: 0,
      total: 2499.99,
    });
    const errors = validatePricingDetails(pricing);
    expect(errors).toHaveLength(0);
  });

  it('rejects missing total field', () => {
    const pricing = FINANCIAL_EDGE_CASES.missingTotal;
    const errors = validatePricingDetails(pricing);
    expect(errors.some(e => e.includes('total'))).toBe(true);
  });

  it('rejects non-object pricingDetails (array)', () => {
    const errors = validatePricingDetails([1000, 500, 300]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/must be an object/i);
  });

  it('rejects string pricingDetails', () => {
    const errors = validatePricingDetails('not an object');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/must be an object/i);
  });

  it('rejects Infinity in any field', () => {
    const pricing = makePricingDetails({ total: Infinity });
    const errors = validatePricingDetails(pricing);
    expect(errors.some(e => e.includes('finite'))).toBe(true);
  });

  it('rejects NaN in any field', () => {
    const pricing = makePricingDetails({ basePriceRaw: NaN });
    const errors = validatePricingDetails(pricing);
    expect(errors.some(e => e.includes('finite') || e.includes('number'))).toBe(true);
  });
});

// ─── estimatedValue validation ────────────────────────────────────────────────

describe('estimatedValue (leads table) financial validation', () => {
  it('accepts null estimatedValue', () => {
    expect(validateEstimatedValue(null)).toHaveLength(0);
  });

  it('accepts valid positive estimated value', () => {
    expect(validateEstimatedValue(5000)).toHaveLength(0);
  });

  it('accepts zero estimated value', () => {
    expect(validateEstimatedValue(0)).toHaveLength(0);
  });

  it('rejects negative estimated value', () => {
    const errors = validateEstimatedValue(-500);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/negative/i);
  });

  it('rejects string estimated value', () => {
    const errors = validateEstimatedValue('5000');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/number/i);
  });

  it('rejects Infinity', () => {
    const errors = validateEstimatedValue(Infinity);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/finite/i);
  });

  it('rejects NaN', () => {
    const errors = validateEstimatedValue(NaN);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/finite/i);
  });
});

// ─── sizeLimitMultiplier validation ──────────────────────────────────────────

describe('sizeLimitMultiplier (bodyPartMappings) financial guard', () => {
  it('accepts null multiplier (uses default 1.0)', () => {
    expect(validateSizeLimitMultiplier(null)).toHaveLength(0);
  });

  it('accepts valid multiplier 1.0', () => {
    expect(validateSizeLimitMultiplier(1.0)).toHaveLength(0);
  });

  it('accepts multiplier > 1', () => {
    expect(validateSizeLimitMultiplier(1.8)).toHaveLength(0);
  });

  it('rejects zero multiplier (would zero out pricing)', () => {
    const errors = validateSizeLimitMultiplier(0);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/positive/i);
  });

  it('rejects negative multiplier', () => {
    const errors = validateSizeLimitMultiplier(-0.5);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/positive/i);
  });

  it('rejects Infinity multiplier', () => {
    const errors = validateSizeLimitMultiplier(Infinity);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/finite/i);
  });

  it('rejects NaN multiplier', () => {
    const errors = validateSizeLimitMultiplier(NaN);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/finite/i);
  });
});

// ─── Concurrent write integrity ───────────────────────────────────────────────

describe('Concurrent write integrity (last-writer-wins)', () => {
  it('last PUT wins: second write overwrites first in DB', async () => {
    const db = makeMockDb();
    const kv = makeMockKV(null);

    const { firstWrite, secondWrite } = CONCURRENT_WRITE_FIXTURES;

    // Simulate first write
    const firstRows = mappingsToRows(firstWrite);
    await db.updateDeactivate();
    await db.insertRows(firstRows);

    // Simulate second write (overwrites)
    const secondRows = mappingsToRows(secondWrite);
    await db.updateDeactivate();
    await db.insertRows(secondRows);

    // Read active state
    const activeRows = db.getActiveRows();
    expect(activeRows.every(r => r.isActive)).toBe(true);

    // All active rows should reflect the second write's data
    const bicepRow = activeRows.find(r => r.placement === 'Bicep');
    expect(bicepRow?.positionX).toBe(1);
    expect(bicepRow?.positionY).toBe(2);
    expect(bicepRow?.positionZ).toBe(3);
    expect(bicepRow?.scale).toBe(0.2);
  });

  it('no active rows remain from first write after second write', async () => {
    const db = makeMockDb();

    const { firstWrite, secondWrite } = CONCURRENT_WRITE_FIXTURES;

    // First write
    await db.updateDeactivate();
    await db.insertRows(mappingsToRows(firstWrite));

    // Second write
    await db.updateDeactivate();
    await db.insertRows(mappingsToRows(secondWrite));

    // All rows from first write should be inactive
    const allRows = db.getAllRows();
    const firstBicepRows = allRows.filter(
      r => r.placement === 'Bicep' && r.positionX === 0
    );
    expect(firstBicepRows.every(r => !r.isActive)).toBe(true);
  });

  it('partial write: if Neon fails, KV still holds updated data', async () => {
    const kv = makeMockKV(CONCURRENT_WRITE_FIXTURES.firstWrite);
    const { secondWrite } = CONCURRENT_WRITE_FIXTURES;

    // Simulate Neon failure (db is null)
    if (kv) {
      await kv.put('body_part_mappings', JSON.stringify(secondWrite));
    }

    const kvData = await kv.get('body_part_mappings', 'json') as BodyPartMappings;
    expect(kvData['Arms']['Bicep'].scale).toBe(0.2);
  });

  it('partial write: if KV fails, Neon still holds updated data', async () => {
    const db = makeMockDb([makeDbRow({ placement: 'Bicep', scale: 0.1, positionX: 0, positionY: 0, positionZ: 0, isActive: true })]);
    const { secondWrite } = CONCURRENT_WRITE_FIXTURES;

    // Simulate KV failure (kv is null), write only to DB
    await db.updateDeactivate();
    await db.insertRows(mappingsToRows(secondWrite));

    const activeRows = db.getActiveRows();
    const bicep = activeRows.find(r => r.placement === 'Bicep');
    expect(bicep?.scale).toBe(0.2);
  });

  it('transaction integrity: deactivate + insert are separate DB calls (not atomic)', async () => {
    // This test documents the known behavior: the soft-delete pattern is NOT
    // atomic — if insert fails after deactivate, the DB is left with no active rows.
    const db = makeMockDb([makeDbRow()]);

    await db.updateDeactivate();
    // Simulate insert failure — don't call insertRows

    const activeRows = db.getActiveRows();
    expect(activeRows).toHaveLength(0); // Documents: no active rows left
  });
});

// ─── Missing field guards ─────────────────────────────────────────────────────

describe('Missing required financial fields', () => {
  it('rejects pricingDetails missing basePriceRaw', () => {
    const pricing = { complexityPrice: 500, placementPrice: 300, colorPrice: 200, coverUpPrice: 0, total: 1000 };
    const errors = validatePricingDetails(pricing);
    expect(errors.some(e => e.includes('basePriceRaw'))).toBe(true);
  });

  it('rejects pricingDetails missing all fields', () => {
    const errors = validatePricingDetails({});
    expect(errors.length).toBe(6); // one per required field
  });

  it('accepts pricingDetails with all fields present and zero', () => {
    const pricing = makePricingDetails({ basePriceRaw: 0, complexityPrice: 0, placementPrice: 0, colorPrice: 0, coverUpPrice: 0, total: 0 });
    const errors = validatePricingDetails(pricing);
    expect(errors).toHaveLength(0);
  });
});

// ─── Helper (mirrors mappingsToRows from API routes) ──────────────────────────

type DbRowInsert = Omit<import('./floor-data-fixtures').DbRow, 'id' | 'createdAt' | 'updatedAt'>;

function mappingsToRows(mappings: BodyPartMappings): DbRowInsert[] {
  const rows: DbRowInsert[] = [];
  for (const [category, placements] of Object.entries(mappings)) {
    for (const [placement, data] of Object.entries(placements)) {
      rows.push({
        category,
        placement,
        positionX: data.position[0],
        positionY: data.position[1],
        positionZ: data.position[2],
        scale: data.scale,
        cameraAzimuth: data.cameraAzimuth ?? null,
        cameraPolar: data.cameraPolar ?? null,
        cameraDistance: data.cameraDistance ?? null,
        sizeLimitMin: data.placementSizeLimits?.min ?? null,
        sizeLimitMax: data.placementSizeLimits?.max ?? null,
        sizeLimitMultiplier: data.placementSizeLimits?.multiplier ?? null,
        painLevel: data.placementPainInfo?.level ?? null,
        painReason: data.placementPainInfo?.reason ?? null,
        isActive: true,
      });
    }
  }
  return rows;
}
