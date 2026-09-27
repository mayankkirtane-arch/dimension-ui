/**
 * Deep-link diagnostic.
 *
 * verify-deeplinks.js reported that #pricing and #faq leave elements stuck at
 * opacity 0, while #saas / #b2b-agency / #ecommerce / #local-business / #gallery
 * are fine. This script answers *why* by dumping, for each stuck element:
 *   - its tag / class / text preview
 *   - its bounding rect relative to the viewport
 *   - which section it lives in
 * and by reporting the section's own offsetTop so we can tell whether the
 * browser actually honoured the hash.
 */
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const BASE = process.argv[2] || "http://localhost:4180/";
const HASHES = process.argv.slice(3);
const TARGETS = HASHES.length ? HASHES : ["#pricing", "#faq"];

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const bin = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!bin) { console.error("No Chrome/Edge binary found"); process.exit(2); }

const profile = path.join(process.cwd(), ".shots", "diag-profile");
fs.mkdirSync(profile, { recursive: true });
const PORT = 9339;

const chrome = spawn(bin, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check",
  "--disable-gpu", "--hide-scrollbars",
  "--window-size=1440,900",
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Resolve a *page* target's websocket URL.
 *
 * /json/version returns the browser-level endpoint, which only supports a
 * handful of Browser.* commands — Page.enable / Runtime.evaluate are rejected
 * with -32601. We must connect to a page target instead.
 */
async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome did not expose a page target");
}

function makeClient(ws) {
  let id = 0;
  const pending = new Map();
  ws.on("message", (raw) => {
    const m = JSON.parse(raw.toString());
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  });
  return (method, params = {}) =>
    new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, (m) => (m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result)));
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
}

const PROBE = `(() => {
  const hash = location.hash;
  const section = document.querySelector(hash);
  const rect = section ? section.getBoundingClientRect() : null;

  const walk = (root) => Array.from(root.querySelectorAll("*, [style]"));
  const stuck = [];
  for (const el of walk(document.body)) {
    if (el.hasAttribute("aria-hidden")) continue;
    const cs = getComputedStyle(el);
    const op = parseFloat(cs.opacity);
    const r = el.getBoundingClientRect();
    if (op < 0.05 && r.height > 20 && r.width > 20) {
      const owner = el.closest("section[id]");
      stuck.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || "").toString().slice(0, 90),
        owner: owner ? owner.id : "(none)",
        top: Math.round(r.top),
        h: Math.round(r.height),
        text: (el.textContent || "").trim().slice(0, 60),
      });
    }
  }

  return {
    hash,
    found: !!section,
    sectionTop: rect ? Math.round(rect.top) : null,
    sectionHeight: rect ? Math.round(rect.height) : null,
    scrollY: Math.round(window.scrollY),
    docHeight: document.documentElement.scrollHeight,
    stuckCount: stuck.length,
    stuck: stuck.slice(0, 12),
  };
})()`;

(async () => {
  const wsUrl = await getWsUrl();
  const WebSocket = require("ws");
  const ws = new WebSocket(wsUrl, { perMessageDeflate: false });
  await new Promise((r) => ws.on("open", r));
  const send = makeClient(ws);

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  });

  for (const hash of TARGETS) {
    await send("Page.navigate", { url: BASE + hash });
    await sleep(3200);
    const { result } = await send("Runtime.evaluate", {
      expression: PROBE, returnByValue: true,
    });
    const d = result.value;
    console.log("\n=== " + hash + " ===");
    console.log("  found:", d.found, " sectionTop:", d.sectionTop, " sectionH:", d.sectionHeight);
    console.log("  scrollY:", d.scrollY, " docHeight:", d.docHeight);
    console.log("  stuck:", d.stuckCount);
    for (const s of d.stuck) {
      console.log(`    <${s.tag} class="${s.cls}">`);
      console.log(`        owner=#${s.owner} viewportTop=${s.top} h=${s.h}`);
      console.log(`        text="${s.text}"`);
    }
  }

  ws.close();
  chrome.kill();
  process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
