# Aurora

[Aurora](https://actora.art/aurora/) is an AI assistant on actora.art. Her replies are written by a computer and can be wrong. The chat says so when you send your first message. You can also open her from the [terminal](terminal.md) with `aurora`.

## Conversations

- Guests get one chat, kept in the browser and labelled `guest`. It is deleted 3 days after its last message.
- All guests share one daily allowance for the whole site. When it runs out, Aurora says she is busy for the day. You can sign in or come back tomorrow.
- Signed-in visitors have their own daily allowance. They can make, rename, archive, restore, reset and delete as many chats as they like. Archived chats are read-only until you restore, reset or delete them.
- Deleting a chat also deletes the memories Aurora saved from it. The page lists them before you confirm.
- Replies appear as she writes them. Use the stop button or Esc to stop her. In the terminal, `/help` lists the slash commands.
- While she works, you see her thinking, and each step gets a short note and how long it took. Her thinking stays on your screen only and is not saved. The steps fold into one line when she starts answering, and you can open it again. They are saved with her reply, without her search words.
- Failed replies can be retried. Retrying her latest reply keeps the earlier answer, and you can flip between up to ten versions. You can edit your latest message in place and ask for a new reply.
- A message can be up to 10,000 characters. Messages show a small set of Markdown: headings, bold, italics, strikethrough, code, links, lists, quotes and lines. Raw HTML is shown as text. Links in her replies show their full address, and a long or unexpected part after "?" or "#" is shown as plain text, not as part of the link.
- The context meter shows how much of the conversation Aurora can hold. When it fills up, older messages are summarised and the newest stay as they were.

## Attachments

You can attach up to five files to a message: PDFs, text, Markdown, data files, code, and photos (JPEG, PNG, WebP, and HEIC where your browser can open it). Aurora reads them for that reply only. The site keeps the file's name, type and size, but not its text or pictures. Photos are shrunk in your browser and stripped of location data before they are sent. Scanned PDF pages are read as pictures.

## Memory

If you are signed in, Aurora remembers short facts when you ask, such as “remember I like short answers” or “yes, save that.” She may also save a useful fact on her own, based on what you wrote in this chat, and you can undo that save under her reply. She also keeps short notes about things worth remembering; she does not write those notes in a chat where she has read a website or file. Settings show the kinds separately, and a memory saved in a chat that read a website or file is labelled. At most six relevant memories go into one reply. Open memory to add, edit, pin, expire, delete or switch off memory; the switch covers her notes too. Guests have no memory.

## Personalization

In settings you can write custom instructions for Aurora's tone, format or style, up to 2,000 characters. They apply to every reply. When you are signed in they follow your account. A guest's last for the browser session. You can switch them off or reset them without deleting a chat. Resetting asks you to confirm.

Your instructions cannot change who Aurora is, weaken her safety or privacy rules, give you access, or give her new tools. If only part of them conflicts, the rest still applies.

## Information and tools

Aurora can use:

- public actora.art pages and documentation;
- exact public profile lookup;
- your saved chats, your memories and your notifications (signed in only);
- the date, time and page you are on;
- web search for outside or current information; and
- public websites and GitHub pages that you give her or that a search found.

Large results come in pages, and she keeps reading before she says that something is missing or the only match. Web search returns top results only, so she may search again, up to three times in one reply. Answers that use the web link to their sources. Pages that point to private networks, carry passwords or use unusual ports are refused.

After she reads text from outside (a website, an attachment, a profile, or your chat history, notifications or memory list), she does not open new kinds of private information for the rest of that reply, and she can only open pages that you or a search offered. Her next reply starts fresh with your memories and instructions. You can ask her to save, change or forget a memory. She may also save on her own before reading outside text in that reply, using facts grounded in what you wrote in this chat.

Aurora cannot open pages in your browser, change accounts, send messages or submit forms.

## Privacy

To write a reply, the site sends Ollama Cloud the conversation (older parts as a summary), Aurora's instructions, your custom instructions and memories, attachment text, the date and time, your page, and what her tools found. Ollama works mainly in the United States. A web search sends a short search query; she is told to leave private details out of it.

Do not share sensitive details with Aurora, such as health information, passwords or ID numbers.

See [privacy.md](privacy.md) for what is kept, how long, and Ollama.
