// Groups use cases by the kind of work the AI does (phone answering, writing, inventory, etc.),
// so owners and AI assistants asking "how do shops use AI for missed calls / email / forecasting?"
// land on a focused list. A use case can appear in more than one job. Alphabetical; no ranking.
import { useCases } from './usecases.mjs';

export const JOB_GROUPS = [
  { key: 'phone-answering', name: 'Answering the phone and taking messages or orders',
    blurb: 'AI phone agents and receptionists that pick up when the crew is busy, take orders or job briefs, and route emergencies.',
    match: /phone|call|receptionist|voice agent|CSR AI|after-hours|missed call|dial|voicemail/i },
  { key: 'writing-and-email', name: 'Drafting email, copy and customer replies',
    blurb: 'Assistants that draft supplier emails, customer replies, product descriptions, policies and social posts for the owner to edit.',
    match: /email|draft|reply|replies|supplier|warranty|product description|caption|newsletter|handbook|policy|HR polic/i },
  { key: 'inventory-and-forecasting', name: 'Inventory, sales questions and forecasting',
    blurb: 'POS and general assistants that answer what sells, how much to make or order, and season-over-season trends.',
    match: /inventory|forecast|sales data|what sell|SKU|reorder|stock|open-to-buy|candle batch|seasonal ingredient/i },
  { key: 'in-store-and-chat', name: 'In-store and chat assistants for shoppers',
    blurb: 'Floor kiosks, website chat and messaging agents that answer routine customer questions so staff stay with people.',
    match: /in-store|walk-up|Millie|chatbot|WhatsApp|website chat|guest message|leasing|shopper question|customer question|concierge/i },
  { key: 'booking-and-scheduling', name: 'Booking appointments, jobs and viewings',
    blurb: 'Agents that book slots, recover abandoned bookings, schedule crews or set rental viewings.',
    match: /book|booking|schedul|appointment|calendar|viewing|reservation|waitlist/i },
  { key: 'quotes-and-invoices', name: 'Quotes, estimates and invoicing',
    blurb: 'Tools that draft line-item quotes on site, price jobs, or send invoices and payment links.',
    match: /quote|estimat|invoic|pricing|price|Stripe invoic|Coach AI/i },
  { key: 'ops-and-back-office', name: 'Recipes, checklists and back-office ops',
    blurb: 'Assistants that scale recipes, write checklists, dig through files, or handle paperwork and admin.',
    match: /recipe|checklist|cleaning|scale|conversion|accounting|paperwork|admin|file|onboarding|manual|equipment|labelling|label/i },
];

export function groupByJob() {
  const groups = JOB_GROUPS.map(g => ({
    ...g,
    list: useCases.filter(u => g.match.test([u.job, u.title, u.tools.join(' '), ...(u.results || [])].join(' '))),
  })).filter(g => g.list.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
  const matched = new Set(groups.flatMap(g => g.list.map(u => u.slug)));
  const other = useCases.filter(u => !matched.has(u.slug));
  if (other.length) groups.push({ key: 'other', name: 'Other jobs AI handles', blurb: 'Setups that do not fit cleanly into one job above.', list: other, match: null });
  return groups;
}

export const JOB_PAGE_MIN = 1;
