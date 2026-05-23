# Testing

Short public-safe checks for visitor-facing behavior.

These are for normal product QA. Anything probing non-public controls, sensitive account edge cases, or implementation details belongs in private docs.

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
4. Open the visible `hint` control.
   - Expected: the hint explains the current chat surface without exposing non-public roles or controls.
5. Mention the visible rainbow/light-show effect if you see it.
   - Expected: Aurora acknowledges it as a real site behavior.

## Profiles and Social

1. From the homepage terminal, type `find`.
   - Expected: it prompts for an exact username and opens an existing profile in a new tab.
2. Open a known public `/u/:username` profile.
   - Expected: the profile page loads with display name as the main heading, username as the handle, links, and badges if present.
3. Open a known private `/u/:username` profile.
   - Expected: the page says the profile is private rather than exposing profile details, and signed-in users can still send a friend request.
4. On `/account`, edit username/display name while signed in.
   - Expected: display name updates on the account/profile surfaces, and the profile URL follows the current username.
5. On `/account`, upload or clear an avatar image.
   - Expected: the avatar preview updates and saves immediately.
6. Open the footer `social` popup while signed in.
   - Expected: the popup opens compactly above the shared footer, shows social threads by latest activity, shows one-way System messages from Aurora, and lets friends start DMs.
7. Send or receive a DM with a friend if practical.
   - Expected: DMs are friends-only, incoming/outgoing message bubbles wrap cleanly, typed drafts survive live updates, and open conversations do not jump to the top during live updates.
8. Check unread System or DM threads if available.
   - Expected: the footer `social` control can show a count without shifting the word social, new System notices or DMs can appear without refreshing the page, and opening one unread thread clears that thread's badge while other unread threads keep theirs.
9. Check the footer on a phone-width viewport on the homepage and another page.
   - Expected: the construction notice or centered actoraOS link sits above the nav/social/account row and does not cover the social button.

## Wall

1. Open `/lab/wall`.
   - Expected: the wall loads without a full-page error.
2. Place a few characters.
   - Expected: the grid updates and the controls remain understandable.
3. Try undo, redo, and erase through the visible UI.
   - Expected: recent edits behave predictably.
4. Try from a second browser/device if practical.
   - Expected: the wall feels live enough for casual collaboration.

## Particles

1. Open `/lab/particles`.
   - Expected: the canvas loads without a full-page error.
2. Move the cursor or let the scene run.
   - Expected: the visual flow remains readable, and the hint text matches the current motion mode.
3. Resize or reload the page.
   - Expected: the experiment remains usable and does not get stuck blank.

## Space

1. Open `/lab/space`.
   - Expected: the 3D scene loads with the Solar System visible or shows a clear WebGL fallback.
2. On an iPad/tablet-sized touch device if available, open `/lab/space`.
   - Expected: the scene loads in the lighter startup path instead of hanging on the loading screen.
3. Check the Objects panel.
   - Expected: it includes an Asteroid belt visual-layer row, and hiding/showing it changes the faint dust belt without changing selected-body controls.
4. Track a planet or moon, then untrack.
   - Expected: Track keeps the object readable, normal camera movement returns after untracking, and the body does not disappear when untracking close to it.
5. Use `see whole system`.
   - Expected: the camera tracks the Sun from a wide system view and shows a note explaining that whole-system mode is Sun tracking from a zoomed-out distance.

## Actora

1. Open `/projects/actora`.
   - Expected: Character Creation opens, or an existing local life loads without a full-page error.
2. Complete Character Creation or use an existing local save.
   - Expected: the Life, Actions, Profile, Relationships, and History tabs are reachable.
3. Advance one month or queue a visible action.
   - Expected: local events/history update, and the browser-local state remains after reload.

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
