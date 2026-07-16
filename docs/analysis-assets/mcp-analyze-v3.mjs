/**
 * Dismiss geo/cookie overlays, then deep-capture Aesop pages via chrome-devtools-mcp.
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;
const SCREENSHOTS = join(OUT, 'screenshots');
const PROFILE = join(homedir(), '.cache', 'chrome-devtools-mcp-aesop-profile');
if (!existsSync(SCREENSHOTS)) mkdirSync(SCREENSHOTS, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function extractText(result) {
  if (!result?.content) return '';
  return result.content.map((c) => {
    if (c.type === 'text') return c.text;
    if (c.type === 'image') return `[image ${Buffer.from(c.data || '', 'base64').length}b]`;
    return '';
  }).join('\n');
}
function parseJson(text) {
  if (!text) return null;
  const fence = text.match(/```json\s*([\s\S]*?)```/);
  if (fence) { try { return JSON.parse(fence[1]); } catch {} }
  const s = text.indexOf('{'), e = text.lastIndexOf('}');
  if (s >= 0 && e > s) { try { return JSON.parse(text.slice(s, e + 1)); } catch {} }
  return null;
}
function saveShot(result, name) {
  for (const c of result?.content || []) {
    if (c.type === 'image' && c.data) {
      const p = join(SCREENSHOTS, name);
      writeFileSync(p, Buffer.from(c.data, 'base64'));
      return p;
    }
  }
  return null;
}
async function tool(client, name, args = {}) {
  return client.callTool({ name, arguments: args });
}
async function evalFn(client, fn) {
  return extractText(await tool(client, 'evaluate_script', { function: fn }));
}

async function dismissOverlays(client) {
  // Prefer DOM click for reliability
  const res = await evalFn(client, `() => {
    const out = [];
    // Close buttons
    for (const sel of [
      'button[aria-label="Close"]',
      'button[aria-label="close"]',
      '[class*="modal"] button[aria-label*="Close" i]',
      'dialog button',
      '[role="dialog"] button[aria-label*="Close" i]',
      '[role="dialog"] button[class*="close" i]',
    ]) {
      document.querySelectorAll(sel).forEach(b => { try { b.click(); out.push('click:'+sel); } catch{} });
    }
    // Geo modal: confirm region if button present
    for (const b of document.querySelectorAll('button, a, [role="button"]')) {
      const t = (b.innerText||'').trim().toLowerCase();
      if (t.includes('change region') || t === 'continue' || t.includes('shop now') || t.includes('confirm')) {
        try { b.click(); out.push('btn:'+t); } catch{}
      }
    }
    // Cookie close
    for (const b of document.querySelectorAll('button, a')) {
      const t = (b.innerText||b.getAttribute('aria-label')||'').trim().toLowerCase();
      if (t === 'x' || t.includes('accept') || t.includes('agree') || t === 'close' || t.includes('online preferences')) {
        // don't click Online Preferences; click close on cookie
      }
    }
    // Cookie banner close X
    const cookieClose = Array.from(document.querySelectorAll('button')).find(b => {
      const al = (b.getAttribute('aria-label')||'').toLowerCase();
      return al.includes('close') || al.includes('dismiss');
    });
    if (cookieClose) { cookieClose.click(); out.push('cookie-close'); }
    // Press Escape
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    out.push('escape');
    // Hide remaining dialogs via CSS as last resort for measurement
    document.querySelectorAll('[role="dialog"], .modal, [class*="Modal"], [class*="overlay"]').forEach(el => {
      const t = (el.innerText||'');
      if (/vietnam|region|country|cookie/i.test(t)) {
        el.style.setProperty('display','none','important');
        out.push('hide-dialog');
      }
    });
    // Also hide cookie bar
    document.querySelectorAll('div,aside,section').forEach(el => {
      const t = (el.innerText||'').slice(0,120).toLowerCase();
      if (t.includes('we use cookies') && el.getBoundingClientRect().height < 200) {
        el.style.setProperty('display','none','important');
        out.push('hide-cookie');
      }
    });
    document.body.style.overflow = 'auto';
    return out;
  }`);
  console.log('  dismiss:', res.slice(0, 300));
  await sleep(800);

  // Also try a11y click close
  try {
    const snap = extractText(await tool(client, 'take_snapshot', {}));
    const close = snap.match(/uid=(\w+)\s+button[^\n]*(?:Close|close|Dismiss)/)
      || snap.match(/uid=(\w+)\s+button[^\n]*×/)
      || snap.match(/uid=(\w+)\s+button "Close"/);
    if (close) {
      await tool(client, 'click', { uid: close[1] });
      console.log('  a11y close', close[1]);
      await sleep(1000);
    }
  } catch {}
}

const PROBE = `() => {
  const styles = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      cls: (el.className && String(el.className).slice(0, 100)) || null,
      text: (el.innerText || '').trim().replace(/\\s+/g,' ').slice(0, 90),
      w: Math.round(r.width), h: Math.round(r.height),
      fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing,
      color: cs.color, backgroundColor: cs.backgroundColor,
      border: cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor,
      padding: cs.padding, margin: cs.margin, display: cs.display, gap: cs.gap,
      maxWidth: cs.maxWidth, textTransform: cs.textTransform,
      boxShadow: cs.boxShadow === 'none' ? 'none' : cs.boxShadow.slice(0,80),
      borderRadius: cs.borderRadius,
    };
  };
  const colors = (() => {
    const counts = {};
    for (const el of Array.from(document.querySelectorAll('body,header,nav,main,footer,a,button,h1,h2,h3,p,li,section,div,span,label')).slice(0,150)) {
      const cs = getComputedStyle(el);
      for (const k of ['color','backgroundColor','borderTopColor']) {
        const v = cs[k];
        if (!v || v === 'rgba(0, 0, 0, 0)' || v === 'transparent') continue;
        counts[v] = (counts[v]||0)+1;
      }
    }
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,25).map(([c,n])=>({c,n}));
  })();
  const byTag = {};
  for (const sel of ['h1','h2','h3','h4','p','a','button','label','li','small','nav','header','footer','input']) {
    const el = document.querySelector(sel); if (el) byTag[sel] = styles(el);
  }
  // collect unique font sizes for headings and body
  const typeScale = {};
  for (const el of document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,button,label,span,li')) {
    const cs = getComputedStyle(el);
    const key = el.tagName.toLowerCase() + '|' + cs.fontSize + '|' + cs.fontWeight + '|' + cs.fontFamily.split(',')[0].replace(/"/g,'');
    if (!typeScale[key]) typeScale[key] = { tag: el.tagName.toLowerCase(), fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, fontFamily: cs.fontFamily.split(',').slice(0,2).join(','), sample: (el.innerText||'').trim().replace(/\\s+/g,' ').slice(0,40), count: 0 };
    typeScale[key].count++;
  }
  const containers = Array.from(document.querySelectorAll('main,header,footer,section,nav,[class*="container"],[class*="grid"],[class*="product"]'))
    .slice(0, 30).map(el => {
      const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
      return { tag: el.tagName.toLowerCase(), cls: String(el.className||'').slice(0,90), w: Math.round(r.width), maxWidth: cs.maxWidth, padding: cs.padding, display: cs.display, grid: cs.gridTemplateColumns, gap: cs.gap };
    });
  const nav = Array.from(document.querySelectorAll('header a, nav a, [role="navigation"] a')).slice(0, 40)
    .map(a => ({ t: (a.innerText||a.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,60), href: a.getAttribute('href') }));
  const buttons = Array.from(document.querySelectorAll('button, a[class*="button"], [class*="btn"], [role="button"]')).slice(0, 18).map(styles);
  const cards = Array.from(document.querySelectorAll('[class*="product"], [class*="card"], article, li'))
    .filter(el => el.querySelector('img') && (el.innerText||'').length > 10)
    .slice(0, 6)
    .map(el => {
      const cs = getComputedStyle(el);
      const img = el.querySelector('img');
      return {
        text: (el.innerText||'').trim().replace(/\\s+/g,' ').slice(0,180),
        w: Math.round(el.getBoundingClientRect().width),
        padding: cs.padding, backgroundColor: cs.backgroundColor,
        imgAlt: img?.alt || null, imgW: img?.naturalWidth, imgH: img?.naturalHeight,
        fonts: Array.from(el.querySelectorAll('h1,h2,h3,h4,p,span,a,button')).slice(0,6).map(x => {
          const s = getComputedStyle(x);
          return { t: (x.innerText||'').trim().slice(0,40), size: s.fontSize, weight: s.fontWeight, color: s.color, ff: s.fontFamily.split(',')[0] };
        }),
      };
    });
  const fonts = [];
  try { for (const f of document.fonts) fonts.push({ family: f.family, weight: f.weight, style: f.style }); } catch {}
  const rootVars = {};
  try {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules || []) {
          if (rule.selectorText === ':root' || rule.selectorText === 'html') {
            for (const [,k,v] of [...String(rule.cssText).matchAll(/--([\\w-]+)\\s*:\\s*([^;]+)/g)].slice(0,100)) rootVars[k]=v.trim();
          }
        }
      } catch {}
    }
  } catch {}
  // spacing samples from major sections
  const sections = Array.from(document.querySelectorAll('section, main > div, [class*="hero"], [class*="banner"]')).slice(0, 12).map(el => {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    return { cls: String(el.className||'').slice(0,80), h: Math.round(r.height), w: Math.round(r.width), padding: cs.padding, margin: cs.margin, bg: cs.backgroundColor };
  });
  return {
    title: document.title, url: location.href, lang: document.documentElement.lang,
    colors, byTag, typeScale: Object.values(typeScale).sort((a,b)=>b.count-a.count).slice(0,40),
    containers, nav, buttons, cards, fonts: fonts.slice(0,40), rootVars, sections,
    body: styles(document.body),
    meta: {
      description: document.querySelector('meta[name="description"]')?.content?.slice(0,200) || null,
      themeColor: document.querySelector('meta[name="theme-color"]')?.content || null,
    },
    dialogsVisible: !!document.querySelector('[role="dialog"]:not([style*="display: none"])'),
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
      '--chromeArg=--disable-blink-features=AutomationControlled',
    ],
  });
  const client = new Client({ name: 'aesop-v3', version: '1.0.0' });
  await client.connect(transport);
  console.log('Connected');

  const pages = [
    { key: 'homepage', url: 'https://www.aesop.com/' },
    { key: 'shop', url: 'https://www.aesop.com/shop-all/' },
    { key: 'product', url: 'https://www.aesop.com/hand-body/body-cleansers-scrubs/antithesis-intense-body-cleanser/BT26.html' },
    { key: 'cart', url: 'https://www.aesop.com/cart/' },
    { key: 'library', url: 'https://www.aesop.com/library/' },
  ];

  // Try to find library / editorial via homepage nav if library 404s
  const report = { analyzedAt: new Date().toISOString(), pages: {} };

  async function go(url) {
    await tool(client, 'navigate_page', { url, timeout: 90000 });
    await sleep(3500);
    // wait out challenge if any
    for (let i = 0; i < 10; i++) {
      const t = parseJson(await evalFn(client, `() => ({ title: document.title })`));
      if (t?.title && !/just a moment/i.test(t.title)) break;
      await sleep(2000);
    }
    await dismissOverlays(client);
    await sleep(1000);
    await dismissOverlays(client);
  }

  // first homepage to set region preference via dismiss + stay US
  await go(pages[0].url);
  // Try click "Change region or country" isn't needed if we hide modal; better: click X
  await evalFn(client, `() => {
    // set a cookie/localStorage hint if present
    try { localStorage.setItem('preferredCountry', 'US'); } catch{}
    // click any X in dialog
    for (const b of document.querySelectorAll('[role="dialog"] button, dialog button')) {
      const al = (b.getAttribute('aria-label')||'') + b.innerText;
      if (/close|×|✕/i.test(al) || b.innerText.trim() === '') { b.click(); return 'closed'; }
    }
    // force remove dialogs
    document.querySelectorAll('[role="dialog"]').forEach(d => d.remove());
    document.querySelectorAll('[class*="overlay"], [class*="Backdrop"]').forEach(d => {
      if (d.getBoundingClientRect().width > 200) d.remove();
    });
    return 'cleaned';
  }`);
  await sleep(1000);

  for (const p of pages) {
    console.log('\\n===', p.key, p.url);
    await go(p.url);
    // extra cleanup
    await evalFn(client, `() => {
      document.querySelectorAll('[role="dialog"]').forEach(d => d.remove());
      document.querySelectorAll('div').forEach(el => {
        const t = (el.innerText||'').slice(0,80);
        if (/It Seems Like You are in/i.test(t) && el.getBoundingClientRect().width > 300) {
          let root = el;
          for (let i=0;i<5;i++) if (root.parentElement && root.parentElement.innerText.includes('It Seems Like')) root = root.parentElement;
          root.remove();
        }
      });
      document.querySelectorAll('div,aside').forEach(el => {
        const t = (el.innerText||'').slice(0,100).toLowerCase();
        if (t.includes('we use cookies') && el.children.length < 8) el.remove();
      });
      document.body.style.overflow='auto';
      return location.href;
    }`);
    await sleep(800);

    const pageData = { url: p.url, viewports: {} };

    for (const vp of VIEWPORTS) {
      console.log(' ', vp.name);
      await tool(client, 'resize_page', { width: vp.width, height: vp.height });
      await sleep(1500);
      // re-clean after resize
      await evalFn(client, `() => {
        document.querySelectorAll('[role="dialog"]').forEach(d => d.remove());
        document.body.style.overflow='auto';
        return true;
      }`);

      const shot = await tool(client, 'take_screenshot', { format: 'png', fullPage: false });
      saveShot(shot, `${p.key}-${vp.name}-clean.png`);
      if (vp.name === 'desktop') {
        try {
          const full = await tool(client, 'take_screenshot', { format: 'png', fullPage: true });
          saveShot(full, `${p.key}-desktop-full-clean.png`);
        } catch {}
      }

      const snap = extractText(await tool(client, 'take_snapshot', {}));
      writeFileSync(join(OUT, `${p.key}-${vp.name}-a11y-clean.txt`), snap);

      const probeText = await evalFn(client, PROBE);
      writeFileSync(join(OUT, `${p.key}-${vp.name}-probe-clean.txt`), probeText);
      const probe = parseJson(probeText);

      let consoleLog = null, network = null, perf = null;
      if (vp.name === 'desktop') {
        consoleLog = extractText(await tool(client, 'list_console_messages', {}));
        writeFileSync(join(OUT, `${p.key}-console-clean.txt`), consoleLog);
        network = extractText(await tool(client, 'list_network_requests', {}));
        writeFileSync(join(OUT, `${p.key}-network-clean.txt`), network);
        perf = parseJson(await evalFn(client, `() => {
          const nav = performance.getEntriesByType('navigation')[0];
          const paints = performance.getEntriesByType('paint');
          const resources = performance.getEntriesByType('resource')
            .map(r => ({ name: r.name.split('?')[0].replace(/^https?:\\/\\/[^/]+/,'').slice(-100), type: r.initiatorType, duration: Math.round(r.duration), size: r.transferSize||0 }))
            .sort((a,b)=>b.duration-a.duration).slice(0,25);
          const failed = performance.getEntriesByType('resource').filter(r => r.transferSize === 0 && r.decodedBodySize === 0 && r.duration > 0).length;
          return {
            navigation: nav ? { dcl: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd), ttfb: Math.round(nav.responseStart), transferSize: nav.transferSize } : null,
            paints: paints.map(p => ({ name: p.name, t: Math.round(p.startTime) })),
            slowest: resources,
          };
        }`));
        writeFileSync(join(OUT, `${p.key}-perf-clean.json`), JSON.stringify(perf, null, 2));
      }

      pageData.viewports[vp.name] = {
        probe: probe ? {
          title: probe.title, url: probe.url, colors: probe.colors, byTag: probe.byTag,
          typeScale: probe.typeScale, containers: probe.containers?.slice(0, 15),
          nav: probe.nav, buttons: probe.buttons?.slice(0, 12), cards: probe.cards,
          fonts: probe.fonts, rootVars: probe.rootVars, sections: probe.sections,
          body: probe.body, meta: probe.meta, dialogsVisible: probe.dialogsVisible,
        } : null,
        a11yHead: snap.slice(0, 5000),
        console: consoleLog?.slice(0, 3000),
        networkHead: network?.slice(0, 4000),
        perf,
      };
    }

    // Collect more product links from shop
    if (p.key === 'shop') {
      const links = parseJson(await evalFn(client, `() => {
        return Array.from(document.querySelectorAll('a[href]'))
          .filter(a => /BT\\d+|\\/p\\/|product/i.test(a.href) || /html$/i.test(a.pathname))
          .slice(0, 15)
          .map(a => ({ t: (a.innerText||'').trim().slice(0,50), href: a.href }));
      }`));
      pageData.productLinks = links;
    }

    // From homepage get library link
    if (p.key === 'homepage') {
      const lib = parseJson(await evalFn(client, `() => {
        const a = Array.from(document.querySelectorAll('a')).find(x => /library|journal|stories|editorial|read/i.test((x.innerText||'')+x.href));
        return a ? { t: a.innerText.trim(), href: a.href } : null;
      }`));
      pageData.libraryLink = lib;
      if (lib?.href) {
        const idx = pages.findIndex(x => x.key === 'library');
        if (idx >= 0) pages[idx].url = lib.href;
      }
    }

    report.pages[p.key] = pageData;
    writeFileSync(join(OUT, 'analysis-clean.json'), JSON.stringify(report, null, 2));
  }

  // Scroll homepage for section structure
  await go(report.pages.homepage?.viewports?.desktop?.probe?.url || pages[0].url);
  await evalFn(client, `() => { document.querySelectorAll('[role="dialog"]').forEach(d=>d.remove()); return true; }`);
  const structure = parseJson(await evalFn(client, `() => {
    const sections = [];
    const walk = (root) => {
      for (const el of root.children) {
        const r = el.getBoundingClientRect();
        if (r.height < 40) continue;
        const cs = getComputedStyle(el);
        sections.push({
          tag: el.tagName.toLowerCase(),
          cls: String(el.className||'').slice(0,100),
          h: Math.round(r.height),
          w: Math.round(r.width),
          text: (el.innerText||'').trim().replace(/\\s+/g,' ').slice(0,120),
          bg: cs.backgroundColor,
          display: cs.display,
          padding: cs.padding,
        });
      }
    };
    const main = document.querySelector('main') || document.body;
    walk(main);
    // header details
    const header = document.querySelector('header');
    const hcs = header ? getComputedStyle(header) : null;
    return {
      title: document.title,
      header: header ? { h: Math.round(header.getBoundingClientRect().height), bg: hcs.backgroundColor, color: hcs.color, position: hcs.position, borderBottom: hcs.borderBottom } : null,
      topSections: sections.slice(0, 25),
      footer: (() => {
        const f = document.querySelector('footer');
        if (!f) return null;
        const cs = getComputedStyle(f);
        return { h: Math.round(f.getBoundingClientRect().height), bg: cs.backgroundColor, color: cs.color, cols: getComputedStyle(f.querySelector('div')||f).display };
      })(),
    };
  }`));
  writeFileSync(join(OUT, 'homepage-structure.json'), JSON.stringify(structure, null, 2));
  report.homepageStructure = structure;

  // PDP deeper: add to cart button, price, gallery
  await go(pages.find(p => p.key === 'product').url);
  await evalFn(client, `() => { document.querySelectorAll('[role="dialog"]').forEach(d=>d.remove()); return true; }`);
  const pdp = parseJson(await evalFn(client, `() => {
    const price = Array.from(document.querySelectorAll('*')).find(el => /^\\$\\d/.test((el.innerText||'').trim()) && (el.innerText||'').trim().length < 12);
    const add = Array.from(document.querySelectorAll('button, a')).find(b => /add to cart|add to bag/i.test(b.innerText||''));
    const size = document.querySelector('select, [class*="size"], [class*="variant"]');
    const gallery = document.querySelectorAll('img');
    const styles = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { text: (el.innerText||'').trim().slice(0,80), fontSize: cs.fontSize, fontWeight: cs.fontWeight, color: cs.color, bg: cs.backgroundColor, border: cs.border, padding: cs.padding, w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height), ff: cs.fontFamily };
    };
    return {
      url: location.href,
      title: document.title,
      h1: styles(document.querySelector('h1')),
      price: styles(price),
      addToCart: styles(add),
      sizeControl: styles(size),
      breadcrumbs: Array.from(document.querySelectorAll('[class*="breadcrumb"] a, nav[aria-label*="breadcrumb" i] a')).map(a => a.innerText.trim()),
      imageCount: gallery.length,
      mainImg: (() => { const img = document.querySelector('main img, [class*="product"] img, [class*="gallery"] img'); return img ? { alt: img.alt, w: img.naturalWidth, h: img.naturalHeight } : null; })(),
      accordion: Array.from(document.querySelectorAll('button, [class*="accordion"], details summary')).filter(b => /how to|ingredients|details|shipping|ritual/i.test(b.innerText||'')).slice(0,8).map(b => (b.innerText||'').trim().slice(0,60)),
    };
  }`));
  writeFileSync(join(OUT, 'pdp-detail.json'), JSON.stringify(pdp, null, 2));
  report.pdpDetail = pdp;

  writeFileSync(join(OUT, 'analysis-clean.json'), JSON.stringify(report, null, 2));
  console.log('DONE keys', Object.keys(report.pages));
  await client.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
