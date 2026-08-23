# 🎲 FauxData — Mock Data Generator

Generate realistic mock data instantly, right in your browser. No signup, no uploads, no backend.

**Live:** https://su-fauxdata.vercel.app

## Features

- **Visual schema builder** — name your fields, pick from 20+ data types (names, emails, UUIDs, phones, cities, companies, prices, dates, IPs, hex colors, lorem...)
- **Coherent rows** — a row's email and username match its generated name
- **Presets** — Users, Products, Orders, Companies — one click to a sensible schema
- **Up to 1,000 rows** per generation
- **Export as JSON, CSV, or SQL** — the SQL export includes a `CREATE TABLE` with proper column types plus all `INSERT` statements
- **Privacy-first** — 100% client-side, nothing ever leaves your browser

## Stack

Vite + React. No dependencies beyond React itself — all data generation is pure JS.

## Run locally

```bash
npm install
npm run dev
```

---

Part of [The Slop Machine](https://su-slopmachine.vercel.app) — a continuous startup idea factory.
