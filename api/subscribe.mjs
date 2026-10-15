// Hands Free waitlist: adds an email as a contact in the Resend "Hands Free" audience.
const hits = new Map(); // best-effort per-instance rate limit
const WINDOW = 10 * 60 * 1000, MAX = 5;
const EMAIL = /^[^\s@<>()"',;:]{1,64}@[A-Za-z0-9.-]{1,253}\.[A-Za-z]{2,24}$/;
const ALLOWED = /^https:\/\/bots-for-business-owners(-[a-z0-9-]+)?\.vercel\.app$/;

let REQ = null;
const send = (res, code, body) => { if (REQ && REQ.method === 'POST' && !(REQ.headers['content-type'] || '').includes('application/json')) { res.statusCode = 303; res.setHeader('Location', `/newsletter/?status=${body.ok ? 'joined' : 'error'}`); return res.end(); } res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(body)); };

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = ''; for await (const c of req) { raw += c; if (raw.length > 2048) throw new Error('too large'); }
  const ct = req.headers['content-type'] || '';
  if (ct.includes('application/json')) return JSON.parse(raw || '{}');
  return Object.fromEntries(new URLSearchParams(raw));
}

export default async function handler(req, res) {
  REQ = req;
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(res, 405, { ok: false, error: 'Use POST.' }); }
  const origin = req.headers.origin;
  if (origin && !ALLOWED.test(origin)) return send(res, 403, { ok: false, error: 'Not allowed.' });
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < WINDOW);
  if (list.length >= MAX) return send(res, 429, { ok: false, error: 'Too many tries. Please wait a few minutes.' });
  list.push(now); hits.set(ip, list);
  if (hits.size > 5000) hits.clear();

  let body; try { body = await readBody(req); } catch { return send(res, 400, { ok: false, error: 'Bad request.' }); }
  if (body.company) return send(res, 200, { ok: true, message: "You're on the Hands Free waitlist." }); // honeypot: pretend success
  const email = String(body.email || '').trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL.test(email)) return send(res, 400, { ok: false, error: 'Please enter a valid email address.' });

  const key = process.env.RESEND_API_KEY, aud = process.env.RESEND_AUDIENCE_ID;
  if (!key || !aud) return send(res, 500, { ok: false, error: 'Signup is temporarily unavailable.' });
  try {
    const r = await fetch(`https://api.resend.com/audiences/${aud}/contacts`, {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, unsubscribed: false }) });
    if (r.ok) await agentmailNotify(`[BFBO waitlist] New Hands Free signup: ${email}`, `New Hands Free waitlist signup\nEmail: ${email}\nAt: ${new Date().toISOString()}`);
    if (r.ok || r.status === 409) return send(res, 200, { ok: true, message: "You're on the Hands Free waitlist. Thanks!" });
    console.error('resend error', r.status);
    return send(res, 502, { ok: false, error: 'Could not save your email right now. Please try again later.' });
  } catch (e) { console.error('resend fetch failed'); return send(res, 502, { ok: false, error: 'Could not save your email right now. Please try again later.' }); }
}

// Notify the project's AgentMail inbox (sends from the inbox to itself; never to outside addresses).
async function agentmailNotify(subject, text, replyTo) {
  const key = process.env.AGENTMAIL_API_KEY, inbox = process.env.AGENTMAIL_INBOX || 'bots-for-business@agentmail.to';
  if (!key) return false;
  try {
    const r = await fetch(`https://api.agentmail.to/v0/inboxes/${encodeURIComponent(inbox)}/messages/send`, {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: inbox, subject, text, labels: ['bfbo'], ...(replyTo ? { reply_to: replyTo } : {}) }) });
    if (!r.ok) console.error('agentmail', r.status);
    return r.ok;
  } catch (e) { console.error('agentmail', e?.message); return false; }
}
