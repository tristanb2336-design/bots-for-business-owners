import { glossary, GLOSSARY_EXAMPLES } from '../data/glossary.mjs';
import { SITE, NAME } from '../site.mjs';
export function GET(){
  const terms = glossary();
  let t = `# AI glossary for small business owners\n\n- Web page: ${SITE}/glossary/\n- Plain-English, vendor-neutral definitions. Example counts are how many entries on this site mention the term, not a measure of quality or popularity.\n\n`;
  for (const x of terms) {
    t += `## ${x.term}\n\n`;
    if (x.also.length) t += `Also called: ${x.also.join(', ')}\n\n`;
    t += `${x.def}\n\n- Link: ${SITE}/glossary/#${x.key}\n`;
    if (x.list.length) { t += `- Examples on this site (${x.list.length} mention it, newest first):\n`; for (const u of x.list.slice(0, GLOSSARY_EXAMPLES)) t += `  - ${u.title} (${u.business}): ${SITE}/use-cases/${u.slug}/\n`; }
    t += `- See also: ${x.links.map(([h, n]) => `${n} ${SITE}${h}`).join('; ')}\n\n`;
  }
  t += `---\n\nFrom ${NAME} (${SITE}/). Index for AI assistants: ${SITE}/llms.txt\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
