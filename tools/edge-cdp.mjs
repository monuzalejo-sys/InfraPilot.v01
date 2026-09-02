#!/usr/bin/env node
// edge-cdp.mjs — QA visual de páginas con un Chromium headless (Edge o Chrome) POR CDP (receta KN-003 de memory/landings).
// Por qué: --screenshot a secas tiene piso de viewport ~492px y reduced-motion activo por defecto;
// por CDP se emula el viewport real, se activa el movimiento y se miden overflow/animaciones/consola.
// Uso:
//   node edge-cdp.mjs --url <url|ruta> [--width 390] [--height 844] [--mobile] [--shot salida.png] [--full]
//                     [--eval "<expresión JS>"] [--wait 2500] [--reduce] [--port 9333] [--edge <ruta al navegador>]
// Salida: JSON con viewport, métricas (scrollWidth/clientWidth/scrollHeight/animaciones/fuentes), eval, consola, excepciones.
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const opt = { width: 1440, height: 900, mobile: false, wait: 2500, port: 9333, reduce: false, full: false };
for (let i = 0; i < args.length; i++) {
  const a = args[i]; const next = () => args[++i];
  switch (a) {
    case '--url': opt.url = next(); break;
    case '--width': opt.width = +next(); break;
    case '--height': opt.height = +next(); break;
    case '--mobile': opt.mobile = true; break;
    case '--shot': opt.shot = next(); break;
    case '--full': opt.full = true; break;
    case '--eval': opt.eval = next(); break;
    case '--wait': opt.wait = +next(); break;
    case '--reduce': opt.reduce = true; break;
    case '--port': opt.port = +next(); break;
    case '--edge': opt.edge = next(); break;
    default: console.error('argumento desconocido:', a); process.exit(2);
  }
}
if (!opt.url) { console.error('falta --url'); process.exit(2); }
let url = opt.url;
if (!/^[a-z]+:\/\//i.test(url)) url = pathToFileURL(resolve(url)).href;

// Lo que hace falta es el motor Chromium, no Edge en particular: Chrome habla el mismo CDP
// y da las mismas medidas. En la Mac no hay Edge y sí hay Chrome, así que se busca por
// plataforma en vez de dar Windows por hecho — antes esto moría con exit 2 fuera de Windows.
const CANDIDATOS = process.platform === 'darwin'
  ? ['/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
     '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
     '/Applications/Chromium.app/Contents/MacOS/Chromium']
  : process.platform === 'win32'
  ? ['C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
     'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe']
  : ['/usr/bin/microsoft-edge', '/usr/bin/google-chrome', '/usr/bin/chromium'];
const EDGE = opt.edge || CANDIDATOS.find(existsSync);
if (!EDGE) {
  console.error('no encuentro un navegador Chromium (pasa la ruta con --edge). Probé:\n  ' + CANDIDATOS.join('\n  '));
  process.exit(2);
}

const profile = mkdtempSync(join(tmpdir(), 'edge-cdp-'));
const edge = spawn(EDGE, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
  '--remote-allow-origins=*', `--remote-debugging-port=${opt.port}`, `--user-data-dir=${profile}`,
  `--window-size=${Math.max(opt.width, 500)},${opt.height}`, 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const guard = setTimeout(() => { console.error('ERROR timeout global (90 s)'); try { edge.kill(); } catch {} process.exit(3); }, 90000);
guard.unref();

async function waitTarget() {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${opt.port}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page;
    } catch {}
    await sleep(200);
  }
  throw new Error('el navegador no expuso un target de página en 15 s');
}

let id = 0; const pending = new Map(); const listeners = [];
const consola = []; const excepciones = [];
let ws;
function send(method, params = {}) {
  return new Promise((res, rej) => {
    const mid = ++id; pending.set(mid, { res, rej, method });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
}
function once(method, timeout = 10000) {
  return new Promise((res) => {
    const t = setTimeout(() => { off(); res(null); }, timeout);
    const h = (e) => { if (e.method === method) { clearTimeout(t); off(); res(e.params); } };
    const off = () => { const i = listeners.indexOf(h); if (i >= 0) listeners.splice(i, 1); };
    listeners.push(h);
  });
}

async function main() {
  const target = await waitTarget();
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('no pude abrir el WebSocket de CDP')); });
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id); pending.delete(msg.id);
      msg.error ? p.rej(new Error(`${p.method}: ${msg.error.message}`)) : p.res(msg.result);
    } else if (msg.method) {
      if (msg.method === 'Runtime.consoleAPICalled') {
        consola.push({ type: msg.params.type, text: msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ') });
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        const d = msg.params.exceptionDetails;
        excepciones.push(d.exception?.description || d.text);
      }
      for (const h of [...listeners]) h(msg);
    }
  };
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: opt.width, height: opt.height, deviceScaleFactor: 1, mobile: opt.mobile });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: opt.reduce ? 'reduce' : 'no-preference' }] });
  const loaded = once('Page.loadEventFired', 20000);
  await send('Page.navigate', { url });
  await loaded;
  await sleep(opt.wait);

  const out = { url, viewport: { width: opt.width, height: opt.height, mobile: opt.mobile }, reducedMotionEmulated: opt.reduce };
  const m = await send('Runtime.evaluate', {
    expression: `({ innerWidth, innerHeight, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, scrollHeight: document.documentElement.scrollHeight, overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth, animations: document.getAnimations().length, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, title: document.title, fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family).filter((v, i, a) => a.indexOf(v) === i) })`,
    returnByValue: true,
  });
  out.metrics = m.result.value;
  if (opt.eval) {
    const r = await send('Runtime.evaluate', { expression: opt.eval, returnByValue: true, awaitPromise: true });
    out.eval = r.exceptionDetails ? { error: r.exceptionDetails.exception?.description || r.exceptionDetails.text } : r.result.value;
  }
  if (opt.shot) {
    let params = { format: 'png' };
    if (opt.full) {
      const lm = await send('Page.getLayoutMetrics');
      const cs = lm.cssContentSize || lm.contentSize;
      params = { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: Math.ceil(cs.width), height: Math.ceil(cs.height), scale: 1 } };
    }
    const shot = await send('Page.captureScreenshot', params);
    writeFileSync(opt.shot, Buffer.from(shot.data, 'base64'));
    out.shot = resolve(opt.shot);
  }
  out.console = consola;
  out.exceptions = excepciones;
  console.log(JSON.stringify(out, null, 2));
}

main()
  .catch((e) => { console.error('ERROR', e.message); process.exitCode = 1; })
  .finally(async () => {
    try { await send('Browser.close'); } catch {}
    try { ws && ws.close(); } catch {}
    try { edge.kill(); } catch {}
    await sleep(300);
    try { rmSync(profile, { recursive: true, force: true }); } catch {}
    clearTimeout(guard);
  });
