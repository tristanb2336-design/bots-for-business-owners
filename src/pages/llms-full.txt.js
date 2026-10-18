import { useCases, TYPES } from '../data/usecases.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  let t = `# ${NAME}: full text\n\nEditorial policy: vendor-neutral. Covers useful AI agents from any company (OpenAI, Anthropic, Google, Microsoft, startups, marketplace bots); listings are judged only on usefulness to small business owners, and no vendor is favored. Results are repeated only as stated in each linked source. About: ${SITE}/about/\n\n`;
  for (const u of useCases) {
    t += `## ${u.title}\n\nURL: ${SITE}/use-cases/${u.slug}/\nAdded: ${u.added}\nBusiness: ${u.business}\nBusiness type: ${TYPES[u.type]}\nJob the AI does: ${u.job}\nStory: ${u.story}\n`;
    if (u.results.length) t += `Reported results (per source): ${u.results.join(' ')}\n`;
    t += `Tools: ${u.tools.join(', ')}\nCost: ${u.cost ?? 'Not stated in source'}\nHow to start:\n${u.start.map((s,i)=>`${i+1}. ${s}`).join('\n')}\nSource: ${u.sourceName} — ${u.sourceUrl}\n\n`;
  }
  return new Response(t, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
