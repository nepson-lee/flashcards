// Shared drawing primitives for flashcard scenes.
// Every helper returns an SVG fragment string; scenes use a 300x200 viewBox.
// Black-and-white line art only: stroke #000, fills #fff or #000, never grey.

const S = 'stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';

// ---------- primitives ----------
function person({ x, y, s = 1, hair = 'boy', wave = null, flip = false, mouth = 'smile', closedEyes = false }) {
  const parts = [];
  // legs + shoes
  parts.push(`<line x1="-8" y1="66" x2="-10" y2="96" ${S}/>`, `<line x1="8" y1="66" x2="10" y2="96" ${S}/>`);
  parts.push(`<ellipse cx="-14" cy="98" rx="7" ry="4" fill="#000"/>`, `<ellipse cx="14" cy="98" rx="7" ry="4" fill="#000"/>`);
  // arms
  const armDown = (sx) => `<line x1="${sx * 15}" y1="28" x2="${sx * 26}" y2="56" ${S}/><circle cx="${sx * 27}" cy="59" r="5" fill="#fff" ${S}/>`;
  const armUp = (sx) => `<line x1="${sx * 15}" y1="28" x2="${sx * 34}" y2="2" ${S}/><circle cx="${sx * 35}" cy="-1" r="5" fill="#fff" ${S}/>` +
    `<path d="M${sx * 44},-8 q${sx * 4},4 0,8 M${sx * 48},-14 q${sx * 7},8 0,16" fill="none" ${S} stroke-width="2"/>`;
  const armPoint = (sx) => `<line x1="${sx * 15}" y1="28" x2="${sx * 40}" y2="18" ${S}/><circle cx="${sx * 42}" cy="17" r="5" fill="#fff" ${S}/>`;
  const armHold = (sx) => `<line x1="${sx * 15}" y1="28" x2="${sx * 22}" y2="48" ${S}/><circle cx="${sx * 22}" cy="51" r="5" fill="#fff" ${S}/>`;
  const armFor = (side) => {
    if (wave === side) return armUp(side === 'r' ? 1 : -1);
    if (wave === 'point-' + side) return armPoint(side === 'r' ? 1 : -1);
    if (wave === 'hold') return armHold(side === 'r' ? 1 : -1);
    return armDown(side === 'r' ? 1 : -1);
  };
  parts.push(armFor('l'), armFor('r'));
  // body
  if (hair === 'girl' || hair === 'woman') {
    parts.push(`<path d="M-12,18 L12,18 L28,70 L-28,70 Z" fill="#fff" ${S}/>`);
    parts.push(`<path d="M-20,56 L20,56" ${S} stroke-width="2" stroke-dasharray="2 5"/>`);
  } else {
    parts.push(`<rect x="-18" y="18" width="36" height="50" rx="9" fill="#fff" ${S}/>`);
    parts.push(`<path d="M-7,18 L0,27 L7,18" fill="none" ${S} stroke-width="2"/>`);
    if (hair === 'man') parts.push(`<path d="M0,27 L-4,34 L0,50 L4,34 Z" fill="#000"/>`);
    else parts.push(`<path d="M-18,40 H18" ${S} stroke-width="2"/>`);
  }
  // hair behind head
  if (hair === 'girl') parts.push(`<circle cx="-23" cy="-4" r="8" fill="#000"/><circle cx="23" cy="-4" r="8" fill="#000"/>`);
  if (hair === 'woman') parts.push(`<circle cx="0" cy="-24" r="10" fill="#000"/>`);
  // head
  parts.push(`<circle cx="0" cy="0" r="20" fill="#fff" ${S}/>`);
  // hair on top
  const top = {
    boy: 'M-20,-2 Q-22,-25 0,-23 Q22,-25 20,-2 Q15,-13 8,-11 L4,-17 L-1,-11 L-6,-17 L-10,-11 Q-16,-13 -20,-2 Z',
    girl: 'M-20,0 Q-20,-24 0,-22 Q20,-24 20,0 Q12,-12 0,-12 Q-12,-12 -20,0 Z',
    woman: 'M-20,0 Q-20,-24 0,-22 Q20,-24 20,0 Q14,-10 2,-14 Q-10,-10 -20,0 Z',
    man: 'M-20,-4 Q-20,-23 0,-22 Q20,-23 20,-4 Q16,-14 0,-14 Q-16,-14 -20,-4 Z',
  }[hair];
  parts.push(`<path d="${top}" fill="#000"/>`);
  if (hair === 'girl') parts.push(`<path d="M10,-20 l8,-6 l0,10 Z M10,-20 l-2,-9 l9,3 Z" fill="#fff" ${S} stroke-width="2"/>`);
  // face
  if (closedEyes) parts.push(`<path d="M-10,0 q3,3 6,0 M4,0 q3,3 6,0" fill="none" ${S} stroke-width="2"/>`);
  else parts.push(`<circle cx="-7" cy="-1" r="2.6" fill="#000"/><circle cx="7" cy="-1" r="2.6" fill="#000"/>`);
  if (hair === 'man') parts.push(`<path d="M-8,7 Q0,3 8,7" fill="none" ${S} stroke-width="3"/>`);
  if (mouth === 'open') parts.push(`<path d="M-6,8 Q0,17 6,8 Z" fill="#000"/>`);
  else parts.push(`<path d="M-6,${hair === 'man' ? 11 : 8} Q0,${hair === 'man' ? 16 : 14} 6,${hair === 'man' ? 11 : 8}" fill="none" ${S} stroke-width="2"/>`);
  parts.push(`<circle cx="-12" cy="6" r="2.5" fill="none" stroke="#000" stroke-width="1"/><circle cx="12" cy="6" r="2.5" fill="none" stroke="#000" stroke-width="1"/>`);
  const t = `translate(${x},${y}) scale(${flip ? -s : s},${s})`;
  return `<g transform="${t}">${parts.join('')}</g>`;
}

function sun(x, y, r = 18, face = true) {
  let rays = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    rays += `<line x1="${x + Math.cos(a) * (r + 5)}" y1="${y + Math.sin(a) * (r + 5)}" x2="${x + Math.cos(a) * (r + 13)}" y2="${y + Math.sin(a) * (r + 13)}" ${S}/>`;
  }
  const f = face ? `<circle cx="${x - 6}" cy="${y - 3}" r="2" fill="#000"/><circle cx="${x + 6}" cy="${y - 3}" r="2" fill="#000"/><path d="M${x - 6},${y + 5} Q${x},${y + 10} ${x + 6},${y + 5}" fill="none" ${S} stroke-width="2"/>` : '';
  return rays + `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/>` + f;
}
function halfSun(x, y, r = 22) { // setting / rising sun on horizon y
  let rays = '';
  for (let i = 1; i < 6; i++) {
    const a = Math.PI + (i * Math.PI) / 6;
    rays += `<line x1="${x + Math.cos(a) * (r + 5)}" y1="${y + Math.sin(a) * (r + 5)}" x2="${x + Math.cos(a) * (r + 14)}" y2="${y + Math.sin(a) * (r + 14)}" ${S}/>`;
  }
  return rays + `<path d="M${x - r},${y} A${r},${r} 0 0 1 ${x + r},${y} Z" fill="#fff" ${S}/>`;
}
function moon(x, y, r = 16) {
  return `<path d="M${x},${y - r} A${r},${r} 0 1 0 ${x + r * 0.9},${y + r * 0.45} A${r * 0.8},${r * 0.8} 0 1 1 ${x},${y - r} Z" fill="#000"/>`;
}
function star(x, y, r = 6) {
  let p = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    p += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`;
  }
  return `<path d="${p}Z" fill="#000"/>`;
}
function clock(x, y, r, h, m, label = false) {
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    const len = i % 3 === 0 ? 0.78 : 0.86;
    ticks += `<line x1="${x + Math.sin(a) * r * len}" y1="${y - Math.cos(a) * r * len}" x2="${x + Math.sin(a) * r * 0.95}" y2="${y - Math.cos(a) * r * 0.95}" stroke="#000" stroke-width="${i % 3 === 0 ? 3 : 2}" stroke-linecap="round"/>`;
  }
  let nums = '';
  if (label) {
    for (let i = 1; i <= 12; i++) {
      const a = (i * Math.PI) / 6;
      nums += `<text x="${x + Math.sin(a) * r * 0.64}" y="${y - Math.cos(a) * r * 0.64 + r * 0.07}" font-family="Arial" font-weight="bold" font-size="${r * 0.2}" text-anchor="middle">${i}</text>`;
    }
    ticks = '';
  }
  const ha = ((h % 12) + m / 60) * (Math.PI / 6);
  const ma = (m / 60) * 2 * Math.PI;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S} stroke-width="4"/>` + ticks + nums +
    `<line x1="${x}" y1="${y}" x2="${x + Math.sin(ha) * r * 0.45}" y2="${y - Math.cos(ha) * r * 0.45}" stroke="#000" stroke-width="5" stroke-linecap="round"/>` +
    `<line x1="${x}" y1="${y}" x2="${x + Math.sin(ma) * r * 0.75}" y2="${y - Math.cos(ma) * r * 0.75}" stroke="#000" stroke-width="3" stroke-linecap="round"/>` +
    `<circle cx="${x}" cy="${y}" r="3.5" fill="#000"/>`;
}
function table(x, y, w, h = 14) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#fff" ${S}/>` +
    `<line x1="${x + 12}" y1="${y + h}" x2="${x + 12}" y2="${y + h + 40}" ${S}/><line x1="${x + w - 12}" y1="${y + h}" x2="${x + w - 12}" y2="${y + h + 40}" ${S}/>`;
}
function bowl(x, y, steam = true, food = 'rice') {
  let s = '';
  if (steam) s += `<path d="M${x - 8},${y - 12} q-5,-7 0,-14 q5,-7 0,-14 M${x + 6},${y - 12} q-5,-7 0,-14 q5,-7 0,-14" fill="none" ${S} stroke-width="2"/>`;
  if (food === 'rice') s += `<path d="M${x - 17},${y} Q${x},${y - 14} ${x + 17},${y} Z" fill="#fff" ${S} stroke-width="2"/>`;
  s += `<path d="M${x - 20},${y} H${x + 20} Q${x + 18},${y + 20} ${x},${y + 20} Q${x - 18},${y + 20} ${x - 20},${y} Z" fill="#fff" ${S}/>`;
  s += `<path d="M${x - 12},${y + 8} H${x + 12}" ${S} stroke-width="2" stroke-dasharray="3 4"/>`;
  return s;
}
function chopsticks(x, y) { return `<line x1="${x}" y1="${y}" x2="${x + 30}" y2="${y - 30}" ${S}/><line x1="${x + 6}" y1="${y}" x2="${x + 36}" y2="${y - 28}" ${S}/>`; }
function plateEgg(x, y) {
  return `<ellipse cx="${x}" cy="${y}" rx="28" ry="9" fill="#fff" ${S}/>` +
    `<path d="M${x - 18},${y - 2} q2,-10 12,-8 q8,-6 16,2 q8,4 -2,9 q-14,4 -26,-3 Z" fill="#fff" ${S} stroke-width="2"/>` +
    `<ellipse cx="${x}" cy="${y - 4}" rx="6" ry="4" fill="#000"/>`;
}
function glass(x, y, label = '') {
  return `<path d="M${x - 11},${y - 36} L${x + 11},${y - 36} L${x + 8},${y} L${x - 8},${y} Z" fill="#fff" ${S}/>` +
    `<path d="M${x - 10},${y - 26} L${x + 10},${y - 26}" ${S} stroke-width="2"/>` +
    (label ? `<text x="${x}" y="${y - 8}" font-family="Arial" font-weight="bold" font-size="8" text-anchor="middle">${label}</text>` : '');
}
function toast(x, y) {
  return `<path d="M${x - 14},${y} V${y - 22} q-6,-12 6,-14 q8,-6 16,0 q12,2 6,14 V${y} Z" fill="#fff" ${S}/>` +
    `<path d="M${x - 8},${y - 6} h4 M${x + 2},${y - 14} h4 M${x + 4},${y - 4} h4" ${S} stroke-width="2"/>`;
}
function windowFrame(x, y, w, h, inner = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" ${S}/>` + inner +
    `<line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" ${S}/><line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" ${S}/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" ${S} stroke-width="4"/>`;
}
function cloud(x, y, s = 1) {
  return `<path transform="translate(${x},${y}) scale(${s})" d="M-30,10 q-12,0 -10,-12 q2,-12 16,-9 q4,-14 20,-12 q14,2 14,14 q14,-2 14,10 q0,10 -12,9 Z" fill="#fff" ${S} stroke-width="2.5"/>`;
}
function bird(x, y) { return `<path d="M${x - 8},${y} q4,-6 8,0 q4,-6 8,0" fill="none" ${S} stroke-width="2"/>`; }
function tree(x, y) {
  return `<rect x="${x - 5}" y="${y - 40}" width="10" height="40" fill="#fff" ${S}/>` +
    `<path d="M${x - 26},${y - 40} q-10,-20 6,-30 q4,-20 22,-16 q18,-6 22,14 q14,10 2,32 Z" fill="#fff" ${S}/>`;
}
function house(x, y, litWindow = false) {
  return `<rect x="${x}" y="${y - 60}" width="70" height="60" fill="#fff" ${S}/>` +
    `<path d="M${x - 8},${y - 58} L${x + 35},${y - 92} L${x + 78},${y - 58} Z" fill="#000" ${S}/>` +
    `<rect x="${x + 40}" y="${y - 34}" width="20" height="34" fill="#fff" ${S}/><circle cx="${x + 55}" cy="${y - 16}" r="2" fill="#000"/>` +
    `<rect x="${x + 10}" y="${y - 46}" width="20" height="20" fill="${litWindow ? '#fff' : '#000'}" ${S}/>` +
    (litWindow ? `<path d="M${x + 6},${y - 52} l-6,-6 M${x + 34},${y - 52} l6,-6 M${x + 20},${y - 52} v-6" ${S} stroke-width="2"/>` : '');
}
const ground = (y = 178) => `<line x1="8" y1="${y}" x2="292" y2="${y}" ${S}/>`;
const grass = (xs, y = 178) => xs.map((x) => `<path d="M${x},${y} l-3,-7 M${x},${y} l0,-9 M${x},${y} l3,-7" ${S} stroke-width="2"/>`).join('');

function svg(inner) {
  inner = inner.replace(/stroke-width="3"( stroke-linecap="round" stroke-linejoin="round")([^>]*?) stroke-width="([\d.]+)"/g, 'stroke-width="$3"$1$2');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="300" height="200">` +
    `<rect x="0" y="0" width="300" height="200" fill="#fff"/>${inner}</svg>`;
}

module.exports = {
  S, person, sun, halfSun, moon, star, clock, table, bowl, chopsticks, plateEgg, glass, toast,
  windowFrame, cloud, bird, tree, house, ground, grass, svg,
};
