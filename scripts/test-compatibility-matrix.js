const http = require('http');

function makeRequest(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'GET',
        headers,
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks).toString('utf8'),
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('=== Task 10 Template Compatibility Matrix Test Suite ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 5 templates across distinct categories
  const templatesToTest = [
    { id: 'aether-ai-saas', category: 'SaaS & AI', name: 'Aether AI SaaS' },
    { id: 'serenity-wellness', category: 'Local Business', name: 'Serenity Wellness Clinic' },
    { id: 'peak-fitness', category: 'Fitness & Health', name: 'Peak Performance Fitness' },
    { id: 'nova-minimal-portfolio', category: 'Portfolio', name: 'Nova Developer Portfolio' },
    { id: 'azure-apartments', category: 'Real Estate', name: 'Azure Luxury Living' },
  ];

  const expectedSystems = [
    { name: 'Next.js', version: '15.1.6', status: 'Supported' },
    { name: 'React', version: '19.0.0', status: 'Supported' },
    { name: 'Tailwind CSS', version: '4.0.0', status: 'Supported' },
    { name: 'TypeScript', version: '5.7.3', status: 'Supported' },
    { name: 'Vercel', version: 'Edge & Serverless', status: 'Supported' },
    { name: 'Netlify', version: 'Runtime v5', status: 'Supported' },
    { name: 'Cloudflare', version: 'Pages / Workers', status: 'Not tested' },
  ];

  for (const t of templatesToTest) {
    console.log(`\n--- Testing Template: ${t.name} (${t.category}) ---`);
    const res = await makeRequest(`/template/${t.id}`);

    const cleanBody = res.body.replace(/<!--.*?-->/g, '');
    assert(res.statusCode === 200, `${t.id} returns HTTP 200 OK`);
    assert(cleanBody.includes('Compatibility Matrix'), `Compatibility Matrix header rendered`);
    assert(cleanBody.includes('id="compatibility"'), `Compatibility section ID present for navigation`);
    assert(cleanBody.includes('6 Supported'), `Supported items count rendered (6 Supported)`);
    assert(cleanBody.includes('1 Not tested'), `Not tested items count rendered (1 Not tested)`);

    for (const sys of expectedSystems) {
      assert(res.body.includes(sys.name), `Target "${sys.name}" displayed in matrix`);
      assert(
        res.body.includes(sys.version) || res.body.includes(sys.version.replace('&', '&amp;')),
        `Version/target "${sys.version}" displayed for ${sys.name}`
      );
    }

    assert(res.body.includes('Supported'), `Status badge "Supported" present in matrix`);
    assert(res.body.includes('Not tested'), `Status badge "Not tested" present in matrix`);
  }

  console.log(`\n========================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  process.exit(failed === 0 ? 0 : 1);
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
