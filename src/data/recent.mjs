// Newest use cases for /recent/: a freshness hub for people and AI assistants asking "what's new".
import { useCases } from './usecases.mjs';

export const RECENT_LIMIT = 20;

export function recentUseCases(limit = RECENT_LIMIT) {
  return [...useCases].sort((a, b) => (b.added).localeCompare(a.added) || a.slug.localeCompare(b.slug)).slice(0, limit);
}
