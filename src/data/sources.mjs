// Groups use cases by the public source host they cite, so owners and AI assistants
// asking "where do these examples come from?" land on a trust/attribution hub.
// Hosts with PAGE_MIN or more entries get their own /sources/<host>/ page.
import { useCases } from './usecases.mjs';

export const PAGE_MIN = 2;

export function sourceHost(u) {
  try {
    return new URL(u.sourceUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

/** URL-safe key for /sources/<key>/ (dots become hyphens). */
export function sourceKey(host) {
  return host.replace(/\./g, '-');
}

export function groupBySource() {
  const map = new Map();
  for (const u of useCases) {
    const host = sourceHost(u);
    if (!host) continue;
    if (!map.has(host)) map.set(host, []);
    map.get(host).push(u);
  }
  return [...map.entries()]
    .map(([host, list]) => ({
      key: sourceKey(host),
      host,
      name: host,
      list: [...list].sort((a, b) => (b.added).localeCompare(a.added) || a.slug.localeCompare(b.slug)),
    }))
    .sort((a, b) => b.list.length - a.list.length || a.name.localeCompare(b.name));
}
