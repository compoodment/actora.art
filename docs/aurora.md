# Aurora

[Aurora](https://actora.art/aurora/) is actora.art's conversational presence. The page supports longer conversations and exposes the complete conversation controls.

## Conversations

- Guests have one conversation in their browser and are labelled `guest`. It is deleted 3 days after its last message.
- Guest conversations share one daily allowance across the whole site. When it runs out, Aurora tells guests it's busy for the day: they can sign in or come back tomorrow. Signed-in conversations aren't part of it.
- Signed-in visitors can create, select, rename, archive, restore, reset, and delete multiple conversations. Their own messages use their current display name.
- Archived conversations are read-only and remain available until their owner restores, resets, or deletes them.
- Deleting a conversation also deletes the memories Aurora saved from it; the page lists them before you confirm.
- When you send your first message on a visit, the chat notes "aurora is an ai. its messages can be wrong."
- In the homepage terminal, `aurora` opens a chat picker. Replies stream in; Esc or ■ stops her. `/help` lists the slash commands. On the Aurora page, each step shows a short note and how long it took. The steps fold up when she starts answering and can be opened again. They are kept with her reply, without the search words.
- Aurora is told the current date, time and page. She can search your saved conversations (dated from 0.3.41 on), list your memories and read your notifications. She can also remember or forget a fact when you ask.
- You can attach documents, photos and scanned PDFs. Aurora can read them for that reply. The site keeps the file name, type and size, but not the file text or images.
- Failed replies can be retried, and the latest user message can be edited and regenerated.
- Sent and received messages support a safe Markdown subset: headings, bold, italics, strikethrough, inline and fenced code, HTTP(S) links, lists, blockquotes, and horizontal rules. Raw HTML is shown as text.
- Normal messages accept up to 10,000 characters. Custom instructions remain limited to 2,000 characters.

## Personalization

The settings control accepts custom instructions for Aurora's tone, format, personality, preferred way of helping, or recurring interaction style. When enabled, applicable instructions persist across every reply without needing to be repeated. Signed-in settings follow the account across devices. Guest settings last for the browser session. If one part conflicts with Aurora's protected boundaries, the remaining customization still applies.

Resetting custom instructions requires an explicit confirmation before the saved or browser-session customization is cleared.

Personal instructions cannot replace Aurora's identity, weaken privacy or safety boundaries, establish account facts, grant permissions, or expand tool access. They can be disabled or reset without deleting a conversation.

## Information and Tools

Aurora can consult structured sources when useful:

- sanitized public actora.art documentation;
- exact public-profile lookup;
- the public page catalogue;
- safe context about the current visitor; and
- general web search for outside or current information; and
- paginated reading of visitor-provided public websites and GitHub repository pages, with relevant public links followed when needed.

Small result sets return completely. Large attachment, documentation, and fetched-page results report their exact total and next position. Aurora must continue through the remaining pages before saying that something is absent, unique, or the only match. General web search remains non-exhaustive because it returns top results; Aurora can refine or run another search when broader coverage matters.

Web-backed answers should include descriptive source links. Actora documentation and outside-web results are distinct sources. Public-page reading rejects local/private-network targets, credentials, and unusual ports.

Aurora cannot open a page in your browser, edit accounts, send messages or submit forms.

The abstract line above the composer stays wordless. Web-backed answers keep a compact source strip with the answer.

## Privacy

Aurora sends the current uncompacted conversation, Aurora's instructions, enabled customization, any retained compacted summary, and a protected minimal viewer context to Ollama Cloud to produce a reply. The context indicator estimates that same payload; there is no separate fixed message-count cutoff. At the displayed compaction threshold, older turns become a retained summary while the newest turns remain verbatim. Viewer context contains only the safe display/account label, signed-in state, and coarse access class; a read-only tool can supply bounded access guidance. A web-search query is sent only when Aurora chooses to search; account details, private instructions, and unrelated conversation text must not be placed in that query.

Once Aurora reads outside text in a conversation, she leaves your memories, chat history and custom instructions out of that conversation. Start a new chat to use them again. Avoid sharing sensitive information with Aurora.

See [privacy.md](privacy.md) for retention and external-service details.
