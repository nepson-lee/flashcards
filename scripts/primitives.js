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

// ---------- school objects ----------
// Closed book centred at (x, y), with a black spine on the left.
function book(x, y, w = 40, h = 30, title = true) {
  return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="3" fill="#fff" ${S}/>` +
    `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w * 0.18}" height="${h}" rx="2" fill="#000"/>` +
    (title ? `<path d="M${x - w * 0.15},${y - h * 0.18} H${x + w * 0.32} M${x - w * 0.15},${y + h * 0.1} H${x + w * 0.2}" ${S} stroke-width="2"/>` : '');
}
// Open book lying flat, centred at (x, y).
function openBook(x, y, w = 60) {
  const h = w * 0.45;
  return `<path d="M${x},${y - h / 2 + 4} Q${x - w * 0.25},${y - h / 2 - 4} ${x - w / 2},${y - h / 2} V${y + h / 2} Q${x - w * 0.25},${y + h / 2 - 6} ${x},${y + h / 2} Z" fill="#fff" ${S}/>` +
    `<path d="M${x},${y - h / 2 + 4} Q${x + w * 0.25},${y - h / 2 - 4} ${x + w / 2},${y - h / 2} V${y + h / 2} Q${x + w * 0.25},${y + h / 2 - 6} ${x},${y + h / 2} Z" fill="#fff" ${S}/>` +
    [0.15, 0.35, 0.55].map((f) => `<path d="M${x - w * 0.4},${y - h / 2 + h * f + 4} H${x - w * 0.1} M${x + w * 0.1},${y - h / 2 + h * f + 4} H${x + w * 0.4}" ${S} stroke-width="1.5"/>`).join('');
}
// Pencil centred at (x, y), length len, rotated by angle degrees (0 = tip pointing right).
function pencil(x, y, len = 60, angle = 0) {
  const h = len * 0.16, b = len * 0.62;
  return `<g transform="translate(${x},${y}) rotate(${angle})">` +
    `<rect x="${-len / 2}" y="${-h / 2}" width="${len * 0.12}" height="${h}" rx="2" fill="#000"/>` +
    `<rect x="${-len / 2 + len * 0.12}" y="${-h / 2}" width="${len * 0.08}" height="${h}" fill="#fff" ${S} stroke-width="2"/>` +
    `<rect x="${-len / 2 + len * 0.2}" y="${-h / 2}" width="${b}" height="${h}" fill="#fff" ${S} stroke-width="2.5"/>` +
    `<line x1="${-len / 2 + len * 0.2}" y1="0" x2="${len * 0.32}" y2="0" ${S} stroke-width="1.5"/>` +
    `<path d="M${len * 0.32},${-h / 2} L${len / 2},0 L${len * 0.32},${h / 2} Z" fill="#fff" ${S} stroke-width="2.5"/>` +
    `<path d="M${len * 0.44},${-h * 0.17} L${len / 2},0 L${len * 0.44},${h * 0.17} Z" fill="#000"/></g>`;
}
// Rubber eraser centred at (x, y), half covered by a black sleeve.
function eraser(x, y, w = 30, h = 16, angle = 0) {
  return `<g transform="translate(${x},${y}) rotate(${angle})">` +
    `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4" fill="#fff" ${S}/>` +
    `<rect x="${-w * 0.05}" y="${-h / 2}" width="${w * 0.55}" height="${h}" rx="2" fill="#000"/></g>`;
}
// Sheet of paper centred at (x, y) with a folded corner and optional writing lines.
function paper(x, y, w = 40, h = 52, lines = true, angle = 0) {
  const f = w * 0.25;
  return `<g transform="translate(${x},${y}) rotate(${angle})">` +
    `<path d="M${-w / 2},${-h / 2} H${w / 2 - f} L${w / 2},${-h / 2 + f} V${h / 2} H${-w / 2} Z" fill="#fff" ${S} stroke-width="2.5"/>` +
    `<path d="M${w / 2 - f},${-h / 2} V${-h / 2 + f} H${w / 2}" fill="none" ${S} stroke-width="2"/>` +
    (lines ? [0.15, 0.35, 0.55, 0.75].map((k) => `<line x1="${-w * 0.32}" y1="${-h / 2 + h * k + 4}" x2="${w * 0.32}" y2="${-h / 2 + h * k + 4}" ${S} stroke-width="1.5"/>`).join('') : '') +
    `</g>`;
}
// School desk: top surface at y, drawer box under it, legs down to y + 46.
function desk(x, y, w = 90) {
  return `<rect x="${x}" y="${y}" width="${w}" height="10" rx="2" fill="#fff" ${S}/>` +
    `<rect x="${x + 8}" y="${y + 10}" width="${w - 16}" height="16" fill="#fff" ${S} stroke-width="2.5"/>` +
    `<line x1="${x + 14}" y1="${y + 26}" x2="${x + 14}" y2="${y + 46}" ${S}/><line x1="${x + w - 14}" y1="${y + 26}" x2="${x + w - 14}" y2="${y + 46}" ${S}/>`;
}
// Side-view chair standing on floor y; seat faces right (pass flip=true to face left).
function chair(x, y, s = 1, flip = false) {
  return `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})">` +
    `<line x1="-18" y1="0" x2="-18" y2="-80" ${S} stroke-width="4"/>` +
    `<rect x="-24" y="-80" width="12" height="32" rx="4" fill="#fff" ${S}/>` +
    `<rect x="-20" y="-44" width="44" height="8" rx="2" fill="#fff" ${S}/>` +
    `<line x1="20" y1="-36" x2="20" y2="0" ${S} stroke-width="4"/><line x1="-16" y1="-36" x2="-16" y2="0" ${S}/></g>`;
}
// Backpack standing on floor y.
function backpack(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">` +
    `<path d="M-12,-70 q12,-16 24,0" fill="none" ${S} stroke-width="4"/>` +
    `<rect x="-26" y="-70" width="52" height="70" rx="16" fill="#fff" ${S}/>` +
    `<path d="M-26,-46 Q0,-56 26,-46" fill="none" ${S} stroke-width="2.5"/>` +
    `<rect x="-17" y="-30" width="34" height="24" rx="6" fill="#000"/>` +
    `<line x1="-10" y1="-22" x2="10" y2="-22" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>` +
    `<circle cx="0" cy="-58" r="2.5" fill="#000"/></g>`;
}
// Blackboard: black panel with white chalk text, top-left at (x, y).
function blackboard(x, y, w = 110, h = 60, text = 'ABC') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#000" ${S}/>` +
    `<rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" rx="2" fill="none" stroke="#fff" stroke-width="1.5"/>` +
    `<text x="${x + w / 2}" y="${y + h / 2 + 8}" font-family="Comic Sans MS, Arial" font-weight="bold" font-size="${Math.min(24, h * 0.4)}" fill="#fff" text-anchor="middle">${text}</text>` +
    `<line x1="${x + 4}" y1="${y + h + 4}" x2="${x + w - 4}" y2="${y + h + 4}" ${S}/>`;
}

// ---------- home objects ----------
// Spoon centred at (x, y), length len, rotated by angle degrees (0 = bowl pointing right).
function spoon(x, y, len = 50, angle = 0) {
  return `<g transform="translate(${x},${y}) rotate(${angle})">` +
    `<line x1="${-len / 2}" y1="0" x2="${len * 0.18}" y2="0" ${S} stroke-width="${Math.max(3, len * 0.08)}"/>` +
    `<ellipse cx="${len * 0.32}" cy="0" rx="${len * 0.18}" ry="${len * 0.12}" fill="#fff" ${S}/></g>`;
}
// Striped towel hanging from a rail; top-left of the towel at (x, y).
function towel(x, y, w = 40, h = 56, rail = true) {
  return (rail ? `<line x1="${x - 12}" y1="${y}" x2="${x + w + 12}" y2="${y}" ${S} stroke-width="4"/>` +
      `<circle cx="${x - 12}" cy="${y}" r="4" fill="#000"/><circle cx="${x + w + 12}" cy="${y}" r="4" fill="#000"/>` : '') +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#fff" ${S}/>` +
    `<rect x="${x}" y="${y + h * 0.62}" width="${w}" height="${h * 0.12}" fill="#000"/>` +
    `<path d="M${x + 3},${y + h + 4} v4 M${x + w * 0.35},${y + h + 4} v4 M${x + w * 0.65},${y + h + 4} v4 M${x + w - 3},${y + h + 4} v4" ${S} stroke-width="2"/>`;
}
// Sofa standing on floor y, left edge x, width w. Seat cushion top at y - 34.
// Draw sofaBack() before a sitting person and sofaFront() after, so the person sits in it.
function sofaBack(x, y, w = 130) {
  return `<rect x="${x + 10}" y="${y - 82}" width="${w - 20}" height="54" rx="10" fill="#fff" ${S}/>`;
}
function sofaFront(x, y, w = 130) {
  return `<rect x="${x + 10}" y="${y - 34}" width="${w - 20}" height="24" rx="5" fill="#fff" ${S}/>` +
    `<rect x="${x}" y="${y - 52}" width="20" height="44" rx="8" fill="#fff" ${S}/>` +
    `<rect x="${x + w - 20}" y="${y - 52}" width="20" height="44" rx="8" fill="#fff" ${S}/>` +
    `<rect x="${x + 8}" y="${y - 8}" width="7" height="8" fill="#000"/><rect x="${x + w - 15}" y="${y - 8}" width="7" height="8" fill="#000"/>`;
}
const sofa = (x, y, w = 130) => sofaBack(x, y, w) + sofaFront(x, y, w);
// Television on a low cabinet standing on floor y, centred at x.
function tv(x, y, w = 64) {
  const h = w * 0.62;
  return `<rect x="${x - w / 2 - 6}" y="${y - 30}" width="${w + 12}" height="30" fill="#fff" ${S}/>` +
    `<line x1="${x}" y1="${y - 30}" x2="${x}" y2="${y}" ${S} stroke-width="2"/>` +
    `<line x1="${x - 6}" y1="${y - 34}" x2="${x + 6}" y2="${y - 34}" ${S} stroke-width="5"/>` +
    `<rect x="${x - w / 2}" y="${y - 36 - h}" width="${w}" height="${h}" rx="4" fill="#000" ${S}/>` +
    `<path d="M${x - w / 2 + 8},${y - 36 - h + 12} l10,-6" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
}
// Cooking pot; (x, y) = centre of its bottom.
function pot(x, y, w = 50, steam = true) {
  return (steam ? `<path d="M${x - 10},${y - 38} q-6,-8 0,-16 q6,-8 0,-16 M${x + 8},${y - 38} q-6,-8 0,-16 q6,-8 0,-16" fill="none" ${S} stroke-width="2"/>` : '') +
    `<rect x="${x - w / 2}" y="${y - 30}" width="${w}" height="30" rx="5" fill="#fff" ${S}/>` +
    `<path d="M${x - w / 2},${y - 22} h-10 M${x + w / 2},${y - 22} h10" ${S} stroke-width="4"/>` +
    `<rect x="${x - w / 2 - 3}" y="${y - 34}" width="${w + 6}" height="6" rx="3" fill="#000"/>`;
}
// Kitchen stove standing on floor y, left edge x, width w; top surface at y - 70.
function stove(x, y, w = 90) {
  return `<rect x="${x}" y="${y - 70}" width="${w}" height="70" rx="3" fill="#fff" ${S}/>` +
    `<rect x="${x + 12}" y="${y - 46}" width="${w - 24}" height="36" rx="3" fill="#fff" ${S} stroke-width="2.5"/>` +
    `<line x1="${x + 22}" y1="${y - 40}" x2="${x + w - 22}" y2="${y - 40}" ${S} stroke-width="4"/>` +
    [0.25, 0.5, 0.75].map((f) => `<circle cx="${x + w * f}" cy="${y - 58}" r="4" fill="#000"/>`).join('');
}
// Bathtub standing on floor y, left edge x, width w; rim at y - 62.
function bathtub(x, y, w = 140) {
  return `<path d="M${x},${y - 58} H${x + w} V${y - 34} Q${x + w},${y - 10} ${x + w - 24},${y - 10} H${x + 24} Q${x},${y - 10} ${x},${y - 34} Z" fill="#fff" ${S}/>` +
    `<rect x="${x - 4}" y="${y - 62}" width="${w + 8}" height="8" rx="4" fill="#fff" ${S}/>` +
    `<path d="M${x + 22},${y - 10} l-6,10 M${x + w - 22},${y - 10} l6,10" ${S} stroke-width="4"/>`;
}
// Soap bubbles: list of [x, y, r].
const bubbles = (list) => list.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S} stroke-width="2"/>`).join('');
// Shower head on a pipe coming from the wall at (x, y), water falling down to y + drop.
function showerHead(x, y, drop = 110) {
  let water = '';
  for (let i = -2; i <= 2; i++) water += `<line x1="${x + 30 + i * 6}" y1="${y + 30}" x2="${x + 30 + i * 14}" y2="${y + drop}" stroke="#000" stroke-width="2" stroke-dasharray="6 8" stroke-linecap="round"/>`;
  return `<path d="M${x},${y} H${x + 30} V${y + 10}" fill="none" ${S} stroke-width="5"/>` +
    `<path d="M${x + 14},${y + 24} Q${x + 30},${y + 4} ${x + 46},${y + 24} Z" fill="#000" ${S}/>` + water;
}
// Bed seen from the side, standing on floor y, left edge x. A drawer sits under it;
// with drawerOpen it is pulled out towards the viewer and `inside` (items) shows above its front.
function bed(x, y, w = 150, drawerOpen = false, inside = '') {
  const dx = drawerOpen ? 18 : 0, dy = drawerOpen ? 10 : 0;
  return `<rect x="${x}" y="${y - 96}" width="12" height="96" rx="3" fill="#fff" ${S}/>` +
    `<rect x="${x + w - 12}" y="${y - 66}" width="12" height="66" rx="3" fill="#fff" ${S}/>` +
    `<rect x="${x + 12}" y="${y - 58}" width="${w - 24}" height="18" fill="#fff" ${S}/>` +
    `<ellipse cx="${x + 32}" cy="${y - 66}" rx="17" ry="9" fill="#fff" ${S}/>` +
    `<path d="M${x + 46},${y - 58} Q${x + 46},${y - 72} ${x + 64},${y - 70} H${x + w - 14} V${y - 58} Z" fill="#fff" ${S}/>` +
    `<rect x="${x + 12}" y="${y - 40}" width="${w - 24}" height="40" fill="#000"/>` +
    (drawerOpen ? `<path d="M${x + 24},${y - 36} H${x + w - 24} L${x + w - 24 + dx},${y - 30 + dy} H${x + 24 + dx} Z" fill="#fff" ${S}/>` + inside : '') +
    `<rect x="${x + 24 + dx}" y="${y - 32 + dy}" width="${w - 48}" height="${28 - dy / 2}" rx="2" fill="#fff" ${S}/>` +
    `<rect x="${x + w / 2 - 12 + dx}" y="${y - 21 + dy}" width="24" height="6" rx="3" fill="#000"/>`;
}
// Chest of drawers standing on floor y, left edge x. n drawers; openIndex (0 = top) is
// pulled out towards the viewer and `inside` (items drawn by the caller) shows in it.
function drawers(x, y, w = 80, h = 90, n = 3, openIndex = -1, inside = '') {
  const dh = (h - 8) / n;
  let s = `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="3" fill="#fff" ${S}/>`;
  for (let i = 0; i < n; i++) {
    if (i === openIndex) continue;
    const top = y - h + 4 + i * dh;
    s += `<rect x="${x + 4}" y="${top}" width="${w - 8}" height="${dh - 4}" rx="2" fill="#fff" ${S} stroke-width="2.5"/>` +
      `<rect x="${x + w / 2 - 10}" y="${top + dh / 2 - 5}" width="20" height="6" rx="3" fill="#000"/>`;
  }
  if (openIndex >= 0) { // drawn last so it sits in front of the drawer below it
    const top = y - h + 4 + openIndex * dh;
    s += `<rect x="${x + 4}" y="${top}" width="${w - 8}" height="${dh - 4}" fill="#000"/>` +
      `<path d="M${x + 4},${top + 4} H${x + w - 4} L${x + w + 8},${top + 20} H${x - 8} Z" fill="#fff" ${S}/>` +
      inside +
      `<rect x="${x - 8}" y="${top + 20}" width="${w + 16}" height="${dh - 4}" rx="2" fill="#fff" ${S}/>` +
      `<rect x="${x + w / 2 - 10}" y="${top + 20 + dh / 2 - 5}" width="20" height="6" rx="3" fill="#000"/>`;
  }
  return s;
}
// Musical note; (x, y) = note head.
const note = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="6" ry="4.5" fill="#000" transform="rotate(-20)"/><path d="M5,-2 V-24 q6,4 10,10" fill="none" ${S} stroke-width="2.5"/></g>`;
// Thin square wall tiles filling the rectangle (x, y, w, h).
function tiles(x, y, w, h, step = 24) {
  let s = '';
  for (let tx = x + step; tx < x + w; tx += step) s += `<line x1="${tx}" y1="${y}" x2="${tx}" y2="${y + h}" stroke="#000" stroke-width="1"/>`;
  for (let ty = y + step; ty < y + h; ty += step) s += `<line x1="${x}" y1="${ty}" x2="${x + w}" y2="${ty}" stroke="#000" stroke-width="1"/>`;
  return s;
}

function svg(inner) {
  inner = inner.replace(/stroke-width="3"( stroke-linecap="round" stroke-linejoin="round")([^>]*?) stroke-width="([\d.]+)"/g, 'stroke-width="$3"$1$2');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="300" height="200">` +
    `<rect x="0" y="0" width="300" height="200" fill="#fff"/>${inner}</svg>`;
}

module.exports = {
  S, person, sun, halfSun, moon, star, clock, table, bowl, chopsticks, plateEgg, glass, toast,
  windowFrame, cloud, bird, tree, house, ground, grass, svg,
  book, openBook, pencil, eraser, paper, desk, chair, backpack, blackboard,
  spoon, towel, sofa, sofaBack, sofaFront, tv, pot, stove, bathtub, bubbles, showerHead, bed, drawers, note, tiles,
};
