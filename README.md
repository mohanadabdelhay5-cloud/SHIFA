# شفاء Shifa — website

The marketing site for Shifa, a management system for dental clinics. Static, Arabic (right-to-left), no build step.

## Run it

Open `index.html` in a browser, or serve the folder with any static server.

## Publish on GitHub Pages

Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.

## Structure

- `index.html` — five pages (Home, System, How we start, Questions, Contact), switched by hash routes such as `#system`
- `styles.css` — the Quiet Grove tokens and layout
- `app.js` — routing, the live "Today" screen, the before/after slider, the tooth chart
- `vendor/` — GSAP 3.15.1, used under the GSAP standard license: https://gsap.com/standard-license

## Notes

- Every name and figure shown on the site is demo data.
- WhatsApp is the only contact channel. The contact form builds the message and opens a `wa.me` chat with it filled in; the visitor presses send. The number lives in `index.html` (the `wa.me` links) and in `app.js` (`WA`).
