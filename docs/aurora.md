# Aurora

Aurora is the AI assistant of [actora.art](https://actora.art/). You chat with it at [actora.art/aurora](https://actora.art/aurora/), or by typing `aurora` in the [terminal](terminal.md) on the home page. It answers questions, searches the web and reads files you attach. No account is needed.

## Chats

- Without an account you are a guest, and guests get one chat. The site stores it, a cookie ties your browser to it, and it is deleted 3 days after its last message.
- All guests share one daily allowance of messages. When it runs out, sign in or come back tomorrow. Signed in, you have your own, and the page shows what is left.
- Signed in, your chats are kept until you delete them. A chat with no messages is deleted after 6 hours.
- Deleting a chat deletes the memories saved from it. Starting over keeps them.
- An archived chat is read-only until you unarchive it.
- A message holds up to 10,000 characters.
- Retrying a reply keeps the earlier answers, up to 10 versions. Only your latest message can be edited.
- The context meter on the Aurora page shows how much of a chat Aurora can hold. When the meter fills up, Aurora works from a summary of the older messages. The newest stay as they were.
- Aurora's thinking shows while it works and is not saved. The short notes on its steps are saved with the reply, without the search words.

## Attachments

- Up to 5 files a message: PDFs, photos (JPEG, PNG, WebP, and HEIC if your browser can open it), text, Markdown, data files and code.
- A PDF or photo can be 25 MB, other files 2 MB. Aurora reads the first 40,000 characters of a file, and 120,000 in one message. For a longer PDF she reads its first pages and a note beside the message box says which.
- A file is read for that reply only. The site keeps its name, type, size and a fingerprint that recognises it on a retry. It does not keep the text or the pictures.
- Photos are shrunk in your browser and lose their metadata, location included, before they are sent.
- PDF pages that are mostly picture are read as pictures.

## Memory

Aurora can remember short facts about you between chats. This needs an account.

- Aurora saves a fact when you ask, including your own health facts and links; it refuses actual passwords, keys, codes and ID numbers, but a mention like "I use a password manager" is fine. Ordinary yeses such as "yes thanks", "sure" or "ja, zeker" confirm its offers; a reply with "no" or "don't" cancels. It can also save one unasked, from what you wrote, and keeps short notes of its own. Each save shows under the reply, with undo.
- Up to 100 memories of 300 characters each, and 50 notes. A new note replaces the oldest unpinned one.
- At most 6 memories go into one reply.
- Once Aurora has read a page, file or photo in a reply, it saves nothing unasked in that reply. A memory saved in such a chat is labelled.
- Once a chat has read outside text, Aurora writes no more notes in that chat until you start over.
- You can ask Aurora to reword a memory; if several match, she asks which one.
- Under `memory` on the Aurora page you can edit, pin or forget each one, set it to expire after 30 or 90 days, forget everything, or switch memory off. Off covers Aurora's notes too.

## Custom instructions

Under `instructions` on the Aurora page you can tell Aurora how to answer: up to 2,000 characters on tone, format or style, used in every reply. Signed in, they follow your account. A guest's last until the tab closes. They do not override Aurora's safety and privacy rules or add tools.

## What Aurora can reach

- public actora.art pages and these docs;
- a member's public [profile](profiles.md), by exact username;
- your saved chats, memories and notifications, when you are signed in;
- the date, the time and the page you are on;
- the web: up to 3 searches and 3 pages a reply. Aurora opens only pages that you gave it or a search found, and links its sources.

Aurora refuses addresses on private networks, with a password in them, or on unusual ports.

Once Aurora has read outside text in a reply (a web page, a file, a photo, a profile), it opens none of your chats, memories or notifications for the rest of that reply.

Aurora cannot open pages in your browser, change your account, send messages or submit forms.

## What leaves the site

Aurora's replies are written by an AI model at Ollama Cloud, a separate company, mainly in the United States. Each reply sends Ollama the conversation, Aurora's instructions and yours, your names when you are signed in, the memories that fit, attachment text and photos, and what Aurora's tools found. Your network address is not sent.

Keep passwords, health details and ID numbers out of the chat.

The full list and how long things are kept: [privacy](privacy.md).
