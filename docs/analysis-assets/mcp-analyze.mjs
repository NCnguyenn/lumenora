/**
 * Drive chrome-devtools-mcp via MCP stdio to analyze aesop.com
 * for UI/UX design research (design principles only).
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;
const SCREENSHOTS = join(OUT, 'screenshots');
if (!existsSync(SCREENSHOTS)) mkdirSync(SCREENSHOTS, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callTool(client, name, args = {}) {
  const result = await client.callTool({ name, arguments: args });
  return result;
}

function extractText(result) {
  if (!result?.content) return '';
  return result.content
    .map((c) => {
      if (c.type === 'text') return c.text;
      if (c.type === 'image') return `[image mime=${c.mimeType} len=${(c.data || '').length}]`;
      return JSON.stringify(c);
    })
    .join('\n');
}

function saveScreenshot(result, filename) {
  if (!result?.content) return false;
  for (const c of result.content) {
    if (c.type === 'image' && c.data) {
      const buf = Buffer.from(c.data, 'base64');
      const path = join(SCREENSHOTS, filename);
      writeFileSync(path, buf);
      return path;
    }
  }
  // Sometimes screenshot is written to file path in text
  const text = extractText(result);
  const m = text.match(/(?:saved|written|path)[:\s]+([^\s]+\.(?:png|jpg|jpeg|webp))/i);
  if (m) return m[1];
  writeFileSync(join(OUT, filename.replace('.png', '.txt')), text.slice(0, 2000));
  return null;
}

async function evaluate(client, fnBody) {
  // chrome-devtools-mcp uses evaluate_script
  try {
    const r = await callTool(client, 'evaluate_script', {
      function: fnBody,
    });
    return extractText(r);
  } catch (e) {
    try {
      const r = await callTool(client, 'evaluate_script', {
        expression: `(${fnBody})()`,
      });
      return extractText(r);
    } catch (e2) {
      return `EVAL_ERROR: ${e.message} | ${e2.message}`;
    }
  }
}

const DESIGN_PROBE = `() => {
  const pick = (sel) => document.querySelector(sel);
  const styles = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      className: (el.className && String(el.className).slice(0, 120)) || null,
      text: (el.innerText || '').trim().slice(0, 80),
      width: Math.round(r.width),
      height: Math.round(r.height),
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      borderTop: cs.borderTop,
      borderColor: cs.borderColor,
      padding: cs.padding,
      margin: cs.margin,
      display: cs.display,
      gap: cs.gap,
      maxWidth: cs.maxWidth,
      textTransform: cs.textTransform,
      textDecoration: cs.textDecoration,
    };
  };

  const sampleColors = () => {
    const els = Array.from(document.querySelectorAll('body, header, nav, main, footer, a, button, h1, h2, h3, p, li, [class*="card"], [class*="product"]')).slice(0, 80);
    const counts = {};
    for (const el of els) {
      const cs = getComputedStyle(el);
      for (const k of ['color', 'backgroundColor', 'borderTopColor']) {
        const v = cs[k];
        if (!v || v === 'rgba(0, 0, 0, 0)' || v === 'transparent') continue;
        counts[v] = (counts[v] || 0) + 1;
      }
    }
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0, 25).map(([c,n])=>({color:c,count:n}));
  };

  const typography = () => {
    const map = {};
    for (const sel of ['h1','h2','h3','h4','h5','h6','p','a','button','label','li','small','span']) {
      const el = document.querySelector(sel);
      if (el) map[sel] = styles(el);
    }
    // hero-like large text
    const big = Array.from(document.querySelectorAll('h1,h2,[class*="hero"],[class*="display"],[class*="title"]'))
      .map(styles)
      .filter(Boolean)
      .sort((a,b)=>parseFloat(b.fontSize)-parseFloat(a.fontSize))
      .slice(0, 8);
    return { byTag: map, largeText: big };
  };

  const layout = () => {
    const containers = Array.from(document.querySelectorAll('main, [class*="container"], [class*="wrapper"], [class*="layout"], header, footer, section'))
      .slice(0, 20)
      .map(el => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          className: String(el.className||'').slice(0,100),
          width: Math.round(r.width),
          maxWidth: cs.maxWidth,
          padding: cs.padding,
          margin: cs.margin,
          display: cs.display,
          gridTemplateColumns: cs.gridTemplateColumns,
          gap: cs.gap,
        };
      });
    return {
      viewport: { w: innerWidth, h: innerHeight, dpr: devicePixelRatio },
      scrollHeight: document.documentElement.scrollHeight,
      containers,
      body: styles(document.body),
    };
  };

  const nav = () => {
    const links = Array.from(document.querySelectorAll('header a, nav a, [role="navigation"] a'))
      .slice(0, 40)
      .map(a => ({ text: (a.innerText||a.getAttribute('aria-label')||'').trim().slice(0,60), href: a.href }));
    return { links, header: styles(document.querySelector('header') || document.querySelector('[role="banner"]')) };
  };

  const buttons = () => Array.from(document.querySelectorAll('button, a[class*="button"], [role="button"], input[type="submit"]'))
    .slice(0, 15)
    .map(styles);

  const forms = () => Array.from(document.querySelectorAll('form, input, select, textarea'))
    .slice(0, 20)
    .map(el => ({ ...styles(el), type: el.type || null, name: el.name || null, placeholder: el.placeholder || null }));

  const images = () => Array.from(document.querySelectorAll('img')).slice(0, 15).map(img => ({
    alt: img.alt || null,
    width: img.naturalWidth || img.width,
    height: img.naturalHeight || img.height,
    loading: img.loading || null,
    src: (img.currentSrc || img.src || '').split('?')[0].slice(-80),
  }));

  const productCards = () => {
    const candidates = Array.from(document.querySelectorAll('[class*="product"], [data-testid*="product"], article, li'))
      .filter(el => {
        const t = (el.innerText||'').toLowerCase();
        return el.querySelector('img') && (t.includes('$') || t.includes('add') || /\\d/.test(t));
      })
      .slice(0, 6);
    return candidates.map(el => ({
      text: (el.innerText||'').trim().slice(0, 200),
      style: styles(el),
      hasButton: !!el.querySelector('button, a[class*="button"]'),
    }));
  };

  return {
    title: document.title,
    url: location.href,
    lang: document.documentElement.lang,
    colors: sampleColors(),
    typography: typography(),
    layout: layout(),
    nav: nav(),
    buttons: buttons(),
    forms: forms(),
    images: images(),
    productCards: productCards(),
    meta: {
      description: document.querySelector('meta[name="description"]')?.content || null,
      themeColor: document.querySelector('meta[name="theme-color"]')?.content || null,
    },
  };
}`;

async function listTools(client) {
  const tools = await client.listTools();
  return tools.tools.map((t) => t.name);
}

async function main() {
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['-y', 'chrome-devtools-mcp@latest', '--headless=true', '--isolated=true', '--viewport=1440x900'],
  });

  const client = new Client({ name: 'aesop-analyzer', version: '1.0.0' });
  await client.connect(transport);

  const toolNames = await listTools(client);
  writeFileSync(join(OUT, 'tools.json'), JSON.stringify(toolNames, null, 2));
  console.log('Tools:', toolNames.join(', '));

  const report = {
    analyzedAt: new Date().toISOString(),
    tools: toolNames,
    pages: {},
    notes: [],
  };

  // Discover tool name variants
  const has = (n) => toolNames.includes(n);
  const navigate = async (url) => {
    if (has('navigate_page')) return callTool(client, 'navigate_page', { url, timeout: 60000 });
    if (has('new_page')) {
      await callTool(client, 'new_page', { url });
      return;
    }
    throw new Error('No navigate tool');
  };
  const resize = async (w, h) => {
    if (has('resize_page')) return callTool(client, 'resize_page', { width: w, height: h });
    if (has('emulate')) return callTool(client, 'emulate', { width: w, height: h });
    return null;
  };
  const screenshot = async (fullPage = true) => {
    if (has('take_screenshot')) return callTool(client, 'take_screenshot', { format: 'png', fullPage });
    throw new Error('No screenshot tool');
  };
  const snapshot = async () => {
    if (has('take_snapshot')) return callTool(client, 'take_snapshot', {});
    throw new Error('No snapshot tool');
  };
  const consoleMsgs = async () => {
    if (has('list_console_messages')) return callTool(client, 'list_console_messages', {});
    return null;
  };
  const network = async () => {
    if (has('list_network_requests')) return callTool(client, 'list_network_requests', {});
    return null;
  };

  // Homepage first
  console.log('Navigating homepage...');
  await navigate('https://www.aesop.com/');
  await sleep(4000);

  // Handle cookie banners if present
  try {
    await callTool(client, 'evaluate_script', {
      function: `() => {
        const labels = ['Accept', 'Accept all', 'Agree', 'OK', 'Got it', 'Allow all', 'I agree'];
        const buttons = Array.from(document.querySelectorAll('button, a, [role="button"]'));
        for (const b of buttons) {
          const t = (b.innerText || b.getAttribute('aria-label') || '').trim();
          if (labels.some(l => t.toLowerCase() === l.toLowerCase() || t.toLowerCase().includes('accept all'))) {
            b.click();
            return 'clicked:' + t;
          }
        }
        return 'no-banner';
      }`,
    });
    await sleep(1500);
  } catch (_) {}

  const pageUrls = {
    homepage: 'https://www.aesop.com/',
  };

  // Discover shop / product / cart / blog links from homepage
  const linkDiscovery = await evaluate(client, `() => {
    const abs = (h) => { try { return new URL(h, location.href).href; } catch { return null; } };
    const all = Array.from(document.querySelectorAll('a[href]')).map(a => ({
      text: (a.innerText||a.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,80),
      href: abs(a.href),
    })).filter(x => x.href && x.href.includes('aesop.com'));

    const find = (preds) => {
      for (const p of preds) {
        const hit = all.find(p);
        if (hit) return hit;
      }
      return null;
    };

    const shop = find([
      x => /shop|products|skincare|body|hair|kits/i.test(x.text) && /\\/(uk|us|hk|au|eu|c\\/|r\\/|shop)/i.test(x.href),
      x => /category|collections|skincare/i.test(x.href),
      x => /shop all|view all|explore/i.test(x.text),
    ]);
    const product = find([
      x => /\\/p\\//i.test(x.href) || /product/i.test(x.href),
      x => /\\/products\\//i.test(x.href),
    ]);
    const cart = find([
      x => /cart|bag|basket/i.test(x.text),
      x => /cart|bag/i.test(x.href),
    ]);
    const blog = find([
      x => /read|journal|stories|editorial|magazine|article|blog/i.test(x.text),
      x => /journal|stories|article|magazine|read/i.test(x.href),
    ]);

    // sample unique path prefixes
    const paths = [...new Set(all.map(a => {
      try { return new URL(a.href).pathname; } catch { return null; }
    }).filter(Boolean))].slice(0, 60);

    return { shop, product, cart, blog, sampleLinks: all.slice(0, 40), paths };
  }`);

  writeFileSync(join(OUT, 'link-discovery.json'), linkDiscovery);
  console.log('Link discovery:', linkDiscovery.slice(0, 500));

  let discovered = {};
  try {
    // evaluate_script may wrap result
    const parsed = JSON.parse(linkDiscovery.replace(/^[^{]*/, '').replace(/[^}]*$/, '') || linkDiscovery);
    discovered = parsed;
  } catch {
    // try extract JSON object
    const m = linkDiscovery.match(/\{[\s\S]*\}/);
    if (m) {
      try { discovered = JSON.parse(m[0]); } catch { report.notes.push('link discovery parse failed'); }
    }
  }

  // Better parse: chrome-devtools often returns "Script ran... result: {...}"
  try {
    const m = linkDiscovery.match(/"result"\s*:\s*(\{[\s\S]*\})\s*\}?\s*$/);
    if (m) discovered = JSON.parse(m[1]);
    else {
      const m2 = linkDiscovery.match(/\{"shop"[\s\S]*\}/);
      if (m2) discovered = JSON.parse(m2[0]);
    }
  } catch (e) {
    report.notes.push('discovery parse: ' + e.message);
  }

  // Fallback URLs commonly used by Aesop (region may redirect)
  if (discovered?.shop?.href) pageUrls.shop = discovered.shop.href;
  if (discovered?.product?.href) pageUrls.product = discovered.product.href;
  if (discovered?.cart?.href) pageUrls.cart = discovered.cart.href;
  if (discovered?.blog?.href) pageUrls.blog = discovered.blog.href;

  // Ensure we have candidates
  if (!pageUrls.shop) pageUrls.shop = 'https://www.aesop.com/hk/en/c/skin/';
  if (!pageUrls.product) pageUrls.product = null; // fill after shop
  if (!pageUrls.cart) pageUrls.cart = 'https://www.aesop.com/hk/en/cart/';
  if (!pageUrls.blog) pageUrls.blog = 'https://www.aesop.com/hk/en/r/the-aesop-editorial/';

  async function analyzePage(pageKey, url) {
    if (!url) {
      report.pages[pageKey] = { skipped: true, reason: 'no url' };
      return;
    }
    console.log(`\n=== ${pageKey}: ${url} ===`);
    const pageData = { url, viewports: {}, finalUrl: null };

    try {
      await navigate(url);
      await sleep(3500);
    } catch (e) {
      pageData.error = e.message;
      report.pages[pageKey] = pageData;
      return;
    }

    // dismiss overlays again
    try {
      await callTool(client, 'evaluate_script', {
        function: `() => {
          const labels = ['Accept', 'Accept all', 'Agree', 'Close', 'No thanks', 'Continue'];
          for (const b of document.querySelectorAll('button, [aria-label]')) {
            const t = (b.innerText || b.getAttribute('aria-label') || '').trim().toLowerCase();
            if (labels.some(l => t === l.toLowerCase() || t.includes('accept'))) { b.click(); return t; }
          }
          // close modal X
          const x = document.querySelector('[aria-label*="Close" i], button[class*="close" i]');
          if (x) { x.click(); return 'close'; }
          return 'none';
        }`,
      });
      await sleep(1000);
    } catch (_) {}

    for (const vp of VIEWPORTS) {
      console.log(`  viewport ${vp.name} ${vp.width}x${vp.height}`);
      await resize(vp.width, vp.height);
      await sleep(1500);

      const vpData = { width: vp.width, height: vp.height };

      // screenshot viewport
      try {
        const shot = await screenshot(false);
        const p = saveScreenshot(shot, `${pageKey}-${vp.name}.png`);
        vpData.screenshot = p;
        if (!p) vpData.screenshotNote = extractText(shot).slice(0, 300);
      } catch (e) {
        vpData.screenshotError = e.message;
      }

      // full page shot only desktop to save time
      if (vp.name === 'desktop') {
        try {
          const shot = await screenshot(true);
          saveScreenshot(shot, `${pageKey}-${vp.name}-full.png`);
        } catch (_) {}
      }

      // a11y snapshot
      try {
        const snap = await snapshot();
        const text = extractText(snap);
        const snapFile = join(OUT, `${pageKey}-${vp.name}-a11y.txt`);
        writeFileSync(snapFile, text);
        vpData.a11yFile = snapFile;
        vpData.a11yPreview = text.slice(0, 4000);
      } catch (e) {
        vpData.a11yError = e.message;
      }

      // design probe
      try {
        const probe = await evaluate(client, DESIGN_PROBE);
        writeFileSync(join(OUT, `${pageKey}-${vp.name}-probe.txt`), probe);
        vpData.probeRaw = probe.slice(0, 15000);
        // try parse
        try {
          const m = probe.match(/\{[\s\S]*"title"[\s\S]*\}/);
          if (m) {
            // find largest JSON
            const start = probe.indexOf('{');
            if (start >= 0) {
              // parse from first { with balanced braces is hard; use eval-ish
              const jsonMatch = probe.match(/Script result:[\s\S]*?(\{[\s\S]*\})\s*$/i)
                || probe.match(/("result"\s*:\s*)(\{[\s\S]*\})/);
            }
          }
          // Prefer structured content
          const resultMatch = probe.match(/"url"\s*:\s*"https?:\/\/[^"]+"/);
          if (resultMatch) {
            const start = probe.lastIndexOf('{', probe.indexOf('"title"') >= 0 ? probe.indexOf('"title"') : 0);
          }
        } catch (_) {}
      } catch (e) {
        vpData.probeError = e.message;
      }

      // console
      try {
        const c = await consoleMsgs();
        if (c) {
          const t = extractText(c);
          vpData.console = t.slice(0, 5000);
          writeFileSync(join(OUT, `${pageKey}-${vp.name}-console.txt`), t);
        }
      } catch (e) {
        vpData.consoleError = e.message;
      }

      // network (desktop only primarily)
      if (vp.name === 'desktop') {
        try {
          const n = await network();
          if (n) {
            const t = extractText(n);
            vpData.network = t.slice(0, 8000);
            writeFileSync(join(OUT, `${pageKey}-network.txt`), t);
          }
        } catch (e) {
          vpData.networkError = e.message;
        }
      }

      pageData.viewports[vp.name] = vpData;
    }

    // final URL
    try {
      const u = await evaluate(client, `() => location.href`);
      pageData.finalUrl = u;
    } catch (_) {}

    report.pages[pageKey] = pageData;

    // From shop, find a product link if missing
    if (pageKey === 'shop' && !pageUrls.product) {
      try {
        const p = await evaluate(client, `() => {
          const a = Array.from(document.querySelectorAll('a[href]')).find(x => /\\/p\\//.test(x.href) || /product/i.test(x.href));
          return a ? a.href : null;
        }`);
        const m = p.match(/https?:\/\/[^\s"']+/);
        if (m) pageUrls.product = m[0];
      } catch (_) {}
    }
  }

  await analyzePage('homepage', pageUrls.homepage);
  await analyzePage('shop', pageUrls.shop);

  // product from shop if needed
  if (!pageUrls.product) {
    try {
      await navigate(pageUrls.shop);
      await sleep(3000);
      const p = await evaluate(client, `() => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        const a = links.find(x => /\\/p\\//.test(x.pathname||x.href) || /\\/products\\//.test(x.href));
        return a ? a.href : (links.find(x => (x.innerText||'').length>3 && x.querySelector('img'))||{}).href || null;
      }`);
      const m = String(p).match(/https?:\/\/[^\s"'\\]+/);
      if (m) pageUrls.product = m[0];
    } catch (_) {}
  }
  if (!pageUrls.product) {
    // try common PDP pattern after region redirect from homepage nav
    pageUrls.product = pageUrls.shop; // fallback; analyze will note
  }

  await analyzePage('product', pageUrls.product);
  await analyzePage('cart', pageUrls.cart);
  await analyzePage('blog', pageUrls.blog);

  // Deep style probe on homepage desktop for fonts loaded
  try {
    await navigate(pageUrls.homepage);
    await resize(1440, 900);
    await sleep(2500);
    const fonts = await evaluate(client, `() => {
      const faces = [];
      try {
        for (const f of document.fonts) {
          faces.push({ family: f.family, weight: f.weight, style: f.style, status: f.status });
        }
      } catch(e) {}
      const sheets = Array.from(document.styleSheets).slice(0, 15).map(s => {
        try { return s.href; } catch { return null; }
      }).filter(Boolean);
      return {
        fonts: faces.slice(0, 40),
        stylesheets: sheets,
        rootVars: (() => {
          const cs = getComputedStyle(document.documentElement);
          const out = {};
          // common css vars
          for (const sheet of document.styleSheets) {
            try {
              for (const rule of sheet.cssRules || []) {
                if (rule.selectorText === ':root' || rule.selectorText === 'html') {
                  const t = rule.cssText;
                  const vars = [...t.matchAll(/--([\\w-]+)\\s*:\\s*([^;]+)/g)].slice(0, 50);
                  for (const [,k,v] of vars) out[k] = v.trim();
                }
              }
            } catch(_) {}
          }
          return out;
        })(),
      };
    }`);
    writeFileSync(join(OUT, 'fonts-and-tokens.txt'), fonts);
    report.fontsAndTokens = fonts.slice(0, 10000);
  } catch (e) {
    report.notes.push('fonts probe failed: ' + e.message);
  }

  // Performance-ish metrics
  try {
    const perf = await evaluate(client, `() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paints = performance.getEntriesByType('paint');
      const resources = performance.getEntriesByType('resource')
        .map(r => ({ name: r.name.split('?')[0].slice(-100), type: r.initiatorType, duration: Math.round(r.duration), size: r.transferSize || 0 }))
        .sort((a,b)=>b.duration-a.duration)
        .slice(0, 25);
      return {
        navigation: nav ? {
          domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
          loadEvent: Math.round(nav.loadEventEnd),
          responseEnd: Math.round(nav.responseEnd),
          transferSize: nav.transferSize,
          type: nav.type,
        } : null,
        paints: paints.map(p => ({ name: p.name, start: Math.round(p.startTime) })),
        slowestResources: resources,
      };
    }`);
    writeFileSync(join(OUT, 'performance.txt'), perf);
    report.performance = perf.slice(0, 8000);
  } catch (e) {
    report.notes.push('perf failed: ' + e.message);
  }

  writeFileSync(join(OUT, 'analysis-report.json'), JSON.stringify(report, null, 2));
  console.log('\nDone. Report written to analysis-report.json');
  console.log('Page URLs used:', JSON.stringify(pageUrls, null, 2));

  await client.close();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
