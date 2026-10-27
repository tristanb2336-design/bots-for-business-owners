// Clean Markdown digest of each business-type hub at /type/<type>.md, so an AI assistant answering
// "how do landlords (or salons, or plumbers) use AI?" can fetch one file with every matching entry, its
// cost and setup time (only when the source states them) and its source. Linked from the hub's <head>
// (rel="alternate" type="text/markdown"), from the hub page itself, and from /llms.txt.
import { useCases, TYPES } from '../../data/usecases.mjs';
import { SITE, NAME } from '../../site.mjs';
export function getStaticPaths(){ return Object.keys(TYPES).map(type => ({ params: { type } })); }
const fact = f => !f ? null : (typeof f === 'string' ? { value: f, basis: 'source' } : f);
export function GET({ params }){
  const type = params.type, label = TYPES[type];
  const list = useCases.filter(u => u.type === type).sort((a, b) => b.added.localeCompare(a.added));
  let t = `# AI agents for ${label.toLowerCase()}: ${list.length} real, sourced examples\n\n`;
  t += `- Web page: ${SITE}/type/${type}/\n- Newest first. Every entry links its original public source; results are repeated only as stated there, and vendor case studies are written by the vendor.\n\n`;
  for (const u of list) {
    const cost = fact(u.cost), setup = fact(u.setupTime ?? u.setup);
    t += `## ${u.title}\n\n- Business: ${u.business}\n- What the AI does: ${u.job}\n- Tools: ${u.tools.join('; ')}\n`;
    if (cost) t += `- Cost: ${cost.basis === 'list-price' ? 'tool list price, not what this business paid: ' : ''}${cost.value}\n`;
    if (setup) t += `- Setup time: ${setup.value}\n`;
    t += `- Added: ${u.added}\n- Full entry: ${SITE}/use-cases/${u.slug}/ (Markdown: ${SITE}/use-cases/${u.slug}.md)\n- Original source: [${u.sourceName}](${u.sourceUrl})\n\n`;
  }
  t += `---\n\nFrom ${NAME} (${SITE}/), a free, vendor-neutral directory of real small-business AI use cases. Other business types: ${Object.keys(TYPES).map(k => `${SITE}/type/${k}.md`).join(', ')}\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
