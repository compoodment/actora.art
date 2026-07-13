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

It runs selectable Solar System and Alpha Centauri simulations through the same Newtonian gravity model, with Solar System remaining the default. The Solar roster includes the main planets, Earth's Moon, the ISS, Mars's Phobos and Deimos, Jupiter's Galilean moons, Saturn's headline moons, Uranus's headline moons, selected Neptune moons, and Pluto with Charon. Alpha Centauri includes Alpha Centauri A and B, Alpha Centauri A b, Proxima Centauri, and Proxima b, c, and d, with generated source-informed surfaces for bodies that cannot be directly mapped.

Asteroid bodies and non-Pluto dwarf planets are intentionally excluded from the baseline for lower-end device performance. A lightweight representative belt instead uses a sampled [NASA/JPL Small-Body Database](https://ssd-api.jpl.nasa.gov/doc/sbdb_query.html) orbital profile, Jupiter resonance gaps, composition-informed reflectance, and realistic close-range sparsity without adding simulated asteroids.

Alpha Centauri's stars illuminate their planets using sourced relative luminosities, natural stellar colors, and distance-based falloff. Alpha Centauri A b receives dominant light from A plus B's physically faint companion contribution; the Proxima worlds respond to their red-dwarf host, with real moving terminators and dark night sides instead of artificial self-lighting. Proxima c remains much dimmer than the inner Proxima planets, but close tracking now adapts its presentation enough to reveal the generated surface. B receives a limited visual lift so its secondary illumination can be seen on A b without approaching A's dominant light. Solar System lighting retains its existing presentation.

Proxima b and d are shown with likely synchronous host-facing rotation, although their spins have not been directly measured. Proxima c and Alpha Centauri A b instead use restrained Neptune- and Saturn-inspired visual spins and tilts because their real rotation states are unknown.

Orbit trails use stable local reference frames so close paths remain attached and smooth even inside Alpha Centauri's enormous whole-system scale. The A/B pair and the distant Proxima subsystem trace their barycentric motion, while borderline inferred paths stay visually stable instead of switching between trace modes during small numerical changes. Trails remain visual guides and do not alter gravity.

The prototype shows time as a simulated date, supports body labels and trails, exposes Track as the selected-body camera action, and includes account-only autosave/manual save slots for signed-in users. Saves retain their source system, while changing systems loads the complete replacement scene before play resumes. The Objects panel keeps body/object visibility separate from live gravity, uses AU for astronomical distance readouts, and close-up bodies render with smooth spherical silhouettes, Earth night lights, a gently drifting Earth cloud layer, and textured stars with their own light and plasma activity. Startup waits for a genuinely ready scene with fallbacks for failed visuals, quality changes preserve the live session, and the core menu, controls, hints, and selected-body information remain available in the phone layout.

## Actora

A local-only web shell for the Actora game at `/projects/actora`.

It is a separate game-mode surface rather than a generic site experiment panel. The current public version is a dark, desktop-friendly local-only prototype loop with required Character Creation before play, the full prototype questionnaire, the current prototype geography set of 12 countries and 43 cities, and a Year 1 / Month 1 newborn local-life start.

The prototype includes generated family setup, later sibling births, meeting NPCs, lifecycle identity choices, first-pass death and continuation flow, relationship inspection, local event history, action records, month-by-month advancement, skip-time controls, pending choices, in-game relationship links from meeting choices, Hang out actions, and Life/Actions/Profile/Relationships/History tabs. The in-game Profile tab currently includes honest placeholder areas for Mood, Needs, and Skills.

It saves state locally in the browser. It is not connected to account saves or the full Actora simulation yet.

## Liminal

A tiny first-person concrete test chamber walker at `/lab/liminal`.

It is explore-only: no enemies, no objective, and no Actora story claims.
