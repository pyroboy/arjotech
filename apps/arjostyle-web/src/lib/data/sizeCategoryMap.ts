export const SIZE_CATEGORIES = [
  { id: 'tiny', label: 'Tiny', description: 'Coin to matchbox', example: '1-2 sq in', sqInches: 2 },
  { id: 'small', label: 'Small', description: 'Credit card to palm', example: '2-6 sq in', sqInches: 4 },
  { id: 'medium', label: 'Medium', description: 'Palm to hand', example: '6-12 sq in', sqInches: 9 },
  { id: 'large', label: 'Large', description: 'Hand to forearm', example: '12-24 sq in', sqInches: 18 },
  { id: 'xl', label: 'Extra Large', description: 'Half-sleeve or larger', example: '24+ sq in', sqInches: 36 },
] as const;

export type SizeCategoryId = typeof SIZE_CATEGORIES[number]['id'];

export function sizeCategoryToSqInches(category: string | null): number {
  return SIZE_CATEGORIES.find(c => c.id === category)?.sqInches ?? 0;
}

export function getPriceRange(category: string | null, isColor: boolean, isCoverUp: boolean): { min: number; max: number } {
  const ranges: Record<string, [number, number]> = {
    tiny: [1000, 3000],
    small: [3000, 8000],
    medium: [8000, 15000],
    large: [15000, 30000],
    xl: [30000, 60000],
  };
  let [min, max] = ranges[category ?? ''] ?? [0, 0];
  if (isColor) { min = Math.round(min * 1.3); max = Math.round(max * 1.3); }
  if (isCoverUp) { min = Math.round(min * 1.5); max = Math.round(max * 1.5); }
  return { min, max };
}
