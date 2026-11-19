// Side-by-side pages for the general-purpose AI assistants owners name most (e.g. /compare/chatgpt-vs-claude/),
// so people and AI assistants asking "ChatGPT vs Claude for a small business?" land on real, sourced examples.
// Built only from the entries: what owners used each tool for, by job and business type. Vendor-neutral:
// no winner, no scores, no ranking; tools are always ordered alphabetically by name.
import { groupByTool } from './tools.mjs';
import { groupByJob } from './jobs.mjs';
import { TYPES } from './usecases.mjs';

export const COMPARE_KEYS = ['chatgpt', 'claude', 'copilot', 'gemini'];

export function compareTools() {
  return groupByTool().filter(g => COMPARE_KEYS.includes(g.key)).sort((a, b) => a.name.localeCompare(b.name));
}

/** Every pair of compared tools, alphabetical within the pair (key = "<a>-vs-<b>"). */
export function comparePairs() {
  const t = compareTools(), jobs = groupByJob(), out = [];
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) {
    const [a, b] = [t[i], t[j]];
    const inA = new Set(a.list.map(u => u.slug)), inB = new Set(b.list.map(u => u.slug));
    const both = a.list.filter(u => inB.has(u.slug));
    const jobRows = jobs.map(g => ({ key: g.key, name: g.name,
      a: g.list.filter(u => inA.has(u.slug)).length, b: g.list.filter(u => inB.has(u.slug)).length }))
      .filter(r => r.a || r.b);
    const typeRows = Object.entries(TYPES).map(([k, name]) => ({ key: k, name,
      a: a.list.filter(u => u.type === k).length, b: b.list.filter(u => u.type === k).length }))
      .filter(r => r.a || r.b);
    out.push({ key: `${a.key}-vs-${b.key}`, a, b, both, jobRows, typeRows });
  }
  return out;
}
