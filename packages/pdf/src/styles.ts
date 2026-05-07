export const PDF_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap');

:root {
  --bg:            #ffffff;
  --surface:       #ffffff;
  --surface-sunk:  oklch(0.965 0.004 220);

  --ink:           oklch(0.140 0.008 220);
  --ink-2:         oklch(0.420 0.006 220);
  --ink-3:         oklch(0.600 0.005 220);
  --ink-inverse:   oklch(0.985 0.003 220);

  --accent:        oklch(0.860 0.210 130);
  --accent-deep:   oklch(0.300 0.090 130);
  --accent-soft:   oklch(0.960 0.060 130);
  --accent-edge:   oklch(0.760 0.180 130);

  --border:        oklch(0.920 0.005 220);
  --border-strong: oklch(0.850 0.006 220);
}

* { box-sizing: border-box; }

@page {
  size: A4;
  margin: 22mm 18mm 20mm 18mm;
}

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Geist', system-ui, sans-serif;
  font-size: 10.5pt;
  line-height: 1.55;
  letter-spacing: -0.010em;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01", "tnum";
}

main {
  position: relative;
}

.mono {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-feature-settings: "tnum";
  letter-spacing: -0.005em;
}

.eyebrow {
  font-family: 'Geist', sans-serif;
  font-size: 8.5pt;
  font-weight: 500;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--ink-3);
}

/* ---------- Wordmark ---------- */

.wordmark {
  font-family: 'Geist', sans-serif;
  font-weight: 600;
  letter-spacing: -0.045em;
  color: var(--ink);
  display: inline-flex;
  align-items: baseline;
  gap: 2.5mm;
  line-height: 1;
}

.wordmark .pulse {
  display: inline-block;
  width: 2.4mm;
  height: 2.4mm;
  background: var(--accent);
  border-radius: 0.6mm;
}

/* ---------- Cover ---------- */

.cover {
  page-break-after: always;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 250mm;
  padding-top: 6mm;
}

.cover .top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  padding-bottom: 6mm;
}

.cover .top .period {
  font-size: 9.5pt;
  letter-spacing: 0.04em;
  color: var(--ink-2);
}

.cover .display {
  margin-top: 28mm;
}

.cover .display .label {
  font-size: 9pt;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 8mm;
  display: block;
}

.cover .display h1 {
  font-family: 'Geist', sans-serif;
  font-size: 64pt;
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 0.95;
  margin: 0;
  color: var(--ink);
}

.cover .display h1 .accent-dot {
  display: inline-block;
  width: 4.5mm;
  height: 4.5mm;
  background: var(--accent);
  border-radius: 1mm;
  margin-left: 2mm;
  vertical-align: 0.6em;
}

.cover .subtitle {
  margin-top: 18mm;
  max-width: 130mm;
  font-size: 14pt;
  font-weight: 400;
  letter-spacing: -0.018em;
  line-height: 1.35;
  color: var(--ink-2);
}

.cover .subtitle b {
  color: var(--ink);
  font-weight: 500;
}

.cover .footnote {
  margin-top: auto;
  padding-top: 30mm;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12mm;
  border-top: 1px solid var(--border);
  padding-top: 6mm;
}

.cover .footnote .privacy {
  max-width: 110mm;
  font-size: 9pt;
  color: var(--ink-3);
  line-height: 1.5;
}

.cover .footnote .stamp {
  font-size: 8.5pt;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--ink-3);
  text-align: right;
}

.cover .footnote .stamp b {
  color: var(--ink);
  font-weight: 500;
}

/* ---------- Sections ---------- */

section {
  margin-bottom: 22mm;
  page-break-inside: avoid;
}

section.page-break { page-break-before: always; padding-top: 4mm; }

.section-head {
  display: flex;
  align-items: baseline;
  gap: 8mm;
  margin: 0 0 8mm 0;
  border-bottom: 1px solid var(--border);
  padding-bottom: 5mm;
}

.section-head .num {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11pt;
  font-weight: 500;
  color: var(--ink-3);
  letter-spacing: 0;
  flex-shrink: 0;
  min-width: 14mm;
}

.section-head .num .dash {
  color: var(--border-strong);
  margin: 0 1.5mm;
}

.section-head h2 {
  font-family: 'Geist', sans-serif;
  font-size: 22pt;
  font-weight: 600;
  letter-spacing: -0.030em;
  line-height: 1.05;
  margin: 0;
  color: var(--ink);
}

p { margin: 0 0 3mm 0; }

p.lede {
  font-size: 13.5pt;
  line-height: 1.45;
  letter-spacing: -0.018em;
  color: var(--ink);
  font-weight: 400;
  max-width: 140mm;
  margin-bottom: 6mm;
}

.body-prose {
  max-width: 145mm;
  color: var(--ink-2);
  font-size: 10.5pt;
  line-height: 1.6;
}

.body-prose p { margin-bottom: 3mm; }

.note {
  font-size: 9pt;
  color: var(--ink-3);
  line-height: 1.5;
  margin-top: 4mm;
}

.empty {
  font-size: 10.5pt;
  color: var(--ink-3);
  padding: 6mm 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

/* ---------- KPIs ---------- */

.kpi-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  margin: 10mm 0 4mm 0;
}

.kpi {
  border-top: 1px solid var(--ink);
  padding: 4mm 6mm 0 0;
  position: relative;
}

.kpi + .kpi {
  border-top: 1px solid var(--ink);
  border-left: 1px solid var(--border);
  padding-left: 6mm;
}

.kpi .label {
  font-size: 8.5pt;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.kpi .value {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 22pt;
  font-weight: 500;
  letter-spacing: -0.020em;
  margin-top: 4mm;
  color: var(--ink);
  line-height: 1.05;
}

.kpi .delta {
  margin-top: 2mm;
  font-size: 9pt;
  color: var(--ink-3);
  font-family: 'Geist Mono', ui-monospace, monospace;
}

/* ---------- Summary lede + flow + highlights ---------- */

p.lede.lede-large {
  font-size: 16pt;
  line-height: 1.4;
  letter-spacing: -0.022em;
  color: var(--ink);
  font-weight: 400;
  max-width: 150mm;
  text-wrap: balance;
  margin-bottom: 14mm;
}

.flow {
  margin: 0 0 16mm 0;
}

.flow-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12mm;
  border-top: 1px solid var(--ink);
  padding-top: 5mm;
}

.flow-side {
  display: flex;
  flex-direction: column;
}

.flow-side .eyebrow {
  font-size: 8.5pt;
  color: var(--ink-3);
  margin-bottom: 3mm;
}

.flow-amt {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 24pt;
  font-weight: 500;
  letter-spacing: -0.024em;
  color: var(--ink);
  line-height: 1;
  white-space: nowrap;
  margin-bottom: 4.5mm;
}

.flow-bar {
  height: 2.4mm;
  border-radius: 0.4mm;
  display: block;
}

.flow-bar-in {
  background: var(--accent);
}

.flow-bar-out {
  background: var(--ink);
}

.flow-balance {
  margin-top: 8mm;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 5mm 6mm;
  border: 1px solid var(--border);
  border-radius: 2mm;
  background: var(--surface-sunk);
}

.flow-balance.is-positive {
  background: var(--accent-soft);
  border-color: var(--accent-edge);
}

.flow-balance-label {
  font-size: 9pt;
  color: var(--ink-2);
}

.flow-balance.is-positive .flow-balance-label {
  color: var(--accent-deep);
}

.flow-balance-amt {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 16pt;
  font-weight: 500;
  letter-spacing: -0.020em;
  color: var(--ink);
  white-space: nowrap;
}

.flow-balance.is-positive .flow-balance-amt {
  color: var(--accent-deep);
}

.highlights {
  margin-top: 10mm;
}

.highlights-title {
  font-size: 8.5pt;
  color: var(--ink-3);
  display: block;
  margin-bottom: 4mm;
  padding-bottom: 3mm;
  border-bottom: 1px solid var(--border);
}

.highlights-list {
  margin: 0;
  padding: 0;
}

.hl-row {
  display: grid;
  grid-template-columns: 44mm 1fr 32mm 26mm;
  align-items: baseline;
  gap: 6mm;
  padding: 4.5mm 0;
  border-bottom: 1px solid var(--border);
}

.hl-row:last-child { border-bottom: 0; }

.hl-row dt {
  font-size: 9pt;
  font-weight: 500;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin: 0;
}

.hl-row dd {
  margin: 0;
}

.hl-row .hl-name {
  font-size: 11pt;
  color: var(--ink);
  letter-spacing: -0.012em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hl-row .hl-amt {
  font-size: 11pt;
  color: var(--ink);
  text-align: right;
  font-weight: 500;
  letter-spacing: -0.010em;
  white-space: nowrap;
}

.hl-row .hl-share {
  font-size: 9.5pt;
  color: var(--ink-3);
  text-align: right;
  white-space: nowrap;
}

/* ---------- Category bars ---------- */

.bars {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 4mm;
}

.bar-row {
  display: grid;
  grid-template-columns: 56mm 1fr 30mm;
  align-items: center;
  gap: 6mm;
  padding: 3.5mm 0;
  border-bottom: 1px solid var(--border);
}

.bar-row:last-child { border-bottom: 0; }

.bar-row .name {
  font-size: 10.5pt;
  color: var(--ink);
  font-weight: 400;
  letter-spacing: -0.010em;
}

.bar-row .track {
  position: relative;
  height: 1.6mm;
  background: var(--surface-sunk);
  border-radius: 0;
}

.bar-row .fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--ink);
  border-radius: 0;
}

.bar-row .lead-dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 2.4mm;
  height: 2.4mm;
  background: var(--accent);
  border-radius: 50%;
  z-index: 2;
}

.bar-row .total {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-feature-settings: "tnum";
  text-align: right;
  font-size: 10pt;
  color: var(--ink);
  letter-spacing: -0.005em;
}

.bar-row .total .delta {
  color: var(--ink-3);
  margin-left: 1.5mm;
  font-size: 9pt;
}

/* ---------- Category item lists (inline detail under bars) ---------- */

.bar-row.with-items {
  display: block;
  padding: 4mm 0 0 0;
  border-bottom: 1px solid var(--border);
}

.bar-row.with-items:last-child { border-bottom: 0; }

.bar-row.with-items .bar-line {
  display: grid;
  grid-template-columns: 56mm 1fr 30mm;
  align-items: center;
  gap: 6mm;
  padding-bottom: 2mm;
}

.bar-row.with-items .items {
  margin: 1mm 0 4mm 56mm;
  padding-left: 6mm;
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}

.bar-row.with-items .item {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  gap: 6mm;
  padding: 1.5mm 0;
  font-size: 9.5pt;
  line-height: 1.35;
}

.bar-row.with-items .item .desc {
  color: var(--ink-2);
  letter-spacing: -0.005em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-row.with-items .item .desc .occ {
  color: var(--ink-3);
  margin-left: 1.5mm;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 8.5pt;
}

.bar-row.with-items .item .amt {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-feature-settings: "tnum";
  font-size: 9.5pt;
  color: var(--ink-2);
  text-align: right;
  letter-spacing: -0.005em;
}

.bar-row.with-items .item .amt .pct {
  color: var(--ink-3);
  margin-left: 1.5mm;
  font-size: 8.5pt;
}

/* ---------- Income list (section 02) ---------- */

.income-list {
  margin-top: 4mm;
  display: flex;
  flex-direction: column;
}

.income-row {
  display: grid;
  grid-template-columns: 1fr 26mm 36mm;
  align-items: baseline;
  gap: 6mm;
  padding: 4mm 0;
  border-bottom: 1px solid var(--border);
}

.income-row:last-child {
  border-bottom: 1px solid var(--ink);
}

.income-row .name {
  font-size: 11pt;
  color: var(--ink);
  letter-spacing: -0.012em;
}

.income-row .occ {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 9pt;
  color: var(--ink-3);
  text-align: right;
}

.income-row .amt {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-feature-settings: "tnum";
  font-size: 11pt;
  color: var(--ink);
  text-align: right;
  letter-spacing: -0.005em;
}

.income-total {
  display: grid;
  grid-template-columns: 1fr 26mm 36mm;
  gap: 6mm;
  padding: 4mm 0 0 0;
  align-items: baseline;
}

.income-total .label {
  font-size: 8.5pt;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.income-total .amt {
  grid-column: 3;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-feature-settings: "tnum";
  font-size: 14pt;
  font-weight: 500;
  color: var(--ink);
  text-align: right;
  letter-spacing: -0.010em;
}

/* ---------- Scale ruler (section 02) ---------- */

.scale-ruler {
  display: grid;
  grid-template-columns: 56mm 1fr 30mm;
  gap: 6mm;
  margin-top: 3mm;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 8pt;
  color: var(--ink-3);
}

.scale-ruler .axis {
  position: relative;
  height: 4mm;
}

.scale-ruler .tick {
  position: absolute;
  top: 0;
  width: 1px;
  height: 1.5mm;
  background: var(--border-strong);
}

.scale-ruler .tick-label {
  position: absolute;
  top: 2mm;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 7.5pt;
}

/* ---------- Recurring cards ---------- */

.recurring-list {
  display: flex;
  flex-direction: column;
  gap: 3mm;
  margin-top: 4mm;
}

.recurring-card {
  border: 1px solid var(--border);
  border-radius: 4mm;
  padding: 5mm 6mm;
  background: var(--surface);
}

.recurring-card .head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 6mm;
}

.recurring-card .desc {
  font-size: 11pt;
  font-weight: 500;
  color: var(--ink);
  letter-spacing: -0.014em;
}

.recurring-card .amount {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11pt;
  font-weight: 500;
  color: var(--ink);
}

.recurring-card .meta {
  margin-top: 3mm;
  display: flex;
  align-items: center;
  gap: 4mm;
  font-size: 9pt;
  color: var(--ink-3);
  font-family: 'Geist Mono', ui-monospace, monospace;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 1.5mm;
  padding: 1mm 2.5mm;
  font-family: 'Geist', sans-serif;
  font-size: 8pt;
  font-weight: 500;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  border-radius: 1.5mm;
  background: var(--surface-sunk);
  color: var(--ink-2);
}

.badge.dormant {
  background: var(--accent-soft);
  color: var(--accent-deep);
}

.badge.increasing {
  background: var(--accent-soft);
  color: var(--accent-deep);
}

.badge .dot {
  width: 1.4mm;
  height: 1.4mm;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
}

/* ---------- Benchmark dumbbell ---------- */

.dumbbell-row {
  display: grid;
  grid-template-columns: 56mm 1fr 36mm;
  align-items: center;
  gap: 6mm;
  padding: 4mm 0;
  border-bottom: 1px solid var(--border);
}

.dumbbell-row:last-child { border-bottom: 0; }

.dumbbell-row .name {
  font-size: 10.5pt;
  color: var(--ink);
}

.dumbbell-row .track {
  position: relative;
  height: 4mm;
}

.dumbbell-row .axis {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border);
  transform: translateY(-50%);
}

.dumbbell-row .span {
  position: absolute;
  top: 50%;
  height: 1.2px;
  background: var(--ink-2);
  transform: translateY(-50%);
}

.dumbbell-row .marker {
  position: absolute;
  top: 50%;
  width: 2.6mm;
  height: 2.6mm;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.dumbbell-row .marker.bench {
  background: var(--surface);
  border: 1.2px solid var(--ink-2);
}

.dumbbell-row .marker.you {
  background: var(--ink);
}

.dumbbell-row .marker.you.lead {
  background: var(--accent);
  border: 1px solid var(--accent-edge);
}

.dumbbell-row .pcts {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-feature-settings: "tnum";
  font-size: 9.5pt;
  text-align: right;
  color: var(--ink);
  display: flex;
  flex-direction: column;
  gap: 0.5mm;
}

.dumbbell-row .pcts .you-val { color: var(--ink); }
.dumbbell-row .pcts .bench-val { color: var(--ink-3); font-size: 8.5pt; }

.dumbbell-legend {
  display: flex;
  gap: 8mm;
  margin-top: 6mm;
  font-size: 8.5pt;
  color: var(--ink-3);
  font-family: 'Geist', sans-serif;
  letter-spacing: 0.04em;
}

.dumbbell-legend span { display: inline-flex; align-items: center; gap: 2mm; }

.dumbbell-legend .swatch {
  width: 2.6mm;
  height: 2.6mm;
  border-radius: 50%;
  display: inline-block;
}

.dumbbell-legend .swatch.bench {
  background: var(--surface);
  border: 1.2px solid var(--ink-2);
}
.dumbbell-legend .swatch.you { background: var(--ink); }

/* ---------- Recommendations ---------- */

.recommendations {
  list-style: none;
  padding: 0;
  margin: 4mm 0 0 0;
  counter-reset: rec;
}

.recommendations li {
  counter-increment: rec;
  position: relative;
  padding: 5mm 0 5mm 18mm;
  border-bottom: 1px solid var(--border);
  font-size: 11pt;
  line-height: 1.55;
  color: var(--ink);
  letter-spacing: -0.012em;
}

.recommendations li:last-child { border-bottom: 0; }

.recommendations li::before {
  content: counter(rec, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 5mm;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11pt;
  font-weight: 500;
  color: var(--ink-3);
  letter-spacing: 0;
}

/* ---------- Watermark ---------- */

.watermark {
  position: fixed;
  bottom: 8mm;
  right: 18mm;
  font-family: 'Geist', sans-serif;
  font-weight: 600;
  font-size: 8pt;
  letter-spacing: -0.030em;
  color: var(--ink-3);
  opacity: 0.55;
  display: inline-flex;
  align-items: center;
  gap: 1.5mm;
}

.watermark .pulse {
  width: 1.4mm;
  height: 1.4mm;
  background: var(--accent);
  border-radius: 0.4mm;
  display: inline-block;
}

/* ---------- Closing footer ---------- */

footer.report-footer {
  margin-top: 18mm;
  padding-top: 6mm;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 8.5pt;
  color: var(--ink-3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 500;
}

footer.report-footer .version {
  font-family: 'Geist Mono', ui-monospace, monospace;
  letter-spacing: 0;
  text-transform: none;
}
`;
