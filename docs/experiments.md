# Experiments

Role: public lab guide; describe visitor-facing experiments here and keep product identity in `identity.md`.

The lab is for public experiments, ideas still taking shape, and weird things worth trying. It is not a dumping ground for unfinished junk.

## Chat

The chat page lets visitors talk to the site's chat bot. It's a conversational interface with message limits and a restorable recent thread in the same browser/device. The chat bot is part of the site, but it is not the same thing as the assistant that helps maintain the site.

## Wall

The wall is a collaborative text-based graffiti space. Visitors get a daily character budget, can paint on a shared grid, erase their own visible marks, and undo or redo recent confirmed paint/erase actions or strokes from the same guest session or signed-in account. Painting over an occupied coordinate creates a new visible layer; erasing your own visible layer can reveal an older unexpired layer underneath. Content fades over time and eventually expires. The wall is meant to feel alive and temporary, not frozen.

The clickable character palette is symbol-only, includes `€`, and excludes letters and numbers. Letters and numbers are still available from the keyboard, with letters normalized uppercase. Paint accepts any valid 6-digit `#rrggbb` color, including dark colors and black through custom color. The basic quick colors are exactly `#ffffff`, `#ff3b30`, `#ff9500`, `#ffcc00`, `#34c759`, `#00c7be`, `#007aff`, and `#5856d6`; black is not a quick color. Signed-in visitors get exactly four saved account color slots; guests get none.

## Particles

An interactive visual flow experiment.
