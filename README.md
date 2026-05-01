# MF Bharat — Next.js

## Quick start
```bash
npm install
npm run dev
# → http://localhost:3000
```

## How it works

| File | Purpose |
|------|---------|
| `public/styles.css` | Original CSS, served as a static file via `<link>` in layout |
| `public/main.js` | Original JS (modified so `mfbInit()` is re-callable on navigation) |
| `public/logos/` | All 46 AMC logos |
| `html-content/*.html` | Each page's body HTML (clean, no template literals) |
| `app/**/page.tsx` | Next.js Server Components — reads from `html-content/` with `fs.readFileSync` |
| `components/ClientInit.tsx` | Re-calls `window.mfbInit()` on every page mount |
| `app/layout.tsx` | Root layout — loads fonts, CSS, and JS |

## Routes
| URL | Page |
|-----|------|
| `/` | Homepage |
| `/kyc` | KYC flow |
| `/calculators/sip` | SIP Calculator |
| `/amc/sbi` | SBI AMC page |
| … | (34 pages total) |

## Production build
```bash
npm run build
npm start
```
