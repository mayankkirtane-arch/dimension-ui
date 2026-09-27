/**
 * Responsive verification over the Chrome DevTools Protocol.
 *
 * - Boots headless Chrome once and drives a real browser against a running
 *   production server.
 * - Captures screenshots at several viewports.
 * - Asserts the responsive contract (which elements are visible where).
 * - Reports any console errors / page exceptions.
 *
 * Usage:
 *   node scripts/verify-responsive.js [baseUrl]
 */

const http = require("http");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => fs.existsSync(p));

if (!CHROME) {
  console.error("No Chromium-based browser found.");
  process.exit(1);
}

const BASE = process.argv[2] || "http://localhost:4180/";
const OUT = path.join(process.cwd(), ".shots");
const PORT = 9400 + Math.floor(Math.random() * 50);

const VIEWPORTS = [
  { name: "mobile-390", w: 390, h: 844, mobile: true },
  { name: "tablet-768", w: 768, h: 1024, mobile: true },
  { name: "desktop-1280", w: 1280, h: 900, mobile: false },
  { name: "wide-1600", w: 1600, h: 1000, mobile: false },
];

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

/** Runs in the page: reports visibility of the key responsive elements. */
const PROBE = `
(function () {
  function info(sel) {
    var el = document.querySelector(sel);
    if (!el) return { found: false };
    var cs = getComputedStyle(el);
    var r = el.getBoundingClientRect();
    return {
      found: true,
      display: cs.display,
      visible: cs.display !== "none" && cs.visibility !== "hidden" && r.width > 0 && r.height > 0,
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  }
  var hero = document.querySelector("h1");
  var pillCount = document.querySelectorAll('a[href^="#saas"], a[href^="#local-business"], a[href^="#b2b-agency"], a[href^="#gallery"]').length;
  return JSON.stringify({
    viewport: window.innerWidth,
    mq40: window.matchMedia("(min-width:40rem)").matches,
    mq64: window.matchMedia("(min-width:64rem)").matches,
    desktopNav: info("header ul"),
    hamburger: info('[aria-controls="mobile-nav-sheet"]'),
    headerCta: info("header a[href='#pricing']"),
    canvas: info("canvas"),
    heroText: hero ? hero.textContent.trim().slice(0, 60) : null,
    pillLinks: pillCount,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    bodyFont: getComputedStyle(document.body).fontFamily.slice(0, 40),
    scrollHeight: document.documentElement.scrollHeight,
  }, null, 1);
})()
`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const child = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${path.join(OUT, "verify-profile")}`,
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
  const problems = [];

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
    if (msg.method === "Runtime.exceptionThrown") {
      const d = msg.params.exceptionDetails;
      problems.push("EXCEPTION: " + (d.exception?.description || d.text));
    }
    if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
      problems.push(
        "CONSOLE: " + msg.params.args.map((a) => a.value || a.description).join(" "),
      );
    }
  });

  await new Promise((r) => sock.on("open", r));
  await send("Page.enable");
  await send("Runtime.enable");

  const results = [];

  for (const vp of VIEWPORTS) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 2,
      mobile: vp.mobile,
    });
    await send("Page.navigate", { url: BASE });
    await sleep(3800);

    const res = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: PROBE,
    });

    const data = JSON.parse(res.result.value);
    results.push({ name: vp.name, ...data });

    const shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(
      path.join(OUT, `vh-${vp.name}.png`),
      Buffer.from(shot.data, "base64"),
    );
  }

  /* ---------------- Report ---------------- */
  console.log("=".repeat(72));
  for (const r of results) {
    console.log(`\n### ${r.name}  (viewport ${r.viewport}px)`);
    console.log(`  breakpoints      : 40rem=${r.mq40}  64rem=${r.mq64}`);
    console.log(`  body bg / font   : ${r.bodyBg} / ${r.bodyFont}`);
    console.log(`  desktop nav ul   : ${r.desktopNav.found ? r.desktopNav.display : "absent"}`);
    console.log(`  hamburger        : ${r.hamburger.found ? `${r.hamburger.display} ${r.hamburger.w}x${r.hamburger.h} visible=${r.hamburger.visible}` : "absent"}`);
    console.log(`  header CTA       : ${r.headerCta.found ? `${r.headerCta.display} ${r.headerCta.w}x${r.headerCta.h} visible=${r.headerCta.visible}` : "absent"}`);
    console.log(`  canvas           : ${r.canvas.found ? `${r.canvas.w}x${r.canvas.h} visible=${r.canvas.visible}` : "ABSENT"}`);
    console.log(`  category pills   : ${r.pillLinks}`);
    console.log(`  page height      : ${r.scrollHeight}px`);
    console.log(`  h1               : ${r.heroText}`);
  }

  console.log("\n" + "=".repeat(72));
  console.log("CONSOLE ERRORS:", problems.length ? problems : "none");

  /* ---------------- Assertions ---------------- */
  const fail = [];
  for (const r of results) {
    const isDesktop = r.mq64;
    if (r.mq64) {
      if (r.desktopNav.display === "none") fail.push(`${r.name}: desktop nav hidden at >=64rem`);
      if (r.hamburger.visible) fail.push(`${r.name}: hamburger visible at >=64rem`);
      if (!r.headerCta.visible) fail.push(`${r.name}: header CTA hidden at >=64rem`);
    } else {
      if (r.desktopNav.display !== "none") fail.push(`${r.name}: desktop nav visible below 64rem`);
      if (!r.hamburger.visible) fail.push(`${r.name}: hamburger hidden below 64rem`);
    }
    if (!r.canvas.found || !r.canvas.visible) fail.push(`${r.name}: canvas not visible`);
    if (r.pillLinks < 4) fail.push(`${r.name}: expected 4 category pills, got ${r.pillLinks}`);
    if (!r.heroText || !r.heroText.startsWith("Build")) fail.push(`${r.name}: h1 text unexpected`);
    if (r.bodyBg !== "rgb(7, 7, 13)") fail.push(`${r.name}: body bg is ${r.bodyBg}, expected obsidian`);
  }

  console.log("\nASSERTIONS:", fail.length ? "FAIL" : "ALL PASS");
  for (const f of fail) console.log("  ✗ " + f);

  sock.close();
  child.kill();
  process.exit(fail.length ? 1 : 0);
})();
