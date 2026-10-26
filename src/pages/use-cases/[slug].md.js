// Clean Markdown copy of each use case at /use-cases/<slug>.md (the llms.txt convention), so AI assistants and
// agents fetching one entry get just the facts and source, without page chrome. Linked from each page's <head>
// (rel="alternate" type="text/markdown"), from the page itself, and from /llms.txt.
import { useCases, TYPES } from '../../data/usecases.mjs';
import { SITE, NAME } from '../../site.mjs';
export function getStaticPaths(){ return useCases.map(u => ({ params: { slug: u.slug }, props: { u } })); }
const fact = f => !f ? null : (typeof f === 'string' ? { value: f, basis: 'source', note: 'Stated in the source.', url: null } : f);
export function GET({ props }){
  const u = props.u, url = `${SITE}/use-cases/${u.slug}/`;
  const cost = fact(u.cost), setup = fact(u.setupTime ?? u.setup);
  const costLine = cost ? `${cost.basis === 'list-price' ? 'Tool list price (not what this business paid): ' : ''}${cost.value} (${cost.note}${cost.url ? ` ${cost.url}` : ''})` : 'Not stated in the source.';
  const setupLine = setup ? `${setup.value} (${setup.note})` : 'Not stated in the source.';
  let t = `# ${u.title}\n\n`;
  t += `- Business: ${u.business}\n- Business type: ${TYPES[u.type]}\n- Added: ${u.added}\n- Web page: ${url}\n- Original source: [${u.sourceName}](${u.sourceUrl})\n\n`;
  t += `## The job the AI does\n\n${u.job}\n\n## The story\n\n${u.story}\n\n`;
  if (u.results.length) t += `## What the source reports\n\n${u.results.map(r => `- ${r}`).join('\n')}\n\n`;
  t += `## Tools used\n\n${u.tools.map(x => `- ${x}`).join('\n')}\n\n`;
  t += `## Cost\n\n${costLine}\n\n## Setup time\n\n${setupLine}\n\n`;
  t += `## How to start (plain English)\n\n${u.start.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n`;
  t += `---\n\nFrom ${NAME} (${SITE}/), a free, vendor-neutral directory of real, sourced small-business AI use cases. Results are repeated only as stated in the linked source; vendor case studies are written by the vendor. When citing, link the web page above and the original source.\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
