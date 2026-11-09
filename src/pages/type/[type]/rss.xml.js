import { useCases, TYPES } from '../../../data/usecases.mjs';
import { SITE, NAME } from '../../../site.mjs';
// Per-business-type RSS 2.0 feed (e.g. /type/food/rss.xml), newest first, so owners and AI tools can follow
// only the category they care about. Same item format and real `added` dates as the sitewide /rss.xml.
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const rfc822 = d => new Date(d + 'T12:00:00-05:00').toUTCString();
export function getStaticPaths(){ return Object.keys(TYPES).map(type => ({ params: { type } })); }
export function GET({ params }){
  const type = params.type; const label = TYPES[type];
  const list = useCases.filter(u => u.type === type);
  const items = [...list].sort((a,b)=>(b.added).localeCompare(a.added) || useCases.indexOf(b) - useCases.indexOf(a));
  const latest = list.map(u=>u.updated ?? u.added).sort().at(-1);
  const title = `${NAME}: AI use cases for ${label}`;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>${esc(title)}</title>
<link>${SITE}/type/${type}/</link>
<atom:link href="${SITE}/type/${type}/rss.xml" rel="self" type="application/rss+xml" />
<description>${esc(`Real, sourced examples of how ${label.toLowerCase()} owners use AI agents, newest first. Every entry links its public source.`)}</description>
<language>en-us</language>
<lastBuildDate>${rfc822(latest)}</lastBuildDate>
<image><url>${SITE}/og.png</url><title>${esc(title)}</title><link>${SITE}/type/${type}/</link></image>
${items.map(u => `<item>
<title>${esc(u.title)}</title>
<link>${SITE}/use-cases/${u.slug}/</link>
<guid isPermaLink="true">${SITE}/use-cases/${u.slug}/</guid>
<pubDate>${rfc822(u.added)}</pubDate>
<dc:creator>${esc(NAME)}</dc:creator>
<category>${esc(label)}</category>
<description>${esc(`${u.business}: ${u.job}${u.results[0] ? ' ' + u.results[0] : ''} Source: ${u.sourceName} (${u.sourceUrl})`)}</description>
</item>`).join('\n')}
</channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
