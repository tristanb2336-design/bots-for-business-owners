import { useCases, TYPES } from '../data/usecases.mjs';
import { SITE, NAME, TAGLINE } from '../site.mjs';
// Machine-readable copy of every use case, for AI assistants, agents and developers.
// Same facts as the pages: nothing here is added or estimated. Newest first.
export function GET(){
  const latest = useCases.map(u=>u.updated ?? u.added).sort().at(-1);
  const items = [...useCases].sort((a,b)=>(b.added).localeCompare(a.added) || useCases.indexOf(b) - useCases.indexOf(a));
  const data = {
    name: NAME,
    description: TAGLINE,
    url: SITE + '/',
    license: 'Summaries may be quoted with a link to the use-case page and its original source.',
    policy: 'Vendor-neutral. Every entry cites a public source; numbers appear only when the source states them. cost/setupTime are null when the source does not state them; basis "list-price" means a vendor list price, not what the business paid.',
    lastUpdated: latest,
    count: useCases.length,
    categories: TYPES,
    useCases: items.map(u => ({
      url: `${SITE}/use-cases/${u.slug}/`,
      slug: u.slug,
      title: u.title,
      business: u.business,
      category: u.type,
      categoryName: TYPES[u.type],
      added: u.added,
      ...(u.updated ? { updated: u.updated } : {}),
      job: u.job,
      results: u.results,
      tools: u.tools,
      cost: u.cost,
      setupTime: u.setupTime,
      howToStart: u.start,
      source: { name: u.sourceName, url: u.sourceUrl },
    })),
  };
  return new Response(JSON.stringify(data, null, 2) + '\n', { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
