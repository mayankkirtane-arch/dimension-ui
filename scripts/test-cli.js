const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

console.log('=== TASK 16: DimensionUI CLI Test Suite ===\n');

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

const cliBin = path.join(__dirname, '..', 'packages', 'cli', 'bin', 'index.js');
const testCwd = path.join(__dirname, '..', 'test-sandbox-cli');

// Clean up sandbox if exists
if (fs.existsSync(testCwd)) {
  fs.rmSync(testCwd, { recursive: true, force: true });
}
fs.mkdirSync(testCwd, { recursive: true });

// Create a dummy package.json in test sandbox without framer-motion
fs.writeFileSync(
  path.join(testCwd, 'package.json'),
  JSON.stringify({
    name: 'test-app',
    version: '1.0.0',
    dependencies: {
      react: '19.0.0'
    }
  }, null, 2),
  'utf8'
);

function runCli(args, env = {}) {
  try {
    const stdout = execSync(`node "${cliBin}" ${args}`, {
      cwd: testCwd,
      encoding: 'utf8',
      env: { ...process.env, ...env }
    });
    return { status: 0, stdout, stderr: '' };
  } catch (err) {
    return {
      status: err.status || 1,
      stdout: err.stdout || '',
      stderr: err.stderr || err.message
    };
  }
}

// -------------------------------------------------------------
// Test 1: CLI Version and Help
// -------------------------------------------------------------
console.log('--- 1. Testing Help and Version Commands ---');
const helpRes = runCli('--help');
assert(helpRes.status === 0, 'CLI --help exits with code 0');
assert(helpRes.stdout.includes('USAGE:') && helpRes.stdout.includes('add <name>'), 'Help displays commands and usage');

const versionRes = runCli('--version');
assert(versionRes.status === 0 && versionRes.stdout.includes('dimensionui v1.0.0'), 'CLI --version returns version 1.0.0');

// -------------------------------------------------------------
// Test 2: List Command
// -------------------------------------------------------------
console.log('\n--- 2. Testing "list" Command ---');
const listJson = runCli('list --json');
assert(listJson.status === 0, 'dimensionui list --json exits with code 0');
const parsedList = JSON.parse(listJson.stdout);
assert(parsedList.total >= 42, `dimensionui list reports >= 42 items (found ${parsedList.total})`);

const listFilter = runCli('list --tier free --json');
assert(listFilter.status === 0, 'dimensionui list --tier free exits with code 0');
const parsedFree = JSON.parse(listFilter.stdout);
assert(parsedFree.items.every(i => i.tier === 'free'), 'Filter correctly isolates free items');

// -------------------------------------------------------------
// Test 3: Info Command
// -------------------------------------------------------------
console.log('\n--- 3. Testing "info" Command ---');
const infoRes = runCli('info aether-ai-saas');
assert(infoRes.status === 0, 'dimensionui info aether-ai-saas exits with code 0');
assert(infoRes.stdout.includes('Aether AI SaaS'), 'Info displays title');
assert(infoRes.stdout.includes('Dependencies:'), 'Info displays dependencies');
assert(infoRes.stdout.includes('Target Files:'), 'Info displays target files');

const infoJson = runCli('info aether-ai-saas --json');
assert(infoJson.status === 0, 'dimensionui info --json returns valid JSON');
const parsedInfo = JSON.parse(infoJson.stdout);
assert(parsedInfo.name === 'aether-ai-saas', 'Info JSON matches requested item');

// -------------------------------------------------------------
// Test 4: Invalid Item Handling
// -------------------------------------------------------------
console.log('\n--- 4. Testing Invalid Item Error Handling ---');
const invalidRes = runCli('info totally-fake-item-999');
assert(invalidRes.status === 1, 'Invalid item exits with non-zero code');
assert(invalidRes.stdout.includes('not found in registry') || invalidRes.stderr.includes('not found'), 'Clear error when item not found');

// -------------------------------------------------------------
// Test 5: Network Failure Handling
// -------------------------------------------------------------
console.log('\n--- 5. Testing Network Failure Handling ---');
const netFailRes = runCli('list --registry http://localhost:59999');
assert(netFailRes.status === 1, 'Unreachable registry exits with code 1');
assert(
  netFailRes.stdout.includes('Could not connect to DimensionUI registry') ||
  netFailRes.stderr.includes('Could not connect to DimensionUI registry'),
  'Graceful error explaining connection failure and registry URL flag'
);

// -------------------------------------------------------------
// Test 6: Add Command (Free Template & Dependency Detection)
// -------------------------------------------------------------
console.log('\n--- 6. Testing "add" Command with Free Template ---');
const addRes = runCli('add aether-ai-saas --yes');
assert(addRes.status === 0, 'dimensionui add aether-ai-saas --yes exits with code 0');
assert(addRes.stdout.includes('Found Aether AI SaaS'), 'Identified template correctly');
assert(addRes.stdout.includes('Installed components/templates/aether-ai-saas.tsx'), 'Reported file installation');
assert(addRes.stdout.includes('framer-motion'), 'Detected missing framer-motion dependency');

const installedFile = path.join(testCwd, 'components', 'templates', 'aether-ai-saas.tsx');
assert(fs.existsSync(installedFile), 'Target file written to disk');
const content = fs.readFileSync(installedFile, 'utf8');
assert(content.includes('AetherAiSaas') && content.includes('Waitlist email capture'), 'Installed file contains valid component code');

// -------------------------------------------------------------
// Test 7: File Conflict & Overwrite Protection
// -------------------------------------------------------------
console.log('\n--- 7. Testing Overwrite Conflict Protection ---');
// Modify the installed file to check overwrite behavior
fs.writeFileSync(installedFile, '// USER CUSTOM MODIFICATION', 'utf8');

// A: Running add with --yes should skip existing file rather than silently overwriting
const skipRes = runCli('add aether-ai-saas --yes');
assert(skipRes.status === 0, 'add exits with code 0 when skipping');
assert((skipRes.stdout + skipRes.stderr).includes('Skipping existing file'), 'Warned and skipped existing file instead of silent overwrite');
assert(fs.readFileSync(installedFile, 'utf8') === '// USER CUSTOM MODIFICATION', 'User modification preserved (not overwritten silently)');

// B: Running add with explicit --overwrite should overwrite
const overwriteRes = runCli('add aether-ai-saas --overwrite --yes');
assert(overwriteRes.status === 0, 'add --overwrite exits with code 0');
assert(overwriteRes.stdout.includes('Installed components/templates/aether-ai-saas.tsx'), 'Successfully overwritten when explicit');
assert(fs.readFileSync(installedFile, 'utf8') !== '// USER CUSTOM MODIFICATION', 'File overwritten when user explicitly requested');

// -------------------------------------------------------------
// Test 8: Commercial Resource Gating
// -------------------------------------------------------------
console.log('\n--- 8. Testing Commercial / Paid Resource Access Gating ---');
const commercialRes = runCli('add peak-fitness --yes');
assert(commercialRes.status === 1, 'Adding commercial template without license exits with code 1');
assert(commercialRes.stdout.includes('commercial resource') || commercialRes.stdout.includes('license authorization'), 'Gating notice clearly displayed for commercial resource');
const commercialFile = path.join(testCwd, 'components', 'templates', 'peak-fitness.tsx');
assert(!fs.existsSync(commercialFile), 'No empty or broken files created for commercial template without authorization');

// Clean up sandbox
if (fs.existsSync(testCwd)) {
  fs.rmSync(testCwd, { recursive: true, force: true });
}

console.log('\n========================================');
console.log(`Results: ${totalPassed} passed, ${totalFailed} failed`);
console.log('========================================\n');

if (totalFailed > 0) {
  process.exit(1);
}
