// Scenes for group_1. Keys must match the "word" field in cards.json.
// Each value is a complete SVG string built with svg(...).
const {
  S, person, sun, halfSun, moon, star, clock, table, bowl, chopsticks, plateEgg, glass, toast,
  windowFrame, cloud, bird, tree, house, ground, grass, svg,
} = require("../../scripts/primitives");

module.exports = {
  // Tony & Mary greet each other; sun rising.
  morning: svg(
    halfSun(150, 178, 34) + bird(60, 40) + bird(80, 30) + bird(232, 36) +
    ground() + grass([30, 250, 280]) +
    person({ x: 72, y: 76, s: 1, hair: 'boy', wave: 'r' }) +
    person({ x: 228, y: 76, s: 1, hair: 'girl', wave: 'l' })
  ),
  // It is noon. Sun high, clock at 12, Mom calls Ben to eat.
  noon: svg(
    sun(150, 34, 18) + clock(42, 46, 30, 12, 0, true) +
    ground() +
    person({ x: 82, y: 86, s: 0.85, hair: 'woman', wave: 'point-r' }) +
    person({ x: 236, y: 86, s: 0.85, hair: 'boy', mouth: 'open' }) +
    table(112, 136, 96) + bowl(138, 120, true) + bowl(182, 120, true) + chopsticks(176, 122)
  ),
  // Good afternoon, Miss Wang. Teacher and student; sun lower in sky; tree.
  afternoon: svg(
    sun(196, 40, 15) + cloud(118, 30, 0.8) + cloud(272, 28, 0.6) +
    ground() + tree(150, 178) + grass([20, 120, 190, 280]) +
    person({ x: 70, y: 70, s: 1.05, hair: 'woman', wave: 'r' }) +
    person({ x: 232, y: 84, s: 0.92, hair: 'girl', wave: 'l' })
  ),
  // Good evening, Dad. Dad comes home; sun setting behind hills.
  evening: svg(
    halfSun(72, 150, 20) + `<path d="M8,178 Q70,120 140,178 Z" fill="#fff" ${S}/>` +
    star(30, 30, 5) + star(120, 22, 4) + bird(160, 40) +
    house(212, 178, true) + ground() +
    person({ x: 150, y: 76, s: 0.98, hair: 'man', wave: 'hold' }) +
    `<rect x="160" y="128" width="22" height="16" rx="2" fill="#000"/><path d="M166,128 v-4 h10 v4" fill="none" ${S} stroke-width="2"/>` +
    person({ x: 268, y: 98, s: 0.78, hair: 'girl', wave: 'l' })
  ),
  // Good night, Sam. Child in bed, moon and stars in window, mom waves.
  night: svg(
    windowFrame(24, 22, 92, 72, moon(54, 44, 14) + star(92, 36, 6) + star(80, 72, 4) + star(40, 76, 5)) +
    `<line x1="8" y1="186" x2="292" y2="186" ${S}/>` +
    // bed
    `<rect x="132" y="100" width="12" height="86" rx="3" fill="#fff" ${S}/>` +
    `<rect x="276" y="128" width="12" height="58" rx="3" fill="#fff" ${S}/>` +
    `<rect x="144" y="140" width="132" height="22" fill="#fff" ${S}/>` +
    `<ellipse cx="170" cy="128" rx="24" ry="12" fill="#fff" ${S}/>` +
    person({ x: 170, y: 118, s: 0.8, hair: 'boy', closedEyes: true }).replace(/<line[^>]*y1="66"[^>]*\/>/g, '').replace(/<ellipse cx="-?14" cy="98"[^>]*\/>/g, '') +
    `<path d="M150,130 Q210,120 276,132 L276,162 L150,162 Z" fill="#fff" ${S}/>` +
    `<path d="M180,140 l8,8 l-8,8 M206,140 l8,8 l-8,8 M232,140 l8,8 l-8,8" fill="none" ${S} stroke-width="2"/>` +
    `<text x="196" y="96" font-family="Arial" font-weight="bold" font-size="14">z</text><text x="208" y="82" font-family="Arial" font-weight="bold" font-size="18">Z</text><text x="224" y="64" font-family="Arial" font-weight="bold" font-size="22">Z</text>` +
    person({ x: 64, y: 98, s: 0.82, hair: 'woman', wave: 'r' })
  ),
  // Breakfast: milk, egg, toast; girl at table; morning sun in window.
  breakfast: svg(
    windowFrame(200, 14, 80, 60, sun(240, 44, 11, false)) +
    person({ x: 150, y: 72, s: 1, hair: 'girl', wave: 'hold', mouth: 'open' }) +
    table(30, 128, 240) +
    glass(78, 128, 'MILK') + plateEgg(150, 122) + toast(222, 128) +
    `<path d="M106,126 v-24 M102,102 v8 M106,102 v8 M110,102 v8 M102,110 q4,4 8,0" fill="none" ${S} stroke-width="2"/>`
  ),
  // Lunch: two kids with a lunch box of rice and fish.
  lunch: svg(
    sun(150, 26, 13) + ground() +
    person({ x: 52, y: 76, s: 0.95, hair: 'boy', wave: 'point-r' }) +
    person({ x: 250, y: 76, s: 0.95, hair: 'girl', mouth: 'open' }) +
    table(92, 140, 116, 12) +
    // lunch box
    `<rect x="102" y="96" width="96" height="44" rx="6" fill="#fff" ${S}/>` +
    `<line x1="150" y1="96" x2="150" y2="140" ${S}/>` +
    `<path d="M110,128 q0,-22 18,-22 q18,0 18,22 Z" fill="#fff" ${S} stroke-width="2"/>` +
    [[118, 118], [126, 113], [134, 119], [122, 124], [131, 126], [140, 124], [128, 120]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="2.4" ry="1.4" fill="#000"/>`).join('') +
    `<path d="M156,118 q14,-14 30,0 q-16,14 -30,0 Z M186,118 l8,-7 v14 Z" fill="#fff" ${S} stroke-width="2"/><circle cx="163" cy="116" r="2" fill="#000"/>` +
    `<path d="M172,111 q4,7 0,14" fill="none" ${S} stroke-width="1.5"/>` +
    // lid
    `<rect x="102" y="80" width="96" height="10" rx="4" fill="#000" transform="rotate(-8 150 85)"/>`
  ),
  // Dinner is ready! Family at table, moon in window, steam.
  dinner: svg(
    windowFrame(118, 10, 64, 50, moon(140, 28, 10) + star(168, 22, 4)) +
    person({ x: 52, y: 76, s: 0.95, hair: 'man', wave: 'point-r' }) +
    person({ x: 150, y: 80, s: 0.75, hair: 'boy', mouth: 'open' }) +
    person({ x: 248, y: 90, s: 0.85, hair: 'girl', wave: 'l', mouth: 'open' }) +
    table(76, 140, 148) +
    bowl(110, 124) + `<ellipse cx="150" cy="134" rx="26" ry="7" fill="#fff" ${S}/><path d="M132,130 q8,-12 18,-6 q10,-8 18,4" fill="none" ${S} stroke-width="2"/>` + bowl(190, 124)
  ),
  // What time is it? It's seven o'clock.
  "o'clock": svg(
    clock(112, 98, 72, 7, 0, true) +
    person({ x: 236, y: 82, s: 0.95, hair: 'girl', wave: 'point-l', mouth: 'open' }) +
    `<path d="M210,40 q-8,-24 14,-28 q22,-4 40,6 q14,10 -2,22 q-12,8 -30,4 l-14,8 Z" fill="#fff" ${S} stroke-width="2.5"/>` +
    `<text x="238" y="34" font-family="Arial" font-weight="bold" font-size="18" text-anchor="middle">7:00</text>`
  ),
};
