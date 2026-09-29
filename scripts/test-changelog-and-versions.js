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
  console.log('=== Task 9 Template Versions & Changelog Test Suite ===\n');

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

  const templatesToTest = [
    { id: 'aether-ai-saas', name: 'Aether AI SaaS', expectedVersion: 'v1.1.0', expectedDate: 'September 2026' },
    { id: 'serenity-wellness', name: 'Serenity Wellness Clinic', expectedVersion: 'v1.0.0', expectedDate: 'September 2026' },
    { id: 'peak-fitness', name: 'Peak Performance Fitness', expectedVersion: 'v1.1.0', expectedDate: 'September 2026' },
    { id: 'nova-minimal-portfolio', name: 'Nova Developer Portfolio', expectedVersion: 'v1.0.0', expectedDate: 'September 2026' },
    { id: 'azure-apartments', name: 'Azure Luxury Living', expectedVersion: 'v1.0.0', expectedDate: 'September 2026' },
    { id: 'apex-dental-clinic', name: 'Apex Dental & Health', expectedVersion: 'v1.0.0', expectedDate: 'September 2026' },
  ];

  console.log('--- Testing 6 Templates: Detail Page Version & Changelog Section ---');
  for (const t of templatesToTest) {
    console.log(`\nVerifying template: ${t.name} (${t.id})...`);
    const res = await makeRequest(`/template/${t.id}`);
    assert(res.statusCode === 200, `Template detail page HTTP 200`);
    assert(res.body.includes(t.expectedVersion), `Current version ${t.expectedVersion} rendered on page`);
    assert(res.body.includes('Changelog &amp; Release History') || res.body.includes('Changelog & Release History'), `Changelog section heading rendered`);
    assert(res.body.includes('id="changelog"'), `Changelog section ID present for direct deep-linking`);
    assert(res.body.includes(t.expectedDate), `Release date (${t.expectedDate}) rendered`);
    assert(res.body.includes('Added'), `Added section rendered in changelog entry`);
    assert(res.body.includes('Updated'), `Updated section rendered in changelog entry`);
    assert(res.body.includes('Template version') || res.body.includes('Template Version'), `Template version displayed in Technical Specifications`);
    assert(res.body.includes('Last updated') || res.body.includes('Last Updated'), `Last updated date displayed in Technical Specifications`);
  }

  console.log('\n--- Testing Consistency Between Template Page and Customer Dashboard ---');
  const testUser = JSON.stringify({ id: 'user_verify_v9', email: 'verified@customer.io' });
  const testPurchases = JSON.stringify(
    templatesToTest.map((t) => ({
      template_id: t.id,
      created_at: '2026-03-22T00:00:00Z',
      amount: '15',
    }))
  );

  const dashRes = await makeRequest('/dashboard', {
    Cookie: `sb-test-user=${encodeURIComponent(testUser)}; sb-test-purchases=${encodeURIComponent(testPurchases)}`,
  });

  assert(dashRes.statusCode === 200, `Dashboard HTTP 200`);
  for (const t of templatesToTest) {
    console.log(`Checking dashboard consistency for: ${t.name}...`);
    assert(
      dashRes.body.includes(t.name) || dashRes.body.includes(t.name.replace('&', '&amp;')),
      `Template name ${t.name} present on dashboard`
    );
    assert(dashRes.body.includes(t.expectedVersion), `Version ${t.expectedVersion} on dashboard matches template page`);
    assert(dashRes.body.includes(`/template/${t.id}#changelog`), `Dashboard changelog button links to /template/${t.id}#changelog`);
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
