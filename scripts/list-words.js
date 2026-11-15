// Print the words of one group from 英文單字清單.txt as JSON.
// Usage: node scripts/list-words.js group_1   (also accepts "1" or "Flashcards_group_1")
//
// A group may end with an optional "對話範例:" (dialogue examples) section. Each
// "* question" bullet there starts one example; the indented lines under it are
// the following lines of that example. Free text before the first bullet goes
// to "notes". Output: { group, words, examples: [[line, line], ...], notes }.
const fs = require('fs');
const path = require('path');

const arg = process.argv[2];
if (!arg) { console.error('usage: node scripts/list-words.js <group>'); process.exit(2); }
const want = normalize(arg);

function normalize(s) {
  const m = String(s).match(/(\d+)\W*$/); // tolerate trailing punctuation like "group_1/"
  return m ? `group_${m[1]}` : String(s).trim().toLowerCase();
}

// "Where do you take a shower ?" -> "Where do you take a shower?"
const tidy = (s) => s.replace(/\s+/g, ' ').replace(/\s+([?.!,])/g, '$1').trim();

const file = path.join(__dirname, '..', '英文單字清單.txt');
const text = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
const groups = {};
let current = null;
let mode = 'words';
for (const raw of text.split(/\r?\n/)) {
  const line = raw.trim();
  const h = line.match(/^#+\s*(.+)$/);
  if (h) {
    current = { words: [], examples: [], notes: [] };
    groups[normalize(h[1])] = current;
    mode = 'words';
    continue;
  }
  if (/^=+$/.test(line)) { current = null; continue; }
  if (!current || !line) continue;
  if (/^對話範例/.test(line)) {
    mode = 'examples';
    const rest = line.replace(/^對話範例\s*[:：]?\s*/, '');
    if (rest) current.notes.push(rest);
    continue;
  }
  const item = line.match(/^[*\-]\s*(.+)$/);
  if (mode === 'words') {
    if (item) current.words.push(item[1].trim());
  } else if (item) {
    current.examples.push([tidy(item[1])]);
  } else if (current.examples.length) {
    current.examples[current.examples.length - 1].push(tidy(line));
  } else {
    current.notes.push(line);
  }
}

if (!groups[want]) {
  console.error(`group "${arg}" not found. Available: ${Object.keys(groups).join(', ') || '(none)'}`);
  process.exit(1);
}
const g = groups[want];
console.log(JSON.stringify({ group: want, words: g.words, examples: g.examples, notes: g.notes }, null, 2));
