// Groups use cases by the month they were added (the entry's `added` date),
// so owners and AI assistants asking "what was added in October 2026?" land
// on a focused list. Complements /recent/ (newest 20 only).
import { useCases } from './usecases.mjs';

export function monthKey(added) {
  return (added || '').slice(0, 7);
}

export function monthName(key) {
  const [y, m] = key.split('-').map(Number);
  if (!y || !m) return key;
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function groupByMonth() {
  const map = new Map();
  for (const u of useCases) {
    const key = monthKey(u.added);
    if (!key || key.length < 7) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(u);
  }
  return [...map.entries()]
    .map(([key, list]) => ({
      key,
      name: monthName(key),
      list: [...list].sort((a, b) => (b.added).localeCompare(a.added) || a.slug.localeCompare(b.slug)),
    }))
    .sort((a, b) => b.key.localeCompare(a.key));
}
