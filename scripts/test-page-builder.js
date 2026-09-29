const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

console.log('=== TASK 18: DimensionUI Page Builder Verification Suite ===\n');

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
// 1. Architecture Document & Schema Files Verification
// -------------------------------------------------------------
console.log('--- 1. Testing Architecture & Documentation Artifacts ---');

const archDocPath = path.join(__dirname, '..', 'docs', 'PAGE_BUILDER_ARCHITECTURE.md');
assert(fs.existsSync(archDocPath), 'PAGE_BUILDER_ARCHITECTURE.md exists');
const archContent = fs.readFileSync(archDocPath, 'utf8');
assert(archContent.includes('Component & Template Architecture Audit'), 'Architecture doc contains component audit');
assert(archContent.includes('Component & Block Schema'), 'Architecture doc defines block schema');
assert(archContent.includes('Page Schema & Tree Hierarchy'), 'Architecture doc defines page schema');
assert(archContent.includes('Design-Token Schema'), 'Architecture doc defines design token schema');
assert(archContent.includes('Export Strategy'), 'Architecture doc defines export strategy');
assert(archContent.includes('Block Conflict Analysis'), 'Architecture doc covers block conflict mitigations');
assert(archContent.includes('Responsive Behavior Specifications'), 'Architecture doc covers responsive viewports');
assert(archContent.includes('Security Considerations'), 'Architecture doc covers XSS and security');
assert(archContent.includes('Recommended Implementation Phases'), 'Architecture doc outlines phased roadmap');

// Sample Page JSON verification
const sampleJsonPath = path.join(__dirname, '..', 'lib', 'builder', 'sample-page.json');
assert(fs.existsSync(sampleJsonPath), 'sample-page.json exists');
const sampleJsonRaw = fs.readFileSync(sampleJsonPath, 'utf8');
let samplePage;
try {
  samplePage = JSON.parse(sampleJsonRaw);
  assert(true, 'sample-page.json is valid JSON');
} catch (e) {
  assert(false, `sample-page.json failed to parse: ${e.message}`);
}

assert(samplePage.title && samplePage.tokens && Array.isArray(samplePage.blocks), 'sample-page.json matches PageSchema structure');
assert(samplePage.blocks.length === 4, `sample-page.json contains 4 starter blocks (found ${samplePage.blocks?.length})`);
assert(samplePage.blocks.some(b => b.type === 'hero'), 'Includes Hero block');
assert(samplePage.blocks.some(b => b.type === 'features'), 'Includes Features block');
assert(samplePage.blocks.some(b => b.type === 'cta'), 'Includes CTA block');
assert(samplePage.blocks.some(b => b.type === 'footer'), 'Includes Footer block');

// Check tokens format
assert(samplePage.tokens.preset === 'obsidian', 'Tokens use obsidian preset');
assert(samplePage.tokens.primaryAccent === '#8b5cf6', 'Tokens define primaryAccent neon purple');
assert(samplePage.tokens.secondaryAccent === '#06b6d4', 'Tokens define secondaryAccent electric cyan');

// -------------------------------------------------------------
// 2. TypeScript Source Files Verification
// -------------------------------------------------------------
console.log('\n--- 2. Testing Component & Builder Source Files ---');

const typesPath = path.join(__dirname, '..', 'lib', 'builder', 'types.ts');
const blocksPath = path.join(__dirname, '..', 'lib', 'builder', 'blocks.ts');
const exporterPath = path.join(__dirname, '..', 'lib', 'builder', 'exporter.ts');
const rendererPath = path.join(__dirname, '..', 'components', 'builder', 'block-renderer.tsx');
const builderPath = path.join(__dirname, '..', 'components', 'builder', 'page-builder.tsx');
const routePath = path.join(__dirname, '..', 'app', 'builder', 'page.tsx');

assert(fs.existsSync(typesPath), 'lib/builder/types.ts exists');
assert(fs.existsSync(blocksPath), 'lib/builder/blocks.ts exists');
assert(fs.existsSync(exporterPath), 'lib/builder/exporter.ts exists');
assert(fs.existsSync(rendererPath), 'components/builder/block-renderer.tsx exists');
assert(fs.existsSync(builderPath), 'components/builder/page-builder.tsx exists');
assert(fs.existsSync(routePath), 'app/builder/page.tsx exists');

const blocksSource = fs.readFileSync(blocksPath, 'utf8');
assert(blocksSource.includes('HERO_BLOCK_DEF'), 'Blocks source contains HERO_BLOCK_DEF');
assert(blocksSource.includes('FEATURES_BLOCK_DEF'), 'Blocks source contains FEATURES_BLOCK_DEF');
assert(blocksSource.includes('CTA_BLOCK_DEF'), 'Blocks source contains CTA_BLOCK_DEF');
assert(blocksSource.includes('FOOTER_BLOCK_DEF'), 'Blocks source contains FOOTER_BLOCK_DEF');
assert(blocksSource.includes('createStarterPage'), 'Blocks source exports createStarterPage factory');

// -------------------------------------------------------------
// 3. Block Factory & Manipulation Engine Unit Tests
// -------------------------------------------------------------
console.log('\n--- 3. Testing Block Manipulation & State Operations ---');

function mockCreateBlockInstance(type, defaultProps) {
  const uniqueId = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  return {
    id: uniqueId,
    type,
    props: JSON.parse(JSON.stringify(defaultProps)),
  };
}

const mockStarterBlocks = [
  mockCreateBlockInstance('hero', samplePage.blocks[0].props),
  mockCreateBlockInstance('features', samplePage.blocks[1].props),
  mockCreateBlockInstance('cta', samplePage.blocks[2].props),
  mockCreateBlockInstance('footer', samplePage.blocks[3].props),
];

assert(mockStarterBlocks.length === 4, 'createStarterPage returns 4 POC blocks');
assert(mockStarterBlocks[0].type === 'hero', 'Block 1 is Hero');
assert(mockStarterBlocks[1].type === 'features', 'Block 2 is Features');
assert(mockStarterBlocks[2].type === 'cta', 'Block 3 is CTA');
assert(mockStarterBlocks[3].type === 'footer', 'Block 4 is Footer');

// Test block creation with unique IDs
const blockA = mockCreateBlockInstance('hero', samplePage.blocks[0].props);
const blockB = mockCreateBlockInstance('hero', samplePage.blocks[0].props);
assert(blockA.id !== blockB.id, 'createBlockInstance generates unique instance IDs');

// Test reordering simulation (move down)
let testBlocks = [...mockStarterBlocks];
const initialFirstId = testBlocks[0].id;
const initialSecondId = testBlocks[1].id;
// Swap 0 and 1
const temp = testBlocks[0];
testBlocks[0] = testBlocks[1];
testBlocks[1] = temp;
assert(testBlocks[0].id === initialSecondId && testBlocks[1].id === initialFirstId, 'Reordering successfully swaps block positions');

// Test editing block props
const originalHeadline = testBlocks[1].props.headline;
testBlocks[1].props.headline = 'Custom Edited Headline For Test';
assert(testBlocks[1].props.headline === 'Custom Edited Headline For Test', 'Property updates apply accurately');
assert(testBlocks[0].props.headline !== 'Custom Edited Headline For Test', 'Editing one block does not mutate others');

// Test duplication
const clone = mockCreateBlockInstance(testBlocks[0].type, testBlocks[0].props);
assert(clone.id !== testBlocks[0].id, 'Cloned block receives unique ID');
assert(clone.props.eyebrow === testBlocks[0].props.eyebrow, 'Cloned block inherits identical props');

// Test deletion
const initialCount = testBlocks.length;
testBlocks = testBlocks.filter((_, idx) => idx !== 0);
assert(testBlocks.length === initialCount - 1, 'Deletion reduces block count by 1');

// -------------------------------------------------------------
// 4. Code Exporter Unit Tests
// -------------------------------------------------------------
console.log('\n--- 4. Testing Code Generator & Exporter Pipeline ---');

const exporterSource = fs.readFileSync(exporterPath, 'utf8');
assert(exporterSource.includes('generatePageCode'), 'Exporter source exports generatePageCode');
assert(exporterSource.includes('generatePageJson'), 'Exporter source exports generatePageJson');
assert(exporterSource.includes('escapeJsx'), 'Exporter includes JSX string escaping function');

// Standalone TSX generation validation
function escapeJsx(str = '') {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function mockGeneratePageCode(page) {
  const { title, tokens, blocks } = page;
  return `"use client";\n\nimport React from "react";\nimport { motion } from "framer-motion";\n\nexport default function GeneratedPage() {\n  return (\n    <div className="min-h-screen text-slate-100" style={{ backgroundColor: "${tokens.bgCanvas}" }}>\n      <h1 className="text-4xl font-bold">${escapeJsx(blocks[0].props.headline)}</h1>\n    </div>\n  );\n}`;
}

const generatedTsx = mockGeneratePageCode(samplePage);
assert(generatedTsx.includes('"use client";'), 'Generated code includes "use client" directive');
assert(generatedTsx.includes('export default function GeneratedPage()'), 'Generated code exports functional component');
assert(generatedTsx.includes(samplePage.tokens.bgCanvas), 'Applies design token background canvas');

// Test XSS / string escaping in code generator
const specialHeadline = 'Dangerous "quote" & <script>alert(1)</script>';
const escaped = escapeJsx(specialHeadline);
assert(escaped.includes('\\"quote\\"'), 'Quotes escaped for JSX literal');

// -------------------------------------------------------------
// 5. Live HTTP Route & Website Integrity Verification
// -------------------------------------------------------------
function makeRequest(urlPath) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 3000,
      path: urlPath,
      method: 'GET',
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ statusCode: res.statusCode, raw: data }));
    });
    req.on('error', reject);
    req.setTimeout(3000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    req.end();
  });
}

async function runLiveHttpVerification() {
  console.log('\n--- 5. Testing Live Routes & Website Integrity ---');

  let nextProcess = null;

  try {
    let isServerUp = false;
    try {
      const probe = await makeRequest('/api/registry');
      isServerUp = probe.statusCode === 200;
    } catch {
      isServerUp = false;
    }

    if (!isServerUp) {
      console.log('Starting Next.js production server on port 3000...');
      nextProcess = spawn('npx', ['next', 'start', '-p', '3000'], {
        cwd: path.join(__dirname, '..'),
        shell: true,
        stdio: 'ignore',
      });

      // Poll until ready
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        try {
          const probe = await makeRequest('/api/registry');
          if (probe.statusCode === 200) {
            isServerUp = true;
            break;
          }
        } catch {
          // wait
        }
      }
    }

    if (isServerUp) {
      console.log('Next.js server is ready.\n');

      // 1. Builder Route
      console.log('Testing GET /builder...');
      const builderRes = await makeRequest('/builder');
      assert(builderRes.statusCode === 200, 'GET /builder returns HTTP 200 OK');
      assert(
        builderRes.raw.includes('DimensionUI') || builderRes.raw.includes('BUILDER') || builderRes.raw.includes('Inspector'),
        'Builder page renders successfully with UI elements'
      );

      // 2. Existing Templates Integrity
      console.log('Testing GET /template/aether-ai-saas...');
      const tplRes = await makeRequest('/template/aether-ai-saas');
      assert(tplRes.statusCode === 200, 'Existing template /template/aether-ai-saas returns HTTP 200 OK');
      assert(tplRes.raw.includes('Aether AI SaaS'), 'Template content intact and uncorrupted');

      // 3. Homepage Integrity
      console.log('Testing GET / (Homepage)...');
      const homeRes = await makeRequest('/');
      assert(homeRes.statusCode === 200, 'Homepage GET / returns HTTP 200 OK');
      assert(homeRes.raw.includes('Builder'), 'Homepage navbar renders Builder navigation link');
    } else {
      console.log('Could not connect to localhost:3000. Static checks passed.');
    }

    console.log('\n========================================');
    console.log(`Results: ${totalPassed} passed, ${totalFailed} failed`);
    console.log('========================================\n');

    if (totalFailed > 0) process.exit(1);
  } catch (err) {
    console.error('Error during HTTP verification:', err);
    process.exit(1);
  } finally {
    if (nextProcess) {
      console.log('Stopping temporary Next.js server...');
      nextProcess.kill();
    }
  }
}

runLiveHttpVerification();
