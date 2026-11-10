# Aurora

[Aurora](https://actora.art/aurora/) is the site's AI. She is in the [terminal](terminal.md) too: type `aurora`, then `/help`.

## Chats

- Guests get one chat. The site stores it, a cookie ties your browser to it, and it is deleted 3 days after its last message.
- All guests share one daily allowance of messages. When it runs out, sign in or come back tomorrow. Signed in, you have your own, and the page shows what is left.
- Signed in, your chats are kept until you delete them. A chat with no messages is deleted after 6 hours.
- Deleting a chat deletes the memories saved from it. Starting over keeps them.
- An archived chat is read-only until you unarchive it.
- A message holds up to 10,000 characters.
- Retrying a reply keeps the earlier answers, up to 10 versions. Only your latest message can be edited.
- When the context meter fills up, Aurora works from a summary of the older messages. The newest stay as they were.
- Her thinking shows while she works and is not saved. The short notes on her steps are saved with the reply, without her search words.

## Attachments

- Up to 5 files a message: PDFs, photos (JPEG, PNG, WebP, and HEIC if your browser can open it), text, Markdown, data files and code.
- A PDF or photo can be 25 MB, other files 2 MB. She reads the first 40,000 characters of a file, and 120,000 in one message.
- She reads a file for that reply only. The site keeps its name, type, size and a fingerprint that recognises it on a retry. It does not keep the text or the pictures.
- Photos are shrunk in your browser and lose their metadata, location included, before they are sent.
- PDF pages that are mostly picture are read as pictures.

## Memory

Memory needs an account.

- She saves a fact when you ask. She can also save one on her own from what you wrote, and keeps short notes of her own. Each save shows under her reply, with undo.
- Up to 100 memories of 300 characters each, and 50 notes. A new note replaces the oldest unpinned one.
- At most 6 memories go into one reply.
- Once she has read a page, file or photo in a reply, she saves nothing on her own in that reply. A memory saved in such a chat is labelled.
- Once a chat has read outside text, she writes no more notes in it until you start over.
- Under `memory` you can edit, pin or forget each one, set it to expire after 30 or 90 days, forget everything, or switch memory off. Off covers her notes too.

## Custom instructions

Up to 2,000 characters on tone, format or style, used in every reply. Signed in, they follow your account. A guest's last until the tab closes. They do not override her safety and privacy rules or give her tools.

## What she can reach

- public actora.art pages and these docs;
- a public profile, by exact username;
- your saved chats, memories and notifications, when you are signed in;
- the date, the time and the page you are on;
- the web: up to 3 searches and 3 pages a reply. She opens only pages that you gave her or a search found, and links her sources.

She refuses addresses on private networks, with a password in them, or on unusual ports.

Once she has read outside text in a reply (a web page, a file, a photo, a profile), she opens none of your chats, memories or notifications for the rest of that reply.

She cannot open pages in your browser, change your account, send messages or submit forms.

## What leaves the site

Ollama Cloud writes her replies, mainly in the United States. Each reply sends it the conversation, her instructions and yours, your names when you are signed in, the memories that fit, attachment text and photos, and what her tools found. Your network address is not sent.

Keep passwords, health details and ID numbers out of the chat.

The full list and how long things are kept: [privacy](privacy.md).
