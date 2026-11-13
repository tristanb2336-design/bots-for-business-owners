import { useCases } from '../../../data/usecases.mjs';
import { groupByJob } from '../../../data/jobs.mjs';
import { SITE, NAME } from '../../../site.mjs';
// Per-job RSS 2.0 feed (e.g. /jobs/phone-answering/rss.xml), newest first, so owners and AI tools can follow
// new examples of one kind of work the AI does. Vendor-neutral; no ranking.
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const rfc822 = d => new Date(d + 'T12:00:00-05:00').toUTCString();
export function getStaticPaths(){ return groupByJob().map(g => ({ params: { job: g.key }, props: { g } })); }
export function GET({ props }){
  const g = props.g; const list = g.list;
  const items = [...list].sort((a,b)=>(b.added).localeCompare(a.added) || useCases.indexOf(b) - useCases.indexOf(a));
  const latest = list.map(u=>u.updated ?? u.added).sort().at(-1);
  const title = `${NAME}: AI for small business: ${g.name}`;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>${esc(title)}</title>
<link>${SITE}/jobs/${g.key}/</link>
<atom:link href="${SITE}/jobs/${g.key}/rss.xml" rel="self" type="application/rss+xml" />
<description>${esc(`Real, sourced examples of small businesses using AI for this job: ${g.name}. Newest first; every entry links its public source. Vendor-neutral; no tool is ranked over another.`)}</description>
<language>en-us</language>
<lastBuildDate>${rfc822(latest)}</lastBuildDate>
<image><url>${SITE}/og.png</url><title>${esc(title)}</title><link>${SITE}/jobs/${g.key}/</link></image>
${items.map(u => `<item>
<title>${esc(u.title)}</title>
<link>${SITE}/use-cases/${u.slug}/</link>
<guid isPermaLink="true">${SITE}/use-cases/${u.slug}/</guid>
<pubDate>${rfc822(u.added)}</pubDate>
<dc:creator>${esc(NAME)}</dc:creator>
<category>${esc(g.name)}</category>
<description>${esc(`${u.business}: ${u.job}${u.results[0] ? ' ' + u.results[0] : ''} Source: ${u.sourceName} (${u.sourceUrl})`)}</description>
</item>`).join('\n')}
</channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
