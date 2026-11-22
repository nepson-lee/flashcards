// Scenes for group_5 (actions and feelings). Keys must match the "word" field in cards.json.
// Style: 迪士尼風格, 用動物做主角 — classic animal-cartoon look; see scripts/styles/disney.js
// (big round heads, tall oval eyes, rubber-hose limbs, white gloves, big shoes, emotion marks,
// rounded backgrounds, #000/#fff only). Original characters only — Dan the duck and Mia the
// mouse, never Donald Duck or Mickey/Minnie Mouse.
const { svg } = require('../../scripts/primitives');
const {
  L, animal, hand, tearsG, puffG, angerG, sparkG, zzzG, motionG,
  groundG, hillsG, lollipopTreeG, puffyCloudG, sunG, roomG,
} = require('../../scripts/styles/disney');

const G = 186; // ground / floor line

const star = (x, y, r = 4) => `<path d="M${x},${y - r} L${x + r * 0.3},${y - r * 0.3} L${x + r},${y} L${x + r * 0.3},${y + r * 0.3} L${x},${y + r} L${x - r * 0.3},${y + r * 0.3} L${x - r},${y} L${x - r * 0.3},${y - r * 0.3} Z" fill="#000"/>`;
const bubble = (x, y, w, h, tx, ty, inner = '') =>
  `<path d="M${tx},${ty} Q${x - 4},${y + h / 2} ${x - 6},${y + h / 2 - 10}" fill="none" ${L(1.6)}/>` +
  `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h / 2}" fill="#fff" ${L(2)}/>` + inner;
const thought = (x, y, w, h, tx, ty, inner = '') =>
  `<circle cx="${tx}" cy="${ty}" r="2.5" fill="#fff" ${L(1.5)}/><circle cx="${(tx + x) / 2}" cy="${(ty + y + h / 2) / 2}" r="4" fill="#fff" ${L(1.6)}/>` +
  `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h / 2}" fill="#fff" ${L(2)}/>` + inner;
const ball = (x, y, r = 9) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${L(2)}/><path d="M${x - r},${y} Q${x},${y - r * 0.6} ${x + r},${y} M${x},${y - r} Q${x - r * 0.6},${y} ${x},${y + r}" fill="none" ${L(1.4)}/>`;
const openBook = (x, y, w = 30) =>
  `<path d="M${x},${y + 4} Q${x - w / 4},${y - 2} ${x - w / 2},${y + 2} V${y - 14} Q${x - w / 4},${y - 18} ${x},${y - 12} Q${x + w / 4},${y - 18} ${x + w / 2},${y - 14} V${y + 2} Q${x + w / 4},${y - 2} ${x},${y + 4} Z" fill="#fff" ${L(2)}/>` +
  `<path d="M${x},${y - 12} V${y + 4} M${x - w / 2 + 4},${y - 9} h${w / 2 - 8} M${x - w / 2 + 4},${y - 4} h${w / 2 - 8} M${x + 4},${y - 9} h${w / 2 - 8} M${x + 4},${y - 4} h${w / 2 - 8}" fill="none" ${L(1.1)}/>`;
const closedBook = (x, y, w = 26, h = 18) =>
  `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="2" fill="#fff" ${L(2)}/>` +
  `<path d="M${x - w / 2 + 4},${y - h / 2} V${y + h / 2}" ${L(1.6)}/><rect x="${x - 3}" y="${y - 4}" width="10" height="6" fill="none" ${L(1.1)}/>`;
const castle = (x, y) =>
  `<path d="M${x - 14},${y + 8} V${y - 4} h4 v3 h4 v-3 h4 v-8 l2,-6 l2,6 v8 h4 v3 h4 v-3 h4 V${y + 8} Z" fill="#fff" ${L(1.6)}/>` +
  `<path d="M${x - 3},${y + 8} v-6 q3,-4 6,0 v6" fill="#000"/>`;
const cookie = (x, y, r = 7) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${L(1.8)}/><circle cx="${x - r * 0.4}" cy="${y - r * 0.3}" r="1.3" fill="#000"/>` +
  `<circle cx="${x + r * 0.35}" cy="${y - r * 0.1}" r="1.3" fill="#000"/><circle cx="${x - r * 0.05}" cy="${y + r * 0.45}" r="1.3" fill="#000"/>`;

module.exports = {
  // Bedtime: Dan reads a story from an open book; Mia listens. A castle in the story bubble.
  tell: svg(
    roomG(G, 196, 18, 64, 54, `<path d="M210,34 a10,10 0 1 0 12,14 a8,8 0 1 1 -12,-14 Z" fill="#000"/>` + star(244, 34, 3) + star(250, 56, 2.5)) +
    animal({ kind: 'duck', x: 96, y: G, armL: 'hold', armR: 'hold', face: 'open', look: 0.6 }) +
    openBook(96, -40 + G + 2, 34) +
    animal({ kind: 'mouse', x: 176, y: G, armL: 'hold', armR: 'down', face: 'happy', look: -1 }) +
    bubble(46, 40, 66, 44, 74, 92, castle(46, 42) + star(26, 30, 3) + star(66, 28, 3))
  ),
  // Dan proudly holds up his big kite; Mia is amazed.
  show: svg(
    sunG(40, 32, 12) + puffyCloudG(150, 30, 0.8) + hillsG(G) + groundG(G) + lollipopTreeG(276, G, 0.75) +
    animal({ kind: 'duck', x: 176, y: G, armL: 'hip', armR: 'wave', face: 'open', look: -0.8 }) +
    (() => {
      const [hx, hy] = hand({ x: 176, y: G, armR: 'wave' }, 'r');
      const kx = hx + 26, ky = hy - 28;
      return `<path d="M${kx},${ky - 30} L${kx + 22},${ky} L${kx},${ky + 32} L${kx - 22},${ky} Z" fill="#fff" ${L(2.4)}/>` +
        `<path d="M${kx},${ky - 30} V${ky + 32} M${kx - 22},${ky} H${kx + 22}" ${L(1.6)}/>` +
        `<path d="M${kx - 22},${ky} L${kx},${ky - 30} L${kx},${ky} Z M${kx + 22},${ky} L${kx},${ky + 32} L${kx},${ky} Z" fill="#000"/>` +
        `<path d="M${kx},${ky + 32} q-8,10 0,18 q8,8 0,18" fill="none" ${L(1.6)}/>` +
        `<path d="M${kx - 5},${ky + 46} l5,-3 l5,3 M${kx - 5},${ky + 62} l5,-3 l5,3" fill="none" ${L(1.6)}/>` +
        `<path d="M${hx + 4},${hy - 4} L${kx - 4},${ky + 4}" ${L(1.2)}/>`;
    })() +
    animal({ kind: 'mouse', x: 84, y: G, armL: 'down', armR: 'point', face: 'open', look: 1 }) +
    sparkG(128, 70, 5) + sparkG(140, 92, 3.5)
  ),
  // A race: START banner; Mia waves the flag, Dan dashes off from the start line.
  start: svg(
    puffyCloudG(250, 26, 0.6) + groundG(G) + `<path d="M150,${G} l-4,10 M150,${G} l4,10" ${L(1.2)}/>` +
    `<path d="M120,${G} V44 M286,${G} V44" ${L(3)}/>` +
    `<rect x="132" y="40" width="142" height="28" rx="4" fill="#fff" ${L(2.4)}/>` +
    `<text x="203" y="62" font-family="Arial Black, Arial" font-weight="900" font-size="22" text-anchor="middle" fill="#000">START</text>` +
    `<path d="M130,${G + 6} H290" stroke="#000" stroke-width="5" stroke-dasharray="10 6"/>` +
    animal({ kind: 'mouse', x: 62, y: G, armL: 'down', armR: 'wave', face: 'open', look: 1 }) +
    (() => {
      const [hx, hy] = hand({ x: 62, y: G, armR: 'wave' }, 'r');
      return `<path d="M${hx},${hy + 6} V${hy - 40}" ${L(2.4)}/>` +
        `<path d="M${hx},${hy - 40} h28 v18 h-28 Z" fill="#fff" ${L(2)}/>` +
        `<path d="M${hx},${hy - 40} h7 v6 h-7 Z M${hx + 14},${hy - 40} h7 v6 h-7 Z M${hx + 7},${hy - 34} h7 v6 h-7 Z M${hx + 21},${hy - 34} h7 v6 h-7 Z M${hx},${hy - 28} h7 v6 h-7 Z M${hx + 14},${hy - 28} h7 v6 h-7 Z" fill="#000"/>`;
    })() +
    animal({ kind: 'duck', x: 214, y: G, legs: 'stomp', armL: 'fist', armR: 'point', face: 'open', look: 1 }) +
    motionG(170, 120, -1) + motionG(176, 150, -1)
  ),
  // Mia cries for her lost ball (in her thought bubble); Dan comforts her.
  sad: svg(
    puffyCloudG(60, 30, 0.6) + hillsG(G) + groundG(G) + lollipopTreeG(30, G, 0.8) +
    animal({ kind: 'duck', x: 110, y: G, armL: 'down', armR: 'forward', face: 'sad', look: 1 }) +
    animal({ kind: 'mouse', x: 190, y: G, armL: 'eye', armR: 'down', face: 'sad', look: -0.5 }) +
    tearsG(206, 92) + tearsG(170, 96, 0.8) +
    thought(254, 44, 60, 46, 214, 90, ball(250, 44, 12) + `<text x="272" y="56" font-family="Arial Black, Arial" font-weight="900" font-size="20" text-anchor="middle" fill="#000">?</text>`)
  ),
  // Mia hands Dan a cookie from the cookie jar; Dan reaches for it.
  give: svg(
    roomG(G, 128, 16, 52, 48) +
    `<path d="M14,130 H84 M20,130 V${G} M78,130 V${G}" ${L(2.4)}/>` +
    `<path d="M32,130 Q28,108 36,102 H62 Q70,108 66,130 Z" fill="#fff" ${L(2)}/><rect x="34" y="94" width="30" height="8" rx="2" fill="#fff" ${L(2)}/>` +
    cookie(44, 118, 5) + cookie(56, 120, 5) +
    animal({ kind: 'mouse', x: 116, y: G, armL: 'down', armR: 'forward', face: 'happy', look: 1 }) +
    animal({ kind: 'duck', x: 210, y: G, armL: 'forward', armR: 'down', face: 'open', look: -1 }) +
    cookie(162, G - 50, 8) + sparkG(162, 116, 4) + sparkG(150, 128, 2.5) + sparkG(174, 126, 2.5)
  ),
  // Mia holds a book; Dan points at the desk where she should put it.
  put: svg(
    roomG(G, 112, 16, 54, 48) +
    `<path d="M214,124 H292 M220,124 V${G} M286,124 V${G}" ${L(2.6)}/><path d="M228,124 V150 H278 V124 M246,137 h14" fill="none" ${L(1.8)}/>` +
    `<path d="M254,124 v-6 q8,-14 16,0 v6 Z" fill="#fff" ${L(1.8)}/><path d="M262,112 v-14" ${L(2)}/>` +
    animal({ kind: 'duck', x: 60, y: G, armL: 'down', armR: 'point', face: 'open', look: 1 }) +
    animal({ kind: 'mouse', x: 160, y: G, armL: 'hold', armR: 'hold', face: 'happy', look: 1 }) +
    closedBook(160, G - 44, 28, 18) +
    `<path d="M196,120 q14,-14 30,-4" fill="none" ${L(1.6)} stroke-dasharray="4 4"/><path d="M220,112 l7,4 l-6,5" fill="none" ${L(1.6)}/>`
  ),
  // Dan stomps with fists up, steaming mad — his ice cream is on the ground. Mia asks why.
  angry: svg(
    sunG(268, 28, 11) + hillsG(G) + groundG(G) + lollipopTreeG(34, G, 0.75) +
    animal({ kind: 'mouse', x: 84, y: G, armL: 'down', armR: 'down', face: 'open', look: 1 }) +
    animal({ kind: 'duck', x: 184, y: G, legs: 'stomp', armL: 'fist', armR: 'fist', face: 'angry', look: 0 }) +
    puffG(150, 76) + puffG(220, 72) + angerG(214, 102, 0.9) +
    `<path d="M236,${G - 2} q-6,-10 6,-14 q12,-4 16,6 q8,2 4,8 Z" fill="#fff" ${L(2)}/>` +
    `<path d="M256,${G - 12} L276,${G - 22} L268,${G - 4} Z" fill="#fff" ${L(2)}/><path d="M262,${G - 13} l8,4 M265,${G - 18} l6,6" ${L(1.1)}/>` +
    `<path d="M232,${G - 22} l-4,-4 M248,${G - 26} v-6 M262,${G - 30} l3,-5" ${L(1.4)}/>`
  ),
  // Bedtime: a duckling sleeps in a crib; Mia says "Shh!" to Dan.
  quiet: svg(
    roomG(G, 112, 16, 54, 48, `<path d="M124,30 a9,9 0 1 0 11,12 a7,7 0 1 1 -11,-12 Z" fill="#000"/>` + star(152, 32, 2.5)) +
    animal({ kind: 'duck', x: 52, y: G, armL: 'down', armR: 'down', face: 'happy', look: 1 }) +
    animal({ kind: 'mouse', x: 126, y: G, armL: 'down', armR: [[26, -42], [6, -58]], finger: 'r', face: 'shh', look: -1 }) +
    `<path d="M196,${G} V112 M286,${G} V112 M196,150 H286 M196,126 H286" ${L(2.4)}/>` +
    `<path d="M210,126 V150 M224,126 V150 M238,126 V150 M252,126 V150 M266,126 V150" ${L(1.6)}/>` +
    `<circle cx="226" cy="114" r="12" fill="#fff" ${L(2)}/><path d="M220,114 q3,2 6,0 M228,114 q3,2 6,0" fill="none" ${L(1.4)}/>` +
    `<path d="M226,102 q-3,-6 1,-7 M226,102 q4,-5 6,-2" fill="none" ${L(1.4)}/>` +
    `<path d="M219,120 Q227,126 235,120 Q227,117 219,120 Z" fill="#fff" ${L(1.4)}/>` +
    `<path d="M214,126 Q240,112 278,124" fill="#fff" ${L(2)}/>` +
    zzzG(246, 96)
  ),
  // Dan points down at his shiny new sneakers; the box is on the floor; Mia cheers.
  new: svg(
    roomG(G, 30, 16, 54, 48) +
    animal({ kind: 'duck', x: 150, y: G, armL: 'hip', armR: [[30, -40], [30, -22]], shoes: true, face: 'open', look: -0.6 }) +
    sparkG(122, G - 14, 5) + sparkG(182, G - 18, 5) + sparkG(132, G - 30, 3) + sparkG(172, G - 34, 3) +
    `<path d="M196,${G} V164 H244 V${G} M196,164 l8,-8 H252 l-8,8 M244,${G} l8,-8 V156" fill="#fff" ${L(2)}/>` +
    `<path d="M200,172 h20" ${L(1.4)}/>` +
    animal({ kind: 'mouse', x: 262, y: G, armL: 'wave', armR: 'wave', face: 'open', look: -1 })
  ),
};
