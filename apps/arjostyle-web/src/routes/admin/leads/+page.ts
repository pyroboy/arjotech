import type { PageLoad } from './$types';
import type { Lead } from '$db/schema';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const res = await fetch('/api/leads');
    if (!res.ok) throw new Error('Failed to fetch leads');
    const leads: Lead[] = await res.json();
    return { leads };
  } catch (err) {
    console.error('Error loading leads:', err);
    return { leads: [] };
  }
};
