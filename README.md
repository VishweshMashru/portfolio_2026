# Vishwesh Mashruwala — Portfolio

A paginated personal portfolio built with Next.js, React, and CSS.

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

- `app/` — portfolio UI, metadata, and styles
- `public/` — the hero artwork and social preview
- `worker/` and `build/` — alternate Sites/Cloudflare packaging
- `.openai/hosting.json` — the existing Sites project binding
