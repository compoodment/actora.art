# Experiments

The lab is where actora.art keeps the odd stuff: public experiments, prototypes, and things still wip.

## World of War

A clean-room globe-first strategy experiment at `/lab/world-of-war`.

The current version is a real-data map shell: a rotatable/zoomable Three.js globe generated from versioned Natural Earth 1:10m-derived countries, same-source reference borders, admin-1 lines, and sparse reference places. It is meant to test whether the map/camera/label foundation feels worth continuing before adding territory conquest and later dynamic borders, political colors, cities, ports, camps, influence, and fronts. It does not include gameplay, conquest, diplomacy, AI, multiplayer, account saves, or backend state yet.

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

## Space

An early universe-sandbox orbital mechanics prototype at `/lab/space`.

It simulates Newtonian gravity between sourced Solar System bodies including the main planets, Earth's Moon, Mars's Phobos and Deimos, Jupiter's Galilean moons, Saturn's headline moons, Uranus's headline moons, Neptune's headline moons, and Pluto with Charon. Asteroid bodies and non-Pluto dwarf planets are intentionally excluded from the baseline for lower-end device performance, while a faint slowly drifting asteroid belt dust layer gives visual context without adding simulated asteroids. It shows time as a simulated date, supports body labels and trails, exposes Track as the selected-body camera action, includes account-only autosave/manual save slots for signed-in users, keeps body/object visibility separate from live gravity through the Objects panel, and renders close-up spherical bodies with smooth silhouettes and Earth night lights under the cloud layer.

## Actora

A local-only web shell for the Actora game at `/projects/actora`.

It is a separate game-mode surface rather than a generic site experiment panel. The current public version is a dark, desktop-friendly local-only prototype loop with required Character Creation before play, the full prototype questionnaire question set, the current prototype geography set of 12 countries and 43 cities, Year 1 / Month 1 newborn local-life start, source-shaped startup mother/father and optional older-sibling family roles, source-backed later sibling births, source-shaped meeting NPC generation, lifecycle identity choice flow, first-pass death/continuation handoff with social grief effects, death-summary continuity state, normal-tab death/history surfacing, source-backed Profile card details with honest Mood/Needs/Skills placeholders, relationship inspect detail with filter/search, History year headers/year jump, saved local state with a source-shaped local event log and source-shaped action queue normalization, human identity, appearance, location, canonical stats/attributes, full source-backed monthly event table with age/stage/trait/family gates including sibling-gated events when sibling links exist, monthly family-birth simulation for current coparent pairs, source-shaped action/monthly-event outcomes and personal action records, event history, action queue, month-by-month advancement, skip-time presets and custom skip-month input, pending choices, generated social links from meeting choices, Hang out actions with duplicate/dead-target blocking and normalized social-link updates, relationship state, and Life/Actions/Profile/Relationships/History tabs. It is not connected to account saves or the full Actora simulation yet.

## Liminal

A tiny first-person concrete test chamber walker at `/lab/liminal`.

It is explore-only: no enemies, no objective, and no Actora story claims.
