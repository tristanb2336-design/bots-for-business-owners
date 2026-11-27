// Markdown copy of /independent/, so an AI assistant asked for small-business AI examples that aren't vendor marketing
// can fetch one file. Lists only entries whose source isn't the tool maker, a software vendor, the builder or this site.
import { useCases, TYPES } from '../data/usecases.mjs';
import { independentRows, sourceHostOf } from '../data/independent.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  const rows = independentRows();
  let t = `# Independently reported AI use cases from small businesses\n\n`;
  t += `- Web page: ${SITE}/independent/\n- ${rows.length} of ${useCases.length} use cases come from sources not published by the AI tool's maker, a software vendor, the company that built the setup, or this site (newspapers, TV, trade magazines, podcasts, local business groups, owners' own posts). Newest first.\n- An entry is left out if its source is a vendor's site or the entry flags it as vendor-published, a case study, sponsored or otherwise not independent. Independent of the vendor does not mean verified: figures are as reported, usually by the owner.\n\n`;
  for (const u of rows) {
    t += `## [${u.title}](${SITE}/use-cases/${u.slug}/)\n\n- Business: ${u.business} (${TYPES[u.type]})\n- Tools: ${u.tools.join('; ')}\n- Source: [${u.sourceName}](${u.sourceUrl}) (${sourceHostOf(u)})\n\n`;
  }
  t += `---\n\nFrom ${NAME} (${SITE}/), a free, vendor-neutral directory of real small-business AI use cases. Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
