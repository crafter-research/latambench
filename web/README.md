# web/

Landing page for [latambench.org](https://latambench.org).

Built with Astro 5 + Tailwind CSS v4. Scientific Noir design aesthetic — void black, hairline geometry, Space Grotesk typography.

## Stack

- **Framework**: Astro 5 (static output)
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Fonts**: Space Grotesk (display) · IBM Plex Sans (body) · JetBrains Mono (mono)
- **Deploy**: Vercel (`crafter-station/latambench`)
- **Domain**: latambench.org

## Development

```bash
bun install
bun dev          # localhost:4321
bun run build    # static output → dist/
```

## Brand Assets

Generated via `scripts/generate-assets.ts` using `sharp`:

```bash
bun run scripts/generate-assets.ts
```

Outputs:
- `public/og.png` — Open Graph (1200×630)
- `public/og-twitter.png` — Twitter card (1200×600)
- `public/favicon.svg` — SVG favicon (Crafter icon mark)
- `public/favicon-32.png`, `public/favicon-16.png`

## Design Tokens

Defined in `src/styles/global.css` via `@theme`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-void` | `#080808` | Page background |
| `--color-white` | `#ffffff` | Primary text |
| `--color-silver` | `#c8c4be` | Secondary text |
| `--color-annotation` | `#6b6560` | Muted labels |
| `--color-parchment` | `#e8dfc8` | Quote blocks |
| `--font-display` | Space Grotesk | Headlines |
| `--font-body` | IBM Plex Sans | Body copy |
| `--font-mono` | JetBrains Mono | Labels, code |

## Deployment

Vercel auto-deploys on push to `main`. Domain configured via Spaceship DNS (A record → 76.76.21.21).
