const fs = require('fs');
const path = require('path');
const http = require('http');

// Extract templates and their integrations from lib/site.ts
const siteContent = fs.readFileSync(path.join(__dirname, '..', 'lib', 'site.ts'), 'utf8');

const testTemplates = [
  'aether-ai-saas',           // Resend (Example only), Supabase (Compatible)
  'nova-minimal-portfolio',   // GitHub (Included), Resend (Example only)
  'peak-fitness',             // PayPal (Example only)
  'saas-billing-hub',         // PayPal (Configured), Supabase (Configured)
  'precision-roofing',        // None (100% Self-Contained)
  'app-launch-lp',            // App Store & Google Play (Included)
  'devflow-hub',              // GitHub (Included)
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, html: data }));
    }).on('error', reject);
  });
}

async function verifyIntegrations() {
  console.log('=== TASK 12: Template Integrations Verification ===\n');

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

  for (const id of testTemplates) {
    console.log(`--- Testing Template: ${id} ---`);
    const pageUrl = `http://localhost:3000/template/${id}`;
    const res = await fetchPage(pageUrl);

    assert(res.statusCode === 200, `HTTP status 200 OK for ${id}`);
    const html = res.html;

    // Check for Supported Integrations section
    assert(html.includes('Supported Integrations'), 'Supported Integrations section rendered');
    assert(html.includes('id="integrations"'), 'Section ID "integrations" present for anchor navigation');
    assert(html.includes('Integration Classification Standard'), 'Classification standard legend present');

    // Specific template integration checks
    if (id === 'aether-ai-saas') {
      assert(html.includes('Resend'), 'Resend integration card present');
      assert(html.includes('Example only'), 'Resend marked as "Example only"');
      assert(html.includes('Supabase'), 'Supabase integration card present');
      assert(html.includes('Compatible'), 'Supabase marked as "Compatible"');
    } else if (id === 'nova-minimal-portfolio') {
      assert(html.includes('GitHub'), 'GitHub integration card present');
      assert(html.includes('Included'), 'GitHub marked as "Included" (working code)');
      assert(html.includes('Resend'), 'Resend integration card present');
      assert(html.includes('Example only'), 'Resend marked as "Example only"');
    } else if (id === 'peak-fitness') {
      assert(html.includes('PayPal'), 'PayPal integration card present (requested instead of Stripe)');
      assert(!html.includes('Stripe'), 'Stripe NOT present (PayPal requested)');
      assert(html.includes('Example only'), 'PayPal marked as "Example only"');
    } else if (id === 'saas-billing-hub') {
      assert(html.includes('PayPal'), 'PayPal integration card present');
      assert(html.includes('Supabase'), 'Supabase integration card present');
      assert(html.includes('Configured'), 'Configured badge rendered');
    } else if (id === 'app-launch-lp') {
      assert(html.includes('App Store &amp; Google Play') || html.includes('App Store & Google Play'), 'App Store & Google Play card present');
      assert(html.includes('Included'), 'App Store marked as "Included" (working code)');
    } else if (id === 'devflow-hub') {
      assert(html.includes('GitHub'), 'GitHub integration card present');
      assert(html.includes('Included'), 'GitHub marked as "Included" (working code)');
    } else if (id === 'precision-roofing') {
      assert(html.includes('Self-Contained (0 Third-Party)'), 'Self-Contained badge displayed in header');
      assert(html.includes('100% Self-Contained'), '100% Self-Contained notice displayed');
    }

    console.log('');
  }

  console.log('========================================');
  console.log(`Results: ${totalPassed} passed, ${totalFailed} failed`);
  console.log('========================================');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

verifyIntegrations().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
