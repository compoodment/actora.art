# Writing the actora.art docs

For anyone editing these guides, people and AI alike. Write for someone who has never seen actora.art: they came from
GitHub or a search and don't have the page open. Say what the thing is and where it is, then only what they couldn't
work out by using it.

## What each page is for

- `README.md`: what the site is and where the guides are. Its list gives each guide's order and one-line description on actora.art/docs.
- `docs/site.md`: the pages that have no guide of their own (the Wall, crawlers, Space), and what was removed.
- `docs/terminal.md`: the command list. Reference: one line per command.
- `docs/accounts.md`: passkeys, recovery, sign-ins, archive, delete. The how-tos live here, because these are hard to undo.
- `docs/profiles.md`: profiles, guestbooks, friends, blocks, the bell, reports.
- `docs/aurora.md`: her limits, what is kept, what she can reach, what leaves the site.
- `docs/privacy.md`: the formal statement. computment's wording; propose changes, don't edit.
- `CHANGELOG.md`: what changed for visitors, per version.

A guide links to the privacy statement for the legal detail and doesn't repeat it. Every `.md` directly in `docs/` becomes a page on the site, which is why this file sits in `docs/writing/`.

## How a guide opens

One or two plain sentences: what the thing is, where to find it (page address and terminal command), and what it's
for. "Aurora is the AI assistant of actora.art. You chat with her at actora.art/aurora, or by typing `aurora` in the
terminal on the home page." No tour after that.

The same goes inside a guide: the first time a page or feature comes up, say what it is and where ("the bell sits in
the footer of every page and opens your notifications"). Never name something before it's introduced.

## What goes in

- Limits and numbers: how many, how long, how big.
- How long things are kept, and who can see them.
- How to undo, delete or get back in.
- What happens that the page doesn't tell you: what a block hides, what archiving cancels, what goes to Ollama.
- Things that are deliberately not there, when people would look for them.

## What stays out

- A walk through the interface: every button, menu and label, the obvious next step. Name where a thing is; don't narrate using it.
- What the page itself tells you once you're there. "The chat says so when you send your first message."
- How it works inside, unless it changes what the visitor should do.
- The same fact twice. Say it in the guide that owns it; link from the others.
- Reassurance, selling, and anything you'd say "yeah, no shit" to.

## Sentences

- Start with the fact. No intro paragraph, no summary at the end.
- One fact per sentence, under 25 words. Present tense, active, "you".
- Numbers as digits with their unit: 3 days, 10,000 characters, 5 files.
- Say it once, flat: "Deleted 3 days after its last message." No "please note", "simply", "currently", "you can also", "may", "such as" lists.
- No "not X, but Y" unless someone would really assume X.
- Don't pad a list to three. Don't list features to look complete.
- Same word for the same thing every time: sign-in (not session), the bell, notifications, guestbook, the Wall. There is no "social".
- Commands and exact words to type go in `code`. Page names are capitalised: Account, the Wall, Aurora.
- Headings in sentence case, named after the thing. Bullets for parallel facts, sentences for the rest. No bold lead-ins, no em dashes.
- Only headings, paragraphs, lists, `code`, **bold** and links render on the site. No tables, no HTML.

## Voice

The site talks in lowercase and keeps it short: `sign in first (type login).`, `cancelled. nothing changed.`,
`a wall. draw on it.` The guides use normal capitals so they read easily, but keep that tone: dry, friendly, no
exclamation marks, no jokes that need explaining. Aurora is "she". The site is "the site", computment is "computment".

## Before you commit

- Check each fact against the code. Facts beat style.
- Stranger test: could someone who has never opened the site follow this page?
- Cut test: would they miss this sentence? If not, delete it.
- `node scripts/validate-public-docs.mjs` passes.
- A new, renamed or removed guide needs the README list and the site's own list of public files updated.
