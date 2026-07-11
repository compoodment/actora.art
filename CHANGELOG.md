# Changelog

Public release notes for actora.art.

This changelog is visitor-facing. Private implementation, operations, and remediation details are not documented in the public repo.

## 0.2.371 - 2026-07-11

- Smoothed the Space loading screen's final phase on slower connections.

## 0.2.370 - 2026-07-11

- Removed unused Create and Missions features from the Space lab game menu.

## 0.2.369 - 2026-07-11

- Smoothed the Space loading sequence so its stages and progress advance steadily while the real scene continues loading underneath.

## 0.2.368 - 2026-07-11

- Simplified the Space loading animation to three orbiting bodies with matching recent-path trails.

## 0.2.367 - 2026-07-11

- Corrected the Space loading orbital animation so bodies and their paths move together.

## 0.2.366 - 2026-07-11

- Redesigned the Space lab loading screen around a clearer orbital system display with real loading progress.

## 0.2.365 - 2026-07-11

- Space lab now finishes loading its scene textures before opening the simulation, avoiding texture-related lag after entry.

## 0.2.364 - 2026-07-11

- Reduced Space lab texture downloads by serving WebP versions of its color imagery while keeping lighting-detail maps intact.

## 0.2.363 - 2026-07-11

- Made the Space lab start faster and show clearer loading progress, while high-detail textures continue loading in the background.

## 0.2.362 - 2026-07-11

- Fixed the Space lab Objects panel collapse button so it actually hides the object list.

## 0.2.361 - 2026-07-10

- Fixed Space lab body creation controls, improved mobile control accessibility, and reduced the default Space texture load.

## 0.2.360 - 2026-07-05

- Improved music adding and management with a clearer signed-in upload control, owner-side song search, and an edit panel that stays near the top instead of being buried below long track lists.

## 0.2.359 - 2026-06-20

- Removed the abandoned YouTube URL import option from the music draft tools.

## 0.2.357 - 2026-06-17

- Fixed public playlist cover uploads still failing with HTTP 413 after image selection.

## 0.2.356 - 2026-06-17

- Fixed large music cover uploads that could fail with HTTP 413 even when the cover image itself was within the allowed size.

## 0.2.355 - 2026-06-17

- Fixed music playlist cover uploads so selected playlist art is saved and shown.

## 0.2.354 - 2026-06-17

- Fixed the music playlist cover button so selected cover images are reliably picked for upload.

## 0.2.353 - 2026-06-16

- Improved music cover uploads so large selected images are prepared before upload.

## 0.2.352 - 2026-06-16

- Fixed playlist cover changes so newly uploaded playlist art appears immediately.

## 0.2.351 - 2026-06-16

- Improved the desktop music player visualizer with a fuller waveform-style motion across the whole footer.

## 0.2.350 - 2026-06-16

- Improved the desktop music player waveform so the full-width visualizer moves more naturally across the whole player.

## 0.2.349 - 2026-06-16

- Fixed iPad music track rows so song titles stay visible.

## 0.2.348 - 2026-06-16

- Improved the mobile music library so playlists and albums work as clearer collapsed source pickers before showing tracks.

## 0.2.347 - 2026-06-16

- Improved iPhone background playback by keeping mobile Safari on native audio playback instead of the visualizer audio path.

## 0.2.346 - 2026-06-16

- Smoothed the signed-in music upload quota label near the 1 GB limit.

## 0.2.345 - 2026-06-16

- Fixed music row cover play buttons so the generic button height no longer stretches them.

## 0.2.344 - 2026-06-16

- Fixed music cover button boxes so row and now-playing covers are square.

## 0.2.343 - 2026-06-16

- Corrected music cover play buttons so the full cover stays visible instead of being cropped.

## 0.2.342 - 2026-06-16

- Fixed music row cover play buttons so album art remains square.

## 0.2.341 - 2026-06-16

- Fixed music album assignment so adding a user-uploaded track to an album keeps it in the all-tracks library and targets the exact album.
- Replaced the separate row play button with a cover-art play overlay.
- Reduced false playback warning toasts when audio is already playing.

## 0.2.340 - 2026-06-16

- Moved music status notifications to a top-right toast so they no longer affect the player layout.

## 0.2.339 - 2026-06-16

- Added hover highlighting to music track rows.

## 0.2.338 - 2026-06-16

- Moved music song actions into a right-click/action menu and added owner YouTube URL audio import to drafts.

## 0.2.337 - 2026-06-16

- Improved the signed-in music upload flow with drag-and-drop and a cleaner batch details step.

## 0.2.336 - 2026-06-16

- Added album, artist, year, and cover options for signed-in music uploads, with user-owned album grouping.

## 0.2.335 - 2026-06-16

- Let signed-in users delete music tracks they uploaded themselves.

## 0.2.334 - 2026-06-15

- Reduced the overall music page UI sizing so the player and library feel less zoomed in.

## 0.2.333 - 2026-06-15

- Matched music playlist row sizing to album rows so the library sidebar is more consistent.

## 0.2.332 - 2026-06-15

- Improved the phone music library with collapsible Playlists and Albums sections and roomier playlist rows.

## 0.2.331 - 2026-06-15

- Improved music lock-screen/background playback behavior on iPhone and iPad.

## 0.2.330 - 2026-06-15

- Added signed-in user music uploads with a 1GB quota and immediate shared-library publishing.

## 0.2.329 - 2026-06-15

- Fixed empty music Actions columns showing when no row actions are available.

## 0.2.328 - 2026-06-15

- Fixed invisible music action icons on iPad Safari.

## 0.2.327 - 2026-06-15

- Fixed music track actions being pushed out of view on iPad/tablet widths.

## 0.2.326 - 2026-06-15

- Hid the shared footer on phone-width music pages while keeping it on tablet and desktop.

## 0.2.325 - 2026-06-15

- Improved the music page on iPad and iPhone with a cleaner responsive layout and fixed compact player overlap.

## 0.2.324 - 2026-06-15

- Moved music library search and sort above the playlist list controls.

## 0.2.323 - 2026-06-15

- Added playlist renaming from editable playlist pages.

## 0.2.322 - 2026-06-15

- Added editable playlist covers, moved SoundCloud Files volumes into playlists, and fixed playlist track time alignment.

## 0.2.321 - 2026-06-15

- Fixed SoundCloud Files volume albums being merged across different artists.

## 0.2.320 - 2026-06-15

- Removed the experimental browser-local music folder/file mode.

## 0.2.319 - 2026-06-15

- Fixed music playback being blocked when browser visualizer setup fails.

## 0.2.318 - 2026-06-15

- Fixed music playback starts being blocked on some browsers after selecting a track.

## 0.2.317 - 2026-06-15

- Added direct local audio file selection to music local mode, alongside whole-folder selection.

## 0.2.316 - 2026-06-15

- Fixed a music state refresh issue that could make playlists disappear while navigating.

## 0.2.315 - 2026-06-15

- Fixed music status messages so they no longer shift the fixed player controls.

## 0.2.314 - 2026-06-15

- Added a remove-from-playlist action for music playlist track rows.

## 0.2.313 - 2026-06-15

- Made local folder music mode signed-in and browser-persistent when folder permission remains granted.

## 0.2.312 - 2026-06-15

- Added local folder mode for browser-only music playback without uploading audio files.

## 0.2.311 - 2026-06-15

- Changed the default music library sort to Artist.

## 0.2.310 - 2026-06-15

- Improved music album search for mixed-artist albums and cleaned Tyler/Bastard metadata.

## 0.2.309 - 2026-06-15

- Added a visible shuffle active state and fixed cramped album rows in the music rail.

## 0.2.308 - 2026-06-15

- Kept fresh music page loads on All tracks instead of auto-selecting the first album.

## 0.2.307 - 2026-06-15

- Made the now-playing title jump back to its album or playlist and tightened music table header alignment.

## 0.2.306 - 2026-06-15

- Restored the music player waveform as a full-width player background.

## 0.2.305 - 2026-06-15

- Added release-year import and year sorting for the music album library.

## 0.2.304 - 2026-06-15

- Added automatic lyric import for uploaded music when the audio file already contains embedded lyrics.

## 0.2.303 - 2026-06-15

- Moved music track search into the selected album/playlist header, added left-rail library search/sort, and added playlist drag reordering.

## 0.2.302 - 2026-06-15

- Fixed the music footer/player order, tightened the music page density, and made the left playlist/album rail more compact.

## 0.2.301 - 2026-06-15

- Restored the shared actora.art footer on the music page above the fixed music player.

## 0.2.300 - 2026-06-15

- Replaced the music playlist add dropdowns with compact in-page playlist menus.

## 0.2.299 - 2026-06-15

- Added real track durations to the music table and made playlist add controls available for every playlist the signed-in viewer can edit.

## 0.2.298 - 2026-06-15

- Fixed music track table column alignment and added a seek bar with elapsed/total time to the persistent player.

## 0.2.297 - 2026-06-15

- Fixed music album grouping so mixed-artist albums stay together instead of splitting into separate albums per track artist.

## 0.2.296 - 2026-06-15

- Added clearer music playlist add controls for selected track lists and individual tracks.
- Fixed confusing music page state where All tracks could still show the current album cover, Manage kept stale edit forms open, and the fixed player sat too tightly over page content.

## 0.2.295 - 2026-06-15

- Fixed the main music Shuffle action so it starts shuffled playback for the selected album, playlist, library, or search results.
- Fixed playlist creation so the plus button opens the create field instead of sitting disabled.

## 0.2.294 - 2026-06-15

- Fixed music shuffle so playback uses a real shuffled order, avoids immediate random repeats, and makes previous follow listening history.
- Stopped the player from silently looping albums/playlists when no repeat control exists, and replaced the fake volume bar with a working slider.

## 0.2.293 - 2026-06-15

- Fixed the collapsed lyrics rail on `/music` so it actually gives space back to the track list.

## 0.2.292 - 2026-06-15

- Tightened `/music` behavior by removing dead controls, stacking playlists and albums in one left rail, making lyrics collapsible, and improving batch album uploads with embedded metadata.

## 0.2.291 - 2026-06-15

- Tightened the `/music` layout density so the page shows more of the album and track list at once.

## 0.2.290 - 2026-06-15

- Reworked `/music` around a clearer playlist, album, track, lyrics, and bottom-player layout with icon controls.

## 0.2.289 - 2026-06-15

- Fixed music uploads for normal song-sized files and made upload status feedback clearer.

## 0.2.288 - 2026-06-15

- Added `/music`, a public music library and player with albums, playlists, lyrics access, visualizer, and a persistent bottom player.
- Added owner-managed uploads and drafts for publishing music to the public library.

## 0.2.287 - 2026-05-30

- Added locked `actoraOS v<joined-version> Beta` badges for beta-era accounts.
- Added profile status pills, profile theme presets, and custom accent colors.

## 0.2.284 - 2026-05-28

- Fixed public profile page caching so signed-in visitors' account footer state is never served with public cache headers.

## 0.2.283 - 2026-05-28

- Tightened profile image uploads so avatar and badge image data must match the declared PNG, JPEG, or WebP type.

## 0.2.282 - 2026-05-28

- Fixed social request notifications so accepting or declining a friend request does not make the handled request unread again.

## 0.2.281 - 2026-05-28

- Fixed social notifications so DMs from ended friendships no longer leave an unread badge with no visible thread.

## 0.2.280 - 2026-05-24

- Retired Dicky's public site surface and removed the hidden terminal shortcut.

## 0.2.279 - 2026-05-23

- Changed the terminal find command wording to "find a profile".

## 0.2.278 - 2026-05-23

- Rewrote the terminal `what?` response into a clearer usage flow.
- Shortened the terminal find command wording to "find a username".

## 0.2.277 - 2026-05-23

- Updated the homepage terminal so account commands match sign-in state: guests see register/login, and signed-in users see logout.
- Removed the unused `cat` and `whoareu` terminal commands.

## 0.2.276 - 2026-05-23

- Fixed live social updates jumping conversations back to the top.

## 0.2.275 - 2026-05-23

- Added live social updates so DMs and social notifications can arrive without refreshing the page.

## 0.2.274 - 2026-05-23

- Fixed iPhone Safari zooming the page when focusing the social message input.

## 0.2.273 - 2026-05-23

- Fixed the mobile footer so the construction notice and actoraOS link no longer cover the social button.

## 0.2.272 - 2026-05-23

- Fixed shared social message bubbles so incoming and outgoing messages both size to their text.

## 0.2.271 - 2026-05-23

- Made one-way System/Aurora message bubbles use a consistent readable width. Replaced by 0.2.272's shared text-sized bubble alignment.

## 0.2.270 - 2026-05-23

- Updated social notifications so opening an unread System or DM thread clears that thread's badge immediately, and System messages now show Aurora as their sender.

## 0.2.269 - 2026-05-23

- Added notification badges inside the social popup and kept the footer social label from shifting when the badge appears.

## 0.2.268 - 2026-05-23

- Fixed a footer social notification badge regression that could make the site stop responding.

## 0.2.267 - 2026-05-23

- Added a footer social notification count for new Sys notices and incoming DMs.

## 0.2.266 - 2026-05-23

- Fixed the footer `social` DM send button and removed the popup shadow.

## 0.2.265 - 2026-05-23

- Reworked the footer `social` popup into a compact support-chat-style inbox anchored above the shared footer instead of a docked panel.

## 0.2.264 - 2026-05-23

- Added social v0: exact username finding from the homepage terminal, profile friend requests, a footer `social` popup, Sys request notifications, and friends-only DMs.

## 0.2.263 - 2026-05-22

- Fixed `/lab/space` startup on iPad/tablet-sized touch devices by using a lighter initial graphics path.

## 0.2.262 - 2026-05-22

- Fixed the Wall toolbar so pending erases do not show as available characters before they are confirmed.

## 0.2.261 - 2026-05-22

- Let `/account` avatar upload limits span the top profile block instead of being squeezed under the avatar.

## 0.2.260 - 2026-05-22

- Moved `/account` avatar upload limits text into the avatar upload area.

## 0.2.259 - 2026-05-22

- Clarified `/account` profile saving so bio/links and badge saves are visibly separate.

## 0.2.258 - 2026-05-22

- Cleaned up `/account` profile layout spacing, avatar controls, and link/badge/passkey separation.

## 0.2.257 - 2026-05-22

- Fixed `/account` avatar uploads and made avatar image selection/clearing save immediately.

## 0.2.256 - 2026-05-22

- Added editable username/display name on `/account` and made public profiles show display name as the main heading with username as the handle.

## 0.2.255 - 2026-05-22

- Fixed /u/:username profile footers so signed-in visitors are identified immediately instead of first showing @guest, and tightened footer alignment on short profile pages.

## 0.2.254 - 2026-05-22

- Matched /u/:username profile pages to the site's normal footer styling and identity behavior.

## 0.2.253 - 2026-05-22

- Restored profile-page footer navigation, compacted badge editing on /account, removed badge descriptions, and improved profile image upload handling.

## 0.2.252 - 2026-05-22

- Cleaned up account profile settings, made profile visibility switch immediately, and removed text-based avatar/badge icons from public profiles.

## 0.2.251 - 2026-05-22

- Added opt-in public profiles at `/u/:username` with account-managed bios, links, avatars, and display-only badges.

## 0.2.250 - 2026-05-22

- Made the Space startup loader dots faster and easier to see.

## 0.2.249 - 2026-05-22

- Made the Space startup loader dot animation more reliable after page refreshes.

## 0.2.248 - 2026-05-21

- Reversed the Space startup loader orbit animation direction so the arc fade trails behind the bright edge.

## 0.2.247 - 2026-05-21

- Lowercased the Space startup loader label to `loading`.

## 0.2.246 - 2026-05-21

- Set Space's default simulation speed to `1 hour/s` and cleaned up the startup loader animation.

## 0.2.245 - 2026-05-21

- Smoothed the Space startup loader animation and replaced the visible asset counter with a simple animated `Loading...` label.

## 0.2.244 - 2026-05-21

- Replaced the plain Space startup loader with an animated orbital loading screen and a real asset counter tied to initial texture loading.

## 0.2.243 - 2026-05-21

- Added a real startup loading screen to `/lab/space` so the simulation waits to appear until its initial textures and first render are ready.

## 0.2.242 - 2026-05-21

- Upgraded Mimas and Tethys in `/lab/space` to source-guided 4K and 8K visual texture variants.

## 0.2.241 - 2026-05-21

- Upgraded Titan in `/lab/space` to source-guided 4K and 8K visual texture variants.

## 0.2.240 - 2026-05-21

- Upgraded Enceladus, Dione, Rhea, and Iapetus in `/lab/space` to source-guided 4K and 8K visual texture variants.

## 0.2.239 - 2026-05-20

- Made Dicky's Sound Forge site at `dicky.actora.art` publicly accessible.

## 0.2.238 - 2026-05-20

- Upgraded Ganymede and Callisto in `/lab/space` to source-guided 4K and 8K visual texture variants with cleaner globe continuity.

## 0.2.237 - 2026-05-20

- Upgraded Europa in `/lab/space` to repaired USGS/Voyager-Galileo-derived 4K and 8K texture variants with cleaner globe continuity.

## 0.2.236 - 2026-05-20

- Upgraded Io in `/lab/space` to repaired USGS/Galileo-derived 4K and 8K texture variants for cleaner close-up viewing.

## 0.2.235 - 2026-05-20

- Slowed Earth cloud drift in `/lab/space` so the cloud layer is only slightly faster than Earth's surface rotation.

## 0.2.234 - 2026-05-20

- Restored Earth cloud drift in `/lab/space` to the two-simulation-hour relative period.

## 0.2.233 - 2026-05-20

- Tuned Earth cloud drift in `/lab/space` to a five-simulation-hour relative period.

## 0.2.232 - 2026-05-20

- Made Earth cloud drift in `/lab/space` more noticeable at real-time speed while keeping it tied to simulation time.

## 0.2.231 - 2026-05-20

- Adjusted Earth cloud drift in `/lab/space` so cloud motion follows simulation time instead of the browser clock.

## 0.2.230 - 2026-05-20

- Added slow Earth cloud drift to `/lab/space`, giving the cloud layer gentle motion independent from the planet surface.

## 0.2.229 - 2026-05-20

- Fixed tidal-lock moon orientation: Phobos, Deimos, and other tidally locked moons no longer appear to rotate with the camera when tracking and orbiting them.

## 0.2.228 - 2026-05-19

- Removed an accidental hidden terminal alias.

## 0.2.227 - 2026-05-19

- Hid private utility shortcuts from the terminal help/autocomplete surface while keeping them runnable.

## 0.2.226 - 2026-05-19

- Added a `dicky` terminal command that opens Dicky's Sound Forge site.

## 0.2.225 - 2026-05-19

- Restored the `/lab/space` Asteroid belt row qualifier as `visual` instead of the longer `visual layer` copy.

## 0.2.224 - 2026-05-19

- Removed the visible `visual layer` subtitle from the `/lab/space` Asteroid belt row.

## 0.2.223 - 2026-05-19

- Removed the broad spherical Sun outer corona shells and anchored `/lab/space` prominence arcs into the surface.

## 0.2.222 - 2026-05-19

- Replaced the fixed-size `/lab/space` Sun fringe point haze with tighter world-scaled chromosphere fringe and plume shells.

## 0.2.221 - 2026-05-19

- Added a stronger fuzzy red-orange Sun edge fringe and denser limb haze around the `/lab/space` corona.

## 0.2.220 - 2026-05-19

- Added irregular near-surface Sun corona wisps and subtle plasma dust around the `/lab/space` prominence arcs.

## 0.2.219 - 2026-05-19

- Reduced the largest `/lab/space` Sun prominence arcs so the corona scale sits closer to the surface.

## 0.2.218 - 2026-05-19

- Reworked the `/lab/space` Sun corona into 3D plasma shells and prominence filaments instead of a flat glow sprite.

## 0.2.217 - 2026-05-19

- Switched `/lab/space` Sun rendering back to the SolarSystemScope texture with a brighter emissive shader pass.

## 0.2.216 - 2026-05-19

- Switched `/lab/space` Saturn, Uranus, and Neptune to SolarSystemScope texture sources.

## 0.2.215 - 2026-05-19

- Switched `/lab/space` Jupiter to SolarSystemScope high/low quality textures.

## 0.2.214 - 2026-05-19

- Switched `/lab/space` Mercury to SolarSystemScope high/low quality textures.

## 0.2.213 - 2026-05-19

- Made Venus' atmosphere in `/lab/space` rotate independently from the surface.

## 0.2.212 - 2026-05-19

- Added SolarSystemScope Venus surface and atmosphere textures to `/lab/space` quality modes.

## 0.2.211 - 2026-05-19

- Switched `/lab/space` Mars color rendering to SolarSystemScope 8K in `high` quality and 2K in `low` quality.

## 0.2.210 - 2026-05-19

- Moved the `/lab/space` simulation date into the `time` control header.

## 0.2.209 - 2026-05-19

- Right-aligned the `/lab/space` controls-panel readout values so `time` lines up with the other right-edge controls.

## 0.2.208 - 2026-05-19

- Moved the `/lab/space` object-names checkbox to the end of its row.

## 0.2.207 - 2026-05-19

- Restored the original Sun texture in `/lab/space` for both quality modes.

## 0.2.206 - 2026-05-19

- Tightened the `/lab/space` `quality` dropdown so it renders as a compact inline control.

## 0.2.205 - 2026-05-19

- Replaced the `/lab/space` optimization-mode checkbox with a `quality` dropdown offering `high` and `low`.

## 0.2.204 - 2026-05-19

- Added a `/lab/space` optimization mode control for switching primary body and sky textures between high-detail and lower-bandwidth variants.

## 0.2.203 - 2026-05-19

- Switched `/lab/space` Moon and Sun rendering to SolarSystemScope 8K texture assets.

## 0.2.202 - 2026-05-19

- Switched `/lab/space` Earth rendering to SolarSystemScope 8K day, night, normal, specular, and cloud textures.

## 0.2.201 - 2026-05-19

- Fixed `/lab/space` trail tails so they fade transparent instead of darkening into a black line over bright bodies.

## 0.2.200 - 2026-05-19

- Fixed short `/lab/space` trail settings so tiny close-orbit bodies such as Mars's moons and ISS keep visible trail arcs instead of disappearing.

## 0.2.199 - 2026-05-19

- Made `/lab/space` object-name labels collapse child objects into their leading body at distant views, reducing Moon/ISS and large moon-system label clutter until the camera is close enough.

## 0.2.198 - 2026-05-18

- Made `/lab/space` object-name labels follow moving bodies smoothly.

## 0.2.197 - 2026-05-18

- Removed a retired prototype from the live Lab.

## 0.2.196 - 2026-05-18

- Moved the Actora web shell to `/projects/actora` and removed it from the Lab list.

## 0.2.195 - 2026-05-18

- Regenerated favicon ICO assets and made favicon generation reproducible from frontend dependencies.

## 0.2.194 - 2026-05-18

- Improved Liminal, Wall, and Orbits lifecycle handling around pointer lock, saved Wall tool preferences, and late ISS model loads.

## 0.2.193 - 2026-05-18

- Improved terminal and account-page auth status handling so failed auth actions surface as errors instead of settling as successful UI states.

## 0.2.192 - 2026-05-18

- Improved Wall shortcut focus handling and blank-character validation, and avoided creating Wall budget records for invalid or no-op Wall actions.

## 0.2.191 - 2026-05-18

- Disabled footer forward navigation when the browser cannot confirm forward history, and tightened chat request validation before limit handling.

## 0.2.190 - 2026-05-18

- Fixed account-page logout failure handling so the page stays on the account screen and shows an error if logout does not complete.

## 0.2.189 - 2026-05-18

- Moved the `see whole system` explanation into the left controls, placed the camera button next to pause, and improved distant free-roam zoom scaling.

## 0.2.188 - 2026-05-18

- Improved `/lab/space` free-roam camera behavior near bodies and added a `see whole system` action that tracks the Sun from a whole-system distance.

## 0.2.187 - 2026-05-18

- Lowered `/lab/space` Earth's floating night-light overlay to just above the surface.

## 0.2.186 - 2026-05-18

- Lowered `/lab/space` Earth's floating night-light overlay another small step toward the surface.

## 0.2.185 - 2026-05-18

- Lowered `/lab/space` Earth's floating night-light overlay slightly toward the surface while keeping it separate from the surface material.

## 0.2.184 - 2026-05-18

- Restored `/lab/space` Earth night lights to the previous floating overlay above the surface and below the cloud layer.

## 0.2.183 - 2026-05-18

- Restored `/lab/space` Earth night lights to the older night-map source and removed the seam mask that caused a black line.

## 0.2.182 - 2026-05-18

- Tuned `/lab/space` close-up Earth night rendering so the nighttime texture seam is hidden and city lights read less blue.

## 0.2.181 - 2026-05-18

- Improved `/lab/space` close-up body rendering so Earth night lights sit on the surface under the cloud layer and spherical planets/moons have smoother silhouettes.

## 0.2.180 - 2026-05-18

- Reworked the `/lab/space` asteroid belt so distant views show a faint haze, closer views reveal dust, and the grains drift slowly around the Sun.

## 0.2.179 - 2026-05-18

- Tuned the `/lab/space` asteroid belt so it is dimmer from far away and stays faintly visible longer while zooming in.

## 0.2.178 - 2026-05-18

- Added a faint default-on asteroid belt dust layer to `/lab/space`, with a new Objects-panel toggle for hiding or showing it.

## 0.2.177 - 2026-05-16

- Fixed Aurora chat unarchive behavior so the chat you unarchive stays open instead of jumping to another active chat.

## 0.2.176 - 2026-05-16

- Corrected `/lab/space` ISS orientation so the station tracks its low-Earth orbit direction with a steadier Earth-relative attitude.

## 0.2.175 - 2026-05-16

- Inverted `/lab/space` one-finger mobile look so swiping feels like pulling the scene instead of pushing the camera.

## 0.2.174 - 2026-05-16

- Removed the redundant `change body` button from the `/lab/space` phone selected-body sheet.

## 0.2.173 - 2026-05-16

- Fixed `/lab/space` mobile touch handling so one-finger swipes rotate/look instead of zooming.

## 0.2.172 - 2026-05-16

- Reworked `/lab/space` phone controls into a compact top bar, bottom action rail, and one contextual bottom sheet instead of floating panels over the scene.

## 0.2.171 - 2026-05-16

- Moved the collapsed `/lab/space` mobile bodies bar out of the middle of the screen when no body is selected.

## 0.2.170 - 2026-05-16

- Reduced `/lab/space` mobile panel obstruction by opening phone-width views with compact controls and a smaller selected-body inspector.

## 0.2.169 - 2026-05-16

- Improved `/lab/space` Track navigation so selecting bodies from the whole-system view lands at a readable close distance instead of staying far away.

## 0.2.168 - 2026-05-16

- Darkened the ISS Earth-shadow view in `/lab/space` so it no longer looks sunlit while behind Earth.

## 0.2.167 - 2026-05-16

- Updated `/lab/space` so the ISS model follows its orbit frame and darkens when Earth blocks sunlight.

## 0.2.166 - 2026-05-16

- Swapped `/lab/space` to a small official NASA ISS model trial so the International Space Station can be judged live before later real-world orientation work.

## 0.2.165 - 2026-05-16

- Maintenance update for frontend dependencies and the site terminal help command.

## 0.2.164 - 2026-05-15

- Maintenance update for site hardening and reliability.

## 0.2.163 - 2026-05-14

- Smoothed `/lab/space` close Track motion at low and mid time rates so ISS/Earth views advance every rendered frame instead of jumping by one-minute chunks, and removed the close-pass timestep warning from the normal player panel.
- Fixed the `/lab/space` smoke check's mobile reload/touch-camera coverage so the guardrail is reliable again.

## 0.2.162 - 2026-05-14

- Updated `/lab/world-of-war` with versioned higher-resolution generated map assets and same-source reference borders so close zoom has less texture pixelation and less visible border/land mismatch.

## 0.2.161 - 2026-05-14

- Cleaned `/lab/world-of-war` into a quieter map-surface checkpoint: removed debug/status chrome and footer overlay, reduced city dots to a sparse reference set, filtered Baikonur-style lease markers from overlays, and kept the static globe ready for future dynamic gameplay layers.

## 0.2.160 - 2026-05-14

- Restored `/lab/world-of-war` with a real-data Natural Earth globe shell: 1:10m-derived country/coast/admin outlines, generated land texture, small zoom-gated labels/city dots, and deeper globe inspection controls before gameplay work.

## 0.2.159 - 2026-05-14

- Removed the `/lab/world-of-war` globe-shell checkpoint from the live Lab after visual review; the experiment is returning to map-data/design review before another public prototype.

## 0.2.158 - 2026-05-14

- Added the first `/lab/world-of-war` globe-shell checkpoint: a clean-room proof-of-feel for a future real-Earth territory-control experiment with rotate/zoom globe interaction, hand-authored approximate Europe theater lines, city/capital markers, and clear scope notes before conquest systems.

## 0.2.157 - 2026-05-12

- Updated `/lab/actora` action queue behavior so local saves normalize queued actions more like the prototype, Hang out blocks duplicate/dead targets, and queued actions resolve only in the first advanced month.
- Added source-shaped personal action records and tightened Hang out/social decay link syncing for active, dead, and drifted social relationships.

## 0.2.156 - 2026-05-12

- Updated `/lab/actora` so local saves persist a source-shaped event log backing History and Live feed while keeping existing browser saves compatible.

## 0.2.155 - 2026-05-12

- Reworked `/lab/actora` Profile into a compact source-backed card dashboard with drillable details, honest Mood/Needs/Skills placeholders, Relationships tab handoff, and filtered recent records.

## 0.2.154 - 2026-05-12

- Improved `/lab/actora` History and Relationships browsing with year headers/year jump, source-style relationship filters/search, and cleaner player-facing recent record summaries.

## 0.2.153 - 2026-05-12

- Added source-shaped relationship inspect detail to `/lab/actora` for linked family/social/dead lives, including status, dates, core stats, and recent records.

## 0.2.152 - 2026-05-12

- Expanded `/lab/actora` Profile, Relationships, and History tabs so death/continuation state remains visible after handoff.

## 0.2.151 - 2026-05-12

- Expanded `/lab/actora` death/continuation state with source-shaped continuity candidate fields plus death overlay life summary and recent records.

## 0.2.150 - 2026-05-12

- Added source-shaped social grief effects to `/lab/actora`: active friend deaths can now lower happiness and create grief events/records.

## 0.2.149 - 2026-05-12

- Added first-pass death and continuation handling to `/lab/actora`: actors can become dead through old-age mortality, death records are written, and dead focused lives block further advancement.
- Added a continuation overlay for choosing a living linked actor and continuing with a `New Life` marker.

## 0.2.148 - 2026-05-12

- Added custom skip-month input to `/lab/actora`, matching the prototype's numeric custom skip path alongside presets.
- Custom skip accepts up to four digits, rejects `0`, and advances through the normal month-by-month local simulation path.

## 0.2.147 - 2026-05-12

- Updated `/lab/actora` Hang out and monthly social decay so social relationship changes sync into normalized world links instead of only local relationship rows.
- Hang out now writes source-shaped spend-time event records; drift marks social world links as former when closeness reaches zero.

## 0.2.146 - 2026-05-12

- Updated `/lab/actora` meeting choices so introduced NPCs are source-shaped actors with culture-aware names, source age/stat rules, actor records, and social links.
- Added parity/smoke coverage for meeting-generated NPCs.

## 0.2.145 - 2026-05-12

- Added source-backed monthly family birth simulation to `/lab/actora`; eligible families can now welcome later younger siblings during month advancement.
- Later sibling births create real generated child actors, family links, birth records, and a sibling-only player-facing event when relevant.

## 0.2.144 - 2026-05-12

- Added source-shaped startup older siblings to `/lab/actora`; eligible new lives can now include real sibling family actors and family links.
- Sibling-gated monthly events can now become eligible when startup sibling links exist.

## 0.2.143 - 2026-05-12

- Updated `/lab/actora` monthly events to use the full current source-backed human event table, including age/stage, trait, and family-role gates.
- Parent family events can now arise from startup mother/father links while sibling events remain blocked until older siblings exist.

## 0.2.142 - 2026-05-12

- Changed `/lab/actora` actions and monthly events to use source-shaped outcome objects, matching the Actora prototype event contract more closely.
- Kept existing local saves compatible while preparing the local loop for fuller event and relationship consequences.

## 0.2.141 - 2026-05-12

- Added source-shaped startup family scaffolding to `/lab/actora`: new local lives now create mother/father family roles separately from social relationship tiers.
- Moved browser save keys forward for the updated local game-state shape.

## 0.2.140 - 2026-05-12

- Corrected `/lab/actora` local game startup timing so new lives begin on the prototype Year 1 / Month 1 timeline at age 0 / Infant.
- Moved browser save keys forward so older local saves with the previous date model do not load into the corrected timeline.

## 0.2.139 - 2026-05-12

- Expanded `/lab/actora` character creation geography to the current Actora prototype set: 12 countries and 43 cities.
- Added source-backed parity checks for the ongoing Actora web port so future work is measured against the Python prototype instead of partial manual copies.

## 0.2.138 - 2026-05-11

- Removed gender-identity copy from `/lab/actora` character creation entirely; creation now shows only the actual creation identity fields while lifecycle identity choices remain in play.

## 0.2.137 - 2026-05-11

- Corrected `/lab/actora` creation so gender identity is not chosen during character creation; new local lives begin at birth and preserve the teen identity popup flow.

## 0.2.136 - 2026-05-11

- Updated `/lab/actora` character creation so its questionnaire uses the full prototype question set and closer prototype stat/trait behavior before play starts.

## 0.2.135 - 2026-05-11

- Made Character Creation the required `/lab/actora` entry flow before play, with identity, location, appearance, questionnaire/manual creation modes, review, and adult game-state creation instead of starting as a random child.

## 0.2.134 - 2026-05-11

- Expanded `/lab/actora` with a richer local-only prototype loop: human identity, appearance, location, canonical stats/attributes, trait sleep modifiers, month-by-month advancement, pending choices, meeting-generated social links, Hang out actions, relationship state, and fuller profile/history surfaces.

## 0.2.133 - 2026-05-11

- Switched `/lab/actora` to a dark desktop-friendly game surface while keeping the local interactive life loop.

## 0.2.132 - 2026-05-11

- Replaced the static `/lab/actora` mock with a local interactive life loop: saved local state, primary stats, event history, action queue, month advancement, skip-time presets, and Life/Actions/Profile/Relationships/History tabs.

## 0.2.131 - 2026-05-11

- Simplified `/lab/actora` toward a calmer BitLife-like life screen with fewer panels, lighter visuals, clearer controls, and less visual noise.

## 0.2.130 - 2026-05-11

- Cleaned `/lab/actora` dashboard mock copy so it uses canonical placeholder surfaces instead of invented stats, lore, relationship scores, tone labels, or cryptic controls.

## 0.2.129 - 2026-05-11

- Redesigned `/lab/actora` from a scrollable web shell into a fixed-viewport game dashboard with a compact run header, current-life card, action cards, actor state, relation/history surfaces, bottom tabs, and month controls.

## 0.2.128 - 2026-05-11

- Added the first static `/lab/actora` game-mode shell with start/save-lite controls, actor HUD, time controls, action cards, queue, event feed, city context, and Profile/Relationships/History navigation cards.
- Added `/lab/actora` to the Lab list.

## 0.2.127 - 2026-05-10

- Fixed `/lab/space` ISS C Track centering so the camera targets the rendered station.

## 0.2.126 - 2026-05-10

- Swapped `/lab/space` ISS rendering to NASA 3D Resources ISS (C) High Res source for testing before optimization.

## 0.2.125 - 2026-05-10

- Fixed `/lab/space` Track zoom for tiny realistic-scale objects such as ISS.

## 0.2.124 - 2026-05-10

- Restored realistic ISS visual scaling in `/lab/space`; it no longer uses artificial render inflation.

## 0.2.123 - 2026-05-10

- Fixed the ISS visual scale in `/lab/space` so it no longer renders absurdly larger than major bodies.

## 0.2.122 - 2026-05-10

- Shortened the `/lab/space` display name for the International Space Station to `ISS` so it fits better in the mobile inspector.

## 0.2.121 - 2026-05-09

- Added the International Space Station to `/lab/space` as an Earth-orbiting spacecraft with a lightweight NASA 3D Resources model.

## 0.2.120 - 2026-05-09

- Added baseline mobile touch camera controls to `/lab/space`: one-finger drag looks around, pinch zooms, and two-finger vertical drag follows the existing dolly behavior.

## 0.2.119 - 2026-05-09

- Fixed a phone-width `/lab/space` layout bug where selecting a body made the selected-body inspector overlap the bodies panel.

## 0.2.118 - 2026-05-09

- Fixed `/lab/space` body visibility while tracking so hiding and then unhiding a tracked body restores Track instead of leaving the body feeling lost.

## 0.2.117 - 2026-05-09

- Matched the `/lab/space` bodies panel width to the selected-body inspector for a more consistent right-side layout.

## 0.2.116 - 2026-05-09

- Cleaned `/lab/space` time/menu copy so time rates switch to hours at 60 minutes, the time readout drops `TDB`, and the game menu removes redundant helper text.

## 0.2.115 - 2026-05-09

- Polished `/lab/space` panel controls so hint/menu/collapse ordering, hamburger selection, pause width, spawn toggle centering, and save-slot action buttons feel cleaner.

## 0.2.114 - 2026-05-09

- Stabilized the `/lab/space` time-rate readout so it shows requested speed first with the effective speed in parentheses when needed, and changed Space/chat hint buttons to `?` for consistency with Wall.

## 0.2.113 - 2026-05-09

- Changed `/lab/space` time controls from raw `Nx` multipliers to human labels like `real time`, `1 min/s`, and `1.2 year/s`, with an approximate effective rate shown when the browser cannot keep up.

## 0.2.112 - 2026-05-09

- Refreshed `/lab/space` documentation and added a browser smoke check covering the game menu, Space pause, stale Focus/edit wording, in-panel menu behavior, and body-relative Track switching.

## 0.2.111 - 2026-05-09

- Fixed the lab page Space card update text so it reflects recent `/lab/space` changes instead of stale `/lab/orbits` notes.

## 0.2.110 - 2026-05-09

- Changed `/lab/space` Track switching to preserve body-relative visual framing when moving from one tracked body to another.

## 0.2.109 - 2026-05-09

- Reorganized the `/lab/space` game menu into clear Game, Create, and Saves sections; renamed reset to reset simulation; and added Spacebar pause to hints.

## 0.2.108 - 2026-05-09

- Fixed the `/lab/space` hamburger menu UX so the save/load menu opens in the left panel flow and hides the main controls instead of overlaying the sliders.

## 0.2.107 - 2026-05-09

- Reworked the `/lab/space` hamburger into a native details menu so save/load, exit, and spawn controls reliably expand from the menu button.

## 0.2.106 - 2026-05-09

- Made the `/lab/space` selected-body inspector more compact with inline title/action controls and tighter readout rows.

## 0.2.105 - 2026-05-09

- Tightened `/lab/space` selected-body inspector sizing, moved exit and spawn-body controls into the hamburger menu, and added Spacebar play/pause.

## 0.2.104 - 2026-05-09

- Fixed `/lab/space` responsive panel sizing so controls and sliders remain clickable on narrower screens.

## 0.2.103 - 2026-05-09

- Added `/lab/space` as the user-facing space sandbox route, moved selected-body camera controls to Track-only, simplified the visible readouts, and added signed-in autosave plus three manual save slots.

## 0.2.101 - 2026-05-09

- Gave `/lab/orbits` orbit trails a small gap before each body so trails no longer run into the body center.

## 0.2.100 - 2026-05-09

- Removed the `/lab/orbits` future-path prediction prototype to reduce prototype weight and keep spawning/editing performance simpler.

## 0.2.99 - 2026-05-09

- Changed the `/lab/orbits` bodies list default so the Sun starts expanded while other systems start collapsed.

## 0.2.98 - 2026-05-09

- Moved `/lab/orbits` control hints from the scene footer into a `hints` tab on the left control panel.

## 0.2.97 - 2026-05-09

- Pulled Earth night-lights brightness back slightly in `/lab/orbits` after the first SolarSystemScope night-map tuning.

## 0.2.96 - 2026-05-08

- Brightened Earth night lights in `/lab/orbits` for the current SolarSystemScope Earth texture set.

## 0.2.95 - 2026-05-08

- Lowered Uranus ring opacity in `/lab/orbits` to `0.20`.

## 0.2.94 - 2026-05-08

- Lowered Uranus ring opacity in `/lab/orbits` to keep it visible but more realistic/subordinate.

## 0.2.93 - 2026-05-08

- Slightly dimmed Uranus rings in `/lab/orbits` while preserving the crisp source-derived texture.

## 0.2.92 - 2026-05-08

- Corrected Saturn/Uranus ring radial texture direction and rebuilt Jupiter rings with sharper source-pattern quality in `/lab/orbits`.

## 0.2.91 - 2026-05-08

- Replaced Uranus and Neptune ring strips in `/lab/orbits` with sharper source-quality ring texture assets.

## 0.2.90 - 2026-05-08

- Retuned Uranus and Neptune rings in `/lab/orbits` using Saturn's ring texture style as the visual anchor.

## 0.2.89 - 2026-05-08

- Reworked Jupiter, Uranus, and Neptune rings in `/lab/orbits` for a more consistent visible ring-asset style below Saturn's prominence.

## 0.2.88 - 2026-05-08

- Replaced Jupiter's procedural ring overlay with source-guided textured ring assets in `/lab/orbits` while preserving its faint dusty character.

## 0.2.87 - 2026-05-08

- Added a moon axis realism pass in `/lab/orbits`, aligning represented parent-facing moons to their current parent-relative orbit normals.

## 0.2.86 - 2026-05-08

- Added source-backed near-side yaw calibration for Europa, Ganymede, Callisto, and Titan in `/lab/orbits`.

## 0.2.85 - 2026-05-08

- Completed the first `/lab/orbits` moon tidal-lock audit pass by adding Neptune's inner moons to the parent-facing visual orientation set.

## 0.2.84 - 2026-05-08

- Extended calibrated tidal-lock visual behavior to the current default `/lab/orbits` moon systems.

## 0.2.83 - 2026-05-08

- Added first calibrated tidal-lock visual behavior for the Moon and Charon in `/lab/orbits`.

## 0.2.82 - 2026-05-08

- Added an adaptive `/lab/orbits` skybox fallback so lower-end contexts can use the 2K Stars + Milky Way texture while capable systems keep the 8K sky.

## 0.2.81 - 2026-05-08

- Tried the SolarSystemScope Stars + Milky Way 8K texture as the `/lab/orbits` sky background.

## 0.2.80 - 2026-05-08

- Removed retired `/lab/orbits` skybox bitmap assets after the procedural sky replaced them.

## 0.2.79 - 2026-05-08

- Added the first `/lab/orbits` visual obliquity calibration set and moved spin onto the dedicated spinning-surface layer.

## 0.2.78 - 2026-05-08

- Refactored `/lab/orbits` body visuals into separate orientation, spinning-surface, and ring layers for safer future tilt/texture calibration.

## 0.2.77 - 2026-05-08

- Aligned `/lab/orbits` ringed planet texture orientation with the visible ring planes.

## 0.2.76 - 2026-05-08

- Added visible `/lab/orbits` body spin without changing the restored ring/tilt baseline.

## 0.2.75 - 2026-05-08

- Rolled back the `/lab/orbits` orientation pass while it is redesigned.

## 0.2.73 - 2026-05-08

- Fixed `/lab/orbits` procedural sky stars drawing through planets.

## 0.2.72 - 2026-05-08

- Retuned the `/lab/orbits` procedural Milky Way-style star band to look less uniform and less like a straight line.

## 0.2.71 - 2026-05-08

- Replaced the blurry `/lab/orbits` bitmap skybox with a crisp procedural starfield and denser Milky Way-style star band.

## 0.2.70 - 2026-05-08

- Added a crisp star layer over the `/lab/orbits` generated skybox to reduce the blurry-backdrop feel.

## 0.2.69 - 2026-05-08

- Replaced the `/lab/orbits` skybox with a more readable generated Stars + Milky Way candidate.

## 0.2.68 - 2026-05-08

- Swapped `/lab/orbits` Earth to a 2K SolarSystemScope texture set for comparison.

## 0.2.67 - 2026-05-08

- Added a subtle Stars + Milky Way background to `/lab/orbits`.

## 0.2.66 - 2026-05-08

- Added irregular mesh geometry for Phobos and Deimos in `/lab/orbits`.

## 0.2.65 - 2026-05-08

- Added generated, source-guided texture maps for Neptune's small moons in `/lab/orbits`.

## 0.2.64 - 2026-05-08

- Added generated, source-guided texture maps for Uranus's main moons in `/lab/orbits`.

## 0.2.63 - 2026-05-08

- Added generated, source-guided texture maps for Mimas and Tethys in `/lab/orbits`.

## 0.2.62 - 2026-05-08

- Cache-busted the generated Triton and Charon texture files so browsers fetch the fixed maps instead of immutable cached older assets.

## 0.2.61 - 2026-05-08

- Replaced Triton and Charon placeholder maps with cleaner generated seamless texture maps.

## 0.2.60 - 2026-05-08

- Replaced broken Triton and Charon source-mosaic sphere maps with cleaner source-informed placeholder maps.

## 0.2.59 - 2026-05-08

- Added `/lab/orbits` texture maps for Triton and Charon.

## 0.2.58 - 2026-05-08

- Added `/lab/orbits` texture maps for Enceladus, Dione, Rhea, Iapetus, and Titan.

## 0.2.57 - 2026-05-08

- Added `/lab/orbits` texture maps for Io, Europa, Ganymede, and Callisto.

## 0.2.56 - 2026-05-08

- Increased `/lab/orbits` Jupiter ring visibility while keeping the rings faint and non-Saturn-like.

## 0.2.55 - 2026-05-08

- Refined `/lab/orbits` Jupiter and Neptune prototype rings so they follow their source ring structures more closely while staying faint and non-Saturn-like.

## 0.2.54 - 2026-05-08

- Improved `/lab/orbits` trail rendering to reduce close Track jitter while preserving full-system trails, attached body trails, and existing planet/ring visuals.

## 0.2.53 - 2026-05-08

- Rolled back the `/lab/orbits` 0.2.52 visual patch to restore Jupiter/Neptune ring overlays and attached trail behavior while the trail fix is redesigned.

## 0.2.51 - 2026-05-08

- Added prototype procedural rings for Jupiter and Neptune in `/lab/orbits`.

## 0.2.50 - 2026-05-08

- Made `/lab/orbits` Uranus rings easier to see.

## 0.2.49 - 2026-05-08

- Added pass-1 `/lab/orbits` textures for Jupiter, Saturn, Uranus, Neptune, and Pluto, including simple Saturn/Uranus rings.

## 0.2.48 - 2026-05-08

- Added pass-1 `/lab/orbits` textures for Mars, Phobos, and Deimos.

## 0.2.47 - 2026-05-08

- Added pass-1 `/lab/orbits` textures for Mercury and Venus.

## 0.2.46 - 2026-05-08

- Preserved more visible source-texture detail on the `/lab/orbits` Sun surface.

## 0.2.45 - 2026-05-08

- Improved `/lab/orbits` Sun surface detail so more of the source texture remains visible.

## 0.2.44 - 2026-05-08

- Made the `/lab/orbits` Sun corona visible again as a wider pale-gold halo.

## 0.2.43 - 2026-05-08

- Tuned `/lab/orbits` Sun glow to be less saturated orange.

## 0.2.42 - 2026-05-08

- Improved `/lab/orbits` Sun rendering with stronger surface contrast and a better corona/glow treatment.

## 0.2.41 - 2026-05-08

- Added pass-1 `/lab/orbits` Sun texture rendering with a subtle glow.

## 0.2.40 - 2026-05-08

- Improved `/lab/orbits` Earth/Moon lighting so textured bodies have a clearer dark side.

## 0.2.39 - 2026-05-07

- Added pass-1 `/lab/orbits` textures for Earth and Moon, including Earth clouds and dark-side city lights.

## 0.2.38 - 2026-05-07

- Made `/lab/orbits` raw edit fields easier to type into and nudge with keyboard arrows.

## 0.2.37 - 2026-05-07

- Improved `/lab/orbits` trail performance without changing trail quality by reusing stable trail geometry buffers.

## 0.2.36 - 2026-05-07

- Improved `/lab/orbits` performance without lowering visual quality by reducing panel/readout re-render work during playback.

## 0.2.35 - 2026-05-07

- Restored `/lab/orbits` render quality by removing the adaptive render-scale downgrade added in `0.2.34`.

## 0.2.34 - 2026-05-07

- Reduced `/lab/orbits` render load on high-DPR devices with a conservative render-scale cap/adaptive downgrade, and added the current render scale to the compact performance readout.

## 0.2.33 - 2026-05-07

- Added a compact `/lab/orbits` performance readout with FPS, body/gravity-pair count, physics substeps, clamp status, and grouping timing for low-end-device tuning.

## 0.2.32 - 2026-05-07

- Removed the baseline asteroid set and non-Pluto dwarf planets from `/lab/orbits` to improve performance on lower-end devices while keeping Pluto and Charon.

## 0.2.31 - 2026-05-07

- Removed the pending Aurora label from the chat transcript while the status rail is thinking.

## 0.2.30 - 2026-05-07

- Removed duplicate `...` thinking indicators from Aurora chat while the status rail is active.

## 0.2.29 - 2026-05-07

- Made the Aurora typing rail stop shortly after keyboard input stops, even when draft text remains.

## 0.2.28 - 2026-05-07

- Reworked the Aurora chat status band into a thinner pulse-rail design across idle, typing, thinking, and error states.

## 0.2.27 - 2026-05-07

- Fixed the Aurora chat status band to visibly fill the full desktop typing width.

## 0.2.26 - 2026-05-07

- Extended the Aurora chat status band so it spans the full typing bar on desktop.

## 0.2.25 - 2026-05-07

- Moved the Aurora visual into a subtle two-line status band below the chat typing bar.

## 0.2.24 - 2026-05-07

- Added a subtle animated Aurora band while chat replies are loading.

## 0.2.23 - 2026-05-07

- Smoothed terminal cat reaction timing so shocked, coda, meow, and success faces linger instead of snapping away.

## 0.2.22 - 2026-05-07

- Smoothed terminal `working...` feedback so delayed command output does not replace it too abruptly.

## 0.2.21 - 2026-05-07

- Added a shocked terminal cat reaction for two hidden insult easter eggs.

## 0.2.20 - 2026-05-07

- Reworked the hidden `coda` terminal command into rotating tiny signal-transmission text.

## 0.2.19 - 2026-05-07

- Tuned terminal command feedback: hidden easter eggs respond faster, `meow` replies immediately, normal delayed commands show working dots, and `coda` gets a cat reaction.

## 0.2.18 - 2026-05-07

- Added a first-use chat hint for guests and signed-in users, while keeping it available from the `hint` control afterward.

## 0.2.17 - 2026-05-07

- Hardened small browser API and storage edge cases in terminal history, Wall info state, and the particles canvas.

## 0.2.16 - 2026-05-07

- Hardened small frontend lifecycle and local-storage edge cases across the footer, terminal, and Wall.

## 0.2.15 - 2026-05-07

- Made the `/info` Discord copy feedback stay stable across rapid repeat clicks.

## 0.2.14 - 2026-05-07

- Made the `meow` terminal reply appear sooner after its cat animation starts.

## 0.2.13 - 2026-05-07

- Added special terminal cat animations for `clear` and `meow`.

## 0.2.12 - 2026-05-07

- Added subtle blinking/looping eye animation to the homepage terminal cat states.

## 0.2.11 - 2026-05-07

- Stabilized terminal autocomplete height so filtering suggestions does not jump the scroll position.

## 0.2.10 - 2026-05-07

- Made terminal autocomplete keep the full suggestion list in view below the prompt while typing.

## 0.2.9 - 2026-05-07

- Moved the homepage construction note to the footer and simplified terminal autocomplete panel scrolling.

## 0.2.8 - 2026-05-07

- Rebalanced the `/info` contact and recent changes columns so the changelog has more room.

## 0.2.7 - 2026-05-07

- Made terminal navigation messages appear immediately and animate their trailing dots during the page-load delay.

## 0.2.6 - 2026-05-07

- Tuned terminal cat delays so normal commands return quickly, easter eggs pause briefly, and page navigation shows the loading state longer.

## 0.2.5 - 2026-05-07

- Added terminal cat states with short command delays so responses can show working, success, and error moods.

## 0.2.4 - 2026-05-07

- Simplified homepage terminal help copy for `login` and `register`.

## 0.2.3 - 2026-05-07

- Added the homepage terminal cat pet beside the prompt.

## 0.2.2 - 2026-05-07

- Hid `coda` and `moon` from terminal help/autocomplete while keeping them runnable as easter eggs.

## 0.2.1 - 2026-05-07

- Added `coda` and `moon` homepage terminal commands.

## 0.2.0 - 2026-05-07

- Marked the completed visual overhaul checkpoint for `/info`, `/lab`, and `/projects`.

## 0.1.251 - 2026-05-06

- Added breathing room between the `/info` Discord username and copy button.

## 0.1.250 - 2026-05-06

- Adjusted the `/info` Discord copy row so the username sits with the copy button.

## 0.1.249 - 2026-05-06

- Adjusted the `/info` Discord username copy row so the username sits with its label instead of centered.

## 0.1.248 - 2026-05-06

- Added five recent public changelog items to `/info` beside the contact card.

## 0.1.247 - 2026-05-06

- Simplified the `/info` GitHub preview card and compacted the Discord copy contact.

## 0.1.246 - 2026-05-06

- Updated the public README and replaced the `/info` GitHub link with a richer site repository preview card.

## 0.1.245 - 2026-05-06

- Updated the `/lab` and `/projects` list pages with compact rows that show their latest public update metadata.

## 0.1.244 - 2026-05-06

- Replaced the `/info` header raster with the approved SVG trace of the selected artwork.

## 0.1.243 - 2026-05-06

- Updated Coda and Vale's `/info` credit descriptions.

## 0.1.242 - 2026-05-06

- Updated `/info` credits for Coda and Vale as OpenClaw AI agents.

## 0.1.241 - 2026-05-06

- Updated Coda's `/info` credit to mention the OpenClaw AI assistant role.

## 0.1.240 - 2026-05-06

- Added Coda to the `/info` credits.

## 0.1.239 - 2026-05-06

- Added the selected dark contour artwork between the `/info` contact links and credits, using a clean single-design crop.

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
