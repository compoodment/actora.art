# Experiments

The lab is where actora.art keeps the odd stuff: public experiments, prototypes, and things still wip.

## Chat

A public chat bot for visitors.

Guests can chat in the current browser. Signed-in visitors can manage saved chats from the public UI.

It is part of the site itself.

## Wall

A shared text and ASCII wall.

Visitors can place characters on a grid, edit their own recent marks through the public UI, and watch the wall change over time.

It is meant to feel alive and temporary.

## Particles

A small interactive visual toy.

## Orbits

An early universe-sandbox orbital mechanics prototype at `/lab/orbits`.

It simulates Newtonian gravity between sourced Solar System bodies including the main planets, Earth's Moon, Mars's Phobos and Deimos, Jupiter's Galilean moons, Saturn's headline moons, Uranus's headline moons, Neptune's headline moons, and Pluto with Charon. Asteroids and non-Pluto dwarf planets are intentionally excluded from the baseline for lower-end device performance. It starts from a named NASA/JPL Horizons epoch, shows time as a date offset from that epoch, includes a compact FPS/performance readout for low-end-device tuning, avoids re-rendering the full UI panels on every animation frame during playback, and exposes Focus, Track, set-orbit, create-body, orbit-trail, and default-off future-path controls. The separate hierarchical bodies panel uses current visual/dominant grouping for navigation and scene visibility, while hidden bodies stay in the live gravity simulation.

## Liminal

A tiny first-person concrete test chamber walker at `/lab/liminal`.

It is explore-only: no enemies, no objective, and no Actora story claims.
