// Scenes for group_3 (rooms and things at home). Keys must match the "word" field in cards.json.
// Each value is a complete SVG string built with svg(...).
const {
  S, person, table, bowl, chopsticks, glass, ground, svg, windowFrame, cloud, sun,
  book, openBook, spoon, towel, sofaBack, sofaFront, tv, pot, stove, bathtub, bubbles,
  showerHead, bed, drawers, note, tiles,
} = require('../../scripts/primitives');

// Hand positions for person({x, y, s}): point-r -> (x + 42s, y + 17s); point-l -> (x - 42s, y + 17s);
// hold -> (x ± 22s, y + 51s).

// Table with a long tablecloth that hides the legs of whoever sits behind it.
const clothTable = (x, y, w) =>
  `<path d="M${x},${y} H${x + w} V${y + 44} ${Array.from({ length: Math.round(w / 20) }, () => 'q-5,6 -10,0 q-5,6 -10,0').join(' ')} Z" fill="#fff" ${S}/>` +
  `<line x1="${x + 8}" y1="${y + 44}" x2="${x + 8}" y2="178" ${S}/><line x1="${x + w - 8}" y1="${y + 44}" x2="${x + w - 8}" y2="178" ${S}/>`;
const soupBowl = (x, y, steam = true) => (steam ?
  `<path d="M${x - 8},${y - 6} q-5,-7 0,-14 q5,-7 0,-14 M${x + 6},${y - 6} q-5,-7 0,-14 q5,-7 0,-14" fill="none" ${S} stroke-width="2"/>` : '') +
  `<ellipse cx="${x}" cy="${y}" rx="19" ry="4" fill="#000"/>` +
  bowl(x, y, false, 'none');
const drop = (x, y) => `<path d="M${x},${y} q-5,8 0,10 q5,-2 0,-10 Z" fill="#fff" ${S} stroke-width="1.5"/>`;
const picture = (x, y) =>
  `<rect x="${x}" y="${y}" width="48" height="34" fill="#fff" ${S}/>` +
  `<path d="M${x + 4},${y + 30} L${x + 18},${y + 12} L${x + 28},${y + 22} L${x + 34},${y + 16} L${x + 44},${y + 30} Z" fill="#000"/>` +
  `<circle cx="${x + 36}" cy="${y + 9}" r="4" fill="#000"/>`;

module.exports = {
  // Living room: Dad sits on the sofa reading; TV beside him; Amy asks.
  'living room': svg(
    ground() + picture(56, 22) +
    sofaBack(20, 178, 130) +
    person({ x: 85, y: 80, s: 1, hair: 'man', wave: 'hold' }) +
    sofaFront(20, 178, 130) +
    openBook(85, 128, 54) +
    tv(205, 178, 58) +
    person({ x: 268, y: 90, s: 0.88, hair: 'girl', wave: 'point-l', mouth: 'open' })
  ),
  // Dining room: lamp over the table, Amy eats rice behind it; Tony points at her.
  'dining room': svg(
    ground() +
    `<line x1="130" y1="0" x2="130" y2="18" ${S} stroke-width="2"/><path d="M114,32 L122,18 H138 L146,32 Z" fill="#000" ${S}/>` +
    `<path d="M124,36 l-4,8 M130,37 v9 M136,36 l4,8" ${S} stroke-width="2"/>` +
    person({ x: 130, y: 76, s: 0.9, hair: 'girl', wave: 'hold' }) +
    bowl(130, 106, false) +
    clothTable(66, 122, 128) +
    soupBowl(90, 118) + glass(176, 122) +
    person({ x: 254, y: 76, s: 1, hair: 'boy', wave: 'point-l', mouth: 'open' })
  ),
  // Kitchen: Mom cooks at the stove; steam from the pot; cupboards above. Ben watches.
  kitchen: svg(
    ground() +
    `<rect x="164" y="10" width="120" height="44" rx="3" fill="#fff" ${S}/><line x1="224" y1="10" x2="224" y2="54" ${S}/>` +
    `<path d="M216,26 v12 M232,26 v12" ${S} stroke-width="4"/>` +
    stove(178, 178, 100) + pot(228, 108, 52) +
    person({ x: 142, y: 76, s: 1, hair: 'woman', wave: 'point-r' }) +
    person({ x: 46, y: 90, s: 0.86, hair: 'boy', mouth: 'open' })
  ),
  // Bathroom: Ben sings in the bathtub full of bubbles; Amy points at him.
  bathroom: svg(
    tiles(10, 10, 280, 126, 28) + `<rect x="10" y="10" width="280" height="126" fill="none" stroke="#000" stroke-width="1"/>` +
    ground() +
    person({ x: 96, y: 96, s: 0.9, hair: 'boy', wave: 'l', mouth: 'open', closedEyes: true }) +
    `<rect x="20" y="150" width="160" height="50" fill="#fff"/>` + ground() + bathtub(24, 178, 150) +
    bubbles([[46, 112, 9], [62, 108, 7], [138, 112, 9], [154, 107, 7], [166, 113, 6]]) +
    note(140, 66) + note(166, 44, 0.8) + note(54, 50, 0.7) +
    person({ x: 250, y: 76, s: 1, hair: 'girl', wave: 'point-l' })
  ),
  // Shower: Tony washes under the shower head; towel hangs on the wall.
  shower: svg(
    tiles(10, 10, 280, 126, 28) + `<rect x="10" y="10" width="280" height="126" fill="none" stroke="#000" stroke-width="1"/>` +
    ground() +
    `<rect x="60" y="170" width="140" height="8" fill="#fff" ${S}/>` +
    showerHead(70, 16, 150) +
    person({ x: 130, y: 82, s: 0.94, hair: 'boy', wave: 'r', closedEyes: true }) +
    bubbles([[118, 58, 6], [132, 54, 7], [146, 60, 5]]) +
    towel(228, 50, 40, 60)
  ),
  // Towel: wet Ben asks Mom; Mom points at the towel on the bathroom wall.
  towel: svg(
    tiles(10, 10, 280, 126, 28) + `<rect x="10" y="10" width="280" height="126" fill="none" stroke="#000" stroke-width="1"/>` +
    ground() +
    person({ x: 66, y: 76, s: 1, hair: 'boy', mouth: 'open' }) +
    drop(40, 44) + drop(92, 40) + drop(30, 70) + drop(102, 66) +
    towel(170, 46, 46, 62) +
    person({ x: 260, y: 76, s: 1, hair: 'woman', wave: 'point-l' })
  ),
  // Drawer: the toy drawer is pulled out from under the bed; Mom points at it, Tony is glad.
  drawer: svg(
    ground() +
    bed(14, 178, 170, true,
      `<circle cx="74" cy="142" r="11" fill="#fff" ${S}/><path d="M63,142 h22 M74,131 q-6,11 0,22" fill="none" ${S} stroke-width="2"/>` +
      `<rect x="98" y="136" width="30" height="12" rx="3" fill="#000"/><path d="M104,136 l4,-7 h12 l4,7" fill="#fff" ${S} stroke-width="2"/>` +
      `<circle cx="105" cy="149" r="4" fill="#fff" ${S} stroke-width="2"/><circle cx="121" cy="149" r="4" fill="#fff" ${S} stroke-width="2"/>` +
      `<rect x="138" y="130" width="20" height="20" fill="#fff" ${S}/><text x="148" y="146" font-family="Arial" font-weight="bold" font-size="15" text-anchor="middle">A</text>`) +
    person({ x: 256, y: 76, s: 1, hair: 'woman', wave: 'point-l' })
  ),
  // Soup: Mary eats soup at the kitchen table; pot on the stove; Ben asks.
  soup: svg(
    ground() +
    stove(214, 178, 76) + pot(252, 108, 44) +
    person({ x: 140, y: 76, s: 0.9, hair: 'girl', wave: 'hold', mouth: 'open' }) +
    soupBowl(140, 106, false) + spoon(162, 94, 40, 150) +
    clothTable(86, 124, 112) +
    person({ x: 42, y: 86, s: 0.86, hair: 'boy', mouth: 'open' }) +
    `<text x="74" y="50" font-family="Arial" font-weight="bold" font-size="22">?</text>`
  ),
  // Spoon: Dad opens the drawer full of spoons; Amy waits with her bowl.
  spoon: svg(
    ground() +
    person({ x: 64, y: 76, s: 1, hair: 'man', wave: 'point-r' }) +
    drawers(124, 178, 92, 100, 3, 0,
      spoon(146, 92, 40, -75) + spoon(166, 90, 40, -95) + spoon(186, 92, 40, -110) + spoon(204, 95, 34, -80)) +
    person({ x: 262, y: 86, s: 0.86, hair: 'girl', wave: 'hold', mouth: 'open' }) +
    bowl(262, 118, false, 'none')
  ),
};
