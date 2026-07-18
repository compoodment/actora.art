# Experiments

These notes cover actora.art's public experiments, prototypes, and work-in-progress project surfaces.

## Chat

A public chat bot for visitors.

Guests can chat in the current browser. Signed-in visitors can manage saved chats from the public UI.

It is a site-level interactive surface.

## Wall

A shared text and ASCII wall.

Visitors can place characters on a grid, edit their own recent marks through the public UI, and watch the wall change over time.

It is meant to feel alive and temporary.

## Particles

A small interactive visual flow toy.

## Space

An early universe-sandbox orbital mechanics prototype at `/lab/space`.

It runs selectable Solar System and Alpha Centauri simulations through the same Newtonian gravity model. A fresh visit first offers a centered direct choice between Solar System and Alpha Centauri before the renderer or either system's visual assets start; Solar remains first and initially focused, and the in-game selector remains available after launch. The Solar roster includes the main planets, Earth's Moon, the ISS, Mars's Phobos and Deimos, Jupiter's Galilean moons, Saturn's headline moons, Uranus's headline moons, selected Neptune moons, and Pluto with Charon. Alpha Centauri includes Alpha Centauri A and B, Alpha Centauri A b, Proxima Centauri, and Proxima b, c, and d, with generated source-informed surfaces for bodies that cannot be directly mapped.

Asteroid bodies and non-Pluto dwarf planets are intentionally excluded from the baseline for lower-end device performance. A lightweight representative belt instead uses a sampled [NASA/JPL Small-Body Database](https://ssd-api.jpl.nasa.gov/doc/sbdb_query.html) orbital profile, Jupiter resonance gaps, composition-informed reflectance, and realistic close-range sparsity without adding simulated asteroids.

Alpha Centauri's stars illuminate their planets using sourced relative luminosities, natural stellar colors, and distance-based falloff. Alpha Centauri A b receives dominant light from A plus B's physically faint companion contribution; the Proxima worlds respond to their red-dwarf host, with real moving terminators and dark night sides instead of artificial self-lighting. Proxima b/d receive an ambient-only presentation adjustment so their dark generated surfaces remain readable without changing their direct star lighting or making either planet glow, while Proxima c uses host-direction presentation light that preserves its illuminated hemisphere and terminator instead of a flat tracked-view brightness lift. The system shares the Solar System view's ambient brightness by visual direction, and B receives a stronger but still capped visual lift so its secondary illumination reads on A b without competing with A. These presentation choices do not replace the sourced stellar brightness values.

Proxima b and d are shown with likely synchronous host-facing rotation, although their spins have not been directly measured. Proxima c and Alpha Centauri A b instead use restrained Neptune- and Saturn-inspired visual spins and tilts because their real rotation states are unknown.

Orbit trails use stable local reference frames so close paths remain attached and smooth even inside Alpha Centauri's enormous whole-system scale. The A/B pair and the distant Proxima subsystem trace their barycentric motion, while borderline inferred paths stay visually stable instead of switching between trace modes during small numerical changes. Trails remain visual guides and do not alter gravity.

The prototype shows time as a simulated date, supports body labels and trails, exposes Track as the selected-body camera action, and includes account-only autosave/manual save slots for signed-in users. Saves retain their source system, while changing systems loads the complete replacement scene before play resumes. The Objects panel keeps body/object visibility separate from live gravity, uses AU for astronomical distance readouts, and close-up bodies render with smooth spherical silhouettes, Earth night lights, a gently drifting Earth cloud layer, and textured stars with their own light and plasma activity. The Solar Sun reads as warm ivory-gold at system scale, with its richer yellow-orange progression now beginning three times farther out while retaining localized prominences. After the visitor chooses an initial system, startup waits for that scene to become genuinely ready with fallbacks for failed visuals; quality changes preserve the live session, and the core menu, controls, hints, and selected-body information remain available in the phone layout.

## Actora

A browser-local presentation of the unfinished Actora game at `/lab/actora`.

It is a separate game-mode surface rather than a generic site experiment panel. New lives run Actora's tagged `v0.58.0` Python command/save runtime in a dedicated browser Worker, while existing local TypeScript lives and unfinished character drafts stay on their compatible legacy engine. The current public version keeps the dark, desktop-friendly button-and-card presentation, required Character Creation, full prototype questionnaire, current prototype geography set of 12 countries and 43 cities, and a Year 1 / Month 1 newborn local-life start.

The prototype opens on a save-aware title screen: begin a life when no healthy local save exists, or review and continue the current character. Starting a New Life from the title, active game, or terminal continuation state uses one protected confirmation.

It includes generated family setup, later sibling births, meeting NPCs, lifecycle identity choices, local event history, action records, month-by-month advancement, pending choices, in-game relationship links from meeting choices, Hang out actions, and Life/Actions/Profile/Relationships/History tabs. Life splits the overview from its live feed with compact Advance/Skip controls, Actions groups Social and Personal choices beside the queue and time budget, and Relationships uses one searchable people-and-detail browser. Profile uses seven combined cards and leaves chronology to History; Mood + Needs and Skills / Talents remain honest placeholders. First-pass death continuation moves through a finished-life summary, available linked lives, candidate detail, and explicit confirmation.

It saves state locally in the browser with separate native and legacy save spaces; neither is connected to an actora.art account. The native path covers Actora's current six-command foundation—creation, action queues, advancement, choices, and life continuation—but does not claim that the wider terminal game or Actora itself is finished.

## Liminal

A tiny first-person concrete test chamber walker at `/lab/liminal`.

It is explore-only: no enemies, no objective, and no Actora story claims.
