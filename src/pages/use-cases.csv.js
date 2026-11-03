import { useCases, TYPES } from '../data/usecases.mjs';
import { SITE } from '../site.mjs';
// Spreadsheet-friendly copy of every use case (opens in Excel, Google Sheets, Numbers), also listed as a
// schema.org DataDownload (text/csv) on the homepage Dataset. Same facts as the pages and /use-cases.json:
// nothing added or estimated. Empty cost/setup cells mean the source does not state them. Newest first.
const fact = f => !f ? null : (typeof f === 'string' ? { value: f, basis: 'source', url: null } : f);
const cell = v => { const s = v == null ? '' : String(v); return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
export function GET(){
  const items = [...useCases].sort((a,b)=>(b.added).localeCompare(a.added) || useCases.indexOf(b) - useCases.indexOf(a));
  const head = ['title','business','category','added','job','tools','results','cost','cost_basis','cost_url','setup_time','setup_basis','how_to_start','source_name','source_url','page_url','markdown_url','json_url'];
  const rows = items.map(u => {
    const c = fact(u.cost), s = fact(u.setupTime ?? u.setup);
    return [u.title, u.business, TYPES[u.type], u.added, u.job, u.tools.join('; '), u.results.join(' | '),
      c?.value, c?.basis, c ? (c.url ?? u.sourceUrl) : '', s?.value, s?.basis, u.start.join(' | '),
      u.sourceName, u.sourceUrl, `${SITE}/use-cases/${u.slug}/`, `${SITE}/use-cases/${u.slug}.md`, `${SITE}/use-cases/${u.slug}.json`];
  });
  // UTF-8 BOM so Excel shows curly quotes, accents and £/€ correctly.
  const body = '\uFEFF' + [head, ...rows].map(r => r.map(cell).join(',')).join('\r\n') + '\r\n';
  return new Response(body, { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
