# AGENTS.md

Old (2015) Russian-language Pokémon fan site, modernized into a **vanilla JS SPA** (no build system, no package manager, no tests, no linter, no git). Pure static HTML/CSS/JS.

## Communicating with the user

- Always reply to the user in Russian.

## Encoding (gotcha)

- All `.html`, `.css`, `.js` files are **UTF-8** with **LF** line endings. Do not convert to another encoding.
- `backup-2015/` holds the ORIGINAL windows-1251/CRLF multi-page source. Do not edit files inside it; it is a read-only archive (the old `Images/`, `.wav`, pages, old CSS/JS live there).

## Structure (SPA)

- `index.html` — the only HTML page. Contains header/hero, nav, `<audio id="bgm">`, `<main id="app">`, footer. Loads `js/data.js` then `js/app.js`. No jQuery.
- `js/data.js` — `POKEMON` array (300 Pokémon: full national #1–300, incl. Lapras 131, Ditto 132, Eevee 133, Snorlax 143, Mewtwo 150) and `POKEMON_TYPES` palette map. Each entry: `slug, number, nameRu, nameEn, types[], height, weight, image, intro, sections[{title,text}]`. Entries may have an optional `featured: true` flag. Each entry also has a `family` id (evolution families, keyed by base form).
- `js/app.js` — hash router (`#/`, `#/pikachu`, `#/dex`, …), renders into `#app`, handles nav selected-state, builds the dropdown Pokédex (search box over `#dex-menu`), and the audio autoplay policy. The home page (`homeHtml`) shows only the 10 `featured` Pokémon as cards; the dropdown Pokédex lists all 300. The `#/dex` page (`dexHtml` + `setupDexPage`) shows all 300 with filters: name search, type, evolution family, base-forms-only checkbox, height/weight range sliders. Every card (`cardHtml`) has a cry button that plays `cries/<slug>.ogg`.
- `cries/` — 300 local cries (`cries/<slug>.ogg`, Ogg Vorbis), downloaded from `https://play.pokemonshowdown.com/audio/cries/` (note: Nidoran♀/Nidoran♂ files are `nidoranf.ogg` / `nidoranm.ogg` there, but saved locally under our slugs `nidoran-f.ogg` / `nidoran-m.ogg`; `mr-mime` → `mrmime`, `ho-oh` → `hooh`; `togepi` is absent there as `.ogg` and its cry is taken from the PokeAPI cries repo `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/175.ogg`). Use `.ogg` only — the `.mp3` variants on that server are attack/move sounds, not real cries. Played by `.cry-btn` via a dynamically created `<audio id="cry-audio">`.
- `css/general.css` — live stylesheet (modern, responsive, CSS variables). `css/Копия general.css` is a stale Cyrillic backup, NOT linked; edits there have no effect.

## Images

- All 300 Pokémon use local 320 px sprites in `Images/<number>.png`, generated from the `sprites-master/` git submodule-repo (PokeAPI sprites, `other/home/*`). No remote hotlinks — the site works fully offline.
- `sprites-master/` is a read-only source of PokeAPI sprites (remember it is ignored by git via `.gitignore`). To regenerate a sprite: `python3 -c "from PIL import Image; Image.open('sprites-master/sprites/pokemon/other/home/<id>.png').convert('RGBA').resize((320,320), Image.LANCZOS).save('Images/<id>.png','PNG',optimize=True)"`.
- `Images/*.png` for each Pokémon must exist; `js/data.js` `image` entries reference these files.
- HTML/CSS reference `Images/` with the capital-I directory (already correct; CSS background uses `../Images/bg.jpg`).

## Audio gotcha

- `pokemon.wav` (~11 MB) is at the repo root, referenced only from `index.html`. Autoplay tries at `volume = 0.5`; if the browser blocks it, playback starts muted and unmutes on the first click/tap. The `#bgm-btn` button toggles it.

## Content rules

- Every Pokémon page needs all 4 sections (Анатомия, Характер, Способности, Обитание) plus a 4-item stats block (рост, вес, номер, тип) — see `js/data.js` for the model.
- Keep the fan-site disclaimer in the footer intact (characters belong to Nintendo / Game Freak / Creatures / The Pokémon Company).

## How to test

- No build step. Open `index.html` in a browser. Check: nav routes via hash, 10 featured Pokemon cards render on `#/`, dropdown Pokédex lists all 300 with working search, `#/dex` page renders all 300 with working filters and cry buttons, single-page view has image + stats + sections, audio autoplay/unlock, narrow-window responsiveness, offline images load.
- JS sanity check without a browser: `node --check js/data.js && node --check js/app.js`.