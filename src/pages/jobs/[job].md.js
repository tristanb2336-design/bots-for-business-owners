import { TYPES } from '../../data/usecases.mjs';
import { groupByJob } from '../../data/jobs.mjs';
import { SITE, NAME } from '../../site.mjs';
const fact = f => !f ? null : (typeof f === 'string' ? { value: f, basis: 'source' } : f);
export function getStaticPaths(){ return groupByJob().map(g => ({ params: { job: g.key }, props: { g } })); }
export function GET({ props }){
  const { g } = props;
  let t = `# ${g.name}: ${g.list.length} real small business AI use case${g.list.length===1?'':'s'}\n\n`;
  t += `- Web page: ${SITE}/jobs/${g.key}/\n- ${g.blurb}\n- Hub of all jobs: ${SITE}/jobs/\n\n`;
  for (const u of g.list) {
    const cost = fact(u.cost), setup = fact(u.setupTime ?? u.setup);
    let line = `- [${u.title}](${SITE}/use-cases/${u.slug}/): ${u.business} (${TYPES[u.type]}). ${u.job} Tools: ${u.tools.join('; ')}.`;
    if (cost) line += ` Cost: ${cost.value}`;
    if (setup) line += ` Setup: ${setup.value}`;
    t += `${line} Source: ${u.sourceUrl}\n`;
  }
  t += `\n---\n\nFrom ${NAME} (${SITE}/). Index: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
