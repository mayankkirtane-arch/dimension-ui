/**
 * Does the arrival hook actually see the hash at hydration time?
 *
 * The ArrivedContext fix depends on `useEffect` in useArrivedAt reading
 * `window.location.hash` and finding the target id. If that reads empty (or
 * reads the wrong value) the whole mechanism silently no-ops.
 */
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const BASE = process.argv[2] || "http://localhost:4190/";
const HASH = process.argv[3] || "#pricing";

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];
const bin = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
const profile = path.join(process.cwd(), ".shots", "hook-profile");
fs.mkdirSync(profile, { recursive: true });
const PORT = 9343;

const chrome = spawn(bin, [
  "--headless=new", `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`, "--no-first-run",
  "--disable-gpu", "--hide-scrollbars", "--window-size=1440,900",
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wsUrl() {
  for (let i = 0; i < 80; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const p = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (p) return p.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("no page target");
}

function client(ws) {
  let id = 0; const pending = new Map();
  ws.on("message", (raw) => {
    const m = JSON.parse(raw.toString());
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  });
  return (method, params = {}) => new Promise((res, rej) => {
    const mid = ++id;
    pending.set(mid, (m) => (m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)));
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
}

(async () => {
  const WebSocket = require("ws");
  const ws = new WebSocket(await wsUrl(), { perMessageDeflate: false });
  await new Promise((r) => ws.on("open", r));
  const send = client(ws);

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  });

  // Capture location.hash values over time to see when (and whether) the
  // hook's effect would have observed the anchor.
  await send("Runtime.evaluate", { expression: `
    window.__hashLog = [];
    const orig = window.location.hash;
    window.__hashLog.push(["initial(native)", orig, Date.now()]);
    setInterval(() => {
      window.__hashLog.push(["poll", window.location.hash, Date.now()]);
    }, 250);
  ` });

  await send("Page.navigate", { url: BASE + HASH });

  await sleep(1000);
  const early = await send("Runtime.evaluate", {
    expression: "({ hash: location.hash, ready: document.readyState, reactRoot: !!document.querySelector('#top, section') })",
    returnByValue: true,
  });
  console.log("t=1000ms:", JSON.stringify(early.result.value));

  await sleep(2500);
  const late = await send("Runtime.evaluate", {
    expression: `(() => {
      const h1 = document.querySelector('h1');
      const cs = h1 ? getComputedStyle(h1) : null;
      return {
        hash: location.hash,
        h1Opacity: cs ? cs.opacity : null,
        scrollY: Math.round(scrollY),
        logSample: window.__hashLog.slice(0, 3),
      };
    })()`,
    returnByValue: true,
  });
  console.log("t=3500ms:", JSON.stringify(late.result.value, null, 2));

  // Is the reveal actually driven by a transform that never ran?
  const probe = await send("Runtime.evaluate", {
    expression: `(() => {
      const out = [];
      for (const el of document.querySelectorAll("section[id] > div > *")) {
        const cs = getComputedStyle(el);
        if (parseFloat(cs.opacity) < 0.05) {
          out.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className||"").toString().slice(0,60),
            opacity: cs.opacity,
            transform: cs.transform,
            inlineStyle: el.getAttribute("style"),
          });
        }
      }
      return out.slice(0, 6);
    })()`,
    returnByValue: true,
  });
  console.log("\nstuck section children (opacity/transform/inline style):");
  console.log(JSON.stringify(probe.result.value, null, 2));

  ws.close(); chrome.kill(); process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
