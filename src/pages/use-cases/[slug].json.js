// Structured JSON copy of each use case at /use-cases/<slug>.json, for AI assistants and agents that want one
// entry's facts without parsing HTML or downloading every entry (/use-cases.json). Same facts as the page:
// nothing added or estimated. Linked from each page's <head> (rel="alternate" type="application/json"),
// from the page itself, from its Markdown copy, from /use-cases.json and from /llms.txt.
import { useCases, TYPES } from '../../data/usecases.mjs';
import { SITE, NAME } from '../../site.mjs';
import { groupByTool } from '../../data/tools.mjs';
export function getStaticPaths(){ return useCases.map(u => ({ params: { slug: u.slug }, props: { u } })); }
const fact = f => !f ? null : (typeof f === 'string' ? { value: f, basis: 'source', note: 'Stated in the source.', url: null } : f);
export function GET({ props }){
  const u = props.u, url = `${SITE}/use-cases/${u.slug}/`;
  const toolPages = groupByTool().filter(g => g.list.some(x => x.slug === u.slug)).map(g => ({ name: g.name, maker: g.maker, url: `${SITE}/tools/${g.key}/` }));
  const data = {
    url, markdown: `${SITE}/use-cases/${u.slug}.md`, json: `${SITE}/use-cases/${u.slug}.json`,
    slug: u.slug, title: u.title, business: u.business,
    category: u.type, categoryName: TYPES[u.type], categoryUrl: `${SITE}/type/${u.type}/`,
    added: u.added, ...(u.updated ? { updated: u.updated } : {}),
    job: u.job, story: u.story, results: u.results, tools: u.tools, toolPages,
    cost: fact(u.cost), setupTime: fact(u.setupTime ?? u.setup), howToStart: u.start,
    source: { name: u.sourceName, url: u.sourceUrl },
    publisher: { name: NAME, url: SITE + '/' },
    policy: 'Vendor-neutral. Results are repeated only as stated in the linked source; vendor case studies are written by the vendor. cost/setupTime are null when the source does not state them; basis "list-price" means a vendor list price, not what the business paid. When citing, link the url above and the original source.',
    jsonld: { '@context': 'https://schema.org', '@type': 'Article', headline: u.title, url, datePublished: u.added, ...(u.updated ? { dateModified: u.updated } : {}),
      articleSection: TYPES[u.type], isBasedOn: u.sourceUrl, citation: { '@type': 'CreativeWork', name: u.sourceName, url: u.sourceUrl },
      publisher: { '@type': 'Organization', name: NAME, url: SITE + '/' } },
  };
  return new Response(JSON.stringify(data, null, 2) + '\n', { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
