import { useCases, TYPES } from '../data/usecases.mjs';
import { SITE, NAME, TAGLINE } from '../site.mjs';
// RSS 2.0 feed of every use case, newest first. Dates come from each entry's real `added` / `updated` date.
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const rfc822 = d => new Date(d + 'T12:00:00-05:00').toUTCString();
export function GET(){
  const items = [...useCases].sort((a,b)=>(b.added).localeCompare(a.added) || useCases.indexOf(b) - useCases.indexOf(a));
  const latest = useCases.map(u=>u.updated ?? u.added).sort().at(-1);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>${esc(NAME)}: new AI use cases</title>
<link>${SITE}/</link>
<atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
<description>${esc(TAGLINE)}</description>
<language>en-us</language>
<lastBuildDate>${rfc822(latest)}</lastBuildDate>
<image><url>${SITE}/og.png</url><title>${esc(NAME)}: new AI use cases</title><link>${SITE}/</link></image>
${items.map(u => `<item>
<title>${esc(u.title)}</title>
<link>${SITE}/use-cases/${u.slug}/</link>
<guid isPermaLink="true">${SITE}/use-cases/${u.slug}/</guid>
<pubDate>${rfc822(u.added)}</pubDate>
<dc:creator>${esc(NAME)}</dc:creator>
<category>${esc(TYPES[u.type])}</category>
<description>${esc(`${u.business}: ${u.job}${u.results[0] ? ' ' + u.results[0] : ''} Source: ${u.sourceName} (${u.sourceUrl})`)}</description>
</item>`).join('\n')}
</channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
