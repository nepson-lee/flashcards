// 迪士尼風格 (classic Disney-like cartoon look, animal heroes) for black-and-white flashcard scenes.
// Original characters only — this imitates the general look of classic animal cartoons, never a
// specific character (no Mickey, no Donald). Our cast:
//   - Dan, a duck: white feathers, a three-feather tuft, wide bill, striped T-shirt, webbed feet.
//   - Mia, a mouse: big round ears with white insides, pointed muzzle, whiskers, long curly tail,
//     polka-dot dress, big oval shoes.
//
// How the style is expressed in SVG line art:
// - Big round heads (about 1/2 of the body), small pear-shaped bodies: "cute" proportions.
// - Large tall oval eyes with big pupils and a white shine; expressive brows.
// - "Rubber-hose" limbs: smooth curved noodle arms and legs (thick black + white inner line),
//   white cartoon gloves with a cuff, big oval shoes.
// - Squash-and-stretch poses and cartoon emotion marks: anger puffs, tears, sparkles, Zzz,
//   motion lines.
// - Bold, clean outlines with round line caps; simple rounded backgrounds (lollipop trees,
//   rolling hills, round-top windows with curtains). Strictly #000 / #fff for printing.
// All helpers return SVG fragment strings for the 300x200 scene viewBox.

const L = (w = 2.2) => `stroke="#000" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const hose = (d, w = 7) =>
  `<path d="${d}" fill="none" stroke="#000" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="#fff" stroke-width="${w - 3.4}" stroke-linecap="round" stroke-linejoin="round"/>`;

// ---------- characters ----------
// Figure coordinates: feet on the ground at (0,0), head centre at (0,-72), shoulders at (±14,-50).
// Arm poses: [control point, hand] relative to the shoulder side sx (-1 viewer-left, +1 viewer-right).
const ARMS = {
  down: (sx) => [[sx * 24, -42], [sx * 22, -26]],
  wave: (sx) => [[sx * 32, -50], [sx * 30, -76]],
  up: (sx) => [[sx * 28, -58], [sx * 22, -84]],
  point: (sx) => [[sx * 28, -50], [sx * 42, -56]],
  forward: (sx) => [[sx * 28, -42], [sx * 40, -44]],
  hold: (sx) => [[sx * 26, -38], [sx * 9, -40]],
  hip: (sx) => [[sx * 30, -46], [sx * 18, -32]],
  shh: (sx) => [[sx * 26, -42], [sx * 6, -58]],
  eye: (sx) => [[sx * 26, -46], [sx * 12, -74]],
  fist: (sx) => [[sx * 30, -44], [sx * 26, -64]],
};
const armPts = (pose, sx) => (Array.isArray(pose) ? pose.map(([x, y]) => [sx * x, y]) : ARMS[pose](sx));

// Where a hand ends up in scene coordinates, so objects can be placed in it.
function hand(o, side) {
  const s = o.s || 1;
  const sx = side === 'l' ? -1 : 1;
  const [, [hx, hy]] = armPts(side === 'l' ? o.armL || 'down' : o.armR || 'down', sx);
  return [o.x + hx * s, o.y + hy * s];
}

function glove(x, y, finger = 0) {
  // finger: 0 = round fist, otherwise direction of a raised index finger (-1 up-left, 1 up-right, 'up')
  let f = '';
  if (finger === 'up') f = `<path d="M${x - 2},${y - 3} v-9 q2,-3 4,0 v9" fill="#fff" ${L(1.8)}/>`;
  return f + `<circle cx="${x}" cy="${y}" r="6" fill="#fff" ${L(2)}/>` +
    `<path d="M${x - 2.5},${y + 1} q2.5,2 5,0" fill="none" ${L(1.1)}/>`;
}

function eyes({ look = 0, face = 'happy', y = -78, gap = 8, rx = 5, ry = 8 }) {
  const ex = look * 2.4;
  const p = [];
  if (face === 'closed' || face === 'shh') {
    p.push(`<path d="M${-gap - 5 + ex},${y + 1} q5,4 10,0 M${gap - 5 + ex},${y + 1} q5,4 10,0" fill="none" ${L(2)}/>`);
  } else {
    for (const sx of [-1, 1]) {
      const cx = sx * gap + ex;
      p.push(`<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" ${L(1.8)}/>`);
      const py = face === 'sad' ? y + 2 : y + 1;
      p.push(`<ellipse cx="${cx + look * 1.8}" cy="${py}" rx="${rx * 0.55}" ry="${ry * 0.55}" fill="#000"/>`);
      p.push(`<circle cx="${cx + look * 1.8 - 1}" cy="${py - 2}" r="1.1" fill="#fff"/>`);
    }
  }
  // brows
  const by = y - ry - 4;
  if (face === 'angry')
    p.push(`<path d="M${-gap - 6 + ex},${by - 3} L${-2 + ex},${by + 3} M${gap + 6 + ex},${by - 3} L${2 + ex},${by + 3}" ${L(2.8)}/>`);
  else if (face === 'sad')
    p.push(`<path d="M${-gap - 6 + ex},${by + 2} L${-3 + ex},${by - 3} M${gap + 6 + ex},${by + 2} L${3 + ex},${by - 3}" ${L(2.2)}/>`);
  else
    p.push(`<path d="M${-gap - 4 + ex},${by} q4,-3 8,0 M${gap - 4 + ex},${by} q4,-3 8,0" fill="none" ${L(1.6)}/>`);
  return p.join('');
}

function duckHead({ look = 0, face = 'happy' }) {
  const bx = look * 5;
  const p = [];
  // tuft
  p.push(`<path d="M-2,-93 q-6,-10 -12,-8 q6,1 6,9 M0,-94 q0,-12 6,-14 q-3,5 -1,13 M2,-93 q8,-8 13,-4 q-6,0 -9,6" fill="#fff" ${L(1.8)}/>`);
  p.push(`<circle cx="0" cy="-72" r="22" fill="#fff" ${L(2.4)}/>`);
  p.push(eyes({ look, face, y: -80, gap: 7.5, rx: 5.5, ry: 8.5 }));
  // bill
  const open = face === 'open' || face === 'angry' || face === 'sad';
  if (open) {
    const lowY = face === 'sad' ? -55 : -52;
    p.push(`<path d="M${bx - 12},${-62} Q${bx},${lowY - 2} ${bx + 12},${-62} Q${bx + 10},${lowY + 8} ${bx},${lowY + 8} Q${bx - 10},${lowY + 8} ${bx - 12},${-62} Z" fill="#000"/>`);
    p.push(`<path d="M${bx - 11},${-60} Q${bx},${lowY + 9} ${bx + 11},${-60} Q${bx},${lowY + 14} ${bx - 11},${-60} Z" fill="#fff" ${L(2)}/>`);
    if (face !== 'sad') p.push(`<path d="M${bx - 4},${lowY + 4} q4,-3 8,0" fill="#fff" ${L(1.2)}/>`);
  } else {
    p.push(`<path d="M${bx - 11},${-60} Q${bx},${-50} ${bx + 11},${-60} Q${bx},${-46} ${bx - 11},${-60} Z" fill="#fff" ${L(2)}/>`);
  }
  p.push(`<path d="M${bx - 16},${-63} Q${bx - 16},${-72} ${bx},${-71} Q${bx + 16},${-72} ${bx + 16},${-63} Q${bx},${-56} ${bx - 16},${-63} Z" fill="#fff" ${L(2.2)}/>`);
  p.push(`<path d="M${bx - 4},${-67} q1,-1 2,0 M${bx + 2},${-67} q1,-1 2,0" fill="none" ${L(1.4)}/>`);
  if (face === 'shh') p.push(`<path d="M${bx - 10},${-61} Q${bx},${-58} ${bx + 10},${-61}" fill="none" ${L(1.4)}/>`);
  return p.join('');
}

function mouseHead({ look = 0, face = 'happy' }) {
  const mx = look * 4;
  const p = [];
  // ears
  for (const sx of [-1, 1]) {
    p.push(`<circle cx="${sx * 21}" cy="-92" r="14" fill="#000"/><circle cx="${sx * 21}" cy="-91" r="8.5" fill="#fff"/>`);
  }
  p.push(`<circle cx="0" cy="-72" r="21" fill="#fff" ${L(2.4)}/>`);
  // hair tuft
  p.push(`<path d="M-5,-92 q4,-6 3,-1 q4,-6 3,0 q4,-5 3,1" fill="none" ${L(1.6)}/>`);
  p.push(eyes({ look, face, y: -78, gap: 7, rx: 4.6, ry: 7.5 }));
  // muzzle + nose + whiskers
  p.push(`<ellipse cx="${mx}" cy="-61" rx="12" ry="8" fill="#fff" ${L(1.8)}/>`);
  p.push(`<ellipse cx="${mx + look * 2}" cy="-66" rx="4.5" ry="3.2" fill="#000"/><circle cx="${mx + look * 2 - 1.5}" cy="-67" r="1" fill="#fff"/>`);
  p.push(`<path d="M${mx - 12},-63 l-10,-3 M${mx - 12},-60 l-11,1 M${mx + 12},-63 l10,-3 M${mx + 12},-60 l11,1" ${L(1)}/>`);
  // mouth
  const m = {
    happy: `<path d="M${mx - 5},-60 Q${mx},-55 ${mx + 5},-60" fill="none" ${L(1.6)}/>`,
    open: `<path d="M${mx - 5},-60 Q${mx},-50 ${mx + 5},-60 Z" fill="#000"/>`,
    sad: `<path d="M${mx - 5},-56 Q${mx},-61 ${mx + 5},-56" fill="none" ${L(1.6)}/>`,
    angry: `<path d="M${mx - 5},-59 h10 v4 h-10 Z" fill="#fff" ${L(1.4)}/>`,
    closed: `<path d="M${mx - 4},-60 Q${mx},-56 ${mx + 4},-60" fill="none" ${L(1.6)}/>`,
    shh: `<circle cx="${mx}" cy="-58" r="2" fill="#000"/>`,
  }[face];
  p.push(m);
  return p.join('');
}

// A character. (x, y) = point between the feet on the ground. s = scale (~1).
// kind: 'duck' | 'mouse'; face: 'happy' | 'open' | 'sad' | 'angry' | 'closed' | 'shh';
// armL / armR: a pose name from ARMS or [[ctrlX, ctrlY], [handX, handY]] for the right side;
// look: -1..1 turns eyes and bill/muzzle; finger: 'l' | 'r' raises an index finger on that glove;
// jump: lifts the feet off the ground (stomp / hop).
function animal(o) {
  const { x, y, s = 1, kind = 'duck', armL = 'down', armR = 'down', finger = null, legs = 'stand' } = o;
  const p = [];
  // tail (behind)
  if (kind === 'mouse') p.push(`<path d="M10,-24 Q34,-16 36,-34 Q38,-50 26,-48" fill="none" ${L(2.4)}/>`);
  else p.push(`<path d="M14,-28 Q26,-30 30,-40 Q30,-28 24,-24 Q30,-22 28,-18 Q20,-18 14,-22 Z" fill="#fff" ${L(2)}/>`);
  // legs
  const legD = legs === 'stomp'
    ? [`M-7,-24 Q-14,-16 -14,-10`, `M7,-24 Q9,-12 10,-4`]
    : [`M-7,-24 Q-10,-14 -9,-4`, `M7,-24 Q10,-14 9,-4`];
  const feet = legs === 'stomp' ? [[-16, -9], [11, -1]] : [[-10, -1], [10, -1]];
  legD.forEach((d) => p.push(hose(d, 6.5)));
  feet.forEach(([fx, fy], i) => {
    const sx = i === 0 ? -1 : 1;
    if (o.shoes) // sneakers with laces
      p.push(`<path d="M${fx - sx * 6},${fy + 3} Q${fx - sx * 8},${fy - 8} ${fx + sx * 2},${fy - 9} Q${fx + sx * 8},${fy - 4} ${fx + sx * 16},${fy - 2} Q${fx + sx * 20},${fy + 1} ${fx + sx * 18},${fy + 3} Z" fill="#fff" ${L(2)}/>` +
        `<path d="M${fx - sx * 6},${fy + 1} H${fx + sx * 18} M${fx + sx * 1},${fy - 6} l${sx * 3},3 M${fx + sx * 5},${fy - 6} l${sx * 3},3" fill="none" ${L(1.4)}/>`);
    else if (kind === 'duck')
      p.push(`<path d="M${fx},${fy - 4} L${fx + sx * 16},${fy - 1} Q${fx + sx * 17},${fy + 3} ${fx + sx * 12},${fy + 2} Q${fx + sx * 8},${fy + 5} ${fx + sx * 4},${fy + 2} Q${fx},${fy + 4} ${fx - sx * 4},${fy + 1} Z" fill="#fff" ${L(2)}/>`);
    else
      p.push(`<ellipse cx="${fx + sx * 5}" cy="${fy}" rx="11" ry="6" fill="#000"/><ellipse cx="${fx + sx * 7}" cy="${fy - 2}" rx="3.5" ry="1.6" fill="#fff"/>`);
  });
  // body + clothes
  if (kind === 'duck') {
    p.push(`<ellipse cx="0" cy="-38" rx="18" ry="17" fill="#fff" ${L(2.4)}/>`);
    // striped T-shirt covering the upper body
    p.push(`<path d="M-15,-48 Q0,-54 15,-48 Q18,-38 17,-30 Q0,-26 -17,-30 Q-18,-38 -15,-48 Z" fill="#fff" ${L(2)}/>`);
    for (const yy of [-44, -38, -32.5]) {
      const hw = yy === -44 ? 15 : 17;
      p.push(`<path d="M${-hw},${yy} Q0,${yy + 3} ${hw},${yy}" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round"/>`);
    }
  } else {
    p.push(`<ellipse cx="0" cy="-40" rx="13" ry="14" fill="#fff" ${L(2.2)}/>`);
    p.push(`<path d="M-11,-50 Q0,-55 11,-50 L22,-22 Q0,-15 -22,-22 Z" fill="#fff" ${L(2.2)}/>`);
    p.push(`<path d="M-22,-22 Q-11,-17 0,-19 Q11,-17 22,-22" fill="none" ${L(1.2)}/>`);
    for (const [dx, dy] of [[-8, -40], [6, -44], [-12, -28], [2, -32], [13, -27], [-2, -24]])
      p.push(`<circle cx="${dx}" cy="${dy}" r="2.2" fill="#000"/>`);
  }
  // arms + gloves
  const gl = [];
  for (const sx of [-1, 1]) {
    const [[cx, cy], [hx, hy]] = armPts(sx < 0 ? armL : armR, sx);
    p.push(hose(`M${sx * 13},-49 Q${cx},${cy} ${hx},${hy}`, 6.5));
    gl.push(glove(hx, hy, finger === (sx < 0 ? 'l' : 'r') ? 'up' : 0));
  }
  // head
  p.push(kind === 'duck' ? duckHead(o) : mouseHead(o));
  p.push(...gl);
  return `<g transform="translate(${x},${y}) scale(${s})">${p.join('')}</g>`;
}

// ---------- emotion marks ----------
const tearsG = (x, y, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,0 q-4,7 0,9 q4,-2 0,-9 Z" fill="#fff" ${L(1.5)}/>` +
  `<path d="M8,10 q-4,7 0,9 q4,-2 0,-9 Z" fill="#fff" ${L(1.5)}/></g>`;
const puffG = (x, y, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M-6,0 q-4,-6 1,-9 q1,-6 7,-4 q5,-4 8,2 q6,1 3,7 q2,6 -5,6 q-4,4 -8,0 q-7,1 -6,-2 Z" fill="#fff" ${L(1.8)}/></g>`;
const angerG = (x, y, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M-6,-2 q4,0 4,-4 M2,-6 q0,4 4,4 M6,2 q-4,0 -4,4 M-2,6 q0,-4 -4,-4" fill="none" ${L(2.4)}/></g>`;
const sparkG = (x, y, r = 6) =>
  `<path d="M${x},${y - r} Q${x + r * 0.2},${y - r * 0.2} ${x + r},${y} Q${x + r * 0.2},${y + r * 0.2} ${x},${y + r} Q${x - r * 0.2},${y + r * 0.2} ${x - r},${y} Q${x - r * 0.2},${y - r * 0.2} ${x},${y - r} Z" fill="#000"/>`;
const zzzG = (x, y) =>
  `<path d="M${x},${y} h7 l-7,8 h7 M${x + 10},${y - 12} h9 l-9,10 h9 M${x + 22},${y - 27} h11 l-11,12 h11" fill="none" ${L(1.8)}/>`;
const noteG = (x, y) => `<path d="M${x},${y} v-14 l8,3" fill="none" ${L(1.8)}/><ellipse cx="${x - 2.5}" cy="${y}" rx="3.5" ry="2.5" fill="#000"/>`;
const motionG = (x, y, dir = 1) =>
  `<path d="M${x},${y} h${dir * 12} M${x + dir * 3},${y + 7} h${dir * 10} M${x},${y + 14} h${dir * 12}" ${L(1.6)}/>`;

// ---------- backgrounds ----------
const groundG = (y) => `<path d="M0,${y} H300" ${L(2.2)}/>`;
const hillsG = (y) =>
  `<path d="M0,${y - 22} Q50,${y - 52} 110,${y - 26} Q170,${y - 50} 230,${y - 28} Q270,${y - 44} 300,${y - 30}" fill="none" ${L(1.6)}/>`;
const lollipopTreeG = (x, y, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M-4,0 Q-3,-20 -4,-34 H4 Q3,-20 4,0 Z" fill="#fff" ${L(2)}/>` +
  `<path d="M0,-30 q-24,4 -22,-18 q-6,-20 14,-24 q8,-14 22,-4 q18,0 14,18 q8,18 -12,24 q-8,8 -16,4 Z" fill="#fff" ${L(2.2)}/>` +
  `<path d="M-10,-50 q4,-4 8,-2 M6,-40 q4,-3 8,0 M2,-62 q4,-3 7,0" fill="none" ${L(1.3)}/></g>`;
const puffyCloudG = (x, y, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M-26,8 q-10,0 -8,-9 q2,-8 11,-6 q2,-12 16,-11 q10,-10 22,0 q14,-2 14,10 q10,2 7,11 q-2,6 -9,5 Z" fill="#fff" ${L(1.8)}/></g>`;
const sunG = (x, y, r = 14) => {
  let rays = '';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    rays += `M${(x + Math.cos(a) * (r + 4)).toFixed(1)},${(y + Math.sin(a) * (r + 4)).toFixed(1)} L${(x + Math.cos(a) * (r + 10)).toFixed(1)},${(y + Math.sin(a) * (r + 10)).toFixed(1)} `;
  }
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${L(2)}/><path d="${rays}" ${L(2)}/>` +
    `<circle cx="${x - 5}" cy="${y - 2}" r="1.6" fill="#000"/><circle cx="${x + 5}" cy="${y - 2}" r="1.6" fill="#000"/>` +
    `<path d="M${x - 5},${y + 4} q5,4 10,0" fill="none" ${L(1.5)}/>`;
};
// A room: floor line, a skirting board and a round-top window with curtains.
const roomG = (floorY, wx = 40, wy = 22, ww = 64, wh = 56, inside = '') =>
  `<path d="M0,${floorY} H300 M0,${floorY - 8} H300" ${L(1.6)}/>` +
  `<path d="M${wx},${wy + wh} V${wy + ww / 2} A${ww / 2},${ww / 2} 0 0 1 ${wx + ww},${wy + ww / 2} V${wy + wh} Z" fill="#fff" ${L(2.2)}/>` + inside +
  `<path d="M${wx + ww / 2},${wy} V${wy + wh} M${wx},${wy + wh * 0.62} H${wx + ww}" ${L(1.6)}/>` +
  `<path d="M${wx - 8},${wy + 4} Q${wx + 6},${wy + wh / 2} ${wx - 4},${wy + wh + 6} L${wx - 14},${wy + wh + 6} Q${wx - 12},${wy + wh / 2} ${wx - 14},${wy + 4} Z" fill="#fff" ${L(1.8)}/>` +
  `<path d="M${wx + ww + 8},${wy + 4} Q${wx + ww - 6},${wy + wh / 2} ${wx + ww + 4},${wy + wh + 6} L${wx + ww + 14},${wy + wh + 6} Q${wx + ww + 12},${wy + wh / 2} ${wx + ww + 14},${wy + 4} Z" fill="#fff" ${L(1.8)}/>` +
  `<path d="M${wx - 16},${wy + 2} H${wx + ww + 16}" ${L(2.6)}/>`;

module.exports = {
  L, hose, animal, hand, glove, ARMS,
  tearsG, puffG, angerG, sparkG, zzzG, noteG, motionG,
  groundG, hillsG, lollipopTreeG, puffyCloudG, sunG, roomG,
};
