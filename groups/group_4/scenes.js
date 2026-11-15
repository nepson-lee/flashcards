// Scenes for group_4 (people and food). Keys must match the "word" field in cards.json.
// Style: 宮崎駿畫風 — see scripts/styles/ghibli.js for how the style is drawn
// (realistic proportions, big gentle eyes, inked tube limbs, cumulus clouds, leafy trees,
// wooden rooms, hatching instead of grey). Original characters only.
const { svg } = require('../../scripts/primitives');
const {
  L, figure, hand, cloudG, treeG, grassG, groundG, room, windowG, steamG, clothTableG,
  plateG, riceBowlG, noodleBowlG, fishG, bunG, steamerG, mugG, beefPlateG, sinkG, bubblesG, moonG, leaves,
} = require('../../scripts/styles/ghibli');

const G = 186; // ground / floor line
const skyWindow = (x, y, w, h) => windowG(x, y, w, h, cloudG(x + w / 2, y + h / 2 + 4, 0.38));

module.exports = {
  // Boy climbing a big tree; Amy points up at him, Mom watches.
  boy: svg(
    cloudG(238, 34, 0.8) +
    groundG(G) + grassG([20, 60, 190, 240, 286], G) +
    treeG(98, G, 1, true) +
    figure({ x: 102, y: 150, s: 0.74, body: 'boy', legs: 'climb', armL: 'up', armR: 'up', mouth: 'open' }) +
    figure({ x: 206, y: G, s: 0.9, body: 'girl', hair: 'pigtails', armL: 'pointUp', mouth: 'open', look: -1 }) +
    figure({ x: 266, y: G, s: 1.2, body: 'woman', hair: 'bun', armR: 'hip', look: -1 })
  ),
  // A girl with long hair blowing in the wind in a meadow; Ben points at her.
  girl: svg(
    cloudG(84, 36, 0.75) + cloudG(250, 26, 0.6) +
    `<path d="M6,150 Q90,126 170,140 T294,132" fill="none" ${L(1.6)}/>` +
    groundG(G) + grassG([30, 110, 200, 236, 280], G) + grassG([140, 260], 146) +
    figure({ x: 60, y: G, s: 0.95, body: 'boy', armR: 'point', mouth: 'open', look: 1 }) +
    figure({ x: 178, y: G, s: 1.12, body: 'girl', hair: 'long', wind: 6, armR: 'hip' }) +
    `<path d="M228,80 q10,-4 20,0 M232,92 q12,-4 24,0 M226,104 q8,-3 16,0" fill="none" ${L(1.4)}/>`
  ),
  // Tony catches a fish at the river; Dad cheers.
  fish: svg(
    cloudG(250, 30, 0.7) +
    `<path d="M6,${G} H150 Q168,${G} 176,166" fill="none" ${L(2.4)}/>` +
    `<path d="M176,166 q7,-4 14,0 t14,0 t14,0 t14,0 t14,0 t14,0 t14,0 t14,0" fill="none" ${L(2)}/>` +
    `<path d="M192,178 q8,-4 16,0 t16,0 M240,176 q8,-4 16,0 t16,0 M216,188 q8,-4 16,0 M268,190 q8,-4 16,0" fill="none" ${L(1.2)}/>` +
    `<path d="M158,${G} q-2,-26 4,-40 M163,${G - 2} q2,-22 10,-32 M152,${G} q-4,-18 -12,-26" fill="none" ${L(1.6)}/>` +
    `<ellipse cx="162" cy="144" rx="2.5" ry="7" fill="#000"/>` +
    grassG([20, 60], G) +
    figure({ x: 48, y: G, s: 1.22, body: 'man', hair: 'man', armR: 'wave', mouth: 'open', glasses: true }) +
    figure({ x: 122, y: G, s: 1, body: 'boy', armL: 'hold', armR: 'hold', mouth: 'open', look: 1 }) +
    `<path d="M120,126 L206,40" ${L(3)}/><path d="M206,40 L223,95" ${L(1)}/>` +
    fishG(234, 114, 1, 60) +
    `<path d="M222,158 q-4,-8 -10,-10 M246,158 q4,-8 10,-10 M234,160 v-12" fill="none" ${L(1.4)}/>` +
    bubblesG([[212, 142, 2.5], [254, 138, 2], [244, 148, 2.5]])
  ),
  // Ben eats a steamed pork bun in a wooden kitchen; Mom asks from the side.
  pork: svg(
    room(G) + skyWindow(40, 22, 70, 52) +
    figure({ x: 176, y: G, s: 1, body: 'boy', armL: 'hold', armR: 'mouth', mouth: 'eat', closedEyes: true }) +
    bunG(184, 104, 18) +
    clothTableG(64, 128, 150, G) +
    steamerG(112, 128, 74, 3) + steamG(104, 96) +
    figure({ x: 264, y: G, s: 1.2, body: 'woman', hair: 'bun', armL: 'point', mouth: 'open', look: -1 })
  ),
  // Dinner: Mom brings a plate of beef; Tony at the table is happy. Moon in the window.
  beef: svg(
    room(G) + windowG(30, 20, 66, 50, moonG(52, 40, 10) + `<circle cx="80" cy="34" r="1.5" fill="#000"/><circle cx="70" cy="56" r="1.5" fill="#000"/>`) +
    figure({ x: 108, y: G, s: 1, body: 'boy', armL: 'chest', armR: 'chest', mouth: 'open', look: 1 }) +
    clothTableG(52, 132, 120, G) + riceBowlG(84, 126, 26, true) + plateG(132, 130, 18) +
    figure({ x: 236, y: G, s: 1.2, body: 'woman', hair: 'bun', armL: 'forward', look: -1 }) +
    beefPlateG(188, 104, 26) + steamG(186, 88)
  ),
  // Mary holds her cup with a little cat on it; Amy points at it.
  cup: svg(
    room(G) + skyWindow(196, 18, 72, 52) +
    figure({ x: 106, y: G, s: 1.05, body: 'girl', hair: 'bob', armL: 'chest', armR: 'chest' }) +
    mugG(108, 130, 30, true) +
    figure({ x: 214, y: G, s: 1, body: 'girl', hair: 'pigtails', armL: 'point', mouth: 'open', look: -1 })
  ),
  // Amy washes a plate at the sink; Dad points at her.
  plate: svg(
    room(G) + skyWindow(170, 14, 76, 50) +
    figure({ x: 206, y: G, s: 1, body: 'girl', hair: 'pigtails', armL: 'hold', armR: 'hold', look: -1 }) +
    sinkG(146, 126, 124) +
    `<ellipse cx="206" cy="122" rx="15" ry="15" fill="#fff" ${L(2.2)}/><ellipse cx="206" cy="122" rx="9.5" ry="9.5" fill="none" ${L(1.1)}/>` +
    bubblesG([[188, 112, 5], [224, 114, 4], [180, 122, 3], [230, 124, 3.5], [196, 106, 2.5]]) +
    figure({ x: 70, y: G, s: 1.24, body: 'man', hair: 'man', armR: 'point', glasses: true, mouth: 'open', look: 1 })
  ),
  // Dad eats beef noodles with chopsticks; Amy asks him.
  noodles: svg(
    room(G) + skyWindow(196, 18, 74, 50) +
    figure({ x: 152, y: G, s: 1.24, body: 'man', hair: 'man', armL: 'hold', armR: 'mouth', glasses: true, mouth: 'eat' }) +
    clothTableG(96, 120, 140, G) + noodleBowlG(146, 118, 44, true) + steamG(196, 108) +
    figure({ x: 52, y: G, s: 0.95, body: 'girl', hair: 'pigtails', armR: 'point', mouth: 'open', look: 1 })
  ),
  // Lunch: Mom brings Ben a bowl of rice.
  rice: svg(
    room(G) + skyWindow(28, 16, 72, 52) +
    figure({ x: 120, y: G, s: 1, body: 'boy', armL: 'chest', armR: 'chest', mouth: 'open', look: 1 }) +
    clothTableG(64, 134, 120, G) + plateG(96, 132, 16) + plateG(150, 132, 16) +
    figure({ x: 248, y: G, s: 1.2, body: 'woman', hair: 'bun', armL: 'forward', look: -1 }) +
    riceBowlG(202, 102, 32, true) + steamG(202, 82)
  ),
};
