// Vercel Routing Middleware: Markdown content negotiation for AI agents.
// A request whose Accept header asks for text/markdown gets the page's clean Markdown copy
// (the same file that is always published at the matching .md URL) at the normal page address.
// Browsers and everything else get the HTML page unchanged. Read-only; no logging, no cookies.
export const config = {
  matcher: [
    '/',
    '/(use-cases|type|tools|jobs|places|sources|archive|compare)/:key/',
    '/(archive|compare|costs|glossary|jobs|places|questions|recent|sources|tools|what-went-wrong|human-in-the-loop|independent|time-saved)/',
    '/type/:key/:job/',
    '/tools/:key/:type/',
  ],
};

const HUB = /^\/(archive|compare|costs|glossary|jobs|places|questions|recent|sources|tools|what-went-wrong|human-in-the-loop|independent|time-saved)\/$/;
const DETAIL = /^\/(use-cases|type|tools|jobs|places|sources|archive|compare)\/[a-z0-9-]+\/$/;
const COMBO = /^\/(type|tools)\/[a-z0-9-]+\/[a-z0-9-]+\/$/;

export default function middleware(request) {
  const accept = request.headers.get('accept') || '';
  if (!/\btext\/markdown\b/i.test(accept)) return;
  const url = new URL(request.url);
  const p = url.pathname;
  let dest = null;
  if (p === '/') dest = '/llms.txt';
  else if (HUB.test(p) || DETAIL.test(p) || COMBO.test(p)) dest = p.slice(0, -1) + '.md';
  if (!dest) return;
  return new Response(null, {
    headers: { 'x-middleware-rewrite': new URL(dest, url).toString(), Vary: 'Accept' },
  });
}
