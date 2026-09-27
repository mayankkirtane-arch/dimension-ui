/**
 * Deep-link verification, settlement-aware.
 *
 * The earlier version slept a fixed 2800ms and then measured. That produced
 * false failures: for `#pricing` it read `scrollY: 21` with the section still
 * 6965px below the fold, i.e. it measured while the browser was still jumping.
 * Counting "unrevealed" elements at that moment just counts the hero you are
 * scrolling away from.
 *
 * This version waits until the scroll position actually stabilises (two
 * consecutive frames with no movement), then measures. That is the only
 * correct moment to ask "did this section reveal?".
 */
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const BASE = process.argv[2] || "http://localhost:4190/";
const HASHES = [
  "#gallery",
  "#saas",
  "#local-business",
  "#b2b-agency",
  "#ecommerce",
  "#pricing",
  "#faq",
];

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];
const bin = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!bin) { console.error("No Chrome/Edge binary found"); process.exit(2); }

const profile = path.join(process.cwd(), ".shots", "dl-profile");
fs.mkdirSync(profile, { recursive: true });
const PORT = 9341;

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

async function getWsUrl() {
  for (let i = 0; i < 80; i++) {
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

/** Wait until window.scrollY has held still for two consecutive samples. */
async function waitForSettle(send) {
  let last = -1;
  for (let i = 0; i < 40; i++) {
    const { result } = await send("Runtime.evaluate", {
      expression: "Math.round(window.scrollY)",
      returnByValue: true,
    });
    const y = result.value;
    if (y === last) return y;
    last = y;
    await sleep(200);
  }
  return last;
}

const PROBE = `(() => {
  const hash = location.hash;
  const section = document.querySelector(hash);
  if (!section) return { found: false, hash };

  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight;

  // "Unrevealed" now means: translucent AND actually visible on screen.
  // Off-screen elements are excluded — they are legitimately still hidden
  // because the user is jumping past them, not because the reveal broke.
  const stuck = [];
  for (const el of document.body.querySelectorAll("*")) {
    if (el.hasAttribute("aria-hidden")) continue;
    const op = parseFloat(getComputedStyle(el).opacity);
    if (!(op < 0.05)) continue;
    const r = el.getBoundingClientRect();
    if (r.height <= 20 || r.width <= 20) continue;
    const onScreen = r.bottom > 0 && r.top < vh;
    if (!onScreen) continue;
    stuck.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className || "").toString().slice(0, 70),
      top: Math.round(r.top),
      text: (el.textContent || "").trim().slice(0, 50),
    });
  }

  return {
    found: true,
    hash,
    sectionTop: Math.round(rect.top),
    sectionHeight: Math.round(rect.height),
    scrollY: Math.round(window.scrollY),
    onScreen: Math.round(vh),
    stuckCount: stuck.length,
    stuck: stuck.slice(0, 8),
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

  let failures = 0;

  for (const hash of HASHES) {
    await send("Page.navigate", { url: BASE + hash });
    await sleep(600);
    await waitForSettle(send);
    // Give Framer a beat to finish any transition that started on arrival.
    await sleep(900);

    const { result } = await send("Runtime.evaluate", {
      expression: PROBE, returnByValue: true,
    });
    const d = result.value;

    const positioned = d.sectionTop > -80 && d.sectionTop < 260;
    const revealed = d.stuckCount === 0;
    const ok = positioned && revealed;
    if (!ok) failures++;

    console.log(
      `${hash.padEnd(17)} ${ok ? "PASS" : "FAIL"}` +
      `  top=${String(d.sectionTop).padStart(5)}px` +
      `  scrollY=${String(d.scrollY).padStart(5)}` +
      `  unrevealedOnScreen=${d.stuckCount}`,
    );

    if (!ok) {
      for (const s of d.stuck) {
        console.log(
          `      <${s.tag} class="${s.cls}"> top=${s.top} "${s.text}"`,
        );
      }
    }
  }

  console.log(
    `\nDEEP LINK RESULT: ${failures === 0 ? "ALL PASS" : `FAIL (${failures})`}`,
  );

  ws.close();
  chrome.kill();
  process.exit(failures === 0 ? 0 : 1);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
