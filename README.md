# actora.art

The site. Projects, experiments, and things worth keeping.

## Structure

```
src/
├── layouts/
│   └── Base.astro        # shared layout (head, footer, fonts)
├── pages/
│   ├── index.astro        # homepage — index of everything
│   ├── projects/           # external projects (Actora, games, apps)
│   └── lab/                # interactive on-site experiments
└── styles/
    └── global.css          # design tokens + base styles
```

`dist/` is gitignored and rebuilt on every deploy push.

## Local dev

```bash
cd /home/compadmin/sites/actora.art/repo
npm run dev    # hot-reload dev server at localhost:4321
npm run build  # production build to dist/
```

## Workflow

1. Work on the `draft` branch
2. Push to draft to preview: `git push deploy draft` → builds to [draft.actora.art](https://draft.actora.art)
3. When happy, promote to production:
   - `git checkout main && git merge draft`
   - `git push deploy main` → builds to [actora.art](https://actora.art)

## Deploy

| Command | What it does |
|---|---|
| `git push deploy main` | Builds production → `actora.art` |
| `git push deploy draft` | Builds draft → `draft.actora.art` |
| `git push origin <branch>` | Push to GitHub (backup) |

The deploy hook lives in `deploy.git/hooks/post-receive`. It clones the branch, runs `npm install && npm run build`, and copies the output to the right directory.

## Stack

- [Astro](https://astro.build) — framework (islands architecture)
- Caddy — web server (auto-HTTPS, HTTP/2)
- Plain CSS + custom properties

## VPS paths

| Path | What |
|---|---|
| `sites/actora.art/repo` | Working repo |
| `sites/actora.art/deploy.git` | Bare git repo (deploy target) |
| `sites/actora.art/draft` | Draft build output |
| `sites/actora.art/repo/Caddyfile` | Caddy config (copy to `/etc/caddy/Caddyfile` on changes) |