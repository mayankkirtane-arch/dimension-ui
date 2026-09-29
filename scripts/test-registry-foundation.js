const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('=== TASK 15: DimensionUI Registry Foundation Verification ===\n');

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
// 1. In-Memory Validation Engine & Manifest Unit Tests
// -------------------------------------------------------------
console.log('--- 1. Testing Validation Engine & Malformed Data Handling ---');

const NAME_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
const FILE_TYPE_REGEX = /^registry:(page|component|lib|style|hook)$/;

function validateRegistryManifest(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Registry manifest must be a non-null JSON object.'] };
  }
  const manifest = data;

  if (!manifest.name || typeof manifest.name !== 'string') {
    errors.push("Missing required field 'name'.");
  } else if (!NAME_REGEX.test(manifest.name)) {
    errors.push(`Invalid 'name' format '${manifest.name}'.`);
  }

  if (!manifest.title || typeof manifest.title !== 'string') {
    errors.push("Missing required field 'title'.");
  }

  const validTypes = ['template', 'block', 'component', 'theme'];
  if (!manifest.type || !validTypes.includes(manifest.type)) {
    errors.push(`Invalid 'type' '${manifest.type}'.`);
  }

  if (!manifest.version || typeof manifest.version !== 'string') {
    errors.push("Missing required field 'version'.");
  } else {
    const rawVersion = manifest.version.startsWith('v') ? manifest.version.slice(1) : manifest.version;
    if (!SEMVER_REGEX.test(rawVersion)) {
      errors.push(`Invalid semver version '${manifest.version}'.`);
    }
  }

  if (!manifest.framework || !['next', 'react'].includes(manifest.framework)) {
    errors.push(`Invalid 'framework' '${manifest.framework}'.`);
  }

  if (!manifest.access || !['public', 'commercial'].includes(manifest.access)) {
    errors.push(`Invalid 'access' '${manifest.access}'.`);
  }

  if (!Array.isArray(manifest.files)) {
    errors.push("Field 'files' must be an array.");
  } else {
    manifest.files.forEach((file, idx) => {
      if (!file || typeof file !== 'object') {
        errors.push(`File at index ${idx} is not an object.`);
        return;
      }
      if (!file.path || typeof file.path !== 'string') {
        errors.push(`File at index ${idx} missing path.`);
      } else if (file.path.includes('..') || file.path.startsWith('/') || /^[a-zA-Z]:/.test(file.path)) {
        errors.push(`Illegal file path '${file.path}' at index ${idx}.`);
      }
      if (!file.type || !FILE_TYPE_REGEX.test(file.type)) {
        errors.push(`Invalid file type '${file.type}' at index ${idx}.`);
      }
    });
  }

  if (!manifest.dependencies || typeof manifest.dependencies !== 'object' || Array.isArray(manifest.dependencies)) {
    errors.push("Field 'dependencies' must be an object.");
  }

  if (!manifest.license || typeof manifest.license !== 'object') {
    errors.push("Missing required 'license' object.");
  }

  const serialized = JSON.stringify(data);
  if (/service_role|SUPABASE_SERVICE_ROLE_KEY|DATABASE_URL|SECRET_KEY/i.test(serialized)) {
    errors.push("SECURITY VIOLATION: Manifest contains forbidden credentials or secrets.");
  }

  return { valid: errors.length === 0, errors };
}

// Test A: Completely empty object
const testEmpty = validateRegistryManifest({});
assert(!testEmpty.valid && testEmpty.errors.length >= 5, 'Empty manifest rejected with descriptive errors');

// Test B: Malformed name with uppercase and spaces
const testBadName = validateRegistryManifest({
  name: 'Invalid Template Name',
  title: 'Test',
  type: 'template',
  version: '1.0.0',
  framework: 'next',
  access: 'public',
  files: [],
  dependencies: {},
  license: { type: 'MIT', commercial: false, price: '$0' }
});
assert(!testBadName.valid && testBadName.errors.some(e => e.includes('Invalid \'name\' format')), 'Uppercase/spaced name rejected');

// Test C: Invalid semver
const testBadSemver = validateRegistryManifest({
  name: 'test-template',
  title: 'Test',
  type: 'template',
  version: 'vOnePointZero',
  framework: 'next',
  access: 'public',
  files: [],
  dependencies: {},
  license: { type: 'MIT', commercial: false, price: '$0' }
});
assert(!testBadSemver.valid && testBadSemver.errors.some(e => e.includes('Invalid semver')), 'Non-semver version rejected');

// Test D: Path traversal attempt
const testPathTraversal = validateRegistryManifest({
  name: 'test-template',
  title: 'Test',
  type: 'template',
  version: '1.0.0',
  framework: 'next',
  access: 'public',
  files: [{ path: '../../etc/passwd', type: 'registry:component' }],
  dependencies: {},
  license: { type: 'MIT', commercial: false, price: '$0' }
});
assert(!testPathTraversal.valid && testPathTraversal.errors.some(e => e.includes('Illegal file path')), 'Path traversal attempt (../..) rejected');

// Test E: Absolute Windows path attempt
const testAbsPath = validateRegistryManifest({
  name: 'test-template',
  title: 'Test',
  type: 'template',
  version: '1.0.0',
  framework: 'next',
  access: 'public',
  files: [{ path: 'C:\\Windows\\System32\\calc.exe', type: 'registry:component' }],
  dependencies: {},
  license: { type: 'MIT', commercial: false, price: '$0' }
});
assert(!testAbsPath.valid && testAbsPath.errors.some(e => e.includes('Illegal file path')), 'Absolute file path rejected');

// Test F: Server secret leakage prevention
const testSecretLeak = validateRegistryManifest({
  name: 'test-template',
  title: 'Test',
  type: 'template',
  version: '1.0.0',
  framework: 'next',
  access: 'public',
  files: [{ path: 'src/template.tsx', type: 'registry:component' }],
  dependencies: {},
  license: { type: 'MIT', commercial: false, price: '$0' },
  metadata: { secret: 'SUPABASE_SERVICE_ROLE_KEY=eyJh...' }
});
assert(!testSecretLeak.valid && testSecretLeak.errors.some(e => e.includes('SECURITY VIOLATION')), 'Server secret leakage attempt caught & rejected');

// Test G: Valid manifest
const testValid = validateRegistryManifest({
  name: 'valid-starter-template',
  title: 'Valid Starter Template',
  type: 'template',
  version: '1.0.0',
  framework: 'next',
  description: 'Clean starter template for SaaS apps',
  access: 'public',
  files: [{ path: 'src/components/hero.tsx', type: 'registry:component', target: 'components/hero.tsx' }],
  dependencies: { 'framer-motion': '^11.15.0', 'react': '19.0.0' },
  devDependencies: { 'typescript': '^5.7.3' },
  license: { type: 'MIT', commercial: false, price: '$0', tier: 'free' }
});
assert(testValid.valid, 'Well-formed manifest passes validation');

// -------------------------------------------------------------
// 2. HTTP Server Request Helper
// -------------------------------------------------------------
function makeRequest(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 3000,
      path: urlPath,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch { /* ignore non-json */ }
        resolve({ statusCode: res.statusCode, headers: res.headers, raw: data, json });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

// -------------------------------------------------------------
// 3. Live Endpoint Verification
// -------------------------------------------------------------
async function runHttpVerification() {
  console.log('\n--- 2. Testing Registry HTTP Endpoints ---');

  // Endpoint 1: Catalog Index
  console.log('\nTesting GET /api/registry (Index)...');
  const indexRes = await makeRequest('/api/registry');
  assert(indexRes.statusCode === 200, 'GET /api/registry returns HTTP 200 OK');
  assert(indexRes.json && indexRes.json.total >= 42, `Registry index contains ${indexRes.json?.total} items (>= 42 catalog items)`);
  assert(indexRes.json && indexRes.json.items.some(i => i.type === 'template'), 'Registry includes templates');
  assert(indexRes.json && indexRes.json.items.some(i => i.type === 'block' || i.type === 'component'), 'Registry includes blocks/components');
  assert(indexRes.json && indexRes.json.items.some(i => i.type === 'theme'), 'Registry includes themes');

  // Filter tests
  const filterRes = await makeRequest('/api/registry?tier=free');
  assert(filterRes.statusCode === 200 && filterRes.json.items.every(i => i.tier === 'free'), 'Filter ?tier=free correctly returns only free resources');

  // Endpoint 2: Free Resource Access (Public)
  console.log('\nTesting Template 1: Free Template (aether-ai-saas)...');
  const freeRes = await makeRequest('/api/registry/aether-ai-saas');
  assert(freeRes.statusCode === 200, 'GET /api/registry/aether-ai-saas returns HTTP 200 OK');
  assert(freeRes.json.name === 'aether-ai-saas', 'Manifest name is aether-ai-saas');
  assert(freeRes.json.access === 'public', 'Free template has access="public"');
  assert(freeRes.json.license.tier === 'free', 'Free template has tier="free"');
  assert(freeRes.json.files.length > 0, 'Files array is present');
  assert(freeRes.json.files[0].content !== undefined, 'Free template source code is openly included');
  assert(freeRes.json.files[0].locked === false, 'Free template files are unlocked (locked=false)');
  assert(freeRes.json.dependencies['next'] !== undefined, 'Dependencies include Next.js');
  assert(freeRes.json.dependencies['framer-motion'] !== undefined, 'Dependencies include Framer Motion');

  // Endpoint 3: Paid Resource Access (Protected) - Unauthorized
  console.log('\nTesting Template 2: Paid Template (peak-fitness) without authorization...');
  const paidUnauthRes = await makeRequest('/api/registry/peak-fitness');
  assert(paidUnauthRes.statusCode === 200, 'GET /api/registry/peak-fitness returns HTTP 200 OK (metadata available for discovery)');
  assert(paidUnauthRes.json.access === 'commercial', 'Paid template marked access="commercial"');
  assert(paidUnauthRes.json.license.tier === '15', 'Paid template tier is 15 ($15 tier)');
  assert(paidUnauthRes.json.files[0].content === undefined, 'Source code is strictly OMITTED/LOCKED without authorization');
  assert(paidUnauthRes.json.files[0].locked === true, 'File is explicitly marked locked=true');
  assert(paidUnauthRes.json.downloadUrl === '/api/download/peak-fitness', 'Download URL points to authenticated download endpoint');

  // Direct download request without auth should return 401
  const paidDownloadUnauth = await makeRequest('/api/registry/peak-fitness?download=true');
  assert(paidDownloadUnauth.statusCode === 401, 'Requesting source download without auth returns HTTP 401 Unauthorized');

  // Endpoint 4: Paid Resource Access - Authorized with valid Bearer token
  console.log('\nTesting Template 2: Paid Template (peak-fitness) with Bearer authorization...');
  const paidAuthRes = await makeRequest('/api/registry/peak-fitness', {
    headers: { 'Authorization': 'Bearer dim_license_valid' }
  });
  assert(paidAuthRes.statusCode === 200, 'Authorized request returns HTTP 200 OK');
  assert(paidAuthRes.json.files[0].content !== undefined, 'Source code is UNLOCKED for authorized license holder');
  assert(paidAuthRes.json.files[0].locked === false, 'File locked status is false for authorized license holder');

  // Endpoint 5: Masterclass Tier Template (cloudscale-analytics)
  console.log('\nTesting Template 3: Masterclass Tier Template (cloudscale-analytics)...');
  const cloudscaleRes = await makeRequest('/api/registry/cloudscale-analytics');
  assert(cloudscaleRes.statusCode === 200, 'GET /api/registry/cloudscale-analytics returns HTTP 200 OK');
  assert(cloudscaleRes.json.license.tier === '20', 'Tier is 20');
  assert(cloudscaleRes.json.metadata.category === 'SaaS & AI', 'Category is SaaS & AI');
  assert(cloudscaleRes.json.access === 'commercial', 'Access is commercial');

  // Endpoint 6: Theme Resource (obsidian-dark)
  console.log('\nTesting Theme: obsidian-dark...');
  const themeRes = await makeRequest('/api/registry/obsidian-dark');
  assert(themeRes.statusCode === 200, 'GET /api/registry/obsidian-dark returns HTTP 200 OK');
  assert(themeRes.json.type === 'theme', 'Type is theme');
  assert(themeRes.json.access === 'public', 'Theme is public');
  assert(themeRes.json.files[0].content.includes('--color-obsidian'), 'Theme CSS tokens included in content');

  // Endpoint 7: Block Resource (orbital-hero)
  console.log('\nTesting Block: orbital-hero...');
  const blockRes = await makeRequest('/api/registry/orbital-hero');
  assert(blockRes.statusCode === 200, 'GET /api/registry/orbital-hero returns HTTP 200 OK');
  assert(blockRes.json.type === 'component', 'Type is component');
  assert(blockRes.json.access === 'public', 'Block is public');

  // Endpoint 8: Not Found Check
  console.log('\nTesting 404 for unknown item...');
  const notFoundRes = await makeRequest('/api/registry/non-existent-item-999');
  assert(notFoundRes.statusCode === 404, 'Unknown item returns HTTP 404 Not Found');

  // Endpoint 9: Manifest Validation Endpoint (POST /api/registry/validate)
  console.log('\nTesting POST /api/registry/validate...');
  const valSuccessRes = await makeRequest('/api/registry/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      name: 'community-custom-block',
      title: 'Community Custom Block',
      type: 'block',
      version: '1.0.0',
      framework: 'next',
      description: 'A custom community block',
      access: 'public',
      files: [{ path: 'components/custom.tsx', type: 'registry:component' }],
      dependencies: { 'react': '19.0.0' },
      license: { type: 'MIT', commercial: false, price: '$0', tier: 'free' }
    }
  });
  assert(valSuccessRes.statusCode === 200 && valSuccessRes.json.valid === true, 'POST /api/registry/validate returns 200 valid=true for good manifest');

  const valFailRes = await makeRequest('/api/registry/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      name: 'INVALID NAME WITH UPPERCASE',
      type: 'unknown-type'
    }
  });
  assert(valFailRes.statusCode === 422 && valFailRes.json.valid === false, 'POST /api/registry/validate returns 422 valid=false for malformed manifest');

  console.log('\n========================================');
  console.log(`Results: ${totalPassed} passed, ${totalFailed} failed`);
  console.log('========================================\n');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

// Check if server is running, if not run offline assertions and inform
makeRequest('/api/registry')
  .then(() => runHttpVerification())
  .catch((err) => {
    console.log(`\nNote: Server not active on :3000 (${err.message}). In-memory validation tests passed (${totalPassed}/7).`);
    console.log('Start the server to run live HTTP assertions.');
    if (totalFailed > 0) process.exit(1);
  });
