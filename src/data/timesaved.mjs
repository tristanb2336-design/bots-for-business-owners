// "How much time AI saves": sentences, quoted verbatim from each entry's own job, story and results, that state a
// time figure the AI saved, cut or freed up (hours a week, minutes instead of hours, and so on). Shared by /time-saved/
// and /time-saved.md. Nothing is estimated, converted or summed here: every line is copied from the entry, which cites its
// public source, and the figures are as reported there (usually by the owner or the vendor).
import { useCases } from './usecases.mjs';

// A number (or "a few", "half an", ...) followed by a unit of time.
const AMOUNT = /(?:\b\d[\d,.]*\s*(?:(?:to|-|–|or)\s*\d[\d,.]*\s*)?\+?\s*|\b(?:one|two|three|four|five|six|seven|eight|ten|twenty|thirty|a few|a couple of|several)\s+(?:or more\s+)?)(?:hours?|hrs?|minutes?|mins?|days?|weeks?)\b|\b(?:an|half an) hour\b|\ba full day\b/i;
// Words that make the time figure a saving or a speed-up, not a setup time, an opening time or a schedule.
const SAVING = /\b(sav(e|es|ed|ing)|cut|cuts|freed|frees|free up|back (to|in|for)|hours a week back|instead of|rather than|down (to|from)|dropped|reduc(e|es|ed)|from (about |roughly |around )?(\d|an?\b|one|two|three|several|a few)[^.]{0,60}\bto\b|now takes?|used to take|took (him|her|them|us|me)?\s*(hours|days|weeks)|no longer|spend(s|ing)? (less|fewer)|less time|fewer hours|time back|fell|falls|eliminated|went from)\b/i;
const NOT = /^Note:|^Limits|not an AI feature|^No (time|money)|not independent|vendor-published|case study|setup|set up in|onboarding|went live|built in|open(s|ed)? (at|from)|hours of operation|opening hours|\d+ hours a day,|works \d+ hours|was the booking workload|payment collection|no-shows|revenue/i;

function sentences(text) {
  // Split after . ! or ? followed by a space, so decimals like 1.5 stay inside their sentence.
  return String(text || '').replace(/\s+/g, ' ').split(/(?<=[.!?]["'”)]*)\s+(?=["'“(]?[A-Z0-9])/).map(s => s.trim()).filter(Boolean);
}

let cache;
export function timeSavedRows() {
  if (cache) return cache;
  cache = useCases.map(u => {
    const seen = new Set();
    const lines = [...(u.results || []), u.job, u.story].flatMap(sentences)
      .filter(s => AMOUNT.test(s) && SAVING.test(s) && !NOT.test(s) && s.length > 25)
      .filter(s => (seen.has(s) ? false : seen.add(s)));
    return { u, lines };
  }).filter(r => r.lines.length)
    .sort((a, b) => (b.u.added).localeCompare(a.u.added) || a.u.slug.localeCompare(b.u.slug));
  return cache;
}
