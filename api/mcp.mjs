// Read-only remote MCP server (Model Context Protocol, Streamable HTTP transport, stateless JSON responses).
// Lets AI assistants that support custom connectors (Claude, ChatGPT, Cursor and other MCP clients) search and read
// the site's sourced use cases directly. Served at /mcp/ (rewrite in vercel.json) and /api/mcp.
// Tools: search_use_cases, get_use_case, list_categories. Reads the site's own /use-cases.json (cached per instance).
// No auth, no logging, no cookies, no writes: every tool is read-only and returns only what the site already publishes.
const SITE = 'https://bots-for-business-owners.vercel.app';
const VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
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
  const fields = [[norm(u.title), 4], [norm(u.business), 4], [norm(u.tools.join(' ')), 4], [norm(u.categoryName), 3],
    [norm(loc), 3], [norm(u.job), 2], [norm(u.results.join(' ')), 1], [norm(u.source && u.source.name), 1]];
  let total = 0;
  for (const t of terms) {
    let best = 0;
    for (const [text, w] of fields) if (text.includes(t)) best = Math.max(best, w);
    if (!best) return 0;
    total += best;
  }
  return total;
}
const factText = f => !f ? 'not stated in the source' : (typeof f === 'string' ? f : `${f.value}${f.basis === 'list-price' ? ' (vendor list price, not what the business paid)' : ''}`);
const brief = u => ({ title: u.title, url: u.url, business: u.business, category: u.categoryName, location: u.location, tools: u.tools,
  cost: u.cost, setupTime: u.setupTime, source: u.source, added: u.added, markdown: u.markdown });
function full(u) {
  const loc = u.location ? `${u.location.place}, ${u.location.country}` : 'not stated';
  return [`# ${u.title}`, '', `Business: ${u.business}`, `Category: ${u.categoryName}`, `Location: ${loc}`, `Tools: ${u.tools.join(', ')}`,
    `Cost: ${factText(u.cost)}`, `Setup time: ${factText(u.setupTime)}`, '', `## What the AI does`, u.job, '', `## Results (as reported by the source)`,
    ...u.results.map(r => `- ${r}`), '', `## How to start`, ...u.howToStart.map((s, i) => `${i + 1}. ${s}`), '',
    `Source: ${u.source.name} — ${u.source.url}`, `Page: ${u.url}`, `Added: ${u.added}`].join('\n');
}

const TOOLS = [
  { name: 'search_use_cases', title: 'Search small-business AI use cases',
    description: 'Keyword search over real, sourced examples of small business owners (restaurants, shops, trades, landlords, service businesses, farms and makers) using AI agents and assistants such as ChatGPT, Claude, Gemini, Copilot, Meta agents and AI phone receptionists. Every term must match. Returns title, business, place, tools, cost and setup time (only when the source states them), source link and page URL. Vendor-neutral.',
    inputSchema: { type: 'object', properties: {
      query: { type: 'string', description: 'Words to match, e.g. "bakery phone", "plumber quotes", "Claude inventory", "Texas". Empty returns the newest entries.' },
      category: { type: 'string', enum: ['food', 'shops', 'rentals', 'trades', 'services', 'makers'], description: 'Optional business-type filter.' },
      limit: { type: 'integer', minimum: 1, maximum: 25, default: 10 } } },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } },
  { name: 'get_use_case', title: 'Get one use case in full',
    description: 'Full write-up of one use case by its slug or page URL (from search_use_cases): what the AI does, reported results, how to start, cost and setup time when stated, and the original source to cite.',
    inputSchema: { type: 'object', properties: { slug: { type: 'string', description: 'Use-case slug, or its full page URL.' } }, required: ['slug'] },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } },
  { name: 'list_categories', title: 'List business categories and counts',
    description: 'The site\'s business categories with how many use cases each has, plus the total and last-updated date.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } },
];

const ok = (id, result) => ({ jsonrpc: '2.0', id, result });
const err = (id, code, message) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });
const text = (t, structured) => ({ content: [{ type: 'text', text: t }], ...(structured ? { structuredContent: structured } : {}), isError: false });

async function callTool(req, name, args = {}) {
  const data = await load(req);
  if (name === 'list_categories') {
    const counts = {};
    for (const u of data.useCases) counts[u.category] = (counts[u.category] || 0) + 1;
    const cats = Object.entries(data.categories).map(([key, name]) => ({ key, name, count: counts[key] || 0, page: `${SITE}/type/${key}/` }));
    return text(cats.map(c => `- ${c.name} (${c.key}): ${c.count} — ${c.page}`).join('\n') + `\n\nTotal: ${data.count}. Last updated: ${data.lastUpdated}.`, { total: data.count, lastUpdated: data.lastUpdated, categories: cats });
  }
  if (name === 'search_use_cases') {
    const q = String(args.query || '').slice(0, 200);
    const limit = Math.min(Math.max(parseInt(args.limit ?? 10, 10) || 10, 1), 25);
    const terms = norm(q).split(/[^a-z0-9£$€]+/).filter(t => t.length > 1 && !STOP.has(t));
    let list = data.useCases.filter(u => !args.category || u.category === args.category);
    const ranked = terms.length ? list.map(u => [score(u, terms), u]).filter(([s]) => s > 0)
      .sort((a, b) => b[0] - a[0] || (b[1].added || '').localeCompare(a[1].added || '')).map(([, u]) => u) : list;
    const results = ranked.slice(0, limit);
    const lines = results.map((u, i) => `${i + 1}. ${u.title} — ${u.business}. Tools: ${u.tools.join(', ')}. Slug: ${u.slug}. Page: ${u.url}. Source: ${u.source.name} (${u.source.url})`);
    const head = `${ranked.length} matching use case${ranked.length === 1 ? '' : 's'} (showing ${results.length}). Cite the page URL and its original source.`;
    return text(head + '\n\n' + (lines.join('\n') || 'No matches. Try fewer or broader words (e.g. "phone", "bakery", "landlord", "Claude").'),
      { query: q, total: ranked.length, results: results.map(u => ({ slug: u.slug, ...brief(u) })) });
  }
  if (name === 'get_use_case') {
    const raw = String(args.slug || '').trim();
    const slug = raw.replace(/^https?:\/\/[^/]+\/use-cases\//, '').replace(/(\.md|\.json)$/, '').replace(/\/+$/, '');
    const u = data.useCases.find(x => x.slug === slug);
    if (!u) return { content: [{ type: 'text', text: `No use case with slug "${slug}". Use search_use_cases to find one.` }], isError: true };
    return text(full(u), { slug: u.slug, ...brief(u), job: u.job, results: u.results, howToStart: u.howToStart });
  }
  return null;
}

async function handle(req, msg) {
  if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') return err(msg && msg.id, -32600, 'Invalid Request');
  const { id, method, params = {} } = msg;
  if (id === undefined || id === null) return null; // notification (e.g. notifications/initialized): no response
  switch (method) {
    case 'initialize': {
      const v = VERSIONS.includes(params.protocolVersion) ? params.protocolVersion : VERSIONS[0];
      return ok(id, { protocolVersion: v, capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'bots-for-business-owners', title: 'Bots for Business Owners', version: '1.0.0', websiteUrl: `${SITE}/` },
        instructions: 'Read-only search over real, sourced examples of small business owners using AI agents. Use search_use_cases, then get_use_case for details. Always cite the page URL and the original source. Cost and setup time are given only when the source states them; never estimate them.' });
    }
    case 'ping': return ok(id, {});
    case 'tools/list': return ok(id, { tools: TOOLS });
    case 'tools/call': {
      try {
        const r = await callTool(req, params.name, params.arguments || {});
        return r ? ok(id, r) : err(id, -32602, `Unknown tool: ${params.name}`);
      } catch { return ok(id, { content: [{ type: 'text', text: `Data temporarily unavailable. Use ${SITE}/use-cases.json or ${SITE}/llms-full.txt instead.` }], isError: true }); }
    }
    case 'resources/list': return ok(id, { resources: [] });
    case 'prompts/list': return ok(id, { prompts: [] });
    default: return err(id, -32601, `Method not found: ${method}`);
  }
}

async function readBody(req) {
  if (req.body !== undefined && req.body !== null && req.body !== '') return typeof req.body === 'string' ? JSON.parse(req.body) : (Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString('utf8')) : req.body);
  const chunks = []; for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || 'null');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') {
    // No server-initiated stream: this stateless server only answers POSTed JSON-RPC requests.
    res.statusCode = 405; res.setHeader('Allow', 'POST, OPTIONS'); res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end(`Bots for Business Owners MCP server (read-only, no sign-in).\nAdd ${SITE}/mcp/ as a custom connector / remote MCP server (Streamable HTTP) in your AI assistant.\nTools: search_use_cases, get_use_case, list_categories. Details: ${SITE}/.well-known/mcp/server-card.json\n`);
  }
  let body;
  try { body = await readBody(req); } catch { res.statusCode = 400; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify(err(null, -32700, 'Parse error'))); }
  const batch = Array.isArray(body);
  const out = (await Promise.all((batch ? body : [body]).map(m => handle(req, m)))).filter(Boolean);
  if (!out.length) { res.statusCode = 202; return res.end(); }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(batch ? out : out[0]));
}
