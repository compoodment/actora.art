# Aurora

[Aurora](https://actora.art/aurora/) is actora.art's conversational presence. The full page supports longer conversations; a compact footer panel makes the current conversation available elsewhere on the site.

## Conversations

- Guests have one browser-scoped conversation and are labelled `guest`.
- Signed-in visitors can create, select, rename, archive, restore, reset, and delete multiple conversations. Their own messages use their current display name.
- Archived conversations are read-only and expire after seven days.
- The footer panel resumes the current conversation. The full Aurora page exposes the complete conversation controls.
- Failed replies can be retried, and the latest user message can be edited and regenerated. A conversation can carry its own brief without changing global personalization.

## Personalization

The settings control accepts custom instructions for Aurora's tone, format, personality, or preferred way of helping. Signed-in settings follow the account across devices. Guest settings last for the browser session.

Personal instructions cannot replace Aurora's identity, weaken privacy or safety boundaries, establish account facts, grant permissions, or expand tool access. They can be disabled or reset without deleting a conversation.

## Information and Tools

Aurora can consult bounded, read-only sources when useful:

- sanitized public actora.art documentation;
- the public Music catalog;
- exact public-profile lookup;
- public page and Lab catalogues;
- a bounded Space body catalogue;
- safe context about the current visitor; and
- general web search for outside or current information.

Web-backed answers should include descriptive source links. Actora documentation and outside-web results are distinct sources. These tools cannot play Music, open a page on someone's behalf, edit accounts, send messages, submit forms, or mutate site state.

The abstract line above the composer stays wordless. Web-backed answers keep a compact source strip with the answer.

## Privacy

Aurora sends a recent part of the current conversation, Aurora's instructions, enabled customization, the conversation brief, and a protected minimal viewer context to Ollama Cloud to produce a reply. Viewer context contains only the safe display/account label, signed-in state, and coarse access class; a read-only tool can supply bounded access guidance. A web-search query is sent only when Aurora chooses to search; account details, private instructions, and unrelated conversation text must not be placed in that query.

See [privacy.md](privacy.md) for retention and external-service details.
