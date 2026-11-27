// "Independently reported": entries whose cited source is NOT published by the AI tool's maker, the software vendor,
// the company that built or set up the AI, or this site. That means news outlets, trade magazines, podcasts, local
// business groups and owners' own posts. Shared by /independent/ and /independent.md.
// Conservative by design: an entry is left out if its source host is a vendor's, or if the entry itself flags the story
// as vendor-published, a case study, a client story, sponsored, or otherwise not independent. "Independent" here means
// independent of the vendor; the figures are still as reported (usually by the owner) and were not verified by this site.
import { useCases } from './usecases.mjs';

// Hosts run by AI-tool makers, software vendors or builders named in entries, plus this site.
const VENDOR_HOST = /(^|\.)(openai\.com|chatgpt\.com|chatgptpro\.substack\.com|google|google\.com|claude\.com|anthropic\.com|microsoft\.com|squareup\.com|shopify\.com|servicetitan\.com|lgp\.dev|bots-for-business-owners\.vercel\.app)$/i;
// Wording entries use to flag a source that is not independent of the vendor or builder.
const FLAG = /not (an )?independent|vendor-published|vendor (case|claim|blog)|case study|customer stor|success story|press release|partner (case|story)|published by the company|company's own|its own (blog|account|customer)|client story|sponsored|\bspons\b|affiliated with this site|ties to Meta|brought in to test|vendor founder|vendor's (own )?founder/i;

export function sourceHostOf(u) {
  try { return new URL(u.sourceUrl).hostname.replace(/^www\./, '').toLowerCase(); } catch { return ''; }
}

export function isIndependent(u) {
  if (VENDOR_HOST.test(sourceHostOf(u))) return false;
  const text = [u.story, u.sourceName, ...(u.results || []), u.cost?.note || '', u.setupTime?.note || ''].join(' ');
  return !FLAG.test(text);
}

let cache;
export function independentRows() {
  if (cache) return cache;
  cache = useCases.filter(isIndependent)
    .sort((a, b) => (b.added).localeCompare(a.added) || a.slug.localeCompare(b.slug));
  return cache;
}
