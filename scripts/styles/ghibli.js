// 宮崎駿畫風 (Miyazaki / Studio Ghibli-like look) for black-and-white flashcard scenes.
// Original characters only — this imitates the general look, never a specific character.
//
// How the style is expressed in SVG line art:
// - Characters: realistic proportions (kids ~4 heads tall, adults ~6), round soft faces,
//   large oval eyes with a white highlight, tiny nose, small mouth, hatched blush lines,
//   hair drawn as locks and fringes (black for dark hair, white with strand lines for light hair).
// - Limbs are drawn as outlined tubes (thick black line + thinner white line on top) so they
//   read like hand-inked arms and legs instead of stick lines.
// - Backgrounds: big billowing cumulus clouds, leafy trees made of scalloped clusters,
//   wind-blown grass, wooden walls with plank lines, steam curls; short hatching for shade.
// - Strictly #000 / #fff so cards print well.
// All helpers return SVG fragment strings for the 300x200 scene viewBox.

const L = (w = 2.2) => `stroke="#000" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const pts = (a) => a.map((p) => p.join(',')).join(' ');
const tube = (a, w = 8) =>
  `<polyline points="${pts(a)}" fill="none" stroke="#000" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<polyline points="${pts(a)}" fill="none" stroke="#fff" stroke-width="${w - 3.6}" stroke-linecap="round" stroke-linejoin="round"/>`;

// ---------- characters ----------
// Arm poses in figure coordinates (feet at 0,0; shoulders at y=-80). sx = -1 left, +1 right (viewer's side).
const ARMS = {
  down: (sx) => [[sx * 13, -80], [sx * 18, -62], [sx * 20, -45]],
  hold: (sx) => [[sx * 13, -80], [sx * 18, -64], [sx * 7, -60]],
  chest: (sx) => [[sx * 13, -80], [sx * 20, -64], [sx * 8, -72]],
  mouth: (sx) => [[sx * 13, -80], [sx * 20, -70], [sx * 6, -88]],
  point: (sx) => [[sx * 13, -80], [sx * 28, -78], [sx * 44, -82]],
  forward: (sx) => [[sx * 13, -80], [sx * 26, -70], [sx * 38, -66]],
  pointUp: (sx) => [[sx * 13, -80], [sx * 26, -94], [sx * 34, -112]],
  up: (sx) => [[sx * 13, -80], [sx * 17, -100], [sx * 15, -120]],
  wave: (sx) => [[sx * 13, -80], [sx * 28, -74], [sx * 32, -98]],
  hip: (sx) => [[sx * 13, -80], [sx * 25, -66], [sx * 12, -54]],
};
const LEGS = {
  stand: (sx) => [[sx * 6, -52], [sx * 7, -26], [sx * 8, -4]],
  climb: (sx) => (sx < 0 ? [[-6, -52], [-22, -40], [-18, -18]] : [[6, -52], [14, -30], [9, -10]]),
};
const armPts = (pose, sx) => (Array.isArray(pose) ? pose : ARMS[pose](sx));

// Where a hand ends up in scene coordinates, so objects can be placed in it.
function hand(o, side) {
  const s = o.s || 1, f = o.flip ? -1 : 1;
  const sx = side === 'l' ? -1 : 1;
  const p = armPts(side === 'l' ? o.armL || 'down' : o.armR || 'down', sx);
  const [hx, hy] = p[p.length - 1];
  return [o.x + hx * s * f, o.y + hy * s];
}

// Hair that sits behind the head and body, in head-local coordinates.
function hairBack({ hair, wind = 0 }) {
  const p = [];
  if (hair === 'bob' || hair === 'pigtails')
    p.push(`<path d="M-17,-6 C-21,-24 21,-24 17,-6 L18,12 Q13,16 10,10 L-10,10 Q-13,16 -18,12 Z" fill="#000"/>`);
  if (hair === 'pigtails')
    p.push(`<path d="M-15,-4 Q-30,0 -27,20 Q-22,10 -15,6 Z M15,-4 Q30,0 27,20 Q22,10 15,6 Z" fill="#000"/>`,
      `<circle cx="-17" cy="-2" r="3" fill="#fff" ${L(1.6)}/><circle cx="17" cy="-2" r="3" fill="#fff" ${L(1.6)}/>`);
  if (hair === 'long') {
    const w = wind;
    p.push(`<path d="M-17,-6 C-21,-26 21,-26 17,-6 C19,16 ${21 + w},40 ${26 + w * 2},58 Q${14 + w},56 ${8 + w},50 L-8,50 Q-14,56 -24,58 C-20,40 -20,16 -17,-6 Z" fill="#fff" ${L(2)}/>`,
      `<path d="M-17,14 C-18,30 -19,42 -21,54 M17,12 C18,28 ${20 + w},42 ${23 + w * 2},54" fill="none" ${L(1.2)}/>`);
  }
  if (hair === 'bun') p.push(`<circle cx="0" cy="-21" r="8" fill="#000"/>`);
  return p.join('');
}

// Head, drawn in head-local coordinates (centre 0,0; radius ~15).
function head({ hair, mouth = 'smile', look = 0, closedEyes = false, glasses = false }) {
  const p = [];
  // ears + face
  p.push(`<circle cx="-15" cy="2" r="3.6" fill="#fff" ${L(1.8)}/><circle cx="15" cy="2" r="3.6" fill="#fff" ${L(1.8)}/>`);
  p.push(`<path d="M-15,-2 C-15,-14 -8,-18 0,-18 C8,-18 15,-14 15,-2 C15,9 8,16 0,16 C-8,16 -15,9 -15,-2 Z" fill="#fff" ${L(2.2)}/>`);
  // front hair
  const front = {
    boy: 'M-16,0 C-18,-16 -6,-21 1,-20 C11,-20 18,-13 16,0 L14,-6 L11,-3 L9,-9 L5,-5 L2,-11 L-2,-5 L-6,-10 L-9,-4 L-13,-7 Z M-1,-19 Q-4,-27 -9,-26 Q-3,-23 -4,-19 Z',
    bob: 'M-16,-1 C-17,-16 -6,-21 1,-20 C10,-20 17,-14 16,-1 Q12,-8 10,-11 Q6,-7 1,-10 Q-3,-6 -8,-9 Q-11,-5 -16,-1 Z',
    pigtails: 'M-16,-1 C-17,-16 -6,-21 1,-20 C10,-20 17,-14 16,-1 Q12,-8 10,-11 Q6,-7 1,-10 Q-3,-6 -8,-9 Q-11,-5 -16,-1 Z',
    bun: 'M-16,1 C-18,-16 -6,-20 1,-20 C10,-20 18,-14 16,1 Q12,-10 -1,-12 Q-10,-10 -16,1 Z',
    man: 'M-16,-2 C-17,-17 -6,-20 1,-20 C11,-20 17,-15 16,-2 Q14,-10 8,-12 Q-2,-11 -6,-14 Q-10,-8 -16,-2 Z',
  }[hair];
  if (front) p.push(`<path d="${front}" fill="#000"/><path d="M-9,-15 Q0,-18 9,-15" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>`);
  if (hair === 'long')
    p.push(`<path d="M-16,0 C-17,-16 -6,-21 1,-20 C10,-20 17,-14 16,0 Q12,-8 9,-11 Q5,-6 0,-10 Q-4,-5 -8,-9 Q-12,-4 -16,0 Z" fill="#fff" ${L(2)}/>`,
      `<path d="M-10,-15 Q-6,-12 -6,-8 M-2,-18 Q0,-14 0,-10 M6,-17 Q8,-13 8,-10" fill="none" ${L(1.1)}/>`);
  // face
  const ex = look * 1.4;
  if (closedEyes) p.push(`<path d="M-8,1 q2.5,2.5 5,0 M3,1 q2.5,2.5 5,0" fill="none" ${L(1.6)}/>`);
  else p.push(`<ellipse cx="${-5.5 + ex}" cy="1" rx="2.3" ry="3.3" fill="#000"/><ellipse cx="${5.5 + ex}" cy="1" rx="2.3" ry="3.3" fill="#000"/>` +
    `<circle cx="${-6.2 + ex}" cy="-0.3" r="0.9" fill="#fff"/><circle cx="${4.8 + ex}" cy="-0.3" r="0.9" fill="#fff"/>`);
  if (hair !== 'man') p.push(`<path d="M-8,-5 q2.5,-1.5 5,0 M3,-5 q2.5,-1.5 5,0" fill="none" ${L(1.3)}/>`);
  else p.push(`<path d="M-9,-5 h6 M3,-5 h6" ${L(2)}/>`);
  if (glasses) p.push(`<circle cx="-5.5" cy="1" r="4.8" fill="none" ${L(1.4)}/><circle cx="5.5" cy="1" r="4.8" fill="none" ${L(1.4)}/><path d="M-0.7,0 h1.4" ${L(1.4)}/>`);
  p.push(`<path d="M0.6,4.5 l-1,2.4" fill="none" ${L(1.1)}/>`);
  if (mouth === 'open') p.push(`<path d="M-3.5,9 Q0,15.5 3.5,9 Z" fill="#000"/>`);
  else if (mouth === 'eat') p.push(`<ellipse cx="0" cy="10" rx="2.2" ry="1.8" fill="#000"/>`);
  else p.push(`<path d="M-3,9.5 Q0,12 3,9.5" fill="none" ${L(1.5)}/>`);
  if (hair !== 'man') p.push(`<path d="M-12,7 l2,-2.4 M-9.6,7.6 l2,-2.4 M7.6,7.6 l2,-2.4 M10,7 l2,-2.4" ${L(0.9)}/>`);
  return p.join('');
}

// A character. (x, y) = point between the feet on the ground. s = scale (kids ~0.9-1.1, adults ~1.2-1.35).
// body: 'boy' | 'girl' | 'man' | 'woman'; hair: 'boy' | 'bob' | 'pigtails' | 'long' | 'bun' | 'man'.
// armL / armR: a pose name from ARMS or an array of points; legs: 'stand' | 'climb'.
function figure(o) {
  const { x, y, s = 1, body = 'boy', hair = body, armL = 'down', armR = 'down', legs = 'stand', flip = false } = o;
  const adult = body === 'man' || body === 'woman';
  const hs = adult ? 0.8 : 1;
  const headY = -86 - 15 * hs;
  const p = [`<g transform="translate(0,${headY}) scale(${hs})">${hairBack({ ...o, hair })}</g>`];
  // legs + shoes
  for (const sx of [-1, 1]) {
    const lp = LEGS[legs](sx);
    if (body === 'man') p.push(`<polyline points="${pts(lp)}" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`);
    else p.push(tube(lp, 8));
    const [fx, fy] = lp[lp.length - 1];
    p.push(`<ellipse cx="${fx + sx * 3}" cy="${fy + 1}" rx="7" ry="4" fill="#000"/>`);
  }
  // clothes
  if (body === 'boy') p.push(
    `<path d="M-14,-84 Q0,-80 14,-84 L15,-66 L13,-50 L-13,-50 L-15,-66 Z" fill="#fff" ${L()}/>`,
    `<path d="M-5,-83 L0,-77 L5,-83 M-7,-64 q2,5 0,10 M8,-70 q-2,4 0,8" fill="none" ${L(1.3)}/>`,
    `<path d="M-13,-53 H13 L14,-36 H3 L0,-44 L-3,-36 H-14 Z" fill="#000"/>`);
  if (body === 'girl') p.push(
    `<path d="M-12,-84 Q0,-80 12,-84 L14,-60 L23,-28 Q0,-23 -23,-28 L-14,-60 Z" fill="#fff" ${L()}/>`,
    `<path d="M-14,-60 Q0,-57 14,-60 M-6,-58 L-10,-28 M6,-58 L10,-28 M-6,-83 Q0,-76 6,-83" fill="none" ${L(1.3)}/>`,
    `<path d="M-21,-30 l3,-5 M-15,-28 l3,-5 M15,-28 l3,-5" ${L(1)}/>`);
  if (body === 'woman') p.push(
    `<path d="M-13,-84 Q0,-80 13,-84 L14,-60 L20,-8 Q0,-4 -20,-8 L-14,-60 Z" fill="#000"/>`,
    `<path d="M-13,-84 Q0,-80 13,-84 L14,-60 L-14,-60 Z" fill="#fff" ${L()}/>`,
    `<path d="M-11,-64 H11 L15,-14 Q0,-11 -15,-14 Z" fill="#fff" ${L(1.8)}/>`,
    `<path d="M-6,-40 h12 v8 h-12 Z M-11,-62 L-16,-56 M11,-62 L16,-56" fill="none" ${L(1.3)}/>`,
    `<path d="M-5,-83 Q0,-77 5,-83" fill="none" ${L(1.3)}/>`);
  if (body === 'man') p.push(
    `<path d="M-14,-84 Q0,-80 14,-84 L15,-54 L-15,-54 Z" fill="#fff" ${L()}/>`,
    `<path d="M-6,-84 L0,-76 L6,-84 M0,-76 V-55 M-15,-56 H15" fill="none" ${L(1.4)}/>`,
    `<circle cx="0" cy="-70" r="1" fill="#000"/><circle cx="0" cy="-63" r="1" fill="#000"/>`);
  // arms + hands
  for (const sx of [-1, 1]) {
    const ap = armPts(sx < 0 ? armL : armR, sx);
    p.push(tube(ap, 7.5));
    const [hx, hy] = ap[ap.length - 1];
    p.push(`<circle cx="${hx}" cy="${hy}" r="3.8" fill="#fff" ${L(1.8)}/>`);
  }
  // neck + head
  p.push(`<path d="M-4,-90 V-82 M4,-90 V-82" ${L(1.8)}/>`);
  p.push(`<g transform="translate(0,${headY}) scale(${hs})">${head({ ...o, hair })}</g>`);
  return `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})">${p.join('')}</g>`;
}

// ---------- backgrounds ----------
// Billowing cumulus cloud centred at (x, y).
function cloudG(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">` +
    `<path d="M-52,12 C-64,12 -64,-4 -51,-5 C-54,-20 -35,-27 -27,-16 C-24,-36 4,-40 9,-21 C15,-33 40,-30 37,-12 C52,-14 58,6 45,12 Z" fill="#fff" ${L(2)}/>` +
    `<path d="M-40,8 l5,-4 M-30,9 l5,-4 M-20,9 l5,-4 M24,9 l5,-4 M34,9 l5,-4 M-8,-18 q6,-6 14,-2 M20,-14 q5,-3 10,0" fill="none" ${L(1)}/></g>`;
}
// Scalloped leafy cluster centred at (cx, cy) with radius r, hatched shade underneath.
function leaves(cx, cy, r, n = 9) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r * 0.82;
    if (i === 0) d += `M${px.toFixed(1)},${py.toFixed(1)}`;
    else {
      const m = ((i - 0.5) / n) * Math.PI * 2;
      d += ` Q${(cx + Math.cos(m) * r * 1.28).toFixed(1)},${(cy + Math.sin(m) * r * 1.05).toFixed(1)} ${px.toFixed(1)},${py.toFixed(1)}`;
    }
  }
  let h = '';
  for (let k = -2; k <= 2; k++) h += `M${cx + k * r * 0.3},${cy + r * 0.55} l${r * 0.12},${-r * 0.16} `;
  return `<path d="${d} Z" fill="#fff" ${L(2)}/><path d="${h}" ${L(1)}/>`;
}
// Big leafy tree standing on ground y at x. Returns the canopy over a trunk.
function treeG(x, y, s = 1, branchRight = false) {
  return `<g transform="translate(${x},${y}) scale(${s})">` +
    `<path d="M-12,0 C-8,-30 -10,-60 -6,-96 L6,-96 C8,-60 8,-30 14,0 Z" fill="#fff" ${L(2.4)}/>` +
    `<path d="M-4,-20 q3,-8 0,-16 M3,-50 q-3,-8 0,-16 M-2,-76 q2,-5 0,-10" fill="none" ${L(1.2)}/>` +
    (branchRight ? `<path d="M4,-80 C24,-86 44,-88 64,-92 L64,-84 C44,-80 24,-78 6,-72 Z" fill="#fff" ${L(2)}/>` : '') +
    leaves(-30, -118, 26) + leaves(26, -122, 28) + leaves(-4, -140, 28) + leaves(56, -100, 18) + leaves(-52, -96, 16) +
    `</g>`;
}
// Wind-blown grass tufts along ground y.
const grassG = (xs, y) => xs.map((x) => `<path d="M${x},${y} q1,-8 6,-13 M${x + 3},${y} q2,-10 9,-14 M${x - 3},${y} q0,-6 3,-10" fill="none" ${L(1.4)}/>`).join('');
// Ground line with little hatch marks.
const groundG = (y = 186) => `<path d="M6,${y} H294" ${L(2.4)}/>` +
  [20, 64, 110, 170, 230, 276].map((x) => `<path d="M${x},${y + 5} l8,0 M${x + 12},${y + 9} l6,0" ${L(1)}/>`).join('');
// Wooden room: planked wall down to the floor at y, with a floor line.
function room(y = 186) {
  let s = '';
  for (let x = 30; x < 300; x += 42) s += `<path d="M${x},6 V${y - 30}" ${L(1)}/>`;
  return s + `<path d="M6,${y - 30} H294" ${L(1.8)}/><path d="M6,${y} H294" ${L(2.4)}/>` +
    `<path d="M6,${y - 30} V${y} M294,${y - 30} V${y}" ${L(0.1)}/>`;
}
// Wooden window with four panes; inner = scene drawn behind the glass.
function windowG(x, y, w, h, inner = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff"/>` + inner +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" ${L(4)}/>` +
    `<path d="M${x + w / 2},${y} V${y + h} M${x},${y + h / 2} H${x + w}" ${L(2.4)}/>` +
    `<path d="M${x - 6},${y + h + 4} H${x + w + 6}" ${L(4)}/>`;
}
// Steam curls rising from (x, y).
const steamG = (x, y) => `<path d="M${x - 8},${y} q-6,-8 0,-15 q6,-7 0,-15 M${x + 7},${y - 2} q-6,-8 0,-15 q6,-7 0,-15" fill="none" ${L(1.6)}/>`;
// Table with a long cloth that hides the legs of people behind it; top at y, from x, width w.
function clothTableG(x, y, w, floor = 186) {
  let hem = '';
  for (let k = x + 6; k < x + w - 6; k += 12) hem += `M${k},${floor - 8} l4,0 `;
  return `<path d="M${x},${y} H${x + w} L${x + w + 5},${floor + 5} H${x - 5} Z" fill="#fff" ${L(2.2)}/>` +
    `<path d="M${x + 4},${y + 8} H${x + w - 4} ${hem} M${x + w * 0.3},${y + 10} q-2,${(floor - y) * 0.5} -4,${floor - y - 14} M${x + w * 0.7},${y + 10} q2,${(floor - y) * 0.5} 4,${floor - y - 14}" fill="none" ${L(1)}/>`;
}

// ---------- food and dishes ----------
function plateG(x, y, rx = 30) {
  return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.3}" fill="#fff" ${L(2)}/><ellipse cx="${x}" cy="${y - 1}" rx="${rx * 0.65}" ry="${rx * 0.18}" fill="none" ${L(1.1)}/>`;
}
// Rice bowl (heaped rice) with its rim at y.
function riceBowlG(x, y, w = 40, heaped = true) {
  const r = w / 2;
  let grains = '';
  if (heaped) for (const [a, b] of [[-8, -6], [-2, -10], [5, -7], [10, -3], [-12, -2], [0, -4]]) grains += `<ellipse cx="${x + a}" cy="${y + b}" rx="1.8" ry="1" fill="#000"/>`;
  return (heaped ? `<path d="M${x - r + 2},${y} Q${x - r + 4},${y - 16} ${x},${y - 15} Q${x + r - 4},${y - 16} ${x + r - 2},${y} Z" fill="#fff" ${L(1.8)}/>` + grains : '') +
    `<path d="M${x - r},${y} H${x + r} Q${x + r - 2},${y + r * 0.9} ${x},${y + r * 0.9} Q${x - r + 2},${y + r * 0.9} ${x - r},${y} Z" fill="#fff" ${L(2.2)}/>` +
    `<path d="M${x - r * 0.6},${y + r * 0.35} q${r * 0.3},4 ${r * 0.6},0 q${r * 0.3},-4 ${r * 0.6},0" fill="none" ${L(1.2)}/>` +
    `<rect x="${x - r * 0.35}" y="${y + r * 0.9 - 1}" width="${r * 0.7}" height="4" rx="1" fill="#fff" ${L(1.6)}/>`;
}
// Bowl of beef noodles with its rim at y; noodles lifted by chopsticks when lift is true.
function noodleBowlG(x, y, w = 50, lift = true) {
  const r = w / 2;
  return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.22}" fill="#fff" ${L(2)}/>` +
    `<path d="M${x - r + 6},${y} q5,-4 10,0 t10,0 t10,0 t10,0" fill="none" ${L(1.2)}/>` +
    `<rect x="${x - 14}" y="${y - 6}" width="9" height="6" rx="2" fill="#000"/><rect x="${x + 6}" y="${y - 5}" width="9" height="6" rx="2" fill="#000"/>` +
    `<path d="M${x - r},${y} Q${x - r + 2},${y + r * 0.85} ${x},${y + r * 0.85} Q${x + r - 2},${y + r * 0.85} ${x + r},${y}" fill="#fff" ${L(2.2)}/>` +
    `<path d="M${x - r * 0.7},${y + r * 0.4} H${x + r * 0.7}" ${L(1)} stroke-dasharray="4 4"/>` +
    (lift ? `<path d="M${x - 4},${y - 2} q-3,-12 2,-24 M${x + 1},${y - 2} q3,-12 -1,-24 M${x + 5},${y - 2} q-2,-12 3,-24" fill="none" ${L(1.4)}/>` +
      `<path d="M${x - 10},${y - 28} L${x + 26},${y - 46} M${x - 8},${y - 24} L${x + 28},${y - 41}" ${L(2.2)}/>` : '');
}
// Fish facing left, centred at (x, y).
function fishG(x, y, s = 1, angle = 0) {
  return `<g transform="translate(${x},${y}) rotate(${angle}) scale(${s})">` +
    `<path d="M-22,0 C-12,-14 10,-14 18,0 C10,14 -12,14 -22,0 Z" fill="#fff" ${L(2.2)}/>` +
    `<path d="M16,0 L30,-11 L27,0 L30,11 Z" fill="#fff" ${L(2.2)}/>` +
    `<circle cx="-13" cy="-2" r="2.2" fill="#000"/><path d="M-6,-8 q4,8 0,16" fill="none" ${L(1.4)}/>` +
    `<path d="M0,-4 q3,2 0,4 M5,-4 q3,2 0,4 M3,2 q3,2 0,4 M8,0 q3,2 0,4" fill="none" ${L(1)}/>` +
    `<path d="M-2,-11 q6,-6 12,-1" fill="#000"/></g>`;
}
// Steamed pork bun with its base at y.
const bunG = (x, y, w = 22) =>
  `<path d="M${x - w / 2},${y} Q${x - w / 2},${y - w * 0.7} ${x},${y - w * 0.72} Q${x + w / 2},${y - w * 0.7} ${x + w / 2},${y} Z" fill="#fff" ${L(1.8)}/>` +
  `<path d="M${x},${y - w * 0.66} q-4,3 -6,6 M${x},${y - w * 0.66} q4,3 6,6 M${x},${y - w * 0.66} q0,4 0,6" fill="none" ${L(1.1)}/>`;
// Bamboo steamer (open) with buns; base at y.
function steamerG(x, y, w = 70, buns = 3) {
  let b = '';
  for (let i = 0; i < buns; i++) b += bunG(x - w / 2 + (w / (buns + 1)) * (i + 1), y - 16, 20);
  return b + `<path d="M${x - w / 2},${y - 18} H${x + w / 2} V${y} H${x - w / 2} Z" fill="#fff" ${L(2.2)}/>` +
    `<path d="M${x - w / 2},${y - 10} H${x + w / 2}" ${L(1.2)}/>` +
    Array.from({ length: 6 }, (_, i) => `<path d="M${x - w / 2 + 6 + i * (w - 12) / 5},${y - 9} v7" ${L(1)}/>`).join('');
}
// Mug with handle on the right; base at y. face: draw a little cat face on it.
function mugG(x, y, w = 30, cat = true) {
  const h = w * 1.05;
  return `<path d="M${x + w / 2 - 2},${y - h * 0.75} q14,0 12,14 q-2,10 -12,8" fill="none" ${L(3)}/>` +
    `<path d="M${x - w / 2},${y - h} H${x + w / 2} V${y - 4} Q${x + w / 2},${y} ${x + w / 2 - 4},${y} H${x - w / 2 + 4} Q${x - w / 2},${y} ${x - w / 2},${y - 4} Z" fill="#fff" ${L(2.2)}/>` +
    `<ellipse cx="${x}" cy="${y - h}" rx="${w / 2}" ry="2.5" fill="#000"/>` +
    (cat ? `<g transform="translate(${x},${y - h * 0.45})"><path d="M-8,-2 L-8,-10 L-3,-6 Q0,-7 3,-6 L8,-10 L8,-2 Q8,7 0,7 Q-8,7 -8,-2 Z" fill="#fff" ${L(1.4)}/>` +
      `<circle cx="-3" cy="0" r="1.2" fill="#000"/><circle cx="3" cy="0" r="1.2" fill="#000"/><path d="M-1,3 q1,1 2,0 M-12,1 h4 M8,1 h4 M-12,4 l4,-1 M8,3 l4,1" fill="none" ${L(0.9)}/></g>` : '');
}
// Plate of sliced beef (steak strips) on a plate centred at (x, y).
function beefPlateG(x, y, rx = 32) {
  let s = plateG(x, y, rx);
  for (const [dx, dy, r] of [[-14, -5, -10], [0, -6, -4], [13, -5, 6]])
    s += `<g transform="translate(${x + dx},${y + dy}) rotate(${r})"><rect x="-8" y="-5" width="16" height="9" rx="3" fill="#000"/><path d="M-5,-2 q3,2 6,0 M-2,1 q3,2 5,0" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/></g>`;
  return s + `<path d="M${x + 20},${y - 10} q3,-4 6,0 q3,-4 6,0" fill="#fff" ${L(1.4)}/>`;
}
// Kitchen sink counter: top at y from x, width w, with tap; floor at 186.
function sinkG(x, y, w = 120) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${186 - y}" fill="#fff" ${L(2.2)}/>` +
    `<path d="M${x},${y + 10} H${x + w} M${x + w / 2},${y + 18} V180" ${L(1.4)}/>` +
    `<circle cx="${x + w / 2 - 8}" cy="${y + 40}" r="2" fill="#000"/><circle cx="${x + w / 2 + 8}" cy="${y + 40}" r="2" fill="#000"/>` +
    `<path d="M${x + w * 0.75},${y} V${y - 26} Q${x + w * 0.75},${y - 32} ${x + w * 0.66},${y - 30} V${y - 22}" fill="none" ${L(3)}/>` +
    `<path d="M${x + w * 0.66},${y - 18} v6 M${x + w * 0.64},${y - 12} v6" ${L(1.2)} stroke-dasharray="2 3"/>`;
}
const bubblesG = (list) => list.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${L(1.4)}/><path d="M${x - r * 0.4},${y - r * 0.3} q${r * 0.2},${-r * 0.3} ${r * 0.5},${-r * 0.3}" fill="none" ${L(0.9)}/>`).join('');
// Moon (crescent) at (x, y).
const moonG = (x, y, r = 12) => `<path d="M${x},${y - r} A${r},${r} 0 1 0 ${x + r * 0.9},${y + r * 0.45} A${r * 0.8},${r * 0.8} 0 1 1 ${x},${y - r} Z" fill="#000"/>`;

module.exports = {
  L, tube, figure, hand, head, hairBack, ARMS,
  cloudG, leaves, treeG, grassG, groundG, room, windowG, steamG, clothTableG,
  plateG, riceBowlG, noodleBowlG, fishG, bunG, steamerG, mugG, beefPlateG, sinkG, bubblesG, moonG,
};
