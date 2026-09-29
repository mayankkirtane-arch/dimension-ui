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
          const buffer = Buffer.concat(chunks);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: buffer.toString('utf8'),
            rawBuffer: buffer,
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('=== DimensionUI Task 8 Customer Dashboard Test Suite ===\n');

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

  // 1. Logged-out Behavior: /dashboard
  console.log('--- Test 1: Logged-out access to /dashboard ---');
  const loggedOutRes = await makeRequest('/dashboard');
  assert(
    loggedOutRes.statusCode === 307 ||
    loggedOutRes.statusCode === 302 ||
    loggedOutRes.statusCode === 308 ||
    (loggedOutRes.headers.location && loggedOutRes.headers.location.includes('/login')),
    `Unauthenticated /dashboard redirects to /login (Status: ${loggedOutRes.statusCode}, Location: ${loggedOutRes.headers.location})`
  );

  // 2. Logged-in with NO purchases
  console.log('\n--- Test 2: Logged-in user with NO purchases ---');
  const emptyUser = JSON.stringify({ id: 'user_empty_01', email: 'empty@example.com' });
  const noPurchasesRes = await makeRequest('/dashboard', {
    Cookie: `sb-test-user=${encodeURIComponent(emptyUser)}`,
  });
  assert(noPurchasesRes.statusCode === 200, `Authenticated empty user gets HTTP 200`);
  assert(noPurchasesRes.body.includes('empty@example.com'), `User email rendered in navigation`);
  assert(noPurchasesRes.body.includes('No templates yet'), `Empty library state rendered`);
  assert(noPurchasesRes.body.includes('Browse Templates'), `Browse gallery CTA rendered`);

  // 3. Logged-in WITH a purchase
  console.log('\n--- Test 3: Logged-in user WITH a purchased template ---');
  const purchaser = JSON.stringify({ id: 'user_purchaser_02', email: 'alex@startup.io' });
  const purchasesData = JSON.stringify([
    {
      template_id: 'peak-fitness',
      created_at: '2026-03-20T10:00:00Z',
      amount: '15',
      order_id: 'ord_98765',
      version: 'v1.2.0',
      license_type: 'Commercial (Unlimited Projects)',
      license_key: 'DUI-PEAK-2026-V1',
      updated_at: '2026-03-25T14:00:00Z',
    },
  ]);

  const purchaserRes = await makeRequest('/dashboard', {
    Cookie: `sb-test-user=${encodeURIComponent(purchaser)}; sb-test-purchases=${encodeURIComponent(purchasesData)}`,
  });

  assert(purchaserRes.statusCode === 200, `Purchaser gets HTTP 200`);
  assert(purchaserRes.body.includes('alex@startup.io'), `Purchaser email rendered in navbar`);
  assert(purchaserRes.body.includes('My Library'), `My Library header rendered`);
  assert(purchaserRes.body.includes('Template'), `Template count badge rendered`);
  assert(purchaserRes.body.includes('Peak Performance Fitness'), `Purchased template title rendered`);
  assert(purchaserRes.body.includes('/api/download/peak-fitness'), `Secure download code URL rendered`);
  assert(purchaserRes.body.includes('v1.2.0'), `Version information rendered`);
  assert(purchaserRes.body.includes('Commercial (Unlimited Projects)'), `License info rendered`);
  assert(purchaserRes.body.includes('DUI-PEAK-2026-V1'), `License key displayed from purchase record`);
  assert(purchaserRes.body.includes('ord_98765'), `Purchase order ID rendered`);
  assert(purchaserRes.body.includes('$15'), `Purchase amount rendered`);
  assert(purchaserRes.body.includes('/template/peak-fitness'), `Documentation link rendered`);
  assert(purchaserRes.body.includes('/preview/peak-fitness'), `Preview link rendered`);
  assert(purchaserRes.body.includes('Private repository'), `GitHub repository access status displayed honestly`);
  assert(purchaserRes.body.includes('View Changelog'), `Changelog status displayed with link to template changelog`);

  // 4. Download Authorization: Unauthenticated
  console.log('\n--- Test 4: Download Authorization - Unauthenticated ---');
  const unauthDownloadRes = await makeRequest('/api/download/peak-fitness');
  assert(
    unauthDownloadRes.statusCode === 401,
    `Unauthenticated download rejected with HTTP 401 Unauthorized (got ${unauthDownloadRes.statusCode})`
  );

  // 5. Download Authorization: Authenticated but Unpurchased (Paid template)
  console.log('\n--- Test 5: Download Authorization - Unpurchased paid template ---');
  // User has only purchased 'peak-fitness', so attempting to download 'azure-apartments' ($15 paid) should be 403 Forbidden
  const unpurchasedDownloadRes = await makeRequest('/api/download/azure-apartments', {
    Cookie: `sb-test-user=${encodeURIComponent(purchaser)}; sb-test-purchases=${encodeURIComponent(purchasesData)}`,
  });
  assert(
    unpurchasedDownloadRes.statusCode === 403,
    `Unauthorized download of paid template rejected with HTTP 403 Forbidden (got ${unpurchasedDownloadRes.statusCode})`
  );

  // 6. Download Authorization: Authenticated & Purchased
  console.log('\n--- Test 6: Download Authorization - Verified Purchaser ---');
  const authorizedDownloadRes = await makeRequest('/api/download/peak-fitness', {
    Cookie: `sb-test-user=${encodeURIComponent(purchaser)}; sb-test-purchases=${encodeURIComponent(purchasesData)}`,
  });
  assert(
    authorizedDownloadRes.statusCode === 200,
    `Authorized purchaser gets HTTP 200 OK (got ${authorizedDownloadRes.statusCode})`
  );
  assert(
    authorizedDownloadRes.headers['content-type'] === 'application/zip',
    `Download content-type is application/zip`
  );
  assert(
    authorizedDownloadRes.headers['content-disposition'].includes('peak-fitness-source.zip'),
    `Download header specifies attachment filename peak-fitness-source.zip`
  );
  const isZip =
    authorizedDownloadRes.rawBuffer[0] === 0x50 &&
    authorizedDownloadRes.rawBuffer[1] === 0x4b;
  assert(isZip, `Downloaded payload begins with valid PKZIP signature (0x50 0x4B)`);

  // 7. Download Authorization: Free template
  console.log('\n--- Test 7: Download Authorization - Free template ---');
  const freeDownloadRes = await makeRequest('/api/download/serenity-wellness', {
    Cookie: `sb-test-user=${encodeURIComponent(purchaser)}`,
  });
  assert(
    freeDownloadRes.statusCode === 200,
    `Authenticated user can download free template (HTTP 200 OK)`
  );
  assert(
    freeDownloadRes.headers['content-type'] === 'application/zip',
    `Free template downloaded as application/zip`
  );

  console.log(`\n========================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  process.exit(failed === 0 ? 0 : 1);
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
