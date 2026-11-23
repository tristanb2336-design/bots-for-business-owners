// Markdown copy of each business type x job page at /type/<type>/<job>.md (also served by content negotiation).
import { TYPES } from '../../../data/usecases.mjs';
import { typeJobCombos } from '../../../data/jobs.mjs';
import { SITE, NAME } from '../../../site.mjs';
const fact = f => !f ? null : (typeof f === 'string' ? { value: f, basis: 'source' } : f);
export function getStaticPaths(){ return typeJobCombos().map(c => ({ params: { type: c.type, job: c.job }, props: { c } })); }
export function GET({ props }){
  const { c } = props; const { g, list, noun } = c;
  const jobLower = g.name.charAt(0).toLowerCase() + g.name.slice(1);
  let t = `# How ${noun} use AI for ${jobLower}: ${list.length} real, sourced examples\n\n`;
  t += `- Web page: ${SITE}${c.path}\n- Business type hub: ${SITE}/type/${c.type}/ · Job hub: ${SITE}/jobs/${c.job}/\n- ${g.blurb}\n- Every entry links its original public source; results are repeated only as stated there, and vendor case studies are written by the vendor.\n\n`;
  for (const u of list) {
    const cost = fact(u.cost), setup = fact(u.setupTime ?? u.setup);
    let line = `- [${u.title}](${SITE}/use-cases/${u.slug}/): ${u.business}. ${u.job} Tools: ${u.tools.join('; ')}.`;
    if (cost) line += ` Cost: ${cost.basis === 'list-price' ? 'tool list price, not what this business paid: ' : ''}${cost.value}`;
    if (setup) line += ` Setup: ${setup.value}`;
    t += `${line} Source: ${u.sourceUrl}\n`;
  }
  const others = typeJobCombos().filter(x => x !== c && (x.type === c.type || x.job === c.job));
  if (others.length) t += `\n## Related pages\n\n${others.map(x => `- [${TYPES[x.type]}: ${x.g.name}](${SITE}${x.path}) (${x.list.length})`).join('\n')}\n`;
  t += `\n---\n\nFrom ${NAME} (${SITE}/). Index: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
