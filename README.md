# NorthVaultStudios Website core
🚀 NorthVaultStudios — Building the future

A futuristic, glassmorphism-themed website for NorthVaultStudios digital agency.

## Features

- 🎨 Futuristic glassmorphism design with neon gradients
- 📱 Fully responsive (mobile + desktop)
- ⚡ Smooth animations with Framer Motion
- 🌟 Floating particle background
- 🎯 Parallax hero section
- 💎 Glass blur effects
- ✨ Glow-on-hover animations

## Tech Stack

- React 18
- Vite
- TailwindCSS
- Framer Motion
- React Router

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

The production build prerenders every route to static HTML (see `scripts/prerender.mjs`) and
generates `robots.txt` and `sitemap.xml`. It needs the verified production origin in `SITE_URL`
(scheme + host, no path) and fails without it — see `.env.example`:

```bash
SITE_URL=https://your-verified-domain.example npm run build
```

Routes, titles, descriptions and canonicals live in `src/seo/`. `npm run dev` does not prerender
(the app renders client-side and keeps `<head>` in sync). `npm run preview` falls back to
`index.html` for unknown paths, unlike a real static host — don't use it to check 404 behaviour.

## Preview

```bash
npm run preview
```

## Pages

- `/` - Landing/Home page
- `/services` - Services overview
- `/about` - About Us page
- `/contact` - Contact page
