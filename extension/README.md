# LinkFlow Chrome Extension (Rebuilt)

This folder contains a fresh, source-controlled Chrome Extension that targets the production API by default.

## Quick start
1) Install deps (from `link-flow-extension/`): `npm install`
2) Set API base (optional): create `.env` with `VITE_API_URL=https://link-flow-backend.fly.dev/api`
3) Dev with HMR: `npm run dev`
4) Build: `npm run build` (outputs to `dist/`)
5) Load unpacked extension in Chrome from `dist/`

## Notes
- Content script detects LinkedIn profiles, caches scraped data in the background script, and injects an "Add to LinkFlow" button.
- Popup defaults to production API; honors `VITE_API_URL` if set.
- Background script manages cached profile data per tab and exposes token helpers via messages.
- Icons are copied from the previous build (`extension/dist/icons/`).
