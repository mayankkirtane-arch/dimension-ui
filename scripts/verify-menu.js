/**
 * Interaction test: verifies the mobile nav sheet opens, renders all links,
 * closes on link click, closes on Escape, and scrolls to the right anchor.
 *
 * Usage: node scripts/verify-menu.js [baseUrl]
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

const BASE = process.argv[2] || "http://localhost:4180/";
const OUT = path.join(process.cwd(), ".shots");
const PORT = 9500 + Math.floor(Math.random() * 40);

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

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const child = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${path.join(OUT, "menu-profile")}`,
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

  const errors = [];
  sock.on("message", (raw) => {
    const msg = JSON.parse(raw);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
    if (msg.method === "Runtime.exceptionThrown") {
      errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
    }
  });

  await new Promise((r) => sock.on("open", r));
  await send("Page.enable");
  await send("Runtime.enable");

  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", { returnByValue: true, expression });
    return r.result.value;
  };

  const tap = async (selector) => {
    // Real pointer events via Input domain -> exercises the actual handlers.
    const box = JSON.parse(
      await evaluate(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return "null";
        const r = el.getBoundingClientRect();
        return JSON.stringify({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      })()`),
    );
    if (!box) throw new Error("cannot tap, element missing: " + selector);
    for (const type of ["mousePressed", "mouseReleased"]) {
      await send("Input.dispatchMouseEvent", {
        type,
        x: box.x,
        y: box.y,
        button: "left",
        clickCount: 1,
      });
      await sleep(60);
    }
  };

  const fail = [];
  const check = (label, cond, detail = "") => {
    console.log(`  ${cond ? "PASS" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`);
    if (!cond) fail.push(label);
  };

  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send("Page.navigate", { url: BASE });
  await sleep(3800);

  console.log("\n--- Mobile nav sheet interaction ---");

  /* 1. Sheet is closed initially */
  let state = JSON.parse(
    await evaluate(`JSON.stringify({
      sheet: !!document.querySelector('#mobile-nav-sheet'),
      expanded: document.querySelector('[aria-controls="mobile-nav-sheet"]')?.getAttribute('aria-expanded'),
    })`),
  );
  check("sheet closed on load", state.sheet === false && state.expanded === "false", `expanded=${state.expanded}`);

  /* 2. Open it */
  await tap('[aria-controls="mobile-nav-sheet"]');
  await sleep(700);

  state = JSON.parse(
    await evaluate(`(() => {
      const sheet = document.querySelector('#mobile-nav-sheet');
      if (!sheet) return JSON.stringify({ sheet:false });
      const links = [...sheet.querySelectorAll('a[href^="#"]')].map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
      const r = sheet.getBoundingClientRect();
      return JSON.stringify({
        sheet: true,
        expanded: document.querySelector('[aria-controls="mobile-nav-sheet"]')?.getAttribute('aria-expanded'),
        h: Math.round(r.height),
        visible: getComputedStyle(sheet).display !== 'none' && r.height > 0,
        links,
        bodyOverflow: document.body.style.overflow,
      });
    })()`),
  );
  check("sheet opens", state.sheet === true && state.visible === true, `h=${state.h}px`);
  check("aria-expanded true", state.expanded === "true");
  check("body scroll locked", state.bodyOverflow === "hidden", `overflow=${state.bodyOverflow}`);

  const expected = ["SaaS", "Local Business", "B2B & Agency", "Pricing", "FAQ"];
  const gotLinks = (state.links || []).map((l) => l.text).filter((t) => expected.includes(t));
  check("all 5 nav links present", expected.every((e) => gotLinks.includes(e)), gotLinks.join(", "));
  check("CTA present in sheet", (state.links || []).some((l) => l.text.includes("All-Access")));

  const shot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(OUT, "menu-open.png"), Buffer.from(shot.data, "base64"));

  /* 3. Escape closes */
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await sleep(600);
  state = JSON.parse(
    await evaluate(`JSON.stringify({
      sheet: !!document.querySelector('#mobile-nav-sheet'),
      expanded: document.querySelector('[aria-controls="mobile-nav-sheet"]')?.getAttribute('aria-expanded'),
      bodyOverflow: document.body.style.overflow,
    })`),
  );
  check("escape closes sheet", state.sheet === false, `expanded=${state.expanded}`);
  check("body scroll restored", state.bodyOverflow !== "hidden", `overflow="${state.bodyOverflow}"`);

  /* 4. Nav link scrolls to the anchor */
  const before = await evaluate("window.scrollY");
  await tap('[aria-controls="mobile-nav-sheet"]');
  await sleep(650);
  await tap('#mobile-nav-sheet a[href="#pricing"]');
  await sleep(1600);

  state = JSON.parse(
    await evaluate(`(() => {
      const target = document.getElementById('pricing');
      const r = target ? target.getBoundingClientRect() : null;
      return JSON.stringify({
        scrolled: window.scrollY,
        sheet: !!document.querySelector('#mobile-nav-sheet'),
        targetTop: r ? Math.round(r.top) : null,
        hash: window.location.hash,
      });
    })()`),
  );
  check("link closes sheet", state.sheet === false);
  check("page scrolled down", state.scrolled > before + 200, `${before} -> ${state.scrolled}`);
  check("pricing anchor near viewport top", state.targetTop !== null && state.targetTop < 160, `top=${state.targetTop}px (navbar offset ~88px)`);

  console.log("\nCONSOLE ERRORS:", errors.length ? errors : "none");
  console.log("RESULT:", fail.length ? `FAIL (${fail.length})` : "ALL PASS");

  sock.close();
  child.kill();
  process.exit(fail.length ? 1 : 0);
})();
