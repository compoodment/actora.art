# Wall Testing Checklist

Role: public manual QA checklist for `/lab/wall`. Use this when testing with one person, two people, or a phone nearby. Backend/admin verification belongs in private docs; API contract details belong in `api.md`.

The goal is not to test every item every time. Pick the smallest section that matches the change, and write down anything that feels wrong, delayed, confusing, or inconsistent.

## Quick solo pass

Use this when you only have one browser/device.

1. Open `/lab/wall` and confirm the wall loads without a full-page error.
2. Paint one character.
   - Expected: the cell changes immediately.
   - Expected: character budget decreases by 1.
3. Switch to erase and erase that same character.
   - Expected: the cell clears or reveals the previous layer.
   - Expected: refund count decreases by 1.
   - Expected: character budget gets 1 back.
4. Type a letter.
   - Expected: selected character becomes uppercase.
5. Type a number.
   - Expected: selected character becomes that number.
6. Click several symbol palette buttons.
   - Expected: letters/numbers are not clickable palette options.
   - Expected: symbols, including `€`, work.
7. Pick a quick color, then a custom dark color.
   - Expected: both valid colors paint successfully.
   - Expected: black/dark colors work through custom hex, but black is not in the quick row.
8. Reload the page.
   - Expected: confirmed cells stay; failed/pending-looking cells do not linger incorrectly.

## Two-browser pass

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
6. Draw at the same time in both browsers for 10-20 seconds.
   - Watch for missing cells, delayed bursts, weird flicker, stuck pending cells, or budget/refund HUD drift.

## Signed-in vs guest pass

Use this when checking ownership boundaries.

1. Paint as a guest.
2. Sign in in the same browser.
   - Expected: your guest wall layers become owned by the signed-in account.
   - Expected: the cells remain erasable by you after sign-in.
3. Paint as signed-in.
4. Open a separate guest/private browser.
   - Expected: signed-in cells are visible but not erasable by the guest.
5. Paint over the signed-in cell as the guest.
   - Expected: guest top layer is visible.
6. Erase the guest top layer.
   - Expected: signed-in layer reappears underneath.

## Mobile/touch pass

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

## Budget and refund pass

Use this when paint/erase accounting changed.

1. Note starting `chars` and `refunds` values.
2. Paint 3 cells.
   - Expected: chars decrease by 3.
3. Erase those 3 visible owned cells.
   - Expected: chars increase by 3, up to the daily max.
   - Expected: refunds decrease by 3.
4. Try to erase someone else's visible cell.
   - Expected: nothing happens; refunds should not decrease.
5. Try to paint after budget is exhausted if practical.
   - Expected: the UI shows the no-chars message and rolls back failed optimistic cells.

## Realtime/reconnect pass

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
