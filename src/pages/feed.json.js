import { useCases, TYPES } from '../data/usecases.mjs';
import { SITE, NAME, TAGLINE } from '../site.mjs';
// JSON Feed 1.1 (https://www.jsonfeed.org/version/1.1/) of every use case, newest first.
// Same items and real `added` / `updated` dates as /rss.xml, in JSON so feed readers and AI agents can parse it without XML.
const iso = d => d + 'T12:00:00-05:00';
export function GET(){
  const items = [...useCases].sort((a,b)=>(b.added).localeCompare(a.added) || useCases.indexOf(b) - useCases.indexOf(a));
  const text = u => [
    `${u.business} (${TYPES[u.type]})`,
    `What the AI does: ${u.job}`,
    `The story: ${u.story}`,
    u.results.length ? `Results (as reported by the source): ${u.results.join(' ')}` : '',
    `Tools: ${u.tools.join(', ')}`,
    u.cost ? `Cost: ${u.cost.value}${u.cost.basis === 'list-price' ? ' (public list price)' : ''}` : '',
    u.setupTime ? `Setup time: ${u.setupTime.value}` : '',
    `How to start: ${u.start.map((s,i)=>`${i+1}. ${s}`).join(' ')}`,
    `Source: ${u.sourceName} (${u.sourceUrl})`,
  ].filter(Boolean).join('\n\n');
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: `${NAME}: new AI use cases`,
    home_page_url: `${SITE}/`,
    feed_url: `${SITE}/feed.json`,
    description: TAGLINE,
    icon: `${SITE}/og.png`,
    favicon: `${SITE}/favicon.svg`,
    language: 'en-US',
    authors: [{ name: NAME, url: `${SITE}/about/` }],
    items: items.map(u => ({
      id: `${SITE}/use-cases/${u.slug}/`,
      url: `${SITE}/use-cases/${u.slug}/`,
      external_url: u.sourceUrl,
      title: u.title,
      summary: `${u.business}: ${u.job}`,
      content_text: text(u),
      date_published: iso(u.added),
      ...(u.updated ? { date_modified: iso(u.updated) } : {}),
      tags: [TYPES[u.type], ...u.tools],
    })),
  };
  return new Response(JSON.stringify(feed, null, 2), { headers: { 'Content-Type': 'application/feed+json; charset=utf-8' } });
}
