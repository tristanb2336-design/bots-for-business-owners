// Markdown copy of /sources/ (use cases grouped by cited source host).
import { useCases, TYPES } from '../data/usecases.mjs';
import { groupBySource, PAGE_MIN } from '../data/sources.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  const groups = groupBySource();
  const cited = groups.reduce((n, g) => n + g.list.length, 0);
  let t = `# Small business AI use cases by source\n\n`;
  t += `- Web page: ${SITE}/sources/\n- ${cited} of ${useCases.length} use cases, grouped by the public host of each cited source (${groups.length} hosts). Every entry still links its original URL.\n\n`;
  for (const g of groups) {
    t += `## ${g.name} (${g.list.length})\n\n`;
    if (g.list.length >= PAGE_MIN) t += `Page: ${SITE}/sources/${g.key}/ (Markdown: ${SITE}/sources/${g.key}.md)\n\n`;
    for (const u of g.list) t += `- [${u.title}](${SITE}/use-cases/${u.slug}/): ${u.business} (${TYPES[u.type]}). Source: ${u.sourceUrl}\n`;
    t += '\n';
  }
  t += `---\n\nFrom ${NAME} (${SITE}/). Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
