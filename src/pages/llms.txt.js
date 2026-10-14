import { useCases, TYPES } from '../data/usecases.mjs';
import { SITE, NAME, TAGLINE } from '../site.mjs';
export function GET(){
  let t = `# ${NAME}\n\n> ${TAGLINE} ${useCases.length} use cases. Every entry cites its public source.\n\n`;
  for (const [k,v] of Object.entries(TYPES)) {
    t += `## ${v}\n\n`;
    for (const u of useCases.filter(x=>x.type===k)) t += `- [${u.title}](${SITE}/use-cases/${u.slug}/): ${u.business}. ${u.job} Source: ${u.sourceUrl}\n`;
    t += '\n';
  }
  t += `## Optional\n\n- [Full text of all use cases](${SITE}/llms-full.txt)\n- [About](${SITE}/about/)\n- [Advertise / Get featured](${SITE}/advertise/): featured listings and Hands Free newsletter sponsorships, always labeled as paid\n- [Contact](${SITE}/contact/)\n- [Sitemap](${SITE}/sitemap.xml)\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
