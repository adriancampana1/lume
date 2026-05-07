import React from 'react';
import { formatBRL, formatPct } from '../format.js';
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

function niceCeil(value: number): number {
  if (value <= 0) return 100;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  if (n <= 1) return 1 * pow;
  if (n <= 2) return 2 * pow;
  if (n <= 5) return 5 * pow;
  return 10 * pow;
}

function rulerCents(centavos: number): string {
  const reais = Math.round(centavos / 100);
  if (reais >= 1000) return `R$ ${(reais / 1000).toFixed(reais % 1000 === 0 ? 0 : 1)}k`;
  return `R$ ${reais}`;
}

export function SectionWhereTheMoneyWent({ report, number }: Props) {
  const sorted = (Object.entries(report.categories) as Array<[Category, number]>)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] ?? 1;
  const total = report.totalSpentCents || 1;
  const axisMax = niceCeil(max);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    pct: f * 100,
    value: rulerCents(axisMax * f),
  }));

  const details = report.categoryDetails ?? ({} as Record<Category, never[]>);

  return (
    <Section number={number} title="Saídas por categoria" pageBreak>
      <div className="body-prose" style={{ marginBottom: '6mm' }}>
        <p>{report.narrative.whereTheMoneyWent}</p>
      </div>
      <div className="bars">
        {sorted.map(([cat, amount], i) => {
          const widthPct = (amount / axisMax) * 100;
          const isLead = i === 0;
          const items = details[cat] ?? [];
          return (
            <div key={cat} className="bar-row with-items">
              <div className="bar-line">
                <div className="name">{LABELS[cat]}</div>
                <div className="track">
                  <div className="fill" style={{ width: `${widthPct}%` }} />
                  {isLead && (
                    <div
                      className="lead-dot"
                      style={{ left: `${widthPct}%` }}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="total">
                  {formatBRL(amount)}
                  <span className="delta">{formatPct(amount / total)}</span>
                </div>
              </div>
              {items.length > 0 && (
                <div className="items">
                  {items.map((it) => (
                    <div key={it.description} className="item">
                      <span className="desc">
                        {it.description}
                        {it.occurrences > 1 && (
                          <span className="occ">×{it.occurrences}</span>
                        )}
                      </span>
                      <span className="amt">
                        {formatBRL(it.totalCents)}
                        <span className="pct">
                          {formatPct(it.totalCents / amount)}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="scale-ruler" aria-hidden="true">
        <div />
        <div className="axis">
          {ticks.map((t) => (
            <React.Fragment key={t.pct}>
              <div className="tick" style={{ left: `${t.pct}%` }} />
              <div className="tick-label" style={{ left: `${t.pct}%` }}>
                {t.value}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div />
      </div>
    </Section>
  );
}
