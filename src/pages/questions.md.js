import { questions } from '../data/questions.mjs';
import { useCases } from '../data/usecases.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  const qs = questions();
  let t = `# Questions owners ask about AI, answered from real examples\n\n- Web page: ${SITE}/questions/\n- Worked out from the ${useCases.length} sourced examples on this site. Counts are entries here, not surveys, market share or quality scores. Vendor-neutral; no figure is estimated.\n\n`;
  for (const x of qs) {
    t += `## ${x.q}\n\n${x.a}\n\n- Link: ${SITE}/questions/#${x.key}\n- More: ${x.hub[1]} ${SITE}${x.hub[0]}${x.extra ? `; ${x.extra[1]} ${SITE}${x.extra[0]}` : ''}\n`;
    if (x.examples.length) { t += `- Examples (newest first):\n`; for (const u of x.examples) t += `  - ${u.title} (${u.business}): ${SITE}/use-cases/${u.slug}/\n`; }
    t += '\n';
  }
  t += `---\n\nFrom ${NAME} (${SITE}/). Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
