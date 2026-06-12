import { useState, useMemo } from 'react'

// ---------- seed data ----------
const FIRST = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'Sofia', 'Mateo', 'Valentina', 'Lucas', 'Camila', 'Diego', 'Lucia', 'Hiroshi', 'Yuki', 'Wei', 'Mei', 'Ahmed', 'Fatima', 'Omar', 'Aisha', 'Pierre', 'Claire', 'Hans', 'Greta', 'Ivan', 'Olga', 'Carlos', 'Ana', 'Pedro', 'Marta', 'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan']
const LAST = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Tanaka', 'Suzuki', 'Chen', 'Wang', 'Kim', 'Park', 'Ali', 'Khan', 'Dubois', 'Martin', 'Müller', 'Schmidt', 'Ivanov', 'Petrov', 'Silva', 'Santos', 'Costa', 'Pereira', "O'Brien", 'Murphy', 'Kelly', 'Nguyen', 'Tran', 'Cohen', 'Levi']
const CITIES = ['New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Madrid', 'Rome', 'Amsterdam', 'Toronto', 'Sydney', 'Singapore', 'Dubai', 'Mumbai', 'São Paulo', 'Buenos Aires', 'Montevideo', 'Mexico City', 'Seoul', 'Bangkok', 'Lisbon', 'Vienna', 'Prague', 'Dublin', 'Stockholm', 'Oslo', 'Copenhagen', 'Zurich', 'Barcelona', 'Milan', 'Munich']
const COUNTRIES = ['United States', 'United Kingdom', 'Japan', 'France', 'Germany', 'Spain', 'Italy', 'Netherlands', 'Canada', 'Australia', 'Singapore', 'UAE', 'India', 'Brazil', 'Argentina', 'Uruguay', 'Mexico', 'South Korea', 'Thailand', 'Portugal', 'Austria', 'Czechia', 'Ireland', 'Sweden', 'Norway', 'Denmark', 'Switzerland']
const COMPANY_A = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Stark', 'Wayne', 'Hooli', 'Vandelay', 'Cyberdyne', 'Aperture', 'Nimbus', 'Quantum', 'Vertex', 'Apex', 'Zenith', 'Pinnacle', 'Atlas', 'Orion', 'Nova', 'Helix']
const COMPANY_B = ['Industries', 'Corp', 'LLC', 'Labs', 'Systems', 'Solutions', 'Technologies', 'Group', 'Dynamics', 'Ventures', 'Digital', 'Software', 'Analytics', 'Logistics', 'Media']
const JOBS = ['Software Engineer', 'Product Manager', 'Data Analyst', 'Designer', 'Marketing Manager', 'Sales Rep', 'DevOps Engineer', 'CTO', 'CEO', 'Accountant', 'HR Manager', 'Support Specialist', 'QA Engineer', 'Data Scientist', 'Backend Developer', 'Frontend Developer', 'Project Manager', 'Business Analyst', 'Copywriter', 'Recruiter']
const PRODUCTS_A = ['Ergonomic', 'Wireless', 'Smart', 'Portable', 'Premium', 'Compact', 'Ultra', 'Eco', 'Pro', 'Mini', 'Heavy-Duty', 'Foldable', 'Magnetic', 'Solar', 'Vintage']
const PRODUCTS_B = ['Keyboard', 'Desk Lamp', 'Water Bottle', 'Backpack', 'Headphones', 'Notebook', 'Charger', 'Speaker', 'Mouse', 'Stand', 'Organizer', 'Mug', 'Chair', 'Monitor', 'Camera']
const LOREM = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat'.split(' ')
const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'proton.me', 'icloud.com', 'fastmail.com']
const TLDS = ['com', 'io', 'dev', 'app', 'net', 'co']
const CATEGORIES = ['Electronics', 'Home & Kitchen', 'Office', 'Outdoors', 'Toys', 'Beauty', 'Sports', 'Books', 'Clothing', 'Garden']
const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

// ---------- random helpers ----------
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const rint = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '')

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function randomDate(daysBack = 730) {
  const d = new Date(Date.now() - rint(0, daysBack * 24 * 60 * 60 * 1000))
  return d.toISOString().slice(0, 10)
}

// Each generator receives ctx (per-row shared state) so email/username match the row's name
const TYPES = {
  'Row #': { gen: (ctx) => ctx.index + 1, sql: 'INTEGER' },
  'UUID': { gen: () => uuid(), sql: 'UUID' },
  'First Name': { gen: (ctx) => ctx.first, sql: 'VARCHAR(50)' },
  'Last Name': { gen: (ctx) => ctx.last, sql: 'VARCHAR(50)' },
  'Full Name': { gen: (ctx) => `${ctx.first} ${ctx.last}`, sql: 'VARCHAR(100)' },
  'Email': { gen: (ctx) => `${slug(ctx.first)}.${slug(ctx.last)}${rint(1, 99)}@${pick(DOMAINS)}`, sql: 'VARCHAR(120)' },
  'Username': { gen: (ctx) => `${slug(ctx.first)}_${slug(ctx.last)}${rint(1, 999)}`, sql: 'VARCHAR(50)' },
  'Phone': { gen: () => `+1 (${rint(200, 989)}) ${rint(200, 999)}-${String(rint(0, 9999)).padStart(4, '0')}`, sql: 'VARCHAR(25)' },
  'City': { gen: () => pick(CITIES), sql: 'VARCHAR(60)' },
  'Country': { gen: () => pick(COUNTRIES), sql: 'VARCHAR(60)' },
  'Company': { gen: () => `${pick(COMPANY_A)} ${pick(COMPANY_B)}`, sql: 'VARCHAR(80)' },
  'Job Title': { gen: () => pick(JOBS), sql: 'VARCHAR(60)' },
  'Product Name': { gen: () => `${pick(PRODUCTS_A)} ${pick(PRODUCTS_B)}`, sql: 'VARCHAR(80)' },
  'Category': { gen: () => pick(CATEGORIES), sql: 'VARCHAR(40)' },
  'Status': { gen: () => pick(STATUSES), sql: 'VARCHAR(20)' },
  'Integer (1-1000)': { gen: () => rint(1, 1000), sql: 'INTEGER' },
  'Price ($)': { gen: () => +(rint(199, 49999) / 100).toFixed(2), sql: 'DECIMAL(10,2)' },
  'Boolean': { gen: () => Math.random() > 0.5, sql: 'BOOLEAN' },
  'Date (past 2y)': { gen: () => randomDate(), sql: 'DATE' },
  'URL': { gen: () => `https://www.${slug(pick(COMPANY_A))}${slug(pick(COMPANY_B))}.${pick(TLDS)}`, sql: 'VARCHAR(150)' },
  'IP Address': { gen: () => `${rint(1, 254)}.${rint(0, 255)}.${rint(0, 255)}.${rint(1, 254)}`, sql: 'VARCHAR(15)' },
  'Hex Color': { gen: () => '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'), sql: 'VARCHAR(7)' },
  'Lorem Sentence': { gen: () => { const n = rint(6, 12); const w = Array.from({ length: n }, () => pick(LOREM)); return w[0][0].toUpperCase() + w.join(' ').slice(1) + '.' }, sql: 'TEXT' },
}
const TYPE_NAMES = Object.keys(TYPES)

const PRESETS = {
  Users: [
    { name: 'id', type: 'UUID' },
    { name: 'full_name', type: 'Full Name' },
    { name: 'email', type: 'Email' },
    { name: 'phone', type: 'Phone' },
    { name: 'city', type: 'City' },
    { name: 'is_active', type: 'Boolean' },
    { name: 'created_at', type: 'Date (past 2y)' },
  ],
  Products: [
    { name: 'id', type: 'Row #' },
    { name: 'product', type: 'Product Name' },
    { name: 'category', type: 'Category' },
    { name: 'price', type: 'Price ($)' },
    { name: 'in_stock', type: 'Boolean' },
    { name: 'color', type: 'Hex Color' },
  ],
  Orders: [
    { name: 'order_id', type: 'UUID' },
    { name: 'customer', type: 'Full Name' },
    { name: 'product', type: 'Product Name' },
    { name: 'amount', type: 'Price ($)' },
    { name: 'status', type: 'Status' },
    { name: 'order_date', type: 'Date (past 2y)' },
  ],
  Companies: [
    { name: 'id', type: 'Row #' },
    { name: 'company', type: 'Company' },
    { name: 'contact', type: 'Full Name' },
    { name: 'role', type: 'Job Title' },
    { name: 'country', type: 'Country' },
    { name: 'website', type: 'URL' },
  ],
}

// ---------- generation + export ----------
function generateRows(fields, count) {
  return Array.from({ length: count }, (_, index) => {
    const ctx = { index, first: pick(FIRST), last: pick(LAST) }
    const row = {}
    for (const f of fields) {
      if (!f.name.trim()) continue
      row[f.name.trim()] = TYPES[f.type].gen(ctx)
    }
    return row
  })
}

const csvEscape = (v) => {
  const s = String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function toCSV(rows) {
  if (!rows.length) return ''
  const cols = Object.keys(rows[0])
  return [cols.map(csvEscape).join(','), ...rows.map((r) => cols.map((c) => csvEscape(r[c])).join(','))].join('\n')
}

const sqlVal = (v) => {
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE'
  return `'${String(v).replace(/'/g, "''")}'`
}

function toSQL(rows, fields, table) {
  if (!rows.length) return ''
  const cols = Object.keys(rows[0])
  const defs = fields.filter((f) => f.name.trim()).map((f) => `  ${f.name.trim()} ${TYPES[f.type].sql}`)
  const create = `CREATE TABLE ${table} (\n${defs.join(',\n')}\n);\n\n`
  const inserts = rows.map((r) => `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map((c) => sqlVal(r[c])).join(', ')});`)
  return create + inserts.join('\n')
}

// ---------- component ----------
let fieldKey = 100
export default function App() {
  const [fields, setFields] = useState(PRESETS.Users.map((f) => ({ ...f, key: fieldKey++ })))
  const [count, setCount] = useState(25)
  const [table, setTable] = useState('users')
  const [rows, setRows] = useState(() => generateRows(PRESETS.Users, 25))
  const [tab, setTab] = useState('table')
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    if (tab === 'json') return JSON.stringify(rows, null, 2)
    if (tab === 'csv') return toCSV(rows)
    if (tab === 'sql') return toSQL(rows, fields, table || 'my_table')
    return ''
  }, [tab, rows, fields, table])

  const loadPreset = (name) => {
    setFields(PRESETS[name].map((f) => ({ ...f, key: fieldKey++ })))
    setTable(name.toLowerCase())
    setRows(generateRows(PRESETS[name], count))
  }

  const updateField = (key, patch) =>
    setFields((fs) => fs.map((f) => (f.key === key ? { ...f, ...patch } : f)))

  const generate = () => {
    const clamped = Math.min(1000, Math.max(1, count))
    setCount(clamped)
    setRows(generateRows(fields, clamped))
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    const ext = tab === 'json' ? 'json' : tab === 'csv' ? 'csv' : 'sql'
    const mime = tab === 'json' ? 'application/json' : 'text/plain'
    const blob = new Blob([output], { type: mime })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `fauxdata-${table || 'export'}.${ext}`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const cols = rows.length ? Object.keys(rows[0]) : []

  return (
    <div className="app">
      <header>
        <h1>🎲 FauxData</h1>
        <p className="tagline">Realistic mock data in one click — JSON, CSV &amp; SQL</p>
        <span className="badge">🔒 100% in your browser — nothing is uploaded</span>
      </header>

      <main>
        <aside className="panel schema">
          <div className="presets">
            {Object.keys(PRESETS).map((p) => (
              <button key={p} className="chip" onClick={() => loadPreset(p)}>{p}</button>
            ))}
          </div>

          <div className="fields">
            <div className="field-head"><span>Field name</span><span>Type</span><span /></div>
            {fields.map((f) => (
              <div className="field-row" key={f.key}>
                <input value={f.name} onChange={(e) => updateField(f.key, { name: e.target.value })} placeholder="field_name" />
                <select value={f.type} onChange={(e) => updateField(f.key, { type: e.target.value })}>
                  {TYPE_NAMES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <button className="del" title="Remove field" onClick={() => setFields((fs) => fs.filter((x) => x.key !== f.key))}>×</button>
              </div>
            ))}
            <button className="add" onClick={() => setFields((fs) => [...fs, { key: fieldKey++, name: `field_${fs.length + 1}`, type: 'Lorem Sentence' }])}>+ Add field</button>
          </div>

          <div className="controls">
            <label>
              Rows
              <input type="number" min="1" max="1000" value={count} onChange={(e) => setCount(+e.target.value || 1)} />
            </label>
            <label>
              SQL table
              <input value={table} onChange={(e) => setTable(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} />
            </label>
          </div>

          <button className="generate" onClick={generate} disabled={!fields.some((f) => f.name.trim())}>
            ⚡ Generate {Math.min(1000, Math.max(1, count))} rows
          </button>
        </aside>

        <section className="panel output">
          <div className="output-bar">
            <div className="tabs">
              {['table', 'json', 'csv', 'sql'].map((t) => (
                <button key={t} className={tab === t ? 'tab active' : 'tab'} onClick={() => setTab(t)}>{t.toUpperCase()}</button>
              ))}
            </div>
            {tab !== 'table' && (
              <div className="actions">
                <button onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
                <button onClick={download}>Download</button>
              </div>
            )}
          </div>

          {tab === 'table' ? (
            <div className="table-wrap">
              <table>
                <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                <tbody>
                  {rows.slice(0, 100).map((r, i) => (
                    <tr key={i}>{cols.map((c) => <td key={c}>{String(r[c])}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 100 && <p className="more">Showing first 100 of {rows.length} rows — exports include all.</p>}
            </div>
          ) : (
            <pre>{output}</pre>
          )}
        </section>
      </main>

      <footer>
        Part of <a href="https://00slopmachine.vercel.app" target="_blank" rel="noreferrer">The Slop Machine</a> ·
        More dev tools: <a href="https://67envdiff.vercel.app" target="_blank" rel="noreferrer">EnvDiff</a> · <a href="https://11jsonformatter.vercel.app" target="_blank" rel="noreferrer">JSON Formatter</a> · <a href="https://71dataconverter.vercel.app" target="_blank" rel="noreferrer">DataMorph</a>
      </footer>
    </div>
  )
}
