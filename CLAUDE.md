# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This repo makes printable English vocabulary flashcards for elementary-school learners in Taiwan. Each card is poker-card size (63 × 88 mm) and shows:
- the word and its Traditional Chinese gloss
- a black-and-white cartoon picture
- a two-line everyday dialogue that uses the word

Cards are printed 9 to an A4 page (3 × 3) in a Word `.docx`, with dashed borders as cut lines.

The input is `英文單字清單.txt`. Each group in it is a `# group_N` header followed by `* word` lines. The user generates a group with the project skill **`/flashcard group_N`** (`.claude/skills/flashcard/SKILL.md`). That skill has the full step-by-step workflow and the content rules, so keep it in sync with any pipeline change.

## Commands

```bash
npm install
node scripts/list-words.js group_1           # words in a group as JSON (also accepts "1", "Flashcards_group_1", "group_1/")
node scripts/build.js group_1 --draw-only    # render scenes -> groups/group_1/images/*.png + _sheet.png contact sheet
node scripts/build.js group_1                # render + write flashcards_group_1.docx
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/verify.ps1 flashcards_group_1.docx
                                             # Word -> .preview/*.pdf -> .preview/*-p<N>.png page images
```

There are no tests or linting. To check your work, Read `_sheet.png` for the pictures and the `.preview` page PNGs for the layout.

## Architecture

- `groups/<group>/cards.json`: holds the text for each card (`word`, `zh`, `lines: [[speaker, sentence], …]`). Claude writes these. The user may hand-edit them, so never regenerate entries that already exist.
- `groups/<group>/scenes.js`: maps each `word` to a full SVG string built with `scripts/primitives.js`.
- `scripts/primitives.js`: shared SVG helpers for black-and-white line art on a 300 × 200 viewBox:
  - `person()` takes `hair` (`boy`, `girl`, `woman`, `man`), `wave`, `mouth` and `closedEyes`. `y` is the centre of the head.
  - `sun`, `moon`, `clock(h, m)`, `table`, `bowl`, `house`, …
  - Strokes share the attribute string `S`. `svg()` deletes duplicate `stroke-width` attributes because resvg rejects them.
- `scripts/build.js`: renders scenes with resvg, then builds the docx with docx-js.
  - Image file names are the word in lowercase, with `-` replacing anything that isn't a letter or number (`o'clock` → `o-clock.png`).
  - Rows use `HeightRule.EXACT`, so text that overflows is clipped silently and never makes a card taller.
  - A tiny exact-height paragraph follows the table so Word doesn't add a blank last page.
  - Fonts: Comic Sans MS for English, Microsoft JhengHei for Chinese.
- `scripts/verify.ps1`: renders a docx to PDF with Word COM, then to PNG pages with PyMuPDF.
  - PyMuPDF is installed in the gitignored `.tools/pylib`, so nothing is installed system-wide. LibreOffice and pdftoppm aren't available on this machine.
  - The PDF path must be a plain `[string]`. A PSObject-wrapped path from `Join-Path` makes `ExportAsFixedFormat` hang forever.
  - If a run hangs, a hidden `WINWORD.EXE` with no window title gets left behind. Kill only processes like that, because the user usually has their own Word documents open.
  - Word's `ComputeStatistics(2)` reports the wrong page count. Trust the PDF page count instead.

`word-cards-time-and-meals.docx` is the first hand-built version of group_1, from before this pipeline existed.
