// Contact form: saves submissions to the Resend 'BFBO Contact Inbox' audience (no sending domain needed).
const hits = new Map(); const WINDOW = 10 * 60 * 1000, MAX = 3;
const EMAIL = /^[^\s@<>()"',;:]{1,64}@[A-Za-z0-9.-]{1,253}\.[A-Za-z]{2,24}$/;
const ALLOWED = /^https:\/\/bots-for-business-owners(-[a-z0-9-]+)?\.vercel\.app$/;
const TOPICS = { sponsorship: 'Sponsorship', featured: 'Featured listing', suggest: 'Suggest a use case', other: 'Other' };

function reply(req, res, code, body) {
  const wantsHtml = !(req.headers['content-type'] || '').includes('application/json');
  if (wantsHtml) { // no-JS form post: redirect back with a status flag
    res.statusCode = 303; res.setHeader('Location', `/contact/?status=${body.ok ? 'sent' : 'error'}`); return res.end();
  }
  res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(body));
}
async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = ''; for await (const c of req) { raw += c; if (raw.length > 12000) throw new Error('too large'); }
  return (req.headers['content-type'] || '').includes('application/json') ? JSON.parse(raw || '{}') : Object.fromEntries(new URLSearchParams(raw));
}
const clean = (s, n) => String(s || '').replace(/[\r\n]+/g, ' ').trim().slice(0, n);

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); res.statusCode = 405; res.setHeader('Content-Type','application/json'); return res.end('{"ok":false,"error":"Use POST."}'); }
  const origin = req.headers.origin;
  if (origin && !ALLOWED.test(origin)) return reply(req, res, 403, { ok: false, error: 'Not allowed.' });
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < WINDOW);
  if (list.length >= MAX) return reply(req, res, 429, { ok: false, error: 'Too many messages. Please wait a few minutes.' });
  list.push(now); hits.set(ip, list); if (hits.size > 5000) hits.clear();

  let b; try { b = await readBody(req); } catch { return reply(req, res, 400, { ok: false, error: 'Bad request.' }); }
  if (b.company) return reply(req, res, 200, { ok: true, message: 'Thanks! Your message was sent.' }); // honeypot
  const name = clean(b.name, 100), email = clean(b.email, 254).toLowerCase(), topic = TOPICS[b.topic] ? b.topic : 'other';
  const message = String(b.message || '').trim().slice(0, 5000);
  if (!name) return reply(req, res, 400, { ok: false, error: 'Please enter your name.' });
  if (!EMAIL.test(email)) return reply(req, res, 400, { ok: false, error: 'Please enter a valid email address.' });
  if (message.length < 10) return reply(req, res, 400, { ok: false, error: 'Please write a message (at least 10 characters).' });

  // Store in the Resend "BFBO Contact Inbox" audience. Contacts are global per email in Resend,
  // so we never set `unsubscribed` (that would affect the Hands Free list) and we append to prior messages.
  const key = process.env.RESEND_API_KEY, aud = process.env.CONTACT_AUDIENCE_ID;
  if (!key || !aud) return reply(req, res, 503, { ok: false, error: 'The contact form is temporarily unavailable. Please try again later.' });
  const H = { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
  const at = new Date().toISOString();
  try {
    let r = await fetch(`https://api.resend.com/audiences/${aud}/contacts`, { method: 'POST', headers: H,
      body: JSON.stringify({ email, first_name: name.slice(0, 50) }) });
    if (!r.ok && r.status !== 409) { console.error('contact create', r.status); throw 0; }
    let prev = '';
    const g = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, { headers: H });
    if (g.ok) { const j = await g.json(); prev = j?.properties?.message?.value || ''; }
    const entry = `[${at}] ${TOPICS[topic]}: ${message}`;
    const all = (prev ? entry + '\n---\n' + prev : entry).slice(0, 8000);
    r = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, { method: 'PATCH', headers: H,
      body: JSON.stringify({ properties: { contact_name: name, topic: TOPICS[topic], message: all, submitted_at: at } }) });
    if (!r.ok) { console.error('contact patch', r.status); throw 0; }
  } catch { return reply(req, res, 502, { ok: false, error: "Sorry, your message couldn't be saved right now. Please try again later." }); }

  // Optional notice via Resend's test sender (only delivers to the Resend account owner's address).
  const to = process.env.CONTACT_TO;
  if (to && EMAIL.test(to)) {
    try { await fetch('https://api.resend.com/emails', { method: 'POST', headers: H, body: JSON.stringify({
      from: 'Bots for Business Owners <onboarding@resend.dev>', to: [to], reply_to: email,
      subject: `[BFBO contact] ${TOPICS[topic]} from ${name}`,
      text: `Topic: ${TOPICS[topic]}\nName: ${name}\nEmail: ${email}\nAt: ${at}\n\n${message}` }) }); } catch {}
  }
  return reply(req, res, 200, { ok: true, message: "Thanks! Your message was received. We'll reply by email." });
}
