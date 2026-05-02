# Changelog

Public release notes for actora.art.

This changelog is visitor-facing. Private implementation, operations, and remediation details are not documented in the public repo.

## 0.1.185 - 2026-05-03

- Fixed `/lab/orbits` distant orbit trails still looking dashed by rendering connected wide trail chunks instead of isolated mini-segments.

## 0.1.184 - 2026-05-03

- Improved `/lab/orbits` orbit trails so focused local views use thicker screen-space trails, reducing broken-looking distant trail artifacts without hiding context.

## 0.1.183 - 2026-05-03

- Changed `/lab/orbits` Focus transitions to preserve the current viewing direction instead of snapping to a different angle while zooming in.

## 0.1.182 - 2026-05-03

- Added Uranus's headline moons — Miranda, Ariel, Umbriel, Titania, and Oberon — to `/lab/orbits` as sourced Solar System bodies with nested body-list relationships and Uranus-relative trails/focus behavior.

## 0.1.181 - 2026-05-03

- Raised `/lab/orbits` high-speed physics frame budget and frame-paced live advance so `10,000,000x` remains an editable Newtonian simulation while avoiding false clamp warnings on normal frames.

## 0.1.180 - 2026-05-03

- Added Saturn's headline moons — Titan, Rhea, Iapetus, Dione, Tethys, Enceladus, and Mimas — to `/lab/orbits` as sourced Solar System bodies with nested body-list relationships and Saturn-relative trails/focus behavior.

## 0.1.179 - 2026-05-02

- Removed the stray divider above the centered `/info` Credits section.

## 0.1.178 - 2026-05-02

- Added a centered Credits section to `/info`, crediting computment as owner/creator of actora.art and X00D-1001 for contributing to Aurora, the site chat bot.

## 0.1.177 - 2026-05-02

- Added Jupiter's Galilean moons — Io, Europa, Ganymede, and Callisto — to `/lab/orbits` as sourced Solar System bodies with nested body-list relationships and Jupiter-relative trails/focus behavior.

## 0.1.176 - 2026-05-02

- Fixed `/lab/orbits` future paths so they refresh after playback and stay aligned while inspecting focused/local systems.
- Hardened `/lab/orbits` controls and accessibility state for sliders, body selection, the bodies panel, pointer-cancel handling, and numeric edit fields.
- Corrected public `/lab/orbits` experiment wording now that detailed diagnostics are internal guardrails rather than default visible UI.

## 0.1.175 - 2026-05-02

- Fixed focused-body orbit trails so the selected body's own trail remains attached to the body while other trails still avoid drawing through it.

## 0.1.174 - 2026-05-02

- Fixed Pluto's stabilized orbit trail so it stays visually anchored to Pluto instead of starting from the Pluto-system barycenter.

## 0.1.173 - 2026-05-02

- Restored full orbit-trail context while focused in `/lab/orbits`, while preventing trails from drawing through the focused body.
- Labeled Pluto as a dwarf planet in the body panel.

## 0.1.172 - 2026-05-02

- Improved `/lab/orbits` free-camera zoom movement so it keeps moving through space instead of bottoming out at a minimum zoom scalar.
- Made focused orbit trails less cluttered by showing only the focused body's local trail when appropriate, and made spatial dots follow the free camera as a navigation aid.

## 0.1.171 - 2026-05-02

- Fixed focused `/lab/orbits` trail rendering so unrelated Solar-System-scale trails no longer cut across local moon/planet views.

## 0.1.170 - 2026-05-02

- Changed `/lab/orbits` time to show the simulated Solar System date/time from the source epoch.
- Smoothed Pluto's orbit trail now that Charon is included, so the trail follows the Pluto-system path around the Sun instead of jittering from Pluto/Charon wobble.

## 0.1.169 - 2026-05-02

- Added Phobos, Deimos, Pluto, and Charon to `/lab/orbits` as sourced Solar System bodies with nested body-list relationships.
- Changed the future-path control to start and reset as `off`, so prediction lines stay hidden until visitors raise the slider.

## 0.1.168 - 2026-05-02

- Added a Home camera action on `/lab/orbits` so visitors can return to the Solar System overview without resetting the simulation.
- Changed orbit trails to a length slider and made long future-path forecasts less laggy while dragging.

## 0.1.167 - 2026-05-02

- Widened `/lab/orbits` focused-camera zoom-out so focus lock no longer stops at the old close inspection ceiling.

## 0.1.166 - 2026-05-02

- Softened `/lab/orbits` orbit trails so the trailing end fades out instead of ending as a visibly clipped arc.

## 0.1.165 - 2026-05-02

- Removed the empty selected-body inspector placeholder on `/lab/orbits`; the inspector now appears only after selecting a body.

## 0.1.164 - 2026-05-02

- Improved `/lab/orbits` free-camera wheel and middle-drag zoom so unfocused flight can move smoothly across close and wide Solar System scales without switching into an invisible orbit target.

## 0.1.163 - 2026-05-02

- Tightened `/lab/orbits` around the Solar System baseline: the public UI now presents Solar System only, displays the ecliptic plane horizontally, and keeps optional spatial dots off by default.
- Made Focus toggle back to free camera mode for the focused selected body, smoothed focused orbit/zoom feel, and allowed much wider focused zoom-out.
- Reduced the live simulation timestep for smoother local-body motion while keeping the Solar System source posture explicit.

## 0.1.162 - 2026-05-02

- Updated `/lab/orbits` Solar System starts to use named NASA/JPL Horizons DE441 vectors for epoch `2026-May-02 00:00 TDB`, followed by the lab's simplified live gravity simulation.
- Improved focused camera zoom so wheel and middle-drag movement stays quick at distance while allowing finer close inspection of bodies.
- Split the bodies list into its own hierarchy panel, nested the Moon under Earth, and removed the selected-body scene halo.

## 0.1.161 - 2026-05-02

- Changed `/lab/orbits` body rendering to use true relative radii in the active view, with focus-locked local scaling so Earth/Moon can be inspected without inflating the whole Solar System overview.

## 0.1.160 - 2026-05-02

- Changed `/lab/orbits` Focus into a persistent body-following camera lock and made focused looking/zooming orbit around the focused body without breaking on drag or empty-space clicks.

## 0.1.159 - 2026-05-02

- Reworked `/lab/orbits` orbit trails into period-aware parent-relative orbit traces with off/short/full/long modes and softer age-darkened paths.

## 0.1.158 - 2026-05-02

- Fixed `/lab/orbits` right-drag vertical look direction so looking up/down follows normal mouse-look expectations.

## 0.1.157 - 2026-05-02

- Tightened `/lab/orbits` camera feel and UI wording: right-drag look now moves the expected way, camera actions frame the selected body itself, selection feedback is lighter, the step button is gone, the body list can collapse, and future-path/readout wording is less cluttered.

## 0.1.156 - 2026-05-02

- Reworked `/lab/orbits` navigation around mouse-first space movement, an integrated body list, explicit camera actions, default-off labels, parent-relative trails, and a less cluttered control panel.

## 0.1.155 - 2026-05-02

- Made `/lab/orbits` bodies less oversized, kept Solar System distances linear, and added empty-space click to clear body selection.

## 0.1.154 - 2026-05-02

- Fixed `/lab/orbits` prediction controls so longer future horizons visibly extend while paused.
- Changed `/lab/orbits` selection feedback to use a visual halo instead of enlarging the selected body, and suppressed right-click browser menus on the simulation surface.

## 0.1.153 - 2026-05-02

- Added `/lab/orbits`, an early universe-sandbox orbital mechanics prototype with live gravity simulation, presets, camera controls, trails, prediction controls, and diagnostics.

## 0.1.152 - 2026-05-01

- Fixed Wall erase bursts so rapid guest erasing keeps the character budget in sync.

## 0.1.151 - 2026-05-01

- Tightened the private prompt-history layout so snapshot actions sit together.

## 0.1.150 - 2026-05-01

- Stopped private admin pages from auto-refreshing while people are reading, opening details, or editing prompts.

## 0.1.149 - 2026-05-01

- Fixed private admin refresh behavior so collaborator-admin prompt and people panels keep rendering when one admin data read fails.

## 0.1.148 - 2026-04-30

- Refined private Aurora prompt tooling while keeping public visitor behavior unchanged.

## 0.1.147 - 2026-04-30

- Refined private admin boundaries while keeping public visitor behavior unchanged.

## 0.1.146 - 2026-04-30

- Refined private Aurora prompt tooling so account-aware chat context can be managed more directly.

## 0.1.145 - 2026-04-30

- Added private admin tooling for tuning Aurora's account-aware chat context without changing public documentation.

## 0.1.144 - 2026-04-30

- Updated Aurora's account-aware chat context so account access details stay private unless they are relevant to the signed-in user's own access.

## 0.1.143 - 2026-04-30

- Removed the public access-level page; account capability context is now handled privately by Aurora instead of documented publicly.

## 0.1.142 - 2026-04-30

- Tightened access-level wording so public docs explain guest, signed-in, and trusted access without exposing private owner/admin role details.

## 0.1.141 - 2026-04-30

- Added a public access-level note so Aurora can answer normal questions about guest, signed-in, and trusted access without treating them as secrets.

## 0.1.140 - 2026-04-30

- Fixed Aurora's signed-in account context so configured owner accounts are labeled correctly.

## 0.1.139 - 2026-04-30

- Made Aurora lean harder into imagination-led creative freedom for harmless play.

## 0.1.138 - 2026-04-30

- Made Aurora more willing to stay playful and in-character for harmless bits, roleplay, performance, and impossible-action prompts.

## 0.1.137 - 2026-04-30

- Aligned public Liminal docs with the current concrete test-chamber direction.
- Added direct Resume actions inside Liminal's Settings and Help panels so returning to mouse-look no longer requires backing out to the main options menu first.

## 0.1.136 - 2026-04-29

- Made Escape close Liminal's main options menu without relying on a focused Resume button.

## 0.1.135 - 2026-04-29

- Made Liminal's Escape menu close again with Escape while mouse-look is still captured.

## 0.1.134 - 2026-04-29

- Stopped Liminal from repeatedly trying and failing to relock mouse-look from the options-menu Escape key.

## 0.1.133 - 2026-04-29

- Made Liminal's options-menu Escape resume try to return directly to mouse-look instead of dropping into an unlocked play state.

## 0.1.132 - 2026-04-29

- Polished Liminal settings tabs and mouse-look failure guidance.

## 0.1.131 - 2026-04-29

- Fixed Liminal mouse-look failure feedback after closing the options menu.

## 0.1.130 - 2026-04-29

- Made `/clear` reset Aurora chat without an extra confirmation prompt.

## 0.1.129 - 2026-04-29

- Added `/clear` in Aurora's chat input.
- Added up/down input recall to Aurora chat and the homepage terminal.

## 0.1.128 - 2026-04-29

- Fixed an empty chat page feeling like it had extra scroll space.

## 0.1.127 - 2026-04-29

- Improved Aurora's ability to keep track of longer same-chat conversations.

## 0.1.126 - 2026-04-29

- Updated trusted-account chat and Wall allowances.
- Limited the smart chat model to trusted signed-in accounts.
- Raised the chat input limit to 4096 characters.

## 0.1.125 - 2026-04-29

- Changed this repository into a sanitized public documentation surface.
- Moved implementation source out of the public repo.
- Simplified public docs so they describe visitor-facing behavior instead of implementation details.

## 0.1.124 - 2026-04-29

- Polished account, chat, and public documentation behavior.

## 0.1.123 - 2026-04-29

- Aurora now acknowledges the site's rainbow/light-show chat effect when visitors mention seeing it.

## 0.1.122 - 2026-04-29

- Restored whole-message rainbow rendering for Aurora replies that naturally include Pride trigger words.
- Kept extra animated letter-split styling on matching trigger words.

## 0.1.121 - 2026-04-29

- Fixed Pride trigger words staying visible while animated in chat replies.

## 0.1.120 - 2026-04-29

- Tuned Aurora's personality so queer/Pride identity stays contextual and easter-egg-like instead of taking over ordinary replies.

## 0.1.119 - 2026-04-29

- Changed the Pride chat effect so explicit trigger words get the goofy animated letter treatment.

## 0.1.118 - 2026-04-29

- Added a small contextual queer/Pride identity layer to Aurora.

## 0.1.117 - 2026-04-29

- Added the first Aurora rainbow/Pride visual treatment in chat replies.

## 0.1.116 - 2026-04-28

- Improved Aurora's ability to answer factual public actora.art questions from public docs.

## 0.1.115 - 2026-04-28

- Added public-doc grounding support for Aurora.

## Earlier releases

Earlier public release notes were compacted as part of the repository sanitization pass. The live site is the source of current visitor-facing behavior.
