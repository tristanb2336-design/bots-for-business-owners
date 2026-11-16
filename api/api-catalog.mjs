// RFC 9727 API catalog (served at /.well-known/api-catalog via a rewrite in vercel.json) so agents can discover the search API's OpenAPI description.
const SITE = 'https://bots-for-business-owners.vercel.app';
const body = JSON.stringify({ linkset: [{
  anchor: `${SITE}/api/search/`,
  'service-desc': [{ href: `${SITE}/openapi.json`, type: 'application/vnd.oai.openapi+json' }],
  'service-doc': [{ href: `${SITE}/about/`, type: 'text/html' }, { href: `${SITE}/llms.txt`, type: 'text/plain' }],
  alternate: [{ href: `${SITE}/opensearch.xml`, type: 'application/opensearchdescription+xml' }],
}] }, null, 2) + '\n';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.statusCode = 405; res.setHeader('Allow', 'GET, HEAD'); return res.end('Use GET.'); }
  res.setHeader('Content-Type', 'application/linkset+json; charset=utf-8');
  res.setHeader('Link', `<${SITE}/.well-known/api-catalog>; rel="api-catalog"`);
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400');
  res.end(req.method === 'HEAD' ? undefined : body);
}
