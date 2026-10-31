// Entries whose cost and/or setup time is stated in the cited source (or a linked vendor list price).
// Shared by /costs/ and /costs.md. Nothing here is estimated: entries without a stated figure are left out.
import { useCases } from './usecases.mjs';
export const fact = f => !f ? null : (typeof f === 'string' ? { value: f, basis: 'source', note: 'Stated in the source.', url: null } : f);
export function costRows(){
  return useCases.map(u => ({ u, cost: fact(u.cost), setup: fact(u.setupTime ?? u.setup) }))
    .filter(r => r.cost || r.setup)
    .sort((a, b) => (b.u.added).localeCompare(a.u.added));
}
