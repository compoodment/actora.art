# Testing

Short public-safe checks for visitor-facing behavior.

These are for normal product QA. Anything probing non-public controls, account edge cases, or implementation details belongs in private docs.

## General pass

1. Open the homepage.
   - Expected: the terminal-style landing page loads and navigation feels clear.
2. Open `/info`, `/projects`, and `/lab`.
   - Expected: pages load, footer navigation works, and the site still feels coherent.
3. Try on desktop and a narrow/mobile viewport if practical.
   - Expected: controls remain usable and nothing important is clipped.

## Chat

1. Open `/chat`.
   - Expected: the page opens cleanly and explains enough to start.
2. Send a harmless message.
   - Expected: Aurora replies and the input remains usable.
3. Ask a factual public question about actora.art.
   - Expected: Aurora answers from public-facing site/docs knowledge or says it does not know.
4. Mention the visible rainbow/light-show effect if you see it.
   - Expected: Aurora acknowledges it as a real site behavior.

## Profiles

1. Open a known public `/u/:username` profile.
   - Expected: the profile page loads with identity, links, and badges if present.
2. Open a known private `/u/:username` profile.
   - Expected: the page says the profile is private rather than exposing profile details.

## Wall

1. Open `/lab/wall`.
   - Expected: the wall loads without a full-page error.
2. Place a few characters.
   - Expected: the grid updates and the controls remain understandable.
3. Try undo, redo, and erase through the visible UI.
   - Expected: recent edits behave predictably.
4. Try from a second browser/device if practical.
   - Expected: the wall feels live enough for casual collaboration.

## Space

1. Open `/lab/space`.
   - Expected: the 3D scene loads with the Solar System visible or shows a clear WebGL fallback.
2. Check the Objects panel.
   - Expected: it includes an Asteroid belt visual-layer row, and hiding/showing it changes the faint dust belt without changing selected-body controls.
3. Track a planet or moon, then untrack.
   - Expected: Track keeps the object readable, normal camera movement returns after untracking, and the body does not disappear when untracking close to it.
4. Use `see whole system`.
   - Expected: the camera tracks the Sun from a wide system view and shows a note explaining that whole-system mode is Sun tracking from a zoomed-out distance.

## Liminal

1. Open `/lab/liminal`.
   - Expected: the scene loads or shows a clear fallback if WebGL is unavailable.
2. Enter, move, look around, and open the menu.
   - Expected: movement and menu controls are understandable.
3. Change a visible setting and reload.
   - Expected: the experience remains usable and does not get stuck blank.

## What to report

For any issue, capture:

- browser/device
- signed-in or guest, if relevant
- what you were doing
- what you expected
- what happened instead
- whether reload fixed it
- screenshot or short screen recording if easy
