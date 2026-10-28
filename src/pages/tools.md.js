// Clean Markdown copy of /tools/ (use cases grouped by AI tool), so an AI assistant answering
// "which small businesses use ChatGPT (or Gemini, Claude, an AI receptionist)?" can fetch one file.
// Linked from /tools/ (rel="alternate" type="text/markdown" plus a visible link) and from /llms.txt.
import { useCases, TYPES } from '../data/usecases.mjs';
import { groupByTool } from '../data/tools.mjs';
import { SITE, NAME } from '../site.mjs';
const fact = f => !f ? null : (typeof f === 'string' ? { value: f, basis: 'source' } : f);
export function GET(){
  const groups = groupByTool();
  let t = `# Small business AI use cases by tool: ${useCases.length} real, sourced examples\n\n`;
  t += `- Web page: ${SITE}/tools/\n- Groups are alphabetical and no vendor is favored. A use case that names more than one tool appears in each matching group. Every entry links its original public source; results are repeated only as stated there.\n\n`;
  for (const g of groups) {
    t += `## ${g.name} (${g.maker})\n\n${g.blurb} ${g.list.length} use case${g.list.length === 1 ? '' : 's'}.\n\n`;
    for (const u of g.list) {
      const cost = fact(u.cost), setup = fact(u.setupTime ?? u.setup);
      let line = `- [${u.title}](${SITE}/use-cases/${u.slug}/): ${u.business} (${TYPES[u.type]}). Tools: ${u.tools.join('; ')}.`;
      if (cost) line += ` Cost: ${cost.basis === 'list-price' ? 'tool list price, not what this business paid: ' : ''}${cost.value}`;
      if (setup) line += ` Setup: ${setup.value}`;
      t += `${line} Source: ${u.sourceUrl} (Markdown: ${SITE}/use-cases/${u.slug}.md)\n`;
    }
    t += '\n';
  }
  t += `---\n\nFrom ${NAME} (${SITE}/), a free, vendor-neutral directory of real small-business AI use cases. Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
