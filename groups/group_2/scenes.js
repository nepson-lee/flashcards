// Scenes for group_2 (school things). Keys must match the "word" field in cards.json.
// Each value is a complete SVG string built with svg(...).
const {
  S, person, sun, cloud, bird, tree, house, ground, grass, svg, windowFrame, table,
  book, openBook, pencil, eraser, paper, desk, chair, backpack, blackboard,
} = require('../../scripts/primitives');

// Hand positions for person({x, y, s}): point-r -> (x + 42s, y + 17s); point-l -> (x - 42s, y + 17s).
module.exports = {
  // Amy hands Ben his book.
  book: svg(
    ground() + grass([20, 150, 280]) +
    person({ x: 92, y: 76, s: 1, hair: 'girl', wave: 'point-r' }) +
    person({ x: 210, y: 76, s: 1, hair: 'boy', wave: 'point-l', mouth: 'open' }) +
    book(151, 92, 46, 34)
  ),
  // Mary gives Tom a big pencil.
  pencil: svg(
    ground() +
    person({ x: 82, y: 76, s: 1, hair: 'girl', wave: 'point-r' }) +
    person({ x: 222, y: 76, s: 1, hair: 'boy', mouth: 'open' }) +
    pencil(150, 92, 76, -10) +
    `<path d="M150,62 l0,-10 M136,66 l-6,-8 M164,66 l6,-8" ${S} stroke-width="2"/>`
  ),
  // Ben made a mistake on his paper; Amy holds out her eraser.
  eraser: svg(
    ground() +
    person({ x: 62, y: 66, s: 0.95, hair: 'boy', mouth: 'open' }) +
    person({ x: 244, y: 66, s: 0.95, hair: 'girl', wave: 'point-l' }) +
    eraser(196, 82, 30, 16, -8) +
    desk(96, 132, 112) +
    paper(140, 116, 52, 30, false, 0) +
    `<path d="M120,114 q6,-8 12,0 t12,0 t12,0" fill="none" ${S} stroke-width="2"/>` +
    pencil(178, 122, 34, -20) +
    `<text x="58" y="30" font-family="Arial" font-weight="bold" font-size="22">!</text>`
  ),
  // Mom gives Amy a stack of paper; crayons on the table for drawing.
  paper: svg(
    ground() +
    person({ x: 70, y: 76, s: 1, hair: 'woman', wave: 'point-r' }) +
    person({ x: 232, y: 82, s: 0.92, hair: 'girl', wave: 'point-l', mouth: 'open' }) +
    paper(150, 88, 42, 54, false, -6) + paper(146, 92, 42, 54, false, 4) + paper(150, 94, 42, 54, true, 0)
  ),
  // Classroom: Miss Wang points at the desk; Ben's book is on it.
  desk: svg(
    `<line x1="8" y1="186" x2="292" y2="186" ${S}/>` +
    blackboard(116, 12, 112, 50, 'A B C') +
    person({ x: 62, y: 86, s: 0.95, hair: 'woman', wave: 'point-r' }) +
    desk(122, 140, 100) + book(160, 130, 40, 18) +
    person({ x: 252, y: 86, s: 0.95, hair: 'boy', wave: 'l' })
  ),
  // Tony points to his backpack on the floor; Mom asks where it is.
  backpack: svg(
    ground() + grass([20, 280]) +
    person({ x: 62, y: 76, s: 1, hair: 'woman', mouth: 'open' }) +
    `<text x="96" y="46" font-family="Arial" font-weight="bold" font-size="22">?</text>` +
    backpack(152, 176, 1.15) +
    person({ x: 236, y: 76, s: 1, hair: 'boy', wave: 'point-l', mouth: 'open' })
  ),
  // Dad points to a chair for Kate.
  chair: svg(
    `<line x1="8" y1="186" x2="292" y2="186" ${S}/>` +
    windowFrame(122, 14, 60, 46, sun(152, 36, 8, false)) +
    person({ x: 60, y: 76, s: 1.05, hair: 'man', wave: 'point-r' }) +
    chair(152, 186, 1.1) +
    person({ x: 246, y: 86, s: 0.92, hair: 'girl', wave: 'l', mouth: 'open' })
  ),
  // Miss Wang teaches at the blackboard; two students listen.
  teacher: svg(
    `<line x1="8" y1="186" x2="292" y2="186" ${S}/>` +
    blackboard(104, 14, 140, 66, 'A B C') +
    person({ x: 64, y: 76, s: 1.05, hair: 'woman', wave: 'point-r', mouth: 'open' }) +
    person({ x: 150, y: 116, s: 0.68, hair: 'boy' }) +
    person({ x: 228, y: 116, s: 0.68, hair: 'girl', wave: 'r' })
  ),
  // A new student with a backpack meets Miss Wang in the classroom.
  student: svg(
    `<line x1="8" y1="186" x2="292" y2="186" ${S}/>` +
    blackboard(112, 14, 104, 48, 'Hello!') +
    person({ x: 64, y: 76, s: 1.05, hair: 'woman', wave: 'r' }) +
    backpack(250, 168, 0.85) +
    person({ x: 230, y: 92, s: 0.9, hair: 'boy', wave: 'l', mouth: 'open' }) +
    `<path d="M219,110 L224,150 M241,110 L240,150" ${S} stroke-width="4"/>`
  ),
};
