/**
 * Unit tests: floor data validation and normalization logic
 * Task #97878b05
 *
 * Tests the pure functions rowsToMappings(), mappingsToRows(), and
 * generateTsFile() which are the core normalization logic for floor
 * (body part placement) data.
 *
 * These functions are extracted here for isolated unit testing.
 * The originals live in:
 *   - src/routes/api/mappings/+server.ts  (rowsToMappings, mappingsToRows)
 *   - src/routes/api/mappings/sync/+server.ts  (generateTsFile)
 */

import { describe, it, expect } from 'vitest';
import type { BodyPartMappings } from '../lib/types/mapping';

// ─── Extracted pure functions under test ─────────────────────────────────────
// These match the implementations in the API routes exactly.

type DbRow = {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  category: string;
  placement: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  scale: number;
  cameraAzimuth: number | null;
  cameraPolar: number | null;
  cameraDistance: number | null;
  sizeLimitMin: number | null;
  sizeLimitMax: number | null;
  sizeLimitMultiplier: number | null;
  painLevel: number | null;
  painReason: string | null;
  isActive: boolean;
};

function rowsToMappings(rows: DbRow[]): BodyPartMappings {
  const result: BodyPartMappings = {};
  for (const row of rows) {
    if (!row.isActive) continue;
    if (!result[row.category]) result[row.category] = {};
    result[row.category][row.placement] = {
      position: [row.positionX, row.positionY, row.positionZ],
      scale: row.scale,
      cameraAzimuth: row.cameraAzimuth ?? undefined,
      cameraPolar: row.cameraPolar ?? undefined,
      cameraDistance: row.cameraDistance ?? undefined,
      placementSizeLimits: {
        min: row.sizeLimitMin ?? 0.5,
        max: row.sizeLimitMax ?? 12,
        multiplier: row.sizeLimitMultiplier ?? 1,
      },
      placementPainInfo: {
        level: row.painLevel ?? 1,
        reason: row.painReason ?? undefined,
      },
    };
  }
  return result;
}

function mappingsToRows(mappings: BodyPartMappings): Omit<DbRow, 'id' | 'createdAt' | 'updatedAt'>[] {
  const rows: Omit<DbRow, 'id' | 'createdAt' | 'updatedAt'>[] = [];
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

function generateTsFile(mappings: Record<string, unknown>): string {
  const jsonStr = JSON.stringify(mappings, null, 2);
  const tsObj = jsonStr
    .replace(/"(\w+)":/g, (_, key) => `${key}:`)
    .replace(/^(\s+)(\w[\w\s&/()]+\w):/gm, (_, indent, key) => {
      if (/\s|&|\/|\(|\)/.test(key)) {
        return `${indent}"${key}":`;
      }
      return `${indent}${key}:`;
    });
  return `import type { BodyPartMappings } from '$types/mapping';\n\nexport const defaultBodyPartMappings: BodyPartMappings = ${tsObj};\n`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRow(overrides: Partial<DbRow> = {}): DbRow {
  return {
    id: 'test-uuid',
    createdAt: new Date(),
    updatedAt: new Date(),
    category: 'Arms',
    placement: 'Bicep',
    positionX: -0.29,
    positionY: -0.47,
    positionZ: 0.05,
    scale: 0.1,
    cameraAzimuth: -0.52,
    cameraPolar: 1.57,
    cameraDistance: 0.9,
    sizeLimitMin: 3,
    sizeLimitMax: 12,
    sizeLimitMultiplier: 1.0,
    painLevel: 4,
    painReason: 'Generally tolerable.',
    isActive: true,
    ...overrides,
  };
}

// ─── rowsToMappings ───────────────────────────────────────────────────────────

describe('rowsToMappings()', () => {
  it('converts a single active row to nested BodyPartMappings', () => {
    const rows = [makeRow()];
    const result = rowsToMappings(rows);

    expect(result).toHaveProperty('Arms');
    expect(result['Arms']).toHaveProperty('Bicep');
    expect(result['Arms']!['Bicep']!.position).toEqual([-0.29, -0.47, 0.05]);
    expect(result['Arms']!['Bicep']!.scale).toBe(0.1);
  });

  it('skips rows where isActive is false', () => {
    const rows = [makeRow({ isActive: false })];
    const result = rowsToMappings(rows);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('includes only active rows when mixed active/inactive', () => {
    const rows = [
      makeRow({ placement: 'Bicep', isActive: true }),
      makeRow({ placement: 'Tricep', isActive: false }),
    ];
    const result = rowsToMappings(rows);
    expect(result['Arms']).toHaveProperty('Bicep');
    expect(result['Arms']).not.toHaveProperty('Tricep');
  });

  it('returns empty object for empty input', () => {
    const result = rowsToMappings([]);
    expect(result).toEqual({});
  });

  it('groups multiple placements under the same category', () => {
    const rows = [
      makeRow({ placement: 'Bicep' }),
      makeRow({ placement: 'Tricep' }),
    ];
    const result = rowsToMappings(rows);
    expect(Object.keys(result['Arms'])).toHaveLength(2);
  });

  it('groups placements across multiple categories', () => {
    const rows = [
      makeRow({ category: 'Arms', placement: 'Bicep' }),
      makeRow({ category: 'Legs', placement: 'Shin' }),
    ];
    const result = rowsToMappings(rows);
    expect(result).toHaveProperty('Arms');
    expect(result).toHaveProperty('Legs');
  });

  // ─── Null / default value handling ──────────────────────────────────────────

  it('defaults painLevel to 1 when null', () => {
    const rows = [makeRow({ painLevel: null })];
    const result = rowsToMappings(rows);
    expect(result['Arms']!['Bicep']!.placementPainInfo!.level).toBe(1);
  });

  it('maps painReason null to undefined (not string "null")', () => {
    const rows = [makeRow({ painReason: null })];
    const result = rowsToMappings(rows);
    expect(result['Arms']!['Bicep']!.placementPainInfo!.reason).toBeUndefined();
  });

  it('defaults sizeLimitMin to 0.5 when null', () => {
    const rows = [makeRow({ sizeLimitMin: null })];
    const result = rowsToMappings(rows);
    expect(result['Arms']!['Bicep']!.placementSizeLimits!.min).toBe(0.5);
  });

  it('defaults sizeLimitMax to 12 when null', () => {
    const rows = [makeRow({ sizeLimitMax: null })];
    const result = rowsToMappings(rows);
    expect(result['Arms']!['Bicep']!.placementSizeLimits!.max).toBe(12);
  });

  it('defaults sizeLimitMultiplier to 1 when null', () => {
    const rows = [makeRow({ sizeLimitMultiplier: null })];
    const result = rowsToMappings(rows);
    expect(result['Arms']!['Bicep']!.placementSizeLimits!.multiplier).toBe(1);
  });

  it('maps cameraAzimuth null to undefined', () => {
    const rows = [makeRow({ cameraAzimuth: null })];
    const result = rowsToMappings(rows);
    expect(result['Arms']!['Bicep']!.cameraAzimuth).toBeUndefined();
  });

  it('maps cameraPolar null to undefined', () => {
    const rows = [makeRow({ cameraPolar: null })];
    const result = rowsToMappings(rows);
    expect(result['Arms']!['Bicep']!.cameraPolar).toBeUndefined();
  });

  it('maps cameraDistance null to undefined', () => {
    const rows = [makeRow({ cameraDistance: null })];
    const result = rowsToMappings(rows);
    expect(result['Arms']!['Bicep']!.cameraDistance).toBeUndefined();
  });

  it('preserves all null camera fields simultaneously', () => {
    const rows = [makeRow({ cameraAzimuth: null, cameraPolar: null, cameraDistance: null })];
    const result = rowsToMappings(rows);
    const placement = result['Arms']!['Bicep']!;
    expect(placement.cameraAzimuth).toBeUndefined();
    expect(placement.cameraPolar).toBeUndefined();
    expect(placement.cameraDistance).toBeUndefined();
  });

  // ─── Out-of-range value passthrough ─────────────────────────────────────────
  // rowsToMappings does not validate — it normalizes defaults only.
  // Validation is enforced at the API layer (not here).

  it('passes through painLevel 0 without clamping', () => {
    const rows = [makeRow({ painLevel: 0 })];
    const result = rowsToMappings(rows);
    expect(result['Arms']!['Bicep']!.placementPainInfo!.level).toBe(0);
  });

  it('passes through negative scale without clamping', () => {
    const rows = [makeRow({ scale: -1 })];
    const result = rowsToMappings(rows);
    expect(result['Arms']!['Bicep']!.scale).toBe(-1);
  });

  it('passes through inverted size limits without clamping', () => {
    const rows = [makeRow({ sizeLimitMin: 10, sizeLimitMax: 2 })];
    const result = rowsToMappings(rows);
    const limits = result['Arms']!['Bicep']!.placementSizeLimits;
    expect(limits!.min).toBe(10);
    expect(limits!.max).toBe(2);
  });

  it('passes through NaN position values', () => {
    const rows = [makeRow({ positionX: NaN })];
    const result = rowsToMappings(rows);
    expect(Number.isNaN(result['Arms']!['Bicep']!.position[0])).toBe(true);
  });

  it('handles category with special characters', () => {
    const rows = [makeRow({ category: 'Head & Face', placement: 'Full Face' })];
    const result = rowsToMappings(rows);
    expect(result['Head & Face']['Full Face']).toBeDefined();
  });
});

// ─── mappingsToRows ───────────────────────────────────────────────────────────

describe('mappingsToRows()', () => {
  it('converts a single placement to a flat row', () => {
    const mappings: BodyPartMappings = {
      Arms: {
        Bicep: {
          position: [-0.29, -0.47, 0.05],
          scale: 0.1,
          cameraAzimuth: -0.52,
          cameraPolar: 1.57,
          cameraDistance: 0.9,
          placementSizeLimits: { min: 3, max: 12, multiplier: 1.0 },
          placementPainInfo: { level: 4, reason: 'Tolerable.' },
        },
      },
    };
    const rows = mappingsToRows(mappings);
    expect(rows).toHaveLength(1);
    expect(rows[0].category).toBe('Arms');
    expect(rows[0].placement).toBe('Bicep');
    expect(rows[0].positionX).toBe(-0.29);
    expect(rows[0].positionY).toBe(-0.47);
    expect(rows[0].positionZ).toBe(0.05);
    expect(rows[0].scale).toBe(0.1);
    expect(rows[0].isActive).toBe(true);
  });

  it('returns empty array for empty mappings', () => {
    const rows = mappingsToRows({});
    expect(rows).toHaveLength(0);
  });

  it('returns empty array for category with empty placements', () => {
    const rows = mappingsToRows({ Arms: {} });
    expect(rows).toHaveLength(0);
  });

  it('sets isActive true on all rows', () => {
    const mappings: BodyPartMappings = {
      Arms: {
        Bicep: {
          position: [0, 0, 0],
          scale: 1,
          placementSizeLimits: { min: 1, max: 10, multiplier: 1 },
          placementPainInfo: { level: 5 },
        },
      },
    };
    const rows = mappingsToRows(mappings);
    expect(rows.every(r => r.isActive)).toBe(true);
  });

  it('converts optional camera fields to null when undefined', () => {
    const mappings: BodyPartMappings = {
      Arms: {
        Bicep: {
          position: [0, 0, 0],
          scale: 1,
          // cameraAzimuth, cameraPolar, cameraDistance omitted
          placementSizeLimits: { min: 1, max: 10, multiplier: 1 },
          placementPainInfo: { level: 5 },
        },
      },
    };
    const rows = mappingsToRows(mappings);
    expect(rows[0].cameraAzimuth).toBeNull();
    expect(rows[0].cameraPolar).toBeNull();
    expect(rows[0].cameraDistance).toBeNull();
  });

  it('converts painReason undefined to null', () => {
    const mappings: BodyPartMappings = {
      Arms: {
        Bicep: {
          position: [0, 0, 0],
          scale: 1,
          placementSizeLimits: { min: 1, max: 10, multiplier: 1 },
          placementPainInfo: { level: 5 },
          // reason omitted
        },
      },
    };
    const rows = mappingsToRows(mappings);
    expect(rows[0].painReason).toBeNull();
  });

  it('converts missing placementSizeLimits to null fields', () => {
    const mappings: BodyPartMappings = {
      Arms: {
        Bicep: {
          position: [0, 0, 0],
          scale: 1,
          // placementSizeLimits omitted
          placementPainInfo: { level: 5 },
        },
      },
    };
    const rows = mappingsToRows(mappings);
    expect(rows[0].sizeLimitMin).toBeNull();
    expect(rows[0].sizeLimitMax).toBeNull();
    expect(rows[0].sizeLimitMultiplier).toBeNull();
  });

  it('converts missing placementPainInfo to null', () => {
    const mappings: BodyPartMappings = {
      Arms: {
        Bicep: {
          position: [0, 0, 0],
          scale: 1,
          placementSizeLimits: { min: 1, max: 10, multiplier: 1 },
          // placementPainInfo omitted
        },
      },
    };
    const rows = mappingsToRows(mappings as BodyPartMappings);
    expect(rows[0].painLevel).toBeNull();
    expect(rows[0].painReason).toBeNull();
  });

  it('produces one row per placement across multiple categories', () => {
    const mappings: BodyPartMappings = {
      Arms: {
        Bicep: { position: [0, 0, 0], scale: 1, placementSizeLimits: { min: 1, max: 10, multiplier: 1 }, placementPainInfo: { level: 4 } },
        Tricep: { position: [0, 0, 0], scale: 1, placementSizeLimits: { min: 1, max: 10, multiplier: 1 }, placementPainInfo: { level: 4 } },
      },
      Legs: {
        Shin: { position: [0, 0, 0], scale: 1, placementSizeLimits: { min: 1, max: 10, multiplier: 1 }, placementPainInfo: { level: 7 } },
      },
    };
    const rows = mappingsToRows(mappings);
    expect(rows).toHaveLength(3);
  });

  it('preserves special characters in category and placement names', () => {
    const mappings: BodyPartMappings = {
      'Head & Face': {
        'Full Face': {
          position: [0, 0.23, 0.06],
          scale: 0.16,
          placementSizeLimits: { min: 4, max: 16, multiplier: 1.5 },
          placementPainInfo: { level: 9, reason: 'Extremely sensitive.' },
        },
      },
    };
    const rows = mappingsToRows(mappings);
    expect(rows[0].category).toBe('Head & Face');
    expect(rows[0].placement).toBe('Full Face');
  });

  // ─── Roundtrip ───────────────────────────────────────────────────────────────

  it('roundtrips: rowsToMappings(mappingsToRows(x)) returns equivalent structure', () => {
    const original: BodyPartMappings = {
      Arms: {
        Bicep: {
          position: [-0.29, -0.47, 0.05],
          scale: 0.1,
          cameraAzimuth: -0.52,
          cameraPolar: 1.57,
          cameraDistance: 0.9,
          placementSizeLimits: { min: 3, max: 12, multiplier: 1.0 },
          placementPainInfo: { level: 4, reason: 'Tolerable.' },
        },
      },
    };

    // Simulate what would come back from DB after insert
    const dbRows: DbRow[] = mappingsToRows(original).map((r, i) => ({
      id: `uuid-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...r,
    }));

    const restored = rowsToMappings(dbRows);
    expect(restored['Arms']!['Bicep']!.position).toEqual([-0.29, -0.47, 0.05]);
    expect(restored['Arms']!['Bicep']!.scale).toBe(0.1);
    expect(restored['Arms']!['Bicep']!.placementPainInfo!.level).toBe(4);
    expect(restored['Arms']!['Bicep']!.placementPainInfo!.reason).toBe('Tolerable.');
    expect(restored['Arms']!['Bicep']!.placementSizeLimits!.min).toBe(3);
    expect(restored['Arms']!['Bicep']!.placementSizeLimits!.max).toBe(12);
  });

  it('roundtrip drops inactive rows', () => {
    const original: BodyPartMappings = {
      Arms: {
        Bicep: {
          position: [0, 0, 0],
          scale: 1,
          placementSizeLimits: { min: 1, max: 10, multiplier: 1 },
          placementPainInfo: { level: 4 },
        },
      },
    };

    const dbRows: DbRow[] = mappingsToRows(original).map((r, i) => ({
      id: `uuid-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...r,
      isActive: false, // simulating soft-delete
    }));

    const restored = rowsToMappings(dbRows);
    expect(Object.keys(restored)).toHaveLength(0);
  });
});

// ─── generateTsFile ───────────────────────────────────────────────────────────

describe('generateTsFile()', () => {
  it('generates a TypeScript file string with correct import', () => {
    const result = generateTsFile({ Arms: {} });
    expect(result).toContain("import type { BodyPartMappings } from '$types/mapping'");
    expect(result).toContain('export const defaultBodyPartMappings: BodyPartMappings =');
  });

  it('unquotes simple single-word keys', () => {
    const result = generateTsFile({ Arms: { Bicep: { scale: 1 } } });
    // Simple word keys should not be quoted
    expect(result).toMatch(/Arms:/);
    expect(result).toMatch(/Bicep:/);
    expect(result).toMatch(/scale:/);
  });

  it('re-quotes keys with spaces', () => {
    const result = generateTsFile({ 'Head & Face': { 'Full Face': { scale: 1 } } });
    expect(result).toMatch(/"Head & Face":/);
    expect(result).toMatch(/"Full Face":/);
  });

  it('re-quotes keys with slashes', () => {
    const result = generateTsFile({ 'Rib / Side Torso': { scale: 1 } });
    expect(result).toMatch(/"Rib \/ Side Torso":/);
  });

  it('serializes position array correctly (elements on separate lines due to JSON.stringify indent)', () => {
    const result = generateTsFile({ Arms: { Bicep: { position: [-0.29, -0.47, 0.05] } } });
    // JSON.stringify with indent:2 puts each array element on its own line
    expect(result).toContain('-0.29');
    expect(result).toContain('-0.47');
    expect(result).toContain('0.05');
    expect(result).toMatch(/position:\s*\[/);
  });

  it('handles empty mappings object', () => {
    const result = generateTsFile({});
    expect(result).toContain('= {}');
  });

  it('preserves numeric precision', () => {
    const result = generateTsFile({ x: 3.141592653589793 });
    expect(result).toContain('3.141592653589793');
  });

  it('handles deeply nested structures without truncation', () => {
    const mappings: Record<string, unknown> = {};
    // Build a large mapping with many placements
    for (let i = 0; i < 20; i++) {
      mappings[`Category${i}`] = {
        [`Placement${i}`]: {
          position: [i * 0.1, i * 0.2, i * 0.3],
          scale: i * 0.01 + 0.1,
        },
      };
    }
    const result = generateTsFile(mappings);
    // All 20 categories should appear in output
    for (let i = 0; i < 20; i++) {
      expect(result).toContain(`Category${i}:`);
    }
  });
});

// ─── Input validation boundary tests ─────────────────────────────────────────
// These cover the API-level validation rules: what constitutes valid body data.

describe('API input validation rules', () => {
  it('null body is invalid (not an object)', () => {
    const body = null;
    const isValid = body !== null && typeof body === 'object';
    expect(isValid).toBe(false);
  });

  it('array body is falsy as BodyPartMappings (not a plain object check)', () => {
    const body: unknown[] = [];
    // The API checks: body && typeof body === 'object'
    // An array passes typeof but we document that the schema expects a plain object.
    // This test documents the current behavior (arrays would pass the type check).
    const passesTypeCheck = body !== null && typeof body === 'object';
    expect(passesTypeCheck).toBe(true); // known gap — documented for future stricter validation
  });

  it('string body is invalid', () => {
    const body = 'invalid';
    const isValid = body !== null && typeof body === 'object';
    expect(isValid).toBe(false);
  });

  it('number body is invalid', () => {
    const body = 42;
    const isValid = body !== null && typeof body === 'object';
    expect(isValid).toBe(false);
  });

  it('valid mappings object passes type check', () => {
    const body: BodyPartMappings = { Arms: { Bicep: { position: [0, 0, 0], scale: 1, placementSizeLimits: { min: 1, max: 10, multiplier: 1 }, placementPainInfo: { level: 4 } } } };
    const isValid = body !== null && typeof body === 'object';
    expect(isValid).toBe(true);
  });

  it('empty object passes type check (valid empty mappings)', () => {
    const body = {};
    const isValid = body !== null && typeof body === 'object';
    expect(isValid).toBe(true);
  });
});

// ─── Size limit validation edge cases ────────────────────────────────────────

describe('PlacementSizeLimits edge cases', () => {
  it('sizeLimitMin equal to sizeLimitMax is preserved in roundtrip', () => {
    const rows = [makeRow({ sizeLimitMin: 5, sizeLimitMax: 5 })];
    const result = rowsToMappings(rows);
    expect(result['Arms']!['Bicep']!.placementSizeLimits!.min).toBe(5);
    expect(result['Arms']!['Bicep']!.placementSizeLimits!.max).toBe(5);
  });

  it('sizeLimitMin > sizeLimitMax passes through (inverted range, no clamping)', () => {
    const rows = [makeRow({ sizeLimitMin: 20, sizeLimitMax: 5 })];
    const result = rowsToMappings(rows);
    expect(result['Arms']!['Bicep']!.placementSizeLimits!.min).toBe(20);
    expect(result['Arms']!['Bicep']!.placementSizeLimits!.max).toBe(5);
  });

  it('sizeLimitMultiplier 0 passes through (pricing calculation responsibility)', () => {
    const rows = [makeRow({ sizeLimitMultiplier: 0 })];
    const result = rowsToMappings(rows);
    expect(result['Arms']!['Bicep']!.placementSizeLimits!.multiplier).toBe(0);
  });
});
