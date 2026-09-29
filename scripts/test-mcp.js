const http = require('http');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

console.log('=== TASK 17: DimensionUI MCP Server Verification Suite ===\n');

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

const MCP_BIN = path.join(__dirname, '..', 'packages', 'mcp', 'bin', 'dimensionui-mcp.js');

function checkServerReady() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/registry', (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const isReady = await checkServerReady();
    if (isReady) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

// JSON-RPC stdio client helper
class McpClient {
  constructor(binPath) {
    this.binPath = binPath;
    this.process = null;
    this.rl = null;
    this.requestId = 1;
    this.pendingRequests = new Map();
  }

  start() {
    this.process = spawn('node', [this.binPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, DIMENSIONUI_REGISTRY_URL: 'http://localhost:3000' },
    });

    this.rl = readline.createInterface({
      input: this.process.stdout,
      terminal: false,
    });

    this.rl.on('line', (line) => {
      if (!line.trim()) return;
      try {
        const json = JSON.parse(line);
        if (json.id && this.pendingRequests.has(json.id)) {
          const { resolve } = this.pendingRequests.get(json.id);
          this.pendingRequests.delete(json.id);
          resolve(json);
        }
      } catch (err) {
        console.error('Failed to parse MCP output:', line);
      }
    });

    this.process.stderr.on('data', (data) => {
      // debug stderr
    });
  }

  send(method, params = {}) {
    const id = this.requestId++;
    const message = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.process.stdin.write(JSON.stringify(message) + '\n');
    });
  }

  sendRaw(rawString) {
    return new Promise((resolve) => {
      const handler = (line) => {
        try {
          const json = JSON.parse(line);
          this.rl.removeListener('line', handler);
          resolve(json);
        } catch {
          // ignore
        }
      };
      this.rl.on('line', handler);
      this.process.stdin.write(rawString + '\n');
    });
  }

  close() {
    if (this.rl) this.rl.close();
    if (this.process) this.process.kill();
  }
}

async function runTests() {
  let nextProcess = null;

  try {
    const alreadyRunning = await checkServerReady();
    if (!alreadyRunning) {
      console.log('Starting Next.js server on port 3000...');
      nextProcess = spawn('npx', ['next', 'start', '-p', '3000'], {
        cwd: path.join(__dirname, '..'),
        shell: true,
        stdio: 'ignore',
      });
      const ready = await waitForServer();
      if (!ready) {
        throw new Error('Next.js server failed to respond on port 3000 within timeout.');
      }
      console.log('Next.js server is ready.\n');
    } else {
      console.log('Using existing Next.js server on port 3000.\n');
    }

    console.log('--- 1. Testing MCP Server Initialization ---');
    const client = new McpClient(MCP_BIN);
    client.start();

    const initRes = await client.send('initialize', {
      protocolVersion: '2024-11-05',
      clientInfo: { name: 'test-agent', version: '1.0.0' },
    });

    assert(initRes && initRes.result, 'initialize response has result object');
    assert(initRes.result.protocolVersion === '2024-11-05', 'protocolVersion is 2024-11-05');
    assert(initRes.result.serverInfo && initRes.result.serverInfo.name === 'dimensionui-mcp', 'serverInfo.name is dimensionui-mcp');
    assert(initRes.result.capabilities && initRes.result.capabilities.tools !== undefined, 'capabilities exposes tools');

    console.log('\n--- 2. Testing tools/list Discovery ---');
    const toolsRes = await client.send('tools/list');
    assert(toolsRes && toolsRes.result && Array.isArray(toolsRes.result.tools), 'tools/list returns tools array');

    const tools = toolsRes.result.tools;
    const toolNames = tools.map((t) => t.name);
    console.log(`Discovered tools: ${toolNames.join(', ')}`);

    assert(toolNames.includes('search_templates'), 'Exposes search_templates tool');
    assert(toolNames.includes('get_template'), 'Exposes get_template tool');
    assert(toolNames.includes('search_blocks'), 'Exposes search_blocks tool');
    assert(toolNames.includes('get_compatibility'), 'Exposes get_compatibility tool');
    assert(toolNames.includes('get_installation_info'), 'Exposes get_installation_info tool');

    // Verify all tools have clear description and valid inputSchema
    const allHaveSchema = tools.every((t) => t.description && t.inputSchema && t.inputSchema.type === 'object');
    assert(allHaveSchema, 'All 5 tools have clear descriptions and valid JSON schemas');

    console.log('\n--- 3. Testing "search_templates" Natural Language & Faceted Search ---');
    // Conceptual query test from prompt
    const nlSearch = await client.send('tools/call', {
      name: 'search_templates',
      arguments: {
        query: 'Find a dark SaaS template with pricing and dashboard support',
        limit: 5,
      },
    });

    assert(nlSearch && nlSearch.result && !nlSearch.result.isError, 'search_templates executed successfully');
    const nlData = JSON.parse(nlSearch.result.content[0].text);
    assert(nlData.totalFound > 0, `Natural language search returned results (found ${nlData.totalFound})`);
    assert(
      nlData.templates.some((t) => t.name.includes('saas') || t.name.includes('aether') || t.name.includes('analytics')),
      'Top results match dark SaaS / dashboard semantics'
    );
    assert(nlData.templates[0].installCommand.startsWith('npx dimensionui add'), 'Results provide exact CLI install command');

    // Facet filter test
    const freeSaas = await client.send('tools/call', {
      name: 'search_templates',
      arguments: {
        tier: 'free',
        category: 'SaaS',
        limit: 3,
      },
    });
    const freeData = JSON.parse(freeSaas.result.content[0].text);
    assert(freeData.templates.every((t) => t.tier === 'free'), 'Tier filter returns only free templates');

    console.log('\n--- 4. Testing "get_template" Lookup ---');
    const getRes = await client.send('tools/call', {
      name: 'get_template',
      arguments: {
        name: 'aether-ai-saas',
      },
    });

    assert(getRes && getRes.result && !getRes.result.isError, 'get_template executed successfully');
    const tplData = JSON.parse(getRes.result.content[0].text);
    assert(tplData.name === 'aether-ai-saas', 'get_template returned requested template manifest');
    assert(tplData.title === 'Aether AI SaaS', 'Template title is correct');
    assert(tplData.framework === 'next', 'Framework is Next.js');
    assert(tplData.dependencies && tplData.dependencies['framer-motion'], 'Manifest includes dependency metadata');
    assert(tplData.metadata && tplData.metadata.figma, 'Manifest includes Figma metadata');
    assert(tplData.metadata && tplData.metadata.integrations, 'Manifest includes integrations metadata');

    console.log('\n--- 5. Testing "search_blocks" Modular UI Discovery ---');
    const blocksRes = await client.send('tools/call', {
      name: 'search_blocks',
      arguments: {
        query: 'hero',
        limit: 5,
      },
    });

    assert(blocksRes && blocksRes.result && !blocksRes.result.isError, 'search_blocks executed successfully');
    const blocksData = JSON.parse(blocksRes.result.content[0].text);
    assert(blocksData.totalFound > 0, `search_blocks found ${blocksData.totalFound} matching blocks`);
    assert(blocksData.blocks[0].installCommand.startsWith('npx dimensionui add'), 'Blocks provide CLI installation command');

    console.log('\n--- 6. Testing "get_compatibility" Matrix ---');
    // Global baseline
    const compatBaseline = await client.send('tools/call', {
      name: 'get_compatibility',
      arguments: {},
    });
    const baseData = JSON.parse(compatBaseline.result.content[0].text);
    assert(baseData.frameworks && baseData.frameworks['Next.js'].version === '15.1.6', 'Reports Next.js 15.1.6 baseline');
    assert(baseData.frameworks && baseData.frameworks['React'].version === '19.0.0', 'Reports React 19.0.0 baseline');
    assert(baseData.frameworks && baseData.frameworks['Tailwind CSS'].version === '4.0.0', 'Reports Tailwind CSS v4.0.0 baseline');

    // Template specific compatibility
    const tplCompat = await client.send('tools/call', {
      name: 'get_compatibility',
      arguments: { templateId: 'aether-ai-saas' },
    });
    const tplCompatData = JSON.parse(tplCompat.result.content[0].text);
    assert(tplCompatData.templateId === 'aether-ai-saas', 'Returns template-specific compatibility matrix');
    assert(Array.isArray(tplCompatData.compatibilityMatrix), 'compatibilityMatrix is an array');

    console.log('\n--- 7. Testing "get_installation_info" Guidance ---');
    const installInfo = await client.send('tools/call', {
      name: 'get_installation_info',
      arguments: { name: 'aether-ai-saas', packageManager: 'pnpm' },
    });
    const installData = JSON.parse(installInfo.result.content[0].text);
    assert(installData.cliCommand === 'npx dimensionui add aether-ai-saas', 'cliCommand is exact');
    assert(installData.dependencyInstallCommand.startsWith('pnpm add'), 'Formats command for requested packageManager (pnpm)');
    assert(Array.isArray(installData.targetFiles), 'Lists target files for project');

    console.log('\n--- 8. Testing Invalid Queries, Missing Params & Unknown Methods ---');
    // A: Unknown method
    const badMethod = await client.send('unknown/method');
    assert(badMethod.error && badMethod.error.code === -32601, 'Unknown method returns JSON-RPC -32601');

    // B: Unknown tool
    const badTool = await client.send('tools/call', { name: 'non_existent_tool' });
    assert(badTool.error && badTool.error.code === -32601, 'Unknown tool returns JSON-RPC -32601');

    // C: Missing required parameter
    const missingParam = await client.send('tools/call', { name: 'get_template', arguments: {} });
    assert(missingParam.result && missingParam.result.isError, 'Missing required param returns isError: true');

    // D: Nonexistent template lookup
    const notFoundTpl = await client.send('tools/call', {
      name: 'get_template',
      arguments: { name: 'completely-fake-template-slug-999' },
    });
    assert(notFoundTpl.result && notFoundTpl.result.isError, 'Nonexistent template returns isError: true without crashing');

    // E: Malformed JSON over stdio
    const malformedJson = await client.sendRaw('{ invalid json string');
    assert(malformedJson.error && malformedJson.error.code === -32700, 'Malformed JSON line returns JSON-RPC parse error -32700');

    console.log('\n--- 9. Testing Security Model, Gating & Zero Secret Exposure ---');
    // Check commercial template gating
    const commercialTpl = await client.send('tools/call', {
      name: 'get_template',
      arguments: { name: 'peak-fitness' },
    });
    const commData = JSON.parse(commercialTpl.result.content[0].text);
    assert(commData.access === 'commercial', 'Commercial template marked access="commercial"');
    assert(commData.files[0].locked === true, 'Commercial source code is locked (locked=true)');
    assert(commData.files[0].content === undefined, 'Commercial source code content is strictly undefined/omitted');

    // Check secrets leak prevention across all outputs
    const allOutputs = [
      JSON.stringify(initRes),
      JSON.stringify(toolsRes),
      JSON.stringify(nlSearch),
      JSON.stringify(tplData),
      JSON.stringify(blocksData),
      JSON.stringify(commData),
    ].join(' ');

    const forbiddenPatterns = [
      'SUPABASE_SERVICE_ROLE_KEY',
      'service_role',
      'DATABASE_URL',
      'SECRET_KEY',
      'dim_live_secret',
    ];

    const leakedPattern = forbiddenPatterns.find((p) => allOutputs.includes(p));
    assert(!leakedPattern, `Zero secret leak verification: No forbidden patterns leaked (checked: ${forbiddenPatterns.join(', ')})`);

    // Verify Read-Only boundaries: no write or destructive tools exist
    const destructiveNames = ['delete', 'remove', 'write', 'update', 'modify', 'exec', 'run'];
    const hasDestructive = tools.some((t) => destructiveNames.some((d) => t.name.includes(d)));
    assert(!hasDestructive, 'MCP tools strictly read-only and discovery-based (no destructive or mutation operations)');

    client.close();

    console.log('\n========================================');
    console.log(`Results: ${totalPassed} passed, ${totalFailed} failed`);
    console.log('========================================\n');

    if (totalFailed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  } finally {
    if (nextProcess) {
      console.log('Shutting down temporary Next.js server...');
      nextProcess.kill();
    }
  }
}

runTests();
