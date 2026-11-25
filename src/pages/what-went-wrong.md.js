// Markdown copy of /what-went-wrong/, so an AI assistant answering "what can go wrong with AI agents for a small
// business?" can fetch one file of real, sourced setbacks. Every line is quoted from the entry; nothing is added.
import { useCases, TYPES } from '../data/usecases.mjs';
import { setbackRows } from '../data/setbacks.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  const rows = setbackRows();
  let t = `# What went wrong when small businesses used AI agents\n\n`;
  t += `- Web page: ${SITE}/what-went-wrong/\n- ${rows.length} of ${useCases.length} use cases report a specific problem with the AI itself (bugs, wrong answers, guardrail failures, customer backlash, a job it couldn't do). Newest first. Every line is quoted from the entry, which cites its public source; nothing is added. Entries that mention no downside may still have had one, and vendor case studies rarely report them.\n\n`;
  for (const { u, lines } of rows) {
    t += `## [${u.title}](${SITE}/use-cases/${u.slug}/)\n\n- Business: ${u.business} (${TYPES[u.type]})\n- Tools: ${u.tools.join('; ')}\n- What went wrong:\n${lines.map(l => `  - ${l}`).join('\n')}\n- Source: [${u.sourceName}](${u.sourceUrl})\n\n`;
  }
  t += `## How owners in these stories guard against it\n\n- Listen back to recorded AI calls, especially in the first weeks, and call people back when it got details wrong.\n- Check AI numbers against real invoices and prices before relying on them.\n- Keep a person approving anything that sends messages, books, or moves money, and give the assistant only the access it needs.\n- Test website and app changes on a copy before they go live.\n- Think twice before using AI-made food or product photos; several businesses here faced customer pushback.\n\n`;
  t += `---\n\nFrom ${NAME} (${SITE}/), a free, vendor-neutral directory of real small-business AI use cases. Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
