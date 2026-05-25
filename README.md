# G&B Experts Barista Checklist App ☕

> A Progressive Web App that digitizes the operational auditing process for barista trainers and technicians — eliminating paper forms and generating branded PDF reports on the spot.

[![Live App](https://img.shields.io/badge/Live-App-4f8ef7?style=flat-square)](https://gb-experts-barista-checklist-app.vercel.app/)
[![PWA](https://img.shields.io/badge/Built%20as-PWA-EA4B71?style=flat-square)](https://web.dev/progressive-web-apps/)
[![Vibe Coded](https://img.shields.io/badge/Vibe-Coded-00A67E?style=flat-square)](#)

---

## What it does

A barista trainer or technician opens the app on their phone, works through a structured multi-step checklist during the audit, collects digital signatures from both parties, and walks away with a branded PDF report — all without touching a paper form.

- **Multi-step audit form** — structured workflow with real-time progress tracking
- **Digital signatures** — integrated signature pads for technician and client verification
- **Instant PDF report** — branded, comprehensive report generated directly in the browser
- **Offline capable** — works without an internet connection via Service Worker
- **Mobile-first** — built for field use on smartphones and tablets

---

## Architecture

```
User (mobile / tablet)
│
│ Opens PWA (installable, offline-ready)
▼
index.html + script.js
│
├─► Multi-step form       (progress tracking, field validation)
├─► SignaturePad.js       (digital signature capture)
│
▼
html2canvas + jsPDF
│
▼
PDF Report               (generated in-browser, no server needed)
│
▼
LocalStorage             (draft persistence between sessions)
```

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Frontend | HTML5 / CSS3 / JavaScript | Zero dependencies, runs anywhere |
| PWA | Service Worker + Web App Manifest | Offline support, installable on mobile |
| Signatures | SignaturePad.js | Lightweight digital signature capture |
| PDF Generation | html2canvas + jsPDF | In-browser PDF, no backend required |
| Storage | LocalStorage | Draft persistence during audits |
| Hosting | Vercel | Zero-config deployment, always live |

---

## Features

- ✅ Progressive Web App — installable on any device
- ✅ Works fully offline via Service Worker
- ✅ Multi-step form with real-time progress indicator
- ✅ Digital signature capture for technician and client
- ✅ Branded PDF report generated entirely in the browser
- ✅ Draft auto-save via LocalStorage
- ✅ Mobile-first, optimized for field use
- ✅ Currently live and in active daily use at GB Experts

---

## How to test

**Option 1 — Live app (recommended):**
1. Open [https://gb-experts-barista-checklist-app.vercel.app/](https://gb-experts-barista-checklist-app.vercel.app/) on your phone or desktop
2. Work through the checklist steps
3. Add a signature using the signature pad
4. Generate and download the PDF report

**Option 2 — Run locally:**
1. Clone the repo
2. Open `index.html` directly in your browser — no server needed
3. All features work offline including PDF generation

---

## Roadmap

- [ ] Cloud sync for completed audit reports
- [ ] Admin dashboard to review past audits
- [ ] Multi-language support (EN / GR)
- [ ] Photo attachment per checklist item
- [ ] Email delivery of PDF report on completion

---

## Author

**Xenofon Lianos** — Marketing Professional & AI-Assisted Builder

Built as part of my automation portfolio for everyday use at GB Experts, combining marketing thinking with technical execution. This app replaced a paper-based process and is now in active daily use by the company's barista team.

[![GitHub](https://img.shields.io/badge/GitHub-XenLian78-181717?style=flat-square&logo=github)](https://github.com/XenLian78)
[![Portfolio](https://img.shields.io/badge/Portfolio-xenlian78.github.io-4f8ef7?style=flat-square)](https://xenlian78.github.io)

