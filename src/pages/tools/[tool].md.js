// Markdown copy of each /tools/<key>/ page (linked via rel="alternate" and from /llms.txt).
import { TYPES } from '../../data/usecases.mjs';
import { groupByTool } from '../../data/tools.mjs';
import { SITE, NAME } from '../../site.mjs';
const fact = f => !f ? null : (typeof f === 'string' ? { value: f, basis: 'source' } : f);
export function getStaticPaths(){ return groupByTool().map(g => ({ params: { tool: g.key }, props: { g } })); }
export function GET({ props }){
  const { g } = props;
  let t = `# ${g.name} (${g.maker}): ${g.list.length} real small business use case${g.list.length === 1 ? '' : 's'}\n\n`;
  t += `- Web page: ${SITE}/tools/${g.key}/\n- RSS feed for this tool: ${SITE}/tools/${g.key}/rss.xml\n- ${g.blurb}\n- Vendor-neutral: examples are grouped by the tool named in each source, not ranked or recommended. Results are repeated only as stated in the linked source.\n\n`;
  for (const u of g.list) {
    const cost = fact(u.cost), setup = fact(u.setupTime ?? u.setup);
    t += `## ${u.title}\n\n- Business: ${u.business} (${TYPES[u.type]})\n- What the AI does: ${u.job}\n- Tools: ${u.tools.join('; ')}\n`;
    if (u.results?.length) t += `- Stated results: ${u.results.join(' ')}\n`;
    if (cost) t += `- Cost: ${cost.basis === 'list-price' ? 'tool list price, not what this business paid: ' : ''}${cost.value}\n`;
    if (setup) t += `- Setup time: ${setup.value}\n`;
    t += `- Source: [${u.sourceName}](${u.sourceUrl})\n- Page: ${SITE}/use-cases/${u.slug}/ (Markdown: ${SITE}/use-cases/${u.slug}.md)\n\n`;
  }
  t += `---\n\nAll tools: ${SITE}/tools/ (Markdown: ${SITE}/tools.md). From ${NAME} (${SITE}/). Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
