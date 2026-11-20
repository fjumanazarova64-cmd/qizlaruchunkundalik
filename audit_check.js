const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');

console.log('--- AUDIT REPORT ---');

// 1. Extract all IDs from HTML
const idRegex = /id=["']([^"']+)["']/g;
const htmlIds = new Set();
let match;
while ((match = idRegex.exec(html)) !== null) {
  htmlIds.add(match[1]);
}
console.log(`Found ${htmlIds.size} unique IDs in index.html.`);

// 2. Extract getElementById and $('#...') in script.js
const getElemRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
const missingIds = [];
while ((match = getElemRegex.exec(js)) !== null) {
  const id = match[1];
  if (!htmlIds.has(id)) {
    missingIds.push({ type: 'getElementById', id });
  }
}

const querySelectorIdRegex = /querySelector\(['"]#([a-zA-Z0-9_-]+)['"]\)/g;
while ((match = querySelectorIdRegex.exec(js)) !== null) {
  const id = match[1];
  if (!htmlIds.has(id)) {
    missingIds.push({ type: 'querySelector', id });
  }
}

console.log('Missing IDs referenced in script.js:', missingIds);

// 3. Extract inline onclick / onchange handlers in HTML
const onclickRegex = /on(?:click|change|input)=["']([^"']+)["']/g;
const inlineCalls = [];
while ((match = onclickRegex.exec(html)) !== null) {
  inlineCalls.push(match[1]);
}
console.log(`Found ${inlineCalls.length} inline event handlers.`);

// Check functions in inline handlers against JS
const calledFuncs = new Set();
inlineCalls.forEach(call => {
  const funcMatch = call.match(/([a-zA-Z0-9_$]+)\s*\(/);
  if (funcMatch) {
    calledFuncs.add(funcMatch[1]);
  }
});

const missingFuncs = [];
calledFuncs.forEach(fn => {
  // Check if defined in js as function fn or window.fn = or fn =
  const fnDefRegex = new RegExp(`(?:function\\s+${fn}\\b|window\\.${fn}\\s*=|\\bconst\\s+${fn}\\s*=|\\blet\\s+${fn}\\s*=|\\bvar\\s+${fn}\\s*=)`);
  if (!fnDefRegex.test(js)) {
    missingFuncs.push(fn);
  }
});
console.log('Missing functions called in inline handlers:', missingFuncs);

// 4. Check for broken HTML tags
const openTags = [];
const selfClosing = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const tagRegex = /<\/?([a-zA-Z0-9-]+)(\s+[^>]*)?\/?>/g;
let tagMatch;
let unclosedOrMismatch = 0;
// We can do a basic stack check
const stack = [];
while ((tagMatch = tagRegex.exec(html)) !== null) {
  const full = tagMatch[0];
  const tagName = tagMatch[1].toLowerCase();
  const isClosing = full.startsWith('</');
  const isSelfClosing = full.endsWith('/>') || selfClosing.has(tagName);

  if (isSelfClosing && !isClosing) {
    continue;
  }
  if (!isClosing) {
    stack.push({ tag: tagName, index: tagMatch.index });
  } else {
    if (stack.length > 0 && stack[stack.length - 1].tag === tagName) {
      stack.pop();
    } else {
      unclosedOrMismatch++;
      console.log(`Tag mismatch: expected </${stack.length > 0 ? stack[stack.length-1].tag : 'EMPTY'}> but got </${tagName}> at pos ${tagMatch.index}`);
    }
  }
}
if (stack.length > 0) {
  console.log(`Unclosed tags in HTML (${stack.length}):`, stack.slice(-10).map(s => s.tag));
} else {
  console.log('All HTML tags properly balanced!');
}

console.log('--- END AUDIT ---');
