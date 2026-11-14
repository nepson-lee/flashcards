// Build one group's flashcards: render scenes to PNG, then write the Word file.
// Usage: node scripts/build.js group_1        -> flashcards_group_1.docx
//        node scripts/build.js group_1 --draw-only
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, HeightRule, BorderStyle, AlignmentType, VerticalAlign, TableLayoutType,
} = require('docx');

const group = process.argv[2];
const drawOnly = process.argv.includes('--draw-only');
if (!group) { console.error('usage: node scripts/build.js <group> [--draw-only]'); process.exit(2); }

const ROOT = path.join(__dirname, '..');
const GDIR = path.join(ROOT, 'groups', group);
const IMG = path.join(GDIR, 'images');
const cards = JSON.parse(fs.readFileSync(path.join(GDIR, 'cards.json'), 'utf8'));
const scenes = require(path.join(GDIR, 'scenes.js'));
const imgName = (word) => word.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- 1. render scenes ----------
fs.mkdirSync(IMG, { recursive: true });
const missing = cards.filter((c) => !scenes[c.word]).map((c) => c.word);
if (missing.length) { console.error('scenes.js has no scene for: ' + missing.join(', ')); process.exit(1); }
const render = (svg, w) => new Resvg(svg, { fitTo: { mode: 'width', value: w }, font: { loadSystemFonts: true } }).render().asPng();
for (const c of cards) {
  const s = scenes[c.word];
  fs.writeFileSync(path.join(IMG, imgName(c.word) + '.svg'), s);
  fs.writeFileSync(path.join(IMG, imgName(c.word) + '.png'), render(s, 900));
}
// contact sheet for quick visual review
const cols = 3, rowsN = Math.ceil(cards.length / cols);
const sheet = cards.map((c, i) =>
  `<g transform="translate(${(i % cols) * 310},${Math.floor(i / cols) * 230})"><rect width="300" height="200" fill="none" stroke="#999"/>` +
  `${scenes[c.word].replace(/<\/?svg[^>]*>/g, '')}<text x="150" y="220" font-family="Arial" font-size="14" text-anchor="middle">${c.word}</text></g>`).join('');
fs.writeFileSync(path.join(IMG, '_sheet.png'), render(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * 310}" height="${rowsN * 230}"><rect width="100%" height="100%" fill="#fff"/>${sheet}</svg>`, 1400));
console.log('images ->', path.relative(ROOT, IMG));
if (drawOnly) process.exit(0);

// ---------- 2. build docx ----------
const FONT = { ascii: 'Comic Sans MS', hAnsi: 'Comic Sans MS', eastAsia: 'Microsoft JhengHei' };
const CARD_W = 3572; // 63 mm in DXA
const CARD_H = 4989; // 88 mm in DXA
const cut = { style: BorderStyle.DASHED, size: 6, color: '808080' };
const borders = { top: cut, bottom: cut, left: cut, right: cut };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Target word in bold + underline inside the sentence.
function sentenceRuns(text, word) {
  return text.split(new RegExp(`(${esc(word)})`, 'i')).filter(Boolean).map((t) =>
    new TextRun({ text: t, font: FONT, size: 22, ...(t.toLowerCase() === word.toLowerCase() ? { bold: true, underline: {} } : {}) }));
}

function cardCell(c) {
  if (!c) return new TableCell({ width: { size: CARD_W, type: WidthType.DXA }, borders, children: [new Paragraph('')] });
  return new TableCell({
    width: { size: CARD_W, type: WidthType.DXA },
    borders,
    verticalAlign: VerticalAlign.TOP,
    margins: { top: 140, bottom: 80, left: 150, right: 150 },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: c.word, font: FONT, size: 40, bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: c.zh, font: FONT, size: 18, color: '555555' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB', space: 4 } },
        children: [new ImageRun({ type: 'png', data: fs.readFileSync(path.join(IMG, imgName(c.word) + '.png')),
          transformation: { width: 212, height: 141 } })] }),
      ...c.lines.map(([who, said]) => new Paragraph({
        spacing: { before: 60, after: 60, line: 260 },
        indent: { left: 200, hanging: 200 },
        children: [new TextRun({ text: who + ': ', font: FONT, size: 22, bold: true }), ...sentenceRuns(said, c.word)],
      })),
    ],
  });
}

const rows = [];
for (let i = 0; i < cards.length; i += 3) {
  rows.push(new TableRow({
    height: { value: CARD_H, rule: HeightRule.EXACT },
    cantSplit: true,
    children: [0, 1, 2].map((k) => cardCell(cards[i + k])),
  }));
}

const doc = new Document({
  title: `Flashcards ${group}`,
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  sections: [{
    properties: { page: {
      size: { width: 11906, height: 16838 }, // A4, 3 rows x 3 cards per page
      margin: { top: 760, bottom: 500, left: 595, right: 595, header: 300, footer: 300 },
    } },
    children: [
      new Table({ width: { size: CARD_W * 3, type: WidthType.DXA }, columnWidths: [CARD_W, CARD_W, CARD_W],
        layout: TableLayoutType.FIXED, alignment: AlignmentType.CENTER, rows }),
      // Word requires a paragraph after a table; keep it tiny so it never spills to a blank page.
      new Paragraph({ spacing: { before: 0, after: 0, line: 20, lineRule: 'exact' }, children: [new TextRun({ text: '', size: 2 })] }),
    ],
  }],
});

const out = path.join(ROOT, `flashcards_${group}.docx`);
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log('docx   ->', path.relative(ROOT, out)); });
