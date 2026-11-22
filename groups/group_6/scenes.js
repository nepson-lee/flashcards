// Scenes for group_6 (verbs and feelings). Keys must match the "word" field in cards.json.
// Style: 日本推理動漫風格 (requested as 名偵探柯南風格) — 1990s detective-anime look; see
// scripts/styles/detective.js (anime faces with big eyes and pointed chins, spiky hair clumps,
// manga effects: speed lines, sweat drops, "!" / "?", screentone dots; detective props).
// Original characters only — Ken, Lily, Dr. Bo, Sara and Amy, never the characters of any series.
const { svg } = require('../../scripts/primitives');
const {
  L, figure, hand, magnifier, footprint, sweat, exclaim, question, sparkle, speedLines, tone, cityG, roomG,
} = require('../../scripts/styles/detective');

const G = 180; // ground / floor line

const thought = (x, y, w, h, tx, ty, inner = '') =>
  `<circle cx="${tx}" cy="${ty}" r="2.4" fill="#fff" ${L(1.4)}/><circle cx="${(tx + x) / 2}" cy="${(ty + y + h / 2) / 2}" r="3.8" fill="#fff" ${L(1.5)}/>` +
  `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h / 2}" fill="#fff" ${L(1.8)}/>` + inner;
const catFace = (x, y, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M-10,-4 L-10,-16 L-3,-9 Q0,-10 3,-9 L10,-16 L10,-4 Q10,8 0,8 Q-10,8 -10,-4 Z" fill="#fff" ${L(1.6)}/>` +
  `<circle cx="-4" cy="-3" r="1.4" fill="#000"/><circle cx="4" cy="-3" r="1.4" fill="#000"/><path d="M-1,1 h2 l-1,1.4 Z M-6,1 l-8,-1 M-6,3 l-8,2 M6,1 l8,-1 M6,3 l8,2" ${L(1)}/></g>`;
const dogFace = (x, y, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="-2" rx="10" ry="9" fill="#fff" ${L(1.6)}/>` +
  `<path d="M-9,-8 Q-16,-6 -13,6 Q-9,2 -8,-2 Z M9,-8 Q16,-6 13,6 Q9,2 8,-2 Z" fill="#000"/>` +
  `<circle cx="-4" cy="-4" r="1.4" fill="#000"/><circle cx="4" cy="-4" r="1.4" fill="#000"/><ellipse cx="0" cy="1" rx="2.6" ry="1.8" fill="#000"/><path d="M0,3 v2 M-3,5 q3,2 6,0" fill="none" ${L(1)}/></g>`;
const labBench = (x0, x1, top) =>
  `<path d="M${x0},${top} H${x1} M${x0 + 6},${top} V${G} M${x1 - 6},${top} V${G}" ${L(2.4)}/>` +
  `<path d="M${x0 + 10},${top} v-16 h6 v6 l8,10 Z" fill="#fff" ${L(1.6)}/>` +
  `<path d="M${x1 - 30},${top} v-22 h8 v22 M${x1 - 30},${top - 10} h8" fill="none" ${L(1.6)}/>` +
  `<circle cx="${x1 - 26}" cy="${top - 28}" r="2" fill="#fff" ${L(1.2)}/><circle cx="${x1 - 22}" cy="${top - 34}" r="1.5" fill="#fff" ${L(1.2)}/>`;
const shelf = (x, y, w) =>
  `<path d="M${x},${y} h${w}" ${L(2)}/><rect x="${x + 6}" y="${y - 16}" width="12" height="16" fill="#fff" ${L(1.4)}/>` +
  `<rect x="${x + 20}" y="${y - 22}" width="9" height="22" fill="#000"/><circle cx="${x + w - 14}" cy="${y - 8}" r="8" fill="#fff" ${L(1.4)}/>` +
  `<path d="M${x + w - 14},${y - 8} l4,-4" ${L(1.2)}/>`;

module.exports = {
  // Ken studies footprints with a magnifying glass; Lily wants to follow them. City behind.
  look: svg(
    cityG(G - 30) + `<path d="M0,${G - 30} H300" ${L(1.4)}/>` + tone(0, G - 30, 300, 30, 6, 0.7) +
    `<path d="M0,${G} H300" ${L(2)}/>` +
    footprint(150, 188, 80) + footprint(176, 192, 100) + footprint(204, 188, 80) + footprint(232, 192, 100) + footprint(260, 188, 80) + footprint(288, 192, 100) +
    figure({ who: 'ken', x: 92, y: G, armL: 'hip', armR: 'glass', face: 'serious', look: 1 }) +
    magnifier(...hand({ who: 'ken', x: 92, y: G, armR: 'glass' }, 'r'), 10, 40) +
    exclaim(76, 82, 1.1) +
    figure({ who: 'lily', x: 238, y: G, armL: 'point', armR: 'hip', face: 'open', look: -1 })
  ),
  // Ken carries a rolled-up map to Lily, who holds out her hand.
  bring: svg(
    roomG(G, 120, 18, 60, 44) + shelf(14, 70, 80) +
    figure({ who: 'ken', x: 102, y: G, armL: 'forward', armR: 'forward', face: 'smile', look: 1 }) +
    (() => {
      const [hx, hy] = hand({ who: 'ken', x: 102, y: G, armR: 'forward' }, 'r');
      return `<path d="M${hx - 34},${hy - 8} L${hx + 8},${hy - 8} L${hx + 8},${hy + 4} L${hx - 34},${hy + 4} Z" fill="#fff" ${L(1.8)}/>` +
        `<ellipse cx="${hx + 8}" cy="${hy - 2}" rx="3" ry="6" fill="#fff" ${L(1.6)}/><path d="M${hx - 18},${hy - 8} v12" ${L(1.4)}/>`;
    })() +
    `<path d="M48,120 h10 M44,132 h14 M50,144 h8" ${L(1.4)}/>` +
    figure({ who: 'lily', x: 214, y: G, armL: 'forward', armR: 'hip', face: 'smile', look: -1 })
  ),
  // Dr. Bo hands Ken a new gadget; Ken thanks him; Lily (who asked) smiles behind.
  say: svg(
    roomG(G, 214, 16, 60, 42) + labBench(206, 296, 140) +
    figure({ who: 'lily', x: 40, y: G, armL: 'down', armR: 'hip', face: 'smile', look: 1 }) +
    figure({ who: 'ken', x: 104, y: G, armL: 'down', armR: 'forward', face: 'laugh', look: 1 }) +
    figure({ who: 'bo', x: 176, y: G, armL: 'forward', armR: 'down', face: 'smile', look: -1 }) +
    (() => {
      const [hx, hy] = hand({ who: 'bo', x: 176, y: G, s: 1.08, armL: 'forward' }, 'l');
      return `<rect x="${hx - 12}" y="${hy - 14}" width="14" height="10" rx="2" fill="#fff" ${L(1.6)}/><circle cx="${hx - 5}" cy="${hy - 9}" r="2.4" fill="#000"/>` +
        `<path d="M${hx - 3},${hy - 14} l3,-8" ${L(1.4)}/><circle cx="${hx}" cy="${hy - 23}" r="1.6" fill="#000"/>`;
    })() +
    sparkle(132, 92, 4) + sparkle(144, 80, 3)
  ),
  // In the lab Ken raises his hand with a question; Dr. Bo strokes his chin.
  ask: svg(
    roomG(G, 20, 16, 56, 42) + labBench(4, 92, 140) + shelf(180, 40, 60) +
    figure({ who: 'ken', x: 124, y: G, armL: 'down', armR: 'up', face: 'open', look: 1 }) +
    question(150, 60, 1.3) +
    figure({ who: 'bo', x: 228, y: G, armL: 'chin', armR: 'hip', face: 'smile', look: -1 })
  ),
  // Amy cries for her lost cat (thought bubble); Ken bends to comfort her.
  cry: svg(
    `<path d="M0,${G} H300" ${L(2)}/>` +
    `<path d="M14,${G} V96 M10,96 q-4,-26 16,-30 q14,-18 30,0 q18,6 10,26 q-6,10 -22,6 q-12,8 -24,-2 Z" fill="#fff" ${L(1.8)}/>` +
    `<path d="M24,${G} V100" ${L(1.8)}/><path d="M26,76 q6,-4 12,0 M40,88 q5,-3 10,0" fill="none" ${L(1.2)}/>` +
    figure({ who: 'ken', x: 132, y: G, armL: 'down', armR: 'forward', face: 'sad', look: 1 }) +
    sweat(152, 92) +
    figure({ who: 'amy', x: 196, y: G, armL: 'eye', armR: 'eye', face: 'cry', look: 0 }) +
    thought(258, 48, 54, 44, 214, 96, catFace(258, 52, 1.1) + question(276, 44, 0.7))
  ),
  // On a hilltop Ken points over the whole city below; Lily is amazed. Speed lines for "wow".
  everything: svg(
    `<g transform="translate(120,${G}) scale(0.62)">${cityG(0, 0, 290)}</g>` + `<path d="M120,${G} H300" ${L(1.4)}/>` +
    tone(120, G - 10, 180, 10, 5, 0.7) +
    `<path d="M0,${G} V136 Q60,124 104,132 Q132,140 150,${G} Z" fill="#fff" ${L(2)}/>` +
    `<path d="M20,150 l6,-3 M50,160 l6,-3 M90,150 l6,-3 M110,166 l6,-3" ${L(1.2)}/>` +
    figure({ who: 'ken', x: 84, y: 131, s: 0.9, armL: 'hip', armR: 'point', face: 'laugh', look: 1 }) +
    figure({ who: 'lily', x: 34, y: 130, s: 0.82, armL: 'wave', armR: 'down', face: 'open', look: 1 }) +
    speedLines(84, 60, 26, 14, 3, 14) + sparkle(200, 50, 6) + sparkle(260, 36, 4) + sparkle(160, 70, 3)
  ),
  // Birthday: a cake with candles; Lily cheers, Ken is very happy. Confetti.
  happy: svg(
    roomG(G, 120, 14, 60, 40) +
    `<path d="M10,22 q20,14 40,0 q20,14 40,0 M210,22 q20,14 40,0 q20,14 40,0" fill="none" ${L(1.4)}/>` +
    `<path d="M20,24 l4,8 l4,-7 M60,24 l4,8 l4,-7 M220,24 l4,8 l4,-7 M260,24 l4,8 l4,-7" fill="#000" ${L(1)}/>` +
    `<path d="M118,${G - 40} H186 M124,${G - 40} V${G} M180,${G - 40} V${G}" ${L(2.4)}/>` +
    `<path d="M130,${G - 40} V${G - 62} Q152,${G - 68} 174,${G - 62} V${G - 40} Z" fill="#fff" ${L(2)}/>` +
    `<path d="M130,${G - 54} q5,5 11,0 q5,5 11,0 q5,5 11,0 q5,5 11,0" fill="none" ${L(1.4)}/>` +
    `<path d="M142,${G - 65} v-10 M152,${G - 66} v-10 M162,${G - 65} v-10" ${L(2.4)}/>` +
    `<path d="M142,${G - 78} q-3,-4 0,-7 q3,3 0,7 Z M152,${G - 79} q-3,-4 0,-7 q3,3 0,7 Z M162,${G - 78} q-3,-4 0,-7 q3,3 0,7 Z" fill="#000"/>` +
    figure({ who: 'ken', x: 82, y: G, armL: 'up', armR: 'up', face: 'laugh', look: 0.5, blush: true }) +
    figure({ who: 'lily', x: 232, y: G, armL: 'wave', armR: 'hip', face: 'laugh', look: -1 }) +
    sparkle(116, 60, 4) + sparkle(196, 70, 4) + sparkle(50, 56, 3) +
    `<path d="M104,50 l4,2 M190,52 l3,-3 M60,80 l3,3 M268,90 l-3,3" ${L(1.6)}/>`
  ),
  // After school (clock at 4:00): Ken kicks a soccer ball; Sara asks, school bag on her back.
  after: svg(
    `<rect x="150" y="30" width="146" height="${G - 30}" fill="#fff" ${L(2)}/><path d="M150,30 L223,8 L296,30" fill="#fff" ${L(2)}/>` +
    `<circle cx="223" cy="22" r="9" fill="#fff" ${L(1.8)}/><path d="M223,22 V16 M223,22 l5,3" ${L(1.4)}/>` +
    [160, 196, 232, 268].map((wx) => `<rect x="${wx}" y="44" width="22" height="18" fill="#fff" ${L(1.4)}/>` + tone(wx, 44, 22, 18, 4, 0.7)).join('') +
    [160, 268].map((wx) => `<rect x="${wx}" y="76" width="22" height="18" fill="#fff" ${L(1.4)}/>`).join('') +
    `<path d="M0,${G} H300" ${L(2)}/>` +
    figure({ who: 'ken', x: 64, y: G, armL: 'up', armR: 'wave', face: 'laugh', look: 1 }) +
    `<circle cx="104" cy="${G - 30}" r="9" fill="#fff" ${L(1.8)}/><path d="M104,${G - 34} l3.6,2.6 l-1.4,4.2 h-4.4 l-1.4,-4.2 Z" fill="#000"/>` +
    `<path d="M86,${G - 36} h-10 M86,${G - 28} h-12" ${L(1.4)}/>` +
    figure({ who: 'sara', x: 226, y: G, armL: 'down', armR: 'hip', face: 'smile', look: -1 })
  ),
  // Ken reads a book about a cat and a dog (thought bubble); Sara points at the book.
  about: svg(
    roomG(G, 220, 16, 56, 42) + shelf(10, 64, 84) +
    figure({ who: 'ken', x: 108, y: G, armL: 'hold', armR: 'hold', face: 'smile', look: 0.5 }) +
    `<path d="M108,${G - 34} Q100,${G - 40} 90,${G - 38} V${G - 56} Q100,${G - 58} 108,${G - 52} Q116,${G - 58} 126,${G - 56} V${G - 38} Q116,${G - 40} 108,${G - 34} Z" fill="#fff" ${L(1.8)}/>` +
    `<path d="M108,${G - 52} V${G - 34} M93,${G - 50} h11 M93,${G - 45} h11 M112,${G - 50} h11 M112,${G - 45} h11" ${L(1)}/>` +
    thought(150, 44, 72, 46, 120, 92, catFace(134, 48, 1) + dogFace(166, 48, 1)) +
    figure({ who: 'sara', x: 202, y: G, armL: 'point', armR: 'down', face: 'open', look: -1 })
  ),
};
