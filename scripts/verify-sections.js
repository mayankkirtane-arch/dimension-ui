/**
 * Full-page content verification: every nav anchor resolves to a real section,
 * the gallery filter works, the FAQ accordion toggles, and the pricing CTA is
 * wired. Also captures a full-page screenshot for visual review.
 *
 * Usage: node scripts/verify-sections.js [baseUrl]
 */

const http = require("http");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => fs.existsSync(p));

const BASE = process.argv[2] || "http://localhost:4180/";
const OUT = path.join(process.cwd(), ".shots");
const PORT = 9600 + Math.floor(Math.random() * 40);

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

const EXPECTED_ANCHORS = [
  "top",
  "gallery",
  "saas",
  "local-business",
  "b2b-agency",
  "ecommerce",
  "pricing",
  "faq",
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const child = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${path.join(OUT, "sections-profile")}`,
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
  const errors = [];

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
      errors.push(
        msg.params.exceptionDetails.exception?.description ||
          msg.params.exceptionDetails.text,
      );
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
    const box = JSON.parse(
      await evaluate(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return "null";
        el.scrollIntoView({ block: "center", behavior: "instant" });
        const r = el.getBoundingClientRect();
        return JSON.stringify({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      })()`),
    );
    if (!box) throw new Error("cannot tap, missing: " + selector);
    for (const type of ["mousePressed", "mouseReleased"]) {
      await send("Input.dispatchMouseEvent", {
        type,
        x: box.x,
        y: box.y,
        button: "left",
        clickCount: 1,
      });
      await sleep(70);
    }
  };

  const fail = [];
  const check = (label, cond, detail = "") => {
    console.log(`  ${cond ? "PASS" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`);
    if (!cond) fail.push(label);
  };

  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url: BASE });
  await sleep(4200);

  /* ---------------- 1. Anchors ---------------- */
  console.log("\n--- Section anchors ---");
  const anchors = JSON.parse(
    await evaluate(`JSON.stringify(${JSON.stringify(EXPECTED_ANCHORS)}.map(id => {
      const el = document.getElementById(id);
      return { id, found: !!el, h: el ? Math.round(el.getBoundingClientRect().height) : 0 };
    }))`),
  );
  for (const a of anchors) {
    check(`#${a.id} exists`, a.found, a.found ? `${a.h}px tall` : "MISSING");
  }

  /* ---------------- 2. Gallery filter ---------------- */
  console.log("\n--- Gallery filtering ---");
  const initial = await evaluate(
    `document.querySelectorAll('#gallery ul li').length`,
  );
  check("gallery renders all items", initial === 42, `${initial} cards (expected 42)`);

  // Click the "SaaS & AI" filter tab (second tab, index 1).
  await tap('#gallery [role="tab"]:nth-of-type(2)');
  await sleep(1100);
  const filtered = await evaluate(
    `document.querySelectorAll('#gallery ul li').length`,
  );
  check("SaaS filter reduces count", filtered === 12, `${filtered} cards (expected 12)`);

  // Back to "all"
  await tap('#gallery [role="tab"]:nth-of-type(1)');
  await sleep(1100);
  const restored = await evaluate(
    `document.querySelectorAll('#gallery ul li').length`,
  );
  check("clearing filter restores all", restored === 42, `${restored} cards`);

  /* ---------------- 2b. Counts agree everywhere ---------------- */
  console.log("\n--- Derived count consistency ---");
  const countCheck = JSON.parse(
    await evaluate(`(() => {
      const body = document.body.innerText;

      // Hero pills: each renders "<emoji><label><n> components" in one <a>.
      // Summing them must equal the real gallery total.
      const pillHrefs = ['#saas', '#local-business', '#b2b-agency', '#ecommerce'];
      const pillNums = pillHrefs.map(h => {
        const a = [...document.querySelectorAll('a[href="' + h + '"]')]
          .find(el => /components/.test(el.textContent));
        const m = a ? a.textContent.match(/(\\d+)\\s*components/) : null;
        return m ? Number(m[1]) : 0;
      });

      const cards = document.querySelectorAll('#gallery ul li').length;

      return JSON.stringify({
        pillNums,
        pillSum: pillNums.reduce((a, b) => a + b, 0),
        cards,
        mentions40Plus: /40\\+/.test(body),
        tabCounts: [...document.querySelectorAll('#gallery [role="tab"]')]
          .map(t => t.textContent.trim()),
      });
    })()`),
  );
  check(
    "hero pill counts sum to the real total",
    countCheck.pillSum === countCheck.cards && countCheck.cards === 42,
    `${countCheck.pillNums.join(" + ")} = ${countCheck.pillSum}, ${countCheck.cards} cards`,
  );
  check(
    "no stale '40+' claim remains",
    countCheck.mentions40Plus === false,
    countCheck.mentions40Plus ? "FOUND '40+'" : "clean",
  );
  check(
    "filter tab counts rendered",
    countCheck.tabCounts.length === 5,
    countCheck.tabCounts.join(" | "),
  );

  /* ---------------- 3. FAQ accordion ---------------- */
  console.log("\n--- FAQ accordion ---");
  const faqState = async () =>
    JSON.parse(
      await evaluate(`JSON.stringify(
        [...document.querySelectorAll('#faq button[aria-expanded]')].map(b => ({
          expanded: b.getAttribute('aria-expanded') === 'true',
          hasPanel: !!document.getElementById(b.getAttribute('aria-controls')),
        }))
      )`),
    );

  let faq = await faqState();
  check("6 FAQ items present", faq.length === 6, `${faq.length} rows`);
  check("first item open by default", faq[0].expanded === true);
  check("others closed by default", faq.slice(1).every((f) => !f.expanded));

  // Open the third question.
  await tap("#faq button[aria-expanded]:nth-of-type(1)");
  await sleep(150);
  await evaluate(`document.querySelectorAll('#faq button[aria-expanded]')[2].click()`);
  await sleep(700);
  faq = await faqState();
  check("clicking a row opens it", faq[2].expanded === true);
  check("panel element now rendered", faq[2].hasPanel === true);
  check("previously open row closed", faq[0].expanded === false);

  /* ---------------- 4. Pricing CTA ---------------- */
  console.log("\n--- Pricing ---");
  const pricing = JSON.parse(
    await evaluate(`(() => {
      const sec = document.getElementById('pricing');
      const price = sec ? sec.textContent.match(/\\$29/) : null;
      const cta = sec ? sec.querySelector('a[href^="#"]') : null;
      const features = sec ? sec.querySelectorAll('ul li').length : 0;
      return JSON.stringify({
        hasPrice: !!price,
        hasCta: !!cta,
        ctaText: cta ? cta.textContent.trim().slice(0, 30) : null,
        features,
      });
    })()`),
  );
  check("pricing shows $29", pricing.hasPrice === true);
  check("pricing CTA present", pricing.hasCta === true, pricing.ctaText || "");
  check("pricing lists features", pricing.features >= 8, `${pricing.features} list items`);

  /* ---------------- 5. Footer ---------------- */
  console.log("\n--- Footer ---");
  const footer = JSON.parse(
    await evaluate(`(() => {
      const f = document.querySelector('footer');
      if (!f) return JSON.stringify({ found: false });
      return JSON.stringify({
        found: true,
        navs: f.querySelectorAll('nav').length,
        links: f.querySelectorAll('a[href^="#"]').length,
        backToTop: !!f.querySelector('button'),
        year: f.textContent.includes(String(new Date().getFullYear())),
      });
    })()`),
  );
  check("footer renders", footer.found === true);
  check("footer has 3 link columns", footer.navs === 3, `${footer.navs} navs`);
  check("footer back-to-top button", footer.backToTop === true);
  check("footer shows current year", footer.year === true);

  /* ---------------- 6. Every nav link resolves ---------------- */
  console.log("\n--- Nav link integrity ---");
  const navCheck = JSON.parse(
    await evaluate(`JSON.stringify(
      [...document.querySelectorAll('header a[href^="#"]')]
        .map(a => a.getAttribute('href'))
        .filter(h => h && h !== '#top')
        .map(h => ({ href: h, resolves: !!document.getElementById(h.slice(1)) }))
    )`),
  );
  const broken = navCheck.filter((n) => !n.resolves);
  check(
    "all header nav links resolve",
    broken.length === 0,
    broken.length ? broken.map((b) => b.href).join(", ") : `${navCheck.length} links`,
  );

  /* ---------------- Full-page screenshot ---------------- */
  const metrics = await evaluate(
    `JSON.stringify({ h: document.documentElement.scrollHeight })`,
  );
  const { h } = JSON.parse(metrics);
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: 1440, height: Math.min(h, 12000), scale: 0.42 },
  });
  fs.writeFileSync(
    path.join(OUT, "fullpage.png"),
    Buffer.from(shot.data, "base64"),
  );
  console.log(`\nFull-page screenshot captured (${h}px tall).`);

  console.log("\nCONSOLE ERRORS:", errors.length ? errors : "none");
  console.log("RESULT:", fail.length ? `FAIL (${fail.length})` : "ALL PASS");

  sock.close();
  child.kill();
  process.exit(fail.length ? 1 : 0);
})();
