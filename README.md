# actora.art

The site. Projects, experiments, and things worth keeping.

## Structure

```
src/
├── components/
│   ├── TerminalHero.tsx    # interactive terminal (homepage island)
│   ├── ChatIsland.tsx      # chat bot interface (chat page island)
│   └── ParticleFlow.tsx    # particle flow experiment (lab island)
├── layouts/
│   └── Base.astro          # shared layout (head, fonts, back link)
├── pages/
│   ├── index.astro         # homepage — interactive terminal
│   ├── chat/index.astro    # chat bot page
│   ├── projects/            # external projects (Actora, games, apps)
│   └── lab/                 # interactive on-site experiments
│       ├── index.astro     # lab landing page
│       └── particles.astro # particle flow experiment
└── styles/
    ├── global.css           # design tokens + base styles + particle styles
    ├── terminal.css         # terminal component styles
    └── chat.css             # chat page styles

chat/                         # chat API server (separate from Astro)
├── server.mjs               # Node.js API — Gemini proxy, rate limiting, admin stats
├── package.json
└── actora-chat.service       # systemd user service template
```

`dist/` is gitignored and rebuilt on every deploy push.

## Homepage

The homepage is an interactive terminal. Visitors type commands to navigate the site. Built as a Preact island (`client:load`) inside Astro's static output.

**Visible commands:** `help`, `ls`, `cd <page>`, `cat <page>`, `whoareu`, `clear`

**Pages:** `chat/` (chat bot), `lab/` (experiments), `stats/` (admin)

**Easter eggs:** Hidden commands that don't show in help. Add new ones to the `EASTER_EGGS` object in `TerminalHero.tsx`.

**Adding pages:** Add entries to the `PAGES` object in `TerminalHero.tsx`. Commands are case-insensitive.

## Lab

The lab is for interactive on-site experiments. Currently home to:

- **Particles** (`/lab/particles`) — a cursor-reactive particle flow visualization. Accessible only from the lab page, not from the terminal.

## Chat Bot

A chat page at `/chat` where visitors talk to an AI bot powered by Google Gemini 2.5 Flash. The backend is a lightweight Node.js server that proxies to the Gemini API with per-IP rate limiting.

- **75 messages per IP per day**, with a visible countdown and reset timer
- Conversation history kept per session (in-memory, cleared on server restart)
- Last 20 messages used as context window
- Admin stats at `/admin/stats` — shows total messages, token usage, estimated cost in EUR, per-IP usage and reset times

**Chat server:** `sites/actora.art/chat/server.mjs` (runs on port 4322, localhost only)

**Starting the server:**
```bash
GEMINI_API_KEY=<key> GEMINI_MODEL=gemini-2.5-flash CHAT_PORT=4322 MAX_MESSAGES_PER_DAY=75 \
  ALLOWED_ORIGINS=https://actora.art \
  nohup node /home/compadmin/sites/actora.art/chat/server.mjs \
  > /home/compadmin/sites/actora.art/chat/server.log 2>&1 &
```

**Or use systemd:**
```bash
systemctl --user start actora-chat.service
```

**Admin credentials:** username `admin`, password set via `ADMIN_PASSWORD` env var (required, no fallback)

## Local dev

```bash
cd /home/compadmin/sites/actora.art/repo
npm run dev    # hot-reload dev server at localhost:4321
npm run build  # production build to dist/
```

## Workflow

1. Work on `main` branch
2. Push to deploy: `git push deploy main` → builds to [actora.art](https://actora.art)
3. Push to GitHub for backup: `git push origin main`

## Deploy

| Command | What it does |
|---|---|
| `git push deploy main` | Builds production → `actora.art` |
| `git push origin main` | Push to GitHub (backup) |
| `~/sites/actora.art/repo/deploy-caddy.sh` | Copy Caddyfile to `/etc/caddy/` and reload |

The deploy hook lives in `deploy.git/hooks/post-receive`. It clones the branch, runs `npm install && npm run build`, and copies the output to the right directory.

## Stack

- [Astro](https://astro.build) — framework (islands architecture)
- [Preact](https://preactjs.com) — interactive components (terminal, chat, particles)
- Node.js — chat API server
- Google Gemini 2.5 Flash — chat bot AI model
- Caddy — web server (auto-HTTPS, HTTP/2, reverse proxy)
- Plain CSS + custom properties

## VPS paths

| Path | What |
|---|---|
| `sites/actora.art/repo` | Working repo |
| `sites/actora.art/deploy.git` | Bare git repo (deploy target) |
| `sites/actora.art/production` | Production build output |
| `sites/actora.art/chat` | Chat API server |
| `sites/actora.art/repo/Caddyfile` | Caddy config (deploy with `deploy-caddy.sh`) |

## Caddy config

- `actora.art` → static files from `production/dist`, proxies `/api/chat` and `/admin/stats` to `127.0.0.1:4322`

## Design

- Dark mode (`#0a0a0a` background, `#e0e0e0` text)
- JetBrains Mono font
- Monospace terminal aesthetic
- Interactive elements pop against minimal static base