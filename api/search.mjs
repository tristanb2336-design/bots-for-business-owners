// Read-only keyword search over the published use cases, for AI assistants, agents and browsers (OpenSearch).
// GET /api/search/?q=words[&type=food|shops|rentals|trades|services|makers][&limit=10][&format=json|md]
// Reads the site's own /use-cases.json (cached per instance). No logging, no cookies, no writes.
const SITE = 'https://bots-for-business-owners.vercel.app';
let cache = { at: 0, data: null };
const TTL = 10 * 60 * 1000;

async function load(req) {
  if (cache.data && Date.now() - cache.at < TTL) return cache.data;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const base = host && /^[a-z0-9.-]+(:\d+)?$/i.test(host) && /vercel\.app$|^localhost/.test(host.split(':')[0]) ? `https://${host}` : SITE;
  const r = await fetch(`${base}/use-cases.json`);
  if (!r.ok) throw new Error('data unavailable');
  cache = { at: Date.now(), data: await r.json() };
  return cache.data;
}

const norm = s => String(s || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
const STOP = new Set(['a','an','the','and','or','of','for','to','in','on','with','by','how','do','does','is','are','my','use','uses','using','ai','small','business','businesses','owner','owners']);

function score(u, terms) {
  const loc = u.location ? `${u.location.place || ''} ${u.location.country || ''}` : '';
  const fields = [
    [norm(u.title), 4], [norm(u.business), 4], [norm(u.tools.join(' ')), 4], [norm(u.categoryName), 3],
    [norm(loc), 3], [norm(u.job), 2], [norm(u.results.join(' ')), 1], [norm(u.source && u.source.name), 1],
  ];
  let total = 0;
  for (const t of terms) {
    let best = 0;
    for (const [text, w] of fields) if (text.includes(t)) best = Math.max(best, w);
    if (!best) return 0; // every term must match somewhere
    total += best;
  }
  return total;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.statusCode = 405; res.setHeader('Allow', 'GET, HEAD'); return res.end('Use GET.'); }
  const url = new URL(req.url, SITE);
  const q = (url.searchParams.get('q') || '').slice(0, 200);
  const type = url.searchParams.get('type') || '';
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '10', 10) || 10, 1), 50);
  const wantMd = url.searchParams.get('format') === 'md' || /text\/(markdown|plain)/.test(req.headers.accept || '');
  let data;
  try { data = await load(req); } catch { res.statusCode = 503; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ error: 'Search data unavailable. Use /use-cases.json or /llms-full.txt instead.' })); }
  const terms = norm(q).split(/[^a-z0-9£$€]+/).filter(t => t.length > 1 && !STOP.has(t));
  let list = data.useCases.filter(u => !type || u.category === type);
  const ranked = terms.length
    ? list.map(u => [score(u, terms), u]).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0] || (b[1].added || '').localeCompare(a[1].added || '')).map(([, u]) => u)
    : list;
  const results = ranked.slice(0, limit).map(u => ({ title: u.title, url: u.url, markdown: u.markdown, json: u.json, business: u.business,
    category: u.categoryName, location: u.location, tools: u.tools, job: u.job, cost: u.cost, setupTime: u.setupTime, source: u.source, added: u.added }));
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=600');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (wantMd) {
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    const head = `# Search: ${q || '(all)'}\n\n${ranked.length} matching use case${ranked.length === 1 ? '' : 's'} on ${SITE}/ (showing ${results.length}). Every entry cites a public source; cost and setup time appear only when the source states them.\n\n`;
    const body = results.map((r, i) => `${i + 1}. [${r.title}](${r.url}) — ${r.business}. Tools: ${r.tools.join(', ')}. Source: [${r.source.name}](${r.source.url}). Markdown: ${r.markdown}`).join('\n');
    return res.end(head + (body || 'No matches. Try fewer or broader words (e.g. "phone", "bakery", "landlord", "Claude").') + '\n');
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ query: q, type: type || null, total: ranked.length, count: results.length, site: SITE + '/', results }, null, 2));
}
