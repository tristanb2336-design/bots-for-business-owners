// Markdown copy of each AI tool x business type page at /tools/<tool>/<type>.md (also served by content negotiation).
import { TYPES } from '../../../data/usecases.mjs';
import { toolTypeCombos } from '../../../data/tools.mjs';
import { SITE, NAME } from '../../../site.mjs';
const fact = f => !f ? null : (typeof f === 'string' ? { value: f, basis: 'source' } : f);
export function getStaticPaths(){ return toolTypeCombos().map(c => ({ params: { tool: c.tool, type: c.type }, props: { c } })); }
export function GET({ props }){
  const { c } = props; const { g, list, noun } = c;
  let t = `# How ${noun} use ${g.name}: ${list.length} real, sourced examples\n\n`;
  t += `- Web page: ${SITE}${c.path}\n- Tool hub: ${SITE}/tools/${c.tool}/ · Business type hub: ${SITE}/type/${c.type}/\n- Maker: ${g.maker}. ${g.blurb}\n- Vendor-neutral: grouped by the tool named in each source, not ranked. Every entry links its original public source; results are repeated only as stated there, and vendor case studies are written by the vendor.\n\n`;
  for (const u of list) {
    const cost = fact(u.cost), setup = fact(u.setupTime ?? u.setup);
    let line = `- [${u.title}](${SITE}/use-cases/${u.slug}/): ${u.business}. ${u.job} Tools: ${u.tools.join('; ')}.`;
    if (cost) line += ` Cost: ${cost.basis === 'list-price' ? 'tool list price, not what this business paid: ' : ''}${cost.value}`;
    if (setup) line += ` Setup: ${setup.value}`;
    t += `${line} Source: ${u.sourceUrl}\n`;
  }
  const others = toolTypeCombos().filter(x => x !== c && (x.type === c.type || x.tool === c.tool));
  if (others.length) t += `\n## Related pages\n\n${others.map(x => `- [${x.g.name}: ${TYPES[x.type]}](${SITE}${x.path}) (${x.list.length})`).join('\n')}\n`;
  t += `\n---\n\nFrom ${NAME} (${SITE}/). Index: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
