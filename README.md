# Vishwesh Mashruwala — Portfolio

A responsive personal portfolio built with Next.js, React, and CSS, with a separate Art Mode.

## Development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The development server is available at `http://localhost:3000` by default.

## Commands

- `npm run dev` — start the local development server
- `npm run build` — create the standard Next.js production build
- `npm test` — build and run the repository checks
- `npm run lint` — run ESLint
- `npm run build:sites` — create the alternate Sites/Cloudflare build

## Structure

- `app/` — scrolling portfolio, searchable navigation, light/dark themes, metadata, and styles
- `app/ArtMode.tsx` and `app/art-mode.css` — the original art cover and music controls
- `public/` — original hero/signature artwork, art portraits, music, and social preview
- `worker/` and `build/` — alternate Sites/Cloudflare packaging
- `.openai/hosting.json` — the existing Sites project binding

## Navigation

The profile uses `#intro`, `#practice`, `#about`, and `#contact` anchors. Open search with Cmd/Ctrl+K. Art Mode is available from the navigation and `#art`; the legacy `#digital-art`, `#3d-model`, `#video-editing`, and `#miscellaneous` links also open the current art cover. Escape or Back to profile exits Art Mode and pauses the track. Profile theme and Art Mode preference are stored independently. The profile clock uses Surat, India (Asia/Kolkata).
