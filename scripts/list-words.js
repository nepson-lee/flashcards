// Print the words of one group from 英文單字清單.txt as JSON.
// Usage: node scripts/list-words.js group_1   (also accepts "1" or "Flashcards_group_1")
//
// After its words a group may have optional sections, each started by a header
// line "[對話範例]" / "對話範例:" or "[圖像風格]" / "圖像風格:".
// - 對話範例 (dialogue examples): each "* question" bullet starts one example; the
//   indented lines under it are the following lines of that example. Free text
//   before the first bullet goes to "notes".
// - 圖像風格 (picture style): all text in it (header remainder included) is joined
//   into "style".
// Output: { group, words, examples: [[line, line], ...], notes: [...], style: "..." }.
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
    current = { words: [], examples: [], notes: [], style: [] };
    groups[normalize(h[1])] = current;
    mode = 'words';
    continue;
  }
  if (/^=+$/.test(line)) { current = null; continue; }
  if (!current || !line) continue;
  const sec = line.match(/^[\[【]?\s*(對話範例|圖像風格)\s*[\]】]?\s*[:：]?\s*(.*)$/);
  if (sec) {
    mode = sec[1] === '對話範例' ? 'examples' : 'style';
    if (sec[2]) (mode === 'style' ? current.style : current.notes).push(sec[2]);
    continue;
  }
  if (mode === 'style') { current.style.push(line.replace(/^[*\-]\s*/, '')); continue; }
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
console.log(JSON.stringify({ group: want, words: g.words, examples: g.examples, notes: g.notes, style: g.style.join('\n') }, null, 2));
