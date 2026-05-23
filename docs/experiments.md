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

It simulates Newtonian gravity between sourced Solar System objects including the main planets, Earth's Moon, the ISS, Mars's Phobos and Deimos, Jupiter's Galilean moons, Saturn's headline moons, Uranus's headline moons, selected Neptune moons, and Pluto with Charon.

Asteroid bodies and non-Pluto dwarf planets are intentionally excluded from the baseline for lower-end device performance, while a faint slowly drifting asteroid belt dust layer gives visual context without adding simulated asteroids.

The prototype shows time as a simulated date, supports body labels and trails, exposes Track as the selected-body camera action, and includes account-only autosave/manual save slots for signed-in users. The Objects panel keeps body/object visibility separate from live gravity, and close-up bodies render with smooth spherical silhouettes, Earth night lights, and a gently drifting Earth cloud layer.

## Actora

A local-only web shell for the Actora game at `/projects/actora`.

It is a separate game-mode surface rather than a generic site experiment panel. The current public version is a dark, desktop-friendly local-only prototype loop with required Character Creation before play, the full prototype questionnaire, the current prototype geography set of 12 countries and 43 cities, and a Year 1 / Month 1 newborn local-life start.

The prototype includes generated family setup, later sibling births, meeting NPCs, lifecycle identity choices, first-pass death and continuation flow, relationship inspection, local event history, action records, month-by-month advancement, skip-time controls, pending choices, in-game relationship links from meeting choices, Hang out actions, and Life/Actions/Profile/Relationships/History tabs. The in-game Profile tab currently includes honest placeholder areas for Mood, Needs, and Skills.

It saves state locally in the browser. It is not connected to account saves or the full Actora simulation yet.

## Liminal

A tiny first-person concrete test chamber walker at `/lab/liminal`.

It is explore-only: no enemies, no objective, and no Actora story claims.
