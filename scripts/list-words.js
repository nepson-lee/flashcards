// Print the words of one group from 英文單字清單.txt as JSON.
// Usage: node scripts/list-words.js group_1   (also accepts "1" or "Flashcards_group_1")
const fs = require('fs');
const path = require('path');

const arg = process.argv[2];
if (!arg) { console.error('usage: node scripts/list-words.js <group>'); process.exit(2); }
const want = normalize(arg);

function normalize(s) {
  const m = String(s).match(/(\d+)\W*$/); // tolerate trailing punctuation like "group_1/"
  return m ? `group_${m[1]}` : String(s).trim().toLowerCase();
}

const file = path.join(__dirname, '..', '英文單字清單.txt');
const text = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
const groups = {};
let current = null;
for (const raw of text.split(/\r?\n/)) {
  const line = raw.trim();
  const h = line.match(/^#+\s*(.+)$/);
  if (h) { current = normalize(h[1]); groups[current] = []; continue; }
  if (/^=+$/.test(line)) { current = null; continue; }
  const item = line.match(/^[*\-]\s*(.+)$/);
  if (current && item) groups[current].push(item[1].trim());
}

if (!groups[want]) {
  console.error(`group "${arg}" not found. Available: ${Object.keys(groups).join(', ') || '(none)'}`);
  process.exit(1);
}
console.log(JSON.stringify({ group: want, words: groups[want] }, null, 2));
