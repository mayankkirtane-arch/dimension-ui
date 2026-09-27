const fs = require('fs');
const content = fs.readFileSync('components/sections/gallery.tsx', 'utf8');

const motionLiMatch = content.match(/<motion\.li[^>]*>([\s\S]*?)<\/motion\.li>/);
const inner = motionLiMatch[1];

let stack = [];
const regex = /<\/?([a-zA-Z0-9\.]+)(?:\s+[^>]*?)?\/?>/g;
let match;

while ((match = regex.exec(inner)) !== null) {
  const tagStr = match[0];
  const tag = match[1];
  
  if (tagStr.endsWith('/>')) continue;
  if (['img', 'input', 'br', 'hr', 'path', 'polygon', 'circle', 'line', 'rect', 'svg'].includes(tag)) continue;
  
  if (tagStr.startsWith('</')) {
    stack.pop();
    if (stack.length < 2) {
      console.log('--- Stack dropped to ' + stack.length + ' at index ' + match.index);
      console.log('Context: ' + inner.substring(match.index - 50, match.index + 50));
    }
  } else {
    stack.push(tag);
    if (stack.length < 2) {
      console.log('+++ Stack went up to ' + stack.length + ' at index ' + match.index);
    }
  }
}
