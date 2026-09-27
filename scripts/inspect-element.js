/**
 * Dev-only diagnostic: launches headless Chrome via CDP, loads the app, and
 * reports the CSS rules that actually match a given selector.
 *
 * Usage: node scripts/inspect-element.js <selector> [width] [height]
 */
const http = require("http");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const CHROME = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!CHROME) {
  console.error("No Chromium-based browser found.");
  process.exit(1);
}

const SELECTOR = process.argv[2] || '[aria-controls="mobile-nav-sheet"]';
const WIDTH = Number(process.argv[3] || 390);
const HEIGHT = Number(process.argv[4] || 844);
const URL = process.env.PROBE_URL || "http://localhost:4180/";
const PORT = 9240 + Math.floor(Math.random() * 40);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function httpGet(p) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: "127.0.0.1", port: PORT, path: p }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve(d));
      })
      .on("error", reject);
  });
}

const PROBE = `
(function () {
  var el = document.querySelector(${JSON.stringify(SELECTOR)});
  if (!el) return JSON.stringify({ error: "element not found" }, null, 1);

  var cs = getComputedStyle(el);
  var matched = [];

  function walk(rules, mediaCtx) {
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i];
      if (r.cssRules) { walk(r.cssRules, r.conditionText || mediaCtx); continue; }
      if (!r.selectorText) continue;
      var hit = false;
      try { hit = el.matches(r.selectorText); } catch (e) { hit = false; }
      if (!hit) continue;
      var props = {};
      if (r.style) {
        if (r.style.display) props.display = r.style.display;
        if (r.style.gridTemplateColumns) props.gridTemplateColumns = r.style.gridTemplateColumns;
        if (r.style.opacity) props.opacity = r.style.opacity;
      }
      if (Object.keys(props).length) matched.push({ sel: r.selectorText, media: mediaCtx || "(none)", props: props });
    }
  }

  var sheets = document.styleSheets;
  for (var s = 0; s < sheets.length; s++) {
    var rules;
    try { rules = sheets[s].cssRules; } catch (e) { continue; }
    if (rules) walk(rules, null);
  }

  return JSON.stringify({
    viewport: { w: window.innerWidth, h: window.innerHeight },
    matchMedia: {
      "min-width:40rem": window.matchMedia("(min-width:40rem)").matches,
      "min-width:64rem": window.matchMedia("(min-width:64rem)").matches,
    },
    inlineStyle: el.getAttribute("style"),
    className: el.className,
    computed: {
      display: cs.display,
      width: cs.width,
      height: cs.height,
      visibility: cs.visibility,
      opacity: cs.opacity,
    },
    matchedRules: matched,
  }, null, 1);
})()
`;

(async () => {
  const child = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${path.join(process.cwd(), ".shots", "inspect-profile")}`,
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let wsUrl = null;
  for (let i = 0; i < 50 && !wsUrl; i++) {
    await sleep(400);
    try {
      const list = JSON.parse(await httpGet("/json/list"));
      const page = list.find((t) => t.type === "page");
      if (page && page.webSocketDebuggerUrl) wsUrl = page.webSocketDebuggerUrl;
    } catch {}
  }
  if (!wsUrl) {
    console.error("DevTools did not come up.");
    child.kill();
    process.exit(1);
  }

  const WebSocket = require("ws");
  const sock = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const mid = ++id;
      pending.set(mid, resolve);
      sock.send(JSON.stringify({ id: mid, method, params }));
    });

  sock.on("message", (raw) => {
    const msg = JSON.parse(raw);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  });

  await new Promise((r) => sock.on("open", r));
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 2,
    mobile: WIDTH < 768,
  });
  await send("Page.navigate", { url: URL });
  await sleep(4000);

  const res = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: PROBE,
  });

  console.log(res && res.result ? res.result.value : JSON.stringify(res));

  sock.close();
  child.kill();
  process.exit(0);
})();
