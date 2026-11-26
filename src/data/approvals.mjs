// "Where a person stays in charge": sentences, quoted verbatim from each entry's own job, story and results, that say
// what the owner or staff still approve, review or take over from the AI (human in the loop). Shared by /human-in-the-loop/
// and /human-in-the-loop.md. Nothing is written or summarized here: every line shown is copied from the entry, which cites its public source.
import { useCases } from './usecases.mjs';

const KEEP = /(approv(e|es|ed|al|ing)\b|signs? off|green light|human in the loop|a (person|human) (approves|reviews|checks|signs|takes over)|(reviews?|checks?|reads?|edits?) (every|each) (draft|reply|change|message|post|answer)|before (anything|it|they|replies|messages) (is |are )?(sent|posted|paid|goes out|go out)|transfers? (the )?(call|caller)s? to|hands? (the call |it )?(off|over) to (a person|staff|a human|the owner)|escalat(es|ed|ing)|flags? (anything|it|them|items|problem|what|the)|goes? (straight )?to (a person|staff|the owner)|wait for the landlord)/i;
const NOT = /^Note:|not independent|vendor-published|case study/i;

function sentences(text) {
  return String(text || '').replace(/\s+/g, ' ').match(/[^.!?]+(?:[.!?]+["'”)]*|$)/g)?.map(s => s.trim()).filter(Boolean) || [];
}

let cache;
export function approvalRows() {
  if (cache) return cache;
  cache = useCases.map(u => {
    const seen = new Set();
    const lines = [u.job, u.story, ...(u.results || [])].flatMap(sentences)
      .filter(s => KEEP.test(s) && !NOT.test(s) && s.length > 25)
      .filter(s => (seen.has(s) ? false : seen.add(s)));
    return { u, lines };
  }).filter(r => r.lines.length)
    .sort((a, b) => (b.u.added).localeCompare(a.u.added) || a.u.slug.localeCompare(b.u.slug));
  return cache;
}
