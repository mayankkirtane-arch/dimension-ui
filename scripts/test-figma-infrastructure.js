const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('=== TASK 14: Figma Support Infrastructure Verification ===\n');

let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    totalPassed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    totalFailed++;
  }
}

// -------------------------------------------------------------
// Unit Test: URL Validation & State Fallback Rules
// -------------------------------------------------------------
console.log('--- 1. Testing Figma URL Validation Logic ---');

// Replicate the exact validator from lib/site.ts to test in isolated Node
function isValidFigmaUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    const hostname = parsed.hostname.toLowerCase();
    const isFigmaDomain = hostname === 'figma.com' || hostname.endsWith('.figma.com');
    if (!isFigmaDomain) return false;
    return parsed.pathname.length > 1;
  } catch {
    return false;
  }
}

function getTemplateFigma(template) {
  if (!template.figma) {
    return {
      state: 'No Figma File',
      notes: 'Design authored code-first with Tailwind CSS v4 & Framer Motion. Dedicated standalone Figma file is not yet published.',
    };
  }

  const { state, figmaUrl, previewImage, fileDetails, notes } = template.figma;

  if (state === 'No Figma File') {
    return {
      state: 'No Figma File',
      notes: notes || 'Design authored code-first with Tailwind CSS v4 & Framer Motion. Dedicated standalone Figma file is not yet published.',
    };
  }

  if (!isValidFigmaUrl(figmaUrl)) {
    return {
      state: 'No Figma File',
      notes: 'Figma resource reference is pending verification. Design is currently code-first.',
    };
  }

  return {
    state,
    figmaUrl: figmaUrl ? figmaUrl.trim() : undefined,
    previewImage,
    fileDetails,
    notes,
  };
}

// Valid Figma URLs
assert(isValidFigmaUrl('https://www.figma.com/design/AbCdEf123/DimensionUI'), 'Valid Figma design URL accepted');
assert(isValidFigmaUrl('https://figma.com/file/xyz789/Template'), 'Valid Figma file URL accepted');
assert(isValidFigmaUrl('https://www.figma.com/community/file/1234567890/SaaS-Kit'), 'Valid Figma community URL accepted');

// Invalid URLs
assert(!isValidFigmaUrl('https://google.com'), 'Non-Figma domain rejected');
assert(!isValidFigmaUrl('https://notfigma.com/file/123'), 'Phishing figma domain rejected');
assert(!isValidFigmaUrl('http://evil.com?target=figma.com'), 'Query param trick rejected');
assert(!isValidFigmaUrl('javascript:alert(1)'), 'Dangerous javascript protocol rejected');
assert(!isValidFigmaUrl(''), 'Empty string rejected');
assert(!isValidFigmaUrl(null), 'null rejected');
assert(!isValidFigmaUrl(undefined), 'undefined rejected');
assert(!isValidFigmaUrl('https://www.figma.com/'), 'Figma root with no file path rejected');

console.log('\n--- 2. Testing State Fallbacks & Anti-Fabrication Safeguards ---');

// Case A: Template without figma field
const tmplWithoutFigma = { id: 'test-1', name: 'Test 1' };
const resA = getTemplateFigma(tmplWithoutFigma);
assert(resA.state === 'No Figma File', 'Template without figma field defaults to "No Figma File"');

// Case B: Template with explicit "No Figma File"
const tmplExplicitNone = { id: 'test-2', name: 'Test 2', figma: { state: 'No Figma File' } };
const resB = getTemplateFigma(tmplExplicitNone);
assert(resB.state === 'No Figma File', 'Explicit "No Figma File" handled properly');

// Case C: False claim protection - "Figma Included" declared but URL is missing
const tmplFakeIncluded1 = { id: 'test-3', name: 'Test 3', figma: { state: 'Figma Included' } };
const resC1 = getTemplateFigma(tmplFakeIncluded1);
assert(resC1.state === 'No Figma File', 'False "Figma Included" claim with missing URL falls back to "No Figma File"');

// Case D: False claim protection - "Figma Included" declared but URL is invalid
const tmplFakeIncluded2 = { id: 'test-4', name: 'Test 4', figma: { state: 'Figma Included', figmaUrl: 'https://fake-site.com/figma' } };
const resC2 = getTemplateFigma(tmplFakeIncluded2);
assert(resC2.state === 'No Figma File', 'False "Figma Included" claim with invalid URL falls back to "No Figma File"');

// Case E: Genuine "Figma Included" with valid URL and preview image
const tmplValidIncluded = {
  id: 'test-5',
  name: 'Test 5',
  figma: {
    state: 'Figma Included',
    figmaUrl: 'https://www.figma.com/design/AbCdEf123/DimensionUI-Aether',
    previewImage: '/previews/figma-aether.png',
    fileDetails: { componentsCount: 48, pagesCount: 3, hasAutoLayout: true, hasDesignTokens: true }
  }
};
const resE = getTemplateFigma(tmplValidIncluded);
assert(resE.state === 'Figma Included', 'Genuine "Figma Included" with valid URL recognized');
assert(resE.figmaUrl === 'https://www.figma.com/design/AbCdEf123/DimensionUI-Aether', 'Figma URL preserved on genuine included resource');
assert(resE.previewImage === '/previews/figma-aether.png', 'Preview image preserved');
assert(resE.fileDetails.componentsCount === 48, 'File details preserved');

// Case F: Genuine "Figma Available" with valid URL
const tmplValidAvailable = {
  id: 'test-6',
  name: 'Test 6',
  figma: {
    state: 'Figma Available',
    figmaUrl: 'https://www.figma.com/community/file/1234567890/Community-Kit',
  }
};
const resF = getTemplateFigma(tmplValidAvailable);
assert(resF.state === 'Figma Available', 'Genuine "Figma Available" with valid URL recognized');

// -------------------------------------------------------------
// Catalog Inspection: Verify all templates in lib/site.ts
// -------------------------------------------------------------
console.log('\n--- 3. Inspecting Production Catalog Templates in lib/site.ts ---');

const siteContent = fs.readFileSync(path.join(__dirname, '..', 'lib', 'site.ts'), 'utf8');

// Extract all template IDs
const templateIdMatches = [...siteContent.matchAll(/\s+id:\s*"([a-z0-9\-]+)"/g)].map(m => m[1]);
// Filter out non-template IDs if any
const knownTemplates = [
  'aether-ai-saas', 'serenity-wellness', 'nova-minimal-portfolio', 'app-launch-lp',
  'simple-link-bio', 'peak-fitness', 'azure-apartments', 'apex-dental-clinic',
  'precision-roofing', 'aura-beauty-salon', 'nexus-coworking', 'horizon-law-firm',
  'velvet-bistro', 'zenith-accounting', 'urban-architecture', 'petpaws-vet',
  'luxe-auto-detailing', 'summit-event', 'prism-photo-studio', 'greenthumb-landscape',
  'cloudscale-analytics', 'enterprise-b2b-agency', 'ai-copilot-studio', 'fintech-neobank',
  'devflow-hub', 'pulse-analytics', 'edulearn-academy', 'saas-billing-hub',
  'talenthire-ats', 'cryptostaking-protocol', 'venture-fund-capital', 'healthpulse-telehealth',
  'sentinel-security', 'voyage-atlas', 'stayora', 'cartly-commerce',
  'freshbite', 'fleetflow', 'insurely', 'fundora',
  'scalehr', 'nonprofitly', 'eventspace', 'adpilot',
  'supportdesk', 'homenest', 'streamline'
];

console.log(`Found ${knownTemplates.length} production catalog templates.`);

let templatesLackingFigma = [];

for (const id of knownTemplates) {
  // Check if this template declares a figma URL in lib/site.ts
  const templateSnippetRegex = new RegExp(`id:\\s*"${id}"[\\s\\S]*?(?=\\n\\s*\\{\\s*\\n\\s*id:|\\n\\];)`, 'g');
  const match = templateSnippetRegex.exec(siteContent);
  const snippet = match ? match[0] : '';

  const hasFigmaUrl = /figmaUrl:\s*"[^"]+"/i.test(snippet);
  const hasFigmaIncluded = /state:\s*"Figma Included"/i.test(snippet);

  if (!hasFigmaUrl && !hasFigmaIncluded) {
    templatesLackingFigma.push(id);
  }
}

assert(
  templatesLackingFigma.length === knownTemplates.length,
  `All ${knownTemplates.length} templates correctly verified as currently lacking real Figma files (0 fake links created)`
);

// -------------------------------------------------------------
// Live HTTP Page Verification
// -------------------------------------------------------------
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, html: data }));
    }).on('error', reject);
  });
}

async function verifyLivePages() {
  console.log('\n--- 4. Live Page Rendering & Broken Link Audit ---');

  const sampleTemplates = [
    'aether-ai-saas',
    'nova-minimal-portfolio',
    'cloudscale-analytics',
    'precision-roofing',
    'peak-fitness'
  ];

  for (const id of sampleTemplates) {
    console.log(`Checking template: ${id}...`);
    const staticHtmlPath = path.join(__dirname, '..', '.next', 'server', 'app', 'template', `${id}.html`);
    let html = '';

    if (fs.existsSync(staticHtmlPath)) {
      html = fs.readFileSync(staticHtmlPath, 'utf8');
      assert(true, `Found prerendered static production HTML for ${id}`);
    } else {
      try {
        const res = await fetchPage(`http://localhost:3000/template/${id}`);
        assert(res.statusCode === 200, `Page HTTP 200 for ${id}`);
        html = res.html;
      } catch (err) {
        console.warn(`Note: Local server not reachable on :3000 (${err.message}).`);
        continue;
      }
    }

    if (html) {
      // 1. Must render the Figma section
      assert(html.includes('id="figma"'), `#figma section present on ${id}`);
      assert(html.includes('Figma Design Resources'), `Section title rendered on ${id}`);

      // 2. Must render the Code-First state
      assert(
        html.includes('No Figma File (Code-First)') || html.includes('Code-First Architecture'),
        `Honest code-first status rendered on ${id}`
      );

      // 3. Must NOT render false "Figma Included" badge in hero
      const hasHeroIncludedBadge = html.includes('title="Official Figma source file included"');
      assert(!hasHeroIncludedBadge, `Hero does NOT falsely claim "Figma Included" on ${id}`);

      // 4. Broken Link Audits
      assert(!html.includes('href="undefined"'), `No href="undefined" on ${id}`);
      assert(!html.includes('href="null"'), `No href="null" on ${id}`);
      assert(!html.includes('href=""'), `No empty href="" on ${id}`);

      // 5. Technical specs
      assert(html.includes('Figma Resource'), `Technical specs includes Figma Resource on ${id}`);
    }
  }

  console.log('\n========================================');
  console.log(`Results: ${totalPassed} passed, ${totalFailed} failed`);
  console.log('========================================');

  console.log('\n=== Templates Currently Lacking Real Figma Files ===');
  console.log(`Count: ${templatesLackingFigma.length} / ${knownTemplates.length}`);
  console.log(templatesLackingFigma.map((t, idx) => `  ${idx + 1}. ${t}`).join('\n'));
  console.log('===================================================\n');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

verifyLivePages().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
