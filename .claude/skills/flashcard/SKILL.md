---
name: flashcard
description: 產生英文單字卡 Word 檔。讀取 英文單字清單.txt 中指定的 group (例如 /flashcard group_1)，為每個單字寫日常生活對話例句、畫黑白卡通圖，輸出撲克牌大小、可剪下的單字卡 .docx。Use when the user asks to make vocabulary flashcards for a word-list group.
argument-hint: <group, e.g. group_1>
---

# /flashcard — build vocabulary flashcards for one group

Argument: `$ARGUMENTS` — a group name such as `group_1` (also `1` or `Flashcards_group_1`). If empty, run `node scripts/list-words.js x` to show the available groups and ask which one.

All paths are relative to the repo root. Run `npm install` first if `node_modules/` is missing.

## Steps

1. **Read the word list**
   `node scripts/list-words.js $ARGUMENTS` → `{ "group": "group_N", "words": [...], "examples": [[q, a], ...], "notes": [...], "style": "..." }`. Use the normalized `group` value from here on.
   - `examples` comes from an optional `[對話範例]` (or `對話範例:`) section after the group's words in `英文單字清單.txt` (each `* question` bullet plus the indented answer line(s) under it). `notes` holds any free-text instructions written there (e.g. `請依照下列的句型來設計對話.`) — follow them. Both are empty when the group has no such section.
   - `style` comes from an optional `[圖像風格]` (or `圖像風格:`) section: the picture style the user wants for this group (e.g. `宮崎駿畫風`). Empty means the default style. See step 3.

2. **Write `groups/<group>/cards.json`** — one entry per word, in list order:
   `{ "word": "...", "zh": "繁體中文意思", "lines": [["Name", "sentence"], ["Name", "sentence"]] }`
   - If the file already exists, keep entries for words still in the list and only add the new ones (the user may have hand-edited them).
   - Dialogue: two lines of natural everyday conversation (greetings, family, school, meals) between named speakers (Tony, Mary, Ben, Amy, Mom, Dad, Miss Wang…).
   - **If `examples` is not empty, every dialogue in this group must follow one of those sentence patterns** (the group is drilling that pattern, so don't fall back to free-form chat):
     - Line 1 uses the same question form as an example — same question word and structure (`Where do you …?`, `Where is the …?`, `What is Mom doing …?`).
     - Line 2 answers it with the matching answer form. For a `Where` question the answer must name a place; best is "someone does something in/at some place" (`I take a shower in the bathroom.`, `Mom is cooking in the kitchen.`). For `Where is the X?` answer with a place, `It is in/on/under the …` or `The X is in/on/under the …`.
     - Swap in the target word (as the place, the object, or the activity) and pick the pattern that fits that word most naturally; spread the patterns across the group rather than using one for every card.
     - The two lines are still a question from one speaker and the answer from the other, and at least one of them contains the target word (e.g. `Where is the towel?` / `It is in the bathroom.`, or `Where do you eat?` / `I eat in the dining room.`). The example lines themselves may be reused for a card when they contain its word.
   - At least one of the two lines must contain the target word exactly as spelled (the builder bolds + underlines every match). It may appear in both lines, but it does not have to.
   - Use only words from the ~500 most common words for elementary-school children. Short sentences, max ~32 characters per line so the card does not overflow.
   - `zh`: short Traditional Chinese gloss (e.g. `早餐`, `傍晚；晚上`).

3. **Write `groups/<group>/scenes.js`** — one black-and-white cartoon per word that shows the meaning of the dialogue. Copy the import header and style from `groups/group_1/scenes.js` and build each scene with the helpers in `scripts/primitives.js` (`person`, `sun`, `halfSun`, `moon`, `star`, `clock`, `table`, `bowl`, `chopsticks`, `plateEgg`, `glass`, `toast`, `windowFrame`, `cloud`, `bird`, `tree`, `house`, `ground`, `grass`) wrapped in `svg(...)`. Keys must equal the `word` values.
   - 300×200 viewBox; stroke `#000`, fills `#fff`/`#000` only — no grey, no colour (see the `style` rules below for the one exception).
   - People: `person({ x, y, s, hair: 'boy'|'girl'|'woman'|'man', wave: 'l'|'r'|'point-l'|'point-r'|'hold', mouth: 'open', closedEyes })`; `y` is head centre, feet are ~100·s below it. Use the speakers from the dialogue.
   - If a word needs an object with no helper, draw it with inline SVG using `${S}` for strokes; add it to `primitives.js` (and its export list) only if it is reusable.
   - Reuse existing scenes from other groups when a word repeats (only when the group has the same `style`).
   - **If `style` is not empty, draw every picture in this group in that style** instead of the default simple stick-figure look:
     - First write down (as a comment at the top of `scenes.js`) what the style looks like and how you will express it in SVG line art. E.g. `宮崎駿畫風` (Miyazaki / Studio Ghibli look): soft hand-drawn feel; round faces with large, gentle eyes and small noses; natural hair with locks instead of a cap shape; real proportions (heads ~1/5 of the body, not 1/2); simple clothes with folds; warm everyday scenes with rich backgrounds — big billowing cumulus clouds, wind in grass and hair, leafy trees, old wooden houses, kitchen steam; varied line weight and short hatching strokes for shading.
     - The default `person()` won't fit most styles. Write style-specific helpers (a new character figure, backgrounds, objects) at the top of the group's `scenes.js`, or in `scripts/styles/<style-name>.js` if another group may reuse the same style. Keep the same speakers and the same meaning as the dialogue.
     - Style means the general look only: draw original characters and scenes, never copy a specific character, scene or logo from a film or series (e.g. no Totoro, no No-Face).
     - Stay black-and-white (`#000`/`#fff`, hatching instead of grey) so the cards print well, unless the style text explicitly asks for colour (`彩色`, `color`); then use a soft palette that suits the style.
     - When you check the contact sheet in step 4, also check that every picture looks like the requested style and that the group looks consistent.

4. **Render and look**: `node scripts/build.js <group> --draw-only`, then Read `groups/<group>/images/_sheet.png`. Check that each picture clearly matches its dialogue, nothing overlaps awkwardly, and nothing is cut off at the edges. Fix and re-render until it looks right.

5. **Build the Word file**: `node scripts/build.js <group>` → `flashcards_<group>.docx` (A4, 3×3 cards per page, 63×88 mm each, dashed cut lines; more than 9 words flow onto more pages).

6. **Verify the layout**: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/verify.ps1 flashcards_<group>.docx`, then Read the printed `.preview/*-p*.png` page images. Rows have exact height, so overflowing text is silently clipped — if any dialogue is cut off, shorten it in `cards.json` and rebuild. Expected page count = ceil(words / 9).

7. **Report** to the user in Traditional Chinese: the output path, a table of word / 中文 / 例句, and a reminder to print at 100% scale (不要勾「符合頁面大小」).
