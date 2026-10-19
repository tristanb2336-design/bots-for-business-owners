import { useCases, TYPES } from '../data/usecases.mjs';
import { SITE } from '../site.mjs';
export function GET(){
  // lastmod reflects real content changes: each use case's own date, list pages = newest entry they show.
  const mod = u => u.updated ?? u.added;
  const newest = list => list.map(mod).sort().at(-1);
  const latest = newest(useCases);
  const urls = [
    ['/', latest], ['/about/', latest], ['/newsletter/', latest], ['/advertise/', latest], ['/contact/', latest],
    ['/rss.xml', latest], ['/llms.txt', latest], ['/llms-full.txt', latest],
    ...Object.keys(TYPES).map(t=>[`/type/${t}/`, newest(useCases.filter(u=>u.type===t)) ?? latest]),
    ...useCases.map(u=>[`/use-cases/${u.slug}/`, mod(u)]),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u,d])=>`  <url><loc>${SITE}${u}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
