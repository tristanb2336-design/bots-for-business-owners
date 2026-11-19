import { compareTools, comparePairs } from '../data/compare.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  const tools = compareTools(), pairs = comparePairs();
  let t = `# Compare AI assistants small businesses use (${tools.map(x=>x.name).join(', ')})\n\n- Web page: ${SITE}/compare/\n- Vendor-neutral: no winner, scores or ranking. Counts only reflect how many sourced examples this site has; a higher count does not mean a better tool.\n\n## Side-by-side pages\n\n`;
  for (const p of pairs) t += `- ${p.a.name} vs ${p.b.name}: ${SITE}/compare/${p.key}/ (Markdown: ${SITE}/compare/${p.key}.md). ${p.a.list.length} and ${p.b.list.length} examples${p.both.length ? `, ${p.both.length} using both` : ''}.\n`;
  t += `\n## Each assistant\n\n`;
  for (const x of tools) t += `- ${x.name} (${x.maker}): ${x.list.length} examples. ${SITE}/tools/${x.key}/\n`;
  t += `\n---\n\nFrom ${NAME} (${SITE}/). Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
