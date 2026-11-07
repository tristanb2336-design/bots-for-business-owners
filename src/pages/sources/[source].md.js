import { TYPES } from '../../data/usecases.mjs';
import { groupBySource, PAGE_MIN } from '../../data/sources.mjs';
import { SITE, NAME } from '../../site.mjs';
export function getStaticPaths(){
  return groupBySource().filter(g => g.list.length >= PAGE_MIN).map(g => ({ params: { source: g.key }, props: { g } }));
}
export function GET({ props }){
  const { g } = props;
  let t = `# Use cases reported on ${g.name}\n\n`;
  t += `- Web page: ${SITE}/sources/${g.key}/\n- ${g.list.length} use case${g.list.length===1?'':'s'} whose cited source is on ${g.name}.\n\n`;
  for (const u of g.list) {
    t += `## ${u.title}\n\n`;
    t += `- Business: ${u.business} (${TYPES[u.type]})\n`;
    t += `- Tools: ${u.tools.join('; ')}\n`;
    t += `- Page: ${SITE}/use-cases/${u.slug}/ (Markdown: ${SITE}/use-cases/${u.slug}.md)\n`;
    t += `- Source: ${u.sourceUrl}\n\n`;
  }
  t += `---\n\nFrom ${NAME} (${SITE}/). All sources: ${SITE}/sources/\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
