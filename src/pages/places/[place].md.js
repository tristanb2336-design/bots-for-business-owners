// Markdown copy of each /places/<country>/ page (linked via rel="alternate" and from /llms.txt).
import { TYPES } from '../../data/usecases.mjs';
import { groupByCountry, placeOf, PAGE_MIN } from '../../data/places.mjs';
import { SITE, NAME } from '../../site.mjs';
const fact = f => !f ? null : (typeof f === 'string' ? { value: f, basis: 'source' } : f);
export function getStaticPaths(){ return groupByCountry().filter(g => g.list.length >= PAGE_MIN).map(g => ({ params: { place: g.key }, props: { g } })); }
export function GET({ props }){
  const { g } = props;
  let t = `# AI for small businesses in ${g.short}: ${g.list.length} real use case${g.list.length === 1 ? '' : 's'}\n\n`;
  t += `- Web page: ${SITE}/places/${g.key}/\n- Locations are taken only from each entry and its source. Results are repeated only as stated in the linked source.\n\n`;
  for (const u of g.list) {
    const cost = fact(u.cost), setup = fact(u.setupTime ?? u.setup);
    t += `## ${u.title}\n\n- Business: ${u.business} (${TYPES[u.type]})\n- Where: ${placeOf(u).place}, ${g.name}\n- What the AI does: ${u.job}\n- Tools: ${u.tools.join('; ')}\n`;
    if (u.results?.length) t += `- Stated results: ${u.results.join(' ')}\n`;
    if (cost) t += `- Cost: ${cost.basis === 'list-price' ? 'tool list price, not what this business paid: ' : ''}${cost.value}\n`;
    if (setup) t += `- Setup time: ${setup.value}\n`;
    t += `- Source: [${u.sourceName}](${u.sourceUrl})\n- Page: ${SITE}/use-cases/${u.slug}/ (Markdown: ${SITE}/use-cases/${u.slug}.md)\n\n`;
  }
  t += `---\n\nAll countries: ${SITE}/places/ (Markdown: ${SITE}/places.md). From ${NAME} (${SITE}/). Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
