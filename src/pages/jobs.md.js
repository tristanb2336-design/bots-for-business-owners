// Markdown copy of /jobs/ (use cases grouped by the job the AI does).
import { useCases, TYPES } from '../data/usecases.mjs';
import { groupByJob } from '../data/jobs.mjs';
import { SITE, NAME } from '../site.mjs';
const fact = f => !f ? null : (typeof f === 'string' ? { value: f, basis: 'source' } : f);
export function GET(){
  const groups = groupByJob();
  let t = `# Small business AI use cases by job: ${useCases.length} real, sourced examples\n\n`;
  t += `- Web page: ${SITE}/jobs/\n- Groups are alphabetical. A use case that covers more than one job appears in each matching group. Every entry links its original public source; results are repeated only as stated there.\n\n`;
  for (const g of groups) {
    t += `## ${g.name}\n\n${g.blurb} ${g.list.length} use case${g.list.length === 1 ? '' : 's'}. Page: ${SITE}/jobs/${g.key}/ (Markdown: ${SITE}/jobs/${g.key}.md)\n\n`;
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
