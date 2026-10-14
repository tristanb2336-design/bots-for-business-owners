import { useCases, TYPES } from '../data/usecases.mjs';
import { SITE } from '../site.mjs';
export function GET(){
  const today = new Date().toISOString().slice(0,10);
  const urls = ['/', '/about/', '/newsletter/', '/advertise/', ...Object.keys(TYPES).map(t=>`/type/${t}/`), ...useCases.map(u=>`/use-cases/${u.slug}/`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
