import React from 'react';
import { formatPct } from '../format.js';
import type { Report } from '@lume/ai';
import type { Category } from '@lume/shared';
import { Section } from './Section.js';

const LABELS: Record<Category, string> = {
  moradia: 'Moradia',
  mercado: 'Mercado',
  restaurante: 'Restaurante',
  transporte: 'Transporte',
  saude: 'Saúde',
  educacao: 'Educação',
  lazer_e_hobby: 'Lazer e hobby',
  compras: 'Compras',
  assinaturas_e_servicos: 'Assinaturas e serviços',
  transferencias_e_outros: 'Transferências e outros',
};

type Props = { report: Report; number: string };

export function SectionBenchmark({ report, number }: Props) {
  if (!report.benchmark) return null;

  const total = report.totalSpentCents || 1;
  const yoursPct = (cat: Category) => (report.categories[cat] ?? 0) / total;

  const rows = (Object.keys(LABELS) as Category[])
    .map((cat) => ({
      cat,
      yours: yoursPct(cat),
      bench: report.benchmark!.byCategoryPct[cat] ?? 0,
    }))
    .filter((r) => r.yours > 0 || r.bench > 0);

  const maxPct = rows.reduce(
    (m, r) => Math.max(m, r.yours, r.bench),
    0.05,
  );
  const axisMax = Math.min(1, Math.ceil(maxPct * 20) / 20 + 0.05);

  const leadIdx = rows.reduce((best, r, i) => {
    const cur = Math.abs(r.yours - r.bench);
    const prev = rows[best];
    const prevDiff = prev ? Math.abs(prev.yours - prev.bench) : 0;
    return cur > prevDiff ? i : best;
  }, 0);

  return (
    <Section number={number} title="Comparativo com sua faixa" pageBreak>
      <div className="body-prose" style={{ marginBottom: '6mm' }}>
        <p>{report.narrative.benchmark}</p>
      </div>

      <div>
        {rows.map((r, i) => {
          const yLeft = (r.yours / axisMax) * 100;
          const bLeft = (r.bench / axisMax) * 100;
          const spanLeft = Math.min(yLeft, bLeft);
          const spanWidth = Math.abs(yLeft - bLeft);
          const isLead = i === leadIdx && spanWidth > 0;
          return (
            <div key={r.cat} className="dumbbell-row">
              <div className="name">{LABELS[r.cat]}</div>
              <div className="track">
                <div className="axis" />
                <div
                  className="span"
                  style={{ left: `${spanLeft}%`, width: `${spanWidth}%` }}
                />
                <div
                  className="marker bench"
                  style={{ left: `${bLeft}%` }}
                  aria-hidden="true"
                />
                <div
                  className={`marker you${isLead ? ' lead' : ''}`}
                  style={{ left: `${yLeft}%` }}
                  aria-hidden="true"
                />
              </div>
              <div className="pcts">
                <span className="you-val">{formatPct(r.yours)}</span>
                <span className="bench-val">média {formatPct(r.bench)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dumbbell-legend">
        <span>
          <span className="swatch you" /> você
        </span>
        <span>
          <span className="swatch bench" /> média da faixa
        </span>
      </div>

      <p className="note">Fonte: {report.benchmark.reference}.</p>
    </Section>
  );
}
