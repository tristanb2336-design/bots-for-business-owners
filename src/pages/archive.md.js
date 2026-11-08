// Markdown copy of /archive/ (use cases grouped by the month they were added).
import { useCases, TYPES } from '../data/usecases.mjs';
import { groupByMonth } from '../data/archive.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  const groups = groupByMonth();
  let t = `# Small business AI use cases by month added\n\n`;
  t += `- Web page: ${SITE}/archive/\n- All ${useCases.length} use cases, grouped by the month they were published on this site (${groups.length} months). Newest month first. Every entry links its original public source.\n\n`;
  for (const g of groups) {
    t += `## ${g.name} (${g.list.length})\n\n`;
    t += `Page: ${SITE}/archive/${g.key}/ (Markdown: ${SITE}/archive/${g.key}.md)\n\n`;
    for (const u of g.list) t += `- [${u.title}](${SITE}/use-cases/${u.slug}/): ${u.business} (${TYPES[u.type]}). Added ${u.added}. Source: ${u.sourceUrl}\n`;
    t += '\n';
  }
  t += `---\n\nFrom ${NAME} (${SITE}/). Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
