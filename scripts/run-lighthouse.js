const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), '.shots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targetUrl = 'http://localhost:3000/template/aether-ai-saas';
const outputPath = path.join(outDir, 'lighthouse-aether.json');

console.log(`Auditing ${targetUrl} with Lighthouse...`);

try {
  execSync(
    `npx lighthouse ${targetUrl} --output=json --output-path="${outputPath}" --chrome-flags="--headless=new --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo --quiet`,
    { stdio: 'inherit' }
  );

  const report = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  const categories = report.categories;

  console.log('--- Real Measured Lighthouse Scores ---');
  console.log('Performance:', Math.round(categories.performance.score * 100));
  console.log('Accessibility:', Math.round(categories.accessibility.score * 100));
  console.log('Best Practices:', Math.round(categories['best-practices'].score * 100));
  console.log('SEO:', Math.round(categories.seo.score * 100));
} catch (err) {
  console.error('Lighthouse audit failed:', err.message);
}
