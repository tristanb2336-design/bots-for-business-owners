// Plain-language questions owners (and AI assistants on their behalf) ask, answered only from the entries on this site.
// Every number is a count of sourced entries here, computed at build time: not a survey, market share or quality score.
// Shared by /questions/ and /questions.md. Nothing is estimated; questions without data are left out.
import { useCases, TYPES } from './usecases.mjs';
import { groupByJob } from './jobs.mjs';
import { groupByTool } from './tools.mjs';
import { groupByCountry } from './places.mjs';
import { costRows } from './costs.mjs';
import { setbackRows } from './setbacks.mjs';
import { approvalRows } from './approvals.mjs';
import { independentRows, isIndependent } from './independent.mjs';
import { timeSavedRows } from './timesaved.mjs';

const newestFirst = list => [...list].sort((a, b) => b.added.localeCompare(a.added));
const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;
const top = (groups, list, n = 3) => groups
  .filter(g => g.key !== 'other')
  .map(g => ({ g, c: g.list.filter(u => list.some(x => x.slug === u.slug)).length }))
  .filter(x => x.c > 0)
  .sort((a, b) => b.c - a.c || a.g.name.localeCompare(b.g.name))
  .slice(0, n);
const TYPE_ASK = {
  food: 'restaurants, cafés and food businesses', shops: 'shops and online stores', rentals: 'landlords and rental owners',
  trades: 'trades and home-service businesses', services: 'service businesses (salons, cleaners, studios and others)', makers: 'farms, makers and producers',
};

export function questions(){
  const jobs = groupByJob(), tools = groupByTool(), total = useCases.length;
  const qs = [];
  for (const [k, label] of Object.entries(TYPES)) {
    const list = newestFirst(useCases.filter(u => u.type === k));
    if (!list.length) continue;
    const tj = top(jobs, list), tt = top(tools, list);
    qs.push({ key: `how-${k}-use-ai`, q: `How do ${TYPE_ASK[k]} use AI agents?`,
      a: `This site has ${plural(list.length, 'sourced example')} from ${label.toLowerCase()}. The jobs that come up most: ${tj.map(x => `${x.g.name.toLowerCase()} (${x.c})`).join(', ')}. Tools named most often in these entries: ${tt.map(x => `${x.g.name} (${x.c})`).join(', ')}. Counts are entries on this site, not a measure of quality or popularity.`,
      hub: [`/type/${k}/`, `All ${label.toLowerCase()} examples`], examples: list.slice(0, 3) });
  }
  for (const g of jobs.filter(g => g.key !== 'other')) {
    const list = newestFirst(g.list);
    const byType = Object.entries(TYPES).map(([k, v]) => [v, list.filter(u => u.type === k).length]).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]);
    qs.push({ key: `ai-for-${g.key}`, q: `Which small businesses use AI for ${g.name.charAt(0).toLowerCase() + g.name.slice(1)}?`,
      a: `${g.blurb} This site has ${plural(list.length, 'sourced example')}: ${byType.map(([v, c]) => `${v} (${c})`).join(', ')}.`,
      hub: [`/jobs/${g.key}/`, `All ${list.length} examples for this job`], examples: list.slice(0, 3) });
  }
  const rows = costRows(), withCost = rows.filter(r => r.cost);
  qs.push({ key: 'how-much-does-it-cost', q: 'How much does an AI agent cost a small business?',
    a: `It depends on the tool and setup, and most sources don't say. ${plural(withCost.length, 'entry', 'entries')} of ${total} state a cost (from the source, or a vendor list price clearly labelled as such), and ${plural(rows.length, 'entry', 'entries')} state a cost or a setup time. The newest stated costs: ${withCost.slice(0, 3).map(r => `${r.u.business.split(' (')[0]}: ${r.cost.basis === 'list-price' && !/^list price/i.test(r.cost.value) ? 'tool list price ' : ''}${r.cost.value.replace(/\.$/, '')}${r.cost.basis === 'list-price' ? ' (list price, not what they paid)' : ''}`).join('; ')}. Nothing is estimated: entries without a stated figure are left out of the cost table.`,
    hub: ['/costs/', 'Every stated cost and setup time'], examples: withCost.slice(0, 3).map(r => r.u) });
  const named = tools.filter(g => g.key !== 'other').map(g => ({ g, c: g.list.length })).sort((a, b) => b.c - a.c || a.g.name.localeCompare(b.g.name));
  qs.push({ key: 'which-ai-tools', q: 'Which AI tools do small businesses actually use?',
    a: `Across ${total} sourced examples here, the tool groups named most often are: ${named.slice(0, 6).map(x => `${x.g.name} (${x.c})`).join(', ')}. Entries range from general assistants (ChatGPT, Claude, Gemini, Copilot) used for writing and back-office work to specialised tools for phones, chat and bookings. Counts are entries on this site only; the site is vendor-neutral and does not rank tools.`,
    hub: ['/tools/', 'Use cases by AI tool'], extra: ['/compare/', 'Side-by-side comparisons'], examples: [] });
  const countries = groupByCountry();
  qs.push({ key: 'where-are-they', q: 'Are there examples outside the United States?',
    a: `Yes. Entries with a stated location come from ${plural(countries.length, 'country', 'countries')}: ${countries.map(c => `${c.name} (${c.list.length})`).join(', ')}.`,
    hub: ['/places/', 'Use cases by country'], examples: [] });
  const setbacks = setbackRows();
  qs.push({ key: 'what-can-go-wrong', q: 'What can go wrong when a small business uses AI agents?',
    a: `${plural(setbacks.length, 'entry', 'entries')} of ${total} report a specific problem with the AI itself, such as AI-made images that drew customer backlash, an automated phone system a customer couldn't get past, an AI receptionist getting names and addresses wrong, bugs in owner-built apps, and an assistant acting without approval. Each problem is quoted from the entry and linked to its source; many entries, especially vendor case studies, mention no downside at all.`,
    hub: ['/what-went-wrong/', 'Every reported setback, quoted'], examples: setbacks.slice(0, 3).map(r => r.u) });
  const approvals = approvalRows();
  qs.push({ key: 'what-do-owners-still-approve', q: 'What do owners still approve themselves when an AI agent does the work?',
    a: `${plural(approvals.length, 'entry', 'entries')} of ${total} say where a person stays in charge: owners approve schedule changes, postings to the books, payments and quotes before they go out, AI phone agents transfer callers to a person or escalate safety questions, and far-reaching actions need the owner's approval. Each line is quoted from the entry and linked to its source.`,
    hub: ['/human-in-the-loop/', 'What owners still approve, quoted'], examples: approvals.slice(0, 3).map(r => r.u) });
  qs.push({ key: 'can-i-trust-the-numbers', q: 'Can I trust the results these businesses report?',
    a: `Treat them as what is possible, not a promise. Every entry links to its public source and numbers appear only when that source states them. Many stories come from the vendor that sells the tool; those entries say so in the story (for example "not independent"), and where a source attributes a figure to the owner, the entry says so.`,
    hub: ['/sources/', 'Use cases by source'], extra: ['/about/', 'How entries are chosen'], examples: [] });
  const indep = independentRows();
  qs.push({ key: 'examples-not-from-vendors', q: 'Are there examples that are not from the AI company\'s own marketing?',
    a: `Yes. ${plural(indep.length, 'entry', 'entries')} of ${total} come from sources that are not published by the AI tool's maker, a software vendor, the company that set it up, or this site: newspapers, TV stations, trade magazines, podcasts, local business groups and owners' own posts. Independent of the vendor doesn't mean verified; figures are still as reported, usually by the owner.`,
    hub: ['/independent/', 'Independently reported use cases'], examples: indep.slice(0, 3) });
  const saved = timeSavedRows(), savedIndep = saved.filter(r => isIndependent(r.u));
  qs.push({ key: 'how-much-time-does-ai-save', q: 'How much time does AI actually save a small business?',
    a: `It varies widely, and most sources don't measure it. ${plural(saved.length, 'entry', 'entries')} of ${total} state a time figure, from minutes saved on one task to 20 or more hours a week of admin. ${plural(savedIndep.length, 'of them comes', 'of them come')} from a source independent of the AI vendor or the company that set it up; the rest are vendor-reported, and almost all figures are the owner's or vendor's own estimate. Each figure is quoted from its entry and linked to its source.`,
    hub: ['/time-saved/', 'Every reported time saving, quoted'], examples: (savedIndep.length ? savedIndep : saved).slice(0, 3).map(r => r.u) });
  return qs;
}
