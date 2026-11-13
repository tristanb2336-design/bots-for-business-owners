import { useCases, TYPES } from '../data/usecases.mjs';
import { SITE } from '../site.mjs';
import { latestEdition } from '../data/marketplace.mjs';
import { groupByTool } from '../data/tools.mjs';
import { groupByCountry, PAGE_MIN } from '../data/places.mjs';
import { groupByJob } from '../data/jobs.mjs';
import { groupBySource, PAGE_MIN as SOURCE_PAGE_MIN } from '../data/sources.mjs';
import { groupByMonth } from '../data/archive.mjs';
export function GET(){
  // lastmod reflects real content changes: each use case's own date, list pages = newest entry they show.
  const mod = u => u.updated ?? u.added;
  const newest = list => list.map(mod).sort().at(-1);
  const latest = newest(useCases);
  const urls = [
    ['/', latest], ['/about/', latest], ['/newsletter/', latest], ['/advertise/', latest], ['/contact/', latest], ['/tools/', latest], ['/costs/', latest], ['/places/', latest], ['/recent/', latest], ['/jobs/', latest], ['/sources/', latest], ['/archive/', latest], ['/marketplace/', latestEdition.date],
    ['/rss.xml', latest], ['/feed.json', latest], ['/llms.txt', latest], ['/llms-full.txt', latest], ['/use-cases.json', latest], ['/use-cases.csv', latest],
    ...Object.keys(TYPES).map(t=>[`/type/${t}/`, newest(useCases.filter(u=>u.type===t)) ?? latest]),
    ...Object.keys(TYPES).map(t=>[`/type/${t}/rss.xml`, newest(useCases.filter(u=>u.type===t)) ?? latest]),
    ...groupByTool().map(g=>[`/tools/${g.key}/`, newest(g.list) ?? latest]),
    ...groupByTool().map(g=>[`/tools/${g.key}/rss.xml`, newest(g.list) ?? latest]),
    ...groupByCountry().filter(g=>g.list.length>=PAGE_MIN).map(g=>[`/places/${g.key}/`, newest(g.list) ?? latest]),
    ...groupByCountry().filter(g=>g.list.length>=PAGE_MIN).map(g=>[`/places/${g.key}/rss.xml`, newest(g.list) ?? latest]),
    ...groupByJob().map(g=>[`/jobs/${g.key}/`, newest(g.list) ?? latest]),
    ...groupByJob().map(g=>[`/jobs/${g.key}/rss.xml`, newest(g.list) ?? latest]),
    ...groupBySource().filter(g=>g.list.length>=SOURCE_PAGE_MIN).map(g=>[`/sources/${g.key}/`, newest(g.list) ?? latest]),
    ...groupByMonth().map(g=>[`/archive/${g.key}/`, newest(g.list) ?? latest]),
    ...useCases.map(u=>[`/use-cases/${u.slug}/`, mod(u)]),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u,d])=>`  <url><loc>${SITE}${u}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
