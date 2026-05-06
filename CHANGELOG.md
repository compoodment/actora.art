# Changelog

Public release notes for actora.art.

This changelog is visitor-facing. Private implementation, operations, and remediation details are not documented in the public repo.

## 0.1.237 - 2026-05-06

- Added the selected dark contour artwork as a header on `/info`.

## 0.1.236 - 2026-05-06

- Replaced the browser-tab favicon with a cleaner transparent `A` mark derived from the approved full-scale logo direction.

## 0.1.235 - 2026-05-06

- Replaced the browser-tab favicon with a transparent pixel-style `A` mark so it reads better at 16px without a background tile.

## 0.1.234 - 2026-05-06

- Made the browser-tab favicon visibly readable at tab size.

## 0.1.233 - 2026-05-06

- Made the homepage tab-title gap animation easier to see in browser tabs.

## 0.1.232 - 2026-05-06

- Added the approved actora.art brand mark across favicons, app icons, link previews, and the homepage tab-title gap animation.

## 0.1.231 - 2026-05-05

- Added a soft cat-meow sound to the terminal `meow` easter egg.

## 0.1.230 - 2026-05-05

- Removed the terminal `cat readme` pseudo-file so `cat` suggestions only show real page targets.

## 0.1.229 - 2026-05-05

- Fixed terminal autocomplete typing lag while suggestions are open.

## 0.1.228 - 2026-05-05

- Made the terminal autocomplete panel size to its suggestions instead of stretching across the terminal.

## 0.1.227 - 2026-05-05

- Changed terminal completions to open automatically while typing, with arrow-key selection and Tab accepting the active completion while Enter still submits the typed command.

## 0.1.226 - 2026-05-05

- Changed terminal Tab completions into a small scrollable panel under the prompt.

## 0.1.225 - 2026-05-05

- Replaced the homepage terminal startup line with cleaner command-hint copy.

## 0.1.224 - 2026-05-05

- Polished the homepage terminal with clearer startup/help copy, command and page typo suggestions, and shell-like Tab completion.

## 0.1.223 - 2026-05-04

- Removed the stale `/lab/orbits` Home camera button now that Focus and Track cover the useful navigation controls.

## 0.1.222 - 2026-05-04

- Moved the `/lab/orbits` exit control to the left side of the main controls panel header so it is no longer grouped beside the collapse button.

## 0.1.221 - 2026-05-04

- Redesigned `/lab/orbits` bodies panel into cleaner single-line tree rows with compact expand and visibility controls, moved system hide/show into the selected-body inspector, and made panel/section collapse controls visually consistent.

## 0.1.220 - 2026-05-04

- Improved `/lab/orbits` body-panel readability with clearer button styling and secondary hide controls, and made orbit trails follow the current displayed/dominant parent for edited systems such as Pallas around Earth.

## 0.1.219 - 2026-05-04

- Fixed `/lab/orbits` lag from the new bodies tree by caching current-system hierarchy work and avoiding repeated dominance calculations during rendering/trails.

## 0.1.218 - 2026-05-04

- Cleaned up `/lab/orbits` body controls: factual asteroid labels, a collapsible current-system bodies tree, separate body/system visibility hiding that keeps gravity active, better same-system Track zoom, a collapsible main controls panel, and no spatial dots for now.

## 0.1.217 - 2026-05-04

- Changed `/lab/orbits` visible body-type labels from bare `small` to `small body`.

## 0.1.216 - 2026-05-04

- Added the first `/lab/orbits` create-body checkpoint: players can spawn a small body, moon, or planet around a chosen reference with gravity-aware validation, generated names, readable distance notes, and live N-body insertion.

## 0.1.215 - 2026-05-04

- Renamed the `/lab/orbits` selected-body `advanced edit` button back to plain `edit` while keeping the paused, stable editing behavior.

## 0.1.214 - 2026-05-04

- Fixed `/lab/orbits` advanced edit fields so opening advanced edit pauses time and mass/position/velocity values stay editable while typing instead of snapping back to the live readout.

## 0.1.213 - 2026-05-04

- Made `/lab/orbits` set-orbit distances easier to understand by showing the AU value as km/million-km text, explaining that 1 AU is the Earth-Sun distance, and showing the local trusted distance limit when available.

## 0.1.212 - 2026-05-04

- Fixed `/lab/orbits` set-orbit behavior so broad planet-centered orbit requests that live gravity would tear away now warn/disable instead of pretending they will hold, while Sun, Moon/Earth, and compact giant-planet moon orbit starts remain available.

## 0.1.211 - 2026-05-04

- Reworded `/lab/orbits` selected-body editing to player-facing `set orbit` and `advanced edit` controls, and tightened the orbit setter so it avoids self-orbit choices and too-small starting distances.

## 0.1.210 - 2026-05-04

- Added a first `/lab/orbits` orbit-intent editor: selected bodies can choose a temporary reference body, distance, direction, and optional child carrying, then apply a circular state-vector edit while gravity remains all-to-all.

## 0.1.209 - 2026-05-04

- Renamed `/lab/orbits` selected-body editing to `raw edit`, clarified that parent/reference labels do not constrain all-to-all gravity, and added optional child carrying for parent position/velocity raw edits.

## 0.1.208 - 2026-05-04

- Moved `/lab/orbits` selected-body edit fields behind an explicit inspector edit toggle so the default body readout stays cleaner.

## 0.1.207 - 2026-05-03

- Fixed `/lab/orbits` selected-body mass units so the Sun uses Solar masses (`Msol`) while planets, moons, dwarf planets, and small bodies use Earth masses (`Mearth`).

## 0.1.206 - 2026-05-03

- Standardized selected-body mass display and editing in `/lab/orbits` to Earth masses (`Mearth`) instead of mixing Earth masses and raw kilograms.

## 0.1.205 - 2026-05-03

- Removed the step/trust rows from `/lab/orbits` so the default panel stays focused on controls, time, and actionable warnings.

## 0.1.204 - 2026-05-03

- Added Eris, Haumea, and Makemake to `/lab/orbits` as sourced Solar System dwarf planets with body-list relationships and Sun-relative trails/focus behavior.

## 0.1.203 - 2026-05-03

- Added Ceres, Pallas, Vesta, and Hygiea to `/lab/orbits` as sourced Solar System bodies with body-list relationships and Sun-relative trails/focus behavior.

## 0.1.202 - 2026-05-03

- Removed the overly technical model row from `/lab/orbits` and rewrote the source note in plainer language.

## 0.1.201 - 2026-05-03

- Added a compact simulation trust readout to `/lab/orbits` showing the seeded/editable model, fixed-step status, and nominal/caution/clamped state without surfacing the full internal diagnostics panel.

## 0.1.200 - 2026-05-03

- Added Neptune moons — Triton, Naiad, Thalassa, Despina, Galatea, Larissa, and Proteus — to `/lab/orbits` as sourced Solar System bodies with nested body-list relationships and Neptune-relative trails/focus behavior.

## 0.1.199 - 2026-05-03

- Changed `/lab/orbits` default time scale to `5,000x` so the scene is moving visibly on first load.

## 0.1.198 - 2026-05-03

- Renamed `/lab/orbits` Follow to Track/Untrack so the action better matches its freecam tracking behavior.

## 0.1.197 - 2026-05-03

- Fixed `/lab/orbits` Follow close zoom for tiny overview-scale bodies so tracked moons can be approached much more closely.

## 0.1.196 - 2026-05-03

- Changed `/lab/orbits` Follow zoom to allow the same close-range body-relative zoom freedom as Focus while staying in freecam tracking mode.

## 0.1.195 - 2026-05-03

- Reworked `/lab/orbits` Follow as freecam tracking: it centers and tracks the selected body from the current camera distance/direction without using Focus/local framing.

## 0.1.194 - 2026-05-03

- Rolled `/lab/orbits` Follow start-position conversion back after it made the transition worse.

## 0.1.192 - 2026-05-03

- Changed `/lab/orbits` Follow to smoothly move into the selected body's tracking position instead of snapping there instantly.

## 0.1.191 - 2026-05-03

- Changed `/lab/orbits` orbit trails to default to `0.3` and use numeric trail-length labels.
- Added a Follow action that locks onto the selected body from the current camera distance/direction instead of zoom-framing it.

## 0.1.190 - 2026-05-03

- Rolled `/lab/orbits` focused-view context trail layer back after it placed full-system trail context into the focused local view instead of preserving correct distant context.

## 0.1.188 - 2026-05-03

- Rolled `/lab/orbits` trail fading back after the previous visibility adjustment did not resolve the distant focused-view trail patchiness.

## 0.1.187 - 2026-05-03

- Adjusted `/lab/orbits` orbit trail fading so distant trails keep more visible continuity while inspecting focused local views.

## 0.1.186 - 2026-05-03

- Rolled `/lab/orbits` trail rendering back to the last less-broken baseline after the wide-line trail experiments made distant focused-view trails look worse.

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
