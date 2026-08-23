# FauxData

> Define a schema visually and generate realistic fake rows as JSON, CSV, or SQL.

**[Live demo](https://su-fauxdata.vercel.app)**

Seeding a database or filling a UI mockup usually means writing a throwaway script or pasting the same three placeholder names everywhere. FauxData lets you name your fields, pick a type for each, and generate up to 1000 rows. Values within a row are correlated — the generated email and username are derived from that row's first and last name, so the data holds up when it lands in a table. Everything runs in the browser; nothing is uploaded.

## Features

- 23 field types: UUID, names, email, username, phone, city, country, company, job title, product, category, status, integer, price, boolean, date, URL, IP address, hex color, and lorem text
- Four schema presets (Users, Products, Orders, Companies) as starting points
- Add, rename, retype, and delete fields in a visual schema builder
- Generate 1–1000 rows, previewed in a live table (first 100 shown, exports include all)
- Export as JSON, CSV (with quote escaping), or SQL — the SQL output includes a `CREATE TABLE` statement with a per-type column definition plus `INSERT` rows
- Copy to clipboard or download the generated file

## Stack

- React 19
- Vite
- No external data or faker library — the seed lists and generators are defined in-app

## Running locally

```bash
npm install
npm run dev
```

---

Part of a series of 91 small web apps. [Browse them all](https://su-slopmachine.vercel.app).
