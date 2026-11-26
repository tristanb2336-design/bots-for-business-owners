// Markdown copy of /human-in-the-loop/, so an AI assistant answering "what should a person still approve when an AI
// agent runs part of a small business?" can fetch one file of real, sourced examples. Every line is quoted from the entry.
import { useCases, TYPES } from '../data/usecases.mjs';
import { approvalRows } from '../data/approvals.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  const rows = approvalRows();
  let t = `# Human in the loop: what owners still approve when AI agents do the work\n\n`;
  t += `- Web page: ${SITE}/human-in-the-loop/\n- ${rows.length} of ${useCases.length} use cases say what a person still approves, reviews or takes over from the AI. Newest first. Every line is quoted from the entry, which cites its public source; nothing is added. Entries that don't mention a check may still have one.\n\n`;
  for (const { u, lines } of rows) {
    t += `## [${u.title}](${SITE}/use-cases/${u.slug}/)\n\n- Business: ${u.business} (${TYPES[u.type]})\n- Tools: ${u.tools.join('; ')}\n- Where a person stays in charge:\n${lines.map(l => `  - ${l}`).join('\n')}\n- Source: [${u.sourceName}](${u.sourceUrl})\n\n`;
  }
  t += `---\n\nSee also: what went wrong (${SITE}/what-went-wrong/) and the glossary entry for human in the loop (${SITE}/glossary/#human-in-the-loop).\n\nFrom ${NAME} (${SITE}/), a free, vendor-neutral directory of real small-business AI use cases. Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
