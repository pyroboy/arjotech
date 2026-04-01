/**
 * Test data fixtures for floor data ingestion pipeline tests
 * Task #5c04f380
 *
 * Reusable factory functions and static fixtures for:
 *   - bodyPartMappings DB rows
 *   - BodyPartMappings nested objects
 *   - pricingDetails (financial fields)
 *   - Edge-case payloads (nulls, out-of-range, concurrent writes)
 *
 * Usage:
 *   import { makeDbRow, makeMapping, FIXTURES } from './floor-data-fixtures';
 */

import type { BodyPartMappings } from '../lib/types/mapping';

// ─── DB Row type ──────────────────────────────────────────────────────────────

export type DbRow = {
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

// ─── DB Row factory ───────────────────────────────────────────────────────────

let rowCounter = 0;

/**
 * Creates a valid, fully-populated DB row for body_part_mappings.
 * All optional fields are non-null by default for maximum coverage.
 * Override specific fields via the overrides parameter.
 */
export function makeDbRow(overrides: Partial<DbRow> = {}): DbRow {
  rowCounter++;
  return {
    id: `test-uuid-${rowCounter}`,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    category: 'Arms',
    placement: 'Bicep',
    positionX: -0.29,
    positionY: -0.47,
    positionZ: 0.05,
    scale: 0.1,
    cameraAzimuth: -0.5235987755982988,
    cameraPolar: 1.5707963267948966,
    cameraDistance: 0.9,
    sizeLimitMin: 3,
    sizeLimitMax: 12,
    sizeLimitMultiplier: 1.0,
    painLevel: 4,
    painReason: 'Generally tolerable area.',
    isActive: true,
    ...overrides,
  };
}

/**
 * Creates a DB row with all nullable fields set to null.
 * Used to test default-value fallbacks in rowsToMappings().
 */
export function makeNullableDbRow(overrides: Partial<DbRow> = {}): DbRow {
  return makeDbRow({
    cameraAzimuth: null,
    cameraPolar: null,
    cameraDistance: null,
    sizeLimitMin: null,
    sizeLimitMax: null,
    sizeLimitMultiplier: null,
    painLevel: null,
    painReason: null,
    ...overrides,
  });
}

/**
 * Creates an inactive DB row (soft-deleted state).
 */
export function makeInactiveDbRow(overrides: Partial<DbRow> = {}): DbRow {
  return makeDbRow({ isActive: false, ...overrides });
}

// ─── Mapping data factory ─────────────────────────────────────────────────────

export type PlacementDataInput = {
  position?: [number, number, number];
  scale?: number;
  cameraAzimuth?: number;
  cameraPolar?: number;
  cameraDistance?: number;
  sizeLimitMin?: number;
  sizeLimitMax?: number;
  sizeLimitMultiplier?: number;
  painLevel?: number;
  painReason?: string;
};

/**
 * Creates a valid BodyPartMappings placement entry.
 */
export function makePlacementData(overrides: PlacementDataInput = {}) {
  return {
    position: overrides.position ?? [-0.29, -0.47, 0.05] as [number, number, number],
    scale: overrides.scale ?? 0.1,
    cameraAzimuth: overrides.cameraAzimuth ?? -0.52,
    cameraPolar: overrides.cameraPolar ?? 1.57,
    cameraDistance: overrides.cameraDistance ?? 0.9,
    placementSizeLimits: {
      min: overrides.sizeLimitMin ?? 3,
      max: overrides.sizeLimitMax ?? 12,
      multiplier: overrides.sizeLimitMultiplier ?? 1.0,
    },
    placementPainInfo: {
      level: overrides.painLevel ?? 4,
      reason: overrides.painReason,
    },
  };
}

/**
 * Creates a BodyPartMappings object with one category and one placement.
 */
export function makeSinglePlacementMappings(
  category = 'Arms',
  placement = 'Bicep',
  data: PlacementDataInput = {}
): BodyPartMappings {
  return {
    [category]: {
      [placement]: makePlacementData(data),
    },
  };
}

/**
 * Creates a BodyPartMappings object with multiple placements across categories.
 * Default: 3 categories × 2 placements each = 6 total.
 */
export function makeMultiCategoryMappings(): BodyPartMappings {
  return {
    Arms: {
      Bicep: makePlacementData({ painLevel: 4 }),
      Tricep: makePlacementData({ painLevel: 4, position: [-0.29, -0.47, -0.08] }),
    },
    Legs: {
      Shin: makePlacementData({ painLevel: 7, sizeLimitMin: 3, sizeLimitMax: 14 }),
      Calf: makePlacementData({ painLevel: 5, position: [-0.19, -1.55, -0.16] }),
    },
    'Head & Face': {
      Forehead: makePlacementData({ painLevel: 8, sizeLimitMin: 1, sizeLimitMax: 6 }),
      Cheek: makePlacementData({ painLevel: 7, sizeLimitMin: 0.5, sizeLimitMax: 4 }),
    },
  };
}

// ─── Edge-case fixtures ───────────────────────────────────────────────────────

/**
 * Rows that exercise every documented edge case in FLOOR_DATA_COVERAGE.md
 */
export const EDGE_CASE_ROWS = {
  /** pain level 0 — below valid 1–10 range */
  painLevelZero: makeDbRow({ painLevel: 0, painReason: 'Below minimum pain level.' }),

  /** pain level above max */
  painLevelAboveMax: makeDbRow({ painLevel: 10.5 }),

  /** negative pain level */
  painLevelNegative: makeDbRow({ painLevel: -1 }),

  /** zero scale — invisible 3D element */
  zeroScale: makeDbRow({ scale: 0 }),

  /** negative scale */
  negativeScale: makeDbRow({ scale: -0.5 }),

  /** NaN position X */
  nanPositionX: makeDbRow({ positionX: NaN }),

  /** Infinity position Y */
  infinityPositionY: makeDbRow({ positionY: Infinity }),

  /** inverted size limits (min > max) */
  invertedSizeLimits: makeDbRow({ sizeLimitMin: 20, sizeLimitMax: 5 }),

  /** equal min/max size limits */
  equalSizeLimits: makeDbRow({ sizeLimitMin: 8, sizeLimitMax: 8 }),

  /** zero multiplier */
  zeroMultiplier: makeDbRow({ sizeLimitMultiplier: 0 }),

  /** zero camera distance */
  zeroCameraDistance: makeDbRow({ cameraDistance: 0 }),

  /** negative camera distance */
  negativeCameraDistance: makeDbRow({ cameraDistance: -1 }),

  /** empty string category */
  emptyCategory: makeDbRow({ category: '' }),

  /** empty string placement */
  emptyPlacement: makeDbRow({ placement: '' }),

  /** category with special chars */
  specialCharsCategory: makeDbRow({ category: 'Head & Face', placement: 'Full Face' }),

  /** placement with slash */
  slashPlacement: makeDbRow({ category: 'Upper Torso', placement: 'Rib / Side Torso' }),

  /** very long pain reason */
  longPainReason: makeDbRow({ painReason: 'x'.repeat(1000) }),

  /** all nullables null */
  allNulls: makeNullableDbRow(),

  /** inactive row */
  inactive: makeInactiveDbRow(),
};

/**
 * Set of rows covering all null-default scenarios for rowsToMappings().
 */
export const NULL_DEFAULT_ROWS: DbRow[] = [
  makeNullableDbRow({ placement: 'NullAll' }),
  makeDbRow({ painLevel: null, placement: 'NullPainLevel' }),
  makeDbRow({ painReason: null, placement: 'NullPainReason' }),
  makeDbRow({ sizeLimitMin: null, placement: 'NullSizeLimitMin' }),
  makeDbRow({ sizeLimitMax: null, placement: 'NullSizeLimitMax' }),
  makeDbRow({ sizeLimitMultiplier: null, placement: 'NullMultiplier' }),
  makeDbRow({ cameraAzimuth: null, placement: 'NullAzimuth' }),
  makeDbRow({ cameraPolar: null, placement: 'NullPolar' }),
  makeDbRow({ cameraDistance: null, placement: 'NullDistance' }),
];

/**
 * Mixed active/inactive rows for testing isActive filter.
 */
export const MIXED_ACTIVE_INACTIVE_ROWS: DbRow[] = [
  makeDbRow({ placement: 'ActiveBicep', isActive: true }),
  makeDbRow({ placement: 'InactiveBicep', isActive: false }),
  makeDbRow({ placement: 'ActiveTricep', isActive: true }),
  makeDbRow({ placement: 'InactiveTricep', isActive: false }),
];

// ─── Financial data fixtures ──────────────────────────────────────────────────

/**
 * Valid pricingDetails object matching the bookings table schema.
 */
export type PricingDetails = {
  basePriceRaw: number;
  complexityPrice: number;
  placementPrice: number;
  colorPrice: number;
  coverUpPrice: number;
  total: number;
};

export function makePricingDetails(overrides: Partial<PricingDetails> = {}): PricingDetails {
  return {
    basePriceRaw: 2000,
    complexityPrice: 500,
    placementPrice: 300,
    colorPrice: 200,
    coverUpPrice: 0,
    total: 3000,
    ...overrides,
  };
}

/**
 * Financial edge-case fixtures for task #f9da580e.
 */
export const FINANCIAL_EDGE_CASES = {
  /** All zero amounts */
  allZero: makePricingDetails({
    basePriceRaw: 0,
    complexityPrice: 0,
    placementPrice: 0,
    colorPrice: 0,
    coverUpPrice: 0,
    total: 0,
  }),

  /** Negative base price (refund scenario) */
  negativeBase: makePricingDetails({ basePriceRaw: -1000, total: -1000 }),

  /** Total does not match sum of components */
  mismatchedTotal: makePricingDetails({ basePriceRaw: 2000, total: 9999 }),

  /** Very large amount */
  largeAmount: makePricingDetails({ basePriceRaw: 999_999_999, total: 999_999_999 }),

  /** Fractional amounts (cents precision) */
  fractional: makePricingDetails({ basePriceRaw: 1999.99, total: 2499.99 }),

  /** Missing total (null) — tests guard against missing fields */
  missingTotal: { basePriceRaw: 2000, complexityPrice: 500, placementPrice: 300, colorPrice: 200, coverUpPrice: 0 } as Partial<PricingDetails>,

  /** Null pricing object */
  nullPricing: null as null,
};

// ─── Mock storage factories ───────────────────────────────────────────────────

/**
 * Creates an in-memory KV store mock.
 * Pass initial data to pre-populate with a cached value.
 */
export function makeMockKV(initialData?: BodyPartMappings | null | Record<string, never>) {
  const KV_KEY = 'body_part_mappings';
  const store: Record<string, string> = {};
  if (initialData !== undefined && initialData !== null) {
    store[KV_KEY] = JSON.stringify(initialData);
  }
  return {
    store,
    async get(key: string, _type: 'json') {
      const val = store[key];
      if (!val) return null;
      return JSON.parse(val) as unknown;
    },
    async put(key: string, value: string) {
      store[key] = value;
    },
    /** Check if the KV store has a specific key (helper for assertions) */
    has(key: string): boolean {
      return key in store;
    },
    /** Get raw stored string value (for inspection in tests) */
    getRaw(key: string): string | undefined {
      return store[key];
    },
  };
}

/**
 * Creates an in-memory DB mock.
 * Rows can be pre-seeded; updates are tracked in-memory.
 */
export function makeMockDb(rows: DbRow[] = []) {
  const dbRows = rows.map(r => ({ ...r })); // clone to avoid mutation
  let selectCallCount = 0;
  let updateCallCount = 0;
  let insertCallCount = 0;

  return {
    rows: dbRows,
    get selectCallCount() { return selectCallCount; },
    get updateCallCount() { return updateCallCount; },
    get insertCallCount() { return insertCallCount; },

    async selectActiveRows(): Promise<DbRow[]> {
      selectCallCount++;
      return dbRows.filter(r => r.isActive);
    },

    async updateDeactivate(): Promise<void> {
      updateCallCount++;
      for (const r of dbRows) r.isActive = false;
    },

    async insertRows(newRows: Omit<DbRow, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
      insertCallCount++;
      let counter = 0;
      for (const r of newRows) {
        dbRows.push({
          id: `inserted-uuid-${Date.now()}-${counter++}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...r,
        });
      }
    },

    /** Returns only active rows (helper for assertions) */
    getActiveRows(): DbRow[] {
      return dbRows.filter(r => r.isActive);
    },

    /** Returns all rows including inactive (helper for assertions) */
    getAllRows(): DbRow[] {
      return [...dbRows];
    },
  };
}

// ─── Full default mappings fixture (representative subset) ────────────────────

/**
 * A representative subset of the real defaultBodyPartMappings
 * covering all edge-case categories. Used for roundtrip tests.
 */
export const REPRESENTATIVE_MAPPINGS: BodyPartMappings = {
  'Head & Face': {
    'Full Face': {
      position: [0, 0.23, 0.06],
      scale: 0.16,
      cameraAzimuth: 0,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.8,
      placementSizeLimits: { min: 4, max: 16, multiplier: 1.5 },
      placementPainInfo: { level: 9, reason: 'Extremely sensitive, many nerve endings, thin skin over bones.' },
    },
    Temple: {
      position: [-0.08, 0.265, 0.09],
      scale: 0.05,
      cameraAzimuth: -0.7853981633974483,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.4,
      placementSizeLimits: { min: 0.5, max: 4, multiplier: 1.5 },
      placementPainInfo: { level: 9, reason: 'Very thin skin, close to temporal artery and bone.' },
    },
  },
  Arms: {
    Bicep: {
      position: [-0.29, -0.47, 0.05],
      scale: 0.1,
      cameraAzimuth: -0.5235987755982988,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.9,
      placementSizeLimits: { min: 3, max: 12, multiplier: 1.0 },
      placementPainInfo: { level: 4 },
    },
    'Full Sleeve': {
      position: [-0.41, -0.59, -0.06288945303484894],
      scale: 0.1893286663076647,
      cameraAzimuth: -0.6818199308042318,
      cameraPolar: 1.193389824788707,
      cameraDistance: 1.494979100956484,
      placementSizeLimits: { min: 100, max: 200, multiplier: 1.5 },
      placementPainInfo: { level: 6, reason: 'Covers varying pain levels (elbow/ditch high, bicep/forearm moderate).' },
    },
  },
  'Feet & Ankles': {
    Toes: {
      position: [-0.16950456457072516, -1.8927582316134988, 0.0674387116627346],
      scale: 0.04,
      cameraAzimuth: -0.25820746460012706,
      cameraPolar: 1.2792663070114167,
      cameraDistance: 0.7831753899985433,
      placementSizeLimits: { min: 0.5, max: 1.5, multiplier: 1.8 },
      placementPainInfo: { level: 9, reason: 'Very thin skin, bones, many nerve endings.' },
    },
  },
};

// ─── Concurrent write simulation fixtures ────────────────────────────────────

/**
 * Two different mapping payloads for simulating concurrent writes.
 * In last-writer-wins semantics, the second PUT should be the final state.
 */
export const CONCURRENT_WRITE_FIXTURES = {
  firstWrite: makeSinglePlacementMappings('Arms', 'Bicep', {
    painLevel: 4,
    position: [0, 0, 0],
    scale: 0.1,
  }),
  secondWrite: makeSinglePlacementMappings('Arms', 'Bicep', {
    painLevel: 7,
    position: [1, 2, 3],
    scale: 0.2,
  }),
};
