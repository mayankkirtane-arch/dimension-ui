const fs = require('fs');

const content = fs.readFileSync('lib/site.ts', 'utf8');

const regex = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*blurb:\s*"([^"]+)",\s*tier:\s*"([^"]+)",\s*price:\s*"([^"]+)",\s*category:\s*"([^"]+)"[\s\S]*?features:\s*\[([\s\S]*?)\]/g;
let match;
let i = 1;
while ((match = regex.exec(content)) !== null) {
  const id = match[1];
  const name = match[2];
  const category = match[6];
  const features = match[7].split('\n').map(s => s.trim().replace(/[",]/g, '')).filter(Boolean);
  console.log(`${i++}. [${id}] ${name} (${category}) -> Features: ${features.join(', ')}`);
}
