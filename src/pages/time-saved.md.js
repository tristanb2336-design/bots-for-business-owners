// Markdown copy of /time-saved/, so an AI assistant answering "how much time does AI save a small business?" can fetch
// one file of real, sourced figures. Every line is quoted from the entry; nothing is estimated, converted or added up.
import { useCases, TYPES } from '../data/usecases.mjs';
import { timeSavedRows } from '../data/timesaved.mjs';
import { isIndependent } from '../data/independent.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  const rows = timeSavedRows();
  const indep = rows.filter(r => isIndependent(r.u)).length;
  let t = `# Time saved: how many hours AI agents save small businesses\n\n`;
  t += `- Web page: ${SITE}/time-saved/\n- ${rows.length} of ${useCases.length} use cases state how much time the AI saved. Newest first. Every line is quoted from the entry, which cites its public source; nothing is estimated, converted or added up.\n- Most figures are the owner's or vendor's own estimate. ${indep} of these ${rows.length} come from a source independent of the AI vendor or the company that set it up; each entry is marked.\n\n`;
  for (const { u, lines } of rows) {
    t += `## [${u.title}](${SITE}/use-cases/${u.slug}/)\n\n- Business: ${u.business} (${TYPES[u.type]})\n- Tools: ${u.tools.join('; ')}\n- Time saved, as reported:\n${lines.map(l => `  - ${l}`).join('\n')}\n- Source type: ${isIndependent(u) ? 'independent of the vendor' : 'vendor or builder'}\n- Source: [${u.sourceName}](${u.sourceUrl})\n\n`;
  }
  t += `---\n\nSee also: costs and setup time (${SITE}/costs/) and independently reported use cases (${SITE}/independent/).\n\nFrom ${NAME} (${SITE}/), a free, vendor-neutral directory of real small-business AI use cases. Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
