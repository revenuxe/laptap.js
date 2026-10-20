// Run against a local Next server: node tests/site-audit.cjs http://localhost:3104
const fs = require('node:fs');
const path = require('node:path');
const base = process.argv[2] || 'http://localhost:3104';
const origin = 'https://www.laptap.in';
const failures = [];
const warnings = [];
const results = [];
const links = new Set();
const images = new Set();
const decode = value => value.replace(/&amp;/g, '&');
const fetchPage = async route => {
  const response = await fetch(base + route, { signal: AbortSignal.timeout(35000) });
  return { response, text: await response.text() };
};

(async () => {
  const { response: sitemapResponse, text: sitemap } = await fetchPage('/sitemap.xml');
  if (!sitemapResponse.ok) throw Error(`Sitemap returned ${sitemapResponse.status}`);
  const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(decode(match[1])).pathname);
  if (routes.length !== new Set(routes).size) failures.push('Duplicate sitemap URLs');
  const { text: robots } = await fetchPage('/robots.txt');
  if (!robots.includes('Disallow: /admin') || robots.includes('User-Agent: Googlebot')) failures.push('Private crawler exclusions are inconsistent');
  const titles = new Map();
  const descriptions = new Map();
  for (const route of routes) {
    try {
      const { response, text } = await fetchPage(route);
      if (response.status !== 200) { failures.push(`${route}: HTTP ${response.status}`); continue; }
      const title = text.match(/<title>(.*?)<\/title>/s)?.[1];
      const description = text.match(/<meta name="description" content="([^"]*)"/)?.[1];
      const canonical = text.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
      const h1s = [...text.matchAll(/<h1\b/g)].length;
      if (!title) failures.push(`${route}: missing title`);
      if (!description) failures.push(`${route}: missing description`);
      if (h1s !== 1) failures.push(`${route}: ${h1s} h1 headings`);
      if (canonical?.replace(/\/$/, '') !== (origin + route).replace(/\/$/, '')) failures.push(`${route}: unexpected canonical ${canonical}`);
      if ((title?.match(/Laptap/g) || []).length > 1) failures.push(`${route}: repeated brand in title`);
      if (title && titles.has(title)) warnings.push(`${route}: title also used on ${titles.get(title)}`);
      if (description && descriptions.has(description)) warnings.push(`${route}: description also used on ${descriptions.get(description)}`);
      titles.set(title, route); descriptions.set(description, route);
      for (const match of text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        try { JSON.parse(match[1]); } catch { failures.push(`${route}: invalid JSON-LD`); }
      }
      for (const match of text.matchAll(/\bhref="([^"]*)"/g)) {
        const href = decode(match[1]);
        if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/_next/') && !href.includes('#')) links.add(href.split('?')[0]);
      }
      for (const match of text.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
        if (match[1].startsWith('/assets/')) images.add(match[1]);
      }
      if (!text.includes('id="main-content"')) failures.push(`${route}: skip-link target is missing`);
      results.push({ route, title, h1s, canonical });
      console.log(`PASS ${route}`);
    } catch (error) { failures.push(`${route}: ${error.message}`); }
  }
  for (const image of images) if (!fs.existsSync(path.join('public', image))) failures.push(`Missing asset ${image}`);
  for (const route of links) {
    if (routes.includes(route) || route.startsWith('/assets/') || route.startsWith('/sell/') || route === '/opengraph-image' || route === '/favicon.ico') continue;
    try { const { response } = await fetchPage(route); if (response.status >= 400) failures.push(`Broken internal link ${route}: ${response.status}`); }
    catch (error) { failures.push(`Internal link ${route}: ${error.message}`); }
  }
  const preview = await fetch(base + '/opengraph-image', { signal: AbortSignal.timeout(20000) });
  if (!preview.ok || !preview.headers.get('content-type')?.startsWith('image/')) failures.push('Social preview did not return an image');
  const summary = { pages: results.length, internalLinks: links.size, localImages: images.size, failures, warnings, results };
  fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync('docs/site-audit-results.json', JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify({ pages: results.length, internalLinks: links.size, failures, warnings }, null, 2));
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
