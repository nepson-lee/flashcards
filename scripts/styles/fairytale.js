// 童話故事風格 (picture-book fairy-tale look, animal heroes) for black-and-white flashcard scenes.
// Original characters only, in the general spirit of classic storybook animals (no Peter Rabbit,
// no My Little Pony, no specific book or film character). Our cast:
//   - Mrs. Rabbit: a mother rabbit standing upright, long ears (one with a little flower),
//     long dress with a frilled apron and a neck bow.
//   - Little Bunny: her small child, one floppy ear, overalls with two buttons.
//   - Little Pony: a small pony on four legs, curly mane and tail, big eyes.
//   - Miss Butterfly: a tiny lady butterfly with a smiling face, curly antennae and patterned wings.
//   - Mr. Squirrel: a squirrel with a huge curly tail and a tiny waistcoat.
//
// How the style is expressed in SVG line art:
// - Soft, rounded storybook shapes: round heads, big shiny eyes, blush hatching on cheeks.
// - Each picture sits in a storybook frame: a rounded border with little leaf curls in the corners.
// - Gentle meadow / cottage backgrounds: rolling hills, daisies, toadstools, a mushroom cottage,
//   round fruit trees, little hearts and sparkles for feelings.
// - Strictly #000 / #fff, short hatch strokes instead of grey, so it prints well.
// Figure coordinates: feet on the ground at (0,0); `s` scales, `dir` = -1 mirrors.

const L = (w = 2) => `stroke="#000" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const g = (x, y, s, dir, inner) => `<g transform="translate(${x},${y}) scale(${dir * s},${s})">${inner}</g>`;

// ---------- faces ----------
function face({ cx = 0, cy = 0, look = 0, face: f = 'happy', gap = 8, ey = -3, size = 1 }) {
  const ex = look * 2;
  const p = [];
  for (const sx of [-1, 1]) {
    const x = cx + sx * gap + ex, y = cy + ey;
    if (f === 'closed' || f === 'love')
      p.push(`<path d="M${x - 3.5 * size},${y + 1} q${3.5 * size},-${4 * size} ${7 * size},0" fill="none" ${L(1.8)}/>`);
    else if (f === 'pain')
      p.push(`<path d="M${x - 3.5 * size},${y - 2} l${3.5 * size},2.5 l${-3.5 * size},2.5" transform="${sx > 0 ? `translate(${2 * x},0) scale(-1,1)` : ''}" fill="none" ${L(1.8)}/>`);
    else
      p.push(`<ellipse cx="${x}" cy="${y}" rx="${3.2 * size}" ry="${4.4 * size}" fill="#000"/>` +
        `<circle cx="${x + 1.2 * size}" cy="${y - 1.6 * size}" r="${1.3 * size}" fill="#fff"/>`);
    if (f === 'sad')
      p.push(`<path d="M${x - 4 * sx},${y - 8} l${8 * sx},-2.5" fill="none" ${L(1.4)}/>`);
  }
  // blush hatching
  for (const sx of [-1, 1]) {
    const bx = cx + sx * (gap + 6) + ex, by = cy + ey + 7;
    p.push(`<path d="M${bx - 3},${by + 1} l2,-3 M${bx},${by + 1} l2,-3 M${bx + 3},${by + 1} l2,-3" fill="none" ${L(0.9)}/>`);
  }
  return p.join('');
}

function mouth(cx, cy, kind) {
  if (kind === 'open')
    return `<path d="M${cx - 4},${cy} q4,7 8,0 Z" fill="#000"/>`;
  if (kind === 'sad') return `<path d="M${cx - 4},${cy + 3} q4,-4 8,0" fill="none" ${L(1.5)}/>`;
  if (kind === 'wobbly') return `<path d="M${cx - 5},${cy + 2} q2.5,-2 5,0 q2.5,2 5,0" fill="none" ${L(1.5)}/>`;
  return `<path d="M${cx - 5},${cy} q2.5,3 5,0 q2.5,3 5,0" fill="none" ${L(1.5)}/>`;
}

// ---------- rabbits ----------
// Arm poses for rabbits: [control point, paw] for the viewer-right arm (mirrored for the left).
const RARMS = {
  down: [[17, -46], [17, -30]],
  wave: [[24, -56], [24, -78]],
  up: [[20, -62], [18, -84]],
  hold: [[18, -44], [6, -44]],         // paw in front of the tummy
  reach: [[26, -54], [38, -54]],       // straight forward
  low: [[24, -40], [34, -22]],         // reaching down to the ground
  heart: [[16, -46], [4, -54]],        // paw on chest
  hug: [[30, -58], [30, -40]],         // wide open arms round someone
  clap: [[20, -50], [3, -62]],
};
// Little Bunny has a bigger head for his size, so raised arms use their own (unscaled) points.
const BARMS = {
  up: [[22, -62], [30, -84]],
  wave: [[24, -54], [28, -72]],
};
function rabbit(o) {
  const { x, y, s = 1, dir = 1, who = 'mom', look = 0, f = 'happy', m = 'smile', armL = 'down', armR = 'down', hop = false } = o;
  const mom = who === 'mom';
  const p = [];
  const hy = mom ? -84 : -66; // head centre
  // ears (behind the head)
  if (mom) {
    p.push(`<path d="M-12,${hy - 12} Q-24,${hy - 56} -12,${hy - 62} Q-2,${hy - 56} -4,${hy - 14} Z" fill="#fff" ${L(2.2)}/>` +
      `<path d="M-11,${hy - 18} Q-17,${hy - 48} -11,${hy - 54}" fill="none" ${L(1.2)}/>`);
    p.push(`<path d="M4,${hy - 14} Q4,${hy - 58} 14,${hy - 62} Q24,${hy - 54} 12,${hy - 12} Z" fill="#fff" ${L(2.2)}/>` +
      `<path d="M10,${hy - 18} Q11,${hy - 48} 15,${hy - 54}" fill="none" ${L(1.2)}/>`);
  } else {
    p.push(`<path d="M-10,${hy - 10} Q-18,${hy - 42} -9,${hy - 46} Q-1,${hy - 42} -3,${hy - 12} Z" fill="#fff" ${L(2.2)}/>` +
      `<path d="M-9,${hy - 15} Q-13,${hy - 36} -9,${hy - 40}" fill="none" ${L(1.1)}/>`);
    // floppy ear folding over to the right
    p.push(`<path d="M3,${hy - 12} Q8,${hy - 36} 22,${hy - 34} Q34,${hy - 30} 30,${hy - 18} Q22,${hy - 24} 10,${hy - 10} Z" fill="#fff" ${L(2.2)}/>` +
      `<path d="M9,${hy - 15} Q14,${hy - 29} 26,${hy - 25}" fill="none" ${L(1.1)}/>`);
  }
  // tail
  p.push(`<circle cx="${mom ? -20 : -15}" cy="${mom ? -34 : -26}" r="${mom ? 7 : 6}" fill="#fff" ${L(1.8)}/>`);
  // feet
  const fy = hop ? -8 : 0;
  for (const sx of [-1, 1])
    p.push(`<ellipse cx="${sx * (mom ? 9 : 7)}" cy="${fy - 3}" rx="${mom ? 10 : 8}" ry="4.5" fill="#fff" ${L(2)}/>`);
  // body / clothes
  if (mom) {
    p.push(`<path d="M-11,-66 Q-16,-40 -26,-8 Q0,-1 26,-8 Q16,-40 11,-66 Z" fill="#fff" ${L(2.2)}/>`);
    // dress: little dots
    for (const [dx, dy] of [[-17, -16], [17, -16], [-13, -30], [13, -30], [-10, -46], [10, -46]])
      p.push(`<circle cx="${dx}" cy="${dy}" r="1.3" fill="#000"/>`);
    // apron with a frill
    p.push(`<path d="M-8,-58 H8 Q12,-34 14,-14 H-14 Q-12,-34 -8,-58 Z" fill="#fff" ${L(1.6)}/>`);
    let fr = `M-14,-14`;
    for (let i = 0; i < 7; i++) fr += ` q2,4 4,0`;
    p.push(`<path d="${fr}" fill="#fff" ${L(1.4)}/><rect x="-6" y="-34" width="12" height="8" rx="2" fill="#fff" ${L(1.3)}/>`);
  } else {
    p.push(`<path d="M-11,-50 Q-16,-30 -14,-8 Q0,-3 14,-8 Q16,-30 11,-50 Z" fill="#fff" ${L(2.2)}/>`);
    // overalls
    p.push(`<path d="M-9,-36 H9 L11,-9 Q0,-5 -11,-9 Z" fill="#fff" ${L(1.6)}/>` +
      `<path d="M-9,-36 L-7,-50 M9,-36 L7,-50" ${L(1.6)}/><circle cx="-6" cy="-32" r="1.6" fill="#000"/><circle cx="6" cy="-32" r="1.6" fill="#000"/>` +
      `<path d="M0,-20 v10" ${L(1.1)}/>`);
  }
  // arms
  const sh = mom ? -60 : -46, sw = mom ? 10 : 9;
  const scaleArm = mom ? 1 : 0.8;
  const paws = [];
  for (const sx of [-1, 1]) {
    const pose = sx < 0 ? armL : armR;
    const raw = !mom && !Array.isArray(pose) && BARMS[pose];
    const [[cx, cy], [hx, hy2]] = Array.isArray(pose) ? pose : raw || RARMS[pose];
    const k = raw ? 1 : scaleArm;
    const ax = (v) => sx * v * k, ay = (v) => (raw ? v : sh + (v + 60) * k);
    const d = `M${sx * sw},${sh} Q${ax(cx)},${ay(cy)} ${ax(hx)},${ay(hy2)}`;
    p.push(`<path d="${d}" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="4.6" stroke-linecap="round"/>`);
    paws.push(`<circle cx="${ax(hx)}" cy="${ay(hy2)}" r="4.2" fill="#fff" ${L(1.8)}/>`);
  }
  // neck bow (mom) / collar (bunny)
  if (mom)
    p.push(`<path d="M0,-64 l-9,-5 v10 Z M0,-64 l9,-5 v10 Z" fill="#fff" ${L(1.6)}/><circle cx="0" cy="-64" r="2.4" fill="#000"/>`);
  // head
  const hr = mom ? 19 : 17;
  p.push(`<ellipse cx="0" cy="${hy}" rx="${hr + 2}" ry="${hr}" fill="#fff" ${L(2.4)}/>`);
  p.push(face({ cy: hy, look, face: f, gap: mom ? 8 : 7, ey: -2 }));
  p.push(`<path d="M${look * 2 - 2.5},${hy + 5} h5 l-2.5,3 Z" fill="#000"/>`);
  p.push(mouth(look * 2, hy + 9, m));
  // whiskers
  for (const sx of [-1, 1])
    p.push(`<path d="M${sx * 9},${hy + 6} l${sx * 12},-2 M${sx * 9},${hy + 9} l${sx * 12},2" fill="none" ${L(0.9)}/>`);
  if (mom) // a little flower tucked at the right ear
    p.push(flowerHead(11, hy - 16, 5));
  p.push(...paws);
  return g(x, y, s, dir, p.join(''));
}

// ---------- pony ----------
// Side view facing right (dir = -1 faces left). legs: 'stand' | 'lift' (front-right leg raised).
function pony(o) {
  const { x, y, s = 1, dir = 1, f = 'happy', m = 'smile', legs = 'stand', bandage = false, look = 1 } = o;
  const p = [];
  // tail
  p.push(`<path d="M-30,-50 Q-50,-54 -50,-36 Q-52,-20 -40,-14 Q-46,-26 -40,-34 Q-46,-22 -36,-18 Q-40,-36 -30,-44 Z" fill="#fff" ${L(2)}/>` +
    `<path d="M-44,-42 q2,8 0,14" fill="none" ${L(1.1)}/>`);
  // legs (back pair then front pair)
  const leg = (lx, top, lift) => lift
    ? `<path d="M${lx - 5},${top} L${lx - 5},-24 Q${lx + 6},-22 ${lx + 12},-28 L${lx + 14},-22 Q${lx + 6},-14 ${lx + 4},-18 L${lx + 5},${top} Z" fill="#fff" ${L(2)}/>` +
      `<path d="M${lx + 12},-28 l3,-1 l3,7 l-4,1 Z" fill="#000"/>`
    : `<path d="M${lx - 5},${top} L${lx - 5},-6 H${lx + 5} L${lx + 5},${top} Z" fill="#fff" ${L(2)}/><rect x="${lx - 6}" y="-6" width="12" height="6" rx="1.5" fill="#000"/>`;
  p.push(leg(-22, -40, false), leg(16, -40, false));
  p.push(leg(-12, -38, false), leg(26, -38, legs === 'lift'));
  // body
  p.push(`<ellipse cx="0" cy="-46" rx="36" ry="19" fill="#fff" ${L(2.4)}/>`);
  // little star mark on the hip
  p.push(`<path d="M-18,-50 l2,4 4,0.5 -3,3 1,4 -4,-2 -4,2 1,-4 -3,-3 4,-0.5 Z" fill="#fff" ${L(1.2)}/>`);
  if (bandage) {
    const bx = legs === 'lift' ? 26 : 26;
    const by = legs === 'lift' ? -30 : -22;
    p.push(`<rect x="${bx - 7}" y="${by - 5}" width="14" height="9" rx="2" fill="#fff" ${L(1.6)}/>` +
      `<path d="M${bx - 4},${by - 1} h8 M${bx},${by - 4} v6" ${L(1.4)}/>`);
  }
  // neck + head
  p.push(`<path d="M18,-56 Q26,-74 30,-86 L48,-80 Q44,-62 34,-44 Z" fill="#fff" ${L(2.2)}/>`);
  p.push(`<path d="M30,-80 Q38,-104 54,-98 Q72,-90 70,-74 Q68,-64 56,-66 Q44,-66 36,-70 Z" fill="#fff" ${L(2.4)}/>`);
  p.push(`<circle cx="66" cy="-76" r="1.4" fill="#000"/><path d="M58,-68 q4,2 8,-1" fill="none" ${L(1.4)}/>`);
  if (m === 'open') p.push(`<path d="M58,-68 q5,5 9,-1 Z" fill="#000"/>`);
  if (m === 'wobbly') p.push(`<path d="M57,-67 q2,-2 4,0 q2,2 4,0" fill="none" ${L(1.3)}/>`);
  // ear
  p.push(`<path d="M38,-96 L36,-110 L46,-100 Z" fill="#fff" ${L(2)}/>`);
  // eye
  const ex = 50, ey = -86;
  if (f === 'closed') p.push(`<path d="M${ex - 4},${ey} q4,-4 8,0" fill="none" ${L(1.8)}/>`);
  else if (f === 'pain') p.push(`<path d="M${ex - 4},${ey - 3} l6,3 l-6,3" fill="none" ${L(1.8)}/>`);
  else p.push(`<ellipse cx="${ex + look}" cy="${ey}" rx="4" ry="5.2" fill="#000"/><circle cx="${ex + look + 1.4}" cy="${ey - 2}" r="1.5" fill="#fff"/>` +
    `<path d="M${ex - 3},${ey - 6} l-2,-2 M${ex},${ey - 7} l0,-3 M${ex + 3},${ey - 6} l2,-2" fill="none" ${L(1.1)}/>`);
  if (f === 'sad') p.push(`<path d="M${ex - 5},${ey - 10} l9,2" ${L(1.4)}/>`);
  p.push(`<path d="M${ex + 4},${ey + 7} l2,-3 M${ex + 7},${ey + 7} l2,-3" fill="none" ${L(0.9)}/>`);
  // curly mane
  p.push(`<path d="M34,-98 Q26,-96 28,-88 Q20,-86 24,-78 Q16,-74 20,-66 Q14,-62 18,-56 Q26,-60 28,-68 Q34,-74 34,-82 Q38,-90 34,-98 Z" fill="#fff" ${L(2)}/>` +
    `<path d="M40,-100 q-6,0 -6,6 q6,2 10,-4" fill="#fff" ${L(1.8)}/>` +
    `<path d="M26,-84 q3,2 6,0 M22,-72 q3,2 6,0" fill="none" ${L(1.1)}/>`);
  return g(x, y, s, dir, p.join(''));
}

// ---------- butterfly ----------
// Miss Butterfly, centred on her body at (x,y); about 50 px wide at s=1. arm: 'hold' shows a flower.
function butterfly(o) {
  const { x, y, s = 1, dir = 1, f = 'happy', m = 'smile', flower = false } = o;
  const p = [];
  // wings
  p.push(`<path d="M0,-4 Q-10,-34 -30,-30 Q-40,-22 -26,-4 Z" fill="#fff" ${L(2)}/>` +
    `<path d="M0,-4 Q10,-34 30,-30 Q40,-22 26,-4 Z" fill="#fff" ${L(2)}/>` +
    `<path d="M0,0 Q-22,2 -24,16 Q-14,22 0,6 Z" fill="#fff" ${L(2)}/>` +
    `<path d="M0,0 Q22,2 24,16 Q14,22 0,6 Z" fill="#fff" ${L(2)}/>`);
  // wing patterns
  for (const sx of [-1, 1])
    p.push(`<circle cx="${sx * 20}" cy="-20" r="5" fill="#000"/><circle cx="${sx * 20}" cy="-20" r="2" fill="#fff"/>` +
      `<circle cx="${sx * 12}" cy="-10" r="2" fill="#000"/><circle cx="${sx * 15}" cy="10" r="3" fill="#fff" ${L(1.2)}/>` +
      `<path d="M${sx * 28},-27 l${sx * -3},3 M${sx * 30},-22 l${sx * -4},2" ${L(1)}/>`);
  // body
  p.push(`<ellipse cx="0" cy="8" rx="4.5" ry="13" fill="#fff" ${L(2)}/>` +
    `<path d="M-4,6 h8 M-4,11 h8 M-3,16 h6" ${L(1)}/>`);
  // antennae
  p.push(`<path d="M-3,-20 Q-8,-34 -14,-36 q-4,0 -2,4" fill="none" ${L(1.6)}/><path d="M3,-20 Q8,-34 14,-36 q4,0 2,4" fill="none" ${L(1.6)}/>`);
  // head with a tiny sun hat
  p.push(`<circle cx="0" cy="-12" r="9.5" fill="#fff" ${L(2)}/>`);
  p.push(face({ cx: 0, cy: -12, face: f, gap: 4, ey: -1, size: 0.65 }).replace(/l2,-3/g, 'l1.4,-2'));
  p.push(m === 'open' ? `<path d="M-2.5,-7 q2.5,4 5,0 Z" fill="#000"/>` : `<path d="M-2.5,-7 q2.5,2.5 5,0" fill="none" ${L(1.2)}/>`);
  if (flower) p.push(`<path d="M5,8 Q14,4 16,-4" fill="none" ${L(1.4)}/>` + flowerHead(17, -7, 5) + `<circle cx="5" cy="8" r="2.2" fill="#fff" ${L(1.3)}/>`);
  return g(x, y, s, dir, p.join(''));
}

// ---------- squirrel ----------
function squirrel(o) {
  const { x, y, s = 1, dir = 1, f = 'happy', m = 'smile', armR = 'down' } = o;
  const p = [];
  // big curly tail
  p.push(`<path d="M-8,-8 Q-40,-6 -38,-40 Q-36,-70 -14,-72 Q4,-72 2,-58 Q-2,-48 -14,-52 Q-20,-44 -16,-32 Q-12,-22 -2,-20 Z" fill="#fff" ${L(2.2)}/>` +
    `<path d="M-30,-30 q4,-6 2,-14 M-26,-54 q6,-4 12,-4 M-32,-18 q6,-2 10,-8" fill="none" ${L(1.1)}/>`);
  // body + waistcoat
  p.push(`<ellipse cx="2" cy="-18" rx="11" ry="15" fill="#fff" ${L(2.2)}/>` +
    `<path d="M-7,-28 L2,-12 L11,-28" fill="none" ${L(1.5)}/><circle cx="2" cy="-8" r="1.4" fill="#000"/>`);
  for (const sx of [-1, 1]) p.push(`<ellipse cx="${2 + sx * 6}" cy="-2" rx="6" ry="3" fill="#fff" ${L(1.8)}/>`);
  // arm
  const arm = armR === 'wave' ? 'M10,-26 Q20,-34 18,-44' : 'M9,-26 Q16,-20 12,-14';
  p.push(`<path d="${arm}" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"/><path d="${arm}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`);
  // head
  p.push(`<path d="M-6,-50 l-3,-12 l9,7 Z M8,-50 l3,-12 l-9,7 Z" fill="#fff" ${L(1.8)}/>`);
  p.push(`<ellipse cx="2" cy="-42" rx="12" ry="11" fill="#fff" ${L(2.2)}/>`);
  p.push(face({ cx: 2, cy: -42, face: f, gap: 5, ey: -2, size: 0.7 }));
  p.push(`<circle cx="2" cy="-38" r="1.6" fill="#000"/>` + mouth(2, -35, m === 'open' ? 'open' : 'smile').replace(/q2.5,3 5,0 q2.5,3 5,0/, 'q1.5,2 3,0 q1.5,2 3,0'));
  return g(x, y, s, dir, p.join(''));
}

// ---------- props ----------
function flowerHead(x, y, r = 6) {
  let petals = '';
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    petals += `<ellipse cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" rx="${(r * 0.62).toFixed(1)}" ry="${(r * 0.42).toFixed(1)}" transform="rotate(${(i * 60).toFixed(0)} ${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)})" fill="#fff" ${L(1.3)}/>`;
  }
  return petals + `<circle cx="${x}" cy="${y}" r="${(r * 0.45).toFixed(1)}" fill="#000"/>`;
}
const daisyG = (x, y, h = 16, r = 5) =>
  `<path d="M${x},${y} Q${x - 2},${y - h / 2} ${x},${y - h}" fill="none" ${L(1.5)}/>` +
  `<path d="M${x - 1},${y - h / 3} q-6,-2 -8,-6 q6,0 8,4" fill="#fff" ${L(1.2)}/>` + flowerHead(x, y - h, r);
const carrotG = (x, y, s = 1, rot = 0) =>
  `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-5,-12 Q0,-14 5,-12 L1,14 Q0,16 -1,14 Z" fill="#fff" ${L(1.8)}/>` +
  `<path d="M-4,-6 l3,1 M3,-1 l-3,1 M-2,5 l2,1" fill="none" ${L(1.1)}/>` +
  `<path d="M0,-13 q-6,-8 -4,-14 q3,6 4,12 q0,-8 4,-12 q1,8 -4,14" fill="#fff" ${L(1.5)}/></g>`;
const heartG = (x, y, r = 6, fill = '#fff') =>
  `<path d="M${x},${y + r} C${x - r * 2},${y - r * 0.3} ${x - r},${y - r * 1.6} ${x},${y - r * 0.5} C${x + r},${y - r * 1.6} ${x + r * 2},${y - r * 0.3} ${x},${y + r} Z" fill="${fill}" ${L(1.6)}/>`;
const sparkG = (x, y, r = 6) =>
  `<path d="M${x},${y - r} Q${x + r * 0.2},${y - r * 0.2} ${x + r},${y} Q${x + r * 0.2},${y + r * 0.2} ${x},${y + r} Q${x - r * 0.2},${y + r * 0.2} ${x - r},${y} Q${x - r * 0.2},${y - r * 0.2} ${x},${y - r} Z" fill="#000"/>`;
const tearG = (x, y) =>
  `<path d="M${x},${y} q-3.5,6 0,8 q3.5,-2 0,-8 Z" fill="#fff" ${L(1.4)}/>`;
const painG = (x, y) =>
  `<path d="M${x - 8},${y - 6} l-5,-5 M${x},${y - 9} v-7 M${x + 8},${y - 6} l5,-5" fill="none" ${L(1.8)}/>`;
const toadstoolG = (x, y, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M-5,0 Q-6,-10 -4,-16 H4 Q6,-10 5,0 Z" fill="#fff" ${L(1.6)}/>` +
  `<path d="M-16,-16 Q-16,-34 0,-34 Q16,-34 16,-16 Z" fill="#fff" ${L(2)}/>` +
  `<circle cx="-7" cy="-24" r="3" fill="#000"/><circle cx="5" cy="-27" r="2.4" fill="#000"/><circle cx="9" cy="-19" r="2" fill="#000"/></g>`;
const fruitTreeG = (x, y, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M-6,0 Q-3,-24 -5,-40 H5 Q3,-24 6,0 Z" fill="#fff" ${L(2)}/>` +
  `<path d="M-2,-18 l-2,-2 M2,-28 l2,-2 M-1,-8 l2,-2" fill="none" ${L(1)}/>` +
  `<path d="M0,-34 q-30,6 -30,-20 q-6,-28 20,-30 q12,-16 28,0 q24,4 16,28 q2,24 -18,22 q-8,4 -16,0 Z" fill="#fff" ${L(2.2)}/>` +
  `<circle cx="-14" cy="-56" r="3" fill="#fff" ${L(1.4)}/><circle cx="8" cy="-70" r="3" fill="#fff" ${L(1.4)}/><circle cx="16" cy="-48" r="3" fill="#fff" ${L(1.4)}/><circle cx="-2" cy="-46" r="3" fill="#fff" ${L(1.4)}/></g>`;
const mushroomHouseG = (x, y, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M-18,0 Q-20,-20 -16,-34 H16 Q20,-20 18,0 Z" fill="#fff" ${L(2)}/>` +
  `<path d="M-6,0 V-14 Q0,-20 6,-14 V0" fill="#fff" ${L(1.6)}/><circle cx="3.5" cy="-7" r="1" fill="#000"/>` +
  `<circle cx="-11" cy="-24" r="4" fill="#fff" ${L(1.4)}/><path d="M-15,-24 h8 M-11,-28 v8" ${L(1)}/>` +
  `<path d="M-32,-32 Q-30,-64 0,-66 Q30,-64 32,-32 Q0,-26 -32,-32 Z" fill="#fff" ${L(2.2)}/>` +
  `<circle cx="-16" cy="-46" r="5" fill="#000"/><circle cx="4" cy="-56" r="4" fill="#000"/><circle cx="18" cy="-42" r="4.5" fill="#000"/><circle cx="-2" cy="-40" r="2.5" fill="#000"/>` +
  `<path d="M14,-62 v-8 h5 v5" fill="#fff" ${L(1.6)}/></g>`;
const hillsG = (y) =>
  `<path d="M8,${y - 26} Q60,${y - 54} 120,${y - 30} Q180,${y - 54} 240,${y - 32} Q270,${y - 44} 292,${y - 36}" fill="none" ${L(1.5)}/>`;
const grassTuftsG = (y, xs) => xs.map((x) => `<path d="M${x - 5},${y} q2,-7 3,-1 q1,-8 3,0 q2,-6 3,1" fill="none" ${L(1.2)}/>`).join('');
const groundG = (y) => `<path d="M6,${y} Q80,${y - 3} 150,${y} T294,${y}" fill="none" ${L(2)}/>`;
const cloudG = (x, y, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M-24,6 q-10,-2 -6,-10 q2,-8 12,-6 q4,-10 16,-8 q10,-8 18,2 q12,0 10,10 q4,8 -6,12 Z" fill="#fff" ${L(1.6)}/></g>`;
const sunG = (x, y, r = 12) => {
  let rays = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    const r2 = i % 2 ? r + 7 : r + 11;
    rays += `M${(x + Math.cos(a) * (r + 4)).toFixed(1)},${(y + Math.sin(a) * (r + 4)).toFixed(1)} L${(x + Math.cos(a) * r2).toFixed(1)},${(y + Math.sin(a) * r2).toFixed(1)} `;
  }
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${L(1.8)}/><path d="${rays}" ${L(1.6)}/>`;
};
// Storybook frame: rounded border with leafy curls at the corners. Draw it last.
const frameG = () => {
  const curl = (x, y, sx, sy) =>
    `<path d="M${x},${y} q${sx * 14},0 ${sx * 16},${sy * 12} q${sx * -2},${sy * -4} ${sx * -6},${sy * -4}" fill="none" ${L(1.4)}/>` +
    `<path d="M${x + sx * 8},${y + sy * 1} q${sx * 4},${sy * -6} ${sx * 10},${sy * -2} q${sx * -4},${sy * 6} ${sx * -10},${sy * 2} Z" fill="#000"/>` +
    `<path d="M${x + sx * 1},${y + sy * 8} q${sx * -6},${sy * 4} ${sx * -2},${sy * 10} q${sx * 6},${sy * -4} ${sx * 2},${sy * -10} Z" fill="#000"/>`;
  return `<rect x="4" y="4" width="292" height="192" rx="14" fill="none" ${L(1.8)}/>` +
    `<rect x="8" y="8" width="284" height="184" rx="11" fill="none" ${L(0.8)}/>` +
    curl(12, 12, 1, 1) + curl(288, 12, -1, 1) + curl(12, 188, 1, -1) + curl(288, 188, -1, -1);
};
const bubbleG = (x, y, w, h, tx, ty, inner = '') =>
  `<circle cx="${tx}" cy="${ty}" r="2.5" fill="#fff" ${L(1.4)}/><circle cx="${(tx * 2 + x) / 3}" cy="${(ty * 2 + y + h / 2) / 3}" r="3.5" fill="#fff" ${L(1.5)}/>` +
  `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h / 2}" fill="#fff" ${L(1.8)}/>` + inner;

module.exports = {
  L, rabbit, pony, butterfly, squirrel, RARMS,
  flowerHead, daisyG, carrotG, heartG, sparkG, tearG, painG, toadstoolG, fruitTreeG, mushroomHouseG,
  hillsG, grassTuftsG, groundG, cloudG, sunG, frameG, bubbleG,
};
