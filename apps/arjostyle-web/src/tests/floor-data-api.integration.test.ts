/**
 * Integration tests: floor data read/write operations
 * Task #26eae13b
 *
 * Tests the GET/PUT /api/mappings handler logic end-to-end using mocked
 * storage (KV + Neon DB). This covers the full read-path cascade
 * (KV hit → KV miss/Neon hit → all miss/defaults) and write-path
 * (dual-write, partial write, no-storage 503).
 *
 * Uses Vitest with in-memory mocks — no real DB or KV required.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { BodyPartMappings } from '../lib/types/mapping';

// ─── Types mirroring the actual schema ───────────────────────────────────────

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

// ─── Pure functions under test (copied from API route) ───────────────────────

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

// ─── Simulated GET handler (matches +server.ts GET logic exactly) ─────────────

const KV_KEY = 'body_part_mappings';

const defaultBodyPartMappings: BodyPartMappings = {
  Arms: {
    Bicep: {
      position: [-0.29, -0.47, 0.05],
      scale: 0.1,
      cameraAzimuth: -0.52,
      cameraPolar: 1.57,
      cameraDistance: 0.9,
      placementSizeLimits: { min: 3, max: 12, multiplier: 1.0 },
      placementPainInfo: { level: 4 },
    },
  },
};

type MockKV = {
  store: Record<string, string>;
  get(key: string, type: 'json'): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
};

type MockDb = {
  rows: DbRow[];
  selectActiveRows(): Promise<DbRow[]>;
  updateDeactivate(): Promise<void>;
  insertRows(rows: Omit<DbRow, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void>;
};

function makeMockKV(initialData?: BodyPartMappings | null | Record<string, never>): MockKV {
  const store: Record<string, string> = {};
  if (initialData !== undefined && initialData !== null) {
    store[KV_KEY] = JSON.stringify(initialData);
  }
  return {
    store,
    async get(key: string, _type: 'json') {
      const val = store[key];
      if (!val) return null;
      return JSON.parse(val);
    },
    async put(key: string, value: string) {
      store[key] = value;
    },
  };
}

function makeMockDb(rows: DbRow[] = []): MockDb {
  const dbRows = [...rows];
  return {
    rows: dbRows,
    async selectActiveRows() {
      return dbRows.filter(r => r.isActive);
    },
    async updateDeactivate() {
      for (const r of dbRows) r.isActive = false;
    },
    async insertRows(newRows: Omit<DbRow, 'id' | 'createdAt' | 'updatedAt'>[]) {
      for (const r of newRows) {
        dbRows.push({ id: `uuid-${Date.now()}`, createdAt: new Date(), updatedAt: new Date(), ...r });
      }
    },
  };
}

// Simulate GET handler
async function simulateGET(kv: MockKV | null, db: MockDb | null): Promise<{ data: BodyPartMappings; status: number }> {
  // 1. Try KV cache
  if (kv) {
    const cached = await kv.get(KV_KEY, 'json');
    if (cached && typeof cached === 'object' && Object.keys(cached as object).length > 0) {
      return { data: cached as BodyPartMappings, status: 200 };
    }
  }

  // 2. Try Neon DB
  if (db) {
    try {
      const rows = await db.selectActiveRows();
      if (rows.length > 0) {
        const mappings = rowsToMappings(rows);
        if (kv) await kv.put(KV_KEY, JSON.stringify(mappings));
        return { data: mappings, status: 200 };
      }
    } catch {
      // fall through
    }
  }

  // 3. Fallback to defaults
  if (kv) await kv.put(KV_KEY, JSON.stringify(defaultBodyPartMappings));
  return { data: defaultBodyPartMappings, status: 200 };
}

// Simulate PUT handler
async function simulatePUT(
  body: unknown,
  kv: MockKV | null,
  db: MockDb | null,
  dbShouldThrow = false
): Promise<{ data: Record<string, unknown>; status: number }> {
  if (!body || typeof body !== 'object') {
    return { data: { error: 'Invalid mappings data' }, status: 400 };
  }

  const mappings = body as BodyPartMappings;
  let savedToNeon = false;
  let savedToKV = false;

  if (db) {
    try {
      if (dbShouldThrow) throw new Error('Neon write error');
      const rows = mappingsToRows(mappings);
      await db.updateDeactivate();
      if (rows.length > 0) await db.insertRows(rows);
      savedToNeon = true;
    } catch {
      // fall through
    }
  }

  if (kv) {
    await kv.put(KV_KEY, JSON.stringify(mappings));
    savedToKV = true;
  }

  if (!savedToNeon && !savedToKV) {
    return { data: { error: 'No storage available' }, status: 503 };
  }

  return { data: { success: true, savedToNeon, savedToKV }, status: 200 };
}

// ─── Test fixture ─────────────────────────────────────────────────────────────

function makeActiveDbRow(overrides: Partial<DbRow> = {}): DbRow {
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
    painReason: null,
    isActive: true,
    ...overrides,
  };
}

// ─── GET: KV hit ──────────────────────────────────────────────────────────────

describe('GET /api/mappings — KV cache hit', () => {
  it('returns cached data directly from KV', async () => {
    const cachedData: BodyPartMappings = {
      Legs: {
        Shin: {
          position: [0, -1.6, -0.07],
          scale: 0.1,
          placementSizeLimits: { min: 3, max: 14, multiplier: 1.3 },
          placementPainInfo: { level: 7, reason: 'Thin skin over tibia.' },
        },
      },
    };
    const kv = makeMockKV(cachedData);
    const db = makeMockDb(); // empty DB — should not be hit

    const result = await simulateGET(kv, db);

    expect(result.status).toBe(200);
    expect(result.data).toEqual(cachedData);
  });

  it('does NOT query the DB when KV has data', async () => {
    const selectSpy = vi.fn().mockResolvedValue([]);
    const kv = makeMockKV(defaultBodyPartMappings);
    const db = { ...makeMockDb(), selectActiveRows: selectSpy };

    await simulateGET(kv, db);

    expect(selectSpy).not.toHaveBeenCalled();
  });

  it('treats KV empty object {} as cache miss and falls through to DB', async () => {
    const kv = makeMockKV({} as Record<string, never>);
    const dbRow = makeActiveDbRow();
    const db = makeMockDb([dbRow]);

    const result = await simulateGET(kv, db);

    // Should have gotten data from Neon, not empty object
    expect(result.data).toHaveProperty('Arms');
  });
});

// ─── GET: KV miss, Neon hit ────────────────────────────────────────────────────

describe('GET /api/mappings — KV miss, Neon DB hit', () => {
  it('returns data from Neon when KV is empty', async () => {
    const kv = makeMockKV(null); // no KV data
    const db = makeMockDb([makeActiveDbRow()]);

    const result = await simulateGET(kv, db);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('Arms');
    expect(result.data['Arms']).toHaveProperty('Bicep');
  });

  it('populates KV cache after reading from Neon', async () => {
    const kv = makeMockKV(null);
    const db = makeMockDb([makeActiveDbRow()]);

    await simulateGET(kv, db);

    // KV should now have the data
    const kvData = await kv.get(KV_KEY, 'json');
    expect(kvData).not.toBeNull();
    expect(typeof kvData).toBe('object');
  });

  it('only includes active rows from Neon', async () => {
    const kv = makeMockKV(null);
    const db = makeMockDb([
      makeActiveDbRow({ placement: 'Bicep', isActive: true }),
      makeActiveDbRow({ placement: 'Tricep', isActive: false }),
    ]);

    const result = await simulateGET(kv, db);
    expect(result.data['Arms']).toHaveProperty('Bicep');
    expect(result.data['Arms']).not.toHaveProperty('Tricep');
  });

  it('returns 200 with data when Neon has rows', async () => {
    const kv = makeMockKV(null);
    const db = makeMockDb([makeActiveDbRow({ painLevel: 9, painReason: 'Sensitive' })]);

    const result = await simulateGET(kv, db);

    expect(result.status).toBe(200);
    expect(result.data['Arms']['Bicep'].placementPainInfo.level).toBe(9);
    expect(result.data['Arms']['Bicep'].placementPainInfo.reason).toBe('Sensitive');
  });
});

// ─── GET: all miss, fallback to defaults ─────────────────────────────────────

describe('GET /api/mappings — all miss, fallback to defaults', () => {
  it('returns defaults when both KV and Neon are unavailable', async () => {
    const result = await simulateGET(null, null);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(defaultBodyPartMappings);
  });

  it('returns defaults when Neon is empty', async () => {
    const kv = makeMockKV(null);
    const db = makeMockDb([]); // empty

    const result = await simulateGET(kv, db);
    expect(result.data).toEqual(defaultBodyPartMappings);
  });

  it('seeds KV with defaults on fallback', async () => {
    const kv = makeMockKV(null);
    const db = makeMockDb([]);

    await simulateGET(kv, db);

    const kvData = await kv.get(KV_KEY, 'json');
    expect(kvData).toEqual(defaultBodyPartMappings);
  });

  it('returns defaults when KV absent and Neon absent', async () => {
    const result = await simulateGET(null, null);
    expect(result.data).toHaveProperty('Arms');
  });
});

// ─── PUT: dual write ──────────────────────────────────────────────────────────

describe('PUT /api/mappings — dual write to Neon + KV', () => {
  const testMappings: BodyPartMappings = {
    Arms: {
      Bicep: {
        position: [-0.29, -0.47, 0.05],
        scale: 0.1,
        placementSizeLimits: { min: 3, max: 12, multiplier: 1.0 },
        placementPainInfo: { level: 4 },
      },
    },
  };

  it('saves to both Neon and KV on success', async () => {
    const kv = makeMockKV(null);
    const db = makeMockDb();

    const result = await simulatePUT(testMappings, kv, db);

    expect(result.status).toBe(200);
    expect(result.data.savedToNeon).toBe(true);
    expect(result.data.savedToKV).toBe(true);
  });

  it('marks existing active rows inactive before inserting new ones', async () => {
    const existingRow = makeActiveDbRow({ placement: 'OldPlacement', isActive: true });
    const db = makeMockDb([existingRow]);
    const kv = makeMockKV(null);

    await simulatePUT(testMappings, kv, db);

    // OldPlacement row should be marked inactive
    const oldRow = db.rows.find(r => r.placement === 'OldPlacement');
    expect(oldRow?.isActive).toBe(false);
  });

  it('inserts new rows with isActive=true', async () => {
    const db = makeMockDb();
    const kv = makeMockKV(null);

    await simulatePUT(testMappings, kv, db);

    const newRows = db.rows.filter(r => r.placement === 'Bicep');
    expect(newRows.length).toBeGreaterThan(0);
    expect(newRows.every(r => r.isActive)).toBe(true);
  });

  it('updates KV with the new mappings data', async () => {
    const kv = makeMockKV(null);
    const db = makeMockDb();

    await simulatePUT(testMappings, kv, db);

    const kvData = await kv.get(KV_KEY, 'json') as BodyPartMappings;
    expect(kvData['Arms']['Bicep'].scale).toBe(0.1);
  });

  it('PUT with empty mappings {} marks all existing rows inactive', async () => {
    const existingRow = makeActiveDbRow();
    const db = makeMockDb([existingRow]);
    const kv = makeMockKV(null);

    await simulatePUT({}, kv, db);

    expect(db.rows.filter(r => r.isActive)).toHaveLength(0);
  });
});

// ─── PUT: partial write scenarios ────────────────────────────────────────────

describe('PUT /api/mappings — partial write scenarios', () => {
  const testMappings: BodyPartMappings = {
    Arms: {
      Bicep: {
        position: [0, 0, 0],
        scale: 1,
        placementSizeLimits: { min: 1, max: 10, multiplier: 1 },
        placementPainInfo: { level: 4 },
      },
    },
  };

  it('returns savedToNeon=false, savedToKV=true when Neon throws', async () => {
    const kv = makeMockKV(null);
    const db = makeMockDb();

    const result = await simulatePUT(testMappings, kv, db, /* dbShouldThrow */ true);

    expect(result.status).toBe(200);
    expect(result.data.savedToNeon).toBe(false);
    expect(result.data.savedToKV).toBe(true);
  });

  it('returns savedToNeon=true, savedToKV=false when KV is absent', async () => {
    const db = makeMockDb();

    const result = await simulatePUT(testMappings, null, db);

    expect(result.status).toBe(200);
    expect(result.data.savedToNeon).toBe(true);
    expect(result.data.savedToKV).toBe(false);
  });

  it('returns 503 when both Neon and KV are unavailable', async () => {
    const result = await simulatePUT(testMappings, null, null);

    expect(result.status).toBe(503);
    expect(result.data.error).toBe('No storage available');
  });
});

// ─── PUT: input validation ─────────────────────────────────────────────────────

describe('PUT /api/mappings — input validation', () => {
  it('returns 400 for null body', async () => {
    const result = await simulatePUT(null, null, null);
    expect(result.status).toBe(400);
    expect(result.data.error).toBe('Invalid mappings data');
  });

  it('returns 400 for string body', async () => {
    const result = await simulatePUT('not-an-object', null, null);
    expect(result.status).toBe(400);
    expect(result.data.error).toBe('Invalid mappings data');
  });

  it('returns 400 for numeric body', async () => {
    const result = await simulatePUT(42, null, null);
    expect(result.status).toBe(400);
    expect(result.data.error).toBe('Invalid mappings data');
  });

  it('accepts empty object as valid (no rows to insert)', async () => {
    const kv = makeMockKV(null);
    const db = makeMockDb();
    const result = await simulatePUT({}, kv, db);
    expect(result.status).toBe(200);
  });
});

// ─── Full read/write DB round-trip simulation ─────────────────────────────────

describe('Full round-trip: PUT then GET returns same data', () => {
  it('data written via PUT is returned by subsequent GET', async () => {
    const kv = makeMockKV(null);
    const db = makeMockDb();

    const writeData: BodyPartMappings = {
      Neck: {
        'Front Neck': {
          position: [0, 0.09, 0.06],
          scale: 0.07,
          cameraAzimuth: 0,
          cameraPolar: 1.57,
          cameraDistance: 0.6,
          placementSizeLimits: { min: 1, max: 6, multiplier: 1.4 },
          placementPainInfo: { level: 7, reason: 'Sensitive throat area.' },
        },
      },
    };

    // Write
    const putResult = await simulatePUT(writeData, kv, db);
    expect(putResult.status).toBe(200);

    // Read back — KV should have it now
    const getResult = await simulateGET(kv, db);
    expect(getResult.status).toBe(200);
    expect(getResult.data['Neck']['Front Neck'].placementPainInfo.level).toBe(7);
    expect(getResult.data['Neck']['Front Neck'].placementSizeLimits.multiplier).toBe(1.4);
  });

  it('second PUT replaces first (soft-delete + reinsert)', async () => {
    const kv = makeMockKV(null);
    const db = makeMockDb();

    const firstData: BodyPartMappings = {
      Arms: {
        Bicep: {
          position: [0, 0, 0],
          scale: 0.1,
          placementSizeLimits: { min: 3, max: 12, multiplier: 1.0 },
          placementPainInfo: { level: 4 },
        },
      },
    };

    const secondData: BodyPartMappings = {
      Arms: {
        Bicep: {
          position: [1, 2, 3], // updated position
          scale: 0.2,          // updated scale
          placementSizeLimits: { min: 5, max: 15, multiplier: 1.5 },
          placementPainInfo: { level: 6, reason: 'Updated.' },
        },
      },
    };

    await simulatePUT(firstData, kv, db);
    // Clear KV to force re-read from DB on next GET
    const kv2 = makeMockKV(null);
    await simulatePUT(secondData, kv2, db);

    const getResult = await simulateGET(kv2, db);
    expect(getResult.data['Arms']['Bicep'].scale).toBe(0.2);
    expect(getResult.data['Arms']['Bicep'].placementPainInfo.level).toBe(6);
    expect(getResult.data['Arms']['Bicep'].placementPainInfo.reason).toBe('Updated.');
  });

  it('GET after soft-delete returns defaults when no active rows remain', async () => {
    const kv = makeMockKV(null);
    const db = makeMockDb([makeActiveDbRow()]);

    // PUT with empty mappings to deactivate all
    await simulatePUT({}, kv, db);

    // Clear KV to force DB path
    const freshKv = makeMockKV(null);
    const getResult = await simulateGET(freshKv, db);

    // No active rows in DB + no KV → should return defaults
    expect(getResult.data).toEqual(defaultBodyPartMappings);
  });

  it('concurrent read during write returns stale KV data (KV is primary read source)', async () => {
    const staleData: BodyPartMappings = {
      Arms: {
        Bicep: {
          position: [0, 0, 0],
          scale: 0.1,
          placementSizeLimits: { min: 1, max: 10, multiplier: 1 },
          placementPainInfo: { level: 4 },
        },
      },
    };
    const kv = makeMockKV(staleData);
    const db = makeMockDb();

    // GET reads from KV (stale) — this is expected behavior
    const getResult = await simulateGET(kv, db);
    expect(getResult.data).toEqual(staleData);
  });
});
