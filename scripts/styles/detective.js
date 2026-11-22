// 日本推理動漫風格 (1990s Japanese detective-anime / manga look) for black-and-white flashcard scenes.
// Original characters only — this imitates the general look of detective manga, never a specific
// character from any series. Our cast:
//   - Ken: a boy detective — black spiky hair, hoodie with a star, shorts, often a magnifying glass.
//   - Lily: a high-school girl — long straight black hair with bangs, sailor-collar school uniform.
//   - Dr. Bo: an inventor — tall and thin, messy white hair, goggles on his forehead, lab coat, tie.
//   - Sara: a cool, calm girl — light (white) hair in a ponytail, collared dress.
//   - Amy: a little girl — black pigtails, simple dress.
//
// How the style is expressed in SVG line art:
// - Anime faces: soft oval face tapering to a small pointed chin, very large eyes (thick upper
//   lash line, big black iris with two white highlights), tiny nose stroke, small mouth.
// - Hair drawn as sharp clumps/spikes: black fill with a white shine stripe, or white with
//   strand lines for light hair. Kids ~3.5 heads tall, teens/adults ~5-6 heads.
// - Manga effects: speed lines, sweat drops, sparkles, "!" and "?" marks, tear streams,
//   hatched blush, screentone dot shading (black dots, prints fine).
// - Detective mood: magnifying glass, footprints, city skyline with windows, a lab with gadgets.
// - Strictly #000 / #fff so cards print well.
// All helpers return SVG fragment strings for the 300x200 scene viewBox.

const L = (w = 2) => `stroke="#000" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const pts = (a) => a.map((p) => p.map((v) => +v.toFixed(1)).join(',')).join(' ');
const tube = (a, w = 7) =>
  `<polyline points="${pts(a)}" fill="none" stroke="#000" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<polyline points="${pts(a)}" fill="none" stroke="#fff" stroke-width="${w - 3.4}" stroke-linecap="round" stroke-linejoin="round"/>`;

// Arm poses relative to the shoulder, for an arm 30 units long; sx = -1 (viewer-left) / +1.
const ARMS = {
  down: [[0, 0], [4, 15], [5, 30]],
  hold: [[0, 0], [6, 14], [-6, 18]],
  point: [[0, 0], [15, 2], [31, -2]],
  pointDown: [[0, 0], [13, 10], [25, 21]],
  forward: [[0, 0], [14, 10], [27, 11]],
  up: [[0, 0], [4, -14], [3, -31]],
  wave: [[0, 0], [15, 4], [19, -18]],
  hip: [[0, 0], [12, 12], [1, 22]],
  chin: [[0, 0], [9, 16], [-3, 0]],
  eye: [[0, 0], [10, 14], [-4, -8]],
  glass: [[0, 0], [14, 7], [25, -5]],
};

// Body measurements in figure coordinates (feet at 0,0).
const BODY = {
  kid: { sh: -56, sw: 11, hip: -32, head: -75, hs: 0.95, arm: 1 },
  big: { sh: -80, sw: 12, hip: -48, head: -98, hs: 0.9, arm: 1.2 },
};

function armPts(pose, sx, B) {
  const a = Array.isArray(pose) ? pose : ARMS[pose];
  return a.map(([x, y]) => [sx * (B.sw + x * B.arm), B.sh + y * B.arm]);
}

// Where a hand ends up in scene coordinates, so objects can be placed in it.
function hand(o, side) {
  const s = o.s || 1, B = BODY[o.size || 'kid'];
  const sx = side === 'l' ? -1 : 1;
  const p = armPts(side === 'l' ? o.armL || 'down' : o.armR || 'down', sx, B);
  const [hx, hy] = p[p.length - 1];
  return [o.x + hx * s, o.y + hy * s];
}

// ---------- heads (head-local coordinates, centre 0,0, face ~28 wide) ----------
function hairBack(hair) {
  return {
    long: `<path d="M-17,-6 C-22,-28 22,-28 17,-6 L19,30 L22,62 L10,56 L4,64 L-4,56 L-12,64 L-22,62 L-19,30 Z" fill="#000"/>` +
      `<path d="M-12,8 L-14,52 M12,8 L14,52" stroke="#fff" stroke-width="1.2"/>`,
    ponytail: `<path d="M10,-16 Q30,-14 28,6 Q30,24 20,34 Q24,18 18,6 Q16,-4 8,-8 Z" fill="#fff" ${L(1.8)}/>` +
      `<path d="M18,-6 Q24,6 21,22 M14,-10 Q22,0 22,12" fill="none" ${L(1)}/>`,
    pigtails: `<path d="M-15,-6 Q-30,-2 -27,18 Q-22,8 -15,4 Z M15,-6 Q30,-2 27,18 Q22,8 15,4 Z" fill="#000"/>`,
    scientist: `<path d="M-18,-4 L-26,-10 L-21,-14 L-28,-20 L-18,-20 L-20,-28 L-10,-22 L-6,-30 L0,-22 L6,-30 L10,-22 L20,-28 L18,-20 L28,-20 L21,-14 L26,-10 L18,-4 Z" fill="#fff" ${L(1.8)}/>`,
  }[hair] || '';
}

function face({ hair, face: f = 'smile', look = 0, adult = false, blush = false }) {
  const p = [];
  // ears + face shape with small pointed chin
  p.push(`<path d="M-15,0 q-5,0 -4,5 q1,4 5,4 M15,0 q5,0 4,5 q-1,4 -5,4" fill="#fff" ${L(1.6)}/>`);
  p.push(`<path d="M-15,-4 C-15,-16 -8,-21 0,-21 C8,-21 15,-16 15,-4 C15,7 9,14 0,19 C-9,14 -15,7 -15,-4 Z" fill="#fff" ${L(2)}/>`);
  // eyes
  const ex = look * 1.6;
  const ey = adult ? 1 : 2;
  if (f === 'closed' || f === 'laugh') {
    p.push(`<path d="M${-10 + ex},${ey + 1} q4,-4 8,0 M${2 + ex},${ey + 1} q4,-4 8,0" fill="none" ${L(2)}/>`);
  } else {
    for (const sx of [-1, 1]) {
      const cx = sx * 6 + ex;
      if (adult) {
        p.push(`<path d="M${cx - 4},${ey - 1} Q${cx},${ey - 3} ${cx + 4},${ey - 1}" fill="none" ${L(1.8)}/>`,
          `<ellipse cx="${cx + look}" cy="${ey + 1}" rx="1.8" ry="2.4" fill="#000"/>`);
      } else {
        p.push(`<path d="M${cx - 5},${ey - 2} Q${cx},${ey - 6.5} ${cx + 5},${ey - 2.5}" fill="none" ${L(2.4)}/>`,
          `<path d="M${cx + sx * 5},${ey - 2.5} l${sx * 1.6},-1.4" ${L(1.4)}/>`,
          `<ellipse cx="${cx + look * 0.8}" cy="${ey + 1.4}" rx="3.1" ry="4.2" fill="#000"/>`,
          `<circle cx="${cx + look * 0.8 - 1.2}" cy="${ey - 0.2}" r="1.3" fill="#fff"/>`,
          `<circle cx="${cx + look * 0.8 + 1.2}" cy="${ey + 3}" r="0.6" fill="#fff"/>`,
          `<path d="M${cx - 3},${ey + 6} q3,1 6,0" fill="none" ${L(0.9)}/>`);
      }
    }
  }
  // brows
  const by = ey - 8;
  if (f === 'sad' || f === 'cry')
    p.push(`<path d="M${-10 + ex},${by + 1} L${-3 + ex},${by - 2} M${10 + ex},${by + 1} L${3 + ex},${by - 2}" ${L(1.4)}/>`);
  else if (f === 'serious')
    p.push(`<path d="M${-10 + ex},${by - 2} L${-3 + ex},${by + 1} M${10 + ex},${by - 2} L${3 + ex},${by + 1}" ${L(1.6)}/>`);
  else if (adult)
    p.push(`<path d="M${-10 + ex},${by} q4,-3 8,0 M${2 + ex},${by} q4,-3 8,0" fill="none" ${L(2.4)}/>`);
  else
    p.push(`<path d="M${-9 + ex},${by} q3.5,-2 7,0 M${2 + ex},${by} q3.5,-2 7,0" fill="none" ${L(1.2)}/>`);
  // nose + mouth
  p.push(`<path d="M${ex * 0.8 + 0.4},${ey + 5.5} l-0.8,1.6" ${L(1)}/>`);
  const my = ey + 11, mx = ex * 0.6;
  p.push({
    smile: `<path d="M${mx - 3},${my} Q${mx},${my + 2.4} ${mx + 3},${my}" fill="none" ${L(1.4)}/>`,
    open: `<path d="M${mx - 3.4},${my - 0.5} Q${mx},${my + 6} ${mx + 3.4},${my - 0.5} Z" fill="#000"/>`,
    laugh: `<path d="M${mx - 4.5},${my - 1} Q${mx},${my + 7} ${mx + 4.5},${my - 1} Z" fill="#000"/><path d="M${mx - 2.5},${my + 2.6} q2.5,-1.6 5,0" fill="#fff"/>`,
    sad: `<path d="M${mx - 3},${my + 1.5} Q${mx},${my - 1} ${mx + 3},${my + 1.5}" fill="none" ${L(1.4)}/>`,
    cry: `<path d="M${mx - 4},${my + 3} Q${mx},${my - 3} ${mx + 4},${my + 3} Z" fill="#000"/>`,
    serious: `<path d="M${mx - 2.5},${my} h5" ${L(1.4)}/>`,
    closed: `<path d="M${mx - 3},${my} Q${mx},${my + 2.4} ${mx + 3},${my}" fill="none" ${L(1.4)}/>`,
  }[f] || '');
  if (f === 'cry')
    p.push(`<path d="M${-6 + ex},${ey + 5} q-2,8 -1,16 M${6 + ex},${ey + 5} q2,8 1,16" fill="none" ${L(1.4)}/>`,
      `<path d="M${-9 + ex},${ey + 5} q-2,8 -1,16 M${9 + ex},${ey + 5} q2,8 1,16" fill="none" ${L(1)}/>`);
  if (blush || f === 'laugh')
    p.push(`<path d="M-13,8 l2,-3 M-10.5,8.5 l2,-3 M-8,9 l2,-3 M8,9 l2,-3 M10.5,8.5 l2,-3 M13,8 l2,-3" ${L(0.9)}/>`);
  // front hair
  const front = {
    spiky: `<path d="M-17,0 L-20,-8 L-16,-10 L-22,-18 L-14,-18 L-16,-28 L-6,-22 L-2,-31 L4,-23 L12,-29 L12,-20 L22,-20 L16,-12 L21,-6 L16,-3 L15,-9 L10,-6 L9,-13 L4,-8 L1,-14 L-4,-8 L-7,-14 L-10,-7 L-14,-11 Z" fill="#000"/>` +
      `<path d="M-10,-20 Q-2,-24 8,-20" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`,
    long: `<path d="M-17,2 C-19,-18 -8,-24 0,-24 C10,-24 19,-18 17,2 L15,-8 L11,-12 L9,-8 L5,-14 L1,-9 L-3,-14 L-6,-9 L-10,-13 L-13,-8 Z" fill="#000"/>` +
      `<path d="M-10,-18 Q0,-22 10,-18" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`,
    ponytail: `<path d="M-16,0 C-18,-18 -8,-23 0,-23 C10,-23 18,-17 16,0 L14,-7 L10,-11 L7,-5 L3,-12 L-1,-6 L-5,-12 L-8,-6 L-12,-10 Z" fill="#fff" ${L(1.8)}/>` +
      `<path d="M-8,-19 Q-6,-14 -7,-9 M0,-21 Q2,-15 1,-9 M8,-19 Q10,-15 9,-10" fill="none" ${L(1)}/>` +
      `<path d="M8,-19 l5,-3 l-1,5 Z" fill="#000"/>`,
    pigtails: `<path d="M-16,0 C-18,-18 -8,-23 0,-23 C10,-23 18,-17 16,0 Q12,-8 9,-12 Q5,-7 0,-11 Q-4,-7 -9,-11 Q-12,-6 -16,0 Z" fill="#000"/>` +
      `<circle cx="-16" cy="-3" r="2.6" fill="#fff" ${L(1.4)}/><circle cx="16" cy="-3" r="2.6" fill="#fff" ${L(1.4)}/>`,
    scientist: `<path d="M-15,-6 C-16,-16 -8,-21 0,-21 C8,-21 16,-16 15,-6 L12,-12 L8,-9 L4,-14 L0,-9 L-4,-14 L-8,-9 L-12,-12 Z" fill="#fff" ${L(1.6)}/>` +
      `<rect x="-14" y="-20" width="28" height="7" rx="3" fill="#000"/>` +
      `<circle cx="-6" cy="-16.5" r="4.4" fill="#fff" ${L(1.6)}/><circle cx="6" cy="-16.5" r="4.4" fill="#fff" ${L(1.6)}/>` +
      `<path d="M-3,${ey + 13} q3,2 6,0" fill="none" ${L(1)}/>`,
  }[hair];
  if (front) p.push(front);
  return p.join('');
}

// A character. (x, y) = point between the feet on the ground.
// who: 'ken' | 'lily' | 'bo' | 'sara' | 'amy' (sets size, hair and clothes; can be overridden);
// armL / armR: a pose name from ARMS or an array of points; face: smile | open | laugh | sad |
// cry | serious | closed; look: -1..1; blush: hatched cheeks.
const CAST = {
  ken: { size: 'kid', hair: 'spiky', outfit: 'hoodie' },
  sara: { size: 'kid', hair: 'ponytail', outfit: 'collar' },
  amy: { size: 'kid', hair: 'pigtails', outfit: 'dress', s: 0.85 },
  lily: { size: 'big', hair: 'long', outfit: 'uniform' },
  bo: { size: 'big', hair: 'scientist', outfit: 'labcoat', adult: true, s: 1.08 },
};

function figure(o0) {
  const o = { ...CAST[o0.who], ...o0 };
  const { x, y, s = 1, size = 'kid', hair, outfit, armL = 'down', armR = 'down' } = o;
  const B = BODY[size];
  const p = [];
  p.push(`<g transform="translate(0,${B.head}) scale(${B.hs})">${hairBack(hair)}</g>`);
  // legs + shoes
  for (const sx of [-1, 1]) {
    const lp = [[sx * 5, B.hip], [sx * 6, B.hip / 2], [sx * 6, -4]];
    if (outfit === 'labcoat') p.push(`<polyline points="${pts(lp)}" fill="none" stroke="#000" stroke-width="9" stroke-linecap="round"/>`);
    else p.push(tube(lp, 6.5));
    p.push(`<path d="M${sx * 6 - 5},-1 Q${sx * 6 - 5},-7 ${sx * 6 + sx * 2},-7 Q${sx * 6 + sx * 9},-6 ${sx * 6 + sx * 9},-1 Z" fill="#000"/>`);
  }
  const sh = B.sh, sw = B.sw, hip = B.hip;
  // clothes
  if (outfit === 'hoodie') p.push(
    `<path d="M${-sw - 2},${hip + 10} V${hip} H${sw + 2} V${hip + 10} H3 L0,${hip + 5} L-3,${hip + 10} Z" fill="#000"/>`,
    `<path d="M-8,${sh - 2} Q0,${sh + 6} 8,${sh - 2} L${sw + 1},${sh + 1} L${sw + 2},${hip + 1} L${-sw - 2},${hip + 1} L${-sw - 1},${sh + 1} Z" fill="#fff" ${L(2)}/>`,
    `<path d="M-8,${sh - 2} Q0,${sh + 9} 8,${sh - 2}" fill="none" ${L(1.6)}/>`,
    `<path d="M-2,${sh + 6} l-1,6 M2,${sh + 6} l1,6" ${L(1)}/>`,
    `<path d="M0,${sh + 12} l1.6,3.6 l3.8,0.4 l-2.9,2.5 l0.9,3.8 l-3.4,-2 l-3.4,2 l0.9,-3.8 l-2.9,-2.5 l3.8,-0.4 Z" fill="#000"/>`,
    `<path d="M${-sw - 1},${hip - 3} H${sw + 1}" ${L(1.2)}/>`);
  if (outfit === 'dress' || outfit === 'collar') p.push(
    `<path d="M-8,${sh - 1} Q0,${sh + 3} 8,${sh - 1} L${sw},${sh + 2} L${sw + 1},${hip - 4} L${sw + 7},${hip + 12} Q0,${hip + 16} ${-sw - 7},${hip + 12} L${-sw - 1},${hip - 4} L${-sw},${sh + 2} Z" fill="#fff" ${L(2)}/>`,
    `<path d="M${-sw - 1},${hip - 4} Q0,${hip - 1} ${sw + 1},${hip - 4}" fill="none" ${L(1.2)}/>`,
    outfit === 'collar'
      ? `<path d="M-7,${sh - 1} L-1,${sh + 7} L-4,${sh + 9} L-9,${sh + 2} Z M7,${sh - 1} L1,${sh + 7} L4,${sh + 9} L9,${sh + 2} Z" fill="#000"/><path d="M0,${sh + 10} v14" ${L(1)}/>`
      : `<path d="M${-sw - 4},${hip + 6} l3,-4 M${sw + 4},${hip + 6} l-3,-4 M-3,${hip + 9} l2,-4 M5,${hip + 9} l2,-4" ${L(1)}/>`);
  if (outfit === 'uniform') p.push(
    `<path d="M${-sw - 1},${hip - 2} L${-sw - 9},${hip + 22} Q0,${hip + 26} ${sw + 9},${hip + 22} L${sw + 1},${hip - 2} Z" fill="#000"/>`,
    `<path d="M${-sw - 4},${hip + 4} L${-sw - 6},${hip + 22} M-5,${hip + 2} L-6,${hip + 24} M5,${hip + 2} L6,${hip + 24} M${sw + 4},${hip + 4} L${sw + 6},${hip + 22}" stroke="#fff" stroke-width="1.2"/>`,
    `<path d="M-8,${sh - 1} Q0,${sh + 3} 8,${sh - 1} L${sw},${sh + 2} L${sw + 1},${hip} L${-sw - 1},${hip} L${-sw},${sh + 2} Z" fill="#fff" ${L(2)}/>`,
    `<path d="M-8,${sh - 1} L0,${sh + 12} L8,${sh - 1} L${sw},${sh + 4} L${sw - 2},${sh + 9} L0,${sh + 14} L${-sw + 2},${sh + 9} L${-sw},${sh + 4} Z" fill="#fff" ${L(1.6)}/>`,
    `<path d="M${-sw + 1},${sh + 6} L-1,${sh + 12} M${sw - 1},${sh + 6} L1,${sh + 12}" ${L(1)}/>`,
    `<path d="M0,${sh + 13} l-6,-3 v6 Z M0,${sh + 13} l6,-3 v6 Z M0,${sh + 13} l-3,8 M0,${sh + 13} l3,8" fill="#000" ${L(1.2)}/>`);
  if (outfit === 'labcoat') p.push(
    `<path d="M-8,${sh - 1} Q0,${sh + 3} 8,${sh - 1} L${sw + 1},${sh + 2} L${sw + 6},-16 L${-sw - 6},-16 L${-sw - 1},${sh + 2} Z" fill="#fff" ${L(2)}/>`,
    `<path d="M-6,${sh} L0,${sh + 30} L6,${sh} Z" fill="#fff" ${L(1.4)}/>`,
    `<path d="M-1.6,${sh + 4} h3.2 l1,14 l-2.6,4 l-2.6,-4 Z" fill="#000"/>`,
    `<path d="M0,${sh + 30} V-16 M-8,${sh - 1} L-3,${sh + 22} M8,${sh - 1} L3,${sh + 22} M${-sw + 1},${hip + 4} h6 M${sw - 7},${hip + 4} h6" fill="none" ${L(1.4)}/>`,
    `<path d="M${sw - 6},${sh + 12} h5 v6 h-5 Z" fill="none" ${L(1.2)}/><path d="M${sw - 4},${sh + 12} v-4" ${L(1.4)}/>`);
  // neck + head
  p.push(`<path d="M-3,${B.head + 16 * B.hs} V${sh} M3,${B.head + 16 * B.hs} V${sh}" ${L(1.6)}/>`);
  p.push(`<g transform="translate(0,${B.head}) scale(${B.hs})">${face(o)}</g>`);
  // arms + hands (on top)
  for (const sx of [-1, 1]) {
    const ap = armPts(sx < 0 ? armL : armR, sx, B);
    p.push(tube(ap, outfit === 'labcoat' ? 8 : 6.5));
    const [hx, hy] = ap[ap.length - 1];
    p.push(`<circle cx="${hx}" cy="${hy}" r="3.4" fill="#fff" ${L(1.6)}/>`);
  }
  return `<g transform="translate(${x},${y}) scale(${s})">${p.join('')}</g>`;
}

// ---------- props + manga effects ----------
const magnifier = (x, y, r = 9, ang = -40) =>
  `<g transform="translate(${x},${y}) rotate(${ang})"><path d="M0,0 L0,14" stroke="#000" stroke-width="5" stroke-linecap="round"/>` +
  `<circle cx="0" cy="${-r - 1}" r="${r}" fill="#fff" ${L(2.6)}/><path d="M${-r * 0.5},${-r * 1.4} q2,-3 5,-3" fill="none" ${L(1.2)}/></g>`;
const footprint = (x, y, ang = 0, s = 1) =>
  `<g transform="translate(${x},${y}) rotate(${ang}) scale(${s})"><ellipse cx="0" cy="0" rx="3.4" ry="5.4" fill="#000"/><ellipse cx="0" cy="8" rx="2.6" ry="2.6" fill="#000"/></g>`;
const sweat = (x, y, s = 1) => `<path d="M${x},${y} q-${4 * s},${7 * s} 0,${9 * s} q${4 * s},-${2 * s} 0,-${9 * s} Z" fill="#fff" ${L(1.4)}/>`;
const exclaim = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-2,-14 h4 l-1,11 h-2 Z" fill="#000"/><circle cx="0" cy="1" r="2" fill="#000"/></g>`;
const question = (x, y, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M-5,-10 q0,-6 5,-6 q6,0 6,5 q0,4 -4,6 q-2,1 -2,4" fill="none" ${L(2.6)}/><circle cx="0" cy="4" r="1.8" fill="#000"/></g>`;
const sparkle = (x, y, r = 5) =>
  `<path d="M${x},${y - r} Q${x + r * 0.15},${y - r * 0.15} ${x + r},${y} Q${x + r * 0.15},${y + r * 0.15} ${x},${y + r} Q${x - r * 0.15},${y + r * 0.15} ${x - r},${y} Q${x - r * 0.15},${y - r * 0.15} ${x},${y - r} Z" fill="#000"/>`;
// Radiating speed lines around (cx, cy), from radius r1 outwards (len long), kept inside the scene.
function speedLines(cx, cy, r1, n = 28, seed = 1, len = 40) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + ((i * 37 + seed) % 7) * 0.02;
    const rr = r1 + ((i * 13 + seed) % 5) * 6;
    d += `M${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)} L${(cx + Math.cos(a) * (rr + len)).toFixed(1)},${(cy + Math.sin(a) * (rr + len)).toFixed(1)} `;
  }
  return `<path d="${d}" stroke="#000" stroke-width="1" stroke-linecap="round"/>`;
}
// Screentone dots inside a rect (manga shading).
function tone(x, y, w, h, gap = 5, r = 0.9) {
  let c = '';
  for (let j = 0, yy = y + gap / 2; yy < y + h; yy += gap, j++)
    for (let xx = x + gap / 2 + (j % 2) * gap / 2; xx < x + w; xx += gap) c += `<circle cx="${xx.toFixed(1)}" cy="${yy.toFixed(1)}" r="${r}"/>`;
  return `<g fill="#000">${c}</g>`;
}
// City skyline along the horizon y.
function cityG(y, x0 = 0, x1 = 300) {
  const blds = [[0, 40, 50], [42, 30, 76], [74, 46, 40], [122, 26, 92], [150, 40, 58], [192, 34, 80], [228, 48, 46], [278, 30, 70]];
  let out = '';
  for (const [bx, w, h] of blds) {
    const X = x0 + bx;
    if (X > x1) continue;
    out += `<rect x="${X}" y="${y - h}" width="${w}" height="${h}" fill="#fff" ${L(1.6)}/>`;
    for (let wy = y - h + 6; wy < y - 8; wy += 10)
      for (let wx = X + 5; wx < X + w - 6; wx += 9) out += `<rect x="${wx}" y="${wy}" width="4" height="5" fill="#000"/>`;
  }
  return out;
}
// Indoor room: floor line and a back wall line with a window.
const roomG = (floorY, wx = 30, wy = 20, ww = 60, wh = 46, inside = '') =>
  `<path d="M0,${floorY} H300" ${L(2)}/><path d="M0,${floorY - 24} H300" ${L(1)}/>` +
  `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="#fff" ${L(2)}/>` + inside +
  `<path d="M${wx + ww / 2},${wy} V${wy + wh} M${wx},${wy + wh / 2} H${wx + ww}" ${L(1.4)}/>`;

module.exports = {
  L, tube, figure, hand, ARMS, CAST,
  magnifier, footprint, sweat, exclaim, question, sparkle, speedLines, tone, cityG, roomG,
};
