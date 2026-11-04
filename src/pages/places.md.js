// Markdown copy of /places/ (all use cases with a stated location, grouped by country).
import { useCases, TYPES } from '../data/usecases.mjs';
import { groupByCountry, placeOf, PAGE_MIN } from '../data/places.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  const groups = groupByCountry();
  let t = `# Small business AI use cases by country\n\n- Web page: ${SITE}/places/\n- ${groups.reduce((n, g) => n + g.list.length, 0)} of ${useCases.length} use cases state where the business is. Locations come only from each entry and its source; entries without a stated location are not listed here.\n\n`;
  for (const g of groups) {
    t += `## ${g.name} (${g.list.length})\n\n`;
    if (g.list.length >= PAGE_MIN) t += `Page: ${SITE}/places/${g.key}/ (Markdown: ${SITE}/places/${g.key}.md)\n\n`;
    for (const u of g.list) t += `- [${u.title}](${SITE}/use-cases/${u.slug}/): ${u.business}, ${placeOf(u).place} (${TYPES[u.type]}). Source: ${u.sourceUrl}\n`;
    t += '\n';
  }
  t += `---\n\nFrom ${NAME} (${SITE}/). Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
