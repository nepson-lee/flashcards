// Scenes for group_7 (feelings and kindness). Keys must match the "word" field in cards.json.
// Style: 請使用下列動物做對話的主角, 並使用童話故事的風格 (Mrs. Rabbit, Little Bunny, Miss Butterfly,
// Mr. Squirrel, Little Pony) — a picture-book fairy-tale look; see scripts/styles/fairytale.js:
// soft rounded storybook animals with big shiny eyes and blush hatching, a storybook frame with
// leafy corner curls around every picture, meadow backgrounds (rolling hills, daisies, toadstools,
// a mushroom cottage, round fruit trees), little hearts and sparkles for feelings. #000/#fff only.
// Original characters only (no Peter Rabbit, no My Little Pony).
const { svg } = require('../../scripts/primitives');
const {
  L, rabbit, pony, butterfly, squirrel,
  flowerHead, daisyG, carrotG, heartG, sparkG, tearG, painG, toadstoolG, fruitTreeG, mushroomHouseG,
  hillsG, grassTuftsG, groundG, cloudG, sunG, frameG, bubbleG,
} = require('../../scripts/styles/fairytale');

const G = 180; // ground line

const meadow = (tufts = [30, 120, 200, 270]) => hillsG(G) + groundG(G) + grassTuftsG(G, tufts);
const medal = (x, y) =>
  `<path d="M${x - 6},${y - 16} L${x},${y - 4} L${x + 6},${y - 16}" fill="#fff" ${L(1.6)}/>` +
  `<circle cx="${x}" cy="${y + 2}" r="7" fill="#fff" ${L(1.8)}/>` +
  `<path d="M${x},${y - 3} l1.5,3 3.3,0.4 -2.4,2.3 0.6,3.3 -3,-1.6 -3,1.6 0.6,-3.3 -2.4,-2.3 3.3,-0.4 Z" fill="#000"/>`;
const stone = (x, y) =>
  `<path d="M${x - 12},${y} Q${x - 12},${y - 10} ${x - 2},${y - 11} Q${x + 12},${y - 10} ${x + 12},${y} Z" fill="#fff" ${L(1.8)}/>` +
  `<path d="M${x - 5},${y - 6} q3,-2 6,0" fill="none" ${L(1)}/>`;
const bump = (x, y) => // a little "ouch" burst
  `<path d="M${x},${y - 10} l3,6 6,-3 -2,7 7,2 -7,3 3,6 -7,-2 -3,7 -3,-7 -7,2 3,-6 -7,-3 7,-2 -2,-7 6,3 Z" fill="#fff" ${L(1.4)}/>`;
const note = (x, y) => `<path d="M${x},${y} v-12 l7,3" fill="none" ${L(1.6)}/><ellipse cx="${x - 2.5}" cy="${y}" rx="3.2" ry="2.3" fill="#000"/>`;

module.exports = {
  // Miss Butterfly flies in with a flower for Mrs. Rabbit, who reaches out to take it.
  kind: svg(
    meadow([40, 130, 210]) + mushroomHouseG(250, G, 1.1) + daisyG(28, G, 16) + daisyG(205, G, 14) +
    cloudG(60, 34, 0.9) +
    rabbit({ who: 'mom', x: 100, y: G, armR: 'reach', armL: 'heart', look: 1, f: 'happy', m: 'open' }) +
    butterfly({ x: 178, y: 92, dir: -1, flower: true, s: 1.1 }) +
    heartG(150, 50, 5) + heartG(166, 40, 3.5) +
    frameG(),
  ),

  // Little Pony with a bandaged leg looks sad; Mrs. Rabbit asks. Bubble: the stone he fell over.
  happen: svg(
    meadow([30, 120, 250]) + fruitTreeG(40, G, 0.95) + toadstoolG(268, G, 0.8) +
    rabbit({ who: 'mom', x: 92, y: G, armR: 'reach', armL: 'down', look: 1, f: 'sad', m: 'open' }) +
    pony({ x: 205, y: G, dir: -1, s: 0.85, bandage: true, f: 'sad', m: 'wobbly' }) + tearG(158, 112) +
    bubbleG(238, 44, 76, 46, 214, 82, stone(238, 58) + bump(232, 38) + `<path d="M250,30 q6,6 4,14 M256,30 q6,6 4,14" fill="none" ${L(1.4)}/>`) +
    frameG(),
  ),

  // Little Pony lifts his sore, bandaged leg (ouch marks); Mrs. Rabbit worries, paw on her chest.
  hurt: svg(
    meadow([30, 140, 250]) + daisyG(30, G, 16) + daisyG(270, G, 14) + sunG(260, 36, 10) +
    rabbit({ who: 'mom', x: 88, y: G, armR: 'reach', armL: 'heart', look: 1, f: 'sad', m: 'open' }) +
    pony({ x: 200, y: G, dir: -1, s: 0.85, legs: 'lift', bandage: true, f: 'pain', m: 'wobbly' }) +
    `<path d="M152,146 l-7,-5 M148,158 h-9 M152,170 l-7,5" fill="none" ${L(1.8)}/>` +
    frameG(),
  ),

  // Little Bunny asks Mom; Mom remembers him giving Miss Butterfly a flower (thought bubble).
  something: svg(
    meadow([30, 150, 260]) + toadstoolG(30, G, 0.8) + daisyG(268, G, 14) +
    rabbit({ who: 'bunny', x: 92, y: G, armL: 'hold', armR: 'hold', look: 1, f: 'happy', m: 'open' }) +
    rabbit({ who: 'mom', x: 200, y: G, dir: -1, armR: 'heart', look: 1, f: 'happy', m: 'open' }) +
    bubbleG(112, 40, 112, 56, 160, 80,
      rabbit({ who: 'bunny', x: 90, y: 64, s: 0.4, armR: 'reach', look: 1 }) +
      butterfly({ x: 134, y: 40, s: 0.52, dir: -1, flower: true }) + daisyG(110, 44, 0, 3.2)) +
    frameG(),
  ),

  // Mrs. Rabbit hugs her two little bunnies; hearts float up.
  always: svg(
    meadow([30, 260]) + mushroomHouseG(40, G, 0.9) + sunG(262, 36, 10) +
    rabbit({ who: 'mom', x: 150, y: G, armL: 'hug', armR: 'hug', f: 'closed', m: 'smile' }) +
    rabbit({ who: 'bunny', x: 108, y: G, s: 0.85, armR: 'wave', look: 1, f: 'happy', m: 'open' }) +
    rabbit({ who: 'bunny', x: 194, y: G, s: 0.85, dir: -1, armR: 'heart', look: 1, f: 'closed', m: 'smile' }) +
    heartG(150, 30, 6, '#000') + heartG(122, 46, 4.5) + heartG(178, 44, 4.5) +
    frameG(),
  ),

  // Little Pony, bandage on his leg, gets a star medal; Mrs. Rabbit claps, Mr. Squirrel waves.
  brave: svg(
    meadow([30, 140, 230]) + toadstoolG(32, G, 0.8) +
    rabbit({ who: 'mom', x: 78, y: G, armL: 'clap', armR: 'clap', look: 1, f: 'happy', m: 'open' }) +
    pony({ x: 190, y: G, dir: -1, s: 0.85, bandage: true, f: 'happy', m: 'open' }) +
    medal(158, 132) +
    squirrel({ x: 264, y: G, dir: -1, s: 0.8, armR: 'wave', m: 'open' }) +
    sparkG(140, 40, 7) + sparkG(124, 60, 4) + sparkG(196, 36, 5) +
    frameG(),
  ),

  // A carrot lies on the grass; Little Bunny bends to pick it up for Little Pony.
  'pick up': svg(
    meadow([30, 100, 270]) + fruitTreeG(42, G, 0.95) +
    `<path d="M70,${G} q4,-8 8,0 M84,${G} q4,-8 8,0" fill="none" ${L(1.4)}/>` +
    rabbit({ who: 'bunny', x: 122, y: G, armR: 'low', armL: 'down', look: 1, f: 'happy', m: 'smile' }) +
    carrotG(170, 172, 0.9, -80) +
    pony({ x: 236, y: G, dir: -1, s: 0.85, f: 'happy', m: 'open', look: -1 }) +
    frameG(),
  ),

  // Little Bunny hops for joy among sparkles; Mrs. Rabbit asks how he feels.
  feel: svg(
    meadow([40, 150, 260]) + sunG(46, 40, 11) + cloudG(240, 36, 0.8) + daisyG(150, G, 14) + daisyG(30, G, 16) +
    rabbit({ who: 'bunny', x: 100, y: G - 8, hop: true, armL: 'up', armR: 'up', f: 'closed', m: 'open' }) +
    `<path d="M88,${G - 2} q12,4 24,0" fill="none" ${L(1.2)}/>` +
    rabbit({ who: 'mom', x: 214, y: G, dir: -1, armR: 'heart', armL: 'down', look: 1, f: 'happy', m: 'open' }) +
    sparkG(62, 86, 6) + sparkG(146, 76, 7) + sparkG(140, 104, 4) + note(70, 66) + note(150, 50) +
    frameG(),
  ),

  // Mrs. Rabbit gives Little Bunny a big hug; hearts all around.
  hug: svg(
    meadow([30, 260]) + mushroomHouseG(258, G, 0.9) + daisyG(30, G, 16) +
    rabbit({ who: 'mom', x: 162, y: G, dir: -1, armL: 'hug', armR: 'hug', f: 'closed', m: 'smile' }) +
    rabbit({ who: 'bunny', x: 134, y: G, dir: -1, armL: 'hug', armR: 'hug', look: 1, f: 'closed', m: 'open' }) +
    heartG(150, 34, 7, '#000') + heartG(112, 52, 4.5) + heartG(196, 46, 5) + heartG(90, 76, 3.5) +
    frameG(),
  ),
};
