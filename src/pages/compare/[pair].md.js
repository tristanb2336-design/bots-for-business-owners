import { TYPES } from '../../data/usecases.mjs';
import { comparePairs } from '../../data/compare.mjs';
import { SITE, NAME } from '../../site.mjs';
export function getStaticPaths(){ return comparePairs().map(p => ({ params: { pair: p.key }, props: { p } })); }
export function GET({ props }){
  const { a, b, both, jobRows, typeRows, key } = props.p;
  let t = `# ${a.name} vs ${b.name} for small business: what owners use each for\n\n- Web page: ${SITE}/compare/${key}/\n- ${a.list.length} sourced examples with ${a.name} (${a.maker}), ${b.list.length} with ${b.name} (${b.maker})${both.length ? `, ${both.length} using both` : ''}.\n- Vendor-neutral: not a ranking or review. Counts show only how many sourced examples this site has.\n\n## By job the AI does\n\n| Job | ${a.name} | ${b.name} |\n|---|---|---|\n`;
  for (const r of jobRows) t += `| ${r.name} | ${r.a} | ${r.b} |\n`;
  t += `\n## By business type\n\n| Business type | ${a.name} | ${b.name} |\n|---|---|---|\n`;
  for (const r of typeRows) t += `| ${r.name} | ${r.a} | ${r.b} |\n`;
  const sec = (h, list) => `\n## ${h}\n\n` + list.map(u => `- [${u.title}](${SITE}/use-cases/${u.slug}/): ${u.business} (${TYPES[u.type]}). Source: ${u.sourceUrl}`).join('\n') + '\n';
  if (both.length) t += sec('Owners using both', both);
  t += sec(`Small businesses using ${a.name}`, a.list) + sec(`Small businesses using ${b.name}`, b.list);
  t += `\n---\n\nAll comparisons: ${SITE}/compare/ (Markdown: ${SITE}/compare.md). From ${NAME} (${SITE}/). Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
