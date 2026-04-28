# Testing

Manual checks for visitor-facing behavior.

The goal is not to test every item every time. Pick the smallest section that matches the change, and write down anything that feels wrong, delayed, confusing, or inconsistent.

## Chat

Manual QA checklist for `/chat`.

### Guest pass

1. Open `/chat` while signed out.
   - Expected: the page opens on the current conversation, not a saved-history sidebar.
   - Expected: the empty state says guest chat stays in this browser.
   - Expected: a visible `hint` control opens the chat behavior/privacy hint.
2. Send a harmless message.
   - Expected: Aurora replies and the input remains usable.
3. Reload the page in the same browser.
   - Expected: the guest conversation restores.

### Signed-in session pass

1. Sign in, then open `/chat`.
   - Expected: the signed-in chat history control is labeled `chats`.
   - Expected on desktop: the chat rail starts collapsed as a narrow left rail, not a top strip, and compact active-chat buttons remain selectable.
   - Expected on mobile/narrow screens: the list opens as a full-screen sheet from `chats` so the current chat stays primary and the persistent footer does not sit above the sheet.
2. Use the sidebar glyph.
   - Expected: collapsed shows `◧` with `open sidebar`; expanded shows `◨` with `close sidebar`.
   - Expected: `new` stays visible on the left of the glyph in both states.
3. Start a new chat, then switch between chats.
   - Expected: the rail keeps your chosen open/collapsed state.
   - Expected: the first message auto-generates a short title, while manual rename can be longer.
4. Open `edit`.
   - Expected: rename/archive/delete/copy/reset actions are behind `edit`, not always visible in the header.
5. Archive a chat, open the archived section, and select the archived chat.
   - Expected: archived chats are read-only until unarchived.
   - Expected: the chat help hint says archived chats auto-delete after 7 days and does not mention internal site roles.
6. Try starting a new chat after reaching the saved-chat cap.
   - Expected: the error tells you to delete a chat first and that archived chats count too.
   - Expected on mobile: if `new` is triggered inside the `chats` sheet, the sheet closes so the error is visible.

## Wall

Manual QA checklist for `/lab/wall`. Use this when testing with one person, two people, or a phone nearby. API contract details belong in `api.md`.

### Quick solo pass

Use this when you only have one browser/device.

1. Open `/lab/wall` and confirm the wall loads without a full-page error.
2. Paint one character.
   - Expected: the cell changes immediately.
   - Expected: character budget decreases by 1.
3. Use undo, then redo.
   - Expected: undo removes the painted character, restores 1 character budget, and spends 1 refund.
   - Expected: redo restores the character and spends the character budget again.
4. Switch to erase and erase that same character.
   - Expected: the cell clears or reveals the previous layer.
   - Expected: refund count decreases by 1.
   - Expected: character budget gets 1 back.
5. Use undo, then redo on the erase.
   - Expected: undo restores the erased character if the budget state allows it.
   - Expected: redo erases it again and restores the post-erase budget/refund state.
6. Type a letter.
   - Expected: selected character becomes uppercase.
7. Type a number.
   - Expected: selected character becomes that number.
8. Click several symbol palette buttons.
   - Expected: letters/numbers are not clickable palette options.
   - Expected: symbols, including `€`, work.
9. Pick a quick color, then a custom dark color.
   - Expected: both valid colors paint successfully.
   - Expected: black/dark colors work through custom hex, but black is not in the quick row.
10. Reload the page.
   - Expected: confirmed cells stay; failed/pending-looking cells do not linger incorrectly.

### Two-browser pass

Use two browser profiles, two devices, or a normal window plus private/incognito window.

1. Open `/lab/wall` in both browsers.
2. In browser A, paint a short stroke.
   - Expected in A: local cells appear immediately.
   - Expected in B: cells appear live enough to feel collaborative.
3. In browser B, paint over one of A's cells.
   - Expected: B's cell becomes visible on top.
   - Expected: A sees B's cell as not erasable by A.
4. In browser B, erase B's top cell.
   - Expected: A's previous unexpired cell reappears.
   - Expected: B no longer sees that revealed cell as erasable.
   - Expected: A does see the revealed cell as erasable.
5. In browser A, erase the revealed cell.
   - Expected: the cell clears or reveals the next older layer.
6. In browser A, drag a short multi-cell stroke, then click undo once.
   - Expected: the recent stroke/action is reversed without removing browser B's intervening cells.
   - Expected: browser B sees the undo live.
7. Click redo in browser A.
   - Expected: the stroke/action returns where no intervening changes blocked it.
   - Expected: browser B sees the redo live.
8. Draw at the same time in both browsers for 10-20 seconds.
   - Watch for missing cells, delayed bursts, weird flicker, stuck pending cells, or budget/refund HUD drift.

### Signed-in vs guest pass

Use this when checking ownership boundaries.

1. Paint as a guest.
2. Sign in in the same browser.
   - Expected: your guest wall layers stay guest-owned instead of becoming account-owned.
   - Expected: those guest cells are no longer erasable by the signed-in account.
   - Expected: guest wall budget does not merge into or replace the account wall budget.
3. Paint as signed-in.
4. Open a separate guest/private browser.
   - Expected: signed-in cells are visible but not erasable by the guest.
5. Paint over the signed-in cell as the guest.
   - Expected: guest top layer is visible.
6. Erase the guest top layer.
   - Expected: signed-in layer reappears underneath.

### Mobile/touch pass

Use a phone or narrow responsive viewport.

1. Open `/lab/wall` on a narrow screen.
   - Expected: no horizontal page overflow.
   - Expected: grid and tools remain usable.
2. Drag slowly across several cells.
   - Expected: cells follow the finger reasonably.
   - Expected: page does not scroll while drawing on the grid.
3. Drag quickly across the grid.
   - Watch for dropped cells, accidental page movement, or drawing continuing after finger release.
4. Switch modes and erase by touch.
   - Expected: only your visible cells erase.
5. Use the bottom tools/palette.
   - Expected: controls scroll or fit without clipping important buttons.

### Budget and refund pass

Use this when paint/erase accounting changed.

1. Note starting `chars` and `refunds` values.
2. Paint 3 cells.
   - Expected: chars decrease by 3.
3. Erase those 3 visible owned cells while they are under 24 hours old.
   - Expected: chars increase by 3, up to the daily max.
   - Expected: refunds decrease by 3.
4. If testing with old/restored state, try to erase an owned cell older than 24 hours.
   - Expected: the cell stays visible, and chars/refunds do not change.
5. Undo and redo the paint/erase sequence.
   - Expected: paint undo spends refund allowance and restores character budget only while the painted layer is still within the 24-hour erase window.
   - Expected: paint redo spends character budget again.
   - Expected: erase undo/redo return chars and refunds to the matching erase action state when budget allows.
6. Try to erase someone else's visible cell.
   - Expected: nothing happens; refunds should not decrease.
7. Try to paint after budget is exhausted if practical.
   - Expected: the UI shows the no-chars message and rolls back failed optimistic cells.

### Realtime/reconnect pass

Use this when checking SSE or network behavior.

1. Open two browsers.
2. Paint in A and watch B.
   - Expected: B updates without manual reload.
3. Put B offline briefly or disable network, then reconnect.
   - Expected: B eventually catches up without needing a full manual reload.
4. Leave both browsers idle for a few minutes, then paint again.
   - Expected: live updates still arrive.
5. Reload one browser during active drawing.
   - Expected: it loads the current wall state and resumes live updates.

## Liminal

Manual QA checklist for `/lab/liminal`.

1. Open `/lab/liminal`.
   - Expected: the foggy concrete chamber renders without a full-page error.
   - Expected: the persistent footer remains available, and there is no duplicate in-page back button.
2. Click `start`, move the mouse, then press Escape.
   - Expected: pointer lock starts, mouse look works, and Escape releases it normally.
3. Use W A S D or arrow keys.
   - Expected: the camera moves around the chamber and stays within the room.
4. On a phone or narrow touch viewport, drag to look and use the arrow controls.
   - Expected: touch controls move the camera without scrolling the immersive page.
5. Test a browser/device without WebGL if practical.
   - Expected: fallback copy explains that WebGL is required instead of showing a blank canvas.

## What to report

For any issue, capture:

- browser/device
- signed-in or guest
- what you were doing
- what you expected
- what happened instead
- whether reload fixed it
- screenshot or short screen recording if easy

Good bug words for the wall: laggy, bursty, flicker, stuck pending, wrong owner, wrong budget, failed erase, missing reveal, mobile scroll, reconnect stale.
