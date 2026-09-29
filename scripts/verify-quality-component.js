const fs = require('fs');
const path = require('path');
const http = require('http');

// Load verified quality data
const qualityData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib', 'verified-quality-data.json'), 'utf8'));

// Test at least 3 templates
const testTemplates = [
  'aether-ai-saas',
  'serenity-wellness',
  'nova-minimal-portfolio',
  'peak-fitness',
  'simple-link-bio' // unmeasured baseline test
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

async function runVerification() {
  console.log('=== Quality Indicator Component Verification ===\n');

  for (const templateId of testTemplates) {
    console.log(`--- Testing Template: ${templateId} ---`);
    const pageUrl = `http://localhost:3000/template/${templateId}`;
    const res = await fetchPage(pageUrl);

    if (res.statusCode !== 200) {
      console.error(`ERROR: Received status ${res.statusCode} for ${pageUrl}`);
      continue;
    }

    const html = res.html;

    // Check for Verified Quality Indicators section
    const hasSection = html.includes('Verified Quality Indicators');
    const hasTestedOn = html.includes('Tested on');
    const hasMethodology = html.includes('Audit Methodology');
    const hasTypeScript = html.includes('TypeScript') && html.includes('Passed');
    const hasBuild = html.includes('Production Build') && html.includes('Passed');

    console.log(`  Quality Section Present: ${hasSection}`);
    console.log(`  "Tested on" Present: ${hasTestedOn}`);
    console.log(`  "Production Build" Passed: ${hasBuild}`);
    console.log(`  "TypeScript" Passed: ${hasTypeScript}`);
    console.log(`  Methodology Notice: ${hasMethodology}`);

    const verified = qualityData.templates[templateId];
    if (verified) {
      const perfExpected = `${verified.scores.performance}/100`;
      const a11yExpected = `${verified.scores.accessibility}/100`;
      const bpExpected = `${verified.scores.bestPractices}/100`;
      const seoExpected = `${verified.scores.seo}/100`;

      const hasPerf = html.includes(perfExpected);
      const hasA11y = html.includes(a11yExpected);
      const hasBp = html.includes(bpExpected);
      const hasSeo = html.includes(seoExpected);

      console.log(`  Performance (${perfExpected}) matches rendered: ${hasPerf}`);
      console.log(`  Accessibility (${a11yExpected}) matches rendered: ${hasA11y}`);
      console.log(`  Best Practices (${bpExpected}) matches rendered: ${hasBp}`);
      console.log(`  SEO (${seoExpected}) matches rendered: ${hasSeo}`);

      if (hasPerf && hasA11y && hasBp && hasSeo) {
        console.log(`  => SUCCESS: Displayed numbers exactly equal real test results!`);
      } else {
        console.error(`  => MISMATCH DETECTED for ${templateId}`);
      }
    } else {
      const hasPending = html.includes('Audit Pending');
      console.log(`  Template unmeasured: correctly shows "Audit Pending" = ${hasPending}`);
      console.log(`  => SUCCESS: Unmeasured template does not claim fabricated scores.`);
    }

    console.log('');
  }
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
