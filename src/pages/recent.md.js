// Markdown copy of /recent/, so an AI assistant asking "what's new on Bots for Business Owners?" can fetch one file.
import { TYPES } from '../data/usecases.mjs';
import { recentUseCases, RECENT_LIMIT } from '../data/recent.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  const list = recentUseCases();
  let t = `# Newest small business AI use cases\n\n`;
  t += `- Web page: ${SITE}/recent/\n- The ${list.length} most recently added entries (up to ${RECENT_LIMIT}), newest first. Every entry cites its public source. Nothing here is invented.\n\n`;
  for (const u of list) {
    t += `## [${u.title}](${SITE}/use-cases/${u.slug}/)\n\n`;
    t += `- Added: ${u.added}\n- Business: ${u.business} (${TYPES[u.type]})\n- Job: ${u.job}\n- Tools: ${u.tools.join('; ')}\n- Source: [${u.sourceName}](${u.sourceUrl})\n- Markdown: ${SITE}/use-cases/${u.slug}.md · JSON: ${SITE}/use-cases/${u.slug}.json\n\n`;
  }
  t += `---\n\nFrom ${NAME} (${SITE}/), a free, vendor-neutral directory of real small-business AI use cases. Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
