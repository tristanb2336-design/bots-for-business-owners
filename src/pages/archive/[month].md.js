import { TYPES } from '../../data/usecases.mjs';
import { groupByMonth } from '../../data/archive.mjs';
import { SITE, NAME } from '../../site.mjs';
export function getStaticPaths(){
  return groupByMonth().map(g => ({ params: { month: g.key }, props: { g } }));
}
export function GET({ props }){
  const { g } = props;
  let t = `# Use cases added in ${g.name}\n\n`;
  t += `- Web page: ${SITE}/archive/${g.key}/\n- ${g.list.length} use case${g.list.length===1?'':'s'} published on this site in ${g.name}. Newest first.\n\n`;
  for (const u of g.list) {
    t += `## ${u.title}\n\n`;
    t += `- Business: ${u.business} (${TYPES[u.type]})\n`;
    t += `- Added: ${u.added}\n`;
    t += `- Tools: ${u.tools.join('; ')}\n`;
    t += `- Page: ${SITE}/use-cases/${u.slug}/ (Markdown: ${SITE}/use-cases/${u.slug}.md)\n`;
    t += `- Source: ${u.sourceUrl}\n\n`;
  }
  t += `---\n\nFrom ${NAME} (${SITE}/). All months: ${SITE}/archive/\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
