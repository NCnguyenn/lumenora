/**
 * Aesop analysis via chrome-devtools-mcp (headed, persistent profile).
 * Attempts Cloudflare challenge interaction, then deep design probes.
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;
const SCREENSHOTS = join(OUT, 'screenshots');
const PROFILE = join(homedir(), '.cache', 'chrome-devtools-mcp-aesop-profile');
if (!existsSync(SCREENSHOTS)) mkdirSync(SCREENSHOTS, { recursive: true });
if (!existsSync(PROFILE)) mkdirSync(PROFILE, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function extractText(result) {
  if (!result?.content) return '';
  return result.content
    .map((c) => {
      if (c.type === 'text') return c.text;
      if (c.type === 'image') return `[image mime=${c.mimeType} bytes=${Buffer.from(c.data || '', 'base64').length}]`;
      return JSON.stringify(c).slice(0, 200);
    })
    .join('\n');
}

function parseJsonFromScript(text) {
  if (!text) return null;
  // Prefer fenced json
  const fence = text.match(/```json\s*([\s\S]*?)```/);
  if (fence) {
    try { return JSON.parse(fence[1]); } catch {}
  }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }
  return null;
}

function saveScreenshot(result, filename) {
  if (!result?.content) return null;
  for (const c of result.content) {
    if (c.type === 'image' && c.data) {
      const path = join(SCREENSHOTS, filename);
      writeFileSync(path, Buffer.from(c.data, 'base64'));
      return path;
    }
  }
  return null;
}

async function callTool(client, name, args = {}) {
  return client.callTool({ name, arguments: args });
}

async function evalScript(client, fn) {
  const r = await callTool(client, 'evaluate_script', { function: fn });
  return extractText(r);
}

async function waitForRealSite(client, maxMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const titleUrl = await evalScript(client, `() => ({ title: document.title, url: location.href, body: (document.body?.innerText||'').slice(0,200) })`);
    const data = parseJsonFromScript(titleUrl) || {};
    console.log('  wait check:', data.title, data.url?.slice(0, 60));
    if (
      data.title &&
      !/just a moment/i.test(data.title) &&
      !/checking your browser/i.test(data.title) &&
      !/security verification/i.test(data.body || '')
    ) {
      return true;
    }
    // try click turnstile / human checkbox
    try {
      const snap = extractText(await callTool(client, 'take_snapshot', {}));
      writeFileSync(join(OUT, 'challenge-snap.txt'), snap);
      // look for checkbox uid
      const m = snap.match(/uid=(\w+)\s+checkbox[^\n]*Verify you are human/i)
        || snap.match(/uid=(\w+)\s+checkbox/);
      if (m) {
        console.log('  clicking checkbox', m[1]);
        await callTool(client, 'click', { uid: m[1] });
        await sleep(5000);
      }
    } catch (e) {
      console.log('  click attempt:', e.message);
    }
    await sleep(3000);
  }
  return false;
}

const DESIGN_PROBE = `() => {
  const styles = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      className: (el.className && String(el.className).slice(0, 140)) || null,
      text: (el.innerText || '').trim().replace(/\\s+/g,' ').slice(0, 100),
      w: Math.round(r.width), h: Math.round(r.height),
      fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing,
      color: cs.color, backgroundColor: cs.backgroundColor,
      borderTop: cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor,
      padding: cs.padding, margin: cs.margin, display: cs.display, gap: cs.gap,
      maxWidth: cs.maxWidth, textTransform: cs.textTransform,
      boxShadow: cs.boxShadow, borderRadius: cs.borderRadius,
    };
  };
  const sampleColors = () => {
    const els = Array.from(document.querySelectorAll('body, header, nav, main, footer, a, button, h1, h2, h3, p, li, section, div')).slice(0, 120);
    const counts = {};
    for (const el of els) {
      const cs = getComputedStyle(el);
      for (const k of ['color', 'backgroundColor', 'borderTopColor']) {
        const v = cs[k];
        if (!v || v === 'rgba(0, 0, 0, 0)' || v === 'transparent') continue;
        counts[v] = (counts[v] || 0) + 1;
      }
    }
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0, 30).map(([c,n])=>({color:c,count:n}));
  };
  const byTag = {};
  for (const sel of ['h1','h2','h3','h4','p','a','button','label','li','small','nav','header','footer']) {
    const el = document.querySelector(sel);
    if (el) byTag[sel] = styles(el);
  }
  const largeText = Array.from(document.querySelectorAll('h1,h2,h3,[class*="hero"],[class*="display"],[class*="title"],[class*="headline"]'))
    .map(styles).filter(Boolean).sort((a,b)=>parseFloat(b.fontSize)-parseFloat(a.fontSize)).slice(0, 10);
  const containers = Array.from(document.querySelectorAll('main, header, footer, section, [class*="container"], [class*="wrapper"], [class*="grid"], [class*="layout"]'))
    .slice(0, 25).map(el => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        className: String(el.className||'').slice(0,120),
        w: Math.round(r.width), maxWidth: cs.maxWidth, padding: cs.padding, margin: cs.margin,
        display: cs.display, gridTemplateColumns: cs.gridTemplateColumns, gap: cs.gap,
        justifyContent: cs.justifyContent, alignItems: cs.alignItems,
      };
    });
  const navLinks = Array.from(document.querySelectorAll('header a, nav a, [role="navigation"] a')).slice(0, 50)
    .map(a => ({ text: (a.innerText||a.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,80), href: a.href }));
  const buttons = Array.from(document.querySelectorAll('button, a[class*="button"], [class*="btn"], [role="button"]')).slice(0, 20).map(styles);
  const forms = Array.from(document.querySelectorAll('input, select, textarea, form')).slice(0, 20)
    .map(el => ({ ...styles(el), type: el.type||null, name: el.name||null, placeholder: el.placeholder||null }));
  const images = Array.from(document.querySelectorAll('img')).slice(0, 20).map(img => ({
    alt: img.alt || null, nw: img.naturalWidth, nh: img.naturalHeight, loading: img.loading || null,
    src: (img.currentSrc || img.src || '').split('?')[0].replace(/^https?:\\/\\/[^/]+/, ''),
  }));
  const productish = Array.from(document.querySelectorAll('a, article, li, [class*="product"], [class*="card"]'))
    .filter(el => el.querySelector?.('img') && /\\$|HK\\$|USD|add to|cart|ml|size/i.test(el.innerText||''))
    .slice(0, 8)
    .map(el => ({ text: (el.innerText||'').trim().replace(/\\s+/g,' ').slice(0,220), style: styles(el) }));
  const fonts = [];
  try { for (const f of document.fonts) fonts.push({ family: f.family, weight: f.weight, style: f.style, status: f.status }); } catch {}
  const rootVars = {};
  try {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules || []) {
          if (rule.selectorText === ':root' || rule.selectorText === 'html' || rule.selectorText === ':root, :host') {
            const vars = [...String(rule.cssText).matchAll(/--([\\w-]+)\\s*:\\s*([^;]+)/g)].slice(0, 80);
            for (const [,k,v] of vars) rootVars[k] = v.trim();
          }
        }
      } catch {}
    }
  } catch {}
  return {
    title: document.title,
    url: location.href,
    lang: document.documentElement.lang,
    colors: sampleColors(),
    typography: { byTag, largeText },
    layout: { viewport: { w: innerWidth, h: innerHeight, dpr: devicePixelRatio }, scrollHeight: document.documentElement.scrollHeight, containers, body: styles(document.body) },
    nav: { links: navLinks, header: styles(document.querySelector('header,[role="banner"]')) },
    buttons, forms, images, productish,
    fonts: fonts.slice(0, 50),
    rootVars,
    meta: {
      description: document.querySelector('meta[name="description"]')?.content || null,
      themeColor: document.querySelector('meta[name="theme-color"]')?.content || null,
      ogImage: document.querySelector('meta[property="og:image"]')?.content || null,
    },
  };
}`;

async function main() {
  const transport = new StdioClientTransport({
    command: 'npx',
    args: [
      '-y', 'chrome-devtools-mcp@latest',
      '--headless=false',
      `--userDataDir=${PROFILE}`,
      '--viewport=1440x900',
      '--no-usage-statistics',
      '--acceptInsecureCerts',
      '--chromeArg=--disable-blink-features=AutomationControlled',
      '--chromeArg=--disable-features=IsolateOrigins,site-per-process',
    ],
  });

  const client = new Client({ name: 'aesop-analyzer-v2', version: '1.0.0' });
  await client.connect(transport);
  console.log('Connected. Tools OK.');

  const report = { analyzedAt: new Date().toISOString(), pages: {}, notes: [], cloudflare: {} };

  async function navigateAndPass(url, label) {
    console.log(`\n>>> Navigate ${label}: ${url}`);
    await callTool(client, 'navigate_page', { url, timeout: 90000 });
    await sleep(4000);
    const ok = await waitForRealSite(client, 75000);
    report.cloudflare[label] = ok ? 'passed_or_real_site' : 'still_challenged';
    console.log('  site ready:', ok);
    // cookie accept
    try {
      const snap = extractText(await callTool(client, 'take_snapshot', {}));
      const accept = snap.match(/uid=(\w+)\s+(?:button|link)[^\n]*(?:Accept|Agree|Allow all|Got it)/i);
      if (accept) {
        await callTool(client, 'click', { uid: accept[1] });
        await sleep(1500);
      }
    } catch {}
    return ok;
  }

  async function analyzePage(key, url) {
    const page = { url, viewports: {} };
    const ready = await navigateAndPass(url, key);
    page.ready = ready;

    // discover better links on homepage
    if (key === 'homepage' && ready) {
      const disc = parseJsonFromScript(await evalScript(client, `() => {
        const all = Array.from(document.querySelectorAll('a[href]')).map(a => ({
          text: (a.innerText||a.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,80),
          href: a.href
        })).filter(x => x.href && /aesop\\.com/i.test(x.href));
        const pick = (reText, reHref) => all.find(x => reText.test(x.text) || (reHref && reHref.test(x.href)));
        return {
          shop: pick(/skin|body|hair|shop|products|kits/i, /\\/c\\//) || pick(/./, /\\/c\\//),
          product: pick(/./, /\\/p\\//),
          cart: pick(/cart|bag|basket/i, /cart|bag/i),
          blog: pick(/read|journal|stories|editorial|magazine/i, /journal|stories|editorial|r\\//),
          sample: all.slice(0, 50),
        };
      }`));
      page.discovery = disc;
      writeFileSync(join(OUT, 'discovery-v2.json'), JSON.stringify(disc, null, 2));
      console.log('  discovery', JSON.stringify(disc?.shop), JSON.stringify(disc?.product));
    }

    for (const vp of VIEWPORTS) {
      console.log(`  ${vp.name} ${vp.width}x${vp.height}`);
      await callTool(client, 'resize_page', { width: vp.width, height: vp.height });
      await sleep(2000);
      const vpData = { width: vp.width, height: vp.height };

      try {
        const shot = await callTool(client, 'take_screenshot', { format: 'png', fullPage: false });
        vpData.screenshot = saveScreenshot(shot, `${key}-${vp.name}-v2.png`);
      } catch (e) { vpData.screenshotError = e.message; }

      if (vp.name === 'desktop') {
        try {
          const shot = await callTool(client, 'take_screenshot', { format: 'png', fullPage: true });
          saveScreenshot(shot, `${key}-${vp.name}-full-v2.png`);
        } catch {}
      }

      try {
        const snap = extractText(await callTool(client, 'take_snapshot', {}));
        writeFileSync(join(OUT, `${key}-${vp.name}-a11y-v2.txt`), snap);
        vpData.a11yPreview = snap.slice(0, 6000);
        vpData.isChallenge = /security verification|just a moment|turnstile|verify you are human/i.test(snap);
      } catch (e) { vpData.a11yError = e.message; }

      try {
        const probeText = await evalScript(client, DESIGN_PROBE);
        writeFileSync(join(OUT, `${key}-${vp.name}-probe-v2.txt`), probeText);
        vpData.probe = parseJsonFromScript(probeText);
      } catch (e) { vpData.probeError = e.message; }

      if (vp.name === 'desktop') {
        try {
          const c = extractText(await callTool(client, 'list_console_messages', {}));
          writeFileSync(join(OUT, `${key}-console-v2.txt`), c);
          vpData.console = c.slice(0, 4000);
        } catch {}
        try {
          const n = extractText(await callTool(client, 'list_network_requests', {}));
          writeFileSync(join(OUT, `${key}-network-v2.txt`), n);
          vpData.network = n.slice(0, 6000);
        } catch {}
        try {
          const perf = await evalScript(client, `() => {
            const nav = performance.getEntriesByType('navigation')[0];
            const paints = performance.getEntriesByType('paint');
            const resources = performance.getEntriesByType('resource')
              .map(r => ({ name: r.name.split('?')[0].replace(/^https?:\\/\\/[^/]+/,'').slice(-90), type: r.initiatorType, duration: Math.round(r.duration), size: r.transferSize||0 }))
              .sort((a,b)=>b.duration-a.duration).slice(0, 30);
            return {
              navigation: nav ? { dcl: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd), ttfb: Math.round(nav.responseStart) } : null,
              paints: paints.map(p => ({ name: p.name, t: Math.round(p.startTime) })),
              slowest: resources,
            };
          }`);
          writeFileSync(join(OUT, `${key}-perf-v2.txt`), perf);
          vpData.perf = parseJsonFromScript(perf);
        } catch {}
      }

      page.viewports[vp.name] = {
        ...vpData,
        probe: vpData.probe ? {
          title: vpData.probe.title,
          url: vpData.probe.url,
          colors: vpData.probe.colors,
          typography: vpData.probe.typography,
          layout: {
            viewport: vpData.probe.layout?.viewport,
            scrollHeight: vpData.probe.layout?.scrollHeight,
            containers: vpData.probe.layout?.containers?.slice(0, 12),
            body: vpData.probe.layout?.body,
          },
          nav: vpData.probe.nav,
          buttons: vpData.probe.buttons?.slice(0, 10),
          fonts: vpData.probe.fonts,
          rootVars: vpData.probe.rootVars,
          productish: vpData.probe.productish,
          meta: vpData.probe.meta,
        } : null,
      };
      // strip heavy raw from saved report
      delete page.viewports[vp.name].a11yPreview;
    }

    report.pages[key] = page;
    writeFileSync(join(OUT, 'analysis-report-v2.json'), JSON.stringify(report, null, 2));
    return page;
  }

  // Start with homepage
  const home = await analyzePage('homepage', 'https://www.aesop.com/');

  let shopUrl = home.discovery?.shop?.href || 'https://www.aesop.com/hk/en/c/skin/';
  let productUrl = home.discovery?.product?.href || null;
  let cartUrl = home.discovery?.cart?.href || 'https://www.aesop.com/hk/en/cart/';
  let blogUrl = home.discovery?.blog?.href || 'https://www.aesop.com/hk/en/r/the-aesop-editorial/';

  // try alternate locales if still challenged
  if (report.cloudflare.homepage === 'still_challenged') {
    console.log('Trying US locale...');
    await analyzePage('homepage_us', 'https://www.aesop.com/us/en/');
  }

  const shop = await analyzePage('shop', shopUrl);

  if (!productUrl && shop.ready) {
    const p = parseJsonFromScript(await evalScript(client, `() => {
      const a = Array.from(document.querySelectorAll('a[href]')).find(x => /\\/p\\//.test(x.href));
      return a ? { href: a.href, text: (a.innerText||'').trim().slice(0,80) } : null;
    }`));
    productUrl = p?.href || null;
  }
  if (!productUrl) {
    // try from shop discovery sample
    productUrl = shop.viewports?.desktop?.probe?.nav?.links?.find(l => /\/p\//.test(l.href))?.href
      || 'https://www.aesop.com/hk/en/p/skin/cleanse/amazing-face-cleanser/';
  }

  await analyzePage('product', productUrl);
  await analyzePage('cart', cartUrl);
  await analyzePage('blog', blogUrl);

  writeFileSync(join(OUT, 'analysis-report-v2.json'), JSON.stringify(report, null, 2));
  console.log('\nDONE', JSON.stringify(report.cloudflare, null, 2));
  await client.close();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
