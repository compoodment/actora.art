# Profiles

Every [account](accounts.md) on [actora.art](https://actora.art/) can have a profile: a page of your own at `actora.art/u/username` that you fill and design yourself. Around it are a guestbook for visitors' comments, friends, blocks and reports. Open yours with `profile` in the [terminal](terminal.md) on the home page, or someone else's with `find @name`.

## Your profile

- It is private until you publish it. Others then see only that it is private. Making it private again works at once.
- A public profile shows the date you joined.
- The site's administrators can open any profile, private ones too.
- Up to 24 blocks, with 3,200 characters in a text block. A status is 28 characters.
- Avatar: a square PNG, JPEG or WebP up to 64 KB.
- Pictures and GIFs up to 8 MB, videos (MP4 or WebM) up to 40 MB. 12 files and 64 MB in all.
- Location and camera details are removed from what you upload. SVG, HTML and scripts are not accepted.
- Your own CSS can be 20,000 characters. It stays inside your page and cannot load scripts, fonts or images from elsewhere. Visitors can switch to a plain view.
- You can feature up to 12 friends. They show only while their own profile is public.
- Badges are decoration and give no access. You can make 12 of your own. A deleted badge cannot be brought back.

## Guestbook

A guestbook is a list of comments that visitors leave on your profile.

- It is off until you turn it on. Turning it off again hides the comments and keeps them.
- Anyone can read it. Any signed-in account can comment.
- A comment is up to 1,000 characters, and a guestbook holds 100.
- You can remove any comment on yours, and authors can remove their own. A removed comment is gone.

## Friends

- `find @name` needs the exact username. There is no search by name.
- A friend request has to be accepted. Send one from a profile or with `friend add @name` in the terminal. Answer it on the profile, in the bell or in the terminal.
- Friends get no extra access. A private profile stays private to them.
- Nobody is told when you decline a request or unfriend them.
- There are no friend counts, no online or last-seen status and no read receipts.

## Blocks

- Blocking ends the friendship or the pending request. Unblocking does not bring it back.
- While signed in, neither of you sees the other's profile, guestbook or pictures, and neither can send a request or comment. They see "unavailable" and are not told why.
- Signed out, anyone can still read a public profile.
- Comments they left in your guestbook earlier stay, and they can still remove them.
- `blocks` in the terminal lists who you blocked, `unblock @name` undoes one.

## The bell

The bell sits in the footer of every page and opens your notifications. It shows friend requests and accepted requests. Nothing else is sent: no push notifications, no sounds, no email.

## Reports

Signed in, you can report someone's profile from that profile, with a reason and a note of up to 600 characters. Reports are private, and you are not told the outcome.

A report keeps a copy of what the profile showed, without the uploaded files, until 180 days after it is closed. It can lead to a profile being hidden, or to friends and the guestbook being paused for that account. More in [privacy](privacy.md).
