export const PDF_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');

:root {
  --cream: #ede4d3;
  --cream-dim: #d6c8b0;
  --ink: #2b1d12;
  --ink-soft: #5e4a35;
  --terracotta: #b3441e;
  --terracotta-dim: #8a3315;
  --rule: rgba(43, 29, 18, 0.12);
}

* { box-sizing: border-box; }

@page {
  size: A4;
  margin: 22mm 16mm 18mm 16mm;
}

html, body {
  margin: 0;
  padding: 0;
  background: var(--cream);
  color: var(--ink);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10.5pt;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

.serif {
  font-family: 'Instrument Serif', Georgia, serif;
  font-weight: 400;
}

.italic { font-style: italic; }

.wordmark {
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  letter-spacing: -0.01em;
}

.cover {
  page-break-after: always;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
  padding-top: 24mm;
}

.cover h1 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 44pt;
  line-height: 1.05;
  margin: 24mm 0 8mm 0;
  letter-spacing: -0.01em;
}

.cover h1 em {
  color: var(--terracotta);
  font-style: italic;
}

.cover .meta {
  color: var(--ink-soft);
  font-size: 11pt;
  margin-top: 8mm;
}

section {
  page-break-inside: avoid;
  margin-bottom: 14mm;
}

section.page-break { page-break-before: always; }

h2.section-title {
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-size: 24pt;
  letter-spacing: -0.01em;
  margin: 0 0 4mm 0;
  color: var(--ink);
}

h2.section-title .num {
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-size: 9pt;
  color: var(--ink-soft);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-right: 6mm;
  vertical-align: middle;
}

p.lede {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 14pt;
  line-height: 1.45;
  color: var(--ink);
  max-width: 130mm;
}

p { margin: 0 0 3mm 0; }

.body-prose {
  max-width: 140mm;
  color: var(--ink);
}

.body-prose p { margin-bottom: 3mm; }

.kpi-row {
  display: flex;
  gap: 8mm;
  margin: 6mm 0 8mm 0;
}

.kpi {
  flex: 1;
  border-top: 1px solid var(--rule);
  padding-top: 3mm;
}

.kpi .label {
  font-size: 8.5pt;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.kpi .value {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 22pt;
  letter-spacing: -0.01em;
  margin-top: 1mm;
}

.cat-bar {
  display: grid;
  grid-template-columns: 50mm 1fr 28mm;
  align-items: center;
  gap: 4mm;
  padding: 2.5mm 0;
  border-bottom: 1px solid var(--rule);
}

.cat-bar:last-child { border-bottom: 0; }

.cat-bar .name {
  font-size: 10pt;
  color: var(--ink);
}

.cat-bar .track {
  height: 3mm;
  background: rgba(43, 29, 18, 0.06);
  border-radius: 100px;
  overflow: hidden;
  position: relative;
}

.cat-bar .fill {
  height: 100%;
  background: var(--terracotta);
  border-radius: 100px;
}

.cat-bar .total {
  font-variant-numeric: tabular-nums;
  text-align: right;
  font-size: 10pt;
  color: var(--ink);
}

.recurring-card {
  border: 1px solid var(--rule);
  border-radius: 4mm;
  padding: 4mm 5mm;
  margin-bottom: 3mm;
}

.recurring-card .head {
  display: flex;
  justify-content: space-between;
  font-size: 10.5pt;
}

.recurring-card .meta {
  margin-top: 1.5mm;
  font-size: 9pt;
  color: var(--ink-soft);
}

.recurring-card.dormant { border-color: var(--terracotta); }
.recurring-card.dormant .badge,
.recurring-card.increasing .badge {
  font-size: 8pt;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--terracotta);
}

.recommendations { counter-reset: rec; }
.recommendations li {
  list-style: none;
  position: relative;
  padding-left: 12mm;
  margin-bottom: 5mm;
}
.recommendations li::before {
  counter-increment: rec;
  content: counter(rec, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 0;
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-size: 14pt;
  color: var(--terracotta);
}

footer.report-footer {
  margin-top: 18mm;
  padding-top: 4mm;
  border-top: 1px solid var(--rule);
  color: var(--ink-soft);
  font-size: 8.5pt;
}
`;
