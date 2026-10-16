import { useCases, TYPES } from '../data/usecases.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  let t = `# ${NAME}: full text\n\n`;
  for (const u of useCases) {
    t += `## ${u.title}\n\nURL: ${SITE}/use-cases/${u.slug}/\nAdded: ${u.added}\nBusiness: ${u.business}\nBusiness type: ${TYPES[u.type]}\nJob the AI does: ${u.job}\nStory: ${u.story}\n`;
    if (u.results.length) t += `Reported results (per source): ${u.results.join(' ')}\n`;
    t += `Tools: ${u.tools.join(', ')}\nCost: ${u.cost ?? 'Not stated in source'}\nHow to start:\n${u.start.map((s,i)=>`${i+1}. ${s}`).join('\n')}\nSource: ${u.sourceName} — ${u.sourceUrl}\n\n`;
  }
  return new Response(t, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
