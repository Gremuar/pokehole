# AGENTS.md

Old (2015) Russian-language Pokémon fan site, modernized into a **vanilla JS SPA** (no build system, no package manager, no tests, no linter, no git). Pure static HTML/CSS/JS.

## Communicating with the user

- Always reply to the user in Russian.

## Encoding (gotcha)

- All `.html`, `.css`, `.js` files are **UTF-8** with **LF** line endings. Do not convert to another encoding.
- `backup-2015/` holds the ORIGINAL windows-1251/CRLF multi-page source. Do not edit files inside it; it is a read-only archive (the old `Images/`, `.wav`, pages, old CSS/JS live there).

## Structure (SPA)

- `index.html` — the only HTML page. Contains header/hero, nav, `<audio id="bgm">`, `<main id="app">`, footer. Loads `js/data.js` then `js/app.js`. No jQuery.
- `js/data.js` — `POKEMON` array (11 Pokémon) and `POKEMON_TYPES` palette map. Each entry: `slug, number, nameRu, nameEn, types[], height, weight, image, intro, sections[{title,text}]`.
- `js/app.js` — hash router (`#/`, `#/pikachu`, …), renders into `#app`, handles nav selected-state, and the audio autoplay policy.
- `css/general.css` — live stylesheet (modern, responsive, CSS variables). `css/Копия general.css` is a stale Cyrillic backup, NOT linked; edits there have no effect.

## Images

- Existing 5 Pokémon (pikachu, jigglypuff, meowth, psyduck, butterfree) use local art from `Images/`.
- The 6 newer ones (bulbasaur, charmander, squirtle, eevee, snorlax, mewtwo) hotlink official artwork from the PokeAPI GitHub raw CDN (`raw.githubusercontent.com/.../official-artwork/`). They need internet; if offline they render as broken images.
- HTML/CSS reference `Images/` with the capital-I directory (already correct; CSS background uses `../Images/bg.jpg`).

## Audio gotcha

- `pokemon.wav` (~11 MB) is at the repo root, referenced only from `index.html`. Autoplay tries at `volume = 0.5`; if the browser blocks it, playback starts muted and unmutes on the first click/tap. The `#bgm-btn` button toggles it.

## Content rules

- Every Pokémon page needs all 4 sections (Анатомия, Характер, Способности, Обитание) plus a 4-item stats block (рост, вес, номер, тип) — see `js/data.js` for the model.
- Keep the fan-site disclaimer in the footer intact (characters belong to Nintendo / Game Freak / Creatures / The Pokémon Company).

## How to test

- No build step. Open `index.html` in a browser. Check: nav routes via hash, Pokemon cards render on `#/`, single-page view has image + stats + sections, audio autoplay/unlock, narrow-window responsiveness, remote PokeAPI art loads.
- JS sanity check without a browser: `node --check js/data.js && node --check js/app.js`.