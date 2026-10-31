// Markdown copy of /costs/, so an AI assistant answering "how much does an AI receptionist / AI agent cost a small
// business?" can fetch one file of source-stated figures. Linked from /costs/ (rel="alternate") and /llms.txt.
import { useCases, TYPES } from '../data/usecases.mjs';
import { costRows } from '../data/costs.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  const rows = costRows();
  let t = `# What AI agents cost small businesses, and how long setup takes\n\n`;
  t += `- Web page: ${SITE}/costs/\n- ${rows.length} of ${useCases.length} use cases state a cost or setup time in their source; all are listed here, newest first. Nothing is estimated. "List price" means the tool's public price on the vendor's page, not what the business paid. Figures are as reported by each source and were not independently verified.\n\n`;
  for (const { u, cost, setup } of rows) {
    t += `## [${u.title}](${SITE}/use-cases/${u.slug}/)\n\n- Business: ${u.business} (${TYPES[u.type]})\n- Tools: ${u.tools.join('; ')}\n`;
    t += `- Cost: ${cost ? (cost.basis === 'list-price' ? 'list price, not what this business paid: ' : '') + cost.value + (cost.note ? ` (${cost.note})` : '') + (cost.url ? ` Pricing page: ${cost.url}` : '') : 'not stated'}\n`;
    t += `- Setup time: ${setup ? setup.value + (setup.note ? ` (${setup.note})` : '') : 'not stated'}\n`;
    t += `- Source: [${u.sourceName}](${u.sourceUrl})\n\n`;
  }
  t += `---\n\nFrom ${NAME} (${SITE}/), a free, vendor-neutral directory of real small-business AI use cases. Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
